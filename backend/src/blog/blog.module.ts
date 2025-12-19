import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogPost, Tag } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost, Tag])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}

