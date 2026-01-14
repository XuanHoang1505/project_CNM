
# 🛒 Laravel E-Commerce Website (Clothes Shop)

Website bán hàng trực tuyến được xây dựng bằng **Laravel**, phục vụ việc kinh doanh quần áo với đầy đủ chức năng từ xác thực người dùng, quản lý đơn hàng đến realtime notification.

---

## 📌 Thông tin chung

- **Framework**: Laravel  
- **Database**: MySQL  
- **Authentication**:
  - JWT
  - Google Login
  - Facebook Login
- **Realtime**: Laravel Reverb (WebSocket)
- **Image Upload**: Cloudinary
- **Mail Service**: Gmail SMTP
- **Session / Queue / Cache**: Database
- **Frontend build**: Vite

---

## 🚀 Tính năng chính

- 👤 Đăng ký / Đăng nhập người dùng
- 🔐 Đăng nhập bằng Google & Facebook
- 🛍️ Quản lý sản phẩm (CRUD)
- 🧾 Đặt hàng & quản lý đơn hàng
- 📦 Upload ảnh sản phẩm qua Cloudinary
- 🔔 Thông báo realtime (WebSocket)
- 📧 Gửi email thông báo / xác nhận
- 🧠 API Authentication bằng JWT

---

## 🧩 Công nghệ sử dụng

| Thành phần | Công nghệ |
|----------|-----------|
| Backend | Laravel |
| Database | MySQL |
| Auth | JWT, OAuth |
| Realtime | Laravel Reverb |
| Storage | Cloudinary |
| Mail | SMTP (Gmail) |
| Build tool | Vite |

---

## 📦 Yêu cầu hệ thống

- PHP >= 8.1
- Composer
- MySQL
- Node.js & npm
- Laravel CLI

---

## ⚙️ Cài đặt dự án

### 1️⃣ Clone source code
```bash
git clone <repository-url>
cd <project-folder>
```

### 2️⃣ Cài đặt backend
```bash
composer install
```

### 3️⃣ Cài đặt frontend
```bash
npm install
npm run dev
```

---

## 🔐 Cấu hình môi trường

Tạo file `.env`:

```bash
cp .env.example .env
```

### Database
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=123456
```

### JWT
```env
JWT_SECRET=your_jwt_secret
```

### Cloudinary
```env
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 🔔 Realtime Notification (Laravel Reverb)

```env
BROADCAST_CONNECTION=reverb
REVERB_HOST=localhost
REVERB_PORT=8080
```

Chạy Reverb:
```bash
php artisan reverb:start
```

---

## 🗃️ Migration & Queue

```bash
php artisan migrate
php artisan queue:work
```

---

## ▶️ Chạy dự án

```bash
php artisan serve
```

Truy cập:
http://127.0.0.1:8000

---

## 🔒 Lưu ý bảo mật

- ❌ Không commit file `.env`
- ✔️ Sử dụng `.env.example`
- ✔️ Gmail SMTP dùng App Password

---

## 👨‍💻 Tác giả

**Đỗ Thành Bảo**  
Backend Developer – Laravel / PHP / MySQL
