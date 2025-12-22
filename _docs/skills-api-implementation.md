# Skills API Implementation

**Date**: 2025-01-27  
**Version**: 1.0.0

## Mô tả tính năng

Triển khai đầy đủ CRUD API cho Skills (My Skills / My Expertise) với Swagger/OpenAPI documentation. API hỗ trợ quản lý các skills hiển thị trên homepage.

## Database Schema

### Table: `skills`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | uuid | No | Primary key |
| title_vi | varchar | No | Tiêu đề tiếng Việt |
| title_en | varchar | No | Tiêu đề tiếng Anh |
| description_vi | text | No | Mô tả tiếng Việt |
| description_en | text | No | Mô tả tiếng Anh |
| icon_url | varchar | Yes | URL icon image |
| highlighted | boolean | No | Có highlight không (default: false) |
| display_order | integer | No | Thứ tự hiển thị (default: 0) |
| created_at | timestamp | No | Ngày tạo |
| updated_at | timestamp | No | Ngày cập nhật |

**Indexes**:
- `idx_skills_display_order` - Index trên display_order để sort nhanh

**Triggers**:
- `update_skills_updated_at` - Auto update updated_at khi update

## API Endpoints

### Base URL: `/api/skills`

#### 1. GET `/api/skills` - Lấy danh sách tất cả skills

**Query Parameters**:
- `lang` ('vi' | 'en', optional, default: 'vi') - Ngôn ngữ

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Strategy & Direction",
      "description": "Lorem ipsum dolor sit amet...",
      "icon_url": "https://example.com/icon.png",
      "highlighted": true,
      "display_order": 0,
      "created_at": "2025-01-27T00:00:00Z",
      "updated_at": "2025-01-27T00:00:00Z"
    }
  ]
}
```

**Note**: Skills được sắp xếp theo `display_order` ascending.

#### 2. GET `/api/skills/:id` - Lấy chi tiết skill

**Path Parameters**:
- `id` (string) - UUID của skill

**Query Parameters**:
- `lang` ('vi' | 'en', optional, default: 'vi') - Ngôn ngữ

**Response**: `SkillDto`

#### 3. POST `/api/skills` - Tạo skill mới

**Request Body** (`CreateSkillDto`):
```json
{
  "title_vi": "Strategy & Direction",
  "title_en": "Strategy & Direction",
  "description_vi": "Lorem ipsum dolor sit amet...",
  "description_en": "Lorem ipsum dolor sit amet...",
  "icon_url": "https://example.com/icon.png",
  "highlighted": false,
  "display_order": 0
}
```

**Response**: `SkillDto` (201 Created)

**Validation**:
- `title_vi`, `title_en`, `description_vi`, `description_en` - Required
- `icon_url` - Optional
- `highlighted` - Optional, default: false
- `display_order` - Optional, default: 0, min: 0

#### 4. PUT `/api/skills/:id` - Cập nhật skill

**Path Parameters**:
- `id` (string) - UUID của skill

**Request Body** (`UpdateSkillDto`):
Tất cả fields đều optional, chỉ cần gửi fields muốn update:
```json
{
  "title_vi": "New Title",
  "highlighted": true,
  "display_order": 1
}
```

**Response**: `SkillDto` (200 OK)

#### 5. DELETE `/api/skills/:id` - Xóa skill

**Path Parameters**:
- `id` (string) - UUID của skill

**Response**:
```json
{
  "message": "Skill đã được xóa thành công"
}
```

## DTOs

### CreateSkillDto

```typescript
{
  title_vi: string;          // Required
  title_en: string;          // Required
  description_vi: string;    // Required
  description_en: string;    // Required
  icon_url?: string;         // Optional
  highlighted?: boolean;     // Optional, default: false
  display_order?: number;   // Optional, default: 0
}
```

### UpdateSkillDto

Extends `PartialType(CreateSkillDto)` - tất cả fields đều optional.

### SkillDto

```typescript
{
  id: string;
  title: string;             // title_vi hoặc title_en tùy lang
  description: string;        // description_vi hoặc description_en tùy lang
  icon_url: string | null;
  highlighted: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}
```

## Cấu trúc Code

```
backend/src/
├── entities/
│   └── skill.entity.ts          # Skill entity
├── repositories/
│   └── skill.repository.ts      # SkillRepository với Supabase
├── skills/
│   ├── dto/
│   │   ├── create-skill.dto.ts
│   │   ├── update-skill.dto.ts
│   │   ├── skill-response.dto.ts
│   │   └── index.ts
│   ├── skills.controller.ts     # SkillsController với Swagger
│   ├── skills.service.ts        # SkillsService
│   └── skills.module.ts         # SkillsModule
└── app.module.ts                # Đã register SkillsModule
```

## Swagger Documentation

Tất cả endpoints đã được decorate với:
- `@ApiTags('skills')` - Nhóm endpoints
- `@ApiOperation()` - Mô tả operation
- `@ApiResponse()` - Mô tả responses
- `@ApiParam()` - Mô tả path parameters
- `@ApiQuery()` - Mô tả query parameters
- `@ApiBody()` - Mô tả request body

**Swagger UI**: `http://localhost:3000/api/docs` > Skills section

## Business Logic

### Display Order

- Skills được sắp xếp theo `display_order` ascending
- Có thể set `display_order` để control thứ tự hiển thị
- Default: 0

### Highlighted

- `highlighted: true` - Skill sẽ có border highlight trong UI
- Có thể có nhiều skills highlighted

### Multi-language Support

- Hỗ trợ tiếng Việt và tiếng Anh
- Query param `lang` để chọn ngôn ngữ
- Response sẽ trả về title và description theo ngôn ngữ được chọn

## Usage Example

### Create a skill

```bash
curl -X POST http://localhost:3000/api/skills \
  -H "Content-Type: application/json" \
  -d '{
    "title_vi": "Strategy & Direction",
    "title_en": "Strategy & Direction",
    "description_vi": "Lorem ipsum dolor sit amet...",
    "description_en": "Lorem ipsum dolor sit amet...",
    "icon_url": "https://example.com/icon.png",
    "highlighted": true,
    "display_order": 0
  }'
```

### Get all skills

```bash
curl http://localhost:3000/api/skills?lang=vi
```

### Update skill

```bash
curl -X PUT http://localhost:3000/api/skills/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "highlighted": false,
    "display_order": 1
  }'
```

## Migration

Migration đã được apply với tên `create_skills_table`, bao gồm:
- Tạo bảng `skills`
- Tạo index trên `display_order`
- Tạo trigger để auto-update `updated_at`
- Enable RLS

## Future Enhancements

- Thêm category cho skills
- Thêm skill level/proficiency
- Thêm skill tags
- Bulk update display_order
- Skill reordering API

