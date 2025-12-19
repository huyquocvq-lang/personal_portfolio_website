import { BlogPost } from './blog-post.entity';

/**
 * Tag entity - matches Supabase tags table
 */
export class Tag {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
  blogPosts: BlogPost[];
}
