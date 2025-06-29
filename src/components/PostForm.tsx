import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, ImageIcon, Tag, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { Post } from '../types';

interface PostFormProps {
  post?: Post;
  onCancel?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onCancel }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

useEffect(() => {
  if (post) {
    setFormData({
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      image: post.image || '',
    });
    setTags(post.tags || []);
  }
}, [post]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === ',' || e.key === ';') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        tags: tags,
        image: formData.image || undefined,
       author: user._id,
        readTime: Math.ceil(formData.content.split(' ').length / 200), // Estimate reading time
      };

      if (post) {
        await postService.updatePost(post._id, postData);
        navigate(`/post/${post._id}`);
      } else {
        const newPost = await postService.createPost(postData);
        navigate(`/post/${newPost._id}`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          placeholder="Enter your post title..."
        />
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-2">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          required
          rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Brief description of your post..."
        />
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-2">
          <ImageIcon className="inline h-4 w-4 mr-1" />
          Featured Image URL (optional)
        </label>
        <input
          type="url"
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
        {formData.image && (
          <div className="mt-3">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Tag className="inline h-4 w-4 mr-1" />
          Tags
        </label>
        
        {/* Tag Input */}
        <div className="flex items-center space-x-2 mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyPress}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a tag (press Enter or comma to add)"
            maxLength={30}
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim() || tags.length >= 10}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Tag Display */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        {tags.length === 0 && (
          <p className="text-sm text-slate-500 mt-2">
            No tags added yet. Tags help readers discover your content.
          </p>
        )}

        {tags.length >= 10 && (
          <p className="text-sm text-amber-600 mt-2">
            Maximum of 10 tags allowed.
          </p>
        )}

        <p className="text-xs text-slate-400 mt-1">
          Tip: Use relevant keywords that describe your post content. Press Enter, comma, or semicolon to add tags.
        </p>
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
          Content
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          rows={20}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
          placeholder="Write your post content here... You can use Markdown syntax."
        />
        <p className="mt-2 text-sm text-slate-500">
          Supports Markdown formatting. Estimated reading time: {Math.ceil(formData.content.split(' ').length / 200)} minutes
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <div className="text-sm text-slate-500">
          {tags.length > 0 && (
            <span>{tags.length} tag{tags.length !== 1 ? 's' : ''} added</span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center space-x-2 px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={loading || !formData.title.trim() || !formData.content.trim() || !formData.excerpt.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : post ? 'Update Post' : 'Publish Post'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;