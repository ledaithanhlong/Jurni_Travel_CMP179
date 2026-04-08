-- Thêm cột isDisable vào bảng Users để hỗ trợ soft delete
-- Chạy script này để cập nhật database

ALTER TABLE Users 
ADD COLUMN isDisable BOOLEAN NOT NULL DEFAULT FALSE 
COMMENT 'Đánh dấu người dùng bị vô hiệu hóa (soft delete)';

-- Tạo index cho trường isDisable để tối ưu hóa query
CREATE INDEX idx_users_is_disable ON Users(isDisable);

-- Cập nhật comment cho bảng
ALTER TABLE Users 
COMMENT = 'Bảng người dùng với hỗ trợ soft delete thông qua trường isDisable';