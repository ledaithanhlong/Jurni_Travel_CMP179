# TÓM TẮT DỰ ÁN JURNI

> **Đồ án chuyên ngành Công nghệ phần mềm - Nhóm "Nước Dừa Code"**  
> **Trường Đại học Công nghệ TP.HCM (HUTECH)**

---

## TỔNG QUAN DỰ ÁN

### Giới thiệu
**Jurni** là một website đặt và quản lý tour du lịch được xây dựng theo kiến trúc **Client-Server** hiện đại. Dự án nhằm mục đích giúp người dùng dễ dàng tìm kiếm, đặt tour du lịch và quản lý thông tin tour một cách tiện lợi.

### Thông tin cơ bản
- **Tên dự án**: Jurni Travel
- **Loại dự án**: Đồ án chuyên ngành
- **Kiến trúc**: Client-Server (Frontend React + Backend Node.js)
- **Database**: MySQL 8.0+
- **Repository**: [GitHub - Jurni Travel](https://github.com/ledaithanhlong/Jurni_Travel)
- **License**: Educational project - HUTECH University

---

## THÀNH VIÊN NHÓM

| STT | Họ và tên | MSSV | Vai trò | Trách nhiệm |
|-----|-----------|------|---------|-------------|
| 1 | Nguyễn Khắc Minh Hiếu | 2280607474 | **Backend Lead** | API Development, Database Design, Server Architecture |
| 2 | Lê Đại Thanh Long | 2280601752 | **Frontend Lead** | UI/UX Design, React Components, Client-side Logic |
| 3 | Nguyễn Huy Sơn | 2280602756 | **Database & QA** | Database Management, Testing, Quality Assurance |

---

## TÍNH NĂNG CHÍNH

### Tính năng cho Người dùng
1. **🔍 Tìm kiếm và Đặt Tour**
   - Tìm kiếm khách sạn, chuyến bay, hoạt động, xe cho thuê
   - Lọc theo giá, địa điểm, đánh giá
   - Xem chi tiết dịch vụ với hình ảnh và mô tả

2. **Giỏ hàng và Thanh toán**
   - Quản lý giỏ hàng
   - Thanh toán trực tuyến qua VNPay/MoMo
   - Lưu lịch sử đặt tour

3. **Đánh giá và Yêu thích**
   - Đánh giá tour đã tham gia
   - Lưu tour yêu thích
   - Xem đánh giá từ người dùng khác

4. **Quản lý Tài khoản**
   - Đăng ký/Đăng nhập với Clerk
   - Cập nhật thông tin cá nhân
   - Xem lịch sử đặt tour

5. **Chat Real-time**
   - Chat trực tiếp với hỗ trợ viên
   - Nhận thông báo real-time
   - Lịch sử cuộc trò chuyện

6. **Thông báo**
   - Thông báo đặt tour thành công
   - Cập nhật trạng thái đơn hàng
   - Khuyến mãi và ưu đãi

### Tính năng cho Admin
1. **Dashboard**
   - Thống kê doanh thu
   - Quản lý đơn hàng
   - Theo dõi người dùng

2. **Quản lý Dịch vụ**
   - CRUD khách sạn, chuyến bay, hoạt động, xe
   - Upload hình ảnh lên Cloudinary
   - Quản lý giá và khả dụng

3. **Quản lý Chat**
   - Xem tất cả cuộc trò chuyện
   - Trả lời tin nhắn khách hàng
   - Quản lý hỗ trợ viên

4. **Quản lý Người dùng**
   - Xem danh sách người dùng
   - Phân quyền (User, Admin, Super Admin)
   - Quản lý đánh giá

---

## CÔNG NGHỆ SỬ DỤNG

### Frontend Stack
| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **React** | 18.3.1 | UI Framework |
| **Vite** | 5.4.10 | Build Tool & Dev Server |
| **React Router DOM** | 6.27.0 | Client-side Routing |
| **TailwindCSS** | 3.4.17 | Styling Framework |
| **Clerk React** | 5.11.2 | Authentication |
| **Axios** | 1.7.7 | HTTP Client |
| **Socket.io Client** | 4.8.3 | Real-time Communication |
| **Lucide React** | 0.562.0 | Icon Library |
| **html2canvas** | 1.4.1 | Screenshot/Export |
| **jsPDF** | 3.0.3 | PDF Generation |
| **react-easy-crop** | 5.5.6 | Image Cropping |

### Backend Stack
| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **Node.js** | LTS | Runtime Environment |
| **Express.js** | 4.19.2 | Web Framework |
| **Sequelize** | 6.37.7 | ORM (Object-Relational Mapping) |
| **MySQL2** | 3.15.3 | Database Driver |
| **Clerk Express** | 1.3.20 | Authentication & JWT |
| **Socket.io** | 4.8.3 | WebSocket Server |
| **Cloudinary** | 1.41.3 | Image Storage & CDN |
| **Multer** | 1.4.5-lts.1 | File Upload Middleware |
| **Helmet** | 7.1.0 | Security Headers |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **bcryptjs** | 2.4.3 | Password Hashing |
| **jsonwebtoken** | 9.0.2 | JWT Token Generation |
| **@google/generative-ai** | 0.24.1 | AI Integration |
| **dotenv** | 16.4.5 | Environment Variables |

### Development Tools
| Tool | Mục đích |
|------|----------|
| **nodemon** | Auto-restart Backend |
| **sequelize-cli** | Database Migrations |
| **tunnelto** | Local Development Tunneling |
| **Autoprefixer** | CSS Vendor Prefixes |
| **PostCSS** | CSS Processing |

---

## CẤU TRÚC DỰ ÁN

### Tổng quan
```
DACN_Jurni/
├── frontend/               # React Application
├── backend/                # Node.js API Server
├── README.md              # Hướng dẫn chính
├── RULE.md                # Quy chuẩn phát triển
├── DATABASE_SETUP.md      # Hướng dẫn setup database
├── CLERK_BRANDING_SETUP.md # Hướng dẫn cấu hình Clerk
├── TUNNELTO_SETUP.md      # Hướng dẫn tunneling
└── QUICK_SETUP.bat        # Script setup nhanh
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/        # UI Components
│   │   ├── layout/       # Header, Footer, Sidebar
│   │   ├── common/       # Button, Input, Card
│   │   └── features/     # Feature-specific components
│   ├── pages/            # Page Components (26 pages)
│   │   ├── HomePage.jsx
│   │   ├── HotelsPage.jsx
│   │   ├── FlightsPage.jsx
│   │   ├── ActivitiesPage.jsx
│   │   ├── CarsPage.jsx
│   │   ├── BookingsPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ... (20+ more pages)
│   ├── routes/           # Routing Configuration
│   ├── data/             # Mock Data & Constants
│   ├── theme/            # Design System
│   ├── utils/            # Utility Functions
│   ├── styles.css        # Global Styles
│   └── main.jsx          # Entry Point
├── public/               # Static Assets
└── package.json
```

### Backend Structure
```
backend/
├── src/
│   ├── config/           # Configuration Files
│   │   ├── database.cjs  # Database Config
│   │   └── cloudinary.js # Cloudinary Config
│   ├── controllers/      # Request Handlers (16 controllers)
│   │   ├── authController.js
│   │   ├── hotelController.js
│   │   ├── flightController.js
│   │   ├── activityController.js
│   │   ├── carController.js
│   │   ├── bookingController.js
│   │   └── ... (10+ more)
│   ├── models/           # Database Models (17 models)
│   │   ├── user.js
│   │   ├── hotel.js
│   │   ├── flight.js
│   │   ├── activity.js
│   │   ├── car.js
│   │   ├── booking.js
│   │   ├── favorite.js
│   │   ├── review.js
│   │   ├── notification.js
│   │   ├── chatConversation.js
│   │   ├── chatMessage.js
│   │   └── ... (6+ more)
│   ├── routes/           # API Routes (19 routes)
│   ├── middlewares/      # Middleware Functions
│   ├── migrations/       # Database Migrations (14 migrations)
│   ├── services/         # Business Logic
│   ├── socket/           # WebSocket Handlers
│   └── server.js         # Entry Point
└── package.json
```

---

## CẤU TRÚC DATABASE

### Tables chính

| Table | Mô tả | Columns chính |
|-------|-------|---------------|
| **users** | Thông tin người dùng | clerk_id, email, first_name, last_name, role |
| **hotels** | Danh sách khách sạn | name, location, price, rating, amenities, images |
| **flights** | Danh sách chuyến bay | airline, origin, destination, price, departure_time |
| **activities** | Hoạt động/Tour | title, location, price, duration, category |
| **cars** | Xe cho thuê | brand, model, price_per_day, location, features |
| **bookings** | Đơn đặt | user_id, service_type, service_id, total_price, status |
| **favorites** | Yêu thích | user_id, service_type, service_id |
| **reviews** | Đánh giá | user_id, service_type, service_id, rating, comment |
| **notifications** | Thông báo | user_id, title, message, is_read |
| **chat_conversations** | Cuộc trò chuyện | user_id, admin_id, status |
| **chat_messages** | Tin nhắn | conversation_id, sender_id, message |
| **team_members** | Thành viên team | name, role, bio, image |
| **vouchers** | Mã giảm giá | code, discount_type, discount_value, valid_until |
| **rooms** | Phòng khách sạn | hotel_id, room_type, price, capacity |
| **gallery_images** | Thư viện ảnh | service_type, service_id, image_url |
| **testimonials** | Lời chứng thực | user_id, content, rating |
| **career_values** | Giá trị nghề nghiệp | title, description, icon |

### Relationships
- **Users** → **Bookings** (1:N)
- **Users** → **Favorites** (1:N)
- **Users** → **Reviews** (1:N)
- **Users** → **Notifications** (1:N)
- **Users** → **Chat Conversations** (1:N)
- **Hotels** → **Rooms** (1:N)
- **Chat Conversations** → **Chat Messages** (1:N)

---

## DESIGN SYSTEM

### Color Palette
```css
/* Primary Colors */
--primary-dark: #0D47A1;
--primary-medium: #1976D2;
--primary-light: #42A5F5;

/* Accent Colors */
--accent-primary: #FF6B35;
--accent-secondary: #FF9800;
--accent-light: #FFE8E0;

/* Background */
--bg-white: #FFFFFF;
--bg-blue-1: #F0F7FF;
--bg-blue-2: #E3F2FD;
--bg-blue-3: #E8F4FD;
--bg-blue-4: #F5FAFF;

/* Text */
--text-primary: #212121;
--text-secondary: #757575;
--text-disabled: #BDBDBD;

/* Border */
--border-light: #BBDEFB;
--border-medium: #90CAF9;
--border-dark: #64B5F6;
```

### Typography
- **Font Sizes**: 12px - 30px (xs to 3xl)
- **Font Weights**: 400 (normal), 600 (semibold), 700 (bold)

### Spacing & Radius
- **Section Padding**: 2rem (py-8)
- **Card Padding**: 1.5rem (p-6)
- **Element Gap**: 1rem (gap-4)
- **Border Radius**: 8px (standard)

---

## AUTHENTICATION & AUTHORIZATION

### Clerk Integration
- **Provider**: Clerk (clerk.com)
- **Authentication Methods**: Email/Password, OAuth (Google, Facebook)
- **Session Management**: JWT Tokens
- **User Metadata**: Stored in Clerk publicMetadata

### Role-Based Access Control (RBAC)
| Role | Permissions |
|------|-------------|
| **User** | Xem dịch vụ, Đặt tour, Chat, Đánh giá |
| **Admin** | Quản lý dịch vụ, Xem dashboard, Trả lời chat |
| **Super Admin** | Tất cả quyền Admin + Quản lý users, Phân quyền |

### Middleware
```javascript
// requireAuth: Kiểm tra user đã đăng nhập
// requireAdmin: Kiểm tra user có role admin
// requireSuperAdmin: Kiểm tra user có role super_admin
```

---

## API ENDPOINTS

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user

### Hotels
- `GET /api/hotels` - Danh sách khách sạn
- `GET /api/hotels/:id` - Chi tiết khách sạn
- `POST /api/hotels` - Tạo khách sạn (Admin)
- `PUT /api/hotels/:id` - Cập nhật (Admin)
- `DELETE /api/hotels/:id` - Xóa (Admin)

### Flights
- `GET /api/flights` - Danh sách chuyến bay
- `GET /api/flights/:id` - Chi tiết chuyến bay
- `POST /api/flights` - Tạo chuyến bay (Admin)

### Activities
- `GET /api/activities` - Danh sách hoạt động
- `GET /api/activities/:id` - Chi tiết hoạt động
- `POST /api/activities` - Tạo hoạt động (Admin)

### Cars
- `GET /api/cars` - Danh sách xe
- `GET /api/cars/:id` - Chi tiết xe
- `POST /api/cars` - Tạo xe (Admin)

### Bookings
- `GET /api/bookings` - Lịch sử đặt tour
- `POST /api/bookings` - Tạo đơn đặt
- `GET /api/bookings/:id` - Chi tiết đơn đặt
- `PATCH /api/bookings/:id/status` - Cập nhật trạng thái (Admin)

### Favorites
- `GET /api/favorites` - Danh sách yêu thích
- `POST /api/favorites` - Thêm yêu thích
- `DELETE /api/favorites/:id` - Xóa yêu thích

### Reviews
- `GET /api/reviews` - Danh sách đánh giá
- `POST /api/reviews` - Tạo đánh giá
- `PUT /api/reviews/:id` - Cập nhật đánh giá
- `DELETE /api/reviews/:id` - Xóa đánh giá

### Chat
- `GET /api/chat/conversations` - Danh sách cuộc trò chuyện
- `POST /api/chat/conversations` - Tạo cuộc trò chuyện
- `GET /api/chat/messages/:conversationId` - Lấy tin nhắn
- `POST /api/chat/messages` - Gửi tin nhắn

### Notifications
- `GET /api/notifications` - Danh sách thông báo
- `PATCH /api/notifications/:id/read` - Đánh dấu đã đọc

### Admin
- `GET /api/admin/stats` - Thống kê dashboard
- `GET /api/admin/users` - Danh sách users
- `PATCH /api/admin/users/:id/role` - Phân quyền

---

## HƯỚNG DẪN CÀI ĐẶT

### Yêu cầu hệ thống
- **Node.js**: v16 trở lên
- **MySQL**: 8.0+
- **XAMPP/WAMP**: Cho MySQL server
- **npm**: Package manager

### Bước 1: Clone Repository
```bash
git clone https://github.com/ledaithanhlong/Jurni_Travel.git
cd DACN_Jurni
```

### Bước 2: Setup Database
```bash
# Khởi động MySQL (XAMPP/WAMP)
# Tạo database: Jurni_db

# Vào backend
cd backend
npm install

# Copy .env.example thành .env
copy .env.example .env

# Chỉnh sửa .env với thông tin database của bạn
# DB_HOST=127.0.0.1
# DB_NAME=Jurni_db
# DB_USER=root
# DB_PASS=

# Chạy migrations
npm run db:migrate
```

### Bước 3: Setup Backend
```bash
cd backend
npm install
npm run dev
# Server chạy tại: http://localhost:5000
```

### Bước 4: Setup Frontend
```bash
cd frontend
npm install
npm run dev
# App chạy tại: http://localhost:5173
```

### Bước 5: Cấu hình Clerk
1. Tạo tài khoản tại [clerk.com](https://clerk.com)
2. Tạo application mới
3. Copy API keys vào `.env`:
   - Backend: `CLERK_SECRET_KEY`
   - Frontend: `VITE_CLERK_PUBLISHABLE_KEY`

### Bước 6: Cấu hình Cloudinary (Optional)
1. Tạo tài khoản tại [cloudinary.com](https://cloudinary.com)
2. Copy credentials vào backend `.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

---

## SCRIPTS

### Backend Scripts
```bash
npm run dev              # Start development server
npm start                # Start production server
npm run db:migrate       # Run database migrations
npm run db:migrate:undo  # Undo last migration
npm run db:seed          # Seed database with demo data
npm run db:seed:undo     # Undo all seeds
npm run tunnel:backend   # Start tunnelto for backend
```

### Frontend Scripts
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run tunnel:frontend  # Start tunnelto for frontend
```

---

## TESTING & QUALITY

### Checklist trước khi deploy
- Forms có validation
- Error states hiển thị đúng
- Loading states hoạt động
- Responsive trên mobile, tablet, desktop
- Authentication flow hoạt động
- API error handling
- Browser compatibility
- Performance (Lighthouse > 80)

### Code Quality
- Tuân thủ naming conventions
- Không có console.log trong production
- Không có hardcoded values
- Error handling đầy đủ
- No unused imports/variables

---

## CÔNG CỤ HỖ TRỢ

### Tunnelto (Development Tunneling)
- **Mục đích**: Expose local server ra internet
- **Use cases**: 
  - Testing payment webhooks (VNPay/MoMo)
  - Mobile app testing
  - Demo cho client
- **Commands**:
  ```bash
  npm run tunnel:backend
  npm run tunnel:frontend
  ```

### Quick Setup Script
- **File**: `QUICK_SETUP.bat`
- **Mục đích**: Tự động setup toàn bộ project
- **Chạy**: Double-click file hoặc `./QUICK_SETUP.bat`

---

## TÀI LIỆU THAM KHẢO

### Documentation Files
1. **[README.md](./README.md)** - Hướng dẫn tổng quan
2. **[RULE.md](./RULE.md)** - Quy chuẩn phát triển (552 dòng)
3. **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Hướng dẫn setup database chi tiết
4. **[CLERK_BRANDING_SETUP.md](./CLERK_BRANDING_SETUP.md)** - Cấu hình Clerk branding
5. **[TUNNELTO_SETUP.md](./TUNNELTO_SETUP.md)** - Hướng dẫn sử dụng tunnelto

### External Resources
- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com
- **Sequelize Docs**: https://sequelize.org
- **Clerk Docs**: https://clerk.com/docs
- **TailwindCSS Docs**: https://tailwindcss.com

---

## ROADMAP & FUTURE FEATURES

### Phase 1 (Completed) 
- Basic CRUD cho Hotels, Flights, Activities, Cars
- Authentication với Clerk
- Booking system
- Favorites & Reviews
- Real-time chat
- Admin dashboard

### Phase 2 (In Progress) 
- Payment integration (VNPay/MoMo)
- Email notifications
- Advanced search & filters
- Voucher system
- Price alerts

### Phase 3 (Planned) 
- Mobile app (React Native)
- AI-powered recommendations
- Multi-language support
- Advanced analytics
- Social media integration

---

## TROUBLESHOOTING

### Lỗi thường gặp

#### 1. Database Connection Error
```
Error: Access denied for user 'root'@'localhost'
```
**Giải pháp**: Kiểm tra `DB_USER` và `DB_PASS` trong `.env`

#### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Giải pháp**: 
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### 3. Clerk Authentication Error
```
Error: CLERK_SECRET_KEY is not set
```
**Giải pháp**: Thêm Clerk keys vào `.env`

#### 4. Migration Error
```
Error: Unknown database 'Jurni_db'
```
**Giải pháp**: Tạo database trong phpMyAdmin

---

## LIÊN HỆ & HỖ TRỢ

### Team Contact
- **Email**: lucaslee050304@gmail.com
- **GitHub**: [ledaithanhlong](https://github.com/ledaithanhlong)
- **Repository Issues**: [GitHub Issues](https://github.com/ledaithanhlong/Jurni_Travel/issues)

### Support
- Nếu gặp vấn đề, tạo issue trên GitHub
- Hoặc liên hệ trực tiếp qua email

---

## THỐNG KÊ DỰ ÁN

### Code Statistics
- **Frontend Pages**: 26 pages
- **Backend Controllers**: 16 controllers
- **Database Models**: 17 models
- **API Routes**: 19 route files
- **Database Migrations**: 14 migrations
- **Total Dependencies**: 50+ packages

### File Structure
```
Total Files: 200+
├── Frontend: 100+ files
├── Backend: 100+ files
└── Documentation: 5 files
```

---

## THÀNH TỰU & ĐIỂM NỔI BẬT

### Technical Achievements
1. **Full-stack Application** với kiến trúc Client-Server hiện đại
2. **Secure Authentication** với Clerk và JWT
3. **Real-time Communication** với Socket.io
4. **Modern UI/UX** với TailwindCSS và responsive design
5. **Robust Database Design** với 17 tables và relationships
6. **RESTful API** với 50+ endpoints
7. **Mobile-first Approach** với responsive design
8. **Developer Tools** với tunneling và quick setup scripts

### Best Practices
- Component-based architecture
- Separation of concerns (MVC pattern)
- Environment-based configuration
- Error handling và validation
- Code documentation
- Git version control
- Development standards (RULE.md)

---

## NOTES

### Development Environment
- **OS**: Windows
- **IDE**: VS Code (recommended)
- **Database Tool**: phpMyAdmin
- **API Testing**: Postman/Thunder Client
- **Version Control**: Git

### Production Considerations
- Secure environment variables
- HTTPS only
- Rate limiting
- Input sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

---

## LICENSE

**Educational Project - HUTECH University**

Dự án này được phát triển cho mục đích học tập tại Trường Đại học Công nghệ TP.HCM (HUTECH). Không được sử dụng cho mục đích thương mại mà không có sự cho phép.

---

## ACKNOWLEDGMENTS

### Technologies Used
- React Team - For the amazing React framework
- Express Team - For the robust web framework
- Sequelize Team - For the powerful ORM
- Clerk Team - For the authentication solution
- TailwindCSS Team - For the utility-first CSS framework
- Socket.io Team - For real-time communication

### Special Thanks
- **HUTECH University** - Cung cấp môi trường học tập
- **Giảng viên hướng dẫn** - Hỗ trợ và định hướng dự án
- **Nhóm "Nước Dừa Code"** - Teamwork và collaboration

---

**Last Updated**: 2026-02-04  
**Version**: 1.0.0  
**Status**: Active Development

---

> **"Jurni - Khám phá Việt Nam theo cách của bạn"** 
