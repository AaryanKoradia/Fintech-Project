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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 px-6 py-8 w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-primary-50 border border-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform">
            <svg className="w-11 h-11 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            {strings.aiAssistant}
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            {strings.askQuestion}
          </p>
        </div>
        
        {/* Conversation Area */}
        <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6 min-h-[450px] max-h-[550px] overflow-y-auto">
          {conversation.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 mb-8 text-lg font-semibold">
                {strings.exampleQuestions}:
              </p>
              <div className="space-y-3">
                {exampleQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(q)}
                    className="block w-full text-left px-6 py-4 bg-white hover:bg-primary-50 rounded-lg transition-all duration-200 text-gray-800 font-medium border border-gray-300 hover:border-primary-600"
                  >
                    <span className="text-primary-600 mr-2">❯</span>
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
                      className={`flex-1 px-5 py-4 rounded-lg border ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-800 border-gray-300'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === 'ai' && (
                      <button
                        onClick={() => speakText(message.content)}
                        className="p-2 bg-primary-50 hover:bg-primary-100 border border-gray-300 rounded-lg transition-colors"
                        title={currentLanguage === 'english' ? 'Listen to response' : 'जवाब सुनें'}
                      >
                        <FaVolumeUp className="text-primary-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white px-5 py-4 rounded-lg border border-gray-300">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Disclaimer */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg px-5 py-4 mb-6">
          <p className="text-sm text-amber-900 font-medium">
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
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded-lg transition-colors"
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
              className={`w-full px-5 py-4 pr-14 rounded-lg border-2 ${
                isListening 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 bg-white'
              } focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-gray-900 placeholder-gray-500 transition-all`}
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
                  ? 'bg-red-500 text-white'
                  : 'bg-primary-50 border border-primary-600 text-primary-600 hover:bg-primary-100'
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
            className="px-8 py-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
