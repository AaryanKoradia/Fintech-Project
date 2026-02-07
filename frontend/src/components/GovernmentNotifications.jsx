import React, { useState, useEffect } from 'react';
import { FaBell, FaPhone, FaCheckCircle, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const GovernmentNotifications = () => {
  const { currentLanguage, strings } = useLanguage();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/user');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/user/unread-count');
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      fetchUnreadCount();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const openNotification = async (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    
    // Mark as read if not already read
    if (user && !notification.read_by.includes(user.id)) {
      await markAsRead(notification.id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
  };

  const isUnread = (notification) => {
    if (!user) return false;
    return !notification.read_by.includes(user.id);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="relative">
              <FaBell className="text-primary text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            {currentLanguage === 'english' ? 'Notifications from Government' : 'सरकार से सूचनाएं'}
          </h2>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <FaBell className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {currentLanguage === 'english' ? 'No notifications at the moment' : 'इस समय कोई सूचना नहीं'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 5).map(notification => (
              <div
                key={notification.id}
                onClick={() => openNotification(notification)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  isUnread(notification)
                    ? 'bg-primary/5 dark:bg-primary/20 border border-primary/20 dark:border-primary/80 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/70'
                    : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${
                        isUnread(notification) 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {currentLanguage === 'english' ? notification.title_en : notification.title_hi}
                      </h3>
                      {isUnread(notification) && (
                        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {strings.newNotification}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs line-clamp-2 ${
                      isUnread(notification) 
                        ? 'text-gray-700 dark:text-gray-200' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {currentLanguage === 'english' ? notification.message_en : notification.message_hi}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {new Date(notification.created_at).toLocaleDateString(
                        currentLanguage === 'english' ? 'en-US' : 'hi-IN',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </p>
                  </div>
                  {!isUnread(notification) && (
                    <FaCheckCircle className="text-green-500 text-sm ml-2 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
            
            {notifications.length > 5 && (
              <button className="w-full py-2 text-primary dark:text-primary font-semibold hover:bg-primary/5 dark:hover:bg-primary/20 rounded-lg transition-colors">
                {currentLanguage === 'english' 
                  ? `View all ${notifications.length} notifications` 
                  : `सभी ${notifications.length} सूचनाएं देखें`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Notification Modal */}
      {showModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-primary text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaBell className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold leading-tight">
                      {currentLanguage === 'english' 
                        ? selectedNotification.title_en 
                        : selectedNotification.title_hi}
                    </h3>
                    <p className="text-sm text-blue-100 mt-1">
                      {new Date(selectedNotification.created_at).toLocaleDateString(
                        currentLanguage === 'english' ? 'en-US' : 'hi-IN',
                        { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors ml-2"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
                  {currentLanguage === 'english' 
                    ? selectedNotification.message_en 
                    : selectedNotification.message_hi}
                </p>
              </div>

              {selectedNotification.contact_number && (
                <div className="mt-6 bg-primary/5 dark:bg-primary/20 border-l-4 border-primary dark:border-primary p-4 rounded-r-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/50 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaPhone className="text-primary dark:text-primary text-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {currentLanguage === 'english' ? 'Contact Number' : 'संपर्क नंबर'}
                      </p>
                      <a 
                        href={`tel:${selectedNotification.contact_number}`}
                        className="text-lg font-bold text-primary dark:text-primary hover:underline"
                      >
                        {selectedNotification.contact_number}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover dark:bg-primary dark:hover:bg-primary-hover text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {currentLanguage === 'english' ? 'Close' : 'बंद करें'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GovernmentNotifications;
