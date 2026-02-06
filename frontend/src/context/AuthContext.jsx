import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (token) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [token]);
  
  const loadUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { access_token, user: userData } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
    
      // Role-based navigation
      if (userData.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'AGENT') {
        navigate('/agent/portal');
      } else if (userData.role === 'DISTRICT_OFFICER' || userData.role === 'STATE_OFFICER' || userData.role === 'MINISTRY') {
        navigate('/government/dashboard');
      } else {
        navigate('/user/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      const { access_token, user: newUser } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(newUser);
      
      // Role-based navigation
      if (newUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (newUser.role === 'AGENT') {
        navigate('/agent/portal');
      } else if (newUser.role === 'DISTRICT_OFFICER' || newUser.role === 'STATE_OFFICER' || newUser.role === 'MINISTRY') {
        navigate('/government/dashboard');
      } else {
        navigate('/user/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Signup failed' 
      };
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };
  
  const hasRole = (role) => {
    return user?.role === role;
  };
  
  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';
  const isAgent = user?.role === 'AGENT';
  const isGovernment = ['DISTRICT_OFFICER', 'STATE_OFFICER', 'MINISTRY'].includes(user?.role);
  
  const value = {
    user, 
    token, 
    loading, 
    login, 
    signup, 
    logout, 
    hasRole, 
    isAuthenticated, 
    isAdmin, 
    isUser, 
    isAgent, 
    isGovernment,
    loadUserData,
  };
  
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
