import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaUserCircle, FaLandmark } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { strings, toggleLanguage, isEnglish } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="sticky top-0 z-50 shadow-gov-lg">
      <div className="h-1.5 flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white dark:bg-gray-300"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>
      <div className="bg-white dark:bg-surface-dark border-b-2 border-[#138808] dark:border-[#1ea912]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF9933] via-white to-[#138808] rounded-full flex items-center justify-center shadow-gov-lg ring-2 ring-[#000080] transform group-hover:scale-105 transition-transform duration-200">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <FaLandmark className="text-2xl text-[#000080] dark:text-[#4169E1]" />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#000080] dark:text-[#4169E1] tracking-tight">{strings.appName}</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{strings.appTagline}</p>
              </div>
            </Link>
            <div className="flex items-center space-x-3">
              <button onClick={toggleLanguage} className="px-4 py-2 rounded-md bg-[#138808] hover:bg-[#0f6d06] text-white font-semibold text-sm transition-all duration-200 shadow-gov border border-[#0f6d06]" aria-label="Toggle Language">{isEnglish ? 'हिन्दी' : 'EN'}</button>
              <button onClick={toggleTheme} className="p-2.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-300 dark:border-gray-600" aria-label="Toggle Theme">
                {isDarkMode ? (
                  <FaSun className="w-5 h-5 text-[#FF9933]" />
                ) : (
                  <FaMoon className="w-5 h-5 text-[#000080]" />
                )}
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'} className="flex items-center space-x-2 px-4 py-2 rounded-md bg-[#000080] hover:bg-[#000066] text-white font-medium text-sm transition-all duration-200 shadow-gov">
                    <FaUserCircle className="w-4 h-4" />
                    <span>{strings.dashboard}</span>
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 rounded-md bg-white hover:bg-gray-50 text-[#138808] border-2 border-[#138808] font-semibold text-sm transition-all duration-200 shadow-gov">{strings.logout}</button>
                </div>
              ) : (
                <Link to="/login" className="px-5 py-2 rounded-md bg-[#FF9933] hover:bg-[#E68A2E] text-white font-semibold text-sm transition-all duration-200 shadow-gov">{strings.login}</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
