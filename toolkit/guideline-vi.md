# SMEW Automation Toolkit - Hướng Dẫn Toàn Diện

## Tổng Quan

SMEW Automation Toolkit là công cụ tạo workflow automation mạnh mẽ, cho phép bạn tạo các quy trình tự động hóa kiểm thử và tương tác với website mà không cần viết code.

### Cách Sử Dụng Cơ Bản
1. **Kéo thả** các nodes từ sidebar trái vào canvas
2. **Kết nối** các nodes bằng cách kéo từ port output này sang port input khác
3. **Cấu hình** properties cho mỗi node ở panel bên phải
4. **Test** workflow bằng nút "Test"
5. **Export** workflow thành file JSON

---

# Bắt Đầu

## <i class="fas fa-play-circle" style="color: #10b981;"></i> start - Bắt Đầu
**Công dụng**: Node khởi đầu của workflow, mọi workflow đều phải bắt đầu từ node này.

### JSON Format
```json
{
  "id": "start",
  "type": "start",
  "x": 50,
  "y": 100,
  "params": {}
}
```

### Đặc điểm
- Là node duy nhất không có input port
- Mọi workflow đều phải có duy nhất một start node
- Workflow sẽ bắt đầu thực thi từ node này
- Chỉ có output port để kết nối với node tiếp theo

---

# Điều Khiển

## <i class="fas fa-code-branch" style="color: #6366f1;"></i> if - Điều Kiện
**Công dụng**: Tạo điều kiện rẽ nhánh trong workflow dựa trên boolean expression.

### Parameters
- **condition** (text): Biểu thức điều kiện để đánh giá
  - *Ví dụ*: `variable1 == "success"`, `count > 5`, `status != "error"`

### JSON Format
```json
{
  "id": "node-123",
  "type": "if",
  "x": 100,
  "y": 200,
  "params": {
    "condition": "pageTitle == \"Welcome\""
  }
}
```

### Ports
- **Input**: Nhận từ node trước
- **Output Then**: Thực thi khi điều kiện TRUE
- **Output Else**: Thực thi khi điều kiện FALSE

## <i class="fas fa-sync-alt" style="color: #8b5cf6;"></i> forEach - Vòng Lặp
**Công dụng**: Lặp qua mảng hoặc thực hiện một số lần nhất định.

### Parameters
- **list** (text): Tên biến mảng hoặc số lần lặp
  - *Ví dụ*: `myArray`, `5`, `productList`

### JSON Format
```json
{
  "id": "node-124",
  "type": "forEach",
  "x": 300,
  "y": 200,
  "params": {
    "list": "productList"
  }
}
```

### Ports
- **Input**: Nhận từ node trước
- **Output Loop**: Thực thi cho mỗi lần lặp
- **Output Done**: Thực thi khi hoàn thành vòng lặp

## <i class="fas fa-equals" style="color: #ec4899;"></i> setVariable - Đặt Biến
**Công dụng**: Lưu giá trị vào biến để sử dụng trong các node khác.

### Parameters
- **name** (text): Tên biến
- **value** (text): Giá trị để lưu

### JSON Format
```json
{
  "id": "node-125",
  "type": "setVariable",
  "x": 500,
  "y": 200,
  "params": {
    "name": "userName",
    "value": "john_doe"
  }
}
```

## <i class="fas fa-stop-circle" style="color: #ef4444;"></i> stop - Dừng
**Công dụng**: Dừng thực thi workflow.

### JSON Format
```json
{
  "id": "node-126",
  "type": "stop",
  "x": 700,
  "y": 200,
  "params": {}
}
```

## <i class="fas fa-comment-dots" style="color: #6b7280;"></i> comment - Ghi Chú
**Công dụng**: Thêm ghi chú giải thích cho workflow.

### Parameters
- **text** (text): Nội dung ghi chú

### JSON Format
```json
{
  "id": "node-127",
  "type": "comment",
  "x": 900,
  "y": 200,
  "params": {
    "text": "Đây là ghi chú giải thích"
  }
}
```

---

# Điều Hướng

## <i class="fas fa-link" style="color: #0ea5e9;"></i> goto - Đi Tới
**Công dụng**: Điều hướng đến URL khác.

### Parameters
- **url** (text): URL đích cần điều hướng

### JSON Format
```json
{
  "id": "node-201",
  "type": "goto",
  "x": 100,
  "y": 300,
  "params": {
    "url": "https://example.com"
  }
}
```

## <i class="fas fa-redo" style="color: #10b981;"></i> reload - Tải Lại
**Công dụng**: Tải lại trang hiện tại.

### JSON Format
```json
{
  "id": "node-202",
  "type": "reload",
  "x": 300,
  "y": 300,
  "params": {}
}
```

## <i class="fas fa-arrow-left" style="color: #64748b;"></i> goBack - Lùi
**Công dụng**: Quay lại trang trước trong history.

### JSON Format
```json
{
  "id": "node-203",
  "type": "goBack",
  "x": 500,
  "y": 300,
  "params": {}
}
```

## <i class="fas fa-arrow-right" style="color: #64748b;"></i> goForward - Tiến
**Công dụng**: Tiến tới trang sau trong history.

### JSON Format
```json
{
  "id": "node-204",
  "type": "goForward",
  "x": 700,
  "y": 300,
  "params": {}
}
```

---

# Tương Tác

## <i class="fas fa-hand-pointer" style="color: #f59e0b;"></i> click - Nhấp
**Công dụng**: Nhấp chuột vào element.

### Parameters
- **selector** (selector): CSS selector của element cần nhấp

### JSON Format
```json
{
  "id": "node-301",
  "type": "click",
  "x": 100,
  "y": 400,
  "params": {
    "selector": "#submit-button"
  }
}
```

## <i class="fas fa-keyboard" style="color: #8b5cf6;"></i> fill - Điền
**Công dụng**: Điền text vào input field.

### Parameters
- **selector** (selector): CSS selector của input field
- **value** (text): Giá trị cần điền

### JSON Format
```json
{
  "id": "node-302",
  "type": "fill",
  "x": 300,
  "y": 400,
  "params": {
    "selector": "#username",
    "value": "john_doe"
  }
}
```

## <i class="fas fa-eraser" style="color: #ef4444;"></i> clearInput - Xóa Input
**Công dụng**: Xóa nội dung của input field.

### Parameters
- **selector** (selector): CSS selector của input field

### JSON Format
```json
{
  "id": "node-303",
  "type": "clearInput",
  "x": 500,
  "y": 400,
  "params": {
    "selector": "#search-field"
  }
}
```

## <i class="fas fa-check-square" style="color: #3b82f6;"></i> setCheckboxState - Đặt Trạng Thái Checkbox
**Công dụng**: Đặt trạng thái checked/unchecked cho checkbox.

### Parameters
- **selector** (selector): CSS selector của checkbox
- **checked** (boolean): true để check, false để uncheck

### JSON Format
```json
{
  "id": "node-304",
  "type": "setCheckboxState",
  "x": 700,
  "y": 400,
  "params": {
    "selector": "#agree-terms",
    "checked": true
  }
}
```

## <i class="fas fa-list-ul" style="color: #f97316;"></i> selectOption - Chọn Tùy Chọn
**Công dụng**: Chọn option trong select dropdown.

### Parameters
- **selector** (selector): CSS selector của select element
- **value** (text): Giá trị option cần chọn

### JSON Format
```json
{
  "id": "node-305",
  "type": "selectOption",
  "x": 900,
  "y": 400,
  "params": {
    "selector": "#country",
    "value": "vietnam"
  }
}
```

## <i class="fas fa-mouse-pointer" style="color: #06b6d4;"></i> hover - Di Chuột
**Công dụng**: Di chuột lên element để trigger hover effect.

### Parameters
- **selector** (selector): CSS selector của element

### JSON Format
```json
{
  "id": "node-306",
  "type": "hover",
  "x": 100,
  "y": 500,
  "params": {
    "selector": ".menu-item"
  }
}
```

## <i class="fas fa-arrow-turn-down" style="color: #14b8a6;"></i> press - Nhấn Phím
**Công dụng**: Nhấn phím trên bàn phím.

### Parameters
- **key** (text): Phím cần nhấn (Enter, Tab, Escape, etc.)

### JSON Format
```json
{
  "id": "node-307",
  "type": "press",
  "x": 300,
  "y": 500,
  "params": {
    "key": "Enter"
  }
}
```

## <i class="fas fa-file-upload" style="color: #d946ef;"></i> uploadFile - Tải File
**Công dụng**: Upload file thông qua input file.

### Parameters
- **selector** (selector): CSS selector của input file
- **filePath** (text): Đường dẫn đến file cần upload

### JSON Format
```json
{
  "id": "node-308",
  "type": "uploadFile",
  "x": 500,
  "y": 500,
  "params": {
    "selector": "#file-upload",
    "filePath": "/path/to/file.pdf"
  }
}
```

---

# Chờ

## <i class="fas fa-clock" style="color: #6b7280;"></i> waitTimeout - Chờ Thời Gian
**Công dụng**: Chờ một khoảng thời gian nhất định.

### Parameters
- **timeout** (number): Thời gian chờ (milliseconds)

### JSON Format
```json
{
  "id": "node-401",
  "type": "waitTimeout",
  "x": 100,
  "y": 600,
  "params": {
    "timeout": 3000
  }
}
```

## <i class="fas fa-binoculars" style="color: #3b82f6;"></i> waitElement - Chờ Element
**Công dụng**: Chờ element xuất hiện trên trang.

### Parameters
- **selector** (selector): CSS selector của element cần chờ
- **timeout** (number): Thời gian chờ tối đa (milliseconds)

### JSON Format
```json
{
  "id": "node-402",
  "type": "waitElement",
  "x": 300,
  "y": 600,
  "params": {
    "selector": ".loading-spinner",
    "timeout": 10000
  }
}
```

---

# Trích Xuất

## <i class="fas fa-quote-left" style="color: #f43f5e;"></i> getText - Lấy Text
**Công dụng**: Trích xuất text content của element.

### Parameters
- **selector** (selector): CSS selector của element
- **variable** (text): Tên biến để lưu text

### JSON Format
```json
{
  "id": "node-501",
  "type": "getText",
  "x": 100,
  "y": 700,
  "params": {
    "selector": "h1",
    "variable": "pageTitle"
  }
}
```

## <i class="fas fa-at" style="color: #84cc16;"></i> getAttribute - Lấy Thuộc Tính
**Công dụng**: Trích xuất giá trị thuộc tính của element.

### Parameters
- **selector** (selector): CSS selector của element
- **attribute** (text): Tên thuộc tính
- **variable** (text): Tên biến để lưu giá trị

### JSON Format
```json
{
  "id": "node-502",
  "type": "getAttribute",
  "x": 300,
  "y": 700,
  "params": {
    "selector": "a",
    "attribute": "href",
    "variable": "linkURL"
  }
}
```

## <i class="fas fa-i-cursor" style="color: #8b5cf6;"></i> getInputValue - Lấy Giá Trị Input
**Công dụng**: Trích xuất giá trị của input field.

### Parameters
- **selector** (selector): CSS selector của input field
- **variable** (text): Tên biến để lưu giá trị

### JSON Format
```json
{
  "id": "node-503",
  "type": "getInputValue",
  "x": 500,
  "y": 700,
  "params": {
    "selector": "#username",
    "variable": "currentUser"
  }
}
```

## <i class="fas fa-camera" style="color: #6b7280;"></i> screenshot - Chụp Ảnh
**Công dụng**: Chụp ảnh màn hình trang hiện tại.

### Parameters
- **filename** (text): Tên file ảnh

### JSON Format
```json
{
  "id": "node-504",
  "type": "screenshot",
  "x": 700,
  "y": 700,
  "params": {
    "filename": "page-screenshot.png"
  }
}
```

---

# Kiểm Tra Cơ Bản

## <i class="fas fa-eye" style="color: #10b981;"></i> assertVisible - Kiểm Tra Hiển Thị
**Công dụng**: Xác minh element có hiển thị trên trang không.

### Parameters
- **selector** (selector): CSS selector của element cần kiểm tra

### JSON Format
```json
{
  "id": "node-601",
  "type": "assertVisible",
  "x": 100,
  "y": 800,
  "params": {
    "selector": ".welcome-message"
  }
}
```

## <i class="fas fa-check-double" style="color: #eab308;"></i> assertText - Kiểm Tra Văn Bản
**Công dụng**: Xác minh text content của element.

### Parameters
- **selector** (selector): CSS selector của element
- **text** (text): Text mong đợi

### JSON Format
```json
{
  "id": "node-602",
  "type": "assertText",
  "x": 300,
  "y": 800,
  "params": {
    "selector": "h1",
    "text": "Welcome to Dashboard"
  }
}
```

## <i class="fas fa-link" style="color: #3b82f6;"></i> assertURL - Kiểm Tra URL
**Công dụng**: Xác minh URL hiện tại của trang.

### Parameters
- **url** (text): URL mong đợi

### JSON Format
```json
{
  "id": "node-603",
  "type": "assertURL",
  "x": 500,
  "y": 800,
  "params": {
    "url": "https://example.com/dashboard"
  }
}
```

## <i class="fas fa-heading" style="color: #8b5cf6;"></i> assertTitle - Kiểm Tra Tiêu Đề
**Công dụng**: Xác minh title của trang.

### Parameters
- **title** (text): Title mong đợi

### JSON Format
```json
{
  "id": "node-604",
  "type": "assertTitle",
  "x": 700,
  "y": 800,
  "params": {
    "title": "Dashboard - My App"
  }
}
```

## <i class="fas fa-tags" style="color: #f97316;"></i> assertAttribute - Kiểm Tra Thuộc Tính
**Công dụng**: Xác minh giá trị thuộc tính của element.

### Parameters
- **selector** (selector): CSS selector của element
- **attribute** (text): Tên thuộc tính
- **value** (text): Giá trị mong đợi

### JSON Format
```json
{
  "id": "node-605",
  "type": "assertAttribute",
  "x": 900,
  "y": 800,
  "params": {
    "selector": "input",
    "attribute": "placeholder",
    "value": "Enter username"
  }
}
```

## <i class="fas fa-list-ol" style="color: #6366f1;"></i> assertElementCount - Kiểm Tra Số Lượng Phần Tử
**Công dụng**: Xác minh số lượng elements matching selector.

### Parameters
- **selector** (selector): CSS selector của elements
- **count** (number): Số lượng mong đợi

### JSON Format
```json
{
  "id": "node-606",
  "type": "assertElementCount",
  "x": 100,
  "y": 900,
  "params": {
    "selector": ".product-item",
    "count": 12
  }
}
```

## <i class="fas fa-eye-slash" style="color: #ef4444;"></i> assertNotVisible - Kiểm Tra Không Hiển Thị
**Công dụng**: Xác minh element không hiển thị hoặc không tồn tại.

### Parameters
- **selector** (selector): CSS selector của element

### JSON Format
```json
{
  "id": "node-607",
  "type": "assertNotVisible",
  "x": 300,
  "y": 900,
  "params": {
    "selector": ".error-message"
  }
}
```

## <i class="fas fa-toggle-on" style="color: #14b8a6;"></i> assertEnabled - Kiểm Tra Kích Hoạt
**Công dụng**: Xác minh element có thể tương tác được.

### Parameters
- **selector** (selector): CSS selector của element

### JSON Format
```json
{
  "id": "node-608",
  "type": "assertEnabled",
  "x": 500,
  "y": 900,
  "params": {
    "selector": "#submit-btn"
  }
}
```

## <i class="fas fa-toggle-off" style="color: #6b7280;"></i> assertDisabled - Kiểm Tra Vô Hiệu Hóa
**Công dụng**: Xác minh element bị vô hiệu hóa.

### Parameters
- **selector** (selector): CSS selector của element

### JSON Format
```json
{
  "id": "node-609",
  "type": "assertDisabled",
  "x": 700,
  "y": 900,
  "params": {
    "selector": "#submit-btn"
  }
}
```

## <i class="fas fa-check-square" style="color: #10b981;"></i> assertChecked - Kiểm Tra Đã Chọn
**Công dụng**: Xác minh checkbox/radio đã được chọn.

### Parameters
- **selector** (selector): CSS selector của checkbox/radio

### JSON Format
```json
{
  "id": "node-610",
  "type": "assertChecked",
  "x": 900,
  "y": 900,
  "params": {
    "selector": "#agree-terms"
  }
}
```

## <i class="fas fa-square" style="color: #ec4899;"></i> assertUnchecked - Kiểm Tra Chưa Chọn
**Công dụng**: Xác minh checkbox/radio chưa được chọn.

### Parameters
- **selector** (selector): CSS selector của checkbox/radio

### JSON Format
```json
{
  "id": "node-611",
  "type": "assertUnchecked",
  "x": 100,
  "y": 1000,
  "params": {
    "selector": "#newsletter"
  }
}
```

## <i class="fas fa-search" style="color: #06b6d4;"></i> assertContainsText - Kiểm Tra Chứa Văn Bản
**Công dụng**: Xác minh element chứa text nhất định.

### Parameters
- **selector** (selector): CSS selector của element
- **text** (text): Text cần tìm

### JSON Format
```json
{
  "id": "node-612",
  "type": "assertContainsText",
  "x": 300,
  "y": 1000,
  "params": {
    "selector": ".message",
    "text": "success"
  }
}
```

---

# Trạng Thái Element

## <i class="fab fa-css3-alt" style="color: #8b5cf6;"></i> assertCSSProperty - Kiểm Tra Thuộc Tính CSS
**Công dụng**: Xác minh giá trị thuộc tính CSS của element.

### Parameters
- **selector** (selector): CSS selector của element
- **property** (text): Tên thuộc tính CSS
- **value** (text): Giá trị mong đợi

### JSON Format
```json
{
  "id": "node-701",
  "type": "assertCSSProperty",
  "x": 100,
  "y": 1100,
  "params": {
    "selector": ".modal",
    "property": "display",
    "value": "block"
  }
}
```

---

# Chất Lượng Trang

## <i class="fas fa-clipboard-check" style="color: #f59e0b;"></i> validateForm - Kiểm Tra Form
**Công dụng**: Kiểm tra tính hợp lệ của form validation.

### Parameters
- **selector** (selector): CSS selector của form

### JSON Format
```json
{
  "id": "node-801",
  "type": "validateForm",
  "x": 100,
  "y": 1200,
  "params": {
    "selector": "#contact-form"
  }
}
```

## <i class="fas fa-unlink" style="color: #f43f5e;"></i> checkBrokenLinks - Kiểm Tra Liên Kết Lỗi
**Công dụng**: Kiểm tra các liên kết bị hỏng trên trang.

### JSON Format
```json
{
  "id": "node-802",
  "type": "checkBrokenLinks",
  "x": 300,
  "y": 1200,
  "params": {}
}
```

## <i class="fas fa-image" style="color: #84cc16;"></i> checkImageLoading - Kiểm Tra Tải Ảnh
**Công dụng**: Kiểm tra tất cả ảnh có tải thành công không.

### JSON Format
```json
{
  "id": "node-803",
  "type": "checkImageLoading",
  "x": 500,
  "y": 1200,
  "params": {}
}
```

## <i class="fas fa-tachometer-alt" style="color: #0ea5e9;"></i> checkPageSpeed - Kiểm Tra Tốc Độ Trang
**Công dụng**: Đo tốc độ tải trang và hiệu suất.

### JSON Format
```json
{
  "id": "node-804",
  "type": "checkPageSpeed",
  "x": 700,
  "y": 1200,
  "params": {}
}
```

## <i class="fas fa-mobile-alt" style="color: #64748b;"></i> checkResponsive - Kiểm Tra Responsive
**Công dụng**: Kiểm tra trang có responsive trên các kích thước màn hình khác nhau.

### JSON Format
```json
{
  "id": "node-805",
  "type": "checkResponsive",
  "x": 900,
  "y": 1200,
  "params": {}
}
```

## <i class="fas fa-universal-access" style="color: #10b981;"></i> checkAccessibility - Kiểm Tra Khả Năng Tiếp Cận
**Công dụng**: Kiểm tra tính accessibility của trang web.

### JSON Format
```json
{
  "id": "node-806",
  "type": "checkAccessibility",
  "x": 100,
  "y": 1300,
  "params": {}
}
```

## <i class="fas fa-search-plus" style="color: #eab308;"></i> checkSEO - Kiểm Tra SEO
**Công dụng**: Kiểm tra các yếu tố SEO cơ bản của trang.

### JSON Format
```json
{
  "id": "node-807",
  "type": "checkSEO",
  "x": 300,
  "y": 1300,
  "params": {}
}
```

---

# Kiểm Tra Nâng Cao

## <i class="fas fa-ban" style="color: #ef4444;"></i> interceptNetwork - Chặn Network
**Công dụng**: Chặn và kiểm soát network requests.

### Parameters
- **url** (text): URL pattern cần chặn
- **method** (text): HTTP method (GET, POST, etc.)

### JSON Format
```json
{
  "id": "node-901",
  "type": "interceptNetwork",
  "x": 100,
  "y": 1400,
  "params": {
    "url": "*/api/users*",
    "method": "GET"
  }
}
```

## <i class="fas fa-cloud" style="color: #8b5cf6;"></i> mockAPI - Giả Lập API
**Công dụng**: Tạo mock response cho API calls.

### Parameters
- **url** (text): URL pattern của API
- **response** (text): Mock response JSON

### JSON Format
```json
{
  "id": "node-902",
  "type": "mockAPI",
  "x": 300,
  "y": 1400,
  "params": {
    "url": "*/api/data*",
    "response": "{\"status\": \"success\", \"data\": []}"
  }
}
```

## <i class="fas fa-cookie-bite" style="color: #f97316;"></i> setCookie - Đặt Cookie
**Công dụng**: Đặt cookie cho domain hiện tại.

### Parameters
- **name** (text): Tên cookie
- **value** (text): Giá trị cookie
- **domain** (text): Domain (optional)

### JSON Format
```json
{
  "id": "node-903",
  "type": "setCookie",
  "x": 500,
  "y": 1400,
  "params": {
    "name": "sessionId",
    "value": "abc123",
    "domain": "example.com"
  }
}
```

## <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i> checkConsoleErrors - Kiểm Tra Console Errors
**Công dụng**: Kiểm tra có lỗi JavaScript trong console không.

### JSON Format
```json
{
  "id": "node-904",
  "type": "checkConsoleErrors",
  "x": 700,
  "y": 1400,
  "params": {}
}
```

## <i class="fas fa-memory" style="color: #3b82f6;"></i> checkMemoryUsage - Kiểm Tra Bộ Nhớ
**Công dụng**: Kiểm tra mức sử dụng bộ nhớ của trang.

### JSON Format
```json
{
  "id": "node-905",
  "type": "checkMemoryUsage",
  "x": 900,
  "y": 1400,
  "params": {}
}
```

## <i class="fas fa-database" style="color: #14b8a6;"></i> checkLocalStorage - Kiểm Tra Local Storage
**Công dụng**: Kiểm tra giá trị trong localStorage.

### Parameters
- **key** (text): Key cần kiểm tra
- **value** (text): Giá trị mong đợi (optional)

### JSON Format
```json
{
  "id": "node-906",
  "type": "checkLocalStorage",
  "x": 100,
  "y": 1500,
  "params": {
    "key": "userPrefs",
    "value": "dark-mode"
  }
}
```

## <i class="fas fa-archive" style="color: #6366f1;"></i> checkSessionStorage - Kiểm Tra Session Storage
**Công dụng**: Kiểm tra giá trị trong sessionStorage.

### Parameters
- **key** (text): Key cần kiểm tra
- **value** (text): Giá trị mong đợi (optional)

### JSON Format
```json
{
  "id": "node-907",
  "type": "checkSessionStorage",
  "x": 300,
  "y": 1500,
  "params": {
    "key": "tempData",
    "value": "cached"
  }
}
```

## <i class="fas fa-globe" style="color: #059669;"></i> testCrossBrowser - Test Cross Browser
**Công dụng**: Test tương thích trên các trình duyệt khác nhau.

### Parameters
- **browsers** (text): Danh sách trình duyệt (chrome,firefox,safari)

### JSON Format
```json
{
  "id": "node-908",
  "type": "testCrossBrowser",
  "x": 500,
  "y": 1500,
  "params": {
    "browsers": "chrome,firefox,safari"
  }
}
```

## <i class="fas fa-wifi" style="color: #eab308;"></i> simulateNetworkCondition - Mô Phỏng Điều Kiện Mạng
**Công dụng**: Mô phỏng điều kiện mạng chậm hoặc mất kết nối.

### Parameters
- **condition** (text): Loại điều kiện (slow3g, fast3g, offline)

### JSON Format
```json
{
  "id": "node-909",
  "type": "simulateNetworkCondition",
  "x": 700,
  "y": 1500,
  "params": {
    "condition": "slow3g"
  }
}
```

---

# Hướng Dẫn Chung

## Nguyên Tắc Thiết Kế Workflow

### 1. Cấu Trúc Workflow
- **Bắt đầu**: Mọi workflow phải có một `start` node
- **Tuần tự**: Nodes được thực thi theo thứ tự kết nối
- **Rẽ nhánh**: Sử dụng `if` node cho logic điều kiện
- **Lặp**: Sử dụng `forEach` node cho các thao tác lặp lại
- **Kết thúc**: Workflow kết thúc khi không còn node nào để thực thi

### 2. Quản Lý Biến
- **Đặt tên**: Sử dụng tên biến có ý nghĩa (`userName`, `productCount`)
- **Scope**: Biến có thể sử dụng trong tất cả nodes sau khi được tạo
- **Reference**: Sử dụng `${variableName}` để tham chiếu biến
- **Type**: Hỗ trợ string, number, boolean, array

### 3. Selector Strategy
- **Ưu tiên ID**: `#unique-id` (độ ưu tiên cao nhất)
- **Class selectors**: `.class-name` 
- **Attribute selectors**: `[data-testid="value"]`
- **Hierarchy selectors**: `.parent .child`
- **Tránh**: XPath phức tạp, position-based selectors

### 4. Error Prevention
- **Validation**: Luôn kiểm tra element tồn tại trước khi tương tác
- **Timeouts**: Đặt timeout phù hợp cho wait operations
- **Fallbacks**: Có kế hoạch xử lý khi element không tìm thấy
- **Screenshots**: Chụp ảnh để debug khi cần thiết

## Best Practices

### Design Patterns
1. **Page Navigation Pattern**
   ```
   start → goto → waitElement → [page actions] → assertURL
   ```

2. **Form Filling Pattern**
   ```
   start → fill(field1) → fill(field2) → click(submit) → assertVisible(success)
   ```

3. **Data Extraction Pattern**
   ```
   start → getText → setVariable → [use variable] → screenshot
   ```

4. **Conditional Testing Pattern**
   ```
   start → getText → setVariable → if(condition) → [then/else actions]
   ```

### Naming Conventions
- **Nodes**: Sử dụng tên mô tả (`loginForm`, `submitButton`)
- **Variables**: camelCase (`userName`, `isLoggedIn`)
- **Selectors**: Rõ ràng, không phụ thuộc vào CSS framework

---

# Advanced Techniques

## Dynamic Content Handling

### 1. Chờ Dynamic Elements
```javascript
// Pattern: Wait → Check → Action
waitElement → assertVisible → click
```

### 2. Handling AJAX Requests
- Sử dụng `waitElement` cho loading indicators
- Chờ elements xuất hiện sau khi AJAX complete
- Kiểm tra network requests với `interceptNetwork`

### 3. Scroll và Lazy Loading
```javascript
// Pattern: Scroll → Wait → Extract
hover(trigger) → waitElement(content) → getText
```

## Complex Workflows

### 1. Multi-Step Forms
```javascript
start → goto(page1) → fill(step1) → click(next) → 
waitElement(page2) → fill(step2) → click(next) →
waitElement(page3) → fill(step3) → click(submit) →
assertText(success)
```

### 2. Data-Driven Testing
```javascript
start → setVariable(testData) → forEach(testData) →
fill(${currentItem.field}) → click(submit) →
assertText(${currentItem.expected})
```

### 3. Cross-Page Workflows
```javascript
start → goto(page1) → getText(data) → setVariable(extractedData) →
goto(page2) → fill(${extractedData}) → click(submit) →
assertURL(resultPage)
```

## API Integration

### 1. Mock API Responses
```javascript
start → mockAPI(endpoint, mockData) → goto(page) →
// Page sẽ nhận mock data thay vì real API
assertText(mockData.result)
```

### 2. Network Interception
```javascript
start → interceptNetwork(apiEndpoint, GET) →
goto(page) → // Kiểm tra request được gửi
assertVisible(loadingIndicator)
```

## Performance Optimization

### 1. Efficient Waiting
- Sử dụng `waitElement` thay vì `waitTimeout` khi có thể
- Đặt timeout ngắn nhưng hợp lý
- Combine multiple checks trong một assertion

### 2. Batch Operations
```javascript
// Thay vì nhiều assertions riêng lẻ:
assertVisible(element1) → assertVisible(element2) → assertVisible(element3)

// Sử dụng element count:
assertElementCount(.required-element, 3)
```

---

# Troubleshooting

## Lỗi Thường Gặp

### 1. Element Not Found
**Triệu chứng**: "Element not found" error
**Nguyên nhân**:
- Selector không chính xác
- Element chưa load xong
- Element bị ẩn bởi CSS

**Giải pháp**:
```javascript
// Thêm wait trước khi thao tác
waitElement(selector) → click(selector)

// Kiểm tra selector trong DevTools
// F12 → Console → document.querySelector('your-selector')

// Sử dụng screenshot để debug
screenshot(debug-image) → click(selector)
```

### 2. Timeout Issues
**Triệu chứng**: Workflow bị timeout
**Nguyên nhân**:
- Network chậm
- JavaScript execution chậm
- Element load chậm

**Giải pháp**:
```javascript
// Tăng timeout cho specific operations
waitElement(selector, 30000) // 30 seconds

// Sử dụng network simulation
simulateNetworkCondition(fast3g) → goto(page)

// Kiểm tra page speed
checkPageSpeed() → screenshot(performance-debug)
```

### 3. Variable Issues
**Triệu chứng**: Variable không hoạt động đúng
**Nguyên nhân**:
- Variable chưa được set
- Syntax không đúng
- Scope issues

**Giải pháp**:
```javascript
// Kiểm tra variable được set đúng
getText(element, myVar) → comment(Variable set: ${myVar})

// Debug variable value
setVariable(debugVar, ${myVar}) → screenshot(var-debug)

// Ensure variable exists before use
if(${myVar} != null) → fill(input, ${myVar})
```

### 4. Assertion Failures
**Triệu chứng**: Assertions fail khi không mong đợi
**Nguyên nhân**:
- Data thay đổi
- Timing issues
- Environment differences

**Giải pháp**:
```javascript
// Sử dụng partial text matching
assertContainsText(element, partial-text) thay vì assertText(element, exact-text)

// Thêm wait before assertion
waitElement(element) → assertVisible(element)

// Use screenshots for debugging
screenshot(before-assertion) → assertText(element, expected)
```

## Debug Techniques

### 1. Screenshot Strategy
```javascript
// At key points
start → screenshot(01-start) → goto(page) → 
screenshot(02-page-loaded) → fill(input) → 
screenshot(03-form-filled) → click(submit) → 
screenshot(04-after-submit)
```

### 2. Console Monitoring
```javascript
// Check for JavaScript errors
checkConsoleErrors() → screenshot(console-state)

// Monitor network requests
interceptNetwork(*) → goto(page) → screenshot(network-debug)
```

### 3. Step-by-Step Verification
```javascript
// Verify each step
start → assertVisible(startPage) → 
click(button) → assertVisible(nextPage) → 
fill(input) → assertAttribute(input, value, expected)
```

---

# Mẹo Sử Dụng

## Workflow Development

### 1. Phát Triển Từng Bước
- Bắt đầu với workflow đơn giản
- Test từng node một trước khi kết nối
- Thêm complexity dần dần
- Luôn có backup của working version

### 2. Tổ Chức Node
- Sắp xếp nodes theo logic flow
- Sử dụng `comment` nodes để giải thích
- Nhóm related nodes gần nhau
- Sử dụng consistent naming

### 3. Reusability
```javascript
// Tạo reusable patterns
// Login pattern: goto → fill(username) → fill(password) → click(login) → waitElement(dashboard)

// Navigation pattern: click(menu) → waitElement(submenu) → click(item)

// Form validation pattern: fill(invalid) → click(submit) → assertVisible(error)
```

## Testing Strategies

### 1. Happy Path Testing
```javascript
start → goto(app) → fill(validData) → click(submit) → assertText(success)
```

### 2. Error Path Testing
```javascript
start → goto(app) → fill(invalidData) → click(submit) → assertVisible(errorMessage)
```

### 3. Edge Case Testing
```javascript
// Empty inputs
start → goto(form) → click(submit) → assertVisible(requiredFieldError)

// Long inputs
start → setVariable(longText, very-long-string) → fill(input, ${longText}) → click(submit)

// Special characters
start → setVariable(specialChars, !@#$%^&*) → fill(input, ${specialChars}) → click(submit)
```

## Maintenance Tips

### 1. Regular Updates
- Cập nhật selectors khi UI thay đổi
- Test workflows trên môi trường mới
- Review và optimize performance
- Update expected values khi cần

### 2. Documentation
- Sử dụng `comment` nodes để document workflow
- Ghi chú về business logic
- Document known issues và workarounds
- Maintain changelog cho major updates

### 3. Version Control
- Export workflows thường xuyên
- Backup trước khi thay đổi lớn
- Test thoroughly trước khi deploy
- Có rollback plan

## Performance Optimization

### 1. Minimize Waits
```javascript
// Thay vì:
waitTimeout(5000) → click(button)

// Sử dụng:
waitElement(button) → click(button)
```

### 2. Efficient Selectors
```javascript
// Fast selectors
#id               // Fastest
.class            // Fast
[data-testid]     // Good
.parent > .child  // Moderate
.complex .nested .selector  // Slow
```

### 3. Batch Operations
```javascript
// Combine assertions
assertVisible(element1) AND assertText(element2) AND assertAttribute(element3)

// Group related actions
fill(field1) → fill(field2) → fill(field3) → click(submit)
```

## Common Patterns

### 1. Login Flow
```javascript
start → goto(loginPage) → 
fill(#username, testUser) → 
fill(#password, testPass) → 
click(#loginButton) → 
waitElement(.dashboard) → 
assertURL(dashboard-url)
```

### 2. Search Flow
```javascript
start → goto(searchPage) → 
fill(#searchInput, query) → 
press(Enter) → 
waitElement(.search-results) → 
assertElementCount(.result-item, expectedCount)
```

### 3. Form Submission
```javascript
start → goto(formPage) → 
fill(#field1, value1) → 
selectOption(#dropdown, option) → 
setCheckboxState(#checkbox, true) → 
click(#submit) → 
waitElement(.success-message) → 
assertContainsText(.success-message, success)
```