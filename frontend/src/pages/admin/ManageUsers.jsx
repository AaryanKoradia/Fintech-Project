/**
 * Manage Users Page (Admin)
 * View, filter, and manage users
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { FaCoins } from 'react-icons/fa';

const ManageUsers = () => {
  const { strings } = useLanguage();
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  useEffect(() => {
    filterUsers();
  }, [searchQuery, filter, users]);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filterUsers = () => {
    let filtered = users;
    
    // Filter by activity status
    if (filter === 'active') {
      filtered = filtered.filter(u => u.isActive);
    } else if (filter === 'inactive') {
      filtered = filtered.filter(u => !u.isActive);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(u =>
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredUsers(filtered);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
            {strings.manageUsers}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {strings.totalUsers}: {users.length}
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={strings.search + ' users...'}
                className="w-full pl-12"
              />
              <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full"
            >
              <option value="all">{strings.all}</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="card overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary-light dark:border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">{strings.loading}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Village</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Coins</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-light dark:text-text-dark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-4 text-text-light dark:text-text-dark font-medium">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-4 text-text-light dark:text-text-dark">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 text-text-light dark:text-text-dark">
                        {user.village}
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary-light dark:bg-primary-dark h-2 rounded-full" 
                            style={{ width: `${user.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {user.progress || 0}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-text-light dark:text-text-dark">
                        <div className="flex items-center space-x-2">
                          <FaCoins className="text-amber-500" />
                          <span className="font-semibold">{user.coins || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`badge ${
                          user.isActive 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-primary-light dark:text-primary-dark hover:underline text-sm font-medium">
                          {strings.viewDetails}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ManageUsers;
