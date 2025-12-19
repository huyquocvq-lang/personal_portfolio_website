# Đồng bộ Entity với Supabase Schema

**Date**: 2025-01-27  
**Version**: 1.0.0

## Mô tả

Hướng dẫn cách đồng bộ TypeScript entities với schema trong Supabase database để đảm bảo consistency giữa code và database.

## Các phương pháp đồng bộ

### 1. Sử dụng Supabase Generated Types

Supabase có thể generate TypeScript types từ database schema. Types đã được generate và lưu tại `backend/src/types/supabase.ts`.

**Cách sử dụng**:

```typescript
import { Database } from './types/supabase';

type BlogPostRow = Database['public']['Tables']['blog_posts']['Row'];
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];
```

**Regenerate types**:
- Sử dụng MCP Supabase tool: `generate_typescript_types`
- Hoặc Supabase CLI: `supabase gen types typescript --project-id <project-id> > src/types/supabase.ts`

### 2. So sánh thủ công với Supabase Dashboard

**Bước 1**: Xem schema trong Supabase Dashboard
- Vào Supabase Dashboard > Database > Tables
- Xem columns, data types, constraints của từng table

**Bước 2**: So sánh với entities
- Mở `backend/src/entities/blog-post.entity.ts`
- So sánh từng column:
  - Tên column có khớp không?
  - Data type có đúng không? (varchar, text, timestamp, etc.)
  - Nullable có đúng không?
  - Default value có đúng không?
  - Unique constraints có đúng không?

**Bước 3**: Cập nhật entity nếu cần
```typescript
@Column({ nullable: true })  // Nếu column nullable trong Supabase
excerpt_vi: string | null;

@Column({ unique: true })     // Nếu column unique trong Supabase
slug: string;
```

### 3. Sử dụng Validation Scripts

Đã tạo 2 scripts để validate và sync:

#### `validate:schema` - Validate entities với expected schema

```bash
npm run validate:schema
```

Script này sẽ:
- Check xem tất cả columns có trong entity không
- Check nullable fields
- Báo cáo issues và warnings

#### `sync:entities` - Sync entities với Supabase

```bash
npm run sync:entities
```

Script này sẽ:
- Fetch schema từ Supabase
- So sánh với entities hiện tại
- Báo cáo các khác biệt

### 4. Sử dụng MCP Supabase Tools

Có thể sử dụng MCP Supabase tools để:

**Xem schema hiện tại**:
```
list_tables - Xem tất cả tables và columns
```

**Generate types**:
```
generate_typescript_types - Generate TypeScript types từ schema
```

**Apply migrations**:
```
apply_migration - Apply migration để sync schema
```

## Schema Mapping

### Blog Posts Table

| Supabase Column | Entity Property | Type | Nullable | Notes |
|----------------|----------------|------|----------|-------|
| id | id | uuid | No | Primary key |
| title_vi | title_vi | varchar | No | |
| title_en | title_en | varchar | No | |
| slug | slug | varchar | No | Unique |
| content_vi | content_vi | text | No | |
| content_en | content_en | text | No | |
| excerpt_vi | excerpt_vi | text | Yes | |
| excerpt_en | excerpt_en | text | Yes | |
| featured_image | featured_image | varchar | Yes | |
| author | author | varchar | No | |
| published_at | published_at | timestamp | Yes | |
| status | status | enum | No | Default: 'draft' |
| view_count | view_count | integer | No | Default: 0 |
| created_at | created_at | timestamp | No | Auto |
| updated_at | updated_at | timestamp | No | Auto |

### Tags Table

| Supabase Column | Entity Property | Type | Nullable | Notes |
|----------------|----------------|------|----------|-------|
| id | id | uuid | No | Primary key |
| name | name | varchar | No | Unique |
| slug | slug | varchar | No | Unique |
| created_at | created_at | timestamp | No | Auto |

## Best Practices

### 1. Luôn validate sau khi thay đổi schema

Sau khi thay đổi schema trong Supabase:
1. Chạy `npm run validate:schema`
2. Cập nhật entity nếu cần
3. Regenerate types: `generate_typescript_types`
4. Test lại code

### 2. Sử dụng migrations

Thay vì thay đổi schema trực tiếp trong Supabase Dashboard, nên:
1. Tạo migration script
2. Apply migration qua MCP: `apply_migration`
3. Update entities và types sau đó

### 3. Type Safety

Luôn sử dụng generated types từ Supabase:
```typescript
import { Database } from './types/supabase';

// Type-safe queries
const blogPost: Database['public']['Tables']['blog_posts']['Row'] = {
  // TypeScript sẽ check types
};
```

### 4. Nullable Fields

Đảm bảo nullable fields trong entity match với Supabase:
```typescript
// Supabase: nullable = true
@Column({ nullable: true })
excerpt_vi: string | null;  // Type phải có | null

// Supabase: nullable = false
@Column()
title_vi: string;  // Type không có | null
```

## Troubleshooting

### Entity không match với Supabase

1. Check Supabase Dashboard > Database > Tables
2. So sánh từng column
3. Update entity
4. Regenerate types

### Type errors khi query

1. Regenerate types: `generate_typescript_types`
2. Check xem có dùng đúng types không
3. Ensure nullable fields match

### Migration conflicts

1. Check migrations đã apply: `list_migrations`
2. Resolve conflicts manually
3. Update entities sau khi migration apply

## Scripts

- `npm run validate:schema` - Validate entities với schema
- `npm run sync:entities` - Sync entities với Supabase (info only)

## Future Enhancements

- Auto-generate entities từ Supabase schema
- Auto-update entities khi schema thay đổi
- CI/CD check để ensure schema sync
- Visual diff tool để compare schema

