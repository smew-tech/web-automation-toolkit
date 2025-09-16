import asyncio
import json
import os
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime
from .workflow import Workflow
from states.workflow_states import PendingState, RunningState

class WorkflowManager:
    """
    Quản lý tất cả các workflow và cho phép thực thi đồng thời nhiều workflow.
    Hỗ trợ tải workflow từ file JSON và quản lý proxy settings.
    """
    
    def __init__(self, max_concurrent_workflows: int = 5):
        self.workflows: Dict[str, Workflow] = {}
        self.max_concurrent_workflows = max_concurrent_workflows
        self.running_workflows: set = set()
        self.workflow_results: Dict[str, bool] = {}
        
        # Semaphore để giới hạn số workflow chạy đồng thời
        self._semaphore = asyncio.Semaphore(max_concurrent_workflows)

    def load_workflow(self, json_path: str, proxy_settings: dict = None, workflow_name: str = None):
        """Tải một workflow từ file JSON và thêm vào manager."""
        try:
            json_path = Path(json_path)
            if not json_path.exists():
                raise FileNotFoundError(f"File không tồn tại: {json_path}")
            
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Sử dụng tên được chỉ định hoặc tên file làm tên workflow
            if not workflow_name:
                workflow_name = json_path.stem
            
            if workflow_name in self.workflows:
                print(f"⚠️ Workflow '{workflow_name}' đã tồn tại, đang ghi đè...")
            
            workflow = Workflow(workflow_name, data, proxy_settings)
            self.workflows[workflow_name] = workflow
            print(f"✅ Đã tải thành công workflow: {workflow_name}")
            print(f"   - Nodes: {len(workflow.nodes)}")
            print(f"   - Proxy: {'Có' if proxy_settings else 'Không'}")
            
        except Exception as e:
            print(f"❌ Lỗi khi tải workflow từ {json_path}: {e}")
            raise

    def load_workflows_from_directory(self, directory_path: str, proxy_settings: dict = None):
        """Tải tất cả workflow JSON từ một thư mục."""
        directory = Path(directory_path)
        if not directory.exists():
            raise FileNotFoundError(f"Thư mục không tồn tại: {directory}")
        
        json_files = list(directory.glob("*.json"))
        if not json_files:
            print(f"⚠️ Không tìm thấy file JSON nào trong thư mục: {directory}")
            return
        
        print(f"📁 Đang tải {len(json_files)} workflow từ: {directory}")
        
        loaded_count = 0
        for json_file in json_files:
            try:
                self.load_workflow(json_file, proxy_settings)
                loaded_count += 1
            except Exception as e:
                print(f"❌ Bỏ qua file {json_file.name}: {e}")
        
        print(f"✅ Đã tải thành công {loaded_count}/{len(json_files)} workflow")

    def get_workflow(self, name: str) -> Optional[Workflow]:
        """Lấy workflow theo tên."""
        return self.workflows.get(name)

    def list_workflows(self) -> List[Dict]:
        """Lấy danh sách tóm tắt tất cả workflow."""
        return [workflow.get_summary() for workflow in self.workflows.values()]

    def get_pending_workflows(self) -> List[Workflow]:
        """Lấy danh sách các workflow chưa từng chạy hoặc đã reset."""
        return [
            wf for wf in self.workflows.values() 
            if isinstance(wf.state, PendingState)
        ]

    def get_runnable_workflows(self) -> List[Workflow]:
        """Lấy danh sách các workflow có thể chạy (Pending hoặc Failed)."""
        return [wf for wf in self.workflows.values() if wf.can_run()]

    def get_running_workflows(self) -> List[Workflow]:
        """Lấy danh sách các workflow đang chạy."""
        return [
            wf for wf in self.workflows.values() 
            if isinstance(wf.state, RunningState)
        ]

    async def _run_workflow_with_semaphore(self, workflow: Workflow) -> bool:
        """Chạy workflow với giới hạn đồng thời."""
        async with self._semaphore:
            self.running_workflows.add(workflow.name)
            try:
                result = await workflow.run()
                self.workflow_results[workflow.name] = result
                return result
            finally:
                self.running_workflows.discard(workflow.name)

    async def run_workflow_by_name(self, name: str) -> bool:
        """Chạy một workflow cụ thể bằng tên của nó."""
        workflow = self.workflows.get(name)
        if not workflow:
            print(f"❌ Không tìm thấy workflow có tên: {name}")
            return False
        
        if not workflow.can_run():
            print(f"⚠️ Workflow '{name}' không thể chạy (trạng thái: {workflow.state})")
            return False
        
        print(f"🚀 Đang khởi chạy workflow: {name}")
        return await self._run_workflow_with_semaphore(workflow)

    async def run_multiple_workflows(self, names: List[str]) -> Dict[str, bool]:
        """Chạy nhiều workflow cùng lúc và trả về kết quả."""
        if not names:
            print("⚠️ Danh sách workflow rỗng")
            return {}
        
        # Lọc các workflow hợp lệ
        valid_workflows = []
        for name in names:
            workflow = self.workflows.get(name)
            if not workflow:
                print(f"❌ Bỏ qua workflow không tồn tại: {name}")
                continue
            
            if not workflow.can_run():
                print(f"⚠️ Bỏ qua workflow không thể chạy: {name} (trạng thái: {workflow.state})")
                continue
            
            valid_workflows.append(workflow)
        
        if not valid_workflows:
            print("❌ Không có workflow hợp lệ để chạy")
            return {}
        
        print(f"🚀 Đang khởi chạy {len(valid_workflows)} workflow đồng thời...")
        print(f"📊 Giới hạn đồng thời: {self.max_concurrent_workflows}")
        
        # Tạo tasks cho tất cả workflows
        tasks = [
            self._run_workflow_with_semaphore(workflow)
            for workflow in valid_workflows
        ]
        
        # Chạy tất cả tasks và chờ hoàn thành
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Xử lý kết quả
        final_results = {}
        for i, workflow in enumerate(valid_workflows):
            if isinstance(results[i], Exception):
                print(f"❌ Workflow {workflow.name} gặp exception: {results[i]}")
                final_results[workflow.name] = False
            else:
                final_results[workflow.name] = results[i]
        
        # Thống kê kết quả
        successful = sum(1 for success in final_results.values() if success)
        total = len(final_results)
        
        print(f"\n📊 Kết quả thực thi:")
        print(f"   - Thành công: {successful}/{total}")
        print(f"   - Thất bại: {total - successful}/{total}")
        
        return final_results

    async def run_all_pending_workflows(self) -> Dict[str, bool]:
        """Chạy tất cả workflow đang ở trạng thái Pending."""
        pending_workflows = self.get_pending_workflows()
        if not pending_workflows:
            print("ℹ️ Không có workflow nào ở trạng thái Pending")
            return {}
        
        workflow_names = [wf.name for wf in pending_workflows]
        print(f"🎯 Tìm thấy {len(workflow_names)} workflow Pending: {workflow_names}")
        
        return await self.run_multiple_workflows(workflow_names)

    async def run_all_runnable_workflows(self) -> Dict[str, bool]:
        """Chạy tất cả workflow có thể chạy được (Pending + Failed)."""
        runnable_workflows = self.get_runnable_workflows()
        if not runnable_workflows:
            print("ℹ️ Không có workflow nào có thể chạy")
            return {}
        
        workflow_names = [wf.name for wf in runnable_workflows]
        print(f"🎯 Tìm thấy {len(workflow_names)} workflow có thể chạy: {workflow_names}")
        
        return await self.run_multiple_workflows(workflow_names)

    def reset_workflow(self, name: str) -> bool:
        """Reset một workflow về trạng thái Pending."""
        workflow = self.workflows.get(name)
        if not workflow:
            print(f"❌ Không tìm thấy workflow: {name}")
            return False
        
        if workflow.name in self.running_workflows:
            print(f"⚠️ Không thể reset workflow đang chạy: {name}")
            return False
        
        workflow.reset()
        if name in self.workflow_results:
            del self.workflow_results[name]
        
        return True

    def reset_all_workflows(self):
        """Reset tất cả workflow về trạng thái Pending."""
        reset_count = 0
        for name in list(self.workflows.keys()):
            if self.reset_workflow(name):
                reset_count += 1
        
        print(f"🔄 Đã reset {reset_count} workflow")

    def remove_workflow(self, name: str) -> bool:
        """Xóa một workflow khỏi manager."""
        if name not in self.workflows:
            print(f"❌ Workflow không tồn tại: {name}")
            return False
        
        if name in self.running_workflows:
            print(f"⚠️ Không thể xóa workflow đang chạy: {name}")
            return False
        
        del self.workflows[name]
        if name in self.workflow_results:
            del self.workflow_results[name]
        
        print(f"🗑️ Đã xóa workflow: {name}")
        return True

    def clear_all_workflows(self):
        """Xóa tất cả workflow."""
        if self.running_workflows:
            print(f"⚠️ Có {len(self.running_workflows)} workflow đang chạy, không thể xóa tất cả")
            return False
        
        count = len(self.workflows)
        self.workflows.clear()
        self.workflow_results.clear()
        print(f"🗑️ Đã xóa tất cả {count} workflow")
        return True

    def get_status(self) -> dict:
        """Lấy trạng thái tổng quan của WorkflowManager."""
        total = len(self.workflows)
        pending = len(self.get_pending_workflows())
        running = len(self.get_running_workflows())
        runnable = len(self.get_runnable_workflows())
        
        return {
            'total_workflows': total,
            'pending_workflows': pending,
            'running_workflows': running,
            'runnable_workflows': runnable,
            'max_concurrent': self.max_concurrent_workflows,
            'active_slots': len(self.running_workflows),
            'available_slots': self.max_concurrent_workflows - len(self.running_workflows)
        }

    def print_status(self):
        """In ra trạng thái tổng quan của WorkflowManager."""
        status = self.get_status()
        print(f"\n📊 Trạng thái WorkflowManager:")
        print(f"   - Tổng workflow: {status['total_workflows']}")
        print(f"   - Pending: {status['pending_workflows']}")
        print(f"   - Running: {status['running_workflows']}")
        print(f"   - Có thể chạy: {status['runnable_workflows']}")
        print(f"   - Giới hạn đồng thời: {status['max_concurrent']}")
        print(f"   - Slots đang dùng: {status['active_slots']}/{status['max_concurrent']}")
        
        if self.workflows:
            print(f"\n📋 Danh sách workflow:")
            for workflow in self.workflows.values():
                status_icon = {
                    'Pending': '⏳',
                    'Running': '🔄',
                    'Completed': '✅',
                    'Failed': '❌'
                }.get(str(workflow.state), '❓')
                
                proxy_info = " (có proxy)" if workflow.proxy_settings else ""
                print(f"   {status_icon} {workflow.name}: {workflow.state}{proxy_info}")

    def __repr__(self):
        return f"WorkflowManager(workflows={len(self.workflows)}, max_concurrent={self.max_concurrent_workflows})"