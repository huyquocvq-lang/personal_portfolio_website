import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
} from 'typeorm';
import { BlogPost } from './blog-post.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @ManyToMany(() => BlogPost, (blogPost) => blogPost.tags)
  blogPosts: BlogPost[];

  @CreateDateColumn()
  created_at: Date;
}

