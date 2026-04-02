# 🗄️ Hướng dẫn Setup Database cho Jurni

Tài liệu này hướng dẫn cách setup database MySQL cho dự án Jurni từ đầu.

---

## Yêu cầu

- **XAMPP** hoặc **WAMP** (đã cài MySQL)
- **Node.js** (v16 trở lên)
- **npm** hoặc **yarn**

---

## Các bước Setup

### **Bước 1: Khởi động MySQL Server**

1. Mở **XAMPP Control Panel** hoặc **WAMP**
2. Start **Apache** và **MySQL**
3. Đảm bảo MySQL đang chạy trên port `3306`

### **Bước 2: Tạo Database**

#### **Cách 1: Dùng phpMyAdmin (Dễ nhất)**

1. Mở trình duyệt, truy cập: `http://localhost/phpmyadmin`
2. Click tab **"Databases"**
3. Tạo database mới:
   - **Database name**: `Jurni_db`
   - **Collation**: `utf8mb4_unicode_ci`
4. Click **"Create"**

#### **Cách 2: Dùng MySQL Command Line**

```bash
# Mở MySQL command line
mysql -u root -p

# Tạo database
CREATE DATABASE Jurni_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Kiểm tra
SHOW DATABASES;

# Thoát
exit;
```

### **Bước 3: Clone Project và Cài Dependencies**

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install
```

### **Bước 4: Cấu hình Environment Variables**

1. Copy file `.env.example` thành `.env`:
   ```bash
   copy .env.example .env
   ```

2. Mở file `.env` và cấu hình:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=127.0.0.1
DB_NAME=Jurni_db
DB_USER=root
DB_PASS=
DB_DIALECT=mysql

# Clerk Authentication (Tạm thời để mặc định, sau này sẽ cấu hình)
CLERK_PUBLISHABLE_KEY=pk_test_ZWFnZXItb2NlbG90LTk0LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_Qy5pf636HP5H5oMA0lbDONypi2xjuIjS8EsKfIeQZd

# Admin Emails
ADMIN_EMAILS=your_email@example.com

# Cloudinary (Tạm thời để mặc định)
CLOUDINARY_CLOUD_NAME=dojmlppez
CLOUDINARY_API_KEY=961683814434382
CLOUDINARY_API_SECRET=6lvzHToDVdE8xehMFAXeE-WrQN8
```

> **Lưu ý**: 
> - Nếu MySQL có password, điền vào `DB_PASS`
> - Thay `your_email@example.com` bằng email của bạn

### **Bước 5: Chạy Migrations (Tạo Tables)**

```bash
# Chạy tất cả migrations để tạo tables
npm run db:migrate
```

**Kết quả mong đợi:**
```
Sequelize CLI [Node: 18.x.x]

Loaded configuration file "src/config/database.cjs".
Using environment "development".
== 00-drop-all-tables: migrating =======
== 00-drop-all-tables: migrated (0.123s)

== 01-create-users: migrating =======
== 01-create-users: migrated (0.234s)

== 02-create-services: migrating =======
== 02-create-services: migrated (0.345s)

... (và các migrations khác)
```

### **Bước 6: Kiểm tra Database**

1. Quay lại **phpMyAdmin**: `http://localhost/phpmyadmin`
2. Click vào database `Jurni_db`
3. Bạn sẽ thấy các tables đã được tạo:
   - `users`
   - `hotels`
   - `flights`
   - `activities`
   - `cars`
   - `bookings`
   - `favorites`
   - `notifications`
   - `reviews`
   - `team_members`
   - `chat_conversations`
   - `chat_messages`
   - `SequelizeMeta` (table tracking migrations)

### **Bước 7: Khởi động Backend Server**

```bash
# Chạy server ở development mode
npm run dev
```

**Kết quả mong đợi:**
```
[nodemon] starting `node src/server.js`
Database connected successfully
Server is running on http://localhost:5000
```

---

## 🔄 Các lệnh hữu ích

### **Reset Database (Xóa tất cả và tạo lại)**

```bash
# Undo tất cả migrations
npm run db:migrate:undo:all

# Chạy lại migrations
npm run db:migrate
```

### **Xem danh sách migrations đã chạy**

```bash
# Trong MySQL
SELECT * FROM SequelizeMeta;
```

---

## Xử lý lỗi thường gặp

### **Lỗi 1: `ER_ACCESS_DENIED_FOR_USER`**

```
Error: Access denied for user 'root'@'localhost'
```

**Giải pháp:**
- Kiểm tra lại `DB_USER` và `DB_PASS` trong file `.env`
- Nếu MySQL có password, hãy điền vào `DB_PASS`

### **Lỗi 2: `ER_BAD_DB_ERROR`**

```
Error: Unknown database 'Jurni_db'
```

**Giải pháp:**
- Database chưa được tạo
- Quay lại **Bước 2** để tạo database

### **Lỗi 3: `ECONNREFUSED`**

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Giải pháp:**
- MySQL server chưa chạy
- Mở XAMPP/WAMP và start MySQL

### **Lỗi 4: Port 5000 đã được sử dụng**

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Giải pháp:**
```bash
# Tìm process đang dùng port 5000
netstat -ano | findstr :5000

# Kill process (thay <PID> bằng số process ID)
taskkill /PID <PID> /F

# Hoặc đổi port trong .env
PORT=5001
```

---

## Cấu trúc Database

### **Tables chính:**

| Table | Mô tả |
|-------|-------|
| `users` | Thông tin người dùng (từ Clerk) |
| `hotels` | Danh sách khách sạn |
| `flights` | Danh sách chuyến bay |
| `activities` | Danh sách hoạt động/tour |
| `cars` | Danh sách xe cho thuê |
| `bookings` | Đơn đặt của người dùng |
| `favorites` | Danh sách yêu thích |
| `reviews` | Đánh giá dịch vụ |
| `notifications` | Thông báo |
| `team_members` | Thành viên team |
| `chat_conversations` | Cuộc trò chuyện chat |
| `chat_messages` | Tin nhắn chat |

---

## Bước tiếp theo

Sau khi setup database thành công:

1. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

2. **Truy cập ứng dụng:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

3. **Đăng ký tài khoản** qua Clerk để test

---

## Liên hệ

Nếu gặp vấn đề, liên hệ:
- Email: lucaslee050304@gmail.com
- GitHub Issues: [Link to repo]

---

**Chúc bạn setup thành công! **
