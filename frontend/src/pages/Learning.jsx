/**
 * Learning Page
 * Financial literacy lessons with gamification
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { 
  FaBook, 
  FaPiggyBank, 
  FaChartLine, 
  FaStore, 
  FaUniversity, 
  FaShieldAlt,
  FaCoins,
  FaGraduationCap
} from 'react-icons/fa';

const Learning = () => {
  const { strings } = useLanguage();
  
  const [lessons, setLessons] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  
  const categoryIcons = {
    all: FaBook,
    savings: FaPiggyBank,
    budgeting: FaChartLine,
    business: FaStore,
    banking: FaUniversity,
    insurance: FaShieldAlt
  };
  
  const categories = [
    { id: 'all', name: strings.all },
    { id: 'savings', name: strings.savings },
    { id: 'budgeting', name: strings.budgeting },
    { id: 'business', name: strings.business },
    { id: 'banking', name: strings.banking },
    { id: 'insurance', name: strings.insurance },
  ];
  
  useEffect(() => {
    fetchLessons();
  }, [selectedCategory]);
  
  const fetchLessons = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/lessons?category=${selectedCategory}`);
      setLessons(response.data);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
            {strings.financialLessons}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {strings.startLearning}
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.id];
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all flex items-center space-x-3 whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/50 scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-lg border-2 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <IconComponent className="text-2xl" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Lessons List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-emerald-500 dark:border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{strings.loading}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.length > 0 ? (
              lessons.map((lesson, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="flex items-center p-6">
                    {/* Left: Icon */}
                    <div className="flex-shrink-0 mr-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaGraduationCap className="text-4xl text-white" />
                      </div>
                    </div>
                    
                    {/* Middle: Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {lesson.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                        {lesson.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" 
                            style={{ width: `${lesson.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold min-w-[3rem] text-right">
                          {lesson.progress || 0}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Right: Action & Coins */}
                    <div className="flex-shrink-0 ml-6 flex flex-col items-end space-y-3">
                      {/* Start Button */}
                      <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap">
                        {lesson.progress > 0 ? strings.resumeLesson : strings.startLesson}
                      </button>
                      
                      {/* Coins */}
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 px-4 py-2 rounded-lg border-2 border-amber-200 dark:border-amber-700">
                        <FaCoins className="text-amber-500 dark:text-amber-400 text-xl" />
                        <span className="text-amber-700 dark:text-amber-300 font-bold text-lg">
                          {lesson.coins || 10}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No lessons available in this category
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Learning;
