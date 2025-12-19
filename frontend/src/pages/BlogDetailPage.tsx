import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';
import { blogApi } from '../services/api';
import { Container } from '../components/Container';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const language = (searchParams.get('lang') || 'vi') as 'vi' | 'en';

  useEffect(() => {
    if (slug) {
      loadBlog();
    }
  }, [slug, language]);

  const loadBlog = async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const blogData = await blogApi.getBlogBySlug(slug, language);
      setBlog(blogData);
    } catch (err) {
      setError('Failed to load blog post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSwitch = (lang: 'vi' | 'en') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('lang', lang);
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container maxWidth="xl" className="w-full">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container maxWidth="xl" className="w-full">
          <div className="text-center py-12">
            <p className="text-red-600">{error || 'Blog post not found'}</p>
            <Link to="/blog" className="text-purple-600 hover:underline mt-4 inline-block">
              Back to Blog
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container maxWidth="xl" className="w-full">
        <Link
          to="/blog"
          className="text-purple-600 hover:text-purple-700 mb-6 inline-block"
        >
          ← Back to Blog
        </Link>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {blog.featured_image && (
            <div className="w-full h-64 md:h-96 overflow-hidden">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: any) => (
                  <Link
                    key={tag.id}
                    to={`/blog?tag=${tag.slug}`}
                    className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLanguageSwitch('vi')}
                  className={`px-3 py-1 rounded text-sm ${
                    language === 'vi'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => handleLanguageSwitch('en')}
                  className={`px-3 py-1 rounded text-sm ${
                    language === 'en'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-600 mb-8">
              {blog.published_at && (
                <span>{format(new Date(blog.published_at), 'MMMM dd, yyyy')}</span>
              )}
              <span>•</span>
              <span>{blog.reading_time} min read</span>
              <span>•</span>
              <span>{blog.view_count} views</span>
              <span>•</span>
              <span>By {blog.author}</span>
            </div>

            <div
              className="prose prose-lg max-w-none blog-content"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {blog.related_posts && blog.related_posts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {blog.related_posts.map((related: any) => (
                    <Link
                      key={related.id}
                      to={`/blog/${related.slug}?lang=${language}`}
                      className="block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {related.featured_image && (
                        <div className="w-full h-32 overflow-hidden">
                          <img
                            src={related.featured_image}
                            alt={related.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {related.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </Container>
    </div>
  );
};

