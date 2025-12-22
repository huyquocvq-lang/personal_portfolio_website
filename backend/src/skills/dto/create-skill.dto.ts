import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({ description: 'Tiêu đề tiếng Việt', example: 'Strategy & Direction' })
  @IsString()
  @IsNotEmpty()
  title_vi: string;

  @ApiProperty({ description: 'Tiêu đề tiếng Anh', example: 'Strategy & Direction' })
  @IsString()
  @IsNotEmpty()
  title_en: string;

  @ApiProperty({ description: 'Mô tả tiếng Việt', example: 'Lorem ipsum dolor sit amet...' })
  @IsString()
  @IsNotEmpty()
  description_vi: string;

  @ApiProperty({ description: 'Mô tả tiếng Anh', example: 'Lorem ipsum dolor sit amet...' })
  @IsString()
  @IsNotEmpty()
  description_en: string;

  @ApiPropertyOptional({ description: 'URL icon', example: 'https://example.com/icon.png' })
  @IsString()
  @IsOptional()
  icon_url?: string;

  @ApiPropertyOptional({ description: 'Có highlight không', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  highlighted?: boolean;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị', example: 0, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  display_order?: number;
}

