import { createContext, useContext, useState, useEffect } from 'react';
import STRINGS_ENGLISH from '../lang/string_english';
import STRINGS_HINDI from '../lang/string_hindi';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('hindi');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const strings = currentLanguage === 'english' ? STRINGS_ENGLISH : STRINGS_HINDI;
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'english' ? 'hindi' : 'english';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };
  
  const setLanguage = (lang) => {
    if (lang === 'english' || lang === 'hindi') {
      setCurrentLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
    }
  };
  
  const value = { currentLanguage, strings, toggleLanguage, setLanguage, isEnglish: currentLanguage === 'english', isHindi: currentLanguage === 'hindi', };
  
  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};
