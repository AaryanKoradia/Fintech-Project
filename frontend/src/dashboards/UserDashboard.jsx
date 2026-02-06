import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { FaCoins,  FaTrophy,  FaUniversity, FaLightbulb, FaGraduationCap, FaChartLine, FaUser, FaBook } from 'react-icons/fa';

const UserDashboard = () => {
  const { user } = useAuth();
  const { strings } = useLanguage();
  
  const [stats, setStats] = useState({
    lessonsCompleted: 0,
    totalLessons: 10,
    coinsEarned: 0,
    badges: [],
    progress: 0,
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUserStats();
  }, []);
  
  const fetchUserStats = async () => {
    try {
      const response = await api.get('/users/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">{strings.welcomeBack}, {user?.fullName || user?.email}!</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{strings.continueJourney}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-emerald-100 dark:border-emerald-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{strings.lessonsCompleted}</h3>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaGraduationCap className="text-2xl text-white" />
              </div>
            </div>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">{stats.lessonsCompleted}/{stats.totalLessons}</p>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"  style={{ width: `${(stats.lessonsCompleted / stats.totalLessons) * 100}%` }}></div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-amber-100 dark:border-amber-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{strings.coinsEarned}</h3>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaCoins className="text-2xl text-white" />
              </div>
            </div>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{stats.coinsEarned}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">{strings.earnMore}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-purple-100 dark:border-purple-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{strings.badges}</h3>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaTrophy className="text-2xl text-white" />
              </div>
            </div>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.badges.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">{strings.achievements}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/user/learn" className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer p-6 border-2 border-emerald-100 dark:border-emerald-900">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaBook className="text-3xl text-white" />
            </div>
            <h3 className="text-center text-lg font-bold text-gray-800 dark:text-white">{strings.startLearning}</h3>
          </Link>
          <Link to="/user/schemes" className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer p-6 border-2 border-blue-100 dark:border-blue-900">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaUniversity className="text-3xl text-white" />
            </div>
            <h3 className="text-center text-lg font-bold text-gray-800 dark:text-white">
              {strings.browseSchemes}
            </h3>
          </Link>
          <Link to="/user/ai-advisor" className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer p-6 border-2 border-purple-100 dark:border-purple-900">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaLightbulb className="text-3xl text-white" />
            </div>
            <h3 className="text-center text-lg font-bold text-gray-800 dark:text-white">{strings.askAI}</h3>
          </Link>
          <Link to="/user/profile" className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer p-6 border-2 border-amber-100 dark:border-amber-900">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaUser className="text-3xl text-white" />
            </div>
            <h3 className="text-center text-lg font-bold text-gray-800 dark:text-white">{strings.profile}</h3>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
