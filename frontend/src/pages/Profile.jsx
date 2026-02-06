import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const { user, logout } = useAuth();
  const { strings, currentLanguage, setLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    village: user?.village || '',
  });
  
  const handleSave = () => {
    // TODO: Call API to update profile
    setEditing(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
            {strings.profile}
          </h1>
        </div>
        
        {/* Profile Card */}
        <div className="card mb-6">
          <div className="flex items-center space-x-4 mb-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-full flex items-center justify-center">
              <span className="text-white text-4xl font-bold">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || '?'}
              </span>
            </div>
            
            {/* User Info */}
            <div>
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
                {user?.fullName || user?.email}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                📍 {user?.village}
              </p>
            </div>
          </div>
          
          {/* Edit Profile Section */}
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  {strings.fullName}
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  {strings.village}
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full"
                />
              </div>
              
              <div className="flex space-x-4">
                <button onClick={handleSave} className="btn-primary flex-1">
                  {strings.save}
                </button>
                <button onClick={() => setEditing(false)} className="btn-secondary flex-1">
                  {strings.cancel}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-primary">
              {strings.editProfile}
            </button>
          )}
        </div>
        
        {/* Settings Card */}
        <div className="card mb-6">
          <h3 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">
            {strings.settings}
          </h3>
          
          <div className="space-y-4">
            {/* Language Setting */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-semibold text-text-light dark:text-text-dark">
                  {strings.language}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentLanguage === 'english' ? 'English' : 'हिंदी'}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setLanguage('hindi')}
                  className={`px-4 py-2 rounded-lg ${
                    currentLanguage === 'hindi'
                      ? 'bg-primary-light dark:bg-primary-dark text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => setLanguage('english')}
                  className={`px-4 py-2 rounded-lg ${
                    currentLanguage === 'english'
                      ? 'bg-primary-light dark:bg-primary-dark text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
            
            {/* Dark Mode Setting */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-semibold text-text-light dark:text-text-dark">
                  {strings.darkMode}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isDarkMode ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-14 h-8 rounded-full transition-colors ${
                  isDarkMode ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-lg font-medium transition-all"
        >
          {strings.logout}
        </button>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
