# CAP126 - NGÔN NGỮ PHÁT TRIỂN ỨNG DỤNG MỚI

## Thông tin lớp
- Mã học phần: **CAP126**
- Tên học phần: **Ngôn ngữ phát triển ứng dụng mới**

## Danh sách thành viên

| STT | MSSV       | Họ và Tên        | Tên  | Lớp     |
|-----|-----------|------------------|------|----------|
| 1   | 2280601752 | Lê Đại Thanh     | Long | 22DTHD4 |
| 2   | 2280607474 | Nguyễn Khắc Minh | Hiếu | 22DTHD4 |
| 3   | 2280601585 | Võ Đình          | Khương | 22DTHD4 |
| 4   | 2280611346 | Đặng Hoài        | Nam  | 22DTHD4 |
| 5   | 2080601241 | Nguyễn Tiến      | Phát | 20DTHE4 |

## Mô tả
Repository này được sử dụng cho môn học **Ngôn ngữ phát triển ứng dụng mới (CAP126)**, bao gồm:
- Bài tập
- Dự án
- Tài liệu học tập

## Mục tiêu
- Nắm vững các ngôn ngữ phát triển ứng dụng hiện đại
- Xây dựng và triển khai ứng dụng thực tế
- Làm việc nhóm và quản lý dự án

## Công nghệ sử dụng
- (Cập nhật sau)

## Hướng dẫn sử dụng
1. Clone repository:
   ```bash
   git clone https://github.com/ledaithanhlong/Jurni_Travel_CMP179.git
   ```
2. Cài đặt Backend:
   ```bash
   cd backend
   npm install
   # Tạo file .env và thêm MONGO_URI, CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
   npm run dev
   ```
2. Cài đặt Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Documentation (Postman Guide)

### 1. Quản lý Tài khoản (Authentication with Clerk)
- **Sync User**: `POST /api/users/sync`
  - Payload: `{ "clerkId": "...", "email": "...", "firstName": "...", "lastName": "...", "photoUrl": "..." }`
- **Get Profile**: `GET /api/users/me` (Auth required)
- **Update Profile**: `PUT /api/users/me` (Auth required)
  - Payload: `{ "phone": "0123...", "address": "..." }`
- **Booking History**: `GET /api/users/me/bookings` (Auth required)

### 2. Quản lý Tours (CRUD)
- **Create Tour**: `POST /api/tours` (Admin required)
  - Payload: `{ "title": "...", "price": 1000, "duration": "3 days", "availableSlots": 10 }`
- **Get All Tours**: `GET /api/tours`
- **Get Tour Detail**: `GET /api/tours/:id`
- **Update Tour**: `PUT /api/tours/:id` (Admin required)
- **Delete Tour**: `DELETE /api/tours/:id` (Admin required)

### 3. Quản lý Đặt Tour (Transaction & Socket)
- **Create Booking**: `POST /api/bookings` (Auth required)
  - Payload: `{ "tourId": "...", "guests": 2, "totalPrice": 2000 }`
  - *Lưu ý: Sử dụng Mongoose Transaction để trừ slots và tạo record.*
  - *Socket.io sẽ emit sự kiện `bookingSuccess` sau khi thành công.*
- **Get All Bookings**: `GET /api/bookings` (Admin required)

### 4. Upload Ảnh (Multer)
- **Upload Image**: `POST /api/upload`
  - Form-data: `image: <file>`
  - Response: `{ "success": true, "fileUrl": "/uploads/..." }`

### 5. Phân quyền (Authorization)
- Middleware `authorize(['admin'])` được áp dụng cho các route quản lý để đảm bảo chỉ Admin mới có quyền CRUD.