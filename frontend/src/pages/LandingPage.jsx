/**
 * Landing Page
 * Indian Government Portal Style - Professional and Accessible
 */

import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FaBook, FaLandmark, FaLightbulb, FaRupeeSign, FaGraduationCap, 
  FaUsers, FaChartLine, FaSeedling, FaHandHoldingUsd, FaUserGraduate,
  FaHome, FaBriefcase, FaHeart, FaShieldAlt, FaRocket, FaGlobe,
  FaComments, FaRobot, FaFlag, FaStar, FaBriefcaseMedical
} from 'react-icons/fa';

const LandingPage = () => {
  const { strings, currentLanguage } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  
  const dashboardLink = isAuthenticated 
    ? (user?.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard')
    : '/signup';
  
  const govSchemes = [
    {
      name: currentLanguage === 'english' ? 'PM-KISAN' : 'पीएम-किसान',
      nameEn: 'Pradhan Mantri Kisan Samman Nidhi',
      nameHi: 'प्रधानमंत्री किसान सम्मान निधि',
      amount: '₹6,000/year',
      beneficiaries: '11 Cr+ Farmers',
      icon: FaSeedling,
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: currentLanguage === 'english' ? 'PMJDY' : 'पीएमजेडीवाई',
      nameEn: 'PM Jan Dhan Yojana',
      nameHi: 'प्रधानमंत्री जन धन योजना',
      amount: '50 Cr+ Accounts',
      beneficiaries: 'Zero Balance Banking',
      icon: FaLandmark,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      name: currentLanguage === 'english' ? 'MUDRA Loan' : 'मुद्रा लोन',
      nameEn: 'Micro Units Development',
      nameHi: 'सूक्ष्म इकाइयों विकास',
      amount: '₹10 Lakh',
      beneficiaries: 'Small Business Loan',
      icon: FaBriefcase,
      color: 'from-orange-500 to-red-600'
    },
    {
      name: currentLanguage === 'english' ? 'Scholarship' : 'छात्रवृत्ति',
      nameEn: 'NSP - National Scholarship',
      nameHi: 'राष्ट्रीय छात्रवृत्ति पोर्टल',
      amount: '1 Cr+ Students',
      beneficiaries: 'Education Support',
      icon: FaUserGraduate,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const impactStats = [
    {
      number: '130 Cr+',
      label: currentLanguage === 'english' ? 'Population' : 'जनसंख्या',
      icon: FaUsers,
      color: 'text-[#FF9933]'
    },
    {
      number: '65%',
      label: currentLanguage === 'english' ? 'Rural India' : 'ग्रामीण भारत',
      icon: FaHome,
      color: 'text-[#138808]'
    },
    {
      number: '₹50L Cr',
      label: currentLanguage === 'english' ? 'Digital Transactions' : 'डिजिटल लेनदेन',
      icon: FaChartLine,
      color: 'text-[#000080]'
    },
    {
      number: '45 Cr+',
      label: currentLanguage === 'english' ? 'Youth (15-35)' : 'युवा (15-35)',
      icon: FaGraduationCap,
      color: 'text-[#FF9933]'
    }
  ];

  const studentSchemes = [
    {
      title: currentLanguage === 'english' ? 'Pre-Matric Scholarship' : 'प्री-मैट्रिक छात्रवृत्ति',
      desc: currentLanguage === 'english' ? 'For Class 9-10 students' : 'कक्षा 9-10 के छात्रों के लिए',
      amount: '₹3,000-12,000',
      icon: FaBook
    },
    {
      title: currentLanguage === 'english' ? 'Post-Matric Scholarship' : 'पोस्ट-मैट्रिक छात्रवृत्ति',
      desc: currentLanguage === 'english' ? 'For Class 11+ students' : 'कक्षा 11+ के छात्रों के लिए',
      amount: '₹5,000-20,000',
      icon: FaGraduationCap
    },
    {
      title: currentLanguage === 'english' ? 'PM YASASVI Scheme' : 'पीएम यशस्वी योजना',
      desc: currentLanguage === 'english' ? 'Class 9 & 11 merit' : 'कक्षा 9 और 11 मेधावी',
      amount: '₹75,000-1.25L',
      icon: FaUserGraduate
    },
    {
      title: currentLanguage === 'english' ? 'Merit Cum Means' : 'मेरिट कम मीन्स',
      desc: currentLanguage === 'english' ? 'Minority community students' : 'अल्पसंख्यक समुदाय छात्र',
      amount: '₹20,000-1L',
      icon: FaHeart
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:from-gray-900 dark:via-background-dark dark:to-gray-900">
      <Navbar />
      
      <main className="flex-1 px-4 py-12">
        {/* Hero Section - Government Portal Style */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center mx-auto shadow-soft-md ring-4 ring-authority/20">
              <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                <FaRupeeSign className="text-5xl text-authority dark:text-authority" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-primary">
              {currentLanguage === 'english' ? 'Financial Literacy' : 'वित्तीय साक्षरता'}
            </span>
            <br />
            <span className="text-authority">
              {currentLanguage === 'english' ? '& Empowerment Platform' : 'और सशक्तिकरण मंच'}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 max-w-3xl mx-auto font-medium">
            {currentLanguage === 'english' 
              ? 'Empowering Rural India with Financial Knowledge, Government Schemes & AI Guidance'
              : 'ग्रामीण भारत को वित्तीय ज्ञान, सरकारी योजनाओं और AI मार्गदर्शन से सशक्त बनाना'}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-base text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            <span className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <FaRocket className="text-[#FF9933]" />
              {currentLanguage === 'english' ? 'Simple' : 'सरल'}
            </span>
            <span className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <FaGlobe className="text-[#138808]" />
              {currentLanguage === 'english' ? 'Accessible' : 'सुलभ'}
            </span>
            <span className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <FaComments className="text-[#000080]" />
              {currentLanguage === 'english' ? 'Multilingual' : 'बहुभाषी'}
            </span>
            <span className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <FaRobot className="text-[#FF9933]" />
              {currentLanguage === 'english' ? 'AI-Powered' : 'AI-संचालित'}
            </span>
            <span className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <FaHeart className="text-red-500" />
              {currentLanguage === 'english' ? 'For Everyone' : 'सभी के लिए'}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to={dashboardLink}
              className="px-10 py-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-xl font-semibold shadow-soft-md hover:shadow-soft-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 min-h-[48px]"
            >
              <FaRupeeSign className="w-5 h-5" />
              {isAuthenticated ? strings.dashboard : (currentLanguage === 'english' ? 'Get Started Free' : 'मुफ्त शुरू करें')}
            </Link>
            
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-10 py-4 rounded-lg bg-white hover:bg-gray-50 text-primary border-2 border-primary text-xl font-semibold shadow-soft-md hover:shadow-soft-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 min-h-[48px]"
              >
                <FaUsers className="w-5 h-5" />
                {strings.login}
              </Link>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-16">
          <div className="bg-gradient-to-r from-[#FF9933]/10 via-white/80 to-[#138808]/10 dark:from-[#FF9933]/5 dark:via-gray-800/80 dark:to-[#138808]/5 rounded-2xl p-8 border-2 border-[#FF9933]/30 shadow-gov-lg">
            <h2 className="text-3xl font-bold text-center text-[#000080] dark:text-[#4169E1] mb-8 flex items-center justify-center gap-3">
              <FaFlag className="text-[#FF9933]" />
              {currentLanguage === 'english' ? 'India\'s Digital Financial Revolution' : 'भारत की डिजिटल वित्तीय क्रांति'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center transform hover:scale-110 transition-transform bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                  <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-3`} />
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-center text-[#000080] dark:text-[#4169E1] mb-3 flex items-center justify-center gap-3">
              <FaLandmark className="text-[#138808]" />
              {currentLanguage === 'english' ? 'Popular Government Schemes' : 'लोकप्रिय सरकारी योजनाएं'}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              {currentLanguage === 'english' 
                ? 'Access government benefits designed for you'
                : 'आपके लिए डिज़ाइन किए गए सरकारी लाभ प्राप्त करें'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {govSchemes.map((scheme, index) => (
                <div key={index} className="bg-white dark:bg-surface-dark rounded-xl shadow-gov-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-[#138808] transform hover:-translate-y-2">
                  <div className={`bg-gradient-to-r ${scheme.color} p-4 text-white`}>
                    <scheme.icon className="w-10 h-10 mb-2" />
                    <h3 className="text-xl font-bold">{scheme.name}</h3>
                    <p className="text-sm opacity-90">{currentLanguage === 'english' ? scheme.nameEn : scheme.nameHi}</p>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-bold text-[#000080] dark:text-[#4169E1] mb-2">{scheme.amount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{scheme.beneficiaries}</div>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 shadow-gov-lg">
            <h2 className="text-3xl font-bold text-center text-[#000080] dark:text-[#4169E1] mb-3 flex items-center justify-center gap-3">
              <FaGraduationCap className="text-[#000080]" />
              {currentLanguage === 'english' ? 'Student Scholarships & Benefits' : 'छात्र छात्रवृत्ति और लाभ'}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              {currentLanguage === 'english'
                ? 'Financial support for your education journey'
                : 'आपकी शिक्षा यात्रा के लिए वित्तीय सहायता'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {studentSchemes.map((scheme, index) => (
                <div key={index} className="bg-white dark:bg-surface-dark rounded-lg shadow-gov hover:shadow-lg transition-all p-6 transform hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <scheme.icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 text-center">{scheme.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">{scheme.desc}</p>
                  <div className="text-xl font-bold text-[#138808] text-center">{scheme.amount}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-center text-[#000080] dark:text-[#4169E1] mb-10 flex items-center justify-center gap-3">
              <FaStar className="text-[#FF9933]" />
              {currentLanguage === 'english' ? 'Our Services' : 'हमारी सेवाएं'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/learning" className="group">
                <div className="bg-white dark:bg-surface-dark rounded-lg shadow-gov-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-[#138808] transform hover:-translate-y-2">
                  <div className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform">
                      <FaBook className="w-8 h-8 text-[#138808]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#000080] dark:text-[#4169E1] mb-3 text-center">
                      {currentLanguage === 'english' ? 'Financial Lessons' : 'वित्तीय पाठ'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                      {currentLanguage === 'english'
                        ? 'Learn money management, savings, budgeting & investments in simple language'
                        : 'सरल भाषा में धन प्रबंधन, बचत, बजट और निवेश सीखें'}
                    </p>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
                </div>
              </Link>
              
              <Link to="/schemes" className="group">
                <div className="bg-white dark:bg-surface-dark rounded-lg shadow-gov-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-[#000080] transform hover:-translate-y-2">
                  <div className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform">
                      <FaLandmark className="w-8 h-8 text-[#000080]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#000080] dark:text-[#4169E1] mb-3 text-center">
                      {currentLanguage === 'english' ? 'Government Schemes' : 'सरकारी योजनाएं'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                      {currentLanguage === 'english'
                        ? 'Discover & apply for schemes for farmers, students, women & small businesses'
                        : 'किसानों, छात्रों, महिलाओं और छोटे व्यवसायों के लिए योजनाएं खोजें और आवेदन करें'}
                    </p>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
                </div>
              </Link>
              
              <Link to="/ai-advisor" className="group">
                <div className="bg-white dark:bg-surface-dark rounded-lg shadow-gov-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-[#FF9933] transform hover:-translate-y-2">
                  <div className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform">
                      <FaLightbulb className="w-8 h-8 text-[#FF9933]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#000080] dark:text-[#4169E1] mb-3 text-center">
                      {currentLanguage === 'english' ? 'AI Financial Advisor' : 'AI वित्तीय सलाहकार'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                      {currentLanguage === 'english'
                        ? 'Get instant answers to your financial questions in Hindi & English using AI'
                        : 'AI का उपयोग करके हिंदी और अंग्रेजी में अपने वित्तीय प्रश्नों के तुरंत उत्तर प्राप्त करें'}
                    </p>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
                </div>
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-r from-[#138808] via-[#0f6d06] to-[#0a5004] rounded-2xl p-12 text-center text-white shadow-gov-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <FaHandHoldingUsd className="w-20 h-20 mx-auto mb-6 animate-bounce" />
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {currentLanguage === 'english' 
                  ? 'Start Your Financial Independence Journey Today'
                  : 'आज ही अपनी वित्तीय स्वतंत्रता की यात्रा शुरू करें'}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3 text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                <span className="flex items-center gap-2">
                  <FaStar className="text-yellow-300" />
                  {currentLanguage === 'english' ? 'Free' : 'मुफ्त'}
                </span>
                <span>•</span>
                <span>{currentLanguage === 'english' ? 'Simple' : 'सरल'}</span>
                <span>•</span>
                <span>{currentLanguage === 'english' ? 'Trusted by thousands across rural India' : 'ग्रामीण भारत में हजारों द्वारा विश्वसनीय'}</span>
                <FaFlag className="text-[#FF9933]" />
              </div>
              <Link
                to="/signup"
                className="inline-flex items-center gap-3 px-12 py-5 bg-white text-[#138808] rounded-lg text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <FaUserGraduate className="w-6 h-6" />
                {currentLanguage === 'english' ? 'Join Now - It\'s Free!' : 'अभी जुड़ें - यह मुफ़्त है!'}
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
