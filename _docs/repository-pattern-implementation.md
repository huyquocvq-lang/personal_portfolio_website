# Repository Pattern Implementation với Supabase

**Date**: 2025-01-27  
**Version**: 2.0.0

## Mô tả tính năng

Triển khai Repository Pattern cho backend sử dụng **Supabase Client SDK** để tách biệt logic truy vấn database khỏi business logic trong service layer. Pattern này giúp:

- Tách biệt concerns: Repository chỉ lo việc truy vấn DB qua Supabase, Service lo business logic
- Dễ test: Có thể mock repository khi test service
- Dễ maintain: Thay đổi cách truy vấn DB không ảnh hưởng đến service
- Tái sử dụng: Repository có thể được dùng ở nhiều service khác nhau
- **Sử dụng Supabase Client SDK**: Truy vấn trực tiếp qua Supabase REST API thay vì TypeORM

## Cấu trúc

```
backend/src/
├── config/           # Supabase configuration
│   ├── supabase.config.ts
│   └── index.ts
├── entities/         # Định nghĩa các bảng trong Supabase (TypeScript interfaces)
│   ├── blog-post.entity.ts
│   └── tag.entity.ts
└── repositories/     # Repository classes sử dụng Supabase Client
    ├── blog.repository.ts
    └── index.ts
```

## Configuration

### SupabaseConfig

**Location**: `backend/src/config/supabase.config.ts`

Service để khởi tạo và quản lý Supabase client instance.

**Environment Variables**:
- `SUPABASE_URL`: Supabase project URL (default: từ project hiện tại)
- `SUPABASE_ANON_KEY`: Supabase anonymous key (default: từ project hiện tại)

**Usage**:
```typescript
@Injectable()
export class SupabaseConfig {
  private supabase: SupabaseClient;
  
  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  getClient(): SupabaseClient {
    return this.supabase;
  }
}
```

## Entity

Entity định nghĩa cấu trúc TypeScript types cho các bảng trong Supabase database. Hiện tại vẫn giữ TypeORM decorators để type checking, nhưng không dùng TypeORM để query.

### BlogPost Entity

```typescript
@Entity('blog_posts')
export class BlogPost {
  id: string;
  title_vi: string;
  title_en: string;
  // ... các fields khác
}
```

## Repository

Repository class chứa tất cả các methods truy vấn database cho một entity cụ thể.

### BlogRepository

**Location**: `backend/src/repositories/blog.repository.ts`

**Dependencies**: 
- `SupabaseConfig` - Service cung cấp Supabase client instance

**Methods**:

#### `findAll(query: BlogQueryDto): Promise<[BlogPost[], number]>`
Tìm tất cả blog posts đã publish với filters, search, và pagination.

**Parameters**:
- `query`: BlogQueryDto chứa page, limit, tag, search, sort

**Returns**: Tuple `[BlogPost[], number]` - array posts và total count

**Features**:
- Filter by tag slug
- Search trong title và content (cả VI và EN)
- Sort: newest (default), oldest, most_viewed
- Pagination

#### `findOneBySlug(slug: string): Promise<BlogPost | null>`
Tìm một blog post đã publish theo slug.

**Parameters**:
- `slug`: Slug của blog post

**Returns**: BlogPost hoặc null nếu không tìm thấy

#### `findRelatedPosts(excludePostId: string, tagIds: string[], limit: number): Promise<BlogPost[]>`
Tìm các bài viết liên quan dựa trên tags.

**Parameters**:
- `excludePostId`: ID của post cần exclude
- `tagIds`: Array các tag IDs để tìm posts liên quan
- `limit`: Số lượng posts tối đa (default: 3)

**Returns**: Array BlogPost

#### `incrementViewCount(post: BlogPost): Promise<BlogPost>`
Tăng view count của một blog post.

**Parameters**:
- `post`: BlogPost entity

**Returns**: BlogPost đã được update

#### `findAllTags(): Promise<Tag[]>`
Tìm tất cả tags, sắp xếp theo created_at DESC.

**Returns**: Array Tag

#### `findOneById(id: string): Promise<BlogPost | null>`
Tìm blog post theo ID (dùng cho internal operations).

**Parameters**:
- `id`: UUID của blog post

**Returns**: BlogPost hoặc null

#### `create(blogPost: Partial<BlogPost>): Promise<BlogPost>`
Tạo blog post mới.

**Parameters**:
- `blogPost`: Partial BlogPost object

**Returns**: BlogPost đã được tạo

#### `update(id: string, blogPost: Partial<BlogPost>): Promise<BlogPost>`
Update blog post.

**Parameters**:
- `id`: UUID của blog post
- `blogPost`: Partial BlogPost object với các fields cần update

**Returns**: BlogPost đã được update

#### `delete(id: string): Promise<void>`
Xóa blog post.

**Parameters**:
- `id`: UUID của blog post

## Cách sử dụng

### 1. Inject Repository vào Service

```typescript
@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}
}
```

### 2. Sử dụng Repository methods trong Service

```typescript
async findAll(query: BlogQueryDto): Promise<BlogListResponseDto> {
  const [posts, total] = await this.blogRepository.findAll(query);
  
  // Business logic: transform data, calculate pagination, etc.
  const data = posts.map(post => ({ ... }));
  
  return { data, pagination };
}
```

### 3. Register Repository và SupabaseConfig trong Module

```typescript
@Module({
  controllers: [BlogController],
  providers: [BlogService, BlogRepository, SupabaseConfig],
})
export class BlogModule {}
```

**Lưu ý**: Không cần import `TypeOrmModule` nữa vì đang dùng Supabase Client SDK.

## Database Schema

Repository làm việc với các bảng sau trong Supabase:

### blog_posts
- `id` (uuid, PK)
- `title_vi`, `title_en` (varchar)
- `slug` (varchar, unique)
- `content_vi`, `content_en` (text)
- `excerpt_vi`, `excerpt_en` (text, nullable)
- `featured_image` (varchar, nullable)
- `author` (varchar)
- `published_at` (timestamp, nullable)
- `status` (enum: draft, published)
- `view_count` (int, default: 0)
- `created_at`, `updated_at` (timestamp)

### tags
- `id` (uuid, PK)
- `name` (varchar, unique)
- `slug` (varchar, unique)
- `created_at` (timestamp)

### blog_post_tags (junction table)
- `blog_post_id` (uuid, FK -> blog_posts.id)
- `tag_id` (uuid, FK -> tags.id)
- Composite PK: (blog_post_id, tag_id)

## Breaking Changes

**Version 2.0.0**: 
- **Đã thay đổi từ TypeORM sang Supabase Client SDK**: Repository giờ dùng Supabase REST API thay vì TypeORM queries
- **Không cần TypeORM nữa**: Có thể remove `@nestjs/typeorm` và `typeorm` dependencies (nhưng giữ lại entities để type checking)
- **API endpoints không thay đổi**: Tất cả endpoints vẫn hoạt động như cũ
- **DTOs không thay đổi**: Tất cả DTOs vẫn giữ nguyên

## Supabase Queries

Repository sử dụng Supabase PostgREST API với các patterns:

### Basic Query
```typescript
const { data, error } = await this.supabase
  .from('blog_posts')
  .select('*')
  .eq('status', 'published');
```

### Query với Relations
```typescript
const { data } = await this.supabase
  .from('blog_posts')
  .select(`
    *,
    blog_post_tags(
      tags(*)
    )
  `);
```

### Filter by Many-to-Many
Để filter blog posts theo tag, cần query qua junction table:
```typescript
// 1. Get tag ID from slug
const { data: tagData } = await this.supabase
  .from('tags')
  .select('id')
  .eq('slug', tagSlug)
  .single();

// 2. Get blog posts with this tag
const { data } = await this.supabase
  .from('blog_post_tags')
  .select('blog_posts!inner(*)')
  .eq('tag_id', tagData.id);
```

## Dependencies

### Required
- `@supabase/supabase-js`: Supabase JavaScript client library

### Optional (có thể remove)
- `@nestjs/typeorm`: Không cần nữa nếu không dùng TypeORM
- `typeorm`: Không cần nữa nếu không dùng TypeORM

## Future Enhancements

- Tạo base repository interface để các repository khác implement
- Thêm caching layer trong repository
- Thêm transaction support (Supabase supports transactions)
- Thêm soft delete support
- Tạo repository cho các entities khác (nếu có)
- Thêm RLS (Row Level Security) policies trong Supabase
- Thêm real-time subscriptions với Supabase Realtime

