# Blog API với Swagger/OpenAPI Documentation

**Date**: 2025-01-27  
**Version**: 1.0.0

## Mô tả tính năng

Triển khai đầy đủ CRUD API cho blog posts với Swagger/OpenAPI documentation. API hỗ trợ:

- **GET** - Lấy danh sách và chi tiết blog posts
- **POST** - Tạo blog post mới
- **PUT** - Cập nhật blog post
- **DELETE** - Xóa blog post
- **Swagger UI** - Tài liệu API tương tác tại `/api/docs`

## Cấu hình Swagger

### Installation

```bash
npm install @nestjs/swagger swagger-ui-express
```

### Configuration (`main.ts`)

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Personal Portfolio API')
  .setDescription('API documentation for Personal Portfolio Website')
  .setVersion('1.0')
  .addTag('blog', 'Blog posts management')
  .addTag('tags', 'Tags management')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

**Swagger UI URL**: `http://localhost:3000/api/docs`

## API Endpoints

### Base URL: `/api/blog`

#### 1. GET `/api/blog` - Lấy danh sách blog posts

**Query Parameters**:
- `page` (number, optional, default: 1) - Số trang
- `limit` (number, optional, default: 10) - Số lượng items mỗi trang
- `tag` (string, optional) - Filter theo tag slug
- `lang` ('vi' | 'en', optional, default: 'vi') - Ngôn ngữ
- `search` (string, optional) - Tìm kiếm trong title và content
- `sort` ('newest' | 'oldest' | 'most_viewed', optional, default: 'newest') - Sắp xếp

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Giới thiệu về NestJS",
      "slug": "gioi-thieu-ve-nestjs",
      "excerpt": "Bài viết giới thiệu về NestJS...",
      "featured_image": "https://example.com/image.jpg",
      "tags": [
        {
          "id": "uuid",
          "name": "NestJS",
          "slug": "nestjs"
        }
      ],
      "published_at": "2025-01-27T00:00:00Z",
      "view_count": 100,
      "author": "John Doe"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### 2. GET `/api/blog/:slug` - Lấy chi tiết blog post

**Path Parameters**:
- `slug` (string) - Slug của blog post

**Query Parameters**:
- `lang` ('vi' | 'en', optional, default: 'vi') - Ngôn ngữ

**Response**:
```json
{
  "id": "uuid",
  "title": "Giới thiệu về NestJS",
  "slug": "gioi-thieu-ve-nestjs",
  "content": "<p>Nội dung bài viết...</p>",
  "excerpt": "Bài viết giới thiệu về NestJS...",
  "featured_image": "https://example.com/image.jpg",
  "tags": [...],
  "published_at": "2025-01-27T00:00:00Z",
  "view_count": 101,
  "author": "John Doe",
  "reading_time": 5,
  "related_posts": [...]
}
```

**Note**: Tự động tăng `view_count` khi xem chi tiết.

#### 3. GET `/api/blog/tags` - Lấy danh sách tags

**Response**:
```json
[
  {
    "id": "uuid",
    "name": "NestJS",
    "slug": "nestjs"
  }
]
```

#### 4. POST `/api/blog` - Tạo blog post mới

**Request Body** (`CreateBlogDto`):
```json
{
  "title_vi": "Giới thiệu về NestJS",
  "title_en": "Introduction to NestJS",
  "slug": "gioi-thieu-ve-nestjs",  // Optional, tự động generate từ title_vi
  "content_vi": "<p>Nội dung tiếng Việt...</p>",
  "content_en": "<p>English content...</p>",
  "excerpt_vi": "Tóm tắt tiếng Việt...",  // Optional
  "excerpt_en": "English excerpt...",  // Optional
  "featured_image": "https://example.com/image.jpg",  // Optional
  "author": "John Doe",
  "published_at": "2025-01-27T00:00:00Z",  // Optional
  "status": "draft",  // Optional, default: "draft"
  "tag_ids": ["uuid1", "uuid2"]  // Optional
}
```

**Response**: `BlogPostDetailDto` (201 Created)

**Validation**:
- `title_vi`, `title_en`, `content_vi`, `content_en`, `author` - Required
- `slug` - Auto-generated từ `title_vi` nếu không có
- `status` - Enum: 'draft' | 'published'

#### 5. PUT `/api/blog/:id` - Cập nhật blog post

**Path Parameters**:
- `id` (string) - UUID của blog post

**Request Body** (`UpdateBlogDto`):
Tất cả fields đều optional, chỉ cần gửi fields muốn update:
```json
{
  "title_vi": "Tiêu đề mới",
  "status": "published",
  "tag_ids": ["uuid1", "uuid2"]
}
```

**Response**: `BlogPostDetailDto` (200 OK)

#### 6. DELETE `/api/blog/:id` - Xóa blog post

**Path Parameters**:
- `id` (string) - UUID của blog post

**Response**:
```json
{
  "message": "Blog post đã được xóa thành công"
}
```

## DTOs

### CreateBlogDto

```typescript
{
  title_vi: string;          // Required
  title_en: string;          // Required
  slug?: string;             // Optional, auto-generated
  content_vi: string;        // Required
  content_en: string;        // Required
  excerpt_vi?: string;       // Optional
  excerpt_en?: string;       // Optional
  featured_image?: string;   // Optional
  author: string;            // Required
  published_at?: string;     // Optional, ISO date string
  status?: BlogPostStatus;  // Optional, default: 'draft'
  tag_ids?: string[];       // Optional, array of tag UUIDs
}
```

### UpdateBlogDto

Extends `PartialType(CreateBlogDto)` - tất cả fields đều optional.

### BlogQueryDto

```typescript
{
  page?: number;           // Default: 1
  limit?: number;         // Default: 10
  tag?: string;           // Tag slug
  lang?: Language;        // Default: 'vi'
  search?: string;         // Search query
  sort?: SortOrder;       // Default: 'newest'
}
```

## Swagger Decorators

Tất cả endpoints đã được decorate với:

- `@ApiTags('blog')` - Nhóm endpoints
- `@ApiOperation()` - Mô tả operation
- `@ApiResponse()` - Mô tả responses
- `@ApiParam()` - Mô tả path parameters
- `@ApiQuery()` - Mô tả query parameters
- `@ApiBody()` - Mô tả request body
- `@ApiProperty()` - Mô tả DTO properties

## Business Logic

### Create Blog Post

1. Generate slug từ `title_vi` nếu không có
2. Check slug conflict
3. Create blog post với status 'draft' (default)
4. Attach tags nếu có `tag_ids`

### Update Blog Post

1. Check blog post exists
2. Generate slug mới nếu `title_vi` thay đổi và không có slug mới
3. Check slug conflict với posts khác
4. Update fields được cung cấp
5. Update tags nếu có `tag_ids`

### Delete Blog Post

1. Check blog post exists
2. Delete blog post (cascade delete tags relations)

## Error Handling

- **400 Bad Request**: Validation errors, slug conflict
- **404 Not Found**: Blog post không tồn tại
- **500 Internal Server Error**: Database errors

## Testing với Swagger UI

1. Start server: `npm run start:dev`
2. Mở browser: `http://localhost:3000/api/docs`
3. Click vào endpoint muốn test
4. Click "Try it out"
5. Điền parameters/body
6. Click "Execute"
7. Xem response

## Dependencies

- `@nestjs/swagger`: Swagger integration cho NestJS
- `swagger-ui-express`: Swagger UI interface
- `class-validator`: Validation decorators
- `class-transformer`: Transform decorators
- `slugify`: Generate slugs từ text

## Breaking Changes

Không có breaking changes. Các endpoints GET hiện tại vẫn hoạt động như cũ.

## Future Enhancements

- Authentication/Authorization cho POST/PUT/DELETE
- File upload cho featured_image
- Bulk operations
- Advanced search với filters
- Export/Import blog posts

