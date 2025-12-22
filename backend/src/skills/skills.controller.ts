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
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto, SkillDto, SkillListResponseDto, SkillDetailDto } from './dto';
import { Language } from '../blog/dto';

@ApiTags('skills')
@Controller('api/skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả skills' })
  @ApiQuery({
    name: 'lang',
    enum: Language,
    required: false,
    description: 'Ngôn ngữ',
    example: Language.VI,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách skills',
    type: SkillListResponseDto,
  })
  async findAll(
    @Query('lang', new ParseEnumPipe(Language, { optional: true })) lang?: Language,
  ): Promise<SkillListResponseDto> {
    return this.skillsService.findAll(lang || Language.VI);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy chi tiết skill theo slug' })
  @ApiParam({ name: 'slug', description: 'Slug của skill (từ title)', example: 'strategy-direction' })
  @ApiQuery({
    name: 'lang',
    enum: Language,
    required: false,
    description: 'Ngôn ngữ',
    example: Language.VI,
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết skill với related projects',
    type: SkillDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Skill không tìm thấy' })
  async findBySlug(
    @Param('slug') slug: string,
    @Query('lang', new ParseEnumPipe(Language, { optional: true })) lang?: Language,
  ): Promise<SkillDetailDto> {
    return this.skillsService.findBySlug(slug, lang || Language.VI);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết skill theo ID' })
  @ApiParam({ name: 'id', description: 'ID của skill', example: 'uuid' })
  @ApiQuery({
    name: 'lang',
    enum: Language,
    required: false,
    description: 'Ngôn ngữ',
    example: Language.VI,
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết skill',
    type: SkillDto,
  })
  @ApiResponse({ status: 404, description: 'Skill không tìm thấy' })
  async findOne(
    @Param('id') id: string,
    @Query('lang', new ParseEnumPipe(Language, { optional: true })) lang?: Language,
  ): Promise<SkillDto> {
    return this.skillsService.findOne(id, lang || Language.VI);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo skill mới' })
  @ApiBody({ type: CreateSkillDto })
  @ApiResponse({
    status: 201,
    description: 'Skill đã được tạo',
    type: SkillDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSkillDto: CreateSkillDto): Promise<SkillDto> {
    return this.skillsService.create(createSkillDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật skill' })
  @ApiParam({ name: 'id', description: 'ID của skill', example: 'uuid' })
  @ApiBody({ type: UpdateSkillDto })
  @ApiResponse({
    status: 200,
    description: 'Skill đã được cập nhật',
    type: SkillDto,
  })
  @ApiResponse({ status: 404, description: 'Skill không tìm thấy' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<SkillDto> {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa skill' })
  @ApiParam({ name: 'id', description: 'ID của skill', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Skill đã được xóa' })
  @ApiResponse({ status: 404, description: 'Skill không tìm thấy' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.skillsService.remove(id);
    return { message: 'Skill đã được xóa thành công' };
  }
}

