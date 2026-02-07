import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VoiceCallAssistant from '../components/VoiceCallAssistant';
import SchemeMap from '../components/SchemeMap';
import SiteTour from '../components/SiteTour';
import GovernmentNotifications from '../components/GovernmentNotifications';

import api from '../services/api';
import { 
  FaUser, FaBook, FaUniversity, FaLightbulb, FaGraduationCap, 
  FaChartLine, FaPen, FaFileImage, FaCheckCircle, FaTrophy, FaCoins, FaEnvelope, FaShoppingCart,
  FaArrowRight, FaStar, FaMedal, FaAward, FaQuestionCircle
} from 'react-icons/fa';

const UserDashboard = () => {
  const { user } = useAuth();
  const { strings, currentLanguage } = useLanguage();
  
  const [stats, setStats] = useState({
    lessonsCompleted: 0,
    totalLessons: 10,
    coinsEarned: 0,
    badges: [],
    progress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);
  
  useEffect(() => {
    fetchUserStats();
    const tourCompleted = localStorage.getItem('tourCompleted');
    if (!tourCompleted) {
      setTimeout(() => setShowTour(true), 1000);
    }
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

  const handleCloseTour = () => {
    setShowTour(false);
    localStorage.setItem('tourCompleted', 'true');
  };

  const handleStartTour = () => {
    setShowTour(true);
  };

  const progressPercent = (stats.lessonsCompleted / stats.totalLessons) * 100;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {showTour && <SiteTour onClose={handleCloseTour} />}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <FaUser className="text-2xl text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {currentLanguage === 'english' ? 'Welcome Back!' : 'स्वागत है!'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">{user?.fullName || user?.email}</p>
                </div>
              </div>

              <div className="flex gap-3 w-full lg:w-auto">
                <button
                  onClick={handleStartTour}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  title={currentLanguage === 'english' ? 'Take Site Tour' : 'साइट दौरा लें'}
                >
                  <FaQuestionCircle className="text-lg" />
                  <span className="hidden sm:inline text-sm font-medium">
                    {currentLanguage === 'english' ? 'Site Tour' : 'साइट दौरा'}
                  </span>
                </button>

                <div className="flex gap-4">
                  <div className="flex-1 lg:flex-none bg-gray-50 dark:bg-gray-700/50 rounded-lg px-5 py-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                      <FaChartLine className="text-blue-600 dark:text-blue-400" />
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {currentLanguage === 'english' ? 'Progress' : 'प्रगति'}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.floor(progressPercent)}%</p>
                  </div>

                  <div className="flex-1 lg:flex-none bg-gray-50 dark:bg-gray-700/50 rounded-lg px-5 py-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                      <FaMedal className="text-purple-600 dark:text-purple-400" />
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {currentLanguage === 'english' ? 'Badges' : 'बैज'}
                      </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.badges.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-8">
          <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700">
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FaGraduationCap className="text-xl text-blue-600 dark:text-blue-400" />
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {currentLanguage === 'english' ? 'Learning' : 'सीख रहे'}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {currentLanguage === 'english' ? 'Lessons' : 'पाठ'}
              </h3>

              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.lessonsCompleted}</p>
                <p className="text-xl text-gray-400">/ {stats.totalLessons}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{currentLanguage === 'english' ? 'Completion' : 'पूर्णता'}</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{Math.floor(progressPercent)}%</span>
                </div>
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700">
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <FaCoins className="text-xl text-amber-600 dark:text-amber-400" />
                </div>
                <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {currentLanguage === 'english' ? 'Rewards' : 'पुरस्कार'}
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {currentLanguage === 'english' ? 'Coins' : 'सिक्के'}
              </h3>

              <div className="mb-4">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.coinsEarned}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FaStar className="text-amber-500" />
                <span>{currentLanguage === 'english' ? 'Earned by learning' : 'सीख कर अर्जित'}</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 dark:border-gray-700">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <FaTrophy className="text-2xl text-white" />
                </div>
                <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    {currentLanguage === 'english' ? 'Achievements' : 'उपलब्धियां'}
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {currentLanguage === 'english' ? 'Badges' : 'बैज'}
              </h3>

              <div className="mb-4">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.badges.length}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FaAward className="text-purple-500" />
                <span>{currentLanguage === 'english' ? 'Unlocked rewards' : 'अनलॉक पुरस्कार'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentLanguage === 'english' ? 'Quick Actions' : 'त्वरित क्रियाएं'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/user/learn" className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/10 transition-all duration-300"></div>
              
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaBook className="text-lg text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">
                    {currentLanguage === 'english' ? 'Start Learning' : 'सीखना शुरू करें'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {currentLanguage === 'english' ? 'Financial lessons' : 'वित्तीय पाठ'}
                  </p>
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>{currentLanguage === 'english' ? 'Continue' : 'जारी रखें'}</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/user/expenses" className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300"></div>
              
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaPen className="text-lg text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">
                    {strings.expenseTracker}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {currentLanguage === 'english' ? 'Track expenses' : 'खर्च ट्रैक करें'}
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>{currentLanguage === 'english' ? 'Open' : 'खोलें'}</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/user/schemes" className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-indigo-500/10 transition-all duration-300"></div>
              
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaUniversity className="text-lg text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">
                    {currentLanguage === 'english' ? 'Schemes' : 'योजनाएं'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {currentLanguage === 'english' ? 'Government benefits' : 'सरकारी लाभ'}
                  </p>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>{currentLanguage === 'english' ? 'Explore' : 'खोजें'}</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/user/ai-advisor" className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 transition-all duration-300"></div>
              
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaLightbulb className="text-lg text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">
                    {currentLanguage === 'english' ? 'AI Advisor' : 'AI सलाहकार'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {currentLanguage === 'english' ? 'Get answers' : 'उत्तर पाएं'}
                  </p>
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>{currentLanguage === 'english' ? 'Ask AI' : 'AI से पूछें'}</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/user/document-scanner" className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-500">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-cyan-500/10 transition-all duration-300"></div>
              
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaFileImage className="text-lg text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">
                    {currentLanguage === 'english' ? 'Document Scanner' : 'दस्तावेज़ स्कैनर'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {currentLanguage === 'english' ? 'Scan docs' : 'स्कैन करें'}
                  </p>
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>{currentLanguage === 'english' ? 'Scan now' : 'अभी स्कैन करें'}</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/user/money-translator" className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-teal-500/0 group-hover:from-teal-500/5 group-hover:to-teal-500/10 transition-all duration-300"></div>
              
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaEnvelope className="text-lg text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">
                    {currentLanguage === 'english' ? 'Money Translator' : 'पैसा समझाओ'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {currentLanguage === 'english' ? 'Understand bank SMS' : 'बैंक SMS समझें'}
                  </p>
                  <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>{currentLanguage === 'english' ? 'Translate' : 'अनुवाद करें'}</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/user/marketplace" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-5 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-emerald-500 dark:border-emerald-600">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/20 transition-all duration-300"></div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full animate-pulse">{strings.newNotification}</span>
              </div>
              
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaShoppingCart className="text-lg text-white" />
                </div>
                <div className="flex-1 min-w-0 pr-12">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">
                    {currentLanguage === 'english' ? '🎁 Marketplace' : '🎁 बाज़ार'}
                  </h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
                    {currentLanguage === 'english' ? 'Redeem coins for benefits!' : 'सिक्कों को लाभ के लिए भुनाएं!'}
                  </p>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>{currentLanguage === 'english' ? 'Shop now' : 'अभी खरीदें'}</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/user/banking-education" className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/0 group-hover:from-pink-500/5 group-hover:to-pink-500/10 transition-all duration-300"></div>
              
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaUniversity className="text-lg text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">
                    {currentLanguage === 'english' ? 'Banking Education' : 'बैंकिंग शिक्षा'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {currentLanguage === 'english' ? 'Learn about banking' : 'बैंकिंग के बारे में जानें'}
                  </p>
                  <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>{currentLanguage === 'english' ? 'Learn' : 'सीखें'}</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/user/profile" className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/0 to-gray-500/0 group-hover:from-gray-500/5 group-hover:to-gray-500/10 transition-all duration-300"></div>
              
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaUser className="text-lg text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">
                    {currentLanguage === 'english' ? 'Profile' : 'प्रोफाइल'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {currentLanguage === 'english' ? 'Manage account' : 'खाता प्रबंधन'}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>{currentLanguage === 'english' ? 'View' : 'देखें'}</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>        </div>
        <div className="mb-8">
          <SchemeMap />
        </div>

        <div className="mb-8">
          <GovernmentNotifications />
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLanguage === 'english' ? '24/7 Voice Support' : '24/7 वॉइस सहायता'}
          </h2>
          <VoiceCallAssistant />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
