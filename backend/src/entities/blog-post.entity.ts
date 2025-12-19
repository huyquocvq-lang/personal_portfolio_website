import { Tag } from './tag.entity';

export enum BlogPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

/**
 * BlogPost entity - matches Supabase blog_posts table
 */
export class BlogPost {
  id: string;
  title_vi: string;
  title_en: string;
  slug: string;
  content_vi: string;
  content_en: string;
  excerpt_vi: string | null;
  excerpt_en: string | null;
  featured_image: string | null;
  author: string;
  published_at: Date | null;
  status: BlogPostStatus;
  view_count: number;
  tags: Tag[];
  created_at: Date;
  updated_at: Date;
}
