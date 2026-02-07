import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaTimes, FaArrowLeft, FaArrowRight, FaCheck, FaGraduationCap, FaCoins, FaUniversity, FaLightbulb, FaPen, FaFileImage, FaEnvelope, FaShoppingCart, FaMap } from 'react-icons/fa';

const SiteTour = ({ onClose }) => {
  const { currentLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = {
    english: [
      {
        title: "Welcome to Financial Literacy Platform!",
        description: "This platform helps rural users learn about savings, budgeting, government schemes, and financial management. Let's take a quick tour to understand all features.",
        icon: <FaGraduationCap className="text-4xl text-blue-600" />,
        color: "blue"
      },
      {
        title: "Learning Lessons",
        description: "Complete interactive financial lessons to improve your knowledge. Each lesson teaches important concepts about money management, savings, and banking. Earn coins for every lesson you complete!",
        icon: <FaGraduationCap className="text-4xl text-blue-600" />,
        color: "blue",
        features: [
          "10 comprehensive financial lessons",
          "Learn at your own pace",
          "Earn coins for completion",
          "Track your progress"
        ]
      },
      {
        title: "Coins & Rewards",
        description: "Earn coins by completing lessons and activities. These coins are valuable - you can redeem them in the Marketplace for real benefits like electricity bills, ration, LPG subsidies, and more!",
        icon: <FaCoins className="text-4xl text-amber-600" />,
        color: "amber",
        features: [
          "Earn coins by learning",
          "1 Coin = ₹2 benefit value",
          "100% government subsidy",
          "Redeem for real-life benefits"
        ]
      },
      {
        title: "Government Schemes",
        description: "Discover government schemes you're eligible for. Browse schemes by category, view details, check eligibility criteria, and see scheme locations on an interactive map.",
        icon: <FaUniversity className="text-4xl text-indigo-600" />,
        color: "indigo",
        features: [
          "100+ government schemes",
          "Filter by category & state",
          "Interactive map view",
          "Detailed eligibility criteria"
        ]
      },
      {
        title: "Marketplace",
        description: "Redeem your earned coins for essential services! Pay electricity bills, buy ration, get LPG subsidies, education fees, healthcare, and more. Government provides 100% subsidy - you only pay with your earned coins!",
        icon: <FaShoppingCart className="text-4xl text-green-600" />,
        color: "green",
        features: [
          "10 benefit categories",
          "100% government subsidy",
          "Direct Benefit Transfer (DBT)",
          "Instant redemption"
        ]
      },
      {
        title: "Expense Tracker",
        description: "Track your daily expenses to understand your spending patterns. Add expenses by category, view monthly summaries, and get insights to manage your money better.",
        icon: <FaPen className="text-4xl text-purple-600" />,
        color: "purple",
        features: [
          "Track daily expenses",
          "Categorize spending",
          "Monthly reports",
          "Budget insights"
        ]
      },
      {
        title: "AI Advisor",
        description: "Get instant answers to your financial questions! Our AI advisor understands your queries in both English and Hindi. Ask about savings, loans, schemes, or any financial topic.",
        icon: <FaLightbulb className="text-4xl text-yellow-600" />,
        color: "yellow",
        features: [
          "24/7 financial guidance",
          "Ask in English or Hindi",
          "Personalized advice",
          "Learn at your pace"
        ]
      },
      {
        title: "Document Scanner",
        description: "Scan important documents and extract information automatically. Upload bank statements, bills, or government documents to understand them better.",
        icon: <FaFileImage className="text-4xl text-cyan-600" />,
        color: "cyan",
        features: [
          "Scan documents",
          "Extract text automatically",
          "Understand official papers",
          "Store important info"
        ]
      },
      {
        title: "Money Translator",
        description: "Don't understand bank SMS messages? Paste any bank message and get a simple explanation in your language. Understand debits, credits, balances, and charges easily.",
        icon: <FaEnvelope className="text-4xl text-teal-600" />,
        color: "teal",
        features: [
          "Understand bank SMS",
          "Simple explanations",
          "Hindi & English support",
          "Learn banking terms"
        ]
      },
      {
        title: "You're All Set!",
        description: "You now know all the features of this platform. Start your financial learning journey today, earn coins, and improve your financial well-being. Remember: Learning = Earning!",
        icon: <FaCheck className="text-4xl text-green-600" />,
        color: "green",
        cta: "Start Learning Now"
      }
    ],
    hindi: [
      {
        title: "वित्तीय साक्षरता मंच में आपका स्वागत है!",
        description: "यह मंच ग्रामीण उपयोगकर्ताओं को बचत, बजट, सरकारी योजनाओं और वित्तीय प्रबंधन के बारे में सीखने में मदद करता है। आइए सभी सुविधाओं को समझने के लिए एक त्वरित दौरा करें।",
        icon: <FaGraduationCap className="text-4xl text-blue-600" />,
        color: "blue"
      },
      {
        title: "सीखने के पाठ",
        description: "अपने ज्ञान को बेहतर बनाने के लिए इंटरैक्टिव वित्तीय पाठ पूरे करें। प्रत्येक पाठ पैसे के प्रबंधन, बचत और बैंकिंग के बारे में महत्वपूर्ण अवधारणाएं सिखाता है। हर पाठ पूरा करने पर सिक्के कमाएं!",
        icon: <FaGraduationCap className="text-4xl text-blue-600" />,
        color: "blue",
        features: [
          "10 व्यापक वित्तीय पाठ",
          "अपनी गति से सीखें",
          "पूर्णता के लिए सिक्के कमाएं",
          "अपनी प्रगति ट्रैक करें"
        ]
      },
      {
        title: "सिक्के और पुरस्कार",
        description: "पाठ और गतिविधियों को पूरा करके सिक्के कमाएं। ये सिक्के मूल्यवान हैं - आप इन्हें बाज़ार में बिजली बिल, राशन, LPG सब्सिडी और अन्य लाभों के लिए भुना सकते हैं!",
        icon: <FaCoins className="text-4xl text-amber-600" />,
        color: "amber",
        features: [
          "सीख कर सिक्के कमाएं",
          "1 सिक्का = ₹2 लाभ मूल्य",
          "100% सरकारी सब्सिडी",
          "वास्तविक जीवन के लाभों के लिए भुनाएं"
        ]
      },
      {
        title: "सरकारी योजनाएं",
        description: "उन सरकारी योजनाओं की खोज करें जिनके लिए आप पात्र हैं। श्रेणी के अनुसार योजनाएं ब्राउज़ करें, विवरण देखें, पात्रता मानदंड जांचें, और इंटरैक्टिव मानचित्र पर योजना स्थान देखें।",
        icon: <FaUniversity className="text-4xl text-indigo-600" />,
        color: "indigo",
        features: [
          "100+ सरकारी योजनाएं",
          "श्रेणी और राज्य के अनुसार फ़िल्टर करें",
          "इंटरैक्टिव मैप व्यू",
          "विस्तृत पात्रता मानदंड"
        ]
      },
      {
        title: "बाज़ार",
        description: "अपने अर्जित सिक्कों को आवश्यक सेवाओं के लिए भुनाएं! बिजली बिल भुगतान करें, राशन खरीदें, LPG सब्सिडी प्राप्त करें, शिक्षा शुल्क, स्वास्थ्य सेवा, और भी बहुत कुछ। सरकार 100% सब्सिडी प्रदान करती है - आप केवल अपने अर्जित सिक्कों से भुगतान करते हैं!",
        icon: <FaShoppingCart className="text-4xl text-green-600" />,
        color: "green",
        features: [
          "10 लाभ श्रेणियां",
          "100% सरकारी सब्सिडी",
          "प्रत्यक्ष लाभ हस्तांतरण (DBT)",
          "तत्काल मोचन"
        ]
      },
      {
        title: "व्यय ट्रैकर",
        description: "अपने खर्च के पैटर्न को समझने के लिए अपने दैनिक खर्चों को ट्रैक करें। श्रेणी के अनुसार खर्च जोड़ें, मासिक सारांश देखें, और अपने पैसे को बेहतर तरीके से प्रबंधित करने के लिए अंतर्दृष्टि प्राप्त करें।",
        icon: <FaPen className="text-4xl text-purple-600" />,
        color: "purple",
        features: [
          "दैनिक खर्च ट्रैक करें",
          "खर्च को वर्गीकृत करें",
          "मासिक रिपोर्ट",
          "बजट अंतर्दृष्टि"
        ]
      },
      {
        title: "AI सलाहकार",
        description: "अपने वित्तीय सवालों के तुरंत जवाब पाएं! हमारा AI सलाहकार अंग्रेजी और हिंदी दोनों में आपके प्रश्नों को समझता है। बचत, ऋण, योजनाओं या किसी भी वित्तीय विषय के बारे में पूछें।",
        icon: <FaLightbulb className="text-4xl text-yellow-600" />,
        color: "yellow",
        features: [
          "24/7 वित्तीय मार्गदर्शन",
          "अंग्रेजी या हिंदी में पूछें",
          "व्यक्तिगत सलाह",
          "अपनी गति से सीखें"
        ]
      },
      {
        title: "दस्तावेज़ स्कैनर",
        description: "महत्वपूर्ण दस्तावेज़ स्कैन करें और जानकारी स्वचालित रूप से निकालें। बैंक स्टेटमेंट, बिल या सरकारी दस्तावेज अपलोड करें और उन्हें बेहतर ढंग से समझें।",
        icon: <FaFileImage className="text-4xl text-cyan-600" />,
        color: "cyan",
        features: [
          "दस्तावेज़ स्कैन करें",
          "टेक्स्ट स्वचालित रूप से निकालें",
          "आधिकारिक कागजात समझें",
          "महत्वपूर्ण जानकारी संग्रहीत करें"
        ]
      },
      {
        title: "पैसा समझाओ",
        description: "बैंक SMS संदेश नहीं समझते? किसी भी बैंक संदेश को पेस्ट करें और अपनी भाषा में एक सरल व्याख्या प्राप्त करें। डेबिट, क्रेडिट, बैलेंस और शुल्क को आसानी से समझें।",
        icon: <FaEnvelope className="text-4xl text-teal-600" />,
        color: "teal",
        features: [
          "बैंक SMS समझें",
          "सरल स्पष्टीकरण",
          "हिंदी और अंग्रेजी समर्थन",
          "बैंकिंग शर्तें सीखें"
        ]
      },
      {
        title: "आप तैयार हैं!",
        description: "आप अब इस मंच की सभी सुविधाओं को जानते हैं। आज ही अपनी वित्तीय शिक्षा यात्रा शुरू करें, सिक्के कमाएं और अपनी वित्तीय भलाई में सुधार करें। याद रखें: सीखना = कमाना!",
        icon: <FaCheck className="text-4xl text-green-600" />,
        color: "green",
        cta: "अभी सीखना शुरू करें"
      }
    ]
  };

  const steps = tourSteps[currentLanguage] || tourSteps.english;
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('tourCompleted', 'true');
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              {currentStepData.icon}
            </div>
            <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
            <div className="flex gap-2 mt-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-white'
                      : index < currentStep
                      ? 'w-6 bg-white/60'
                      : 'w-6 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)]">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            {currentStepData.description}
          </p>

          {currentStepData.features && (
            <div className="space-y-3">
              {currentStepData.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full bg-${currentStepData.color}-100 dark:bg-${currentStepData.color}-900/30 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <FaCheck className={`text-xs text-${currentStepData.color}-600 dark:text-${currentStepData.color}-400`} />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{feature}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <FaArrowLeft className="text-sm" />
              <span>{currentLanguage === 'english' ? 'Previous' : 'पिछला'}</span>
            </button>

            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {currentStep + 1} / {totalSteps}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <span>
                {currentStep === totalSteps - 1
                  ? currentStepData.cta || (currentLanguage === 'english' ? 'Finish' : 'समाप्त')
                  : currentLanguage === 'english'
                  ? 'Next'
                  : 'अगला'}
              </span>
              {currentStep < totalSteps - 1 && <FaArrowRight className="text-sm" />}
            </button>
          </div>

          <button
            onClick={handleSkip}
            className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mt-3"
          >
            {currentLanguage === 'english' ? 'Skip Tour' : 'दौरा छोड़ें'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteTour;
