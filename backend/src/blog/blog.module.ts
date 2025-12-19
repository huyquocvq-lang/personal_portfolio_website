import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogRepository } from '../repositories';
import { SupabaseConfig } from '../config/supabase.config';

@Module({
  controllers: [BlogController],
  providers: [BlogService, BlogRepository, SupabaseConfig],
})
export class BlogModule {}

