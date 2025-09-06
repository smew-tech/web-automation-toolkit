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

# ĐIỀU KHIỂN

## if - Điều Kiện
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

---

## forEach - Vòng Lặp
**Công dụng**: Lặp qua mảng hoặc thực hiện một số lần nhất định.

### Parameters
- **list** (text): Tên biến mảng hoặc số lần lặp
  - *Ví dụ*: `myArray`, `5`, `productList`
- **variable** (text): Tên biến chứa từng phần tử trong vòng lặp
  - *Ví dụ*: `item`, `product`, `user`

### JSON Format
```json
{
  "id": "node-124",
  "type": "forEach",
  "x": 300,
  "y": 200,
  "params": {
    "list": "productList",
    "variable": "product"
  }
}
```

### Ports
- **Input**: Nhận từ node trước
- **Loop Body**: Nội dung được lặp lại
- **Output**: Tiếp tục sau khi hoàn thành vòng lặp

---

## setVariable - Đặt Biến
**Công dụng**: Tạo hoặc cập nhật giá trị cho biến để sử dụng trong workflow.

### Parameters
- **variable** (text): Tên biến
  - *Ví dụ*: `counter`, `userName`, `baseURL`
- **value** (text): Giá trị gán cho biến
  - *Ví dụ*: `"admin"`, `0`, `"https://example.com"`

### JSON Format
```json
{
  "id": "node-125",
  "type": "setVariable",
  "x": 500,
  "y": 200,
  "params": {
    "variable": "userName",
    "value": "admin123"
  }
}
```

---

## stop - Dừng
**Công dụng**: Dừng thực thi workflow tại điểm này.

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

---

## comment - Ghi Chú
**Công dụng**: Thêm ghi chú, nhận xét cho workflow (không ảnh hưởng đến thực thi).

### Parameters
- **text** (text): Nội dung ghi chú
  - *Ví dụ*: `"Bước này kiểm tra đăng nhập"`, `"TODO: Thêm validation"`

### JSON Format
```json
{
  "id": "node-127",
  "type": "comment",
  "x": 900,
  "y": 200,
  "params": {
    "text": "Kiểm tra login thành công"
  }
}
```

---

# ĐIỀU HƯỚNG

## goto - Đi Tới
**Công dụng**: Điều hướng browser đến một URL cụ thể.

### Parameters
- **url** (text): URL đích
  - *Ví dụ*: `"https://google.com"`, `"http://localhost:3000/login"`

### JSON Format
```json
{
  "id": "node-201",
  "type": "goto",
  "x": 100,
  "y": 300,
  "params": {
    "url": "https://example.com/dashboard"
  }
}
```

---

## reload - Tải Lại
**Công dụng**: Refresh trang hiện tại.

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

---

## goBack - Quay Lại
**Công dụng**: Quay lại trang trước đó trong history.

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

---

## goForward - Tiến Tới
**Công dụng**: Tiến tới trang kế tiếp trong history.

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

# TƯƠNG TÁC

## click - Nhấp
**Công dụng**: Click vào element trên trang.

### Parameters
- **selector** (selector): CSS selector của element cần click
  - *Ví dụ*: `"#login-button"`, `".submit-btn"`, `"button[type='submit']"`
- **type** (select): Loại click
  - **left**: Click chuột trái (mặc định)
  - **right**: Click chuột phải
  - **double**: Double click

### JSON Format
```json
{
  "id": "node-301",
  "type": "click",
  "x": 100,
  "y": 400,
  "params": {
    "selector": "#login-button",
    "type": "left"
  }
}
```

---

## fill - Điền
**Công dụng**: Nhập text vào input field.

### Parameters
- **selector** (selector): CSS selector của input field
- **value** (text): Nội dung cần nhập
  - *Ví dụ*: `"admin@example.com"`, `"password123"`

### JSON Format
```json
{
  "id": "node-302",
  "type": "fill",
  "x": 300,
  "y": 400,
  "params": {
    "selector": "#email",
    "value": "user@test.com"
  }
}
```

---

## clearInput - Xóa Input
**Công dụng**: Xóa nội dung của input field.

### Parameters
- **selector** (selector): CSS selector của input field cần xóa

### JSON Format
```json
{
  "id": "node-303",
  "type": "clearInput",
  "x": 500,
  "y": 400,
  "params": {
    "selector": "#search-box"
  }
}
```

---

## setCheckboxState - Trạng Thái Checkbox
**Công dụng**: Đặt trạng thái checked/unchecked cho checkbox.

### Parameters
- **selector** (selector): CSS selector của checkbox
- **state** (select): Trạng thái mong muốn
  - **check**: Đánh dấu checkbox
  - **uncheck**: Bỏ đánh dấu checkbox

### JSON Format
```json
{
  "id": "node-304",
  "type": "setCheckboxState",
  "x": 700,
  "y": 400,
  "params": {
    "selector": "#agree-terms",
    "state": "check"
  }
}
```

---

## selectOption - Chọn Tùy Chọn
**Công dụng**: Chọn option trong dropdown/select.

### Parameters
- **selector** (selector): CSS selector của select element
- **value** (text): Giá trị của option cần chọn

### JSON Format
```json
{
  "id": "node-305",
  "type": "selectOption",
  "x": 900,
  "y": 400,
  "params": {
    "selector": "#country",
    "value": "Vietnam"
  }
}
```

---

## hover - Di Chuột
**Công dụng**: Hover chuột lên element (để hiện dropdown menu, tooltip...).

### Parameters
- **selector** (selector): CSS selector của element cần hover

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

---

## press - Nhấn Phím
**Công dụng**: Nhấn phím bàn phím.

### Parameters
- **selector** (selector): CSS selector của element đang focus (tùy chọn)
- **key** (text): Tên phím cần nhấn
  - *Ví dụ*: `"Enter"`, `"Tab"`, `"Escape"`, `"Space"`, `"ArrowDown"`

### JSON Format
```json
{
  "id": "node-307",
  "type": "press",
  "x": 300,
  "y": 500,
  "params": {
    "selector": "#search-input",
    "key": "Enter"
  }
}
```

---

## uploadFile - Tải File
**Công dụng**: Upload file thông qua input[type="file"].

### Parameters
- **selector** (selector): CSS selector của file input
- **filePath** (text): Đường dẫn đầy đủ đến file
  - *Ví dụ*: `"C:\\Users\\Documents\\test.pdf"`, `"/home/user/image.jpg"`

### JSON Format
```json
{
  "id": "node-308",
  "type": "uploadFile",
  "x": 500,
  "y": 500,
  "params": {
    "selector": "input[type='file']",
    "filePath": "C:\\Documents\\resume.pdf"
  }
}
```

---

# CHỜ ĐỢI

## waitTimeout - Chờ Thời Gian
**Công dụng**: Chờ một khoảng thời gian cố định.

### Parameters
- **timeout** (number): Thời gian chờ tính bằng milliseconds
  - *Ví dụ*: `1000` (1 giây), `5000` (5 giây)

### JSON Format
```json
{
  "id": "node-401",
  "type": "waitTimeout",
  "x": 100,
  "y": 600,
  "params": {
    "timeout": "3000"
  }
}
```

---

## waitElement - Chờ Element
**Công dụng**: Chờ cho đến khi element xuất hiện trên trang.

### Parameters
- **selector** (selector): CSS selector của element cần chờ

### JSON Format
```json
{
  "id": "node-402",
  "type": "waitElement",
  "x": 300,
  "y": 600,
  "params": {
    "selector": ".loading-complete"
  }
}
```

---

# DỮ LIỆU

## getText - Lấy Văn Bản
**Công dụng**: Trích xuất text content từ element và lưu vào biến.

### Parameters
- **selector** (selector): CSS selector của element chứa text
- **variable** (text): Tên biến để lưu text

### JSON Format
```json
{
  "id": "node-501",
  "type": "getText",
  "x": 100,
  "y": 700,
  "params": {
    "selector": "h1.page-title",
    "variable": "pageTitle"
  }
}
```

---

## getAttribute - Lấy Thuộc Tính
**Công dụng**: Trích xuất giá trị attribute từ element.

### Parameters
- **selector** (selector): CSS selector của element
- **attribute** (text): Tên attribute cần lấy
  - *Ví dụ*: `"href"`, `"src"`, `"data-id"`, `"class"`
- **variable** (text): Tên biến để lưu giá trị

### JSON Format
```json
{
  "id": "node-502",
  "type": "getAttribute",
  "x": 300,
  "y": 700,
  "params": {
    "selector": "a.product-link",
    "attribute": "href",
    "variable": "productURL"
  }
}
```

---

## getInputValue - Lấy Giá Trị Input
**Công dụng**: Lấy giá trị hiện tại của input field.

### Parameters
- **selector** (selector): CSS selector của input
- **variable** (text): Tên biến để lưu giá trị

### JSON Format
```json
{
  "id": "node-503",
  "type": "getInputValue",
  "x": 500,
  "y": 700,
  "params": {
    "selector": "#user-name",
    "variable": "currentUserName"
  }
}
```

---

## screenshot - Chụp Ảnh
**Công dụng**: Chụp ảnh màn hình hoặc element cụ thể.

### Parameters
- **filename** (text): Tên file ảnh
  - *Ví dụ*: `"homepage.png"`, `"login-error.jpg"`
- **selector** (selector, optional): CSS selector của element cần chụp (để trống = chụp toàn màn hình)

### JSON Format
```json
{
  "id": "node-504",
  "type": "screenshot",
  "x": 700,
  "y": 700,
  "params": {
    "filename": "dashboard.png",
    "selector": ".main-content"
  }
}
```

---

# KIỂM TRA

## Kiểm Tra Cơ Bản (Basic Assertions)

### assertVisible - Kiểm Tra Hiển Thị
**Công dụng**: Xác minh element có hiển thị trên trang không.

#### Parameters
- **selector** (selector): CSS selector của element cần kiểm tra

#### JSON Format
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

---

### assertText - Kiểm Tra Văn Bản
**Công dụng**: Xác minh text content của element.

#### Parameters
- **selector** (selector): CSS selector của element
- **text** (text): Text mong đợi

#### JSON Format
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

---

### assertURL - Kiểm Tra URL
**Công dụng**: Xác minh URL hiện tại của trang.

#### Parameters
- **expectedURL** (text): URL mong đợi

#### JSON Format
```json
{
  "id": "node-603",
  "type": "assertURL",
  "x": 500,
  "y": 800,
  "params": {
    "expectedURL": "https://example.com/dashboard"
  }
}
```

---

### assertTitle - Kiểm Tra Tiêu Đề
**Công dụng**: Xác minh title của trang web.

#### Parameters
- **expectedTitle** (text): Title mong đợi

#### JSON Format
```json
{
  "id": "node-604",
  "type": "assertTitle",
  "x": 700,
  "y": 800,
  "params": {
    "expectedTitle": "Dashboard - My App"
  }
}
```

---

### assertAttribute - Kiểm Tra Thuộc Tính
**Công dụng**: Xác minh giá trị attribute của element.

#### Parameters
- **selector** (selector): CSS selector của element
- **attribute** (text): Tên attribute
- **expectedValue** (text): Giá trị mong đợi

#### JSON Format
```json
{
  "id": "node-605",
  "type": "assertAttribute",
  "x": 900,
  "y": 800,
  "params": {
    "selector": "input[name='email']",
    "attribute": "type",
    "expectedValue": "email"
  }
}
```

---

### assertElementCount - Kiểm Tra Số Lượng Element
**Công dụng**: Xác minh số lượng elements matching selector.

#### Parameters
- **selector** (selector): CSS selector
- **operator** (select): Toán tử so sánh
  - **equals**: Bằng (=)
  - **greater**: Lớn hơn (>)
  - **less**: Nhỏ hơn (<)
  - **greaterEqual**: Lớn hơn hoặc bằng (>=)
  - **lessEqual**: Nhỏ hơn hoặc bằng (<=)
- **expectedCount** (number): Số lượng mong đợi

#### JSON Format
```json
{
  "id": "node-606",
  "type": "assertElementCount",
  "x": 100,
  "y": 900,
  "params": {
    "selector": ".product-card",
    "operator": "greater",
    "expectedCount": "5"
  }
}
```

---

### assertNotVisible - Kiểm Tra Không Hiển Thị
**Công dụng**: Xác minh element không hiển thị hoặc không tồn tại.

#### Parameters
- **selector** (selector): CSS selector của element

#### JSON Format
```json
{
  "id": "node-607",
  "type": "assertNotVisible",
  "x": 300,
  "y": 900,
  "params": {
    "selector": ".loading-spinner"
  }
}
```

---

### assertContainsText - Kiểm Tra Chứa Văn Bản
**Công dụng**: Xác minh element chứa một phần text.

#### Parameters
- **selector** (selector): CSS selector của element
- **containsText** (text): Text một phần cần tìm

#### JSON Format
```json
{
  "id": "node-608",
  "type": "assertContainsText",
  "x": 500,
  "y": 900,
  "params": {
    "selector": ".error-message",
    "containsText": "required field"
  }
}
```

---

## Kiểm Tra Nâng Cao (Advanced Assertions)

### assertEnabled - Kiểm Tra Kích Hoạt
**Công dụng**: Xác minh element có thể tương tác được (không bị disabled).

#### Parameters
- **selector** (selector): CSS selector của element cần kiểm tra

#### JSON Format
```json
{
  "id": "node-609",
  "type": "assertEnabled",
  "x": 700,
  "y": 900,
  "params": {
    "selector": "#submit-button"
  }
}
```

---

### assertDisabled - Kiểm Tra Vô Hiệu Hóa
**Công dụng**: Xác minh element bị vô hiệu hóa (disabled).

#### Parameters
- **selector** (selector): CSS selector của element cần kiểm tra

#### JSON Format
```json
{
  "id": "node-610",
  "type": "assertDisabled",
  "x": 900,
  "y": 900,
  "params": {
    "selector": "#checkout-button"
  }
}
```

---

### assertChecked - Kiểm Tra Được Chọn
**Công dụng**: Xác minh checkbox/radio button đã được chọn.

#### Parameters
- **selector** (selector): CSS selector của checkbox/radio

#### JSON Format
```json
{
  "id": "node-611",
  "type": "assertChecked",
  "x": 100,
  "y": 1000,
  "params": {
    "selector": "input[name='terms']"
  }
}
```

---

### assertUnchecked - Kiểm Tra Không Được Chọn
**Công dụng**: Xác minh checkbox/radio button chưa được chọn.

#### Parameters
- **selector** (selector): CSS selector của checkbox/radio

#### JSON Format
```json
{
  "id": "node-612",
  "type": "assertUnchecked",
  "x": 300,
  "y": 1000,
  "params": {
    "selector": "input[name='newsletter']"
  }
}
```

---

### assertCSSProperty - Kiểm Tra CSS
**Công dụng**: Xác minh CSS property của element.

#### Parameters
- **selector** (selector): CSS selector của element
- **property** (text): Tên CSS property (ví dụ: "color", "display")
- **expectedValue** (text): Giá trị CSS mong đợi

#### JSON Format
```json
{
  "id": "node-613",
  "type": "assertCSSProperty",
  "x": 500,
  "y": 1000,
  "params": {
    "selector": ".error-message",
    "property": "color",
    "expectedValue": "rgb(255, 0, 0)"
  }
}
```

---

## Đảm Bảo Chất Lượng (Quality Assurance)

### validateForm - Kiểm Tra Form
**Công dụng**: Xác minh tính hợp lệ của form và các trường bắt buộc.

#### Parameters
- **formSelector** (selector): CSS selector của form
- **requiredFields** (text): Danh sách các trường bắt buộc (phân cách bởi dấu phẩy)

#### JSON Format
```json
{
  "id": "node-701",
  "type": "validateForm",
  "x": 700,
  "y": 1000,
  "params": {
    "formSelector": "#registration-form",
    "requiredFields": "name,email,password"
  }
}
```

---

### checkBrokenLinks - Kiểm Tra Link Hỏng
**Công dụng**: Kiểm tra tất cả links trên trang có hoạt động không.

#### Parameters
- **containerSelector** (selector, optional): CSS selector của vùng chứa links (để trống = toàn trang)

#### JSON Format
```json
{
  "id": "node-702",
  "type": "checkBrokenLinks",
  "x": 900,
  "y": 1000,
  "params": {
    "containerSelector": ".main-content"
  }
}
```

---

### checkImageLoading - Kiểm Tra Tải Hình
**Công dụng**: Xác minh tất cả hình ảnh trên trang được tải thành công.

#### JSON Format
```json
{
  "id": "node-703",
  "type": "checkImageLoading",
  "x": 100,
  "y": 1100,
  "params": {}
}
```

---

### checkPageSpeed - Kiểm Tra Tốc Độ
**Công dụng**: Đo thời gian load trang và các metrics hiệu suất.

#### Parameters
- **maxLoadTime** (number): Thời gian load tối đa cho phép (ms)

#### JSON Format
```json
{
  "id": "node-704",
  "type": "checkPageSpeed",
  "x": 300,
  "y": 1100,
  "params": {
    "maxLoadTime": "3000"
  }
}
```

---

### checkResponsive - Kiểm Tra Responsive
**Công dụng**: Test giao diện trên các kích thước màn hình khác nhau.

#### Parameters
- **viewports** (text): Danh sách kích thước màn hình (width,height)

#### JSON Format
```json
{
  "id": "node-705",
  "type": "checkResponsive",
  "x": 500,
  "y": 1100,
  "params": {
    "viewports": "320,568;768,1024;1920,1080"
  }
}
```

---

### checkAccessibility - Kiểm Tra Khả Năng Tiếp Cận
**Công dụng**: Đánh giá tính accessibility của trang web.

#### JSON Format
```json
{
  "id": "node-706",
  "type": "checkAccessibility",
  "x": 700,
  "y": 1100,
  "params": {}
}
```

---

### checkSEO - Kiểm Tra SEO
**Công dụng**: Đánh giá các yếu tố SEO cơ bản của trang.

#### JSON Format
```json
{
  "id": "node-707",
  "type": "checkSEO",
  "x": 900,
  "y": 1100,
  "params": {}
}
```

---

## Mạng & Hiệu Suất (Network & Performance)

### interceptNetwork - Chặn Mạng
**Công dụng**: Theo dõi và can thiệp các request mạng.

#### Parameters
- **urlPattern** (text): Pattern URL cần chặn (regex supported)
- **action** (select): Hành động thực hiện
  - **block**: Chặn request
  - **modify**: Chỉnh sửa request
  - **monitor**: Chỉ theo dõi

#### JSON Format
```json
{
  "id": "node-801",
  "type": "interceptNetwork",
  "x": 100,
  "y": 1200,
  "params": {
    "urlPattern": "**/api/analytics",
    "action": "block"
  }
}
```

---

### setCookie - Đặt Cookie
**Công dụng**: Tạo hoặc cập nhật cookie trong browser.

#### Parameters
- **name** (text): Tên cookie
- **value** (text): Giá trị cookie
- **domain** (text, optional): Domain cho cookie

#### JSON Format
```json
{
  "id": "node-802",
  "type": "setCookie",
  "x": 300,
  "y": 1200,
  "params": {
    "name": "sessionToken",
    "value": "abc123xyz",
    "domain": ".example.com"
  }
}
```

---

### checkConsoleErrors - Kiểm Tra Lỗi Console
**Công dụng**: Kiểm tra các lỗi JavaScript trong browser console.

#### JSON Format
```json
{
  "id": "node-803",
  "type": "checkConsoleErrors",
  "x": 500,
  "y": 1200,
  "params": {}
}
```

---

### checkMemoryUsage - Kiểm Tra Bộ Nhớ
**Công dụng**: Theo dõi mức sử dụng memory của trang.

#### Parameters
- **maxMemoryMB** (number): Mức memory tối đa cho phép (MB)

#### JSON Format
```json
{
  "id": "node-804",
  "type": "checkMemoryUsage",
  "x": 700,
  "y": 1200,
  "params": {
    "maxMemoryMB": "100"
  }
}
```

---

### checkLocalStorage - Kiểm Tra Local Storage
**Công dụng**: Xác minh dữ liệu trong localStorage.

#### Parameters
- **key** (text): Key cần kiểm tra
- **expectedValue** (text, optional): Giá trị mong đợi

#### JSON Format
```json
{
  "id": "node-805",
  "type": "checkLocalStorage",
  "x": 900,
  "y": 1200,
  "params": {
    "key": "userPreferences",
    "expectedValue": "{\"theme\":\"dark\"}"
  }
}
```

---

### checkSessionStorage - Kiểm Tra Session Storage
**Công dụng**: Xác minh dữ liệu trong sessionStorage.

#### Parameters
- **key** (text): Key cần kiểm tra
- **expectedValue** (text, optional): Giá trị mong đợi

#### JSON Format
```json
{
  "id": "node-806",
  "type": "checkSessionStorage",
  "x": 100,
  "y": 1300,
  "params": {
    "key": "cartItems",
    "expectedValue": "[{\"id\":1,\"qty\":2}]"
  }
}
```

---

### testCrossBrowser - Kiểm Tra Đa Trình Duyệt
**Công dụng**: Test tương thích trên nhiều browsers khác nhau.

#### Parameters
- **browsers** (text): Danh sách browsers (chrome,firefox,safari,edge)

#### JSON Format
```json
{
  "id": "node-807",
  "type": "testCrossBrowser",
  "x": 300,
  "y": 1300,
  "params": {
    "browsers": "chrome,firefox,edge"
  }
}
```

---

### simulateNetworkCondition - Mô Phỏng Mạng
**Công dụng**: Mô phỏng các điều kiện mạng khác nhau (3G, 4G, slow...).

#### Parameters
- **condition** (select): Điều kiện mạng
  - **fast3G**: Mạng 3G nhanh
  - **slow3G**: Mạng 3G chậm
  - **offline**: Không có mạng
  - **custom**: Tùy chỉnh

#### JSON Format
```json
{
  "id": "node-808",
  "type": "simulateNetworkCondition",
  "x": 500,
  "y": 1300,
  "params": {
    "condition": "slow3G"
  }
}
```

---

# Mẹo Sử Dụng

## CSS Selectors Thông Dụng
- **ID**: `#elementId`
- **Class**: `.className`
- **Attribute**: `[attribute="value"]`
- **Descendant**: `.parent .child`
- **Direct child**: `.parent > .child`
- **Multiple classes**: `.class1.class2`
- **Nth child**: `:nth-child(2)`
- **Contains text**: `:contains("text")`

## Biểu Thức Điều Kiện
- **So sánh**: `==`, `!=`, `>`, `<`, `>=`, `<=`
- **Logic**: `&&` (và), `||` (hoặc), `!` (không)
- **Chuỗi**: `variable.includes("text")`
- **Number**: `parseInt(variable) > 10`

## Best Practices
1. **Đặt tên biến rõ ràng**: `userName` thay vì `var1`
2. **Sử dụng CSS selector cụ thể**: Tránh selector quá chung chung
3. **Thêm wait nodes**: Đợi elements load trước khi tương tác
4. **Screenshot quan trọng**: Chụp ảnh ở các bước quan trọng để debug
5. **Comments**: Thêm ghi chú cho workflow phức tạp
6. **Error handling**: Sử dụng assert nodes để validate kết quả

## Workflow Structure Example
```
[Start] → [Goto URL] → [Wait Element] → [Fill Login] → [Click Submit] 
    → [Assert Success] → [Screenshot] → [End]
```

---

# TROUBLESHOOTING

## Lỗi Thường Gặp

### Element Not Found
- **Nguyên nhân**: CSS selector không chính xác hoặc element chưa load
- **Giải pháp**: Kiểm tra selector, thêm `waitElement` trước khi tương tác

### Timeout Error
- **Nguyên nhân**: Element không xuất hiện trong thời gian chờ
- **Giải pháp**: Tăng timeout hoặc kiểm tra điều kiện load

### Click Failed
- **Nguyên nhân**: Element bị che khuất hoặc không clickable
- **Giải pháp**: Scroll đến element, sử dụng `hover` trước khi click

### Variable Not Found
- **Nguyên nhân**: Biến chưa được khởi tạo hoặc tên sai
- **Giải pháp**: Kiểm tra `setVariable` đã chạy trước đó chưa

---

# ADVANCED TECHNIQUES  

## Dynamic Selectors
Sử dụng biến trong selector:
```
selector: "input[name='" + variableName + "']"
```

## Conditional Workflows
Sử dụng `if` node để tạo luồng điều kiện phức tạp:
```
if (pageTitle == "Login") → fillLoginForm
else → skipLogin
```

## Data-Driven Testing
Sử dụng `forEach` với array data:
```javascript
testData = ["user1", "user2", "user3"]
forEach(testData) → testLogin(currentUser)
```

## Error Handling Patterns
```
action → assert → onSuccess → continue
       ↘ onFail → screenshot → stop
```

---

*Tài liệu này được cập nhật liên tục. Để biết thêm thông tin, vui lòng tham khảo source code hoặc liên hệ support team.*