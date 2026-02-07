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
  FaBook, FaPiggyBank, FaChartLine, FaStore, FaUniversity, FaShieldAlt,
  FaCoins, FaGraduationCap, FaPlay, FaCheckCircle, FaTimes, FaStar,
  FaRocket, FaTrophy, FaLightbulb, FaHandPointRight, FaInfoCircle,
  FaArrowRight, FaClock, FaFire, FaMedal, FaVolumeUp, FaStop
} from 'react-icons/fa';

const Learning = () => {
  const { strings, currentLanguage } = useLanguage();
  
  const [lessons, setLessons] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceLanguage, setVoiceLanguage] = useState('english');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const categoryIcons = {
    all: FaBook,
    savings: FaPiggyBank,
    budgeting: FaChartLine,
    business: FaStore,
    banking: FaUniversity,
    insurance: FaShieldAlt
  };
  
  const categories = [
    { id: 'all', name: currentLanguage === 'english' ? 'All Lessons' : 'सभी पाठ', nameHi: 'सभी पाठ' },
    { id: 'savings', name: currentLanguage === 'english' ? 'Savings' : 'बचत', nameHi: 'बचत' },
    { id: 'budgeting', name: currentLanguage === 'english' ? 'Budgeting' : 'बजट', nameHi: 'बजट' },
    { id: 'business', name: currentLanguage === 'english' ? 'Business' : 'व्यापार', nameHi: 'व्यापार' },
    { id: 'banking', name: currentLanguage === 'english' ? 'Banking' : 'बैंकिंग', nameHi: 'बैंकिंग' },
    { id: 'insurance', name: currentLanguage === 'english' ? 'Insurance' : 'बीमा', nameHi: 'बीमा' },
  ];

  const bilingualLessons = [
    {
      id: 1,
      title: currentLanguage === 'english' ? 'Understanding Money & Savings' : 'पैसा और बचत को समझना',
      titleEn: 'Understanding Money & Savings',
      titleHi: 'पैसा और बचत को समझना',
      description: currentLanguage === 'english' 
        ? 'Learn the basics of money management and why saving is important for your future'
        : 'पैसे के प्रबंधन की मूल बातें जानें और क्यों बचत आपके भविष्य के लिए महत्वपूर्ण है',
      descriptionEn: 'Learn the basics of money management and why saving is important for your future',
      descriptionHi: 'पैसे के प्रबंधन की मूल बातें जानें और क्यों बचत आपके भविष्य के लिए महत्वपूर्ण है',
      category: 'savings',
      coins: 10,
      duration: 15,
      difficulty: currentLanguage === 'english' ? 'Beginner' : 'शुरुआती',
      progress: 0,
      contentEn: [
        {
          type: 'intro',
          text: 'Money is what we use to buy things we need and want. Saving means keeping some money aside for the future instead of spending it all today.'
        },
        {
          type: 'point',
          title: 'Why Save Money?',
          items: [
            'Emergency situations (health, accidents)',
            'Future goals (education, house, business)',
            'Old age security',
            'Children\'s future'
          ]
        },
        {
          type: 'example',
          title: 'Real Example',
          text: 'Ramesh earns ₹10,000 per month. He saves ₹2,000 every month. After 1 year, he has ₹24,000 saved. When his son needs books for school, he has the money ready!'
        },
        {
          type: 'tip',
          text: 'Start small! Even saving ₹50-100 per month is a good beginning.'
        }
      ],
      contentHi: [
        {
          type: 'intro',
          text: 'पैसा वह है जिसका उपयोग हम अपनी जरूरत और इच्छा की चीजें खरीदने के लिए करते हैं। बचत का मतलब है आज सब खर्च करने के बजाय भविष्य के लिए कुछ पैसे अलग रखना।'
        },
        {
          type: 'point',
          title: 'पैसे क्यों बचाएं?',
          items: [
            'आपातकालीन स्थितियां (स्वास्थ्य, दुर्घटनाएं)',
            'भविष्य के लक्ष्य (शिक्षा, घर, व्यापार)',
            'बुढ़ापे की सुरक्षा',
            'बच्चों का भविष्य'
          ]
        },
        {
          type: 'example',
          title: 'वास्तविक उदाहरण',
          text: 'रमेश प्रति माह ₹10,000 कमाते हैं। वह हर महीने ₹2,000 बचाते हैं। 1 साल बाद, उनके पास ₹24,000 बचत है। जब उनके बेटे को स्कूल के लिए किताबों की जरूरत होती है, तो उनके पास पैसे तैयार होते हैं!'
        },
        {
          type: 'tip',
          text: 'छोटी शुरुआत करें! प्रति माह ₹50-100 की बचत भी अच्छी शुरुआत है।'
        }
      ]
    },
    {
      id: 2,
      title: currentLanguage === 'english' ? 'Opening a Bank Account' : 'बैंक खाता खोलना',
      titleEn: 'Opening a Bank Account',
      titleHi: 'बैंक खाता खोलना',
      description: currentLanguage === 'english'
        ? 'Step-by-step guide to opening your first bank account and keeping money safe'
        : 'अपना पहला बैंक खाता खोलने और पैसे सुरक्षित रखने की चरण-दर-चरण मार्गदर्शिका',
      descriptionEn: 'Step-by-step guide to opening your first bank account and keeping money safe',
      descriptionHi: 'अपना पहला बैंक खाता खोलने और पैसे सुरक्षित रखने की चरण-दर-चरण मार्गदर्शिका',
      category: 'banking',
      coins: 10,
      duration: 20,
      difficulty: currentLanguage === 'english' ? 'Beginner' : 'शुरुआती',
      progress: 0,
      contentEn: [
        {
          type: 'intro',
          text: 'A bank account is a safe place to keep your money. The bank protects your money and you can take it out whenever you need.'
        },
        {
          type: 'point',
          title: 'Documents Needed (Jan Dhan Account)',
          items: [
            'Aadhaar Card',
            'One photograph',
            'Mobile number (optional but helpful)',
            'Initial deposit: ₹0 (Zero Balance Account)'
          ]
        },
        {
          type: 'point',
          title: 'Benefits of Bank Account',
          items: [
            'Money is safe (no theft risk)',
            'Get interest on savings',
            'Receive government benefits directly',
            'Apply for loans easier',
            'Use ATM card to withdraw money'
          ]
        },
        {
          type: 'tip',
          text: 'PM Jan Dhan Yojana: Free bank account for everyone! No minimum balance required.'
        }
      ],
      contentHi: [
        {
          type: 'intro',
          text: 'बैंक खाता आपके पैसे रखने के लिए एक सुरक्षित जगह है। बैंक आपके पैसे की रक्षा करता है और आप जब चाहें इसे निकाल सकते हैं।'
        },
        {
          type: 'point',
          title: 'आवश्यक दस्तावेज (जन धन खाता)',
          items: [
            'आधार कार्ड',
            'एक फोटोग्राफ',
            'मोबाइल नंबर (वैकल्पिक लेकिन मददगार)',
            'प्रारंभिक जमा: ₹0 (शून्य शेष खाता)'
          ]
        },
        {
          type: 'point',
          title: 'बैंक खाते के लाभ',
          items: [
            'पैसा सुरक्षित है (चोरी का कोई जोखिम नहीं)',
            'बचत पर ब्याज मिलता है',
            'सरकारी लाभ सीधे प्राप्त करें',
            'ऋण के लिए आसानी से आवेदन करें',
            'पैसे निकालने के लिए एटीएम कार्ड का उपयोग करें'
          ]
        },
        {
          type: 'tip',
          text: 'पीएम जन धन योजना: सभी के लिए मुफ्त बैंक खाता! न्यूनतम शेष की आवश्यकता नहीं।'
        }
      ]
    },
    {
      id: 3,
      title: currentLanguage === 'english' ? 'Managing Daily Expenses' : 'दैनिक खर्चों का प्रबंधन',
      titleEn: 'Managing Daily Expenses',
      titleHi: 'दैनिक खर्चों का प्रबंधन',
      description: currentLanguage === 'english'
        ? 'Learn how to track and control your daily spending to save more money'
        : 'अधिक पैसे बचाने के लिए अपने दैनिक खर्च को ट्रैक और नियंत्रित करना सीखें',
      descriptionEn: 'Learn how to track and control your daily spending to save more money',
      descriptionHi: 'अधिक पैसे बचाने के लिए अपने दैनिक खर्च को ट्रैक और नियंत्रित करना सीखें',
      category: 'budgeting',
      coins: 10,
      duration: 18,
      difficulty: currentLanguage === 'english' ? 'Beginner' : 'शुरुआती',
      progress: 0,
      contentEn: [
        {
          type: 'intro',
          text: 'Managing expenses means knowing where your money goes and making smart choices about spending.'
        },
        {
          type: 'point',
          title: '50-30-20 Rule (Simple)',
          items: [
            '50% - Necessities (food, rent, transport)',
            '30% - Wants (entertainment, new clothes)',
            '20% - Savings (future, emergency)'
          ]
        },
        {
          type: 'example',
          title: 'Monthly Income: ₹15,000',
          text: 'Necessities: ₹7,500 | Wants: ₹4,500 | Savings: ₹3,000. This way you save ₹36,000 per year!'
        },
        {
          type: 'tip',
          text: 'Write down all expenses for one month. You will be surprised where money goes!'
        }
      ],
      contentHi: [
        {
          type: 'intro',
          text: 'खर्चों का प्रबंधन करने का मतलब है यह जानना कि आपका पैसा कहाँ जाता है और खर्च के बारे में स्मार्ट विकल्प बनाना।'
        },
        {
          type: 'point',
          title: '50-30-20 नियम (सरल)',
          items: [
            '50% - आवश्यकताएं (भोजन, किराया, परिवहन)',
            '30% - इच्छाएं (मनोरंजन, नए कपड़े)',
            '20% - बचत (भविष्य, आपातकाल)'
          ]
        },
        {
          type: 'example',
          title: 'मासिक आय: ₹15,000',
          text: 'आवश्यकताएं: ₹7,500 | इच्छाएं: ₹4,500 | बचत: ₹3,000। इस तरह आप प्रति वर्ष ₹36,000 बचाते हैं!'
        },
        {
          type: 'tip',
          text: 'एक महीने के लिए सभी खर्चे लिखें। आप आश्चर्यचकित होंगे कि पैसा कहाँ जाता है!'
        }
      ]
    }
  ];
  
  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('hasVisitedLearning');
    if (isFirstVisit) {
      setShowWelcome(true);
      localStorage.setItem('hasVisitedLearning', 'true');
    }
    fetchLessons();
  }, [selectedCategory]);
  
  const fetchLessons = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/lessons?category=${selectedCategory}`);
      const apiLessons = response.data;
      const combinedLessons = [...bilingualLessons, ...apiLessons];
      const filteredLessons = selectedCategory === 'all' 
        ? combinedLessons 
        : combinedLessons.filter(l => l.category === selectedCategory);
      setLessons(filteredLessons);
    } catch (error) {
      setLessons(bilingualLessons.filter(l => selectedCategory === 'all' || l.category === selectedCategory));
    } finally {
      setLoading(false);
    }
  };

  const startLesson = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentStep(0);
  };

  const completeLesson = async () => {
    if (selectedLesson.progress >= 100) {
      setSelectedLesson(null);
      return;
    }
    try {
      const response = await api.post(`/lessons/${selectedLesson.id}/complete`);
      if (response.data.coinsEarned > 0) {
        console.log('Coins earned:', response.data.coinsEarned);
      }
      if (response.data.newBadge) {
        alert(`🎉 ${currentLanguage === 'english' ? 'New Badge Unlocked' : 'नया बैज अनलॉक हुआ'}: ${response.data.newBadge}!`);
      }
      setSelectedLesson(null);
      fetchLessons();
    } catch (error) {
      console.error('Error completing lesson:', error);
      setSelectedLesson(null);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceLanguage === 'hindi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert(strings.voiceNotSupported);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getCurrentStepText = () => {
    if (!selectedLesson) return '';
    
    const content = voiceLanguage === 'hindi' ? selectedLesson.contentHi : selectedLesson.contentEn;
    const step = content[currentStep];
    
    if (!step) return '';
    
    let text = '';
    if (step.title) text += step.title + '. ';
    if (step.text) text += step.text + ' ';
    if (step.items) text += step.items.join('. ') + '.';
    
    return text;
  };

  const WelcomeModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg max-w-2xl w-full p-8 relative overflow-hidden">
        
        <div className="relative">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary-50 border-2 border-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRocket className="text-4xl text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {currentLanguage === 'english' ? 'Welcome to Financial Learning!' : 'वित्तीय शिक्षा में आपका स्वागत है!'}
            </h2>
            <p className="text-gray-600">
              {currentLanguage === 'english' 
                ? 'Your journey to financial freedom starts here!' 
                : 'वित्तीय स्वतंत्रता की आपकी यात्रा यहाँ से शुरू होती है!'}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-4 p-4 bg-primary-50 border border-primary-600 rounded-lg">
              <FaLightbulb className="text-2xl text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">
                  {currentLanguage === 'english' ? 'Interactive Lessons' : 'इंटरैक्टिव पाठ'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'english' 
                    ? 'Learn with real examples in both English and Hindi' 
                    : 'अंग्रेजी और हिंदी दोनों में वास्तविक उदाहरणों के साथ सीखें'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-500 rounded-lg">
              <FaCoins className="text-2xl text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">
                  {currentLanguage === 'english' ? 'Earn Rewards' : 'पुरस्कार अर्जित करें'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'english' 
                    ? 'Collect coins and badges as you complete lessons' 
                    : 'पाठ पूर्ण करने पर सिक्के और बैज एकत्र करें'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-500 rounded-lg">
              <FaTrophy className="text-2xl text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">
                  {currentLanguage === 'english' ? 'Track Progress' : 'प्रगति ट्रैक करें'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'english' 
                    ? 'See your growth and achievement journey' 
                    : 'अपनी वृद्धि और उपलब्धि यात्रा देखें'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowWelcome(false)}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            {currentLanguage === 'english' ? 'Start Learning' : 'सीखना शुरू करें'}
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );

  const LessonModal = ({ lesson }) => {
    const content = currentLanguage === 'english' ? lesson.contentEn : lesson.contentHi;
    const isLastStep = currentStep === content.length;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8 relative">
          <div className="sticky top-0 bg-primary-600 p-1 rounded-t-lg z-10">
            <div className="bg-white rounded-t-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {currentLanguage === 'english' ? lesson.titleEn : lesson.titleHi}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaClock className="text-primary-600" />
                      {lesson.duration} {currentLanguage === 'english' ? 'min' : 'मिनट'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCoins className="text-amber-500" />
                      {lesson.coins} {currentLanguage === 'english' ? 'coins' : 'सिक्के'}
                    </span>
                    <span className="px-3 py-1 bg-primary-50 border border-primary-600 rounded-full text-xs font-medium text-primary-700">
                      {lesson.difficulty}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    stopSpeaking();
                    setSelectedLesson(null);
                    setCurrentStep(0);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <select
                  value={voiceLanguage}
                  onChange={(e) => {
                    stopSpeaking();
                    setVoiceLanguage(e.target.value);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                >
                  <option value="english">🇬🇧 English Voice</option>
                  <option value="hindi">🇮🇳 Hindi Voice</option>
                </select>
                
                {!isSpeaking ? (
                  <button
                    onClick={() => speakText(getCurrentStepText())}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all"
                  >
                    <FaVolumeUp className="text-lg" />
                    <span className="font-medium">{currentLanguage === 'english' ? 'Play Audio' : 'ऑडियो चलाएं'}</span>
                  </button>
                ) : (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all animate-pulse"
                  >
                    <FaStop className="text-lg" />
                    <span className="font-medium">{currentLanguage === 'english' ? 'Stop Audio' : 'ऑडियो रोकें'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            {!isLastStep ? (
              <div className="mb-6 animate-fade-in">
                {content[currentStep].type === 'intro' && (
                  <div className="bg-blue-50 border border-blue-500 p-6 rounded-lg">
                    <FaInfoCircle className="text-4xl text-primary mb-4" />
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {content[currentStep].text}
                    </p>
                  </div>
                )}

                {content[currentStep].type === 'point' && (
                  <div className="bg-white p-6 rounded-lg border border-gray-300">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaHandPointRight className="text-primary-600" />
                      {content[currentStep].title}
                    </h3>
                    <ul className="space-y-3">
                      {content[currentStep].items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <FaCheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {content[currentStep].type === 'example' && (
                  <div className="bg-amber-50 border border-amber-500 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <FaStar className="text-2xl text-amber-500" />
                      <h3 className="text-xl font-bold text-gray-800">
                        {content[currentStep].title}
                      </h3>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed italic">
                      {content[currentStep].text}
                    </p>
                  </div>
                )}

                {content[currentStep].type === 'tip' && (
                  <div className="bg-green-50 border border-green-500 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <FaLightbulb className="text-3xl text-green-600" />
                      <h3 className="text-xl font-bold text-gray-800">
                        {currentLanguage === 'english' ? 'Pro Tip' : 'प्रो टिप'}
                      </h3>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed font-semibold">
                      {content[currentStep].text}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-24 h-24 bg-primary-50 border-4 border-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaTrophy className="text-5xl text-primary-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  {currentLanguage === 'english' ? 'Lesson Complete!' : 'पाठ पूर्ण!'}
                </h3>
                <p className="text-xl text-gray-600 mb-6">
                  {currentLanguage === 'english' ? 'Great job! You earned' : 'बढ़िया काम! आपने अर्जित किया'}
                </p>
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-500 px-8 py-4 rounded-lg">
                    <FaCoins className="text-3xl text-amber-500" />
                    <span className="text-3xl font-bold text-amber-700">+{lesson.coins}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-200">
              <div className="flex gap-2">
                {content.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx <= currentStep ? 'bg-primary-600 w-12' : 'bg-gray-300 w-8'
                    }`}
                  ></div>
                ))}
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && !isLastStep && (
                  <button
                    onClick={() => {
                      stopSpeaking();
                      setCurrentStep(currentStep - 1);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    {currentLanguage === 'english' ? 'Previous' : 'पिछला'}
                  </button>
                )}
                
                {!isLastStep ? (
                  <button
                    onClick={() => {
                      stopSpeaking();
                      setCurrentStep(currentStep + 1);
                    }}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    {currentLanguage === 'english' ? 'Next' : 'अगला'}
                    <FaArrowRight />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      stopSpeaking();
                      completeLesson();
                    }}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    {currentLanguage === 'english' ? 'Finish' : 'समाप्त'}
                    <FaCheckCircle />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {showWelcome && <WelcomeModal />}
      {selectedLesson && <LessonModal lesson={selectedLesson} />}
      
      <main className="flex-1 px-6 py-8 w-full">
        <div className="relative mb-10">
          <div className="relative bg-white border-2 border-primary-600 rounded-lg shadow-lg">
            <div className="bg-white rounded-lg p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                    <FaGraduationCap className="text-primary-600" />
                    {currentLanguage === 'english' ? 'Financial Lessons' : 'वित्तीय पाठ'}
                  </h1>
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <FaFire className="text-primary-600" />
                    {currentLanguage === 'english' 
                      ? 'Master money management in your language' 
                      : 'अपनी भाषा में पैसे के प्रबंधन में महारत हासिल करें'}
                  </p>
                </div>
                
                <button
                  onClick={() => setShowWelcome(true)}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  <FaInfoCircle />
                  {currentLanguage === 'english' ? 'Help Guide' : 'मदद गाइड'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaBook className="text-primary-600" />
            {currentLanguage === 'english' ? 'Choose Category' : 'श्रेणी चुनें'}
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.id];
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-4 rounded-lg font-semibold transition-all flex items-center gap-3 whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:shadow-md border border-gray-300 hover:border-primary-600'
                    }`}
                  >
                    <IconComponent className="text-2xl" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              {currentLanguage === 'english' ? 'Loading lessons...' : 'पाठ लोड हो रहे हैं...'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {lessons.length > 0 ? (
              lessons.map((lesson, index) => (
                <div 
                  key={lesson.id || index} 
                  className="group relative overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-300 hover:border-primary-600"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary-600"></div>
                  
                  <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 p-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-24 h-24 bg-primary-50 border-2 border-primary-600 rounded-lg flex items-center justify-center shadow-md">
                          <FaGraduationCap className="text-4xl text-primary-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-xs font-bold text-white">{index + 1}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {currentLanguage === 'english' ? lesson.titleEn : lesson.titleHi}
                        </h3>
                        <span className="px-3 py-1 bg-primary-50 border border-primary-600 text-primary-700 rounded-full text-sm font-semibold">
                          {lesson.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {currentLanguage === 'english' ? lesson.descriptionEn : lesson.descriptionHi}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-primary-600" />
                          <span>{lesson.duration} {currentLanguage === 'english' ? 'minutes' : 'मिनट'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMedal className="text-amber-600" />
                          <span>{lesson.category}</span>
                        </div>
                        {lesson.progress > 0 && (
                          <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-green-600" />
                            <span>{lesson.progress}% {currentLanguage === 'english' ? 'complete' : 'पूर्ण'}</span>
                          </div>
                        )}
                      </div>
                      
                      {lesson.progress > 0 && (
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-600 transition-all duration-500" 
                              style={{ width: `${lesson.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3 items-end">
                      <button 
                        onClick={() => startLesson(lesson)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                      >
                        <FaPlay />
                        {lesson.progress > 0 
                          ? (currentLanguage === 'english' ? 'Resume' : 'फिर शुरू करें')
                          : (currentLanguage === 'english' ? 'Start' : 'शुरू करें')}
                      </button>
                      
                      <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-500 px-6 py-2 rounded-lg">
                        <FaCoins className="text-amber-500 text-xl" />
                        <span className="text-amber-700 font-bold text-lg">
                          +{lesson.coins}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  {currentLanguage === 'english' 
                    ? 'No lessons available in this category' 
                    : 'इस श्रेणी में कोई पाठ उपलब्ध नहीं है'}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 bg-white border-2 border-primary-600 rounded-lg shadow-lg">
          <div className="bg-white rounded-lg p-8 text-center">
            <FaStar className="text-5xl text-amber-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {currentLanguage === 'english' ? 'Keep Learning!' : 'सीखते रहें!'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {currentLanguage === 'english' 
                ? 'Complete all lessons to become a financial expert' 
                : 'वित्तीय विशेषज्ञ बनने के लिए सभी पाठ पूर्ण करें'}
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Learning;
