import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, FileText } from 'lucide-react';
import { postService } from '../services/postService';
import { Post } from '../types';
import PostCard from '../components/PostCard';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchPosts = async () => {
      if (!query.trim()) {
        setPosts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await postService.searchPosts(query);
        setPosts(results);
      } catch (error) {
        console.error('Error searching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    searchPosts();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900">Search Results</h1>
        </div>
        {query && (
          <p className="text-slate-600">
            {loading ? 'Searching...' : `${posts.length} result${posts.length !== 1 ? 's' : ''} for "${query}"`}
          </p>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : !query.trim() ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Start searching</h3>
            <p className="text-slate-600">Enter a search term to find articles.</p>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-600">
              We couldn't find any articles matching "{query}". Try different keywords or browse all articles.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;