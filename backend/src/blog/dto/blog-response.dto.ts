import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Tag } from '../../entities/tag.entity';

export class TagDto {
  @ApiProperty({ description: 'Tag ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Tag name', example: 'NestJS' })
  name: string;

  @ApiProperty({ description: 'Tag slug', example: 'nestjs' })
  slug: string;
}

export class BlogPostListItemDto {
  @ApiProperty({ description: 'Blog post ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Tiêu đề', example: 'Giới thiệu về NestJS' })
  title: string;

  @ApiProperty({ description: 'Slug', example: 'gioi-thieu-ve-nestjs' })
  slug: string;

  @ApiPropertyOptional({ description: 'Tóm tắt', example: 'Bài viết giới thiệu về NestJS...' })
  excerpt: string | null;

  @ApiPropertyOptional({ description: 'Hình ảnh đại diện', example: 'https://example.com/image.jpg' })
  featured_image: string | null;

  @ApiProperty({ description: 'Tags', type: [TagDto] })
  tags: TagDto[];

  @ApiPropertyOptional({ description: 'Ngày publish', example: '2025-01-27T00:00:00Z' })
  published_at: Date | null;

  @ApiProperty({ description: 'Số lượt xem', example: 100 })
  view_count: number;

  @ApiProperty({ description: 'Tác giả', example: 'John Doe' })
  author: string;
}

export class RelatedPostDto {
  @ApiProperty({ description: 'Blog post ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Tiêu đề', example: 'Giới thiệu về NestJS' })
  title: string;

  @ApiProperty({ description: 'Slug', example: 'gioi-thieu-ve-nestjs' })
  slug: string;

  @ApiPropertyOptional({ description: 'Hình ảnh đại diện', example: 'https://example.com/image.jpg' })
  featured_image: string | null;
}

export class BlogPostDetailDto {
  @ApiProperty({ description: 'Blog post ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Tiêu đề', example: 'Giới thiệu về NestJS' })
  title: string;

  @ApiProperty({ description: 'Slug', example: 'gioi-thieu-ve-nestjs' })
  slug: string;

  @ApiProperty({ description: 'Nội dung', example: '<p>Nội dung bài viết...</p>' })
  content: string;

  @ApiPropertyOptional({ description: 'Tóm tắt', example: 'Bài viết giới thiệu về NestJS...' })
  excerpt: string | null;

  @ApiPropertyOptional({ description: 'Hình ảnh đại diện', example: 'https://example.com/image.jpg' })
  featured_image: string | null;

  @ApiProperty({ description: 'Tags', type: [TagDto] })
  tags: TagDto[];

  @ApiPropertyOptional({ description: 'Ngày publish', example: '2025-01-27T00:00:00Z' })
  published_at: Date | null;

  @ApiProperty({ description: 'Số lượt xem', example: 100 })
  view_count: number;

  @ApiProperty({ description: 'Tác giả', example: 'John Doe' })
  author: string;

  @ApiProperty({ description: 'Thời gian đọc (phút)', example: 5 })
  reading_time: number;

  @ApiProperty({ description: 'Bài viết liên quan', type: [RelatedPostDto] })
  related_posts: RelatedPostDto[];
}

export class PaginationDto {
  @ApiProperty({ description: 'Trang hiện tại', example: 1 })
  page: number;

  @ApiProperty({ description: 'Số lượng items mỗi trang', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Tổng số items', example: 100 })
  total: number;

  @ApiProperty({ description: 'Tổng số trang', example: 10 })
  totalPages: number;
}

export class BlogListResponseDto {
  @ApiProperty({ description: 'Danh sách blog posts', type: [BlogPostListItemDto] })
  data: BlogPostListItemDto[];

  @ApiProperty({ description: 'Thông tin phân trang', type: PaginationDto })
  pagination: PaginationDto;
}

