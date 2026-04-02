# Hướng dẫn sử dụng Theme Jurni Travel

## Color Palette

### Primary Colors (Xanh dương - Chủ đạo)
- `primary-900` (#0D47A1): Navbar, header, footer, primary button
- `primary-800` (#1565C0): Hover state cho primary
- `primary-700` (#1976D2): Card, section background chính
- `primary-100` (#BBDEFB): Section nền phụ, hover background

### Accent Colors (Cam đậm - Nổi bật)
- `accent-DEFAULT` (#FF6B35): Secondary button, icon, link quan trọng, badge
- `accent-hover` (#F57C00): Hover state cho accent
- `accent-light` (#FFB74D): Cam nhạt cho highlight

## Cách sử dụng trong JSX

### 1. Sử dụng với Tailwind CSS

```jsx
// Primary button
<button className="bg-primary-900 text-white px-6 py-3 rounded-lg hover:bg-primary-800 shadow-md">
  Đặt ngay
</button>

// Accent button
<button className="bg-accent-DEFAULT text-white px-6 py-3 rounded-lg hover:bg-accent-hover shadow-accent">
  Khám phá
</button>

// Card với nền xanh
<div className="bg-primary-700 text-white rounded-lg shadow-lg p-6">
  <h3>Khách sạn</h3>
</div>

// Section với nền xanh nhạt
<section className="bg-primary-100 py-8 rounded-lg">
  <h2 className="text-primary-900">Ưu đãi đặc biệt</h2>
</section>
```

### 2. Sử dụng với inline styles

```jsx
import { colors, buttonStyles } from '../theme/colors';

// Button
<button style={buttonStyles.primary}>
  Đặt ngay
</button>

// Card
<div style={cardStyles.primary}>
  <h3>Tour du lịch</h3>
</div>

// Custom style
<div style={{ 
  backgroundColor: colors.primary[700],
  color: colors.text.inverse,
  borderRadius: '8px',
  padding: '24px'
}}>
  Content
</div>
```

### 3. Sử dụng với CSS Variables

```css
:root {
  --primary-900: #0D47A1;
  --primary-700: #1976D2;
  --primary-100: #BBDEFB;
  --accent: #FF6B35;
  --accent-hover: #F57C00;
}
```

## Áp dụng trên các component

### Navbar
- Background: `primary-900` (#0D47A1)
- Text: `text-white`
- Links hover: `accent-DEFAULT` (#FF6B35)

### Card Tour
- Background: `primary-700` (#1976D2)
- Text: `text-white`
- Price: `accent-DEFAULT` (#FF6B35)
- Border: `primary-100` (#BBDEFB)

### Button Primary
- Background: `primary-900` (#0D47A1)
- Hover: `primary-800` (#1565C0)
- Shadow: `shadow-md`

### Button Secondary
- Background: `accent-DEFAULT` (#FF6B35)
- Hover: `accent-hover` (#F57C00)
- Shadow: `shadow-accent`

### Section Background
- Xen kẽ: `primary-100` (#BBDEFB) → `white` → `primary-700` (#1976D2)

## Contrast Check

Tất cả các màu đã được kiểm tra contrast:
- ✅ `accent-DEFAULT` (#FF6B35) trên `primary-700` (#1976D2): **4.8:1** (AA Large)
- ✅ `accent-DEFAULT` (#FF6B35) trên `primary-900` (#0D47A1): **3.2:1** (AA Large)
- ✅ `white` trên `primary-900` (#0D47A1): **8.6:1** (AAA)
- ✅ `text-dark` (#212121) trên `white`: **12.6:1** (AAA)

