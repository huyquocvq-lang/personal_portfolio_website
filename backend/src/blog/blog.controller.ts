import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseEnumPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import {
  BlogQueryDto,
  Language,
  BlogListResponseDto,
  BlogPostDetailDto,
  TagDto,
  CreateBlogDto,
  UpdateBlogDto,
} from './dto';

@ApiTags('blog')
@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách blog posts' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách blog posts',
    type: BlogListResponseDto,
  })
  async findAll(@Query() query: BlogQueryDto): Promise<BlogListResponseDto> {
    return this.blogService.findAll(query);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Lấy danh sách tất cả tags' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tags',
    type: [TagDto],
  })
  async findAllTags(): Promise<TagDto[]> {
    return this.blogService.findAllTags();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Lấy chi tiết blog post theo slug' })
  @ApiParam({ name: 'slug', description: 'Slug của blog post', example: 'gioi-thieu-ve-nestjs' })
  @ApiQuery({
    name: 'lang',
    enum: Language,
    required: false,
    description: 'Ngôn ngữ',
    example: Language.VI,
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết blog post',
    type: BlogPostDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Blog post không tìm thấy' })
  async findOneBySlug(
    @Param('slug') slug: string,
    @Query('lang', new ParseEnumPipe(Language, { optional: true })) lang?: Language,
  ): Promise<BlogPostDetailDto> {
    return this.blogService.findOneBySlug(slug, lang || Language.VI);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo blog post mới' })
  @ApiBody({ type: CreateBlogDto })
  @ApiResponse({
    status: 201,
    description: 'Blog post đã được tạo',
    type: BlogPostDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBlogDto: CreateBlogDto): Promise<BlogPostDetailDto> {
    return this.blogService.create(createBlogDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật blog post' })
  @ApiParam({ name: 'id', description: 'ID của blog post', example: 'uuid' })
  @ApiBody({ type: UpdateBlogDto })
  @ApiResponse({
    status: 200,
    description: 'Blog post đã được cập nhật',
    type: BlogPostDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Blog post không tìm thấy' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogPostDetailDto> {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa blog post' })
  @ApiParam({ name: 'id', description: 'ID của blog post', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Blog post đã được xóa' })
  @ApiResponse({ status: 404, description: 'Blog post không tìm thấy' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.blogService.remove(id);
    return { message: 'Blog post đã được xóa thành công' };
  }
}
