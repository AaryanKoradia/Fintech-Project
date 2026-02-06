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
    setEditing(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 px-6 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{strings.profile}</h1>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-primary-50 border-2 border-primary-600 rounded-full flex items-center justify-center">
              <span className="text-primary-600 text-4xl font-bold">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || '?'}
              </span>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user?.fullName || user?.email}
              </h2>
              <p className="text-gray-600">
                {user?.email}
              </p>
              <p className="text-gray-600">
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
                <label className="block text-sm font-medium text-gray-800 mb-2">
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
                <button onClick={handleSave} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors">
                  {strings.save}
                </button>
                <button onClick={() => setEditing(false)} className="flex-1 bg-white border border-gray-300 hover:border-primary-600 text-gray-700 py-2 rounded-lg font-medium transition-colors">
                  {strings.cancel}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              {strings.editProfile}
            </button>
          )}
        </div>
        
        {/* Settings Card */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {strings.settings}
          </h3>
          
          <div className="space-y-4">
            {/* Language Setting */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h4 className="font-semibold text-gray-800">
                  {strings.language}
                </h4>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'english' ? 'English' : 'हिंदी'}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setLanguage('hindi')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentLanguage === 'hindi'
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => setLanguage('english')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentLanguage === 'english'
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
            
            {/* Dark Mode Setting */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h4 className="font-semibold text-gray-800">
                  {strings.darkMode}
                </h4>
                <p className="text-sm text-gray-600">
                  {isDarkMode ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-14 h-8 rounded-full transition-colors ${
                  isDarkMode ? 'bg-primary-600' : 'bg-gray-300'
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
