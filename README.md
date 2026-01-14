# 🛒 E-Commerce Application

Dự án **E-Commerce** được xây dựng với **Laravel 12 (Backend)** và **Vite (Frontend)**.

---

## 🚀 Công nghệ sử dụng

- **Backend:** Laravel 12 (PHP Framework)
- **Database:** MySQL
- **Authentication:** JWT
- **Social Login:** Google & Facebook OAuth
- **Image Storage:** Cloudinary
- **Email Service:** Gmail SMTP
- **Frontend:** Vite
- **Build Tool:** Vite

---

## 📦 Cài đặt

### 🔧 Backend

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan storage:link
```

> ⚠️ Cấu hình các biến môi trường trong file `.env` (Database, Cloudinary, Gmail SMTP, Google & Facebook OAuth)

---

### 🎨 Frontend

```bash
npm install
npm run dev
```

---

### 🗄️ Database

```bash
php artisan migrate
```


