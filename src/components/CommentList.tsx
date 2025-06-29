import React from 'react';
import { Comment } from '../types';

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start space-x-4">
            <img
              src={comment.author.avatar || `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
              alt={comment.author.firstName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-slate-900">
                  {comment.author.firstName} {comment.author.lastName}
                </h4>
                <span className="text-sm text-slate-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;