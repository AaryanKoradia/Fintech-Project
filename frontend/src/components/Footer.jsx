import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShieldAlt, FaLock, FaQuestionCircle } from 'react-icons/fa';

const Footer = () => {
  const { strings, currentLanguage } = useLanguage();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t-2 border-primary-600">
      <div className="px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              {strings.appName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {currentLanguage === 'english' 
                ? 'Empowering financial literacy for every Indian through education and technology.'
                : 'शिक्षा और प्रौद्योगिकी के माध्यम से हर भारतीय के लिए वित्तीय साक्षरता।'}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <FaShieldAlt className="text-primary-600" />
              <span>{currentLanguage === 'english' ? 'Secure & Trusted' : 'सुरक्षित और विश्वसनीय'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              {currentLanguage === 'english' ? 'Quick Links' : 'त्वरित लिंक'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/user/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  {currentLanguage === 'english' ? 'Dashboard' : 'डैशबोर्ड'}
                </Link>
              </li>
              <li>
                <Link to="/user/learning" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  {currentLanguage === 'english' ? 'Learning' : 'सीखना'}
                </Link>
              </li>
              <li>
                <Link to="/user/schemes" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  {currentLanguage === 'english' ? 'Govt Schemes' : 'सरकारी योजनाएं'}
                </Link>
              </li>
              <li>
                <Link to="/user/ai-advisor" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  {currentLanguage === 'english' ? 'AI Advisor' : 'AI सलाहकार'}
                </Link>
              </li>
              <li>
                <Link to="/user/expenses" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  {currentLanguage === 'english' ? 'Expense Tracker' : 'व्यय ट्रैकर'}
                </Link>
              </li>
              <li>
                <Link to="/user/profile" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  {currentLanguage === 'english' ? 'Profile' : 'प्रोफाइल'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              {currentLanguage === 'english' ? 'Support' : 'सहायता'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <FaQuestionCircle className="text-xs" />
                  {currentLanguage === 'english' ? 'Help Center' : 'सहायता केंद्र'}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <FaLock className="text-xs" />
                  {currentLanguage === 'english' ? 'Privacy Policy' : 'गोपनीयता नीति'}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <FaShieldAlt className="text-xs" />
                  {currentLanguage === 'english' ? 'Terms of Service' : 'सेवा की शर्तें'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              {currentLanguage === 'english' ? 'Contact Us' : 'संपर्क करें'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FaPhone className="text-primary-600 mt-1 text-xs flex-shrink-0" />
                <span>1800-XXX-XXXX<br/>{currentLanguage === 'english' ? '(Toll Free)' : '(टोल फ्री)'}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FaEnvelope className="text-primary-600 mt-1 text-xs flex-shrink-0" />
                <span>support@sakhi.in</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FaMapMarkerAlt className="text-primary-600 mt-1 text-xs flex-shrink-0" />
                <span>{currentLanguage === 'english' ? 'New Delhi, India' : 'नई दिल्ली, भारत'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {currentLanguage === 'english' ? 'Built By' : 'निर्मित'} <span className="text-primary-600">Team 3C</span>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {currentLanguage === 'english' ? 'Hackathon 2026' : 'हैकाथॉन 2026'}
              </p>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {currentLanguage === 'english' 
                ? 'Empowering financial inclusion through technology'
                : 'प्रौद्योगिकी के माध्यम से वित्तीय समावेशन को सशक्त बनाना'}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              © 2026 {strings.appName}. {currentLanguage === 'english' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}
            </p>
            <p className="flex items-center gap-2">
              Made with <FaHeart className="text-primary-600" /> for Bharat
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

