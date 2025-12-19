import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { blogApi } from '../services/api';
import type { Tag, BlogPostListItem } from '../services/api';
import { BlogCard } from '../components/BlogCard';
import { BlogFilter } from '../components/BlogFilter';
import { BlogSearch } from '../components/BlogSearch';
import { Container } from '../components/Container';

export const BlogListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<BlogPostListItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const selectedTag = searchParams.get('tag');
  const language = (searchParams.get('lang') || 'vi') as 'vi' | 'en';
  const search = searchParams.get('search') || '';
  const sort = (searchParams.get('sort') || 'newest') as 'newest' | 'oldest' | 'most_viewed';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await blogApi.getBlogs({
        page,
        limit: 10,
        tag: selectedTag || undefined,
        lang: language,
        search: search || undefined,
        sort,
      });
      setBlogs(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTag, language, search, sort, page]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const loadTags = async () => {
    try {
      const tagsData = await blogApi.getTags();
      setTags(tagsData);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleTagSelect = (tagSlug: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (tagSlug) {
      newParams.set('tag', tagSlug);
    } else {
      newParams.delete('tag');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleLanguageChange = (lang: 'vi' | 'en') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('lang', lang);
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort: 'newest' | 'oldest' | 'most_viewed') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    setSearchParams(newParams);
  };

  const handleSearch = (searchTerm: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container maxWidth="xl" className="w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>

        <BlogSearch onSearch={handleSearch} />

        <BlogFilter
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={handleTagSelect}
          language={language}
          onLanguageChange={handleLanguageChange}
          sort={sort}
          onSortChange={handleSortChange}
        />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

