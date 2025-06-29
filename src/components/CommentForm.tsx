import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { Comment } from '../types';

interface CommentFormProps {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);
    try {
      const newComment = await postService.createComment({
        content: content.trim(),
        postId,
        author: user._id, // ✅ Only send user ID
      });
      onCommentAdded(newComment);
      setContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-slate-50 rounded-xl p-6 text-center">
        <p className="text-slate-600 mb-4">Sign in to join the conversation</p>
        <a
          href="/login"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-start space-x-4">
        <img
          src={user.avatar || `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
          alt={user.firstName}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;