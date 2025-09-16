try:
    from playwright.async_api import Page
except ImportError:
    # Mock Page for testing without Playwright
    Page = object

from .base_strategy import NodeStrategy
import asyncio

class StartNodeStrategy(NodeStrategy):
    async def execute(self, page: Page, params: dict, context: dict = None):
        print("▶️ Bắt đầu thực thi workflow...")

class StopNodeStrategy(NodeStrategy):
    async def execute(self, page: Page, params: dict, context: dict = None):
        print("⏹️ Workflow đã hoàn thành.")

class GotoNodeStrategy(NodeStrategy):
    async def execute(self, page: Page, params: dict, context: dict = None):
        url = params.get('url')
        if not url:
            raise ValueError("Node 'goto' yêu cầu tham số 'url'.")
        print(f"🚀 Điều hướng tới: {url}")
        await page.goto(url)

class ClickNodeStrategy(NodeStrategy):
    async def execute(self, page: Page, params: dict, context: dict = None):
        selector = params.get('selector')
        if not selector:
            raise ValueError("Node 'click' yêu cầu tham số 'selector'.")
        print(f"🖱️ Click vào phần tử: {selector}")
        await page.locator(selector).click()

class FillNodeStrategy(NodeStrategy):
    async def execute(self, page: Page, params: dict, context: dict = None):
        selector = params.get('selector')
        value = params.get('value', '')
        if not selector:
            raise ValueError("Node 'fill' yêu cầu tham số 'selector'.")
        print(f"✏️ Nhập text '{value}' vào: {selector}")
        await page.locator(selector).fill(value)

class SelectOptionStrategy(NodeStrategy):
    async def execute(self, page: Page, params: dict, context: dict = None):
        selector = params.get('selector')
        value = params.get('value')
        if not selector or value is None:
            raise ValueError("Node 'selectOption' yêu cầu tham số 'selector' và 'value'.")
        print(f"📋 Chọn option '{value}' trong: {selector}")
        await page.locator(selector).select_option(value)

class SetCheckboxStateStrategy(NodeStrategy):
    async def execute(self, page: Page, params: dict, context: dict = None):
        selector = params.get('selector')
        checked = params.get('checked', True)
        if not selector:
            raise ValueError("Node 'setCheckboxState' yêu cầu tham số 'selector'.")
        print(f"☑️ {'Check' if checked else 'Uncheck'} checkbox: {selector}")
        await page.locator(selector).set_checked(checked)

class AssertVisibleStrategy(NodeStrategy):
    async def execute(self, page: Page, params: dict, context: dict = None):
        selector = params.get('selector')
        if not selector:
            raise ValueError("Node 'assertVisible' yêu cầu tham số 'selector'.")
        print(f"👀 Kiểm tra hiển thị của: {selector}")
        await page.locator(selector).wait_for(state='visible')
        print(f"✅ Phần tử {selector} hiển thị thành công")

class WaitNodeStrategy(NodeStrategy):
    async def execute(self, page: Page, params: dict, context: dict = None):
        timeout = params.get('timeout', 1000)
        print(f"⏳ Chờ {timeout}ms...")
        await asyncio.sleep(timeout / 1000)

class ExtractTextStrategy(NodeStrategy):
    async def execute(self, page: Page, params: dict, context: dict = None):
        selector = params.get('selector')
        variable_name = params.get('variableName', 'extracted_text')
        if not selector:
            raise ValueError("Node 'extractText' yêu cầu tham số 'selector'.")
        
        text = await page.locator(selector).text_content()
        if context:
            context[variable_name] = text
        print(f"📝 Trích xuất text từ {selector}: '{text}' -> {variable_name}")

class ExtractMultipleStrategy(NodeStrategy):
    async def execute(self, page: Page, params: dict, context: dict = None):
        container_selector = params.get('containerSelector')
        item_selector = params.get('itemSelector')
        extract_commands = params.get('extractCommands', [])
        variable_name = params.get('variableName', 'extracted_data')
        
        if not container_selector or not item_selector:
            raise ValueError("Node 'extractMultiple' yêu cầu 'containerSelector' và 'itemSelector'.")
        
        items = await page.locator(f"{container_selector} {item_selector}").all()
        results = []
        
        for item in items:
            item_data = {}
            for command in extract_commands:
                if command.startswith('EXTRACT_TEXT:'):
                    parts = command.split('>')
                    if len(parts) == 2:
                        selector_part = parts[0].replace('EXTRACT_TEXT:', '')
                        field_name = parts[1]
                        text = await item.locator(selector_part).text_content()
                        item_data[field_name] = text
                elif command.startswith('EXTRACT_ATTR:'):
                    parts = command.split('>')
                    if len(parts) == 2:
                        attr_part = parts[0].replace('EXTRACT_ATTR:', '')
                        field_name = parts[1]
                        selector_and_attr = attr_part.split('@')
                        if len(selector_and_attr) == 2:
                            selector_part, attr = selector_and_attr
                            attr_value = await item.locator(selector_part).get_attribute(attr)
                            item_data[field_name] = attr_value
            results.append(item_data)
        
        if context:
            context[variable_name] = results
        print(f"📊 Trích xuất {len(results)} items -> {variable_name}")

class HttpRequestStrategy(NodeStrategy):
    async def execute(self, page: Page, params: dict, context: dict = None):
        import aiohttp
        
        method = params.get('method', 'GET').upper()
        url = params.get('url')
        data_source = params.get('dataSource')
        variable_name = params.get('variableName', 'http_response')
        
        if not url:
            raise ValueError("Node 'httpRequest' yêu cầu tham số 'url'.")
        
        source_data = None
        if data_source and context:
            if data_source.startswith('GET_VARIABLE:'):
                var_name = data_source.replace('GET_VARIABLE:', '')
                source_data = context.get(var_name)
        
        print(f"🌐 HTTP {method} request tới: {url}")
        
        async with aiohttp.ClientSession() as session:
            if method == 'GET':
                async with session.get(url) as response:
                    result = await response.json()
            else:
                async with session.request(method, url, json=source_data) as response:
                    result = await response.json()
            
            if context:
                context[variable_name] = result
            print(f"✅ HTTP request hoàn thành -> {variable_name}")

# Factory để lấy strategy tương ứng với loại node
def get_strategy(node_type: str) -> NodeStrategy:
    strategies = {
        "start": StartNodeStrategy(),
        "stop": StopNodeStrategy(),
        "goto": GotoNodeStrategy(),
        "click": ClickNodeStrategy(),
        "fill": FillNodeStrategy(),
        "selectOption": SelectOptionStrategy(),
        "setCheckboxState": SetCheckboxStateStrategy(),
        "assertVisible": AssertVisibleStrategy(),
        "wait": WaitNodeStrategy(),
        "extractText": ExtractTextStrategy(),
        "extractMultiple": ExtractMultipleStrategy(),
        "httpRequest": HttpRequestStrategy()
    }
    strategy = strategies.get(node_type)
    if not strategy:
        raise ValueError(f"Không tìm thấy strategy cho loại node: {node_type}")
    return strategy