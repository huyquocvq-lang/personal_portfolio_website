import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { BlogPostListItem } from '../../services/api';

interface BlogCardProps {
  blog: BlogPostListItem;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <article className="flex flex-col gap-4 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {blog.featured_image && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={blog.featured_image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-6">
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/blog?tag=${tag.slug}`}
              className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>
        <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
          <Link to={`/blog/${blog.slug}`} className="hover:text-purple-600 transition-colors">
            {blog.title}
          </Link>
        </h2>
        <p className="text-gray-600 line-clamp-3">{blog.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            {blog.published_at && (
              <span>{format(new Date(blog.published_at), 'MMM dd, yyyy')}</span>
            )}
            <span>{blog.view_count} views</span>
          </div>
          <span className="text-purple-600 font-medium">By {blog.author}</span>
        </div>
        <Link
          to={`/blog/${blog.slug}`}
          className="self-start px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Read More
        </Link>
      </div>
    </article>
  );
};

