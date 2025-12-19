# Blog Feature - Implementation Documentation

**Date**: 2024-01-XX  
**Version**: 1.0.0  
**Status**: Completed

## 📋 Tổng quan

Tính năng blog đã được implement thành công với đầy đủ các tính năng cơ bản: danh sách blog, chi tiết blog, filter, search, pagination, và hỗ trợ đa ngôn ngữ (Tiếng Việt và Tiếng Anh).

## 🏗️ Kiến trúc đã implement

### Backend (NestJS)

#### Entities
- **BlogPost** (`backend/src/entities/blog-post.entity.ts`)
  - Hỗ trợ 2 ngôn ngữ: `title_vi`, `title_en`, `content_vi`, `content_en`, `excerpt_vi`, `excerpt_en`
  - Status: `draft` hoặc `published`
  - View count tracking
  - Many-to-Many relationship với Tags

- **Tag** (`backend/src/entities/tag.entity.ts`)
  - Name và slug
  - Many-to-Many relationship với BlogPost

#### API Endpoints

**Base URL**: `/api/blog`

1. **GET `/api/blog`** - Lấy danh sách blog posts
   - Query params:
     - `page` (number, default: 1)
     - `limit` (number, default: 10)
     - `tag` (string) - Filter theo tag slug
     - `lang` ('vi' | 'en', default: 'vi')
     - `search` (string) - Search trong title và content
     - `sort` ('newest' | 'oldest' | 'most_viewed', default: 'newest')
   - Response: `{ data: BlogPostListItem[], pagination: Pagination }`

2. **GET `/api/blog/:slug`** - Lấy chi tiết blog post
   - Query params:
     - `lang` ('vi' | 'en', default: 'vi')
   - Response: `BlogPostDetail` (bao gồm related posts và reading time)
   - Tự động increment view count

3. **GET `/api/blog/tags`** - Lấy danh sách tất cả tags
   - Response: `Tag[]`

#### Database
- **Type**: SQLite (development)
- **Location**: `backend/portfolio.db`
- **Synchronize**: `true` (development mode, nên dùng migrations trong production)

### Frontend (React)

#### Routes
- `/blog` - Blog list page
- `/blog/:slug` - Blog detail page

#### Components

1. **BlogListPage** (`frontend/src/pages/BlogListPage.tsx`)
   - Hiển thị danh sách blog posts
   - Filter, search, pagination
   - Language switching
   - Sort options

2. **BlogDetailPage** (`frontend/src/pages/BlogDetailPage.tsx`)
   - Hiển thị full content HTML
   - Language switcher
   - Related posts
   - View count và reading time

3. **BlogCard** (`frontend/src/components/BlogCard/BlogCard.tsx`)
   - Card component hiển thị preview blog post
   - Featured image, title, excerpt, tags, metadata

4. **BlogFilter** (`frontend/src/components/BlogFilter/BlogFilter.tsx`)
   - Filter theo tags
   - Language switcher
   - Sort options

5. **BlogSearch** (`frontend/src/components/BlogSearch/BlogSearch.tsx`)
   - Search input với submit handler

#### Services

**API Service** (`frontend/src/services/api.ts`)
- `blogApi.getBlogs(params)` - Lấy danh sách
- `blogApi.getBlogBySlug(slug, lang)` - Lấy chi tiết
- `blogApi.getTags()` - Lấy tags

## 🔧 Cách sử dụng

### Backend

1. **Start backend server**:
```bash
cd backend
npm run start:dev
```

2. **Database sẽ tự động tạo** khi start server lần đầu (SQLite)

3. **Thêm dữ liệu mẫu** (cần tạo script hoặc seed data):
   - Tạo blog posts với content HTML
   - Tạo tags và link với blog posts

### Frontend

1. **Start frontend**:
```bash
cd frontend
npm run dev
```

2. **Truy cập**:
   - Blog list: `http://localhost:5173/blog`
   - Blog detail: `http://localhost:5173/blog/:slug`

3. **Environment variables** (optional):
   - `VITE_API_URL` - Backend API URL (default: `http://localhost:3000/api`)

## 📝 API Examples

### Get blog list
```bash
GET /api/blog?page=1&limit=10&lang=vi&sort=newest
```

### Get blog by slug
```bash
GET /api/blog/my-blog-post?lang=vi
```

### Get tags
```bash
GET /api/blog/tags
```

## 🎨 UI Features

- **Responsive design**: Mobile, tablet, desktop
- **HTML content rendering**: Sanitized với DOMPurify
- **Language switching**: Vi/En toggle
- **Tag filtering**: Click tag để filter
- **Search**: Real-time search trong title và content
- **Pagination**: Page navigation
- **Related posts**: Hiển thị posts cùng tags
- **Reading time**: Tự động tính toán dựa trên word count

## 🔒 Security

- **HTML Sanitization**: Sử dụng DOMPurify để sanitize HTML content trước khi render
- **Input Validation**: DTOs với class-validator
- **CORS**: Enabled cho frontend

## 📦 Dependencies đã thêm

### Backend
- `@nestjs/typeorm` - TypeORM integration
- `typeorm` - ORM
- `sqlite3` - SQLite driver
- `pg` - PostgreSQL driver (optional)
- `class-validator` - Validation
- `class-transformer` - Transformation
- `slugify` - Slug generation

### Frontend
- `react-router-dom` - Routing
- `dompurify` - HTML sanitization
- `date-fns` - Date formatting
- `@types/dompurify` - TypeScript types

## 🚀 Next Steps / Future Improvements

1. **Admin Panel**: Tạo admin panel để quản lý blog posts
2. **Image Upload**: Upload ảnh trực tiếp thay vì chỉ URL
3. **SEO**: Thêm meta tags, sitemap
4. **Comments**: Tính năng comment
5. **RSS Feed**: RSS feed cho blog
6. **Migrations**: Thay `synchronize: true` bằng migrations cho production
7. **Database**: Chuyển sang PostgreSQL cho production

## 📄 Files Created/Modified

### Backend
- `backend/src/entities/blog-post.entity.ts` (new)
- `backend/src/entities/tag.entity.ts` (new)
- `backend/src/entities/index.ts` (new)
- `backend/src/blog/blog.service.ts` (new)
- `backend/src/blog/blog.controller.ts` (new)
- `backend/src/blog/blog.module.ts` (new)
- `backend/src/blog/dto/blog-query.dto.ts` (new)
- `backend/src/blog/dto/blog-response.dto.ts` (new)
- `backend/src/blog/dto/index.ts` (new)
- `backend/src/app.module.ts` (modified)
- `backend/src/main.ts` (modified)
- `backend/package.json` (modified)

### Frontend
- `frontend/src/pages/BlogListPage.tsx` (new)
- `frontend/src/pages/BlogDetailPage.tsx` (new)
- `frontend/src/components/BlogCard/BlogCard.tsx` (new)
- `frontend/src/components/BlogCard/index.ts` (new)
- `frontend/src/components/BlogFilter/BlogFilter.tsx` (new)
- `frontend/src/components/BlogFilter/index.ts` (new)
- `frontend/src/components/BlogSearch/BlogSearch.tsx` (new)
- `frontend/src/components/BlogSearch/index.ts` (new)
- `frontend/src/services/api.ts` (new)
- `frontend/src/App.tsx` (modified)
- `frontend/src/pages/index.ts` (modified)
- `frontend/src/index.css` (modified)
- `frontend/package.json` (modified)

---

**Note**: Tính năng đã hoàn thành và sẵn sàng để test. Cần thêm dữ liệu mẫu để test đầy đủ các tính năng.

