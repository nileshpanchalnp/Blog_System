import axios from 'axios';
import { User, LoginCredentials, RegisterData } from '../types';

const API = 'http://localhost:5000/User'; // ✅ Change this to match your backend URL

export const authService = {
  // LOGIN
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await axios.post(`${API}/login`, credentials);
    const { data, token } = response.data;
    return { user: data, token };
  },

  // REGISTER
  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await axios.post(`${API}/register`, data);
    const { data: user, token } = response.data;
    return { user, token };
  },

  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("me--------",response.data.data)
    return response.data.data;
  },

  // UPDATE PROFILE
 // UPDATE PROFILE
// UPDATE PROFILE
updateProfile: async (data: Partial<User>): Promise<User> => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  if (!token || !userString) {
    throw new Error('User is not authenticated');
  }

  const user = JSON.parse(userString);
  const userId = user._id;

  const response = await axios.put(`${API}/update/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data.data;
}


};
