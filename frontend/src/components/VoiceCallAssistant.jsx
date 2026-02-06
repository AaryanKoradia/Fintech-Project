/**
 * Voice Call Assistant Component
 * Shows the Exotel phone number and call instructions
 */

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaPhone, FaHeadset, FaInfoCircle, FaTimes, FaMicrophone } from 'react-icons/fa';

const VoiceCallAssistant = () => {
  const { currentLanguage } = useLanguage();
  const [showInfo, setShowInfo] = useState(false);
  
  // Your Exotel number - Update this with your actual Exotel number
  const EXOTEL_NUMBER = "+91-9513886363"; // Replace with your Exotel virtual number
  const WEBHOOK_URL = "https://zola-cathectic-oralia.ngrok-free.dev/api/voice-call/incoming-call";
  
  const content = {
    english: {
      title: "AI Voice Assistant",
      subtitle: "Speak to our AI for instant help",
      callButton: "Call Now",
      number: "Helpline Number",
      infoTitle: "How it works",
      steps: [
        "Call our helpline number",
        "Listen to the welcome message",
        "Speak your question in Hindi or English",
        "Press # when done speaking",
        "Get instant AI-powered answers"
      ],
      topics: "Ask about: Banking, Savings, Government Schemes, Budgeting, and more!",
      cost: "Standard call rates apply",
      availability: "Available 24/7"
    },
    hindi: {
      title: "AI वॉइस असिस्टेंट",
      subtitle: "तुरंत मदद के लिए हमारे AI से बात करें",
      callButton: "अभी कॉल करें",
      number: "हेल्पलाइन नंबर",
      infoTitle: "यह कैसे काम करता है",
      steps: [
        "हमारे हेल्पलाइन नंबर पर कॉल करें",
        "स्वागत संदेश सुनें",
        "हिंदी या अंग्रेजी में अपना सवाल बोलें",
        "बोलने के बाद # दबाएं",
        "AI द्वारा तुरंत जवाब पाएं"
      ],
      topics: "पूछें: बैंकिंग, बचत, सरकारी योजनाएं, बजट, और बहुत कुछ!",
      cost: "सामान्य कॉल दरें लागू",
      availability: "24/7 उपलब्ध"
    }
  };
  
  const lang = currentLanguage === 'english' ? content.english : content.hindi;
  
  return (
    <>
      {/* Main Card */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 hover:border-primary-600 transition-colors">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-14 h-14 bg-primary-50 border-2 border-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <FaHeadset className="text-2xl text-primary-600" />
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{lang.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{lang.subtitle}</p>
            
            {/* Phone Number */}
            <div className="bg-primary-50 border border-primary-600 rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-600 mb-1">{lang.number}</div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-primary-600" />
                <a 
                  href={`tel:${EXOTEL_NUMBER}`}
                  className="text-lg font-bold text-primary-600 hover:text-primary-700"
                >
                  {EXOTEL_NUMBER}
                </a>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <a
                href={`tel:${EXOTEL_NUMBER}`}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <FaPhone />
                {lang.callButton}
              </a>
              
              <button
                onClick={() => setShowInfo(true)}
                className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-3 rounded-lg hover:border-primary-600 hover:text-primary-600 transition-colors"
              >
                <FaInfoCircle />
              </button>
            </div>
            
            {/* Quick Info */}
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <FaMicrophone className="text-primary-600" />
                {lang.availability}
              </div>
              <div>•</div>
              <div>{lang.cost}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{lang.infoTitle}</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            {/* Steps */}
            <div className="space-y-3 mb-6">
              {lang.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
            
            {/* Topics */}
            <div className="bg-primary-50 border border-primary-600 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong className="text-primary-600">💡 </strong>
                {lang.topics}
              </p>
            </div>
            
            {/* Webhook URL for Exotel Setup */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Exotel Webhook URL:</p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-white px-2 py-1 rounded border flex-1 overflow-x-auto">
                  {WEBHOOK_URL}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(WEBHOOK_URL);
                    alert('Webhook URL copied!');
                  }}
                  className="text-xs bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
                >
                  Copy
                </button>
              </div>
            </div>
            
            {/* Call Button */}
            <a
              href={`tel:${EXOTEL_NUMBER}`}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <FaPhone />
              {lang.callButton}
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceCallAssistant;
