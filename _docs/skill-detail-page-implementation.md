# Skill Detail Page Implementation

**Date**: 2025-01-27  
**Version**: 1.0.0

## Mô tả tính năng

Tính năng cho phép người dùng click vào skill card trên homepage để xem chi tiết về skill đó và các projects liên quan. Trang detail có route `/skill/:slug` và hiển thị thông tin đầy đủ về skill cùng với danh sách projects sử dụng skill đó.

## Backend Implementation

### API Endpoints

#### GET `/api/skills/slug/:slug`

Lấy chi tiết skill theo slug (từ title).

**Path Parameters**:
- `slug` (string) - Slug của skill, được generate từ title

**Query Parameters**:
- `lang` ('vi' | 'en', optional, default: 'vi') - Ngôn ngữ

**Response**: `SkillDetailDto`
```json
{
  "id": "uuid",
  "title": "Strategy & Direction",
  "description": "Lorem ipsum dolor sit amet...",
  "icon_url": "https://example.com/icon.png",
  "highlighted": true,
  "display_order": 0,
  "created_at": "2025-01-27T00:00:00Z",
  "updated_at": "2025-01-27T00:00:00Z",
  "related_projects": [
    {
      "id": "uuid",
      "title": "Project Name",
      "description": "Project description...",
      "image_url": "https://example.com/image.png",
      "link_url": "https://example.com"
    }
  ]
}
```

**Note**: 
- Slug được generate từ title bằng cách: lowercase, remove diacritics, replace spaces với dashes
- Related projects hiện tại return empty array (sẽ implement khi có project API)

### Repository Methods

#### `findBySlug(slug: string, lang: 'vi' | 'en'): Promise<Skill | null>`

Tìm skill theo slug. Vì không có slug column trong database, method này:
1. Fetch tất cả skills
2. Generate slug từ title của mỗi skill
3. So sánh với slug được truyền vào
4. Return skill match đầu tiên

**Note**: Trong production, nên thêm slug column vào database để optimize performance.

### DTOs

#### `SkillDetailDto`
Extends `SkillDto` với thêm field:
- `related_projects: RelatedProjectDto[]`

#### `RelatedProjectDto`
```typescript
{
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link_url: string | null;
}
```

## Frontend Implementation

### Routes

- `/skill/:slug` - Skill detail page

### Components

#### SkillDetailPage (`frontend/src/pages/SkillDetailPage.tsx`)

Component hiển thị chi tiết skill:
- Skill icon (nếu có)
- Skill title
- Skill description
- Language switcher (VI/EN)
- Related projects section (nếu có)
- Back to home link

**Features**:
- Loading state
- Error handling
- Language switching
- Responsive design

#### ServiceCard Update (`frontend/src/components/ServiceCard/ServiceCard.tsx`)

Updated để support navigation:
- Thêm prop `slug?: string`
- Thêm prop `onClick?: () => void`
- Auto-generate slug từ title nếu không có slug prop
- Wrap trong `Link` component nếu có slug
- Hover effects khi có link

### API Service

#### `skillApi.getSkillBySlug(slug: string, lang: 'vi' | 'en'): Promise<SkillDetail>`

Fetch skill detail từ API.

### LandingPage Update

Updated để:
- Fetch skills từ API thay vì hardcode
- Generate slug cho mỗi skill
- Pass slug vào ServiceCard
- Show loading state khi fetch skills
- Handle error case

## Slug Generation

Slug được generate từ title với logic:
1. Convert to lowercase
2. Normalize và remove diacritics (á → a, é → e, etc.)
3. Replace non-alphanumeric characters với dashes
4. Remove leading/trailing dashes

**Example**:
- "Strategy & Direction" → "strategy-direction"
- "UI & UX Design" → "ui-ux-design"
- "Webflow Development" → "webflow-development"

## UI/UX Design

### Skill Detail Page Layout

```
┌─────────────────────────────────────┐
│ ← Back to Home                      │
├─────────────────────────────────────┤
│ [Icon] [Featured]    [VI] [EN]     │
│                                     │
│ Skill Title                         │
│                                     │
│ Skill Description                   │
│ (multi-line, formatted)             │
│                                     │
│ ─────────────────────────────────── │
│ Related Projects                    │
│ ┌─────┐ ┌─────┐ ┌─────┐            │
│ │     │ │     │ │     │            │
│ └─────┘ └─────┘ └─────┘            │
└─────────────────────────────────────┘
```

### ServiceCard Hover Effects

- Scale: `hover:scale-[1.02]`
- Shadow: `hover:shadow-lg`
- Cursor: `cursor-pointer`
- Transition: `transition-all duration-200`

## Future Improvements

1. **Add slug column to database**: Thay vì generate slug mỗi lần query, nên lưu slug vào database
2. **Implement project API**: Khi có project API, implement logic để fetch related projects
3. **Add skill filtering**: Filter projects by skill trong project API
4. **Add breadcrumbs**: Navigation breadcrumbs trên detail page
5. **Add related skills**: Suggest other skills liên quan
6. **Add skill statistics**: Số lượng projects sử dụng skill, etc.

## Breaking Changes

Không có breaking changes. Tính năng này là additive.

## Testing

### Manual Testing Checklist

- [ ] Click vào skill card trên homepage → navigate đến detail page
- [ ] Skill detail page hiển thị đúng thông tin
- [ ] Language switcher hoạt động (VI/EN)
- [ ] Back to home link hoạt động
- [ ] Related projects section hiển thị (nếu có)
- [ ] Loading state hiển thị khi fetch data
- [ ] Error state hiển thị khi fetch fail
- [ ] Responsive design trên mobile/tablet/desktop
- [ ] Slug generation đúng với các ký tự đặc biệt
- [ ] Hover effects trên skill cards

## Dependencies

- `react-router-dom` - Routing
- `@nestjs/swagger` - API documentation
- `slugify` (backend) - Slug generation (future use)

