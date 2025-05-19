# SDTC Website

Website quản trị nội dung cho SDTC với đầy đủ chức năng CMS, quản lý dịch vụ và tin tức.

## Cấu trúc dự án

Dự án được chia thành hai phần chính:
- **Frontend**: Giao diện người dùng xây dựng bằng Vue.js
- **Backend**: API server xây dựng bằng Node.js/Express và MongoDB

## Công nghệ sử dụng

### Frontend
- Vue.js
- Vue Router
- Axios
- CSS/SCSS

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT cho xác thực
- Multer cho upload file

## Cài đặt

### Yêu cầu hệ thống
- Node.js (v14+)
- NPM hoặc Yarn
- MongoDB (v4+)
- Git

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd sdtc
```

### Bước 2: Cài đặt dependencies cho Backend
```bash
cd backend
npm install
```

### Bước 3: Cài đặt dependencies cho Frontend
```bash
cd frontend
npm install
```

## Cấu hình

### Backend
Tạo file `.env` trong thư mục backend với nội dung:
...


### Frontend
Mặc định frontend kết nối tới backend qua URL `http://localhost:3000`. Nếu muốn thay đổi, chỉnh sửa file `frontend/src/api/config.js`.

## Chạy ứng dụng

### Chạy Backend
```bash
cd backend
npm run dev
```
Backend sẽ chạy tại `http://localhost:3000`.

### Chạy Frontend
```bash
cd frontend
npm run serve
```
Frontend sẽ chạy tại `http://localhost:8080`.

## Các chức năng chính

### Quản lý người dùng
- Đăng nhập/Đăng xuất
- Phân quyền Admin/Staff

### Quản lý tin tức
- Thêm/Sửa/Xóa tin tức
- Upload hình ảnh
- Phân loại tin tức
- Thùng rác và khôi phục tin đã xóa

### Quản lý dịch vụ
- Thêm/Sửa/Xóa dịch vụ
- Upload hình ảnh dịch vụ

### Quản lý đơn hàng
- Xem danh sách đơn hàng
- Cập nhật trạng thái đơn hàng

### Quản lý đặt lịch
- Xem lịch hẹn
- Quản lý trạng thái lịch hẹn
