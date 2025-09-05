# 🎯 Element Selector Chrome Extension

Extension Chrome giúp người dùng non-tech chọn element và copy selector một cách dễ dàng mà không cần phải inspect element.

## ✨ Tính Năng

- **Chọn element dễ dàng**: Chỉ cần di chuyển chuột và click
- **Tự động copy selector**: Selector được copy vào clipboard tự động
- **Không cần inspect**: Không cần mở Developer Tools
- **Visual feedback**: Element được highlight khi hover
- **Tutorial tích hợp**: Hướng dẫn sử dụng ngay trong extension
- **Tối ưu selector**: Ưu tiên ID > Class > Full selector

## 📦 Cài Đặt

### Cách 1: Load Extension Local (Hiện tại)

1. Mở Chrome và truy cập `chrome://extensions/`
2. Bật **Developer mode** ở góc trên bên phải
3. Click **"Load unpacked"**
4. Chọn thư mục chứa extension này
5. Extension sẽ xuất hiện trên toolbar Chrome

### Cách 2: Chrome Web Store (Sắp tới)

Extension sẽ sớm được đăng tải lên Chrome Web Store để cài đặt với 1 click.

## 🚀 Cách Sử Dụng

1. **Mở extension**: Click vào icon extension trên toolbar
2. **Đọc hướng dẫn**: Tutorial có sẵn ngay trong popup
3. **Bật chế độ chọn**: Click "Bắt đầu chọn element"
4. **Chọn element**: Di chuyển chuột qua các element (sẽ được highlight)
5. **Copy selector**: Click vào element muốn lấy selector
6. **Sử dụng**: Selector đã được copy, paste vào nơi cần dùng

### Phím Tắt

- **ESC**: Thoát chế độ chọn element

## 📁 Cấu Trúc Files

```
extension/
├── manifest.json       # Manifest của extension
├── popup.html         # Giao diện popup
├── popup.css          # Styling cho popup
├── popup.js           # Logic popup
├── content.js         # Script chạy trên trang web
├── content.css        # Styling cho highlight
├── background.js      # Background script
├── index.html         # Trang giới thiệu
├── icon.png          # Icon extension
└── README.md         # File này
```

## 🛠️ Công Nghệ

- **Manifest V3**: Sử dụng Chrome Extension Manifest V3 mới nhất
- **Vanilla JavaScript**: Không dependencies, chạy nhanh
- **CSS3**: Animations và styling đẹp mắt
- **Chrome APIs**: activeTab, storage permissions

## 📋 Permissions

- `activeTab`: Truy cập tab hiện tại để chọn element
- `storage`: Lưu trạng thái extension

## 🎨 Tính Năng Nổi Bật

### 1. Smart Selector Generation
- Ưu tiên ID selector (#id)
- Fallback sang class selector (.class)
- Tạo full CSS selector khi cần thiết

### 2. Visual Feedback
- Highlight element với animation
- Notification khi copy thành công
- Status indicator trong popup

### 3. User-Friendly Interface
- Tutorial step-by-step tích hợp
- Giao diện đẹp mắt với gradient
- Responsive design

### 4. No-Code Solution
- Không cần kiến thức lập trình
- Không cần mở Developer Tools
- Point and click đơn giản

## 🚀 Roadmap

- [ ] Đăng tải lên Chrome Web Store
- [ ] Thêm options cho loại selector muốn tạo
- [ ] Export multiple selectors
- [ ] Tích hợp với automation tools
- [ ] Support Firefox và Edge

## 🤝 Đóng Góp

Extension này được tạo để giúp người dùng non-tech dễ dàng làm việc với web elements. Mọi đóng góp và feedback đều được chào đón!

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.