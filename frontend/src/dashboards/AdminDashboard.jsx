import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { strings } = useLanguage();
  
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, averageProgress: 0, totalSchemes: 0, });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAdminStats();
    fetchRecentUsers();
  }, []);
  
  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRecentUsers = async () => {
    try {
      const response = await api.get('/admin/users/recent');
      setRecentUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch recent users:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
            {strings.adminPanel}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {strings.welcomeBack}, {user?.fullName || user?.email}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{strings.totalUsers}</h3>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary dark:text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-text-light dark:text-text-dark">{stats.totalUsers}</p>
          </div>
          <div className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{strings.activeUsers}</h3>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-text-light dark:text-text-dark">{stats.activeUsers}</p>
          </div>
          <div className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{strings.completionRate}</h3>
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary dark:text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-text-light dark:text-text-dark">{stats.averageProgress}% </p>
          </div>
          
          <div className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{strings.allSchemes}</h3>
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary dark:text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-text-light dark:text-text-dark">{stats.totalSchemes}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/users" className="card hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-primary dark:text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark">{strings.manageUsers}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{strings.viewDetails}</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/manage-admins" className="card hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-primary/30">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Manage Admins</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add & Remove</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/notifications" className="card hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-primary/30">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-primary dark:text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Send Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alert Users</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/schemes" className="card hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark">{strings.manageSchemes}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add & Update</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/analytics" className="card hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-primary dark:text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark">{strings.analytics}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">View Insights</p>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="card">
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">{strings.recentActivity}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Village</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length > 0 ? (
                  recentUsers.map((u, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-text-light dark:text-text-dark">{u.fullName}</td>
                      <td className="px-4 py-3 text-text-light dark:text-text-dark">{u.village}</td>
                      <td className="px-4 py-3 text-text-light dark:text-text-dark">{u.progress}%</td>
                      <td className="px-4 py-3">
                        <span className="badge bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Active</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No users yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
