import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Users } from 'lucide-react';
import PostCard from '../components/PostCard';
import { postService } from '../services/postService';
import { Post } from '../types';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await postService.getAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
          Discover Amazing
          <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Stories & Ideas
          </span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Join our community of writers and readers. Share your knowledge, learn from others, and be part of meaningful conversations.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <span>Trending Topics</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span>Fresh Content Daily</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-500" />
            <span>Active Community</span>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Latest Articles</h2>
          <div className="hidden sm:flex items-center space-x-4 text-sm text-slate-500">
            <span>{posts.length} articles</span>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No posts yet</h3>
              <p className="text-slate-600 mb-6">Be the first to share your story with the community.</p>
              <Link
                to="/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                Write Your First Post
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Share Your Story?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of writers who trust BlogHub to share their ideas with the world.
        </p>
        <a
          href="/register"
          className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-slate-50 transition-all transform hover:scale-105"
        >
          Get Started Today
        </a>
      </div>
    </div>
  );
};

export default HomePage;