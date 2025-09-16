from abc import ABC, abstractmethod

try:
    from playwright.async_api import Page
except ImportError:
    # Mock Page for testing without Playwright
    Page = object

class NodeStrategy(ABC):
    """
    Lớp cơ sở trừu tượng cho tất cả các chiến lược thực thi node.
    Mỗi loại node (goto, click, fill) sẽ có một lớp strategy riêng kế thừa từ lớp này.
    """
    @abstractmethod
    async def execute(self, page: Page, params: dict, context: dict = None):
        """
        Phương thức thực thi logic chính của node.
        :param page: Đối tượng Page của Playwright để tương tác với trình duyệt.
        :param params: Các tham số được định nghĩa trong file JSON cho node này.
        :param context: Context chung của workflow để chia sẻ dữ liệu giữa các nodes.
        """
        pass