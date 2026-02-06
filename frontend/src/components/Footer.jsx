/**
 * Footer Component
 * Indian Government Portal Style Footer
 */

import { useLanguage } from '../context/LanguageContext';
import { 
  FaHeart, FaLandmark, FaCode, FaGithub, FaCoffee, 
  FaTwitter, FaLinkedin, FaEnvelope, FaMapMarkerAlt,
  FaPhone, FaShieldAlt, FaInfoCircle, FaFileAlt, FaLock,
  FaHandshake, FaUsers, FaChartLine, FaRocket, FaTrophy
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { strings, currentLanguage } = useLanguage();
  
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-[#000080] to-gray-900 dark:from-gray-950 dark:via-[#000050] dark:to-gray-950 text-white mt-auto border-t-4 border-[#FF9933] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#FF9933] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#138808] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#FF9933] text-xl font-bold animate-pulse">
              <FaLandmark className="w-6 h-6" />
              <span>{strings.appName}</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {currentLanguage === 'english' 
                ? 'Empowering rural India with financial literacy and digital tools for a better tomorrow.'
                : 'वित्तीय साक्षरता और डिजिटल उपकरणों के साथ ग्रामीण भारत को सशक्त बनाना।'}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#138808] bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-[#138808]/30 hover:border-[#138808] transition-all">
                <FaShieldAlt className="w-4 h-4" />
                <span className="text-xs font-semibold">
                  {currentLanguage === 'english' ? 'Government Certified' : 'सरकारी प्रमाणित'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#FF9933] bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-[#FF9933]/30 hover:border-[#FF9933] transition-all">
                <FaTrophy className="w-4 h-4" />
                <span className="text-xs font-semibold">
                  {currentLanguage === 'english' ? 'Award Winning Platform' : 'पुरस्कार विजेता मंच'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#FF9933] flex items-center gap-2 border-b border-[#FF9933]/30 pb-2">
              <FaRocket className="w-5 h-5" />
              {currentLanguage === 'english' ? 'Quick Links' : 'त्वरित लिंक'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/learning" className="text-gray-300 hover:text-[#138808] hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full group-hover:bg-[#138808] group-hover:scale-150 transition-all"></span>
                  {currentLanguage === 'english' ? 'Financial Learning' : 'वित्तीय शिक्षा'}
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="text-gray-300 hover:text-[#138808] hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full group-hover:bg-[#138808] group-hover:scale-150 transition-all"></span>
                  {currentLanguage === 'english' ? 'Government Schemes' : 'सरकारी योजनाएं'}
                </Link>
              </li>
              <li>
                <Link to="/ai-advisor" className="text-gray-300 hover:text-[#138808] hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full group-hover:bg-[#138808] group-hover:scale-150 transition-all"></span>
                  {currentLanguage === 'english' ? 'AI Advisor' : 'AI सलाहकार'}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-[#138808] hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full group-hover:bg-[#138808] group-hover:scale-150 transition-all"></span>
                  {currentLanguage === 'english' ? 'Dashboard' : 'डैशबोर्ड'}
                </Link>
              </li>
            </ul>
            <div className="pt-2 border-t border-white/10">
              <h4 className="text-xs font-semibold text-gray-400 mb-2">
                {currentLanguage === 'english' ? 'Legal' : 'कानूनी'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                    <FaFileAlt className="w-3 h-3" />
                    {currentLanguage === 'english' ? 'Privacy Policy' : 'गोपनीयता नीति'}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                    <FaLock className="w-3 h-3" />
                    {currentLanguage === 'english' ? 'Terms of Service' : 'सेवा की शर्तें'}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#FF9933] flex items-center gap-2 border-b border-[#FF9933]/30 pb-2">
              <FaEnvelope className="w-5 h-5" />
              {currentLanguage === 'english' ? 'Contact Us' : 'संपर्क करें'}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors group">
                <FaMapMarkerAlt className="w-4 h-4 text-[#138808] mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>Rural Innovation Hub, New Delhi, India</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300 group">
                <FaEnvelope className="w-4 h-4 text-[#138808] group-hover:scale-110 transition-transform" />
                <a href="mailto:support@finliteracy.gov.in" className="hover:text-[#FF9933] transition-colors">
                  support@finliteracy.gov.in
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-300 group">
                <FaPhone className="w-4 h-4 text-[#138808] group-hover:scale-110 transition-transform" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </li>
            </ul>
            <div className="pt-4">
              <div className="bg-gradient-to-r from-[#FF9933]/20 to-[#138808]/20 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <FaInfoCircle className="w-4 h-4 text-[#FF9933]" />
                  <span>
                    {currentLanguage === 'english' 
                      ? 'Available 24/7 for your queries'
                      : '24/7 आपके प्रश्नों के लिए उपलब्ध'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Team & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#FF9933] flex items-center gap-2 border-b border-[#FF9933]/30 pb-2">
              <FaUsers className="w-5 h-5" />
              {currentLanguage === 'english' ? 'Built By' : 'निर्मित'}
            </h3>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-[#FF9933]/20 via-white/10 to-[#138808]/20 p-4 rounded-lg backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent">
                    Team 3C
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-300">
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition-colors">
                      <FaCode className="text-[#FF9933]" /> Code
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition-colors">
                      <FaGithub className="text-white" /> Commit
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition-colors">
                      <FaCoffee className="text-[#138808]" /> Coffee
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 italic pt-2">
                    {currentLanguage === 'english' 
                      ? 'Brewing innovation, one commit at a time'
                      : 'एक समय में एक कमिट, नवाचार बनाना'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-[#1DA1F2]/20 to-[#1DA1F2]/5 hover:from-[#1DA1F2] hover:to-[#1DA1F2] border border-[#1DA1F2]/30 hover:border-[#1DA1F2] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 group">
                <FaTwitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-[#0077B5]/20 to-[#0077B5]/5 hover:from-[#0077B5] hover:to-[#0077B5] border border-[#0077B5]/30 hover:border-[#0077B5] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 group">
                <FaLinkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-gray-700/20 to-gray-700/5 hover:from-gray-700 hover:to-gray-700 border border-gray-700/30 hover:border-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 group">
                <FaGithub className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
              <FaHandshake className="w-4 h-4 text-[#138808]" />
              <span>{currentLanguage === 'english' ? 'Hackathon 2026' : 'हैकाथॉन 2026'}</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
          <div className="text-center space-y-1 group hover:scale-105 transition-transform">
            <FaUsers className="w-6 h-6 text-[#FF9933] mx-auto group-hover:animate-pulse" />
            <div className="text-2xl font-bold text-white">10K+</div>
            <div className="text-xs text-gray-400">{currentLanguage === 'english' ? 'Active Users' : 'सक्रिय उपयोगकर्ता'}</div>
          </div>
          <div className="text-center space-y-1 group hover:scale-105 transition-transform">
            <FaChartLine className="w-6 h-6 text-[#138808] mx-auto group-hover:animate-pulse" />
            <div className="text-2xl font-bold text-white">50K+</div>
            <div className="text-xs text-gray-400">{currentLanguage === 'english' ? 'Lessons Completed' : 'पूर्ण पाठ'}</div>
          </div>
          <div className="text-center space-y-1 group hover:scale-105 transition-transform">
            <FaLandmark className="w-6 h-6 text-[#FF9933] mx-auto group-hover:animate-pulse" />
            <div className="text-2xl font-bold text-white">100+</div>
            <div className="text-xs text-gray-400">{currentLanguage === 'english' ? 'Govt Schemes' : 'सरकारी योजनाएं'}</div>
          </div>
          <div className="text-center space-y-1 group hover:scale-105 transition-transform">
            <FaShieldAlt className="w-6 h-6 text-[#138808] mx-auto group-hover:animate-pulse" />
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-gray-400">{currentLanguage === 'english' ? 'Secure & Safe' : 'सुरक्षित'}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p className="flex items-center gap-2">
            © 2026 {strings.appName}. {currentLanguage === 'english' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}
          </p>
          <p className="flex items-center gap-2">
            Made with <FaHeart className="w-4 h-4 text-[#FF9933] animate-pulse" /> for Bharat
          </p>
          <p className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-[#138808]/20 border border-[#138808]/30 rounded">
              {currentLanguage === 'english' ? 'Digital India Initiative' : 'डिजिटल इंडिया पहल'}
            </span>
          </p>
        </div>
      </div>
      
      {/* Bottom Tricolor Strip with Animation */}
      <div className="h-2 flex relative overflow-hidden">
        <div className="flex-1 bg-[#FF9933] animate-pulse"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808] animate-pulse"></div>
      </div>
    </footer>
  );
};

export default Footer;
