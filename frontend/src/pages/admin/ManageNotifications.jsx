import React, { useState, useEffect } from 'react';
import { FaBell, FaTrash, FaUsers, FaPaperPlane, FaPhone } from 'react-icons/fa';
import api from '../../services/api';
import Loading from '../../components/Loading';
import { useLanguage } from '../../context/LanguageContext';

const ManageNotifications = () => {
  const { currentLanguage } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const [formData, setFormData] = useState({
    title_en: '',
    title_hi: '',
    message_en: '',
    message_hi: '',
    contact_number: '',
    target_users: ['all']
  });
  
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/admin/all');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedUsers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const notificationData = {
        ...formData,
        target_users: selectAll ? ['all'] : selectedUsers
      };

      await api.post('/notifications/', notificationData);
      
      alert(currentLanguage === 'english' 
        ? 'Notification sent successfully!' 
        : 'सूचना सफलतापूर्वक भेजी गई!');
      
      // Reset form
      setFormData({
        title_en: '',
        title_hi: '',
        message_en: '',
        message_hi: '',
        contact_number: '',
        target_users: ['all']
      });
      setSelectAll(true);
      setSelectedUsers([]);
      
      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      alert(currentLanguage === 'english' 
        ? 'Error sending notification' 
        : 'सूचना भेजने में त्रुटि');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm(currentLanguage === 'english' 
      ? 'Are you sure you want to delete this notification?' 
      : 'क्या आप वाकई इस सूचना को हटाना चाहते हैं?')) {
      return;
    }

    try {
      await api.delete(`/notifications/${notificationId}`);
      fetchNotifications();
      alert(currentLanguage === 'english' 
        ? 'Notification deleted successfully' 
        : 'सूचना सफलतापूर्वक हटाई गई');
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert(currentLanguage === 'english' 
        ? 'Error deleting notification' 
        : 'सूचना हटाने में त्रुटि');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <FaBell className="text-orange-600" />
          {currentLanguage === 'english' ? 'Manage Notifications' : 'सूचनाएं प्रबंधित करें'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {currentLanguage === 'english' 
            ? 'Send notifications to users about new schemes and updates' 
            : 'नई योजनाओं और अपडेट के बारे में उपयोगकर्ताओं को सूचनाएं भेजें'}
        </p>
      </div>

      {/* Create Notification Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FaPaperPlane className="text-orange-600" />
          {currentLanguage === 'english' ? 'Create New Notification' : 'नई सूचना बनाएं'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* English Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Title (English) *
              </label>
              <input
                type="text"
                name="title_en"
                value={formData.title_en}
                onChange={handleInputChange}
                required
                placeholder={strings.placeholderNotificationTitle}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                शीर्षक (हिंदी) *
              </label>
              <input
                type="text"
                name="title_hi"
                value={formData.title_hi}
                onChange={handleInputChange}
                required
                placeholder="जैसे, नई योजना उपलब्ध!"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Message Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Message (English) *
              </label>
              <textarea
                name="message_en"
                value={formData.message_en}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder={strings.placeholderNotificationMessage}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                संदेश (हिंदी) *
              </label>
              <textarea
                name="message_hi"
                value={formData.message_hi}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="हिंदी में अधिसूचना संदेश दर्ज करें..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <FaPhone className="text-orange-600" />
              {currentLanguage === 'english' ? 'Contact Number (Optional)' : 'संपर्क नंबर (वैकल्पिक)'}
            </label>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              placeholder={strings.placeholderContactNumber}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Target Users */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <FaUsers className="text-orange-600" />
              {currentLanguage === 'english' ? 'Target Users' : 'लक्षित उपयोगकर्ता'}
            </label>
            
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {currentLanguage === 'english' ? 'Send to All Users' : 'सभी उपयोगकर्ताओं को भेजें'}
                </span>
              </label>
            </div>

            {!selectAll && (
              <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <div className="space-y-2">
                  {users.map(user => (
                    <label key={user._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleUserSelection(user._id)}
                        className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {user.name} ({user.email})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaPaperPlane />
              {sending 
                ? (currentLanguage === 'english' ? 'Sending...' : 'भेजा जा रहा है...') 
                : (currentLanguage === 'english' ? 'Send Notification' : 'सूचना भेजें')}
            </button>
          </div>
        </form>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {currentLanguage === 'english' ? 'Sent Notifications' : 'भेजी गई सूचनाएं'}
        </h2>
        
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {currentLanguage === 'english' ? 'No notifications sent yet' : 'अभी तक कोई सूचना नहीं भेजी गई'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div key={notification.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                      {currentLanguage === 'english' ? notification.title_en : notification.title_hi}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {currentLanguage === 'english' ? notification.message_en : notification.message_hi}
                    </p>
                    {notification.contact_number && (
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium flex items-center gap-2">
                        <FaPhone className="text-xs" />
                        {notification.contact_number}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title={currentLanguage === 'english' ? 'Delete' : 'हटाएं'}
                  >
                    <FaTrash />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaUsers />
                    {notification.target_users.includes('all') 
                      ? (currentLanguage === 'english' ? 'All Users' : 'सभी उपयोगकर्ता')
                      : `${notification.target_users.length} ${currentLanguage === 'english' ? 'users' : 'उपयोगकर्ता'}`}
                  </span>
                  <span>•</span>
                  <span>{new Date(notification.created_at).toLocaleString()}</span>
                  <span>•</span>
                  <span>
                    {currentLanguage === 'english' ? 'Read by' : 'पढ़ा गया'}: {notification.read_by.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageNotifications;
