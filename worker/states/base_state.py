from abc import ABC, abstractmethod

class WorkflowState(ABC):
    """
    Lớp cơ sở trừu tượng cho các trạng thái của workflow.
    Áp dụng State Pattern để quản lý vòng đời của workflow.
    """
    @abstractmethod
    def can_run(self) -> bool:
        """Kiểm tra xem workflow có thể chạy trong trạng thái hiện tại không."""
        pass
    
    @abstractmethod
    def get_next_state(self, success: bool):
        """Trả về trạng thái tiếp theo dựa trên kết quả thực thi."""
        pass
    
    @abstractmethod
    def __str__(self):
        pass