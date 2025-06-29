import axios from 'axios';
import { Post, Comment, PostFormInput } from '../types';

const API = 'https://blog-system-backend.onrender.com/Post'; 
const APIC = 'https://blog-system-backend.onrender.com/Comment'; 

class PostService {
  async getAllPosts(): Promise<Post[]> {
    const response = await axios.get(`${API}/getpost`);
    return response.data;
  }

  async getPostById(_id: string): Promise<Post | null> {
    const response = await axios.get(`${API}/getbyid/${_id}`);
    return response.data || null;
  }

  async getPostsByAuthor(_id: string): Promise<Post[]> {
    const response = await axios.get(`${API}/author/${_id}`);
    return response.data;
  }

  // ✅ FIXED: use PostFormInput
  async createPost(postData: PostFormInput): Promise<Post> {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API}/createpost`, postData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  // ✅ FIXED: use Partial<PostFormInput> (in case you're not updating the full structure)
  async updatePost(_id: string, updates: Partial<PostFormInput>): Promise<Post> {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API}/updatepost/${_id}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async deletePost(_id: string): Promise<void> {
    const token = localStorage.getItem('token');
    await axios.delete(`${API}/deletepost/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getCommentsByPostId(_id: string): Promise<Comment[]> {
    const response = await axios.get(`${APIC}/comment/${_id}`);
    return response.data;
  }

  async createComment(commentData: Omit<Comment, '_id' | 'createdAt'>): Promise<Comment> {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${APIC}/create`, commentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async searchPosts(query: string): Promise<Post[]> {
    const response = await axios.get(`${API}/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export const postService = new PostService();
