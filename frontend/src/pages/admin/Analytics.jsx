import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const Analytics = () => {
  const { strings } = useLanguage();
  
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    averageProgress: 0,
    totalLessonsCompleted: 0,
    totalCoinsEarned: 0,
    popularLessons: [],
    villageStats: [],
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAnalytics();
  }, []);
  
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">{strings.analytics}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Platform Insights and Metrics</p>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary-light dark:border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{strings.loading}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Users</h3>
                <p className="text-4xl font-bold text-text-light dark:text-text-dark">{analytics.totalUsers}</p>
              </div>
              <div className="card">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Active Users</h3>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">{analytics.activeUsers}</p>
              </div>
              <div className="card">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Progress</h3>
                <p className="text-4xl font-bold text-primary dark:text-primary">{analytics.averageProgress}%</p>
              </div>
              <div className="card">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Lessons Completed</h3>
                <p className="text-4xl font-bold text-primary dark:text-primary">{analytics.totalLessonsCompleted}</p>
              </div>
            </div>
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">Popular Lessons</h2>
              <div className="space-y-4">
                {analytics.popularLessons.length > 0 ? (
                  analytics.popularLessons.map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-light dark:bg-primary-dark rounded-lg flex items-center justify-center text-white font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-text-light dark:text-text-dark">{lesson.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.completions} completions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-text-light dark:text-text-dark">{lesson.completionRate}%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">completion rate</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">No data available yet</p>
                )}
              </div>
            </div>
            <div className="card">
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">Village-wise Statistics</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Village</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Users</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Active</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Avg Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.villageStats.length > 0 ? (
                      analytics.villageStats.map((village, index) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="px-4 py-3 font-medium text-text-light dark:text-text-dark">
                            {village.name}
                          </td>
                          <td className="px-4 py-3 text-text-light dark:text-text-dark">
                            {village.totalUsers}
                          </td>
                          <td className="px-4 py-3 text-text-light dark:text-text-dark">
                            {village.activeUsers}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary-light dark:bg-primary-dark h-2 rounded-full" 
                                  style={{ width: `${village.avgProgress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-text-light dark:text-text-dark">
                                {village.avgProgress}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          No data available yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Analytics;
