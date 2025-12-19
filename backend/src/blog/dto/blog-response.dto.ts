import { Tag } from '../../entities/tag.entity';

export class TagDto {
  id: string;
  name: string;
  slug: string;
}

export class BlogPostListItemDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  tags: TagDto[];
  published_at: Date | null;
  view_count: number;
  author: string;
}

export class BlogPostDetailDto {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  tags: TagDto[];
  published_at: Date | null;
  view_count: number;
  author: string;
  reading_time: number;
  related_posts: {
    id: string;
    title: string;
    slug: string;
    featured_image: string | null;
  }[];
}

export class PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class BlogListResponseDto {
  data: BlogPostListItemDto[];
  pagination: PaginationDto;
}

