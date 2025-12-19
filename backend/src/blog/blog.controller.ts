import { Controller, Get, Param, Query, ParseEnumPipe } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogQueryDto, Language, BlogListResponseDto, BlogPostDetailDto, TagDto } from './dto';

@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAll(@Query() query: BlogQueryDto): Promise<BlogListResponseDto> {
    return this.blogService.findAll(query);
  }

  @Get('tags')
  async findAllTags(): Promise<TagDto[]> {
    return this.blogService.findAllTags();
  }

  @Get(':slug')
  async findOneBySlug(
    @Param('slug') slug: string,
    @Query('lang', new ParseEnumPipe(Language, { optional: true })) lang?: Language,
  ): Promise<BlogPostDetailDto> {
    return this.blogService.findOneBySlug(slug, lang || Language.VI);
  }
}

