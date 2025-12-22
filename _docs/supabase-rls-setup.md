# Supabase RLS (Row Level Security) Setup

**Date**: 2025-01-27  
**Version**: 1.0.0

## Mô tả

Hướng dẫn cấu hình RLS (Row Level Security) cho Supabase và cách backend xử lý với RLS enabled.

## Tình trạng hiện tại

- ✅ RLS đã được enable trên tất cả tables:
  - `blog_posts`
  - `tags`
  - `blog_post_tags`
- ❌ Chưa có policies nào được tạo
- ⚠️ Backend đang dùng ANON_KEY (sẽ bị block bởi RLS)

## Giải pháp

### Option 1: Dùng SERVICE_ROLE_KEY (Recommended cho Backend)

**Ưu điểm**:
- Backend có full access, bypass RLS
- Không cần tạo policies phức tạp
- Phù hợp cho server-side operations

**Cách setup**:

1. **Lấy SERVICE_ROLE_KEY từ Supabase Dashboard**:
   - Vào Supabase Dashboard > Settings > API
   - Copy `service_role` key (secret key, không phải anon key)
   - ⚠️ **QUAN TRỌNG**: Service role key có full access, không bao giờ expose ra client!

2. **Thêm vào `.env`**:
   ```env
   SUPABASE_URL=https://tixmpgpsfflupbyyuvfg.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. **Backend đã được cấu hình** để ưu tiên dùng `SUPABASE_SERVICE_ROLE_KEY`:
   ```typescript
   const supabaseKey =
     process.env.SUPABASE_SERVICE_ROLE_KEY ||  // Ưu tiên service role
     process.env.SUPABASE_ANON_KEY ||           // Fallback
     'default_key';
   ```

### Option 2: Tạo RLS Policies (Nếu muốn dùng ANON_KEY)

Nếu muốn frontend có thể query trực tiếp, cần tạo policies:

#### Policy cho blog_posts (Public Read, Admin Write)

```sql
-- Allow anyone to read published blog posts
CREATE POLICY "Public can read published posts"
ON blog_posts
FOR SELECT
USING (status = 'published');

-- Allow service role to do everything (for backend)
-- This is handled by using SERVICE_ROLE_KEY, no policy needed
```

#### Policy cho tags (Public Read)

```sql
-- Allow anyone to read tags
CREATE POLICY "Public can read tags"
ON tags
FOR SELECT
USING (true);
```

#### Policy cho blog_post_tags (Public Read)

```sql
-- Allow anyone to read blog_post_tags
CREATE POLICY "Public can read blog_post_tags"
ON blog_post_tags
FOR SELECT
USING (true);
```

**Apply policies qua MCP**:
```typescript
// Sử dụng apply_migration để tạo policies
```

## Khuyến nghị

**Cho Backend API**: Dùng **SERVICE_ROLE_KEY**
- Backend là server-side, an toàn
- Không cần policies phức tạp
- Full control

**Cho Frontend** (nếu query trực tiếp): Dùng **ANON_KEY** + **RLS Policies**
- Chỉ cho phép read published posts
- Không cho phép write từ client

## Security Best Practices

1. **SERVICE_ROLE_KEY**:
   - ✅ Chỉ dùng trong backend
   - ✅ Không bao giờ commit vào git
   - ✅ Không expose ra client
   - ✅ Store trong environment variables

2. **ANON_KEY**:
   - ✅ Safe để expose trong frontend
   - ✅ Protected bởi RLS policies
   - ✅ Chỉ cho phép operations được define trong policies

3. **RLS Policies**:
   - ✅ Luôn enable RLS cho production
   - ✅ Tạo policies cụ thể, không dùng `USING (true)` cho write operations
   - ✅ Test policies kỹ trước khi deploy

## Troubleshooting

### Backend không thể query được

**Nguyên nhân**: RLS enabled nhưng không có policies và đang dùng ANON_KEY

**Giải pháp**:
1. Thêm `SUPABASE_SERVICE_ROLE_KEY` vào `.env`
2. Restart backend server
3. Hoặc tạo policies cho ANON_KEY

### Frontend không thể query được

**Nguyên nhân**: RLS enabled nhưng không có policies cho anonymous access

**Giải pháp**:
1. Tạo policies cho public read (xem Option 2)
2. Hoặc frontend query qua backend API thay vì query trực tiếp

## Migration Script

Để tạo policies tự động, có thể tạo migration:

```sql
-- Migration: create_rls_policies

-- Policy for blog_posts: Public can read published posts
CREATE POLICY "Public can read published posts"
ON blog_posts
FOR SELECT
USING (status = 'published');

-- Policy for tags: Public can read all tags
CREATE POLICY "Public can read tags"
ON tags
FOR SELECT
USING (true);

-- Policy for blog_post_tags: Public can read all relations
CREATE POLICY "Public can read blog_post_tags"
ON blog_post_tags
FOR SELECT
USING (true);
```

Apply migration:
```bash
# Sử dụng MCP Supabase tool: apply_migration
```

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Service Role vs Anon Key](https://supabase.com/docs/guides/database/postgres/row-level-security#policies-with-service-role)
- [RLS Best Practices](https://supabase.com/docs/guides/database/postgres/row-level-security#best-practices)

