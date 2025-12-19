import React from 'react';
import type { Tag } from '../../services/api';

interface BlogFilterProps {
  tags: Tag[];
  selectedTag: string | null;
  onTagSelect: (tagSlug: string | null) => void;
  language: 'vi' | 'en';
  onLanguageChange: (lang: 'vi' | 'en') => void;
  sort: 'newest' | 'oldest' | 'most_viewed';
  onSortChange: (sort: 'newest' | 'oldest' | 'most_viewed') => void;
}

export const BlogFilter: React.FC<BlogFilterProps> = ({
  tags,
  selectedTag,
  onTagSelect,
  language,
  onLanguageChange,
  sort,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTagSelect(null)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTag === null
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagSelect(tag.slug)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTag === tag.slug
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => onLanguageChange('vi')}
            className={`px-3 py-1 rounded text-sm ${
              language === 'vi'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            VI
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1 rounded text-sm ${
              language === 'en'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            EN
          </button>
        </div>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'most_viewed')}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most_viewed">Most Viewed</option>
        </select>
      </div>
    </div>
  );
};

