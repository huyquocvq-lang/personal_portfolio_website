import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SkillDto {
  @ApiProperty({ description: 'Skill ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Tiêu đề', example: 'Strategy & Direction' })
  title: string;

  @ApiProperty({ description: 'Mô tả', example: 'Lorem ipsum dolor sit amet...' })
  description: string;

  @ApiPropertyOptional({ description: 'URL icon', example: 'https://example.com/icon.png' })
  icon_url: string | null;

  @ApiProperty({ description: 'Có highlight không', example: false })
  highlighted: boolean;

  @ApiProperty({ description: 'Thứ tự hiển thị', example: 0 })
  display_order: number;

  @ApiProperty({ description: 'Ngày tạo', example: '2025-01-27T00:00:00Z' })
  created_at: Date;

  @ApiProperty({ description: 'Ngày cập nhật', example: '2025-01-27T00:00:00Z' })
  updated_at: Date;
}

export class SkillListResponseDto {
  @ApiProperty({ description: 'Danh sách skills', type: [SkillDto] })
  data: SkillDto[];
}

export class RelatedProjectDto {
  @ApiProperty({ description: 'Project ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Project title', example: 'Ahuse' })
  title: string;

  @ApiProperty({ description: 'Project description', example: 'Lorem ipsum...' })
  description: string;

  @ApiPropertyOptional({ description: 'Project image URL', example: 'https://example.com/image.png' })
  image_url: string | null;

  @ApiPropertyOptional({ description: 'Project link URL', example: 'https://example.com' })
  link_url: string | null;
}

export class SkillDetailDto extends SkillDto {
  @ApiProperty({ description: 'Related projects', type: [RelatedProjectDto] })
  related_projects: RelatedProjectDto[];
}

