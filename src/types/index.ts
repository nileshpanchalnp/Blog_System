export interface User {
  _id:string;
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    _id: string;
    lastName: string;
    firstName: string | undefined;
    avatar: string;
    id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
  tags: string[];
  readTime: number;
  likes: number;
  image?: string;
}


export interface Comment {
  id?: string;
  content: string;
  author: User;
  postId: string;
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type PostFormInput = Omit<Post, '_id' | 'createdAt' | 'updatedAt' | 'likes' | 'author'> & {
  author: string; // just the user ID
};