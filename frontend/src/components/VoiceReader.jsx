import React, { useState, useEffect, useRef } from 'react';
import { FaVolumeUp, FaStop, FaPause, FaPlay, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const VoiceReader = () => {
  const { currentLanguage } = useLanguage();
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [supportsSpeech, setSupportsSpeech] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setSupportsSpeech(false);
      console.warn('Speech synthesis not supported in this browser');
    }

    return () => {
      // Cleanup: stop any ongoing speech when component unmounts
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text, language = 'hi-IN') => {
    if (!supportsSpeech || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
      setCurrentText(text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    };

    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
      setCurrentText('');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsReading(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const readSelectedText = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
      const language = currentLanguage === 'hindi' ? 'hi-IN' : 'en-US';
      speak(selectedText, language);
      setIsExpanded(true);
    }
  };

  const readPageContent = () => {
    // Find main content area and read it
    const mainContent = document.querySelector('main') || document.body;
    
    // Get all text content, excluding script and style tags
    const textElements = mainContent.querySelectorAll('h1, h2, h3, p, li, button, label, span');
    let textToRead = '';
    
    textElements.forEach(element => {
      const text = element.textContent.trim();
      if (text && !element.closest('script') && !element.closest('style')) {
        textToRead += text + '. ';
      }
    });

    if (textToRead) {
      const language = currentLanguage === 'hindi' ? 'hi-IN' : 'en-US';
      speak(textToRead.substring(0, 500), language); // Read first 500 chars
      setIsExpanded(true);
    }
  };

  const togglePause = () => {
    if (!supportsSpeech) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stopReading = () => {
    if (!supportsSpeech) return;

    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setCurrentText('');
  };

  const handleMainButtonClick = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (isReading) {
      if (isExpanded) {
        stopReading();
      } else {
        setIsExpanded(true);
      }
    } else if (selectedText) {
      readSelectedText();
    } else {
      setIsExpanded(true);
    }
  };

  const readButtonText = () => {
    const text = currentLanguage === 'hindi' 
      ? 'टेक्स्ट चुनें और बटन दबाएं या पेज पढ़ें बटन दबाएं' 
      : 'Select text and press button or press Read Page button';
    speak(text, currentLanguage === 'hindi' ? 'hi-IN' : 'en-US');
  };

  if (!supportsSpeech) {
    return null; // Don't render if speech is not supported
  }

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* Expanded Controls */}
      {isExpanded && (
        <div className="mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border border-gray-200 dark:border-gray-700 animate-fade-in max-w-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FaVolumeUp className="text-blue-600 dark:text-blue-400 text-sm" />
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {currentLanguage === 'hindi' ? 'वॉइस रीडर' : 'Voice Reader'}
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
              aria-label="Close"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {currentText && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 mb-3">
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                {currentText}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {isReading ? (
              <>
                <button
                  onClick={togglePause}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all text-sm font-medium shadow-sm"
                  aria-label={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <FaPlay className="text-xs" /> : <FaPause className="text-xs" />}
                  <span>
                    {isPaused 
                      ? (currentLanguage === 'hindi' ? 'जारी रखें' : 'Resume')
                      : (currentLanguage === 'hindi' ? 'रोकें' : 'Pause')}
                  </span>
                </button>
                <button
                  onClick={stopReading}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all text-sm font-medium shadow-sm"
                  aria-label="Stop"
                >
                  <FaStop className="text-xs" />
                  <span>
                    {currentLanguage === 'hindi' ? 'बंद करें' : 'Stop'}
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={readPageContent}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all text-sm font-medium shadow-sm"
                aria-label="Read page"
              >
                <FaVolumeUp className="text-xs" />
                <span>
                  {currentLanguage === 'hindi' ? 'पेज पढ़ें' : 'Read Page'}
                </span>
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center leading-tight">
            {currentLanguage === 'hindi' 
              ? isReading ? 'सुन रहे हैं...' : 'टेक्स्ट चुनें या पेज पढ़ें बटन दबाएं' 
              : isReading ? 'Now reading...' : 'Select text or press Read Page'}
          </p>
        </div>
      )}

      {/* Main Voice Button */}
      <button
        onClick={handleMainButtonClick}
        onDoubleClick={readButtonText}
        className={`group w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isReading
            ? 'bg-blue-600 hover:bg-blue-700 scale-110'
            : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
        } text-white hover:shadow-xl active:scale-95 border-2 border-white dark:border-gray-800 relative`}
        aria-label={currentLanguage === 'hindi' 
          ? 'टेक्स्ट को सुनने के लिए चुनें' 
          : 'Select text to listen'}
      >
        <FaVolumeUp className={`text-xl transition-transform ${isReading ? 'animate-pulse' : 'group-hover:scale-110'}`} />
        
        {/* Active Indicator */}
        {isReading && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
        )}
      </button>
      
      {/* Language Badge */}
      <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-gray-700 dark:bg-gray-600 text-white text-xs font-semibold rounded-full shadow-sm">
        {currentLanguage === 'hindi' ? 'हि' : 'EN'}
      </div>
    </div>
  );
};

export default VoiceReader;
