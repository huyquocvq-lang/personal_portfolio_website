import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { BlogPost, BlogPostStatus, Tag } from '../entities';
import {
  BlogQueryDto,
  Language,
  BlogListResponseDto,
  BlogPostDetailDto,
  BlogPostListItemDto,
  TagDto,
  PaginationDto,
} from './dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async findAll(query: BlogQueryDto): Promise<BlogListResponseDto> {
    const { page = 1, limit = 10, tag, lang = Language.VI, search, sort } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.blogPostRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.tags', 'tags')
      .where('blog.status = :status', { status: BlogPostStatus.PUBLISHED });

    // Filter by tag
    if (tag) {
      queryBuilder.andWhere('tags.slug = :tagSlug', { tagSlug: tag });
    }

    // Search
    if (search) {
      const searchPattern = `%${search}%`;
      queryBuilder.andWhere(
        '(blog.title_vi LIKE :search OR blog.title_en LIKE :search OR blog.content_vi LIKE :search OR blog.content_en LIKE :search)',
        { search: searchPattern },
      );
    }

    // Sort
    switch (sort) {
      case 'oldest':
        queryBuilder.orderBy('blog.published_at', 'ASC');
        break;
      case 'most_viewed':
        queryBuilder.orderBy('blog.view_count', 'DESC');
        break;
      case 'newest':
      default:
        queryBuilder.orderBy('blog.published_at', 'DESC');
        break;
    }

    const [posts, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    const data: BlogPostListItemDto[] = posts.map((post) => ({
      id: post.id,
      title: lang === Language.VI ? post.title_vi : post.title_en,
      slug: post.slug,
      excerpt: lang === Language.VI ? post.excerpt_vi : post.excerpt_en,
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
    const post = await this.blogPostRepository.findOne({
      where: { slug, status: BlogPostStatus.PUBLISHED },
      relations: ['tags'],
    });

    if (!post) {
      throw new NotFoundException(`Blog post with slug "${slug}" not found`);
    }

    // Increment view count
    post.view_count += 1;
    await this.blogPostRepository.save(post);

    // Calculate reading time (average 200 words per minute)
    const content = lang === Language.VI ? post.content_vi : post.content_en;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Find related posts (same tags, limit 3)
    const relatedPosts = await this.findRelatedPosts(post.id, post.tags.map((t) => t.id), 3);

    return {
      id: post.id,
      title: lang === Language.VI ? post.title_vi : post.title_en,
      slug: post.slug,
      content: lang === Language.VI ? post.content_vi : post.content_en,
      excerpt: lang === Language.VI ? post.excerpt_vi : post.excerpt_en,
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
    const tags = await this.tagRepository.find({
      order: { created_at: 'DESC' },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    }));
  }

  private async findRelatedPosts(
    excludePostId: string,
    tagIds: string[],
    limit: number = 3,
  ): Promise<BlogPost[]> {
    if (tagIds.length === 0) {
      return [];
    }

    const posts = await this.blogPostRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.tags', 'tags')
      .where('blog.id != :excludeId', { excludeId: excludePostId })
      .andWhere('blog.status = :status', { status: BlogPostStatus.PUBLISHED })
      .andWhere('tags.id IN (:...tagIds)', { tagIds })
      .orderBy('blog.published_at', 'DESC')
      .limit(limit)
      .getMany();

    return posts;
  }
}

