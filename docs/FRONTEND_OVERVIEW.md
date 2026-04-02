# Frontend Overview — Jurni

> Tổng quan về các trang và công việc Frontend đã hoàn thành trong dự án Jurni.

---

## Tech Stack

| Công nghệ | Mô tả |
|---|---|
| **React** | UI framework chính |
| **Vite** | Build tool / Dev server |
| **TailwindCSS** | Utility-first CSS framework |
| **React Router** | Client-side routing |
| **Clerk** | Authentication (Sign In / Sign Up / Verify Email) |

---

## Danh sách Pages (26 trang)

### Authentication
| Trang | File | Mô tả |
|---|---|---|
| Đăng nhập | `SignInPage.jsx` | Form đăng nhập, tích hợp Clerk |
| Đăng ký | `SignUpPage.jsx` | Form tạo tài khoản mới |
| Xác minh Email | `VerifyEmailPage.jsx` | Xác nhận OTP sau khi đăng ký |

### Trang Chính
| Trang | File | Mô tả |
|---|---|---|
| Trang chủ | `HomePage.jsx` | Landing page, giới thiệu dịch vụ |
| Giới thiệu | `AboutPage.jsx` | Thông tin về Jurni |
| Dịch vụ | `ServicesPage.jsx` | Danh sách các dịch vụ |
| Điều khoản | `TermsPage.jsx` | Điều khoản sử dụng |

### Du Lịch & Đặt Chỗ
| Trang | File | Mô tả |
|---|---|---|
| Khách sạn | `HotelsPage.jsx` | Tìm kiếm, lọc và danh sách khách sạn |
| Chi tiết khách sạn | `HotelDetail.jsx` | Thông tin chi tiết, ảnh, đánh giá, đặt phòng |
| Chuyến bay | `FlightsPage.jsx` | Tìm kiếm và danh sách chuyến bay |
| Ý tưởng bay | `FlightIdeasPage.jsx` | Gợi ý điểm đến, ý tưởng du lịch |
| Thuê xe | `CarsPage.jsx` | Tìm kiếm, lọc và đặt thuê xe ô tô |
| Hoạt động | `ActivitiesPage.jsx` | Tour, hoạt động tham quan |
| Đặt chỗ của tôi | `BookingsPage.jsx` | Lịch sử và trạng thái booking |
| Thanh toán | `PaymentPage.jsx` | Trang xử lý thanh toán đơn hàng |

### Ưu Đãi & Tiện Ích
| Trang | File | Mô tả |
|---|---|---|
| Vouchers | `VouchersPage.jsx` | Danh sách mã giảm giá, áp dụng voucher |
| Khuyến mãi | `PromotionsPage.jsx` | Các chương trình khuyến mãi |
| Cảnh báo giá | `PriceAlertPage.jsx` | Thiết lập thông báo khi giá giảm |
| Yêu thích | `FavoritesPage.jsx` | Danh sách mục đã lưu yêu thích |
| Thông báo | `NotificationsPage.jsx` | Trung tâm thông báo người dùng |

### Tuyển Dụng
| Trang | File | Mô tả |
|---|---|---|
| Tuyển dụng | `CareersPage.jsx` | Danh sách vị trí tuyển dụng |
| Ứng tuyển | `JobApplicationPage.jsx` | Form nộp đơn cho một vị trí |
| Đội ngũ | `TeamPage.jsx` | Giới thiệu các thành viên đội ngũ |

### Admin Panel
| Trang | File | Mô tả |
|---|---|---|
| Admin Dashboard | `AdminDashboard.jsx` | Tổng quan thống kê, bảng điều khiển |
| Admin Chat | `AdminChatPage.jsx` | Xem và phản hồi hội thoại người dùng |

### Hỗ Trợ
| Trang | File | Mô tả |
|---|---|---|
| Hỗ trợ | `SupportPage.jsx` | FAQ, form liên hệ, kênh hỗ trợ |

---

## Components Chung (`src/components/`)

| Component | Mô tả |
|---|---|
| `JurniHero.jsx` | Hero section chính — search bar, tab điều hướng dịch vụ |
| `ChatWidget.jsx` | Widget chat nổi góc phải màn hình |
| `NotificationSender.jsx` | Gửi thông báo đến người dùng |
| `FavoriteButton.jsx` | Nút toggle yêu thích (dùng lại nhiều trang) |
| `EditableImage.jsx` | Ảnh có thể chỉnh sửa inline |
| `ServiceCards.jsx` | Thẻ card hiển thị dịch vụ |
| `ServiceLink.jsx` | Link nhanh đến từng dịch vụ |
| `Icons.jsx` | Tập hợp icon SVG dùng toàn app |
| `Section.jsx` | Layout wrapper cho từng section |
| `Hero.jsx` | Hero component đơn giản |

---

## Admin Components (`src/components/admin/`)

| Component | Module | Chức năng |
|---|---|---|
| `AdminHotels.jsx` | Khách sạn | CRUD: thêm/sửa/xóa khách sạn, quản lý ảnh |
| `AdminFlights.jsx` | Chuyến bay | CRUD: thêm/sửa/xóa chuyến bay, quản lý lịch |
| `AdminActivities.jsx` | Hoạt động | CRUD: tour, hoạt động tham quan |
| `AdminCars.jsx` | Thuê xe | CRUD: xe có sẵn, giá, tình trạng |
| `AdminVouchers.jsx` | Voucher | Tạo/vô hiệu hóa mã giảm giá |
| `AdminBookings.jsx` | Đặt chỗ | Xem, xác nhận, hủy đơn đặt chỗ |
| `AdminUsers.jsx` | Người dùng | Danh sách, phân quyền người dùng |

---

## Cấu Trúc Thư Mục FE

```
frontend/
├── src/
│   ├── pages/          # 26 trang chính
│   ├── components/     # Components dùng chung
│   │   └── admin/      # Components Admin Panel
│   ├── routes/         # Cấu hình React Router
│   ├── theme/          # Theme tokens, màu sắc
│   ├── data/           # Dữ liệu tĩnh (mock data)
│   ├── utils/          # Hàm tiện ích
│   ├── assets/         # Hình ảnh, fonts
│   ├── styles.css      # Global styles
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── index.html
├── vite.config.js
└── tailwind.config.js
```

---

*Cập nhật lần cuối: 11/03/2026*
