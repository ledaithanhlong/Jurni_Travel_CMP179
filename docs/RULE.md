# JURNI WEB APPLICATION DEVELOPMENT RULES

Version: 2.0.0
Last Updated: 2026-02-04
Purpose: Quy chuẩn phát triển cho dự án web application Jurni

---

## 1. PROJECT ARCHITECTURE

### 1.1 Cấu trúc thư mục

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Routing config
│   │   ├── data/          # Mock data & constants
│   │   ├── styles.css     # Global styles
│   │   └── main.jsx       # Entry point
│   └── public/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Middleware
│   │   ├── migrations/    # DB migrations
│   │   ├── services/      # Business logic
│   │   ├── socket/        # WebSocket
│   │   └── server.js      # Entry point
│   └── package.json
└── RULE.md
```

### 1.2 Tech Stack

#### Frontend
- React 18.3+ với Vite
- React Router DOM v6+
- TailwindCSS 3.4+
- Lucide React
- Axios
- Clerk React
- Socket.io Client

#### Backend
- Node.js LTS
- Express.js
- Sequelize ORM
- MySQL 8.0+
- Clerk Express + JWT
- Socket.io
- Helmet, CORS
- Multer + Cloudinary

---

## 2. DESIGN SYSTEM

### 2.1 Color Palette — Quy tắc 60/30/10

> **60% Dominant** → màu nền/background (trắng & xanh nhạt)
> **30% Secondary** → màu xanh blue chính (text, border, icon, nav)
> **10% Accent** → màu cam (CTA, badge, highlight)

```css
/* ───────────────────────────────────────────
   60% — DOMINANT: Nền trang, card, sections
   Dùng cho: background page, card bg, section bg
─────────────────────────────────────────── */
--color-bg-primary:   #FFFFFF;   /* Nền chính - trắng */
--color-bg-soft:      #F0F7FF;   /* Nền section nhạt */
--color-bg-muted:     #E3F2FD;   /* Nền card, hover nhạt */
--color-bg-subtle:    #F5FAFF;   /* Nền xen kẽ */

/* ───────────────────────────────────────────
   30% — SECONDARY: Màu chủ đạo thương hiệu
   Dùng cho: text heading, nav, border, icon, button outline
─────────────────────────────────────────── */
--color-primary-dark:   #0D47A1; /* Heading, active nav */
--color-primary:        #1976D2; /* Button, link, icon */
--color-primary-light:  #42A5F5; /* Border highlight, tag */
--color-text-primary:   #212121; /* Body text */
--color-text-secondary: #757575; /* Sub-text, caption */
--color-text-disabled:  #BDBDBD; /* Disabled state */
--color-border-light:   #BBDEFB; /* Card border */
--color-border-medium:  #90CAF9; /* Input border */

/* ───────────────────────────────────────────
   10% — ACCENT: Điểm nhấn hành động
   Dùng cho: CTA button, badge, price, notification dot
─────────────────────────────────────────── */
--color-accent:         #FF6B35; /* Primary CTA - cam đậm */
--color-accent-hover:   #E85520; /* Hover CTA */
--color-accent-soft:    #FF9800; /* Badge, warning */
--color-accent-light:   #FFE8E0; /* Accent bg nhạt */
```

**Nguyên tắc áp dụng:**
- PHẢI dùng màu Dominant (60%) cho `background`, `section`, `card`
- PHẢI dùng màu Secondary (30%) cho `heading`, `nav`, `border`, `icon`
- PHẢI dùng màu Accent (10%) CHỈ cho `button CTA`, `price`, `badge`, `tab active`
- KHÔNG ĐƯỢC dùng màu Accent cho background lớn hoặc text thông thường

### 2.2 Typography

```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Weights */
--font-normal: 400;
--font-semibold: 600;
--font-bold: 700;
```

### 2.3 Spacing & Radius

```css
/* Spacing */
--spacing-section: 2rem;    /* py-8 */
--spacing-card: 1.5rem;     /* p-6 */
--spacing-element: 1rem;    /* gap-4 */

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;           /* STANDARD */
--radius-lg: 12px;
--radius-full: 9999px;
```

---

## 3. FRONTEND STANDARDS

### 3.1 Component Structure

PHẢI tổ chức components theo Single Responsibility Principle.

```
components/
├── layout/      # Header, Footer, Sidebar
├── common/      # Button, Input, Card
└── features/    # Feature-specific components
```

PHẢI sử dụng PropTypes cho type checking.
PHẢI export default function cho functional components.

### 3.2 Styling

PHẢI sử dụng TailwindCSS utilities.
KHÔNG ĐƯỢC sử dụng inline styles trừ khi cần dynamic values.
PHẢI thêm transition cho hover states.

```jsx
// ĐÚNG
<div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition">

// SAI
<div style={{ padding: '24px', backgroundColor: 'white' }}>
```

### 3.3 State Management

PHẢI sử dụng useState cho component-level state.
PHẢI implement loading, error, data states cho API calls.
PHẢI có fallback to mock data khi API fails.

### 3.4 Routing

PHẢI sử dụng React Router DOM v6+.
PHẢI implement ProtectedRoute cho authenticated routes.
PHẢI có 404 page.

### 3.5 Environment Variables

PHẢI prefix với VITE_ cho Vite projects.
PHẢI có fallback values.

```javascript
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## 4. BACKEND STANDARDS

### 4.1 Controller Pattern

PHẢI implement try-catch cho mọi controller.
PHẢI return appropriate HTTP status codes.
PHẢI log errors với console.error.
PHẢI return consistent error format.

```javascript
export const getResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching resource', error: error.message });
  }
};
```

### 4.2 Service Layer

NÊN tách business logic vào service layer.
PHẢI validate input trong service layer.

### 4.3 Model Pattern

PHẢI sử dụng Sequelize models.
PHẢI define validations trong model.
PHẢI sử dụng timestamps: true.
PHẢI sử dụng underscored: true cho snake_case.

### 4.4 Error Handling

PHẢI implement global error handler middleware.
PHẢI handle Sequelize validation errors.
PHẢI handle unique constraint errors.
KHÔNG ĐƯỢC expose stack trace trong production.

---

## 5. DATABASE STANDARDS

### 5.1 Naming Conventions

PHẢI sử dụng snake_case cho tất cả database identifiers.
PHẢI sử dụng plural cho table names.
PHẢI sử dụng [table]_id pattern cho foreign keys.

```sql
-- Tables: plural, snake_case
users, hotel_bookings, service_categories

-- Columns: snake_case
id, user_id, created_at, first_name

-- Indexes: idx_[table]_[column]
idx_users_email, idx_bookings_user_id
```

### 5.2 Migrations

PHẢI tạo migration cho mọi schema change.
PHẢI implement up và down functions.
PHẢI add indexes cho foreign keys và frequently queried columns.
PHẢI sử dụng CURRENT_TIMESTAMP cho timestamps.

### 5.3 Seeders

PHẢI tạo seeders cho demo data.
PHẢI có down function để rollback.

---

## 6. API STANDARDS

### 6.1 RESTful Design

PHẢI tuân thủ RESTful conventions.

```
GET    /api/resources          # List all
GET    /api/resources/:id      # Get one
POST   /api/resources          # Create
PUT    /api/resources/:id      # Update (full)
PATCH  /api/resources/:id      # Update (partial)
DELETE /api/resources/:id      # Delete
```

### 6.2 Response Format

PHẢI return consistent JSON format.

```javascript
// Success
{ "data": [...], "message": "Success" }

// Error
{ "message": "Error message", "error": "Details" }

// Validation Error
{ "message": "Validation failed", "errors": [{ "field": "email", "message": "Invalid" }] }
```

### 6.3 Pagination

PHẢI implement pagination cho list endpoints.
PHẢI return pagination metadata.

```javascript
// Query: ?page=1&limit=10
// Response
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 6.4 Filtering & Search

PHẢI support filtering qua query parameters.
PHẢI implement search với LIKE operator.

---

## 7. AUTHENTICATION & AUTHORIZATION

### 7.1 Clerk Integration

PHẢI sử dụng Clerk cho authentication.
PHẢI implement requireAuth middleware.
PHẢI check userId từ req.auth.

```javascript
export const requireAuth = async (req, res, next) => {
  const { userId } = req.auth;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.userId = userId;
  next();
};
```

### 7.2 Role-Based Access Control

PHẢI implement role-based permissions.
PHẢI store roles trong Clerk publicMetadata.
PHẢI validate roles trong middleware.

```javascript
const ROLES = { USER: 'user', ADMIN: 'admin', SUPER_ADMIN: 'super_admin' };
```

---

## 8. UI/UX RULES

### 8.1 Component Patterns

PHẢI sử dụng consistent border-radius: 8px.
PHẢI sử dụng consistent colors từ design system.
PHẢI add hover effects với transition.

```jsx
// Card Standard
<div className="border rounded-lg bg-white p-5 shadow-sm hover:shadow-lg transition"
     style={{ borderRadius: '8px', borderColor: '#BBDEFB' }}>

// Button Primary
<button className="px-5 py-2 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition"
        style={{ backgroundColor: '#FF6B35', borderRadius: '8px' }}>
```

### 8.2 Responsive Design

PHẢI implement mobile-first approach.
PHẢI test trên breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px).

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
```

### 8.3 Loading States

PHẢI implement loading states cho async operations.
PHẢI sử dụng skeleton hoặc spinner.

```jsx
{loading ? <div className="animate-pulse">...</div> : <div>{content}</div>}
```

### 8.4 Empty States

PHẢI implement empty states cho empty data.
PHẢI provide actionable next steps.

### 8.5 Form Validation

PHẢI validate forms trước khi submit.
PHẢI display validation errors inline.
PHẢI highlight invalid fields.

---

## 9. PERFORMANCE & OPTIMIZATION

### 9.1 Code Splitting

NÊN sử dụng lazy loading cho pages.
PHẢI wrap với Suspense.

```jsx
const HotelsPage = lazy(() => import('./pages/HotelsPage'));
<Suspense fallback={<LoadingSpinner />}>
  <HotelsPage />
</Suspense>
```

### 9.2 Image Optimization

PHẢI sử dụng Cloudinary transformations.
PHẢI add loading="lazy" cho images.

```jsx
<img src={optimizedUrl} loading="lazy" />
```

### 9.3 Database Queries

PHẢI select only needed fields.
PHẢI add limit cho queries.
PHẢI use indexes cho frequently queried columns.

```javascript
// ĐÚNG
await Hotel.findAll({ attributes: ['id', 'name', 'price'], limit: 10 });

// SAI
await Hotel.findAll();
```

---

## 10. TESTING & QUALITY CHECKLIST

PHẢI kiểm tra trước khi deploy:
- Forms có validation
- Error states hiển thị đúng
- Loading states hoạt động
- Responsive trên mobile, tablet, desktop
- Authentication flow hoạt động
- API error handling
- Browser compatibility
- Performance (Lighthouse > 80)

PHẢI kiểm tra code:
- Tuân thủ naming conventions
- Không có console.log trong production
- Không có hardcoded values
- Error handling đầy đủ
- No unused imports/variables

---

## 11. DEPLOYMENT & ENVIRONMENT

### 11.1 Scripts

```bash
npm run dev          # Development
npm run build        # Production build
npm start            # Production server
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
```

### 11.2 Environment Variables

```bash
# Backend
NODE_ENV=production
PORT=5000
DATABASE_URL=mysql://user:pass@host:3306/dbname
CLERK_SECRET_KEY=sk_live_xxxxx
CLOUDINARY_URL=cloudinary://xxxxx

# Frontend
VITE_API_URL=https://api.domain.com/api
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
```

### 11.3 CORS

PHẢI configure allowed origins.
PHẢI enable credentials: true.

---

## 12. DOCUMENTATION STANDARDS

### 12.1 Code Comments

PHẢI document functions với JSDoc.

```javascript
/**
 * Calculate total price
 * @param {number} basePrice - Original price
 * @param {number} discount - Discount percentage
 * @returns {number} Final price
 */
```

### 12.2 API Documentation

PHẢI document routes với @route, @desc, @access.

```javascript
/**
 * @route   GET /api/hotels/:id
 * @desc    Get hotel by ID
 * @access  Public
 */
```

### 12.3 README

PHẢI include: Description, Tech Stack, Installation, Project Structure, Scripts, Environment Variables.

---

## 13. QUICK REFERENCE

### Colors — Quy tắc 60/30/10

| Vai trò | Tỉ lệ | Màu | Hex | Dùng cho |
|---------|-------|-----|-----|----------|
| Dominant | 60% | Background trắng | `#FFFFFF` | Nền trang, card |
| Dominant | 60% | Background xanh nhạt | `#F0F7FF` | Section, nền xen kẽ |
| Secondary | 30% | Blue chính | `#1976D2` | Button, link, icon |
| Secondary | 30% | Blue đậm | `#0D47A1` | Heading, nav active |
| Secondary | 30% | Text chính | `#212121` | Body text |
| Accent | 10% | Cam CTA | `#FF6B35` | Button CTA, price |
| Accent | 10% | Cam nhạt | `#FFE8E0` | Accent background |

### Standards
- Border Radius: 8px (rounded-lg)
- Section Padding: py-8 (2rem)
- Card Padding: p-6 (1.5rem)
- Element Gaps: gap-4 (1rem)

---

## 14. VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2026-02-04 | Condensed version, removed examples, focused on rules |
| 1.0.0 | 2026-01-27 | Initial release |

---

Quy chuẩn này là living document và được cập nhật dựa trên best practices.