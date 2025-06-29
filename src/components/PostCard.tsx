import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true, // optional, shows AM/PM
  });
};

  return (
    <article className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      {post.image && (
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <Link to={`/post/${post._id}`}>
          <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-slate-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Author and Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.avatar || `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
              alt={post.author.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-slate-900">
                {post.author.firstName} {post.author.lastName}
              </p>
              <p className="text-sm text-slate-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;