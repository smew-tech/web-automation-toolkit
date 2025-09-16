from .base_state import WorkflowState

class PendingState(WorkflowState):
    """Trạng thái chờ thực thi - workflow chưa từng được chạy."""
    
    def can_run(self) -> bool:
        return True
    
    def get_next_state(self, success: bool):
        return RunningState()
    
    def __str__(self):
        return "Pending"

class RunningState(WorkflowState):
    """Trạng thái đang chạy - workflow đang được thực thi."""
    
    def can_run(self) -> bool:
        return False  # Không thể chạy workflow đã đang chạy
    
    def get_next_state(self, success: bool):
        if success:
            return CompletedState()
        else:
            return FailedState()
    
    def __str__(self):
        return "Running"

class CompletedState(WorkflowState):
    """Trạng thái hoàn thành - workflow đã chạy thành công."""
    
    def can_run(self) -> bool:
        return False  # Workflow đã hoàn thành, không thể chạy lại
    
    def get_next_state(self, success: bool):
        return self  # Giữ nguyên trạng thái
    
    def __str__(self):
        return "Completed"

class FailedState(WorkflowState):
    """Trạng thái thất bại - workflow gặp lỗi trong quá trình thực thi."""
    
    def can_run(self) -> bool:
        return True  # Có thể chạy lại workflow bị lỗi
    
    def get_next_state(self, success: bool):
        return RunningState()
    
    def __str__(self):
        return "Failed"