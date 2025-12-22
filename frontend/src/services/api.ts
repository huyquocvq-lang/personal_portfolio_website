const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  tags: { id: string; name: string; slug: string }[];
  published_at: string | null;
  view_count: number;
  author: string;
}

export interface BlogPostDetail extends BlogPostListItem {
  content: string;
  reading_time: number;
  related_posts: {
    id: string;
    title: string;
    slug: string;
    featured_image: string | null;
  }[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogListResponse {
  data: BlogPostListItem[];
  pagination: Pagination;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  tag?: string;
  lang?: 'vi' | 'en';
  search?: string;
  sort?: 'newest' | 'oldest' | 'most_viewed';
}

export const blogApi = {
  async getBlogs(params: BlogQueryParams = {}): Promise<BlogListResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.tag) queryParams.append('tag', params.tag);
    if (params.lang) queryParams.append('lang', params.lang);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort) queryParams.append('sort', params.sort);

    const response = await fetch(`${API_BASE_URL}/blog?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    return response.json();
  },

  async getBlogBySlug(slug: string, lang: 'vi' | 'en' = 'vi'): Promise<BlogPostDetail> {
    const response = await fetch(`${API_BASE_URL}/blog/${slug}?lang=${lang}`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog');
    }
    return response.json();
  },

  async getTags(): Promise<Tag[]> {
    const response = await fetch(`${API_BASE_URL}/blog/tags`);
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    return response.json();
  },
};

export interface Skill {
  id: string;
  title: string;
  description: string;
  icon_url: string | null;
  highlighted: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface RelatedProject {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link_url: string | null;
}

export interface SkillDetail extends Skill {
  related_projects: RelatedProject[];
}

export interface SkillListResponse {
  data: Skill[];
}

export const skillApi = {
  async getSkills(lang: 'vi' | 'en' = 'vi'): Promise<SkillListResponse> {
    const response = await fetch(`${API_BASE_URL}/skills?lang=${lang}`);
    if (!response.ok) {
      throw new Error('Failed to fetch skills');
    }
    return response.json();
  },

  async getSkillBySlug(slug: string, lang: 'vi' | 'en' = 'vi'): Promise<SkillDetail> {
    const response = await fetch(`${API_BASE_URL}/skills/slug/${slug}?lang=${lang}`);
    if (!response.ok) {
      throw new Error('Failed to fetch skill');
    }
    return response.json();
  },
};

