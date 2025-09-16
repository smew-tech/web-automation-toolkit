from strategies.node_strategies import get_strategy

class Node:
    """
    Đại diện cho một node trong workflow.
    Áp dụng Strategy Pattern để thực thi các hành động khác nhau.
    """
    
    def __init__(self, node_data: dict):
        self.id = node_data['id']
        self.type = node_data['type']
        self.params = node_data.get('params', {})
        self.display_name = node_data.get('displayName', self.id)
        self.x = node_data.get('x', 0)
        self.y = node_data.get('y', 0)
        
        # Áp dụng Strategy Pattern: Gán strategy thực thi dựa trên loại node
        self.strategy = get_strategy(self.type)
        
        # Lưu các kết nối ra khỏi node này
        self.outputs = {}  # key: port_name, value: target_node_id
        
        # Metadata cho việc thực thi
        self.executed = False
        self.execution_time = None

    def add_connection(self, from_port: str, to_node_id: str):
        """Thêm kết nối từ port này tới node khác."""
        self.outputs[from_port] = to_node_id

    async def execute(self, page, context: dict = None):
        """Thực thi node với strategy tương ứng."""
        print(f"\n--- Đang thực thi node: {self.display_name} ({self.type}) ---")
        
        import time
        start_time = time.time()
        
        try:
            await self.strategy.execute(page, self.params, context)
            self.executed = True
            self.execution_time = time.time() - start_time
            print(f"✅ Node {self.display_name} hoàn thành trong {self.execution_time:.2f}s")
        except Exception as e:
            self.execution_time = time.time() - start_time
            print(f"❌ Node {self.display_name} thất bại: {e}")
            raise

    def get_next_node_id(self, from_port: str = 'out') -> str | None:
        """Lấy ID của node tiếp theo dựa trên port output."""
        # Xử lý các node có logic đặc biệt
        if self.type in ['if', 'advancedCondition']:
            # TODO: Cần logic để quyết định đi theo 'then' hay 'else'
            # Ở đây ta mặc định là 'then' cho đơn giản
            return self.outputs.get('then') or self.outputs.get('out')
        elif self.type == 'forEach':
            # TODO: Cần logic lặp, ở đây ta giả sử đi tiếp khi xong
            return self.outputs.get('next') or self.outputs.get('out')
        
        # Các node thông thường - thử các port theo thứ tự ưu tiên
        port_priority = [from_port, 'out', 'out_right', 'out_bottom']
        for port in port_priority:
            if port in self.outputs:
                return self.outputs[port]
        
        return None

    def reset(self):
        """Reset trạng thái thực thi của node."""
        self.executed = False
        self.execution_time = None
    
    def __repr__(self):
        return f"Node(id={self.id}, type={self.type}, display_name={self.display_name})"