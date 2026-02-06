import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { 
  FaEnvelope, FaExclamationTriangle, FaCheckCircle, FaInfoCircle,
  FaVolumeUp, FaRedo, FaBell, FaUniversity
} from 'react-icons/fa';

const MoneyTranslator = () => {
  const { currentLanguage } = useLanguage();
  
  // Sample SMS messages that simulate bank messages
  const SAMPLE_MESSAGES = [
    {
      bank: "HDFC Bank",
      text: "Dear Customer, Your EMI of Rs.3,500 is overdue. Penal interest @2% will be charged. Please pay immediately to avoid further action. -HDFC Bank",
      icon: "🏦"
    },
    {
      bank: "SBI Bank",
      text: "Your A/c XX1234 debited with Rs.5,000 on 07-Feb-26. Available balance: Rs.2,340. -SBI",
      icon: "💳"
    },
    {
      bank: "Axis Bank",
      text: "Alert! Your loan payment is in default. Immediate action required to avoid legal consequences. Contact us at 1800-XXX-XXXX. -Axis Bank",
      icon: "⚠️"
    },
    {
      bank: "ICICI Bank",
      text: "Good news! PM-KISAN subsidy of Rs.2,000 has been credited to your account XX5678. -ICICI Bank",
      icon: "✅"
    },
    {
      bank: "Kotak Bank",
      text: "Your EMI has been capitalized due to non-payment. Interest will now be charged on accumulated interest. -Kotak Bank",
      icon: "📊"
    }
  ];
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  
  const currentMessage = SAMPLE_MESSAGES[currentMessageIndex];
  
  const handleUnderstand = async () => {
    setLoading(true);
    try {
      const response = await api.post('/money-translator/translate-money-text', {
        sms_text: currentMessage.text,
        language: currentLanguage === 'hindi' ? 'hi' : 'en'
      });
      
      setExplanation(response.data);
      setShowExplanation(true);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Failed to translate message. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleNextMessage = () => {
    setCurrentMessageIndex((prev) => (prev + 1) % SAMPLE_MESSAGES.length);
    setShowExplanation(false);
    setExplanation(null);
  };
  
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'hindi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Voice feature not supported in your browser');
    }
  };
  
  const getRiskColor = (level) => {
    switch(level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getRiskIcon = (level) => {
    switch(level) {
      case 'high': return <FaExclamationTriangle className="text-2xl" />;
      case 'medium': return <FaInfoCircle className="text-2xl" />;
      case 'low': return <FaCheckCircle className="text-2xl" />;
      default: return <FaInfoCircle className="text-2xl" />;
    }
  };
  
  const getRiskText = (level) => {
    const texts = {
      high: { en: 'High Risk', hi: 'Dhyan dein ⚠️' },
      medium: { en: 'Medium Risk', hi: 'Jaankari' },
      low: { en: 'Low Risk', hi: 'Sab theek hai' }
    };
    return texts[level]?.[currentLanguage === 'hindi' ? 'hi' : 'en'] || level;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <Navbar />
      
      <main className="flex-1 px-4 md:px-6 py-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-orange-100 p-4 rounded-full mb-4">
            <FaEnvelope className="text-5xl text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            💬 {currentLanguage === 'hindi' ? 'Paisa Samjhao' : 'Money Translator'}
          </h1>
          <p className="text-gray-600 text-lg">
            {currentLanguage === 'hindi' 
              ? 'Bank ke SMS ko aasaan bhasha mein samjhein'
              : 'Understand bank messages in simple language'}
          </p>
        </div>
        
        {/* New Message Alert */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 rounded-xl shadow-lg mb-6 flex items-center gap-3 animate-pulse">
          <FaBell className="text-3xl" />
          <div>
            <p className="font-bold text-lg">
              {currentLanguage === 'hindi' ? 'नया बैंक मैसेज आया' : 'New bank message detected'}
            </p>
            <p className="text-sm opacity-90">
              {currentLanguage === 'hindi' ? 'अभी-अभी' : 'Just now'}
            </p>
          </div>
        </div>
        
        {/* SMS Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-l-4 border-orange-500">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
              <FaUniversity className="text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-800 mb-1">{currentMessage.bank}</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {currentMessage.text}
              </p>
            </div>
          </div>
          
          {!showExplanation && (
            <button
              onClick={handleUnderstand}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  {currentLanguage === 'hindi' ? 'Samajh rahe hain...' : 'Understanding...'}
                </>
              ) : (
                <>
                  🧠 {currentLanguage === 'hindi' ? 'Isko samjhao' : 'Understand this message'}
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Explanation Panel */}
        {showExplanation && explanation && (
          <div className="space-y-6 animate-fade-in">
            {/* Risk Level Alert */}
            <div className={`${getRiskColor(explanation.risk_level)} text-white p-6 rounded-xl shadow-lg`}>
              <div className="flex items-center gap-4 mb-3">
                {getRiskIcon(explanation.risk_level)}
                <div>
                  <p className="text-sm font-medium opacity-90">
                    {currentLanguage === 'hindi' ? 'ISKA MATLAB • WHAT THIS MEANS' : 'RISK LEVEL'}
                  </p>
                  <h2 className="text-2xl font-bold">{getRiskText(explanation.risk_level)}</h2>
                </div>
              </div>
            </div>
            
            {/* Simple Explanation */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-xl">
              <p className="text-xs font-bold text-yellow-800 mb-2 uppercase tracking-wide">
                {currentLanguage === 'hindi' ? 'इसका मतलब • WHAT THIS MEANS' : 'SIMPLE EXPLANATION'}
              </p>
              <p className="text-gray-800 text-2xl leading-relaxed font-medium">
                {explanation.simple_explanation}
              </p>
              
              {/* Listen Button */}
              <button
                onClick={() => speakText(explanation.simple_explanation)}
                disabled={speaking}
                className="mt-4 flex items-center gap-2 text-yellow-700 hover:text-yellow-900 font-semibold transition-colors"
              >
                <FaVolumeUp className={speaking ? 'animate-pulse' : ''} />
                {speaking 
                  ? (currentLanguage === 'hindi' ? 'Sunein' : 'Listening...') 
                  : (currentLanguage === 'hindi' ? '🔊 Sunein' : '🔊 Listen')}
              </button>
            </div>
            
            {/* Next Action */}
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-xl">
              <p className="text-xs font-bold text-green-800 mb-2 uppercase tracking-wide flex items-center gap-2">
                <span>→</span> {currentLanguage === 'hindi' ? 'आगे क्या करें • WHAT TO DO NEXT' : 'RECOMMENDED ACTION'}
              </p>
              <p className="text-gray-800 text-xl leading-relaxed font-medium">
                {explanation.next_action}
              </p>
            </div>
            
            {/* Simulate Another Message */}
            <button
              onClick={handleNextMessage}
              className="w-full bg-white border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all flex items-center justify-center gap-3"
            >
              <FaRedo />
              {currentLanguage === 'hindi' 
                ? '🔄 Aur ek message dikhao (Simulate another SMS)' 
                : '🔄 Simulate another bank message'}
            </button>
          </div>
        )}
        
        {/* Demo Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-800">
            <strong>🔬 {currentLanguage === 'hindi' ? 'Demo Mode' : 'Demo Mode'}:</strong>{' '}
            {currentLanguage === 'hindi' 
              ? 'SMS simulation active. Production mein messages seedhe aapke phone se aayenge.'
              : 'SMS simulation active. In production, messages come directly from your phone.'}
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MoneyTranslator;
