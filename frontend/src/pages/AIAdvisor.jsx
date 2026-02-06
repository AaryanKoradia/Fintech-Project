import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaStop } from 'react-icons/fa';

const AIAdvisor = () => {
  const { strings, currentLanguage } = useLanguage();
  
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechLang, setSpeechLang] = useState(currentLanguage === 'english' ? 'en-IN' : 'hi-IN');
  const [interimText, setInterimText] = useState('');
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Keep listening
      recognitionRef.current.interimResults = true; // Show interim results
      recognitionRef.current.maxAlternatives = 1;
      
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setInterimText('');
      };
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Show interim results as user speaks
        if (interimTranscript) {
          setInterimText(interimTranscript);
        }
        
        // When final result comes, add to question
        if (finalTranscript) {
          setQuestion(prev => prev + finalTranscript);
          setInterimText('');
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          // Don't alert immediately, just log
          console.log('No speech detected. Keep speaking...');
        } else if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access in browser settings.');
          setIsListening(false);
        } else if (event.error === 'network') {
          alert('Network error. Speech recognition requires internet connection.');
          setIsListening(false);
        } else {
          console.log(`Speech error: ${event.error}`);
        }
      };
      
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        if (isListening) {
          // Auto-restart if still in listening mode (for continuous)
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.log('Recognition restart failed:', e);
            setIsListening(false);
            setInterimText('');
          }
        } else {
          setInterimText('');
        }
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isListening]);

  // Update speech language when app language changes
  useEffect(() => {
    setSpeechLang(currentLanguage === 'english' ? 'en-IN' : 'hi-IN');
  }, [currentLanguage]);

  // Start voice recognition
  const startListening = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!isListening) {
        recognitionRef.current.lang = speechLang;
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Please allow microphone access to use voice input. Check your browser settings.');
      setIsListening(false);
    }
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Speak text using Text-to-Speech
  const speakText = (text) => {
    if (synthRef.current) {
      // Stop any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLang;
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };
  
  // Bilingual example questions
  const exampleQuestions = currentLanguage === 'english' ? [
    'How can I save money every month?',
    'What is a fixed deposit?',
    'How do I start a small business?',
    'What government schemes can help my family?',
    'How does bank interest work?',
  ] : [
    'मैं हर महीने पैसे कैसे बचा सकता हूं?',
    'फिक्स्ड डिपॉजिट क्या है?',
    'मैं छोटा व्यवसाय कैसे शुरू करूं?',
    'कौन सी सरकारी योजनाएं मेरे परिवार की मदद कर सकती हैं?',
    'बैंक ब्याज कैसे काम करता है?',
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    // Add user question to conversation
    const userMessage = { role: 'user', content: question };
    setConversation(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);
    
    try {
      // Call AI API
      const response = await api.post('/ai/ask', { question: userMessage.content });
      const aiMessage = { role: 'ai', content: response.data.answer };
      setConversation(prev => [...prev, aiMessage]);
      
      // Auto-speak AI response
      setTimeout(() => speakText(response.data.answer), 500);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage = { 
        role: 'ai', 
        content: 'Sorry, I am unable to answer right now. Please try again later.' 
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleExampleClick = (exampleQ) => {
    setQuestion(exampleQ);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-105 transition-transform">
            <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
            {strings.aiAssistant}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            {strings.askQuestion}
          </p>
        </div>
        
        {/* Conversation Area */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-6 mb-6 min-h-[450px] max-h-[550px] overflow-y-auto">
          {conversation.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg font-semibold">
                {strings.exampleQuestions}:
              </p>
              <div className="space-y-3">
                {exampleQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(q)}
                    className="block w-full text-left px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-800/40 dark:hover:to-teal-800/40 rounded-xl transition-all duration-200 text-gray-800 dark:text-gray-200 font-medium border border-emerald-200 dark:border-emerald-700 hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <span className="text-emerald-600 dark:text-emerald-400 mr-2">❯</span>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <div
                      className={`flex-1 px-5 py-4 rounded-2xl shadow-md ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === 'ai' && (
                      <button
                        onClick={() => speakText(message.content)}
                        className="p-2 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-800/40 rounded-lg transition-colors"
                        title={currentLanguage === 'english' ? 'Listen to response' : 'जवाब सुनें'}
                      >
                        <FaVolumeUp className="text-emerald-600 dark:text-emerald-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-700 px-5 py-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Disclaimer */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-l-4 border-amber-500 rounded-lg px-5 py-4 mb-6 shadow-sm">
          <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
            ⚠️ {strings.aiDisclaimer}
          </p>
        </div>

        {/* Voice Controls */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 mb-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {currentLanguage === 'english' ? 'Voice Language:' : 'आवाज़ भाषा:'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSpeechLang('en-IN')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  speechLang === 'en-IN'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setSpeechLang('hi-IN')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  speechLang === 'hi-IN'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 text-red-700 dark:text-red-400 rounded-lg transition-colors"
            >
              <FaStop />
              <span className="text-sm font-medium">
                {currentLanguage === 'english' ? 'Stop' : 'रोकें'}
              </span>
            </button>
          )}
        </div>
        
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={question + interimText}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={isListening 
                ? (currentLanguage === 'english' ? '🎤 Listening... Speak now!' : '🎤 सुन रहे हैं... अब बोलें!')
                : strings.questionPlaceholder
              }
              className={`w-full px-5 py-4 pr-14 rounded-xl border-2 ${
                isListening 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
                  : 'border-emerald-300 dark:border-emerald-700 bg-white dark:bg-gray-800'
              } focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all`}
              disabled={loading}
            />
            {isListening && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></div>
                  <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg transition-all ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 scale-110'
                  : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/40'
              }`}
              disabled={loading}
              title={isListening 
                ? (currentLanguage === 'english' ? 'Click to stop recording' : 'रिकॉर्डिंग बंद करने के लिए क्लिक करें')
                : (currentLanguage === 'english' ? 'Click and speak your question' : 'क्लिक करें और अपना सवाल बोलें')
              }
            >
              {isListening ? <FaMicrophoneSlash size={18} className="animate-pulse" /> : <FaMicrophone size={18} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? strings.loading : strings.askAI}
          </button>
        </form>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIAdvisor;
