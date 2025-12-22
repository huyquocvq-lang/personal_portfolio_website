import { config } from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedTags() {
  console.log('🌱 Seeding tags...');

  const tags = [
    {
      name: 'React',
      slug: 'react',
    },
    {
      name: 'TypeScript',
      slug: 'typescript',
    },
    {
      name: 'NestJS',
      slug: 'nestjs',
    },
    {
      name: 'Supabase',
      slug: 'supabase',
    },
    {
      name: 'UI/UX Design',
      slug: 'ui-ux-design',
    },
    {
      name: 'Web Development',
      slug: 'web-development',
    },
    {
      name: 'Backend Development',
      slug: 'backend-development',
    },
    {
      name: 'Frontend Development',
      slug: 'frontend-development',
    },
  ];

  const insertedTags: any[] = [];
  for (const tag of tags) {
    const { data, error } = await supabase
      .from('tags')
      .upsert(tag, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error(`Error inserting tag ${tag.name}:`, error);
    } else {
      console.log(`✅ Inserted tag: ${tag.name}`);
      insertedTags.push(data);
    }
  }

  return insertedTags;
}

async function seedSkills() {
  console.log('🌱 Seeding skills...');

  const skills = [
    {
      title_vi: 'Strategy & Direction',
      title_en: 'Strategy & Direction',
      description_vi:
        'Tôi giúp bạn định hướng chiến lược sản phẩm, phân tích thị trường và xây dựng roadmap phát triển. Từ việc nghiên cứu người dùng đến việc xác định các tính năng cốt lõi, tôi đảm bảo sản phẩm của bạn đi đúng hướng.',
      description_en:
        'I help you define product strategy, analyze markets and build development roadmaps. From user research to identifying core features, I ensure your product is on the right track.',
      icon_url: 'https://www.figma.com/api/mcp/asset/494f6294-2064-44d9-9b58-f3715ad96365',
      highlighted: true,
      display_order: 0,
    },
    {
      title_vi: 'Branding & Logo',
      title_en: 'Branding & Logo',
      description_vi:
        'Tạo dựng thương hiệu mạnh mẽ với logo và identity system độc đáo. Tôi thiết kế brand identity từ concept đến execution, đảm bảo thương hiệu của bạn nổi bật và dễ nhận biết.',
      description_en:
        'Build a strong brand with unique logo and identity system. I design brand identity from concept to execution, ensuring your brand stands out and is easily recognizable.',
      icon_url: 'https://www.figma.com/api/mcp/asset/3fcad0fa-0413-49a8-9728-f2e6fdc16e74',
      highlighted: false,
      display_order: 1,
    },
    {
      title_vi: 'UI & UX Design',
      title_en: 'UI & UX Design',
      description_vi:
        'Thiết kế giao diện người dùng đẹp mắt và trải nghiệm người dùng tối ưu. Tôi tập trung vào việc tạo ra các sản phẩm digital dễ sử dụng, trực quan và thân thiện với người dùng.',
      description_en:
        'Design beautiful user interfaces and optimal user experiences. I focus on creating digital products that are easy to use, intuitive and user-friendly.',
      icon_url: 'https://www.figma.com/api/mcp/asset/4d6c5c99-0050-4899-be17-73f47195af6e',
      highlighted: false,
      display_order: 2,
    },
    {
      title_vi: 'Webflow Development',
      title_en: 'Webflow Development',
      description_vi:
        'Phát triển website responsive và hiện đại với Webflow. Tôi chuyển đổi designs thành code, tạo ra các website nhanh, SEO-friendly và dễ quản lý mà không cần viết code thủ công.',
      description_en:
        'Develop responsive and modern websites with Webflow. I convert designs to code, creating fast, SEO-friendly and easy-to-manage websites without manual coding.',
      icon_url: 'https://www.figma.com/api/mcp/asset/260872fa-8ab4-4193-a059-677b02656b8c',
      highlighted: false,
      display_order: 3,
    },
  ];

  const insertedSkills: any[] = [];
  for (const skill of skills) {
    // Check if skill already exists by title_vi
    const { data: existing } = await supabase
      .from('skills')
      .select('id')
      .eq('title_vi', skill.title_vi)
      .single();

    if (existing) {
      console.log(`⏭️  Skill already exists: ${skill.title_vi}`);
      insertedSkills.push(existing);
      continue;
    }

    const { data, error } = await supabase
      .from('skills')
      .insert(skill)
      .select()
      .single();

    if (error) {
      console.error(`Error inserting skill ${skill.title_vi}:`, error);
    } else {
      console.log(`✅ Inserted skill: ${skill.title_vi}`);
      insertedSkills.push(data);
    }
  }

  return insertedSkills;
}

async function seedBlogPosts(tags: any[]) {
  console.log('🌱 Seeding blog posts...');

  const blogPosts = [
    {
      title_vi: 'Giới thiệu về React Hooks',
      title_en: 'Introduction to React Hooks',
      slug: 'gioi-thieu-ve-react-hooks',
      content_vi: `
# Giới thiệu về React Hooks

React Hooks là một tính năng mạnh mẽ được giới thiệu trong React 16.8, cho phép bạn sử dụng state và các tính năng khác của React mà không cần viết class component.

## Tại sao sử dụng Hooks?

Hooks giúp bạn:
- Tái sử dụng logic giữa các components
- Tách biệt concerns một cách rõ ràng hơn
- Viết code ngắn gọn và dễ đọc hơn

## Các Hooks phổ biến

### useState
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

### useEffect
\`\`\`javascript
useEffect(() => {
  // Side effects
}, [dependencies]);
\`\`\`

## Kết luận

React Hooks là một bước tiến lớn trong việc phát triển React applications, giúp code trở nên sạch sẽ và dễ maintain hơn.
      `.trim(),
      content_en: `
# Introduction to React Hooks

React Hooks is a powerful feature introduced in React 16.8 that allows you to use state and other React features without writing class components.

## Why use Hooks?

Hooks help you:
- Reuse logic between components
- Separate concerns more clearly
- Write shorter and more readable code

## Common Hooks

### useState
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

### useEffect
\`\`\`javascript
useEffect(() => {
  // Side effects
}, [dependencies]);
\`\`\`

## Conclusion

React Hooks is a major step forward in React application development, making code cleaner and easier to maintain.
      `.trim(),
      excerpt_vi: 'Tìm hiểu về React Hooks và cách sử dụng chúng để viết code React hiện đại và hiệu quả hơn.',
      excerpt_en: 'Learn about React Hooks and how to use them to write modern and efficient React code.',
      featured_image: 'https://www.figma.com/api/mcp/asset/0155fdb9-55b8-4fc9-b97d-08a48026086b',
      author: 'John Doe',
      status: 'published',
      published_at: new Date().toISOString(),
      view_count: 0,
      tagIds: ['react', 'frontend-development'],
    },
    {
      title_vi: 'Xây dựng API với NestJS',
      title_en: 'Building APIs with NestJS',
      slug: 'xay-dung-api-voi-nestjs',
      content_vi: `
# Xây dựng API với NestJS

NestJS là một framework Node.js mạnh mẽ được xây dựng trên TypeScript, giúp bạn xây dựng các ứng dụng server-side scalable và maintainable.

## Tại sao chọn NestJS?

- TypeScript support out of the box
- Modular architecture
- Dependency injection
- Built-in support cho nhiều libraries

## Cấu trúc cơ bản

\`\`\`typescript
@Controller('api/users')
export class UsersController {
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
\`\`\`

## Kết luận

NestJS là lựa chọn tuyệt vời cho các dự án backend lớn và phức tạp.
      `.trim(),
      content_en: `
# Building APIs with NestJS

NestJS is a powerful Node.js framework built on TypeScript that helps you build scalable and maintainable server-side applications.

## Why choose NestJS?

- TypeScript support out of the box
- Modular architecture
- Dependency injection
- Built-in support for many libraries

## Basic Structure

\`\`\`typescript
@Controller('api/users')
export class UsersController {
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
\`\`\`

## Conclusion

NestJS is an excellent choice for large and complex backend projects.
      `.trim(),
      excerpt_vi: 'Hướng dẫn xây dựng RESTful API với NestJS, từ setup đến deployment.',
      excerpt_en: 'Guide to building RESTful APIs with NestJS, from setup to deployment.',
      featured_image: 'https://www.figma.com/api/mcp/asset/26329701-4aad-44fd-8065-712985d6e61c',
      author: 'John Doe',
      status: 'published',
      published_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      view_count: 15,
      tagIds: ['nestjs', 'backend-development'],
    },
    {
      title_vi: 'Thiết kế UI/UX hiện đại',
      title_en: 'Modern UI/UX Design',
      slug: 'thiet-ke-ui-ux-hien-dai',
      content_vi: `
# Thiết kế UI/UX hiện đại

Thiết kế giao diện người dùng hiện đại không chỉ là về vẻ đẹp, mà còn về trải nghiệm người dùng tuyệt vời.

## Nguyên tắc thiết kế

1. **Simplicity** - Đơn giản là tốt nhất
2. **Consistency** - Nhất quán trong mọi elements
3. **Accessibility** - Dễ tiếp cận cho mọi người
4. **Performance** - Tối ưu hiệu suất

## Best Practices

- Sử dụng white space hợp lý
- Typography rõ ràng và dễ đọc
- Color scheme nhất quán
- Responsive design

## Kết luận

Thiết kế UI/UX tốt là nền tảng cho mọi sản phẩm digital thành công.
      `.trim(),
      content_en: `
# Modern UI/UX Design

Modern user interface design is not just about beauty, but also about great user experience.

## Design Principles

1. **Simplicity** - Simple is best
2. **Consistency** - Consistent across all elements
3. **Accessibility** - Accessible to everyone
4. **Performance** - Optimize performance

## Best Practices

- Use white space wisely
- Clear and readable typography
- Consistent color scheme
- Responsive design

## Conclusion

Good UI/UX design is the foundation of every successful digital product.
      `.trim(),
      excerpt_vi: 'Khám phá các nguyên tắc và best practices trong thiết kế UI/UX hiện đại.',
      excerpt_en: 'Explore principles and best practices in modern UI/UX design.',
      featured_image: 'https://www.figma.com/api/mcp/asset/8a4f3db5-75c0-4adc-9c7c-36ea627cc840',
      author: 'John Doe',
      status: 'published',
      published_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      view_count: 42,
      tagIds: ['ui-ux-design', 'web-development'],
    },
    {
      title_vi: 'Làm việc với Supabase',
      title_en: 'Working with Supabase',
      slug: 'lam-viec-voi-supabase',
      content_vi: `
# Làm việc với Supabase

Supabase là một open-source Firebase alternative, cung cấp PostgreSQL database, authentication, storage và real-time subscriptions.

## Tính năng chính

- PostgreSQL database
- Authentication
- Storage
- Real-time subscriptions
- Edge Functions

## Setup cơ bản

\`\`\`typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);
\`\`\`

## Kết luận

Supabase là giải pháp tuyệt vời cho các dự án cần backend nhanh chóng và dễ sử dụng.
      `.trim(),
      content_en: `
# Working with Supabase

Supabase is an open-source Firebase alternative, providing PostgreSQL database, authentication, storage and real-time subscriptions.

## Key Features

- PostgreSQL database
- Authentication
- Storage
- Real-time subscriptions
- Edge Functions

## Basic Setup

\`\`\`typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);
\`\`\`

## Conclusion

Supabase is an excellent solution for projects that need a quick and easy-to-use backend.
      `.trim(),
      excerpt_vi: 'Hướng dẫn sử dụng Supabase để xây dựng backend cho ứng dụng của bạn.',
      excerpt_en: 'Guide to using Supabase to build the backend for your application.',
      featured_image: null,
      author: 'John Doe',
      status: 'published',
      published_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      view_count: 28,
      tagIds: ['supabase', 'backend-development'],
    },
    {
      title_vi: 'TypeScript Best Practices',
      title_en: 'TypeScript Best Practices',
      slug: 'typescript-best-practices',
      content_vi: `
# TypeScript Best Practices

TypeScript giúp bạn viết code JavaScript an toàn hơn với type checking và IntelliSense.

## Tại sao TypeScript?

- Type safety
- Better IDE support
- Refactoring dễ dàng hơn
- Catching errors sớm

## Best Practices

1. Sử dụng strict mode
2. Định nghĩa types rõ ràng
3. Sử dụng interfaces cho objects
4. Avoid \`any\` type

## Kết luận

TypeScript là công cụ mạnh mẽ giúp code JavaScript trở nên an toàn và maintainable hơn.
      `.trim(),
      content_en: `
# TypeScript Best Practices

TypeScript helps you write safer JavaScript code with type checking and IntelliSense.

## Why TypeScript?

- Type safety
- Better IDE support
- Easier refactoring
- Catching errors early

## Best Practices

1. Use strict mode
2. Define types clearly
3. Use interfaces for objects
4. Avoid \`any\` type

## Conclusion

TypeScript is a powerful tool that makes JavaScript code safer and more maintainable.
      `.trim(),
      excerpt_vi: 'Các best practices khi làm việc với TypeScript để viết code chất lượng cao.',
      excerpt_en: 'Best practices when working with TypeScript to write high-quality code.',
      featured_image: null,
      author: 'John Doe',
      status: 'draft',
      published_at: null,
      view_count: 0,
      tagIds: ['typescript', 'web-development'],
    },
  ];

  const insertedPosts: any[] = [];
  for (const post of blogPosts) {
    const { tagIds, ...postData } = post;
    const { data: postResult, error: postError } = await supabase
      .from('blog_posts')
      .upsert(
        {
          ...postData,
          published_at: postData.published_at || null,
        },
        { onConflict: 'slug' },
      )
      .select()
      .single();

    if (postError) {
      console.error(`Error inserting blog post ${post.title_vi}:`, postError);
      continue;
    }

    console.log(`✅ Inserted blog post: ${post.title_vi}`);

    // Insert blog_post_tags
    if (tagIds && tagIds.length > 0) {
      const tagMap = new Map(tags.map((tag) => [tag.slug, tag.id]));
      const postTags = tagIds
        .map((slug) => {
          const tag = tagMap.get(slug);
          return tag ? { blog_post_id: postResult.id, tag_id: tag.id } : null;
        })
        .filter((item) => item !== null);

      if (postTags.length > 0) {
        const { error: tagsError } = await supabase
          .from('blog_post_tags')
          .upsert(postTags, { onConflict: 'blog_post_id,tag_id' });

        if (tagsError) {
          console.error(`Error inserting tags for post ${post.title_vi}:`, tagsError);
        } else {
          console.log(`  ✅ Linked ${postTags.length} tags`);
        }
      }
    }

    insertedPosts.push(postResult);
  }

  return insertedPosts;
}

async function main() {
  console.log('🚀 Starting seed process...\n');

  try {
    // Seed tags first
    const tags = await seedTags();
    console.log(`\n✅ Seeded ${tags.length} tags\n`);

    // Seed skills
    const skills = await seedSkills();
    console.log(`\n✅ Seeded ${skills.length} skills\n`);

    // Seed blog posts (requires tags)
    const posts = await seedBlogPosts(tags);
    console.log(`\n✅ Seeded ${posts.length} blog posts\n`);

    console.log('🎉 Seed process completed successfully!');
    console.log(`\nSummary:`);
    console.log(`- Tags: ${tags.length}`);
    console.log(`- Skills: ${skills.length}`);
    console.log(`- Blog Posts: ${posts.length}`);
  } catch (error) {
    console.error('❌ Error during seed process:', error);
    process.exit(1);
  }
}

main();

