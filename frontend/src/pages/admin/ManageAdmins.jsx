import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { 
  FaUserShield, FaPlus, FaTrash, FaToggleOn, FaToggleOff,
  FaEnvelope, FaCalendar, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';

const ManageAdmins = () => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    fullName: '',
    email: '',
    password: '',
    village: 'Admin Panel'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    fetchAdmins();
  }, []);
  
  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admin/admins');
      setAdmins(response.data);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      setError('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await api.post('/admin/admins', newAdmin);
      setSuccess('Admin created successfully!');
      setNewAdmin({ fullName: '', email: '', password: '', village: 'Admin Panel' });
      setShowAddModal(false);
      fetchAdmins();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create admin');
    }
  };
  
  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    
    try {
      await api.delete(`/admin/admins/${adminId}`);
      setSuccess('Admin deleted successfully!');
      fetchAdmins();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to delete admin');
    }
  };
  
  const handleToggleStatus = async (adminId) => {
    try {
      await api.patch(`/admin/admins/${adminId}/toggle-status`);
      setSuccess('Admin status updated!');
      fetchAdmins();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update status');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <FaUserShield className="text-[#FF9933]" />
              {currentLanguage === 'english' ? 'Manage Admins' : 'व्यवस्थापक प्रबंधन'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentLanguage === 'english' 
                ? 'Add, remove, and manage admin users' 
                : 'व्यवस्थापक उपयोगकर्ताओं को जोड़ें, हटाएं और प्रबंधित करें'}
            </p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <FaPlus />
            {currentLanguage === 'english' ? 'Add New Admin' : 'नया व्यवस्थापक जोड़ें'}
          </button>
        </div>
        
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-center gap-2">
            <FaTimesCircle />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-center gap-2">
            <FaCheckCircle />
            {success}
          </div>
        )}
        
        {/* Admins List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#FF9933]/10 via-white/50 to-[#138808]/10 dark:from-[#FF9933]/20 dark:via-gray-700 dark:to-[#138808]/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                    {currentLanguage === 'english' ? 'Name' : 'नाम'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                    {currentLanguage === 'english' ? 'Email' : 'ईमेल'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                    {currentLanguage === 'english' ? 'Created' : 'बनाया गया'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                    {currentLanguage === 'english' ? 'Status' : 'स्थिति'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                    {currentLanguage === 'english' ? 'Actions' : 'क्रियाएं'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      Loading admins...
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No admins found
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr 
                      key={admin.id} 
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#FF9933] to-[#138808] rounded-full flex items-center justify-center">
                            <FaUserShield className="text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {admin.fullName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {admin.village}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <FaEnvelope className="text-[#138808]" />
                          {admin.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <FaCalendar className="text-[#FF9933]" />
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {admin.isActive ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                            <FaCheckCircle />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm font-semibold">
                            <FaTimesCircle />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(admin.id)}
                            disabled={user.id === admin.id}
                            className={`p-2 rounded-lg transition-all ${
                              admin.isActive
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={admin.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {admin.isActive ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            disabled={user.id === admin.id}
                            className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Add Admin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaUserShield className="text-[#FF9933]" />
                  {currentLanguage === 'english' ? 'Add New Admin' : 'नया व्यवस्थापक जोड़ें'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {currentLanguage === 'english' ? 'Full Name' : 'पूरा नाम'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdmin.fullName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF9933] dark:bg-gray-700 dark:text-white"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {currentLanguage === 'english' ? 'Email' : 'ईमेल'}
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF9933] dark:bg-gray-700 dark:text-white"
                    placeholder="admin@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {currentLanguage === 'english' ? 'Password' : 'पासवर्ड'}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF9933] dark:bg-gray-700 dark:text-white"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {currentLanguage === 'english' ? 'Cancel' : 'रद्द करें'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    {currentLanguage === 'english' ? 'Create Admin' : 'व्यवस्थापक बनाएं'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ManageAdmins;
