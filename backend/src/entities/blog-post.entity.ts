import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tag } from './tag.entity';

export enum BlogPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title_vi: string;

  @Column()
  title_en: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  content_vi: string;

  @Column('text')
  content_en: string;

  @Column('text', { nullable: true })
  excerpt_vi: string;

  @Column('text', { nullable: true })
  excerpt_en: string;

  @Column({ nullable: true })
  featured_image: string;

  @Column()
  author: string;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @Column({
    type: 'enum',
    enum: BlogPostStatus,
    default: BlogPostStatus.DRAFT,
  })
  status: BlogPostStatus;

  @Column({ default: 0 })
  view_count: number;

  @ManyToMany(() => Tag, (tag) => tag.blogPosts)
  @JoinTable({ name: 'blog_post_tags' })
  tags: Tag[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

