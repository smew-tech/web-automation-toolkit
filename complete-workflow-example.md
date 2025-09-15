# Complete 4-Step Login Workflow

## Workflow chính xác theo yêu cầu:

### **Bước 1: Khởi tạo và Nhập liệu**

**1.1 Go to URL**
```
Type: goto
URL: https://example.com/login
```

**1.2 Fill Input - Số điện thoại**
```
Type: fill
Selector: #phoneNumber
Value: 0123456789
```

**1.3 Session Cache - Lưu dữ liệu với {{Node_ID.output_field}} format**
```
Type: sessionCache
Cache Name: user_session
Input Elements Capture:
  #phoneNumber -> phone
  #email -> email
  #username -> user_name
From Previous Nodes:
  {{getText_1.text}} -> extracted_text
  {{getAttribute_1.value}} -> page_url
  {{inputText_1.value}} -> user_input
System Data:
  current_url -> page_url
  timestamp -> login_time
  page_title -> page_name
Custom Data:
  browser_type -> chrome
  source -> automation
```
*Tạo sessionCache_1.phone, sessionCache_1.email, sessionCache_1.login_time, etc.*

---

### **Bước 2: Đăng nhập**

**2.1 Fill Input - Mật khẩu**
```
Type: fill
Selector: #password
Value: mypassword123
```

**2.2 Click Login**
```
Type: click
Selector: #loginButton
Click Type: left
```

**2.3 Wait for Success**
```
Type: waitElement
Selector: .login-success
```

---

### **Bước 3: Gửi Yêu Cầu Dữ Liệu (API Request)**

**3.1 Custom API Request - Sử dụng {{Node_ID.output_field}} format**
```
Type: customApiRequest
Method: POST
API URL: https://api.example.com/user/register
Headers:
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_API_TOKEN"
}
Body Template:
{
  "phone": "{{sessionCache_1.phone}}",
  "loginTime": "{{sessionCache_1.login_time}}",
  "pageUrl": "{{sessionCache_1.page_url}}",
  "extractedText": "{{sessionCache_1.extracted_text}}",
  "additionalInfo": {
    "browser": "{{sessionCache_1.browser_type}}",
    "source": "{{sessionCache_1.source}}"
  }
}
Node References:
  {{sessionCache_1.phone}}
  {{sessionCache_1.login_time}}
  {{sessionCache_1.page_url}}
  {{sessionCache_1.browser_type}}
Save Response to Cache: api_response
Response Mapping:
  data.userId -> user_id
  data.status -> api_status
  data.token -> auth_token
```
*Lấy dữ liệu từ sessionCache_1 và lưu response vào apiRequest_1.response*

---

### **Bước 4: Xử lý và Lưu trữ Dữ liệu**

**4.1 Response Processor - Xử lý với {{Node_ID.output_field}} format**
```
Type: responseProcessor
Input from Node: {{apiRequest_1.response}}
Extract and Save:
  data.userId -> user_id
  data.status -> api_status
  data.profile.name -> user_name
  data.token -> auth_token
  data.profile.email -> user_email
Output Cache Name: processed_data
Validation Rules:
  REQUIRED: data.userId
  REQUIRED: data.status
  EQUALS: data.status -> success
  NOT_EMPTY: data.token
On Validation Fail: stop
```
*Lấy từ apiRequest_1.response và tạo processResponse_1.user_id, processResponse_1.api_status, etc.*

**4.2 Storage Settings - Sử dụng multiple Node references**
```
Type: storageSettings
Storage Type: both
Data Sources from Nodes:
  {{sessionCache_1}}
  {{processResponse_1}}
  {{apiRequest_1}}
Database Config:
  Server: localhost:3306
  Database: userdb
  Table: registered_users
  Username: dbuser
  Password: dbpass
Excel Config:
  File: /path/to/users.xlsx
  Sheet: UserData
  StartRow: 1
Data Mapping:
  {{sessionCache_1.phone}} -> phone_column
  {{processResponse_1.user_id}} -> user_id_column
  {{sessionCache_1.login_time}} -> created_at
  {{processResponse_1.api_status}} -> status_column
  {{processResponse_1.user_email}} -> email_column
On Success: continue
```
*Lấy dữ liệu từ nhiều Node khác nhau để lưu vào database/excel*

---

## **🔑 Node ID Referencing System:**

### **Format: {{Node_ID.output_field}}**
- **Node_ID**: ID duy nhất của node (vd: sessionCache_1, apiRequest_1, processResponse_1)
- **output_field**: Tên field cụ thể trong output của node (vd: phone, user_id, response)

### **Ví dụ thực tế:**
```
{{sessionCache_1.phone}}          // SĐT từ session cache
{{sessionCache_1.login_time}}     // Timestamp khi login
{{apiRequest_1.response}}         // Response từ API request
{{processResponse_1.user_id}}     // User ID đã xử lý
{{inputText_1.value}}             // Giá trị từ input text
```

### **Cách Worker xử lý:**
1. **Tạo node ID**: Mỗi node được tạo sẽ có ID duy nhất như sessionCache_1, apiRequest_1
2. **Tham chiếu**: Sử dụng {{Node_ID.field}} để lấy dữ liệu từ node khác
3. **Multiple references**: Có thể tham chiếu từ nhiều node khác nhau
4. **Data chaining**: processResponse_1.user_id được tạo từ apiRequest_1.response

---

## **Ưu điểm của hệ thống mới:**

### **🎯 Session Cache (Node 1)**
- **Tự động thu thập**: Không cần thiết lập thủ công
- **Linh hoạt**: All inputs, specific inputs, hoặc form data
- **Tích lũy dữ liệu**: Lưu trữ qua nhiều bước workflow
- **Metadata**: Tự động lấy URL, timestamp, page title

### **🚀 Custom API Request (Node 2)** 
- **Template syntax đơn giản**: `{{fieldName}}` thay vì phức tạp
- **Tích hợp session**: Tự động lấy dữ liệu từ Session Cache
- **Visual body builder**: Dễ tùy biến request
- **Headers linh hoạt**: Hỗ trợ authentication

### **⚙️ Response Processor (Node 3)**
- **Extract fields**: Lấy dữ liệu cần thiết từ response
- **Validation**: Kiểm tra response có hợp lệ không
- **Success condition**: Điều kiện để workflow tiếp tục
- **Error handling**: Xử lý khi response không như mong đợi

### **💾 Storage Settings (Node 4)**
- **Multiple destinations**: Database, Excel, hoặc cả hai
- **Flexible mapping**: Ánh xạ field theo ý muốn
- **Connection settings**: Cấu hình kết nối riêng biệt
- **Success actions**: Quyết định làm gì sau khi lưu thành công

---

## **Workflow JSON Output cho Worker:**

```json
{
  "nodes": [
    {
      "id": "node_1",
      "type": "goto",
      "params": {"url": "https://example.com/login"}
    },
    {
      "id": "node_2", 
      "type": "fill",
      "params": {"selector": "#phoneNumber", "value": "0123456789"}
    },
    {
      "id": "node_3",
      "type": "sessionCache",
      "params": {
        "autoCapture": "all_inputs",
        "inputSelectors": "#phoneNumber\n#email",
        "additionalData": "current_url\ntimestamp\npage_title",
        "sessionName": "userLoginSession"
      }
    },
    {
      "id": "node_4",
      "type": "customApiRequest", 
      "params": {
        "method": "POST",
        "url": "https://api.example.com/user/register",
        "useSessionData": "yes",
        "sessionName": "userLoginSession",
        "customBody": "{\n  \"phone\": \"{{phoneNumber}}\",\n  \"timestamp\": \"{{timestamp}}\"\n}"
      }
    },
    {
      "id": "node_5",
      "type": "responseProcessor",
      "params": {
        "responseSource": "customApiRequest_response",
        "extractFields": "data.userId\ndata.status",
        "validateResponse": "yes",
        "successCondition": "data.status == \"success\""
      }
    },
    {
      "id": "node_6",
      "type": "storageSettings",
      "params": {
        "storageType": "both",
        "databaseConfig": "Server: localhost:3306\nDatabase: userdb",
        "dataMapping": "phoneNumber -> phone_column\nuserId -> user_id_column"
      }
    }
  ],
  "connections": [
    {"fromNode": "node_1", "toNode": "node_2"},
    {"fromNode": "node_2", "toNode": "node_3"},
    {"fromNode": "node_3", "toNode": "node_4"},
    {"fromNode": "node_4", "toNode": "node_5"},
    {"fromNode": "node_5", "toNode": "node_6"}
  ]
}
```

Đây là workflow hoàn chỉnh, đơn giản và dễ hiểu cho worker thực thi!