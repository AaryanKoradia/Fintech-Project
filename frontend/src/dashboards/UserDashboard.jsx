import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { 
  FaCoins, FaTrophy, FaUniversity, FaLightbulb, FaGraduationCap, 
  FaChartLine, FaUser, FaBook, FaRocket, FaStar, FaFire,
  FaMedal, FaArrowRight, FaCheckCircle, FaCalendar, FaClock
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        <div className="relative mb-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF9933]/10 via-white/50 to-[#138808]/10 dark:from-[#FF9933]/5 dark:via-gray-800 dark:to-[#138808]/5 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-r from-[#FF9933] via-white to-[#138808] p-1 rounded-3xl shadow-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF9933] to-[#138808] rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                      <FaUser className="text-2xl text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] bg-clip-text text-transparent">
                        {currentLanguage === 'english' ? 'Welcome Back!' : 'स्वागत है!'}
                      </h1>
                      <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold">{user?.fullName || user?.email}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FaRocket className="text-[#FF9933]" />
                    {currentLanguage === 'english' 
                      ? 'Continue your financial literacy journey' 
                      : 'अपनी वित्तीय साक्षरता यात्रा जारी रखें'}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <div className="text-center bg-gradient-to-br from-[#FF9933]/10 to-[#FF9933]/5 dark:from-[#FF9933]/20 dark:to-[#FF9933]/10 px-6 py-4 rounded-2xl border-2 border-[#FF9933]/30">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaFire className="text-[#FF9933] text-xl" />
                      <p className="text-3xl font-bold text-[#FF9933]">{Math.floor(progressPercent)}%</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {currentLanguage === 'english' ? 'Progress' : 'प्रगति'}
                    </p>
                  </div>
                  
                  <div className="text-center bg-gradient-to-br from-[#138808]/10 to-[#138808]/5 dark:from-[#138808]/20 dark:to-[#138808]/10 px-6 py-4 rounded-2xl border-2 border-[#138808]/30">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaStar className="text-[#138808] text-xl" />
                      <p className="text-3xl font-bold text-[#138808]">{stats.badges.length}</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {currentLanguage === 'english' ? 'Badges' : 'बैज'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="relative group overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-emerald-300 dark:hover:border-emerald-600">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FaGraduationCap className="text-2xl text-white" />
                </div>
                <FaCheckCircle className="text-emerald-500 text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {currentLanguage === 'english' ? 'Lessons Completed' : 'पूर्ण पाठ'}
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {stats.lessonsCompleted}
                </p>
                <p className="text-2xl font-bold text-gray-400">/ {stats.totalLessons}</p>
              </div>
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-full transition-all duration-700 animate-pulse"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">
                {currentLanguage === 'english' ? 'Keep learning to unlock rewards' : 'पुरस्कार अनलॉक करने के लिए सीखते रहें'}
              </p>
            </div>
          </div>

          <div className="relative group overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-amber-300 dark:hover:border-amber-600">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <FaCoins className="text-2xl text-white" />
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <FaStar key={i} className="text-amber-400 text-sm animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {currentLanguage === 'english' ? 'Coins Earned' : 'अर्जित सिक्के'}
              </h3>
              <p className="text-5xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
                {stats.coinsEarned}
              </p>
              <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 px-4 py-2 rounded-full">
                <FaFire className="text-orange-500" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {currentLanguage === 'english' ? 'Earn more by learning' : 'सीख कर और अर्जित करें'}
                </span>
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FaTrophy className="text-2xl text-white" />
                </div>
                <FaMedal className="text-purple-500 text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {currentLanguage === 'english' ? 'Achievement Badges' : 'उपलब्धि बैज'}
              </h3>
              <p className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                {stats.badges.length}
              </p>
              <div className="flex gap-2">
                {stats.badges.length > 0 ? (
                  stats.badges.slice(0, 3).map((badge, i) => (
                    <div key={i} className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <FaMedal className="text-white text-sm" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentLanguage === 'english' ? 'Complete lessons to earn badges' : 'बैज अर्जित करने के लिए पाठ पूर्ण करें'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent flex items-center gap-3">
              <FaRocket className="text-[#FF9933]" />
              {currentLanguage === 'english' ? 'Quick Actions' : 'त्वरित क्रियाएं'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FaClock />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/user/learn" className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-emerald-200 dark:border-emerald-700 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-emerald-400/0 group-hover:from-emerald-400/10 group-hover:to-teal-400/10 transition-all"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-6 transition-transform">
                  <FaBook className="text-3xl text-white" />
                </div>
                <h3 className="text-center text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {currentLanguage === 'english' ? 'Start Learning' : 'सीखना शुरू करें'}
                </h3>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {currentLanguage === 'english' ? 'Explore financial lessons' : 'वित्तीय पाठ देखें'}
                </p>
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                  <span>{currentLanguage === 'english' ? 'Continue' : 'जारी रखें'}</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/user/schemes" className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-blue-200 dark:border-blue-700 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-400/0 group-hover:from-blue-400/10 group-hover:to-indigo-400/10 transition-all"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-6 transition-transform">
                  <FaUniversity className="text-3xl text-white" />
                </div>
                <h3 className="text-center text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {currentLanguage === 'english' ? 'Browse Schemes' : 'योजनाएं देखें'}
                </h3>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {currentLanguage === 'english' ? 'Government benefits for you' : 'आपके लिए सरकारी लाभ'}
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  <span>{currentLanguage === 'english' ? 'Explore' : 'खोजें'}</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/user/ai-advisor" className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-purple-200 dark:border-purple-700 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-400/0 group-hover:from-purple-400/10 group-hover:to-pink-400/10 transition-all"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-6 transition-transform">
                  <FaLightbulb className="text-3xl text-white" />
                </div>
                <h3 className="text-center text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {currentLanguage === 'english' ? 'AI Advisor' : 'AI सलाहकार'}
                </h3>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {currentLanguage === 'english' ? 'Get instant answers' : 'तुरंत उत्तर पाएं'}
                </p>
                <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm">
                  <span>{currentLanguage === 'english' ? 'Ask Now' : 'अभी पूछें'}</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/user/profile" className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-amber-200 dark:border-amber-700 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-400/0 group-hover:from-amber-400/10 group-hover:to-orange-400/10 transition-all"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-6 transition-transform">
                  <FaUser className="text-3xl text-white" />
                </div>
                <h3 className="text-center text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {currentLanguage === 'english' ? 'Your Profile' : 'आपकी प्रोफाइल'}
                </h3>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {currentLanguage === 'english' ? 'Manage your account' : 'अपना खाता प्रबंधित करें'}
                </p>
                <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                  <span>{currentLanguage === 'english' ? 'View' : 'देखें'}</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] p-1 rounded-3xl shadow-2xl">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
                  <FaChartLine className="text-[#FF9933]" />
                  {currentLanguage === 'english' ? 'Your Learning Journey' : 'आपकी सीखने की यात्रा'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentLanguage === 'english' 
                    ? 'Track your progress and achieve your financial goals' 
                    : 'अपनी प्रगति ट्रैक करें और अपने वित्तीय लक्ष्यों को प्राप्त करें'}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center px-6 py-4 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-2xl">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.lessonsCompleted}</p>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">
                    {currentLanguage === 'english' ? 'Lessons' : 'पाठ'}
                  </p>
                </div>
                <div className="text-center px-6 py-4 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 rounded-2xl">
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.coinsEarned}</p>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">
                    {currentLanguage === 'english' ? 'Coins' : 'सिक्के'}
                  </p>
                </div>
                <div className="text-center px-6 py-4 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-2xl">
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.badges.length}</p>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">
                    {currentLanguage === 'english' ? 'Badges' : 'बैज'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
