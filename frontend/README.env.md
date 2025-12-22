# Frontend Environment Variables Setup

## Quick Start

1. **Copy `.env.example` to `.env`**:
   ```bash
   cp .env.example .env
   ```

2. **Update API URL if needed**:
   - Mở `.env` file
   - Update `VITE_API_URL` nếu backend chạy ở port khác

## Environment Variables

### Required

- `VITE_API_URL` - Backend API base URL (default: http://localhost:3000/api)

### Optional

- `VITE_SUPABASE_URL` - Supabase project URL (nếu cần direct client access)
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (nếu cần direct client access)
- `VITE_APP_NAME` - App name
- `VITE_APP_VERSION` - App version

## Vite Environment Variables

Vite chỉ expose các variables có prefix `VITE_` ra client code.

**Usage trong code**:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

**Available trong build**:
- `import.meta.env.VITE_API_URL` - API URL
- `import.meta.env.MODE` - Mode (development/production)
- `import.meta.env.PROD` - Boolean, true if production
- `import.meta.env.DEV` - Boolean, true if development

## Example `.env` file

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Supabase Configuration (optional)
VITE_SUPABASE_URL=https://tixmpgpsfflupbyyuvfg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
VITE_APP_NAME=Personal Portfolio
VITE_APP_VERSION=1.0.0
```

## Development vs Production

### Development
- `.env` file được load tự động
- Variables có thể thay đổi mà không cần rebuild

### Production
- Variables được embed vào build tại build time
- Cần rebuild để thay đổi env vars
- Set env vars trong deployment platform (Railway, Vercel, etc.)

## Security Notes

- ✅ `.env` đã được thêm vào `.gitignore`
- ✅ Chỉ expose variables với prefix `VITE_`
- ⚠️ Không đặt sensitive data (như SERVICE_ROLE_KEY) trong frontend env vars
- ✅ ANON_KEY safe để expose trong frontend (protected bởi RLS)

## Railway Deployment

Khi deploy lên Railway, set environment variables trong Railway dashboard:
- `VITE_API_URL` - Backend API URL (e.g., https://your-backend.railway.app/api)

