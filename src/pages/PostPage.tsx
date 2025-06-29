import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Heart, Edit, Trash2, ArrowLeft, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { Post, Comment } from '../types';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const [fetchedPost, fetchedComments] = await Promise.all([
          postService.getPostById(id),
          postService.getCommentsByPostId(id),
        ]);
        setPost(fetchedPost);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!post || !id) return;
    
    try {
      await postService.deletePost(id);
      navigate('/profile');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments([...comments, newComment]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Post not found</h1>
        <p className="text-slate-600 mb-8">The post you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  const isAuthor = user?.id === post.author.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      {/* <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button> */}

      {/* Post Header */}
      <article className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        {post.image && (
          <div className="relative">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="p-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author and Meta */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
            <div className="flex items-center space-x-4">
              <img
                src={post.author.avatar || `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
                alt={post.author.firstName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-slate-900">
                  {post.author.firstName} {post.author.lastName}
                </p>
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span>{formatDate(post.createdAt)}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime} min read</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              
              {isAuthor && (
                <>
                  <Link
                    to={`/edit/${post._id}`}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  
                  {deleteConfirm ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleDelete}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div 
            className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: `<p>${formatContent(post.content)}</p>` }}
          />
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">
          Comments ({comments.length})
        </h2>
        
        <div className="space-y-8">
          <CommentForm postId={post._id} onCommentAdded={handleCommentAdded} />
          <CommentList comments={comments} />
        </div>
      </div>
    </div>
  );
};

export default PostPage;