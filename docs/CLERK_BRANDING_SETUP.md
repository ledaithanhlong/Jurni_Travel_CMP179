# Hướng dẫn cấu hình Clerk để hiển thị "Jurni Travel" trong email

## Vấn đề
Email từ Clerk hiện đang hiển thị "travelweb" thay vì "Jurni Travel".

## Giải pháp

Tên hiển thị trong email từ Clerk được cấu hình trong **Clerk Dashboard**, không phải trong code. Bạn cần thực hiện các bước sau:

### Bước 1: Đăng nhập vào Clerk Dashboard
1. Truy cập: https://dashboard.clerk.com
2. Đăng nhập vào tài khoản Clerk của bạn
3. Chọn ứng dụng (Application) của Jurni

### Bước 2: Cấu hình Branding
1. Vào **Settings** → **Branding**
2. Tìm phần **Application name** hoặc **Display name**
3. Thay đổi từ "travelweb" thành **"Jurni Travel"**
4. Lưu thay đổi

### Bước 3: Cấu hình Email Templates (nếu có)
1. Vào **Settings** → **Email & SMS** → **Email Templates**
2. Kiểm tra các template email:
   - Sign in email
   - Sign up email
   - Password reset email
   - New device sign in email
3. Trong mỗi template, đảm bảo:
   - Tên ứng dụng hiển thị là **"Jurni Travel"**
   - Nội dung email liên quan đến Jurni (ví dụ: "Chào mừng đến với Jurni Travel", "Jurni Travel - Khám phá Việt Nam theo cách của bạn")
4. Cập nhật và lưu từng template

### Bước 4: Cấu hình Email Sender
1. Vào **Settings** → **Email & SMS** → **Email Settings**
2. Kiểm tra **From name** (tên người gửi)
3. Đảm bảo hiển thị là **"Jurni Travel"** hoặc **"Jurni"**

### Bước 5: Kiểm tra lại
1. Đăng xuất khỏi ứng dụng
2. Thử đăng ký tài khoản mới hoặc đăng nhập
3. Kiểm tra email nhận được có hiển thị "Jurni Travel" không

## Lưu ý
- Thay đổi trong Clerk Dashboard có thể mất vài phút để có hiệu lực
- Nếu vẫn thấy "travelweb", hãy xóa cache trình duyệt và thử lại
- Một số email có thể đã được gửi trước khi thay đổi, nên vẫn hiển thị tên cũ

## Nội dung email mẫu đề xuất

### Email đăng ký:
```
Chào mừng đến với Jurni Travel!

Cảm ơn bạn đã đăng ký tài khoản tại Jurni Travel - Nền tảng du lịch hàng đầu Việt Nam.

Vui lòng xác nhận email của bạn để bắt đầu khám phá những điểm đến tuyệt vời cùng Jurni.
```

### Email đăng nhập từ thiết bị mới:
```
Jurni Travel - Thông báo đăng nhập mới

Một thiết bị mới vừa đăng nhập vào tài khoản Jurni Travel của bạn.

Nếu không phải bạn, vui lòng kiểm tra và bảo mật tài khoản ngay.
```

### Email đặt lại mật khẩu:
```
Jurni Travel - Đặt lại mật khẩu

Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Jurni Travel của mình.

Nhấp vào liên kết bên dưới để tạo mật khẩu mới.
```

