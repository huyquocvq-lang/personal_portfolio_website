/**
 * Script để validate entities với Supabase schema
 * 
 * Usage:
 *   npm run validate:schema
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tixmpgpsfflupbyyuvfg.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeG1wZ3BzZmZsdXBieXl1dmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzA1NzYsImV4cCI6MjA3MTAwNjU3Nn0.wyOSUU1DBg9Yp9z-6NmcxPRx2Z6x_3G5Svh7bvcONKA';

interface ValidationResult {
  table: string;
  issues: string[];
  warnings: string[];
}

async function validateSchema() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const results: ValidationResult[] = [];

  // Expected schema from Supabase
  const expectedSchema = {
    blog_posts: {
      columns: [
        'id',
        'title_vi',
        'title_en',
        'slug',
        'content_vi',
        'content_en',
        'excerpt_vi',
        'excerpt_en',
        'featured_image',
        'author',
        'published_at',
        'status',
        'view_count',
        'created_at',
        'updated_at',
      ],
      nullable: ['excerpt_vi', 'excerpt_en', 'featured_image', 'published_at'],
      unique: ['slug'],
    },
    tags: {
      columns: ['id', 'name', 'slug', 'created_at'],
      nullable: [],
      unique: ['name', 'slug'],
    },
  };

  // Validate blog_posts entity
  const blogPostEntity = path.join(__dirname, '../src/entities/blog-post.entity.ts');
  if (fs.existsSync(blogPostEntity)) {
    const content = fs.readFileSync(blogPostEntity, 'utf-8');
    const issues: string[] = [];
    const warnings: string[] = [];

    expectedSchema.blog_posts.columns.forEach((col) => {
      if (!content.includes(col)) {
        issues.push(`Missing column: ${col}`);
      }
    });

    expectedSchema.blog_posts.nullable.forEach((col) => {
      if (!content.includes(`nullable: true`) && content.includes(col)) {
        warnings.push(`Column ${col} might need nullable: true`);
      }
    });

    results.push({
      table: 'blog_posts',
      issues,
      warnings,
    });
  }

  // Validate tags entity
  const tagEntity = path.join(__dirname, '../src/entities/tag.entity.ts');
  if (fs.existsSync(tagEntity)) {
    const content = fs.readFileSync(tagEntity, 'utf-8');
    const issues: string[] = [];
    const warnings: string[] = [];

    expectedSchema.tags.columns.forEach((col) => {
      if (!content.includes(col)) {
        issues.push(`Missing column: ${col}`);
      }
    });

    results.push({
      table: 'tags',
      issues,
      warnings,
    });
  }

  // Print results
  console.log('📊 Schema Validation Results\n');
  results.forEach((result) => {
    console.log(`Table: ${result.table}`);
    if (result.issues.length === 0 && result.warnings.length === 0) {
      console.log('  ✅ No issues found\n');
    } else {
      if (result.issues.length > 0) {
        console.log('  ❌ Issues:');
        result.issues.forEach((issue) => console.log(`    - ${issue}`));
      }
      if (result.warnings.length > 0) {
        console.log('  ⚠️  Warnings:');
        result.warnings.forEach((warning) => console.log(`    - ${warning}`));
      }
      console.log();
    }
  });
}

validateSchema().catch(console.error);

