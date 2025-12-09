# Ứng Dụng Quản Lý Tour Du Lịch

Ứng dụng web quản lý tour du lịch được xây dựng với HTML, CSS, JavaScript, jQuery và Bootstrap, tích hợp MockAPI để quản lý dữ liệu.

## 🚀 Công Nghệ Sử Dụng

- **HTML5** - Cấu trúc trang web
- **CSS3** - Styling và animations
- **JavaScript** - Logic xử lý
- **jQuery** - Thao tác DOM và AJAX
- **Bootstrap 5** - Framework UI responsive
- **Font Awesome** - Icons
- **MockAPI** - REST API backend

## 📋 Chức Năng

### 1. Quản Lý Người Dùng
- ✅ **Đăng nhập**: Người dùng nhập email và mật khẩu để đăng nhập
- ✅ **Đăng ký tài khoản**: Người dùng nhập thông tin (tên, email, mật khẩu) để tạo tài khoản mới
- ✅ Hệ thống xác thực thông tin và kiểm tra trùng lặp email
- ✅ Dữ liệu người dùng được lưu trên MockAPI

### 2. Quản Lý Tour Du Lịch (Admin)
- ✅ **Hiển thị danh sách tour**: Xem tất cả tour từ MockAPI
- ✅ **Thêm tour mới**: Tạo tour với đầy đủ thông tin
- ✅ **Sửa tour**: Cập nhật thông tin tour
- ✅ **Xóa tour**: Xóa tour khỏi hệ thống
- ✅ **Lọc theo địa điểm**: Lọc tour theo khu vực (Miền Bắc, Miền Trung, Miền Nam)
- ✅ **Tìm kiếm**: Tìm kiếm tour theo tên hoặc thời lượng (duration)
- ✅ Thống kê tổng quan (số lượng tour, lượt yêu thích)

### 3. Danh Sách Tour Yêu Thích (Local Storage)
- ✅ **Lưu tour yêu thích**: Người dùng có thể thêm tour vào danh sách yêu thích
- ✅ **Xem danh sách yêu thích**: Hiển thị tất cả tour đã lưu
- ✅ **Xóa tour**: Xóa tour khỏi danh sách yêu thích hoặc thêm ghi chú
- ✅ Dữ liệu lưu trữ trong Local Storage theo từng user

## 📁 Cấu Trúc File

```
tour-manager/
├── css/
│   ├── style.css       # CSS cho trang chủ và favorites
│   ├── auth.css        # CSS cho đăng nhập và đăng ký
│   └── admin.css       # CSS cho trang quản lý
├── js/
│   ├── index.js        # JavaScript cho trang chủ
│   ├── login.js        # JavaScript cho đăng nhập
│   ├── register.js     # JavaScript cho đăng ký
│   ├── admin.js        # JavaScript cho quản lý
│   └── favorites.js    # JavaScript cho yêu thích
├── index.html          # Trang chủ - Danh sách tour
├── login.html          # Trang đăng nhập
├── register.html       # Trang đăng ký
├── admin.html          # Trang quản lý admin
├── favorites.html      # Trang tour yêu thích
└── README.md          # Tài liệu hướng dẫn
```

## 🔧 Cài Đặt và Sử Dụng

### 1. MockAPI Setup

API URL đã được cấu hình sẵn:
```javascript
const API_URL = 'https://6937071cf8dc350aff3320d0.mockapi.io';
```

**Endpoints:**
- `GET https://6937071cf8dc350aff3320d0.mockapi.io/users` - Lấy danh sách người dùng
- `POST https://6937071cf8dc350aff3320d0.mockapi.io/users` - Tạo người dùng mới
- `GET https://6937071cf8dc350aff3320d0.mockapi.io/tours` - Lấy danh sách tour
- `POST https://6937071cf8dc350aff3320d0.mockapi.io/tours` - Tạo tour mới
- `PUT https://6937071cf8dc350aff3320d0.mockapi.io/tours/:id` - Cập nhật tour
- `DELETE https://6937071cf8dc350aff3320d0.mockapi.io/tours/:id` - Xóa tour

### 2. Chạy Ứng Dụng

1. Mở file `login.html` trong trình duyệt
2. Đăng nhập với tài khoản mặc định:
   - Email: `admin@gmail.com`
   - Password: `123456`
3. Hoặc đăng ký tài khoản mới

### 3. Sử Dụng Các Chức Năng

#### Đăng Nhập/Đăng Ký
- Truy cập `login.html` để đăng nhập
- Click "Đăng ký ngay" để tạo tài khoản mới
- Hệ thống sẽ kiểm tra email trùng lặp và xác thực mật khẩu

#### Xem Danh Sách Tour (Trang Chủ)
- Sau khi đăng nhập, xem tất cả tour có sẵn
- Lọc tour theo khu vực (Miền Bắc, Miền Trung, Miền Nam)
- Tìm kiếm tour theo tên hoặc địa điểm
- Click nút "Yêu thích" để thêm vào danh sách yêu thích
- Click "Đặt tour" để đặt tour

#### Quản Lý Tour (Admin)
- Truy cập menu "Quản lý" để vào trang admin
- Click "Thêm Tour Mới" để tạo tour
- Click nút "Sửa" để chỉnh sửa tour
- Click nút "Xóa" để xóa tour
- Sử dụng ô tìm kiếm để lọc tour

#### Tour Yêu Thích
- Truy cập menu "Yêu thích" để xem danh sách
- Click "Xóa" để bỏ tour khỏi danh sách
- Click "Đặt tour" để đặt tour yêu thích

## 🎨 Tính Năng Nổi Bật

- ✨ Giao diện đẹp mắt với gradient colors
- 📱 Responsive design - Tương thích mọi thiết bị
- 🎭 Animations mượt mà
- 🔍 Tìm kiếm và lọc thông minh
- 💾 Lưu trữ dữ liệu với MockAPI và Local Storage
- 🔐 Xác thực người dùng
- 📊 Thống kê trực quan

## 🌐 API MockAPI

Dữ liệu được quản lý thông qua MockAPI:

**Users Schema:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Tours Schema:**
```json
{
  "id": "string",
  "name": "string",
  "location": "string",
  "region": "string",
  "duration": "string",
  "price": "number",
  "image": "string",
  "description": "string",
  "badge": "string"
}
```

## 📝 Lưu Ý

- Dữ liệu tour yêu thích được lưu trong Local Storage theo từng user
- Mỗi user có danh sách yêu thích riêng biệt
- Tài khoản admin mặc định: admin@gmail.com / 123456
- Ứng dụng cần kết nối internet để truy cập MockAPI

## 🎯 Yêu Cầu Đã Hoàn Thành

✅ Sử dụng HTML, CSS, JavaScript, jQuery, Bootstrap  
✅ Không sử dụng công nghệ khác  
✅ Tích hợp MockAPI cho quản lý người dùng và tour  
✅ Giao diện đăng nhập với xác thực  
✅ Giao diện đăng ký với kiểm tra trùng lặp  
✅ Trang quản lý admin với CRUD tour  
✅ Trang index hiển thị danh sách tour  
✅ Chức năng thêm tour vào yêu thích (Local Storage)  
✅ Lọc theo địa điểm và tìm kiếm theo tên/thời lượng  

## 📞 Hỗ Trợ

Nếu có vấn đề, vui lòng kiểm tra:
1. Kết nối internet
2. Console log trong Developer Tools
3. MockAPI endpoint có hoạt động không

---

**Phát triển bởi Tour Manager Team © 2024**
