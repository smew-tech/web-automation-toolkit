import json
import time
from datetime import datetime
from playwright.async_api import async_playwright
from .node import Node
from states.workflow_states import PendingState, RunningState, CompletedState, FailedState

class Workflow:
    """
    Đại diện cho một workflow với khả năng quản lý trạng thái và thực thi đồng thời.
    Áp dụng State Pattern để quản lý vòng đời của workflow.
    """
    
    def __init__(self, name: str, workflow_data: dict, proxy_settings: dict = None):
        self.name = name
        self.proxy_settings = proxy_settings
        self.nodes = {}
        self.start_node_id = None
        self.state = PendingState()
        self.context = {}  # Shared context giữa các nodes
        
        # Metadata
        self.created_at = datetime.now()
        self.last_run_at = None
        self.execution_time = None
        self.error_message = None
        
        # Build workflow graph
        self._build_graph(workflow_data)

    def _build_graph(self, workflow_data: dict):
        """Xây dựng đồ thị các node và kết nối từ dữ liệu JSON."""
        # Tạo tất cả các node
        nodes_data = workflow_data.get('nodes', [])
        if not nodes_data:
            raise ValueError("Workflow phải có ít nhất một node.")
        
        for node_data in nodes_data:
            node = Node(node_data)
            self.nodes[node.id] = node
            
            # Tìm start node
            if node.type == 'start':
                if self.start_node_id:
                    raise ValueError("Workflow chỉ được phép có một Start Node.")
                self.start_node_id = node.id
        
        if not self.start_node_id:
            raise ValueError("Workflow phải có một Start Node.")

        # Thêm các kết nối
        connections = workflow_data.get('connections', [])
        for conn in connections:
            from_node = self.nodes.get(conn['fromNode'])
            if from_node:
                from_port = conn.get('fromPort', 'out')
                to_node_id = conn['toNode']
                from_node.add_connection(from_port, to_node_id)

    def can_run(self) -> bool:
        """Kiểm tra xem workflow có thể chạy không dựa trên trạng thái hiện tại."""
        return self.state.can_run()

    async def run(self):
        """Chạy workflow với Playwright và proxy (nếu có)."""
        if not self.can_run():
            print(f"❌ Không thể chạy workflow '{self.name}' vì trạng thái hiện tại là {self.state}.")
            return False

        # Chuyển sang trạng thái Running
        self.state = self.state.get_next_state(True)
        self.last_run_at = datetime.now()
        start_time = time.time()
        
        # Reset tất cả nodes
        for node in self.nodes.values():
            node.reset()
        
        # Clear context
        self.context.clear()
        
        print(f"🚀 Bắt đầu thực thi workflow: {self.name}")
        
        success = False
        browser = None
        
        try:
            async with async_playwright() as p:
                # Khởi tạo browser với proxy settings nếu có
                launch_options = {
                    'headless': False,  # Đặt là True để chạy ẩn
                    'args': ['--no-sandbox', '--disable-setuid-sandbox']
                }
                
                if self.proxy_settings:
                    launch_options['proxy'] = self.proxy_settings
                
                browser = await p.chromium.launch(**launch_options)
                page = await browser.new_page()

                # Thiết lập user agent nếu có trong proxy settings
                if self.proxy_settings and self.proxy_settings.get('userAgent'):
                    await page.set_extra_http_headers({
                        'User-Agent': self.proxy_settings['userAgent']
                    })

                # Thực thi workflow
                current_node = self.nodes.get(self.start_node_id)
                executed_nodes = set()
                
                while current_node:
                    # Kiểm tra vòng lặp vô tận
                    if current_node.id in executed_nodes and current_node.type != 'forEach':
                        print(f"⚠️ Phát hiện vòng lặp tại node {current_node.id}")
                        break
                    
                    executed_nodes.add(current_node.id)
                    
                    # Thực thi node hiện tại
                    await current_node.execute(page, self.context)
                    
                    # Dừng nếu là stop node
                    if current_node.type == 'stop':
                        break
                    
                    # Tìm node tiếp theo
                    next_node_id = current_node.get_next_node_id()
                    if not next_node_id:
                        print("🏁 Không tìm thấy node tiếp theo, kết thúc workflow.")
                        break
                    
                    current_node = self.nodes.get(next_node_id)
                    if not current_node:
                        print(f"❌ Không tìm thấy node với ID: {next_node_id}")
                        break

                success = True
                print(f"✅ Workflow '{self.name}' hoàn thành thành công!")
                
        except Exception as e:
            self.error_message = str(e)
            print(f"🚨 Lỗi xảy ra khi chạy workflow '{self.name}': {e}")
            success = False
            
        finally:
            if browser:
                await browser.close()
            
            # Cập nhật thời gian thực thi và trạng thái
            self.execution_time = time.time() - start_time
            self.state = self.state.get_next_state(success)
            
            status_emoji = "✅" if success else "❌"
            print(f"{status_emoji} Workflow '{self.name}' kết thúc với trạng thái: {self.state} (Thời gian: {self.execution_time:.2f}s)")

        return success

    def get_summary(self) -> dict:
        """Trả về tóm tắt thông tin của workflow."""
        return {
            'name': self.name,
            'state': str(self.state),
            'node_count': len(self.nodes),
            'created_at': self.created_at.isoformat(),
            'last_run_at': self.last_run_at.isoformat() if self.last_run_at else None,
            'execution_time': self.execution_time,
            'error_message': self.error_message,
            'can_run': self.can_run(),
            'has_proxy': bool(self.proxy_settings)
        }

    def reset(self):
        """Reset workflow về trạng thái ban đầu."""
        self.state = PendingState()
        self.context.clear()
        self.error_message = None
        self.execution_time = None
        for node in self.nodes.values():
            node.reset()
        print(f"🔄 Workflow '{self.name}' đã được reset về trạng thái Pending.")

    def __repr__(self):
        return f"Workflow(name={self.name}, state={self.state}, nodes={len(self.nodes)})"