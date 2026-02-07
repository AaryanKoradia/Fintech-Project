import axios from 'axios/dist/browser/axios.cjs';
import { EXPO_PUBLIC_API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

// Base API URL
const API_URL = EXPO_PUBLIC_API_URL || 'http://192.168.1.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  deleteAccount: () => api.delete('/users/profile'),
};

// Confidence Score APIs
export const confidenceAPI = {
  getScore: () => api.get('/confidence/score'),
  getHistory: () => api.get('/confidence/history'),
};

// Nudges APIs
export const nudgesAPI = {
  getDailyNudges: () => api.get('/nudges/daily'),
  markAsRead: (nudgeId) => api.post(`/nudges/${nudgeId}/read`),
};

// Expenses APIs
export const expensesAPI = {
  getExpenses: () => api.get('/expenses'),
  addExpense: (expense) => api.post('/expenses', expense),
  updateExpense: (id, expense) => api.put(`/expenses/${id}`, expense),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  getCategories: () => api.get('/expenses/categories'),
};

// AI APIs
export const aiAPI = {
  getFinancialPlan: (data) => api.post('/ai/financial-plan', data),
  getPersonalizedAdvice: () => api.get('/ai/advice'),
  chatWithAI: (message) => api.post('/ai/chat', { message }),
};

// Schemes APIs
export const schemesAPI = {
  getAllSchemes: (params) => api.get('/schemes', { params }),
  getSchemeById: (id) => api.get(`/schemes/${id}`),
  searchSchemes: (query) => api.get('/schemes/search', { params: { q: query } }),
};

// Learning APIs
export const learningAPI = {
  getLessons: () => api.get('/lessons'),
  getLessonById: (id) => api.get(`/lessons/${id}`),
  markLessonComplete: (id) => api.post(`/lessons/${id}/complete`),
  getLessonProgress: () => api.get('/lessons/progress'),
};

// Document Scanner APIs
export const documentAPI = {
  uploadDocument: (formData) => api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  extractText: (documentId) => api.get(`/documents/${documentId}/extract`),
  getDocuments: () => api.get('/documents'),
};

// Admin APIs
export const adminAPI = {
  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Schemes
  createScheme: (data) => api.post('/admin/schemes', data),
  updateScheme: (id, data) => api.put(`/admin/schemes/${id}`, data),
  deleteScheme: (id) => api.delete(`/admin/schemes/${id}`),
  
  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),
  getUserStats: () => api.get('/admin/stats/users'),
  getEngagementStats: () => api.get('/admin/stats/engagement'),
  
  // Admins
  getAllAdmins: () => api.get('/admin/admins'),
  createAdmin: (data) => api.post('/admin/admins', data),
  deleteAdmin: (id) => api.delete(`/admin/admins/${id}`),
};

export default api;
