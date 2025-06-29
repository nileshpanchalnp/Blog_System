import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { PenTool, Calendar, Heart, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { Post } from '../types';
import PostCard from '../components/PostCard';

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;
      
      try {
        const userPosts = await postService.getPostsByAuthor(user._id);
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
          <img
            src={user.avatar || `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop`}
            alt={user.firstName}
            className="w-24 h-24 rounded-full object-cover border-4 border-slate-100"
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {user.firstName} {user.lastName}
              </h1>
              <Link
                to="/settings"
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <Edit className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-slate-600 mb-2">@{user.username}</p>
            {user.bio && <p className="text-slate-700 mb-4">{user.bio}</p>}
            
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <PenTool className="h-4 w-4" />
                <span>{posts.length} articles</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{totalLikes} likes</span>
              </div>
            </div>
          </div>

          <Link
            to="/create"
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
          >
            <PenTool className="h-4 w-4" />
            <span>Write Article</span>
          </Link>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Your Articles</h2>
          <span className="text-slate-500">{posts.length} articles</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No articles yet</h3>
              <p className="text-slate-600 mb-6">Start sharing your ideas with the community.</p>
              <Link
                to="/create"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                <PenTool className="h-4 w-4" />
                <span>Write Your First Article</span>
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
    </div>
  );
};

export default ProfilePage;