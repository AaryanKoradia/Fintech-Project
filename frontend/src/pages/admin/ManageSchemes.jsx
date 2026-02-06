/**
 * Manage Schemes Page (Admin)
 * Add, edit, and delete government schemes
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const ManageSchemes = () => {
  const { strings } = useLanguage();
  
  const [schemes, setSchemes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'agriculture',
    benefits: '',
    eligibility: '',
    howToApply: '',
  });
  
  useEffect(() => {
    fetchSchemes();
  }, []);
  
  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/schemes');
      setSchemes(response.data);
    } catch (error) {
      console.error('Failed to fetch schemes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddScheme = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/schemes', formData);
      fetchSchemes();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add scheme:', error);
    }
  };
  
  const handleDeleteScheme = async (id) => {
    if (!confirm('Are you sure you want to delete this scheme?')) return;
    
    try {
      await api.delete(`/admin/schemes/${id}`);
      fetchSchemes();
    } catch (error) {
      console.error('Failed to delete scheme:', error);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'agriculture',
      benefits: '',
      eligibility: '',
      howToApply: '',
    });
    setEditingScheme(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
              {strings.manageSchemes}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Total Schemes: {schemes.length}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            + Add New Scheme
          </button>
        </div>
        
        {/* Schemes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary-light dark:border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{strings.loading}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme, index) => (
              <div key={index} className="card">
                <div className="mb-3">
                  <span className="badge bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {scheme.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
                  {scheme.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {scheme.description}
                </p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingScheme(scheme);
                      setFormData(scheme);
                      setShowAddModal(true);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    {strings.edit}
                  </button>
                  <button
                    onClick={() => handleDeleteScheme(scheme.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    {strings.delete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Add/Edit Scheme Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddModal(false)}>
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">
                {editingScheme ? 'Edit Scheme' : 'Add New Scheme'}
              </h2>
              
              <form onSubmit={handleAddScheme} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    Scheme Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full"
                  >
                    <option value="agriculture">Agriculture</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="housing">Housing</option>
                    <option value="women">Women Empowerment</option>
                    <option value="business">Business & Loans</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    Benefits
                  </label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    required
                    rows={3}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    Eligibility
                  </label>
                  <textarea
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    required
                    rows={2}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    How to Apply
                  </label>
                  <textarea
                    value={formData.howToApply}
                    onChange={(e) => setFormData({ ...formData, howToApply: e.target.value })}
                    required
                    rows={3}
                    className="w-full"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button type="submit" className="flex-1 btn-primary">
                    {editingScheme ? 'Update Scheme' : 'Add Scheme'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 btn-secondary"
                  >
                    {strings.cancel}
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

export default ManageSchemes;
