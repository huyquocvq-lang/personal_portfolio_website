import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../config/supabase.config';
import { BlogPost, BlogPostStatus, Tag } from '../entities';
import { BlogQueryDto } from '../blog/dto';

interface BlogPostRow {
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
  published_at: string | null;
  status: BlogPostStatus;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface TagRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

interface BlogPostTagRow {
  blog_post_id: string;
  tag_id: string;
}

@Injectable()
export class BlogRepository {
  private supabase: SupabaseClient;

  constructor(private supabaseConfig: SupabaseConfig) {
    this.supabase = supabaseConfig.getClient();
  }

  /**
   * Find all published blog posts with filters, search, and pagination
   */
  async findAll(query: BlogQueryDto): Promise<[BlogPost[], number]> {
    const { page = 1, limit = 10, tag, search, sort } = query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // If filtering by tag, we need to query differently
    if (tag) {
      // First, get tag ID from slug
      const { data: tagData, error: tagError } = await this.supabase
        .from('tags')
        .select('id')
        .eq('slug', tag)
        .single();

      if (tagError || !tagData) {
        return [[], 0];
      }

      // Then get blog posts with this tag
      let queryBuilder = this.supabase
        .from('blog_post_tags')
        .select(
          `
          blog_posts!inner(
            *,
            blog_post_tags(
              tags(*)
            )
          )
        `,
          { count: 'exact' },
        )
        .eq('tag_id', tagData.id)
        .eq('blog_posts.status', BlogPostStatus.PUBLISHED);

      // Search
      if (search) {
        queryBuilder = queryBuilder.or(
          `blog_posts.title_vi.ilike.%${search}%,blog_posts.title_en.ilike.%${search}%,blog_posts.content_vi.ilike.%${search}%,blog_posts.content_en.ilike.%${search}%`,
        );
      }

      // Sort
      switch (sort) {
        case 'oldest':
          queryBuilder = queryBuilder.order('blog_posts.published_at', { ascending: true });
          break;
        case 'most_viewed':
          queryBuilder = queryBuilder.order('blog_posts.view_count', { ascending: false });
          break;
        case 'newest':
        default:
          queryBuilder = queryBuilder.order('blog_posts.published_at', { ascending: false });
          break;
      }

      const { data, error, count } = await queryBuilder.range(from, to);

      if (error) {
        throw new Error(`Failed to fetch blog posts: ${error.message}`);
      }

      const posts = (data || []).map((item: any) => item.blog_posts).filter(Boolean);
      const mappedPosts = this.mapBlogPostsWithTags(posts);
      return [mappedPosts, count || 0];
    }

    // Normal query without tag filter
    let queryBuilder = this.supabase
      .from('blog_posts')
      .select(
        `
        *,
        blog_post_tags(
          tags(*)
        )
      `,
        { count: 'exact' },
      )
      .eq('status', BlogPostStatus.PUBLISHED);

    // Search
    if (search) {
      queryBuilder = queryBuilder.or(
        `title_vi.ilike.%${search}%,title_en.ilike.%${search}%,content_vi.ilike.%${search}%,content_en.ilike.%${search}%`,
      );
    }

    // Sort
    switch (sort) {
      case 'oldest':
        queryBuilder = queryBuilder.order('published_at', { ascending: true });
        break;
      case 'most_viewed':
        queryBuilder = queryBuilder.order('view_count', { ascending: false });
        break;
      case 'newest':
      default:
        queryBuilder = queryBuilder.order('published_at', { ascending: false });
        break;
    }

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      throw new Error(`Failed to fetch blog posts: ${error.message}`);
    }

    const posts = this.mapBlogPostsWithTags(data || []);
    return [posts, count || 0];
  }

  /**
   * Find a published blog post by slug
   */
  async findOneBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select(
        `
        *,
        blog_post_tags(
          tags(*)
        )
      `,
      )
      .eq('slug', slug)
      .eq('status', BlogPostStatus.PUBLISHED)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new Error(`Failed to fetch blog post: ${error.message}`);
    }

    return this.mapBlogPostWithTags(data);
  }

  /**
   * Find related posts by tag IDs
   */
  async findRelatedPosts(
    excludePostId: string,
    tagIds: string[],
    limit: number = 3,
  ): Promise<BlogPost[]> {
    if (tagIds.length === 0) {
      return [];
    }

    // Get blog post IDs that have any of these tags
    const { data: blogPostTags, error: bptError } = await this.supabase
      .from('blog_post_tags')
      .select('blog_post_id')
      .in('tag_id', tagIds)
      .neq('blog_post_id', excludePostId);

    if (bptError) {
      throw new Error(`Failed to fetch related posts: ${bptError.message}`);
    }

    const relatedPostIds = [...new Set((blogPostTags || []).map((bpt: any) => bpt.blog_post_id))];

    if (relatedPostIds.length === 0) {
      return [];
    }

    // Get the actual blog posts
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select(
        `
        *,
        blog_post_tags(
          tags(*)
        )
      `,
      )
      .in('id', relatedPostIds)
      .eq('status', BlogPostStatus.PUBLISHED)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch related posts: ${error.message}`);
    }

    return this.mapBlogPostsWithTags(data || []);
  }

  /**
   * Increment view count for a blog post
   */
  async incrementViewCount(post: BlogPost): Promise<BlogPost> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .update({ view_count: post.view_count + 1 })
      .eq('id', post.id)
      .select(
        `
        *,
        blog_post_tags(
          tags(*)
        )
      `,
      )
      .single();

    if (error) {
      throw new Error(`Failed to increment view count: ${error.message}`);
    }

    return this.mapBlogPostWithTags(data);
  }

  /**
   * Find all tags
   */
  async findAllTags(): Promise<Tag[]> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch tags: ${error.message}`);
    }

    return (data || []).map((tag: TagRow) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      created_at: new Date(tag.created_at),
      blogPosts: [],
    }));
  }

  /**
   * Find blog post by ID (for internal use)
   */
  async findOneById(id: string): Promise<BlogPost | null> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select(
        `
        *,
        blog_post_tags(
          tags(*)
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch blog post: ${error.message}`);
    }

    return this.mapBlogPostWithTags(data);
  }

  /**
   * Create a new blog post
   */
  async create(blogPost: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .insert({
        title_vi: blogPost.title_vi,
        title_en: blogPost.title_en,
        slug: blogPost.slug,
        content_vi: blogPost.content_vi,
        content_en: blogPost.content_en,
        excerpt_vi: blogPost.excerpt_vi,
        excerpt_en: blogPost.excerpt_en,
        featured_image: blogPost.featured_image,
        author: blogPost.author,
        published_at: blogPost.published_at?.toISOString(),
        status: blogPost.status || BlogPostStatus.DRAFT,
        view_count: blogPost.view_count || 0,
      })
      .select(
        `
        *,
        blog_post_tags(
          tags(*)
        )
      `,
      )
      .single();

    if (error) {
      throw new Error(`Failed to create blog post: ${error.message}`);
    }

    // Handle tags if provided
    if (blogPost.tags && blogPost.tags.length > 0) {
      await this.attachTags(data.id, blogPost.tags.map((t) => t.id));
    }

    return this.mapBlogPostWithTags(data);
  }

  /**
   * Update a blog post
   */
  async update(id: string, blogPost: Partial<BlogPost>): Promise<BlogPost> {
    const updateData: any = {};
    if (blogPost.title_vi !== undefined) updateData.title_vi = blogPost.title_vi;
    if (blogPost.title_en !== undefined) updateData.title_en = blogPost.title_en;
    if (blogPost.slug !== undefined) updateData.slug = blogPost.slug;
    if (blogPost.content_vi !== undefined) updateData.content_vi = blogPost.content_vi;
    if (blogPost.content_en !== undefined) updateData.content_en = blogPost.content_en;
    if (blogPost.excerpt_vi !== undefined) updateData.excerpt_vi = blogPost.excerpt_vi;
    if (blogPost.excerpt_en !== undefined) updateData.excerpt_en = blogPost.excerpt_en;
    if (blogPost.featured_image !== undefined) updateData.featured_image = blogPost.featured_image;
    if (blogPost.author !== undefined) updateData.author = blogPost.author;
    if (blogPost.published_at !== undefined)
      updateData.published_at = blogPost.published_at?.toISOString();
    if (blogPost.status !== undefined) updateData.status = blogPost.status;
    if (blogPost.view_count !== undefined) updateData.view_count = blogPost.view_count;

    const { data, error } = await this.supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        blog_post_tags(
          tags(*)
        )
      `,
      )
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Blog post with id "${id}" not found`);
      }
      throw new Error(`Failed to update blog post: ${error.message}`);
    }

    return this.mapBlogPostWithTags(data);
  }

  /**
   * Delete a blog post
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete blog post: ${error.message}`);
    }
  }

  /**
   * Attach tags to a blog post
   */
  async attachTags(blogPostId: string, tagIds: string[]): Promise<void> {
    // First, remove existing tags
    await this.removeAllTags(blogPostId);

    if (tagIds.length === 0) {
      return;
    }

    const relations = tagIds.map((tagId) => ({
      blog_post_id: blogPostId,
      tag_id: tagId,
    }));

    const { error } = await this.supabase.from('blog_post_tags').insert(relations);

    if (error) {
      throw new Error(`Failed to attach tags: ${error.message}`);
    }
  }

  /**
   * Remove all tags from a blog post
   */
  async removeAllTags(blogPostId: string): Promise<void> {
    const { error } = await this.supabase
      .from('blog_post_tags')
      .delete()
      .eq('blog_post_id', blogPostId);

    if (error) {
      throw new Error(`Failed to remove tags: ${error.message}`);
    }
  }

  /**
   * Map database row to BlogPost entity with tags
   */
  private mapBlogPostWithTags(row: any): BlogPost {
    const tags: Tag[] = [];
    if (row.blog_post_tags && Array.isArray(row.blog_post_tags)) {
      tags.push(
        ...row.blog_post_tags.map((bpt: any) => ({
          id: bpt.tags.id,
          name: bpt.tags.name,
          slug: bpt.tags.slug,
          created_at: new Date(bpt.tags.created_at),
          blogPosts: [],
        })),
      );
    }

    return {
      id: row.id,
      title_vi: row.title_vi,
      title_en: row.title_en,
      slug: row.slug,
      content_vi: row.content_vi,
      content_en: row.content_en,
      excerpt_vi: row.excerpt_vi,
      excerpt_en: row.excerpt_en,
      featured_image: row.featured_image,
      author: row.author,
      published_at: row.published_at ? new Date(row.published_at) : null,
      status: row.status as BlogPostStatus,
      view_count: row.view_count,
      tags,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  /**
   * Map array of database rows to BlogPost entities with tags
   */
  private mapBlogPostsWithTags(rows: any[]): BlogPost[] {
    return rows.map((row) => this.mapBlogPostWithTags(row));
  }
}
