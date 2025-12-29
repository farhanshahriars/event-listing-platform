import { create } from 'zustand';
import axios from '../api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },
  
  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      set({ 
        user: userData, 
        token, 
        isAuthenticated: true, 
        loading: false 
      });
      
      return { success: true, data: response.data };
    } catch (err) {
      set({ loading: false });
      return { 
        success: false, 
        error: err.response?.data?.error || 'Login failed' 
      };
    }
  },
  
  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const response = await axios.post('/auth/register', { 
        name, 
        email, 
        password 
      });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      set({ 
        user: userData, 
        token, 
        isAuthenticated: true, 
        loading: false 
      });
      
      return { success: true, data: response.data };
    } catch (err) {
      set({ loading: false });
      return { 
        success: false, 
        error: err.response?.data?.error || 'Registration failed' 
      };
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
  },
  
  fetchCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await axios.get('/auth/me');
      set({ 
        user: response.data, 
        isAuthenticated: true 
      });
    } catch {
      // If token is invalid, clear it
      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      });
    }
  }
}));

export default useAuthStore;