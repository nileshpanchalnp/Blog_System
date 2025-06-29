import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import PostForm from '../components/PostForm';

const CreatePostPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Post</h1>
        <p className="text-slate-600 mt-2">Share your ideas with the community</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        <PostForm />
      </div>
    </div>
  );
};

export default CreatePostPage;