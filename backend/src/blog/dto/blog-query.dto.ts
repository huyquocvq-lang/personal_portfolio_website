import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  MOST_VIEWED = 'most_viewed',
}

export enum Language {
  VI = 'vi',
  EN = 'en',
}

export class BlogQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsEnum(Language)
  lang?: Language = Language.VI;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder = SortOrder.NEWEST;
}

