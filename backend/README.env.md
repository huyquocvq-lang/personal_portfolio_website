# Environment Variables Setup

## Quick Start

1. **Copy `.env.example` to `.env`**:
   ```bash
   cp .env.example .env
   ```

2. **Fill in your Supabase keys**:
   - Mở `.env` file
   - Thay `your_service_role_key_here` bằng SERVICE_ROLE_KEY từ Supabase Dashboard
   - SUPABASE_ANON_KEY đã có sẵn (có thể giữ nguyên hoặc update)

3. **Lấy SERVICE_ROLE_KEY**:
   - Vào Supabase Dashboard > Settings > API
   - Copy `service_role` key (secret key)
   - ⚠️ **KHÔNG BAO GIỜ** commit SERVICE_ROLE_KEY vào git!

## Environment Variables

### Required

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (recommended) hoặc `SUPABASE_ANON_KEY`

### Optional

- `NODE_ENV` - Environment (development/production), default: development
- `PORT` - Server port, default: 3000
- `CORS_ORIGIN` - CORS origin (default: allow all)
- `SWAGGER_ENABLED` - Enable Swagger UI (default: true)

## Example `.env` file

```env
# Supabase Configuration
SUPABASE_URL=https://tixmpgpsfflupbyyuvfg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application Configuration
NODE_ENV=development
PORT=3000
```

## Security Notes

- ✅ `.env` đã được thêm vào `.gitignore`
- ✅ Không commit `.env` file vào git
- ✅ Dùng `.env.example` làm template
- ⚠️ SERVICE_ROLE_KEY có full access, chỉ dùng trong backend

