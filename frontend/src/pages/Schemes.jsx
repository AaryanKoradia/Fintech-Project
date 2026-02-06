/**
 * Government Schemes Page
 * Browse and search government schemes with eligibility filters
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const Schemes = () => {
  const { strings } = useLanguage();
  
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  const categories = [
    { id: 'all', name: strings.all },
    { id: 'agriculture', name: 'Agriculture' },
    { id: 'education', name: 'Education' },
    { id: 'health', name: 'Health' },
    { id: 'housing', name: 'Housing' },
    { id: 'women', name: 'Women Empowerment' },
    { id: 'business', name: 'Business & Loans' },
  ];
  
  useEffect(() => {
    fetchSchemes();
  }, []);
  
  useEffect(() => {
    filterSchemes();
  }, [searchQuery, categoryFilter, schemes]);
  
  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/schemes');
      setSchemes(response.data);
      setFilteredSchemes(response.data);
    } catch (error) {
      console.error('Failed to fetch schemes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filterSchemes = () => {
    let filtered = schemes;
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(s => s.category === categoryFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredSchemes(filtered);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
            {strings.schemes}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {strings.eligibleSchemes}
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={strings.search + '...'}
              className="w-full pl-12"
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-primary-light dark:bg-primary-dark text-white'
                    : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Schemes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary-light dark:border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{strings.loading}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.length > 0 ? (
              filteredSchemes.map((scheme, index) => (
                <div 
                  key={index} 
                  className="card hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedScheme(scheme)}
                >
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="badge bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {scheme.category}
                    </span>
                  </div>
                  
                  {/* Scheme Name */}
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-3">
                    {scheme.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {scheme.description}
                  </p>
                  
                  {/* Benefits */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-text-light dark:text-text-dark mb-1">
                      {strings.benefits}:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {scheme.benefits}
                    </p>
                  </div>
                  
                  {/* View Details Button */}
                  <button className="w-full btn-primary">
                    {strings.viewDetails}
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No schemes found
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Scheme Detail Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedScheme(null)}>
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button 
                onClick={() => setSelectedScheme(null)}
                className="float-right btn-icon bg-gray-200 dark:bg-gray-700"
              >
                ✕
              </button>
              
              {/* Scheme Details */}
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                {selectedScheme.name}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-text-light dark:text-text-dark mb-2">{strings.schemeDetails}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedScheme.description}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-text-light dark:text-text-dark mb-2">{strings.benefits}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedScheme.benefits}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-text-light dark:text-text-dark mb-2">{strings.eligibility}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedScheme.eligibility}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-text-light dark:text-text-dark mb-2">{strings.howToApply}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedScheme.howToApply}</p>
                </div>
                
                <button className="w-full btn-primary">
                  {strings.applyNow}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Schemes;
