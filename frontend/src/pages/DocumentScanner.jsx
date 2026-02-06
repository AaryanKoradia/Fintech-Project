import { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { FaCamera, FaUpload, FaFileImage, FaCheckCircle, FaSpinner, FaTimes, FaIdCard, FaCreditCard, FaUniversity, FaMoneyBillWave, FaCalendar, FaUser, FaChartBar, FaLightbulb, FaSyncAlt } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DocumentScanner = () => {
  const { strings, currentLanguage } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setShowCamera(true);
      }
    } catch (error) {
      alert(currentLanguage === 'english' 
        ? 'Camera access denied or not available' 
        : 'कैमरा एक्सेस अस्वीकृत या उपलब्ध नहीं');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setSelectedFile(file);
        setImagePreview(canvas.toDataURL());
        stopCamera();
        setResult(null);
      }, 'image/jpeg');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setShowCamera(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert(currentLanguage === 'english' ? 'Please select an image first' : 'पहले एक फोटो चुनें');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/document-scanner/upload-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error('Upload error:', error);
      alert(currentLanguage === 'english' 
        ? 'Error analyzing document. Please try again.' 
        : 'दस्तावेज़ विश्लेषण में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getFieldIcon = (iconType) => {
    const icons = {
      'id-card': <FaIdCard className="text-orange-600" />,
      'credit-card': <FaCreditCard className="text-blue-600" />,
      'university': <FaUniversity className="text-green-600" />,
      'money': <FaMoneyBillWave className="text-yellow-600" />,
      'calendar': <FaCalendar className="text-purple-600" />,
      'user': <FaUser className="text-indigo-600" />
    };
    return icons[iconType] || <FaFileImage className="text-gray-600" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-l-4 border-[#FF9933] shadow-sm mb-6 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FF9933] flex items-center justify-center">
              <FaFileImage className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {currentLanguage === 'english' ? 'Document Scanner & Analyzer' : 'दस्तावेज़ स्कैनर और विश्लेषक'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentLanguage === 'english' 
                  ? 'Upload Aadhaar, PAN, Bank Passbook, or Scheme Details' 
                  : 'आधार, पैन, बैंक पासबुक या योजना विवरण अपलोड करें'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                {currentLanguage === 'english' ? 'Upload Document' : 'दस्तावेज़ अपलोड करें'}
              </h3>

              {!showCamera && !imagePreview && (
                <div className="space-y-3">
                  {/* File Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#FF9933] dark:hover:border-[#FF9933] transition-all bg-gray-50 dark:bg-gray-700/50 flex flex-col items-center gap-3"
                  >
                    <FaUpload className="text-4xl text-gray-400" />
                    <div className="text-center">
                      <p className="font-semibold text-gray-700 dark:text-gray-300">
                        {currentLanguage === 'english' ? 'Choose from Gallery' : 'गैलरी से चुनें'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {currentLanguage === 'english' ? 'Click to upload image' : 'फोटो अपलोड करने के लिए क्लिक करें'}
                      </p>
                    </div>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Camera Button */}
                  <button
                    onClick={handleCameraCapture}
                    className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#138808] dark:hover:border-[#138808] transition-all bg-gray-50 dark:bg-gray-700/50 flex flex-col items-center gap-3"
                  >
                    <FaCamera className="text-4xl text-gray-400" />
                    <div className="text-center">
                      <p className="font-semibold text-gray-700 dark:text-gray-300">
                        {currentLanguage === 'english' ? 'Open Camera' : 'कैमरा खोलें'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {currentLanguage === 'english' ? 'Take photo of document' : 'दस्तावेज़ की फोटो लें'}
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* Camera View */}
              {showCamera && (
                <div className="space-y-3">
                  <div className="relative bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={capturePhoto}
                      className="flex-1 px-4 py-3 bg-[#138808] hover:bg-green-700 text-white font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <FaCamera />
                      {currentLanguage === 'english' ? 'Capture' : 'फोटो लें'}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <FaTimes />
                      {currentLanguage === 'english' ? 'Cancel' : 'रद्द करें'}
                    </button>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />

              {/* Image Preview */}
              {imagePreview && !showCamera && (
                <div className="space-y-3">
                  <div className="relative border border-gray-200 dark:border-gray-700">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpload}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-[#FF9933] hover:bg-orange-700 text-white font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          {currentLanguage === 'english' ? 'Analyzing...' : 'विश्लेषण हो रहा है...'}
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          {currentLanguage === 'english' ? 'Analyze Document' : 'दस्तावेज़ का विश्लेषण करें'}
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetScanner}
                      disabled={loading}
                      className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      <FaSyncAlt />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Supported Documents */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-l-4 border-blue-600 p-4">
              <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-sm">
                {currentLanguage === 'english' ? 'Supported Documents:' : 'समर्थित दस्तावेज़:'}
              </h4>
              <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                <li>✓ {currentLanguage === 'english' ? 'Aadhaar Card (आधार कार्ड)' : 'आधार कार्ड'}</li>
                <li>✓ {currentLanguage === 'english' ? 'PAN Card (पैन कार्ड)' : 'पैन कार्ड'}</li>
                <li>✓ {currentLanguage === 'english' ? 'Bank Passbook (बैंक पासबुक)' : 'बैंक पासबुक'}</li>
                <li>✓ {currentLanguage === 'english' ? 'Scheme Details (योजना विवरण)' : 'योजना विवरण'}</li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Document Type */}
                <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-[#138808] flex items-center justify-center">
                      <FaCheckCircle className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {currentLanguage === 'english' ? 'Document Identified' : 'दस्तावेज़ पहचाना गया'}
                      </h3>
                      <p className="text-sm text-[#138808] dark:text-green-400 font-semibold">
                        {result.documentType}
                      </p>
                    </div>
                  </div>

                  {/* Structured Data Fields */}
                  {result.structuredData?.fields && result.structuredData.fields.length > 0 && (
                    <div className="space-y-2">
                      {result.structuredData.fields.map((field, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                          <div className="text-xl">
                            {getFieldIcon(field.icon)}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-600 dark:text-gray-400">{field.label}</p>
                            <p className="font-semibold text-gray-800 dark:text-white">{field.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Analysis */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-l-4 border-green-600 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-green-200 dark:border-green-800">
                    <div className="w-10 h-10 bg-green-600 flex items-center justify-center">
                      <FaLightbulb className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {currentLanguage === 'english' ? 'AI Analysis & Suggestions' : 'AI विश्लेषण और सुझाव'}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {currentLanguage === 'english' ? 'Powered by Google Gemini AI' : 'Google Gemini AI द्वारा संचालित'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed text-sm">
                      {result.aiAnalysis}
                    </p>
                  </div>
                </div>

                {/* Extracted Text */}
                <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                    <FaFileImage className="text-[#FF9933]" />
                    {currentLanguage === 'english' ? 'Extracted Text' : 'निकाला गया पाठ'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border border-gray-200 dark:border-gray-600 max-h-64 overflow-y-auto">
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                      {result.extractedText}
                    </pre>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaChartBar className="text-4xl text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-semibold">
                  {currentLanguage === 'english' 
                    ? 'Upload a document to see AI analysis' 
                    : 'AI विश्लेषण देखने के लिए दस्तावेज़ अपलोड करें'}
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  {currentLanguage === 'english' 
                    ? 'Results will appear here after scanning' 
                    : 'स्कैन करने के बाद परिणाम यहां दिखाई देंगे'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentScanner;
