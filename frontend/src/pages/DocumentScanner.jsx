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
  
  // Form field detection state
  const [scanMode, setScanMode] = useState('document'); // 'document' or 'form'
  const [formFields, setFormFields] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedField, setSelectedField] = useState(null);
  
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
      if (scanMode === 'form') {
        // Form field detection mode
        const response = await api.post('/document-scanner/detect-form-fields', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setFormFields(response.data);
        setFormData({});
      } else {
        // Document scanning mode
        const response = await api.post('/document-scanner/upload-document', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setResult(response.data);
      }
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
    setFormFields(null);
    setFormData({});
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFieldClick = (field) => {
    setSelectedField(field);
    const value = prompt(
      currentLanguage === 'english' 
        ? `Enter ${field.label}:` 
        : `${field.label} दर्ज करें:`,
      formData[field.label] || ''
    );
    
    if (value !== null) {
      setFormData(prev => ({
        ...prev,
        [field.label]: value
      }));
    }
  };

  const saveFormData = async () => {
    if (Object.keys(formData).length === 0) {
      alert(currentLanguage === 'english' 
        ? 'Please fill at least one field before saving.' 
        : 'सहेजने से पहले कम से कम एक फ़ील्ड भरें।');
      return;
    }

    try {
      const response = await api.post('/document-scanner/save-form-data', {
        form_name: 'User Form',
        fields: formData,
        image_url: formFields.image_url
      });

      alert(currentLanguage === 'english' 
        ? `✓ Form saved successfully! ${response.data.fields_count} fields saved.` 
        : `✓ फॉर्म सफलतापूर्वक सहेजा गया! ${response.data.fields_count} फ़ील्ड सहेजे गए।`);
    } catch (error) {
      console.error('Save error:', error);
      alert(currentLanguage === 'english' 
        ? 'Error saving form. Please try again.' 
        : 'फॉर्म सहेजने में त्रुटि। कृपया पुनः प्रयास करें।');
    }
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
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {currentLanguage === 'english' ? 'Document Scanner & Analyzer' : 'दस्तावेज़ स्कैनर और विश्लेषक'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentLanguage === 'english' 
                  ? 'Upload Aadhaar, PAN, Bank Passbook, or Fill Forms' 
                  : 'आधार, पैन, बैंक पासबुक अपलोड करें या फॉर्म भरें'}
              </p>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => { setScanMode('document'); resetScanner(); }}
              className={`flex-1 px-4 py-2 font-semibold transition-all ${
                scanMode === 'document'
                  ? 'bg-[#FF9933] text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {currentLanguage === 'english' ? '📄 Scan Document' : '📄 दस्तावेज़ स्कैन'}
            </button>
            <button
              onClick={() => { setScanMode('form'); resetScanner(); }}
              className={`flex-1 px-4 py-2 font-semibold transition-all ${
                scanMode === 'form'
                  ? 'bg-[#138808] text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {currentLanguage === 'english' ? '✍️ Fill Form' : '✍️ फॉर्म भरें'}
            </button>
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
                          {scanMode === 'document' 
                            ? (currentLanguage === 'english' ? 'Analyzing...' : 'विश्लेषण हो रहा है...')
                            : (currentLanguage === 'english' ? 'Detecting...' : 'पहचान रही है...')
                          }
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          {scanMode === 'document'
                            ? (currentLanguage === 'english' ? 'Analyze Document' : 'दस्तावेज़ का विश्लेषण करें')
                            : (currentLanguage === 'english' ? 'Detect Fields' : 'फ़ील्ड पहचानें')
                          }
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
            <div className="bg-primary-50 border-l-4 border-primary-600 p-4">
              <h4 className="font-bold text-gray-800 mb-2 text-sm">
                {scanMode === 'document' 
                  ? (currentLanguage === 'english' ? 'Supported Documents:' : 'समर्थित दस्तावेज़:')
                  : (currentLanguage === 'english' ? 'How it works:' : 'यह कैसे काम करता है:')
                }
              </h4>
              {scanMode === 'document' ? (
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>✓ {currentLanguage === 'english' ? 'Aadhaar Card (आधार कार्ड)' : 'आधार कार्ड'}</li>
                  <li>✓ {currentLanguage === 'english' ? 'PAN Card (पैन कार्ड)' : 'पैन कार्ड'}</li>
                  <li>✓ {currentLanguage === 'english' ? 'Bank Passbook (बैंक पासबुक)' : 'बैंक पासबुक'}</li>
                  <li>✓ {currentLanguage === 'english' ? 'Scheme Details (योजना विवरण)' : 'योजना विवरण'}</li>
                </ul>
              ) : (
                <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                  <li>1. {currentLanguage === 'english' ? 'Upload a blank form image' : 'एक खाली फॉर्म अपलोड करें'}</li>
                  <li>2. {currentLanguage === 'english' ? 'AI detects input fields' : 'AI इनपुट फ़ील्ड पहचानता है'}</li>
                  <li>3. {currentLanguage === 'english' ? 'Fill data directly on image' : 'सीधे फोटो पर डेटा भरें'}</li>
                  <li>4. {currentLanguage === 'english' ? 'Save your filled form' : 'भरे हुए फॉर्म को सहेजें'}</li>
                </ul>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {/* Form Field Detection Results */}
            {formFields && (
              <>
                <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#138808] flex items-center justify-center">
                        <FaCheckCircle className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                          {currentLanguage === 'english' ? 'Form Detected' : 'फॉर्म पहचाना गया'}
                        </h3>
                        <p className="text-sm text-[#138808] dark:text-green-400 font-semibold">
                          {formFields.fields?.length || 0} {currentLanguage === 'english' ? 'fields found' : 'फ़ील्ड मिले'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={saveFormData}
                      disabled={Object.keys(formData).length === 0}
                      className="px-4 py-2 bg-[#138808] hover:bg-green-700 text-white font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaCheckCircle />
                      {currentLanguage === 'english' ? 'Save' : 'सहेजें'}
                    </button>
                  </div>

                  {/* Interactive Form Overlay */}
                  <div className="relative border border-gray-200 dark:border-gray-700 overflow-auto max-h-[700px]">
                    <img 
                      src={formFields.image_url} 
                      alt="Form" 
                      className="w-full h-auto"
                    />
                    
                    {/* Field Label Overlays - Google Lens Style */}
                    {formFields.fields?.map((field, index) => {
                      const isFilled = formData[field.label];
                      const scaleFactor = formFields.image_width ? 1 : 1;
                      
                      return (
                        <div
                          key={index}
                          onClick={() => handleFieldClick(field)}
                          style={{
                            position: 'absolute',
                            left: `${field.bbox.x * scaleFactor}px`,
                            top: `${field.bbox.y * scaleFactor}px`,
                            width: `${field.bbox.width * scaleFactor}px`,
                            height: `${field.bbox.height * scaleFactor}px`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          className="group"
                        >
                          {/* Border Box */}
                          <div 
                            className={`w-full h-full border-2 ${
                              isFilled 
                                ? 'border-green-500 bg-green-500/10' 
                                : 'border-blue-500 bg-blue-500/5 group-hover:bg-blue-500/15'
                            } transition-all`}
                          />
                          
                          {/* Label Tag - Google Lens Style */}
                          <div 
                            className={`absolute -top-6 left-0 ${
                              isFilled 
                                ? 'bg-green-500' 
                                : 'bg-blue-500 group-hover:bg-blue-600'
                            } text-white px-2 py-1 text-xs font-semibold shadow-lg whitespace-nowrap flex items-center gap-1`}
                            style={{ fontSize: '11px' }}
                          >
                            {isFilled ? '✓' : '✎'} {field.label}
                            {isFilled && (
                              <span className="ml-1 opacity-75">
                                ({formData[field.label]?.substring(0, 15)}{formData[field.label]?.length > 15 ? '...' : ''})
                              </span>
                            )}
                          </div>
                          
                          {/* Hint Text Inside */}
                          {!isFilled && (
                            <div 
                              className="absolute inset-0 flex items-center justify-center pointer-events-none"
                              style={{ fontSize: `${Math.max(9, field.bbox.height * 0.3)}px` }}
                            >
                              <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 text-gray-600 dark:text-gray-400 font-medium border border-blue-300 group-hover:text-blue-600 transition-colors">
                                {currentLanguage === 'english' ? 'Click to fill' : 'भरने के लिए क्लिक करें'}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Field List */}
                <div className="bg-primary-50 border-l-4 border-primary-600 p-6">
                  <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center justify-between">
                    <span>{currentLanguage === 'english' ? 'Detected Fields:' : 'पहचाने गए फ़ील्ड:'}</span>
                    <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">
                      {Object.keys(formData).length}/{formFields.fields?.length || 0} {currentLanguage === 'english' ? 'filled' : 'भरे गए'}
                    </span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {formFields.fields?.map((field, index) => {
                      const isFilled = formData[field.label];
                      return (
                        <div 
                          key={index} 
                          onClick={() => handleFieldClick(field)}
                          className={`cursor-pointer transition-all border-2 p-2 ${
                            isFilled 
                              ? 'bg-green-50 border-green-500' 
                              : 'bg-white border-gray-200 hover:border-primary-600'
                          }`}
                        >
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            {isFilled ? '✓' : '○'} {field.label}
                          </p>
                          <p className={`font-semibold text-sm truncate ${
                            isFilled 
                              ? 'text-green-700' 
                              : 'text-gray-400 italic'
                          }`}>
                            {formData[field.label] || (currentLanguage === 'english' ? 'Not filled' : 'नहीं भरा')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Document Analysis Results */}
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
                <div className="bg-green-50 border-l-4 border-green-600 p-6">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-green-200">
                    <div className="w-10 h-10 bg-green-600 flex items-center justify-center">
                      <FaLightbulb className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {currentLanguage === 'english' ? 'AI Analysis & Suggestions' : 'AI विश्लेषण और सुझाव'}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {currentLanguage === 'english' ? 'Powered by Google Gemini AI' : 'Google Gemini AI द्वारा संचालित'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-green-200 p-4">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
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
                  {scanMode === 'document' 
                    ? (currentLanguage === 'english' ? 'Upload a document to see AI analysis' : 'AI विश्लेषण देखने के लिए दस्तावेज़ अपलोड करें')
                    : (currentLanguage === 'english' ? 'Upload a form to detect fields' : 'फ़ील्ड पहचानने के लिए फॉर्म अपलोड करें')
                  }
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  {scanMode === 'document'
                    ? (currentLanguage === 'english' ? 'Results will appear here after scanning' : 'स्कैन करने के बाद परिणाम यहां दिखाई देंगे')
                    : (currentLanguage === 'english' ? 'Interactive fields will appear here' : 'इंटरैक्टिव फ़ील्ड यहां दिखाई देंगे')
                  }
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
