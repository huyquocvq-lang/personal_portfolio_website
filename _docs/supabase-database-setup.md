# Supabase Database Setup

## Mô tả

Backend đã được cấu hình để sử dụng Supabase PostgreSQL database thay vì SQLite. Database được quản lý thông qua Supabase với project name "personal portfolio".

## Cấu hình

### 1. Environment Variables

Tạo file `.env` trong thư mục `backend/` với nội dung sau:

```env
# Supabase Database Configuration
# Get your database password from Supabase Dashboard > Settings > Database
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.tixmpgpsfflupbyyuvfg.supabase.co:5432/postgres

# Application
NODE_ENV=development
PORT=3000

# Supabase API (optional, for direct API calls if needed)
SUPABASE_URL=https://tixmpgpsfflupbyyuvfg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeG1wZ3BzZmZsdXBieXl1dmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzA1NzYsImV4cCI6MjA3MTAwNjU3Nn0.wyOSUU1DBg9Yp9z-6NmcxPRx2Z6x_3G5Svh7bvcONKA
```

**Lưu ý**: Thay `[YOUR_PASSWORD]` bằng database password của bạn. Lấy password từ:
- Supabase Dashboard > Settings > Database > Database password

### 2. Database Schema

Database đã được setup với các bảng sau:

#### `blog_posts`
- `id` (UUID, Primary Key)
- `title_vi`, `title_en` (VARCHAR)
- `slug` (VARCHAR, Unique)
- `content_vi`, `content_en` (TEXT)
- `excerpt_vi`, `excerpt_en` (TEXT, nullable)
- `featured_image` (VARCHAR, nullable)
- `author` (VARCHAR)
- `published_at` (TIMESTAMP, nullable)
- `status` (ENUM: 'draft' | 'published')
- `view_count` (INTEGER, default: 0)
- `created_at`, `updated_at` (TIMESTAMP)

#### `tags`
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Unique)
- `slug` (VARCHAR, Unique)
- `created_at` (TIMESTAMP)

#### `blog_post_tags` (Junction Table)
- `blog_post_id` (UUID, Foreign Key → blog_posts.id)
- `tag_id` (UUID, Foreign Key → tags.id)
- Primary Key: (blog_post_id, tag_id)

### 3. Migration

Migration đã được apply với tên `initial_schema_setup`, bao gồm:
- Tạo enum type cho blog post status
- Tạo các bảng và relationships
- Tạo indexes cho performance
- Tạo trigger để auto-update `updated_at` timestamp

### 4. TypeORM Configuration

File `app.module.ts` đã được cập nhật để:
- Sử dụng PostgreSQL thay vì SQLite
- Đọc connection string từ `DATABASE_URL` environment variable
- Auto-sync schema trong development mode
- Sử dụng SSL connection trong production

## Cách sử dụng

### Development

1. Tạo file `.env` với database password
2. Chạy backend:
```bash
cd backend
npm run start:dev
```

### Production

1. Set `NODE_ENV=production` trong environment variables
2. Đảm bảo `DATABASE_URL` được set đúng
3. TypeORM sẽ không auto-sync schema (sử dụng migrations thay thế)

## Migration Management

Để tạo migration mới hoặc quản lý migrations, sử dụng Supabase MCP tools hoặc Supabase Dashboard.

Xem danh sách migrations:
```bash
# Sử dụng MCP Supabase tool: list_migrations
```

Apply migration mới:
```bash
# Sử dụng MCP Supabase tool: apply_migration
```

## API Endpoints

Backend API endpoints không thay đổi, vẫn hoạt động như trước:
- `GET /blog` - Lấy danh sách blog posts
- `GET /blog/:slug` - Lấy chi tiết blog post

## Breaking Changes

- **Database**: Đã chuyển từ SQLite sang PostgreSQL
- **Connection**: Cần cấu hình `DATABASE_URL` trong `.env`
- **Data**: Data cũ trong `portfolio.db` không tự động migrate, cần migrate thủ công nếu có

## Date/Version

- **Date**: 2025-01-15
- **Version**: 1.0.0

