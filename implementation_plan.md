# Quản lý Chi tiết Tour (Tour Detail Management)

Thêm chức năng quản lý thông tin chi tiết cho tour/activity, bao gồm:
- **Lịch trình theo ngày** (daily itinerary)
- **Giá theo gói/số người** (pricing packages)
- **Chính sách hoàn hủy** (cancellation policy)
- **Điều khoản và lưu ý cho khách hàng** (terms & notes)

## Proposed Changes

---

### Backend

#### [MODIFY] [activity.js](file:///e:/HUTECH/4th/Jurni_Travel_CMP179/backend/src/models/activity.js)
Thêm các trường mới vào Activity model:
- `itinerary` (JSON): Lịch trình theo ngày, mảng gồm `{ day, title, description, activities[] }`
- `price_packages` (JSON): Giá theo gói, mảng gồm `{ name, price, min_people, max_people, includes[] }`
- `terms` (TEXT): Điều khoản và lưu ý cho khách hàng
- `notes` (TEXT): Lưu ý bổ sung

#### [MODIFY] [activities.controller.js](file:///e:/HUTECH/4th/Jurni_Travel_CMP179/backend/src/controllers/activities.controller.js)
Thêm endpoint `GET /activities/:id` để lấy chi tiết một tour.

---

### Database Migration

#### [NEW] `backend/src/migrations/add-tour-details-to-activities.js`
Migration script thêm các cột mới vào bảng `Activities`.

---

### Frontend – Admin

#### [MODIFY] [AdminActivities.jsx](file:///e:/HUTECH/4th/Jurni_Travel_CMP179/frontend/src/components/admin/AdminActivities.jsx)
Mở rộng form quản lý để bao gồm:
- **Tab Lịch trình**: Thêm từng ngày với tiêu đề, mô tả, danh sách hoạt động
- **Tab Giá gói**: Thêm/sửa/xóa các gói giá (tên gói, giá, số người min/max, bao gồm gì)
- **Tab Chính sách hoàn hủy**: Nội dung chi tiết (textarea phong phú)
- **Tab Điều khoản & Lưu ý**: Điều khoản và ghi chú

---

### Frontend – User Facing

#### [MODIFY] [ActivitiesPage.jsx](file:///e:/HUTECH/4th/Jurni_Travel_CMP179/frontend/src/pages/ActivitiesPage.jsx)
Cập nhật modal chi tiết tour để hiển thị:
- **Lịch trình theo ngày** (accordion/timeline)
- **Bảng giá theo gói** (card pricing)
- **Chính sách hoàn hủy** (styled section)
- **Điều khoản & Lưu ý** (collapsible section)
- Cho phép chọn **gói giá** khi đặt tour

## Verification Plan

### Automated Tests
- Restart backend server sau migration
- Test API `GET /activities/:id` qua Postman
- Test tạo/sửa activity qua Admin Dashboard

### Manual Verification
- Tạo một tour mới với đầy đủ lịch trình, giá gói, chính sách, điều khoản
- Kiểm tra hiển thị đúng trên trang ActivitiesPage
- Đặt tour với gói giá đã chọn
