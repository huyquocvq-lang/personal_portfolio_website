import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlogPostStatus } from '../../entities/blog-post.entity';

export class CreateBlogDto {
  @ApiProperty({ description: 'Tiêu đề tiếng Việt', example: 'Giới thiệu về NestJS' })
  @IsString()
  @IsNotEmpty()
  title_vi: string;

  @ApiProperty({ description: 'Tiêu đề tiếng Anh', example: 'Introduction to NestJS' })
  @IsString()
  @IsNotEmpty()
  title_en: string;

  @ApiProperty({ description: 'Slug (tự động generate nếu không có)', example: 'gioi-thieu-ve-nestjs' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ description: 'Nội dung tiếng Việt', example: '<p>Nội dung bài viết...</p>' })
  @IsString()
  @IsNotEmpty()
  content_vi: string;

  @ApiProperty({ description: 'Nội dung tiếng Anh', example: '<p>Article content...</p>' })
  @IsString()
  @IsNotEmpty()
  content_en: string;

  @ApiPropertyOptional({ description: 'Tóm tắt tiếng Việt', example: 'Bài viết giới thiệu về NestJS...' })
  @IsString()
  @IsOptional()
  excerpt_vi?: string;

  @ApiPropertyOptional({ description: 'Tóm tắt tiếng Anh', example: 'This article introduces NestJS...' })
  @IsString()
  @IsOptional()
  excerpt_en?: string;

  @ApiPropertyOptional({ description: 'URL hình ảnh đại diện', example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  featured_image?: string;

  @ApiProperty({ description: 'Tác giả', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiPropertyOptional({ description: 'Ngày publish (ISO string)', example: '2025-01-27T00:00:00Z' })
  @IsDateString()
  @IsOptional()
  published_at?: string;

  @ApiPropertyOptional({ description: 'Trạng thái', enum: BlogPostStatus, default: BlogPostStatus.DRAFT })
  @IsEnum(BlogPostStatus)
  @IsOptional()
  status?: BlogPostStatus;

  @ApiPropertyOptional({ description: 'Danh sách tag IDs', type: [String], example: ['uuid1', 'uuid2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tag_ids?: string[];
}

