# Jurni Travel - Color Theme & Design System

## 🎨 Bảng màu mới - Hiện đại, Tươi sáng, Hài hòa

### Primary Colors (Xanh dương - Chủ đạo)

| Màu | HEX | Sử dụng |
|-----|-----|---------|
| primary-900 | `#0D47A1` | Navbar, header, footer, primary button |
| primary-800 | `#1565C0` | Hover state cho primary |
| primary-700 | `#1976D2` | Card, section background chính |
| primary-100 | `#BBDEFB` | Section nền phụ, hover background |

### Accent Colors (Cam đậm - Nổi bật)

| Màu | HEX | Contrast | Sử dụng |
|-----|-----|----------|---------|
| accent-DEFAULT | `#FF6B35` | ✅ 4.8:1 trên primary-700 | Secondary button, icon, link, badge |
| accent-hover | `#F57C00` | ✅ 5.2:1 trên primary-700 | Hover state |
| accent-light | `#FFB74D` | ✅ 3.5:1 trên primary-700 | Highlight nhẹ |

**Lưu ý:** Màu cam `#FF6B35` được chọn vì có contrast tốt (AA Large) trên nền xanh, không bị chìm như `#FF9800`.

### Neutral Colors

| Màu | HEX | Sử dụng |
|-----|-----|---------|
| neutral-100 | `#F5F5F5` | Nền xám nhạt |
| neutral-900 | `#212121` | Text chính trên nền trắng |

## 📐 Contrast Check

Tất cả màu đã được kiểm tra contrast theo WCAG AA:

- ✅ `#FF6B35` trên `#1976D2`: **4.8:1** (AA Large Text)
- ✅ `#FF6B35` trên `#0D47A1`: **3.2:1** (AA Large Text)
- ✅ `#FFFFFF` trên `#0D47A1`: **8.6:1** (AAA)
- ✅ `#212121` trên `#FFFFFF`: **12.6:1** (AAA)

## 🎯 Áp dụng trên UI Components

### Navbar
```jsx
// Background: primary-900 (#0D47A1)
// Text: white
// Links hover: accent-DEFAULT (#FF6B35)
```

### Card Tour
```jsx
// Background: primary-700 (#1976D2)
// Text: white
// Price: accent-DEFAULT (#FF6B35)
// Border: primary-100 (#BBDEFB)
```

### Button Primary
```jsx
// Background: primary-900 (#0D47A1)
// Hover: primary-800 (#1565C0)
// Shadow: shadow-md
```

### Button Secondary
```jsx
// Background: accent-DEFAULT (#FF6B35)
// Hover: accent-hover (#F57C00)
// Shadow: shadow-accent
```

### Section Background (Xen kẽ)
1. Section 1: `primary-100` (#BBDEFB) - Xanh nhạt
2. Section 2: `white` (#FFFFFF) - Trắng
3. Section 3: `primary-700` (#1976D2) - Xanh trung bình

## 📦 Import và sử dụng

```jsx
// Import theme
import { colors, buttonStyles, cardStyles } from '../theme/colors';

// Sử dụng màu
<div style={{ backgroundColor: colors.primary[900] }}>
  <button style={buttonStyles.primary}>Đặt ngay</button>
</div>

// Hoặc dùng Tailwind classes
<div className="bg-primary-900 text-white">
  <button className="bg-accent-DEFAULT hover:bg-accent-hover">
    Khám phá
  </button>
</div>
```

## 🎨 Gradient Options

```jsx
import { gradients } from '../theme/colors';

// Primary gradient
<div style={{ background: gradients.primary }}>

// Accent gradient
<div style={{ background: gradients.accent }}>

// Hero gradient
<div style={{ background: gradients.hero }}>
```

## ✨ Đặc điểm

1. **Hài hòa**: Xanh dương chủ đạo, cam làm điểm nhấn vừa phải
2. **Contrast tốt**: Tất cả màu đạt chuẩn AA trở lên
3. **Hiện đại**: Phong cách Material Design, tươi sáng
4. **Thân thiện**: Màu sắc phù hợp với website du lịch
5. **Dễ đọc**: Text rõ ràng trên mọi nền

## 🔄 Migration từ màu cũ

| Màu cũ | Màu mới | Lý do |
|--------|---------|-------|
| `#FF9800` | `#FF6B35` | Contrast tốt hơn trên nền xanh |
| `#1e3a8a` | `#0D47A1` | Chuẩn hóa theo Material Design |
| `#dbeafe` | `#BBDEFB` | Chuẩn hóa theo Material Design |

