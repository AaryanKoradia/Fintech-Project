import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [strings, setStrings] = useState(STRINGS_ENGLISH);

  // Load saved language preference
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const changeLanguage = async (language) => {
    try {
      const lang = language.toLowerCase();
      setCurrentLanguage(lang);
      setStrings(lang === 'hindi' ? STRINGS_HINDI : STRINGS_ENGLISH);
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const value = {
    currentLanguage,
    strings,
    changeLanguage,
    isHindi: currentLanguage === 'hindi',
    isEnglish: currentLanguage === 'english',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
