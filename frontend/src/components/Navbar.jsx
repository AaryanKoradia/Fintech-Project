import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaUserCircle, FaLandmark } from 'react-icons/fa';
import { useEffect } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { strings, toggleLanguage, isEnglish } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // Initialize Google Translate after component mounts
  useEffect(() => {
    const initializeGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { 
            pageLanguage: 'en', 
            includedLanguages: 'en,hi,mr,ta,te,bn,gu,kn,ml,pa,ur',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google_translate_element'
        );
      }
    };

    // Try to initialize, or wait for the script to load
    if (window.googleTranslateElementInit) {
      initializeGoogleTranslate();
    } else {
      window.googleTranslateElementInit = initializeGoogleTranslate;
    }
  }, []);
  
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
      <div className="bg-white dark:bg-surface-dark border-b-2 border-primary dark:border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-soft-md ring-2 ring-authority transform group-hover:scale-105 transition-transform duration-200">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <FaLandmark className="text-2xl text-authority dark:text-authority" />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-authority dark:text-authority tracking-tight">{strings.appName}</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{strings.appTagline}</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-3">
              {/* Google Translate Widget with icon */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border-2 border-primary shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <div id="google_translate_element"></div>
              </div>
              
              <button onClick={toggleLanguage} className="px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all duration-200 shadow-soft border border-primary-hover min-h-[48px]" aria-label="Toggle Language">{isEnglish ? 'हिन्दी' : 'EN'}</button>
              <button onClick={toggleTheme} className="p-2.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-300 dark:border-gray-600 min-h-[48px]" aria-label="Toggle Theme">
                {isDarkMode ? (
                  <FaSun className="w-5 h-5 text-primary" />
                ) : (
                  <FaMoon className="w-5 h-5 text-authority" />
                )}
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'} className="flex items-center space-x-2 px-4 py-2 rounded-md bg-authority hover:bg-authority-hover text-white font-medium text-sm transition-all duration-200 shadow-soft min-h-[48px]">
                    <FaUserCircle className="w-4 h-4" />
                    <span>{strings.dashboard}</span>
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 rounded-md bg-white hover:bg-gray-50 text-primary border-2 border-primary font-semibold text-sm transition-all duration-200 shadow-soft min-h-[48px]">{strings.logout}</button>
                </div>
              ) : (
                <Link to="/login" className="px-5 py-2 rounded-md bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all duration-200 shadow-soft min-h-[48px]">{strings.login}</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
