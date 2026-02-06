import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VoiceCallAssistant from '../components/VoiceCallAssistant';
import SchemeMap from '../components/SchemeMap';

import api from '../services/api';
import { 
  FaUser, FaBook, FaUniversity, FaLightbulb, FaGraduationCap, 
  FaChartLine, FaPen, FaFileImage, FaCheckCircle, FaTrophy, FaCoins, FaEnvelope, FaShoppingCart
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

  const progressPercent = (stats.lessonsCompleted / stats.totalLessons) * 100;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 w-full">
        {/* Hero Section with Indian Flag Border */}
        <div className="w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] p-[2px]">
          <div className="bg-white dark:bg-gray-800 px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                    <FaUser className="text-xl text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {currentLanguage === 'english' ? 'Welcome Back!' : 'स्वागत है!'}
                    </h1>
                    <p className="text-base text-gray-600 dark:text-gray-300">{user?.fullName || user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="text-center border border-gray-300 dark:border-gray-600 px-5 py-3 rounded-lg bg-white dark:bg-gray-800">
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{Math.floor(progressPercent)}%</p>
                  <p className="text-xs text-gray-500">
                    {currentLanguage === 'english' ? 'Progress' : 'प्रगति'}
                  </p>
                </div>
                
                <div className="text-center border border-gray-300 dark:border-gray-600 px-5 py-3 rounded-lg bg-white dark:bg-gray-800">
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{stats.badges.length}</p>
                  <p className="text-xs text-gray-500">
                    {currentLanguage === 'english' ? 'Badges' : 'बैज'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Full Width */}
        <div className="w-full px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Lessons Card */}
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800 hover:border-primary-500 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <FaGraduationCap className="text-2xl text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {currentLanguage === 'english' ? 'Lessons' : 'पाठ'}
                </h3>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.lessonsCompleted}</p>
                <p className="text-lg text-gray-400">/ {stats.totalLessons}</p>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Coins Card */}
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800 hover:border-primary-500 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <FaCoins className="text-2xl text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {currentLanguage === 'english' ? 'Coins' : 'सिक्के'}
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.coinsEarned}</p>
              <p className="text-xs text-gray-500">
                {currentLanguage === 'english' ? 'Earned by learning' : 'सीख कर अर्जित'}
              </p>
            </div>

            {/* Badges Card */}
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800 hover:border-primary-500 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <FaTrophy className="text-2xl text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {currentLanguage === 'english' ? 'Badges' : 'बैज'}
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.badges.length}</p>
              <p className="text-xs text-gray-500">
                {currentLanguage === 'english' ? 'Achievements' : 'उपलब्धियां'}
              </p>
            </div>
          </div>

    

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {currentLanguage === 'english' ? 'Quick Actions' : 'त्वरित क्रियाएं'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Link to="/user/learn" className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:border-primary-500 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaBook className="text-lg text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {currentLanguage === 'english' ? 'Start Learning' : 'सीखना शुरू करें'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {currentLanguage === 'english' ? 'Financial lessons' : 'वित्तीय पाठ'}
                    </p>
                  </div>
                </div>
              </Link>

              <Link to="/user/expenses" className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:border-primary-500 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaPen className="text-lg text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{strings.expenseTracker}</h3>
                    <p className="text-xs text-gray-500 truncate">
                      {currentLanguage === 'english' ? 'Track expenses' : 'खर्च ट्रैक करें'}
                    </p>
                  </div>
                </div>
              </Link>

              <Link to="/user/schemes" className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:border-primary-500 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaUniversity className="text-lg text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {currentLanguage === 'english' ? 'Schemes' : 'योजनाएं'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {currentLanguage === 'english' ? 'Government benefits' : 'सरकारी लाभ'}
                    </p>
                  </div>
                </div>
              </Link>

              <Link to="/user/ai-advisor" className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:border-primary-500 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaLightbulb className="text-lg text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {currentLanguage === 'english' ? 'AI Advisor' : 'AI सलाहकार'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {currentLanguage === 'english' ? 'Get answers' : 'उत्तर पाएं'}
                    </p>
                  </div>
                </div>
              </Link>

              <Link to="/user/document-scanner" className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:border-primary-500 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaFileImage className="text-lg text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {currentLanguage === 'english' ? 'Document Scanner' : 'दस्तावेज़ स्कैनर'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {currentLanguage === 'english' ? 'Scan docs' : 'स्कैन करें'}
                    </p>
                  </div>
                </div>
              </Link>

              <Link to="/user/money-translator" className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:border-primary-500 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-lg text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {currentLanguage === 'english' ? 'Money Translator' : 'पैसा समझाओ'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {currentLanguage === 'english' ? 'Understand bank SMS' : 'बैंक SMS समझें'}
                    </p>
                  </div>
                </div>
              </Link>
          <Link to="/user/banking-education" className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:border-primary-500 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaFileImage className="text-lg text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {currentLanguage === 'english' ? 'Banking Education' : 'बैंकिंग शिक्षा'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {currentLanguage === 'english' ? 'Learn about banking' : 'बैंकिंग के बारे में जानें'}
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/user/marketplace" className="border-2 border-green-500 dark:border-green-600 rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaShoppingCart className="text-lg text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {currentLanguage === 'english' ? '🎁 Marketplace' : '🎁 बाज़ार'}
                    </h3>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium truncate">
                      {currentLanguage === 'english' ? 'Redeem coins for benefits!' : 'सिक्कों को लाभ के लिए भुनाएं!'}
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/user/profile" className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:border-primary-500 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaUser className="text-lg text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {currentLanguage === 'english' ? 'Profile' : 'प्रोफाइल'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {currentLanguage === 'english' ? 'Manage account' : 'खाता प्रबंधन'}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Scheme Map Section */}
          <div className="mb-6">
            <SchemeMap />
          </div>

          {/* Voice Call AI Assistant */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {currentLanguage === 'english' ? '24/7 Voice Support' : '24/7 वॉइस सहायता'}
            </h2>
            <VoiceCallAssistant />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
