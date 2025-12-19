# Blog Feature - Technical Specification

## 📋 Tổng quan

Thêm tính năng blog vào personal portfolio website, cho phép người dùng xem các bài viết blog với đầy đủ tính năng cơ bản của một blog system.

## 🎯 Mục tiêu

- Tạo page/blog route để hiển thị danh sách và chi tiết blog posts
- Hỗ trợ đa ngôn ngữ (Tiếng Việt và Tiếng Anh)
- Hệ thống tag để phân loại bài viết
- Lưu trữ nội dung HTML trong database
- Các tính năng cơ bản của blog (list, detail, search, filter)

## 🏗️ Kiến trúc

### Frontend
- **Route**: `/blog` (danh sách), `/blog/:slug` (chi tiết)
- **Components cần tạo**:
  - `BlogList` - Hiển thị danh sách blog posts
  - `BlogCard` - Card hiển thị preview của 1 blog post
  - `BlogDetail` - Trang chi tiết blog post
  - `BlogTag` - Component hiển thị tag
  - `BlogFilter` - Filter theo tag và ngôn ngữ
  - `BlogSearch` - Tìm kiếm blog posts
  - `LanguageSwitcher` - Chuyển đổi ngôn ngữ (nếu cần)

### Backend
- **API Endpoints**:
  - `GET /api/blog` - Lấy danh sách blog posts (với pagination, filter, search)
  - `GET /api/blog/:id` - Lấy chi tiết 1 blog post
  - `GET /api/blog/tags` - Lấy danh sách tất cả tags
  - `GET /api/blog/:id/tags` - Lấy tags của 1 blog post

- **Database Schema**:
  ```sql
  Table: blog_posts
  - id: UUID (Primary Key)
  - title_vi: VARCHAR (Tiêu đề tiếng Việt)
  - title_en: VARCHAR (Tiêu đề tiếng Anh)
  - slug: VARCHAR (Unique, URL-friendly)
  - content_vi: TEXT (HTML content tiếng Việt)
  - content_en: TEXT (HTML content tiếng Anh)
  - excerpt_vi: TEXT (Mô tả ngắn tiếng Việt)
  - excerpt_en: TEXT (Mô tả ngắn tiếng Anh)
  - featured_image: VARCHAR (URL ảnh đại diện)
  - author: VARCHAR (Tên tác giả)
  - published_at: TIMESTAMP (Ngày publish)
  - created_at: TIMESTAMP
  - updated_at: TIMESTAMP
  - status: ENUM('draft', 'published') (Trạng thái)
  - view_count: INTEGER (Số lượt xem)

  Table: tags
  - id: UUID (Primary Key)
  - name: VARCHAR (Unique, tên tag)
  - slug: VARCHAR (Unique, URL-friendly)
  - created_at: TIMESTAMP

  Table: blog_post_tags (Many-to-Many)
  - blog_post_id: UUID (Foreign Key -> blog_posts.id)
  - tag_id: UUID (Foreign Key -> tags.id)
  ```

## 📝 Chi tiết tính năng

### 1. Blog List Page (`/blog`)

**Tính năng:**
- Hiển thị danh sách blog posts dạng grid/list
- Pagination (phân trang)
- Filter theo tag
- Filter theo ngôn ngữ (Vi/En)
- Search theo title và content
- Sort theo: Mới nhất, Cũ nhất, Nhiều view nhất
- Mỗi blog card hiển thị:
  - Featured image
  - Title (theo ngôn ngữ đã chọn)
  - Excerpt (mô tả ngắn)
  - Tags
  - Published date
  - View count
  - Read more button

**API Request:**
```
GET /api/blog?page=1&limit=10&tag=react&lang=vi&search=javascript&sort=newest
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Tiêu đề bài viết",
      "slug": "tieu-de-bai-viet",
      "excerpt": "Mô tả ngắn...",
      "featured_image": "https://...",
      "tags": [
        { "id": "uuid", "name": "React", "slug": "react" }
      ],
      "published_at": "2024-01-15T10:00:00Z",
      "view_count": 150,
      "author": "Your Name"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2. Blog Detail Page (`/blog/:slug`)

**Tính năng:**
- Hiển thị full content HTML của blog post
- Language switcher (chuyển giữa Vi/En)
- Hiển thị tags
- Related posts (bài viết liên quan - cùng tags)
- View count increment
- Social share buttons (optional)
- Reading time estimate

**API Request:**
```
GET /api/blog/:slug?lang=vi
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Tiêu đề bài viết",
  "slug": "tieu-de-bai-viet",
  "content": "<html>...</html>",
  "excerpt": "Mô tả ngắn...",
  "featured_image": "https://...",
  "tags": [
    { "id": "uuid", "name": "React", "slug": "react" }
  ],
  "published_at": "2024-01-15T10:00:00Z",
  "view_count": 151,
  "author": "Your Name",
  "reading_time": 5,
  "related_posts": [
    {
      "id": "uuid",
      "title": "Bài viết liên quan",
      "slug": "bai-viet-lien-quan",
      "featured_image": "https://..."
    }
  ]
}
```

### 3. Tag System

**Tính năng:**
- Mỗi blog post có thể có nhiều tags
- Click vào tag để filter blog posts theo tag đó
- Hiển thị popular tags (tags được dùng nhiều nhất)
- Tag cloud component (optional)

**API:**
```
GET /api/blog/tags
GET /api/blog?tag=react
```

### 4. Language Support

**Tính năng:**
- Mỗi blog post có 2 version: Tiếng Việt và Tiếng Anh
- User có thể switch giữa 2 ngôn ngữ
- Default language: Tiếng Việt
- Language được lưu trong localStorage hoặc URL query param
- API trả về content theo `lang` parameter

**Implementation:**
- URL: `/blog/:slug?lang=vi` hoặc `/blog/:slug?lang=en`
- Hoặc route riêng: `/blog/:slug` (vi) và `/blog/en/:slug` (en)

## 🗄️ Database Design

### NestJS Entities

**BlogPost Entity:**
```typescript
@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title_vi: string;

  @Column()
  title_en: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  content_vi: string;

  @Column('text')
  content_en: string;

  @Column('text', { nullable: true })
  excerpt_vi: string;

  @Column('text', { nullable: true })
  excerpt_en: string;

  @Column({ nullable: true })
  featured_image: string;

  @Column()
  author: string;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft' })
  status: string;

  @Column({ default: 0 })
  view_count: number;

  @ManyToMany(() => Tag, tag => tag.blogPosts)
  @JoinTable({ name: 'blog_post_tags' })
  tags: Tag[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

**Tag Entity:**
```typescript
@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @ManyToMany(() => BlogPost, blogPost => blogPost.tags)
  blogPosts: BlogPost[];

  @CreateDateColumn()
  created_at: Date;
}
```

## 🎨 UI/UX Considerations

### Blog List
- Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
- Infinite scroll hoặc pagination buttons
- Filter sidebar hoặc top bar
- Search bar prominent

### Blog Detail
- Clean, readable typography
- Proper HTML content rendering (sanitize HTML)
- Code syntax highlighting (nếu có code blocks)
- Image optimization
- Mobile-friendly

## 🔒 Security

- Sanitize HTML content trước khi render (prevent XSS)
- Validate input khi tạo/update blog posts
- Rate limiting cho API endpoints
- Authentication cho admin endpoints (nếu có)

## 📦 Dependencies cần thêm

### Backend
- TypeORM (đã có với NestJS)
- class-validator, class-transformer
- slugify (để tạo slug từ title)

### Frontend
- React Router (nếu chưa có)
- HTML sanitizer (như DOMPurify)
- Date formatting library (như date-fns)
- Code syntax highlighter (như Prism.js hoặc highlight.js) - optional

## 🚀 Implementation Steps

1. **Backend Setup**
   - Tạo database entities (BlogPost, Tag)
   - Tạo migrations
   - Tạo DTOs cho API
   - Tạo BlogService và BlogController
   - Implement CRUD operations
   - Implement filter, search, pagination

2. **Frontend Setup**
   - Tạo Blog routes
   - Tạo BlogList component
   - Tạo BlogCard component
   - Tạo BlogDetail component
   - Tạo BlogFilter và BlogSearch components
   - Implement language switching
   - Styling với Tailwind CSS

3. **Testing**
   - Test API endpoints
   - Test frontend components
   - Test language switching
   - Test filter và search

4. **Documentation**
   - Update README với blog feature
   - Document API endpoints
   - Create usage guide

## ❓ Questions cần clarify

1. **Admin Panel**: Có cần admin panel để tạo/edit blog posts không, hay chỉ import từ file/API?
2. **Rich Text Editor**: Nếu có admin panel, dùng editor nào? (TinyMCE, CKEditor, Markdown editor?)
3. **Image Upload**: Có cần upload ảnh trực tiếp không, hay chỉ dùng URL?
4. **SEO**: Có cần SEO optimization không? (meta tags, sitemap, etc.)
5. **Comments**: Có cần tính năng comment không?
6. **RSS Feed**: Có cần RSS feed không?

## 📅 Timeline Estimate

- Backend: 2-3 days
- Frontend: 2-3 days
- Testing & Polish: 1 day
- **Total: ~5-7 days**

---

**Date Created**: 2024-01-XX
**Status**: Pending Review

