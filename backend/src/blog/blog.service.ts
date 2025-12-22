import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BlogPost, BlogPostStatus } from '../entities';
import { BlogRepository } from '../repositories';
import slugify from 'slugify';
import {
  BlogQueryDto,
  Language,
  BlogListResponseDto,
  BlogPostDetailDto,
  BlogPostListItemDto,
  TagDto,
  PaginationDto,
  CreateBlogDto,
  UpdateBlogDto,
} from './dto';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  async findAll(query: BlogQueryDto): Promise<BlogListResponseDto> {
    const { page = 1, limit = 10, lang = Language.VI } = query;

    const [posts, total] = await this.blogRepository.findAll(query);

    const data: BlogPostListItemDto[] = posts.map((post) => ({
      id: post.id,
      title: lang === Language.VI ? post.title_vi : post.title_en,
      slug: post.slug,
      excerpt: lang === Language.VI ? post.excerpt_vi : post.excerpt_en || null,
      featured_image: post.featured_image,
      tags: post.tags.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
      })),
      published_at: post.published_at,
      view_count: post.view_count,
      author: post.author,
    }));

    const pagination: PaginationDto = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return { data, pagination };
  }

  async findOneBySlug(slug: string, lang: Language = Language.VI): Promise<BlogPostDetailDto> {
    const post = await this.blogRepository.findOneBySlug(slug);

    if (!post) {
      throw new NotFoundException(`Blog post with slug "${slug}" not found`);
    }

    // Increment view count
    await this.blogRepository.incrementViewCount(post);

    // Calculate reading time (average 200 words per minute)
    const content = lang === Language.VI ? post.content_vi : post.content_en;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Find related posts (same tags, limit 3)
    const relatedPosts = await this.blogRepository.findRelatedPosts(
      post.id,
      post.tags.map((t) => t.id),
      3,
    );

    return {
      id: post.id,
      title: lang === Language.VI ? post.title_vi : post.title_en,
      slug: post.slug,
      content: lang === Language.VI ? post.content_vi : post.content_en,
      excerpt: lang === Language.VI ? post.excerpt_vi : post.excerpt_en || null,
      featured_image: post.featured_image,
      tags: post.tags.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
      })),
      published_at: post.published_at,
      view_count: post.view_count,
      author: post.author,
      reading_time: readingTime,
      related_posts: relatedPosts.map((p) => ({
        id: p.id,
        title: lang === Language.VI ? p.title_vi : p.title_en,
        slug: p.slug,
        featured_image: p.featured_image,
      })),
    };
  }

  async findAllTags(): Promise<TagDto[]> {
    const tags = await this.blogRepository.findAllTags();

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    }));
  }

  async create(createBlogDto: CreateBlogDto): Promise<BlogPostDetailDto> {
    // Generate slug if not provided
    let slug = createBlogDto.slug;
    if (!slug) {
      slug = slugify(createBlogDto.title_vi, { lower: true, strict: true });
    }

    // Check if slug already exists
    const existing = await this.blogRepository.findOneBySlug(slug);
    if (existing) {
      throw new BadRequestException(`Blog post with slug "${slug}" already exists`);
    }

    // Prepare blog post data
    const blogPost: Partial<BlogPost> = {
      title_vi: createBlogDto.title_vi,
      title_en: createBlogDto.title_en,
      slug,
      content_vi: createBlogDto.content_vi,
      content_en: createBlogDto.content_en,
      excerpt_vi: createBlogDto.excerpt_vi,
      excerpt_en: createBlogDto.excerpt_en,
      featured_image: createBlogDto.featured_image,
      author: createBlogDto.author,
      published_at: createBlogDto.published_at ? new Date(createBlogDto.published_at) : null,
      status: createBlogDto.status || BlogPostStatus.DRAFT,
      view_count: 0,
    };

    // Create blog post
    const created = await this.blogRepository.create(blogPost);

    // Attach tags if provided
    if (createBlogDto.tag_ids && createBlogDto.tag_ids.length > 0) {
      await this.blogRepository.attachTags(created.id, createBlogDto.tag_ids);
      // Reload to get tags
      const reloaded = await this.blogRepository.findOneById(created.id);
      if (reloaded) {
        return this.mapToDetailDto(reloaded, Language.VI);
    }
    }

    return this.mapToDetailDto(created, Language.VI);
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<BlogPostDetailDto> {
    // Check if blog post exists
    const existing = await this.blogRepository.findOneById(id);
    if (!existing) {
      throw new NotFoundException(`Blog post with id "${id}" not found`);
    }

    // Generate slug if title_vi is being updated and slug is not provided
    let slug = updateBlogDto.slug;
    if (updateBlogDto.title_vi && !slug) {
      slug = slugify(updateBlogDto.title_vi, { lower: true, strict: true });
      // Check if new slug conflicts with another post
      const slugCheck = await this.blogRepository.findOneBySlug(slug);
      if (slugCheck && slugCheck.id !== id) {
        throw new BadRequestException(`Blog post with slug "${slug}" already exists`);
      }
    }

    // Prepare update data
    const updateData: Partial<BlogPost> = {};
    if (updateBlogDto.title_vi !== undefined) updateData.title_vi = updateBlogDto.title_vi;
    if (updateBlogDto.title_en !== undefined) updateData.title_en = updateBlogDto.title_en;
    if (slug !== undefined) updateData.slug = slug;
    if (updateBlogDto.content_vi !== undefined) updateData.content_vi = updateBlogDto.content_vi;
    if (updateBlogDto.content_en !== undefined) updateData.content_en = updateBlogDto.content_en;
    if (updateBlogDto.excerpt_vi !== undefined) updateData.excerpt_vi = updateBlogDto.excerpt_vi;
    if (updateBlogDto.excerpt_en !== undefined) updateData.excerpt_en = updateBlogDto.excerpt_en;
    if (updateBlogDto.featured_image !== undefined)
      updateData.featured_image = updateBlogDto.featured_image;
    if (updateBlogDto.author !== undefined) updateData.author = updateBlogDto.author;
    if (updateBlogDto.published_at !== undefined)
      updateData.published_at = updateBlogDto.published_at ? new Date(updateBlogDto.published_at) : null;
    if (updateBlogDto.status !== undefined) updateData.status = updateBlogDto.status;

    // Update blog post
    const updated = await this.blogRepository.update(id, updateData);

    // Update tags if provided
    if (updateBlogDto.tag_ids !== undefined) {
      await this.blogRepository.attachTags(id, updateBlogDto.tag_ids);
      // Reload to get updated tags
      const reloaded = await this.blogRepository.findOneById(id);
      if (reloaded) {
        return this.mapToDetailDto(reloaded, Language.VI);
      }
    }

    return this.mapToDetailDto(updated, Language.VI);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.blogRepository.findOneById(id);
    if (!existing) {
      throw new NotFoundException(`Blog post with id "${id}" not found`);
    }

    await this.blogRepository.delete(id);
  }

  private mapToDetailDto(post: BlogPost, lang: Language): BlogPostDetailDto {
    const content = lang === Language.VI ? post.content_vi : post.content_en;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return {
      id: post.id,
      title: lang === Language.VI ? post.title_vi : post.title_en,
      slug: post.slug,
      content: lang === Language.VI ? post.content_vi : post.content_en,
      excerpt: lang === Language.VI ? post.excerpt_vi : post.excerpt_en || null,
      featured_image: post.featured_image,
      tags: post.tags.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
      })),
      published_at: post.published_at,
      view_count: post.view_count,
      author: post.author,
      reading_time: readingTime,
      related_posts: [],
    };
  }
}

