/**
 * Basic Banking Education Module
 * Simplified UI with clean blue theme matching dashboard design
 */

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FaUniversity, FaPlay, FaCheckCircle, FaTimes, FaStar,
  FaArrowRight, FaArrowLeft, FaClock, FaFire, FaMedal,
  FaShieldAlt, FaLock, FaMobile, FaCreditCard, FaMoneyBillWave,
  FaExclamationTriangle, FaTrophy, FaGraduationCap, FaDownload,
  FaLightbulb, FaHandPointRight, FaRocket, FaBookOpen, FaRegCreditCard,
  FaPhoneAlt, FaUserShield, FaEye, FaEyeSlash, FaChevronDown,
  FaChevronUp, FaAward, FaCertificate, FaVolumeUp, FaStop, FaChartLine
} from 'react-icons/fa';

// ─── Tutorial Data ───────────────────────────────────────────────────────────
const tutorialsData = [
  {
    id: 'opening-account',
    icon: FaUniversity,
    title: { en: 'Opening a Bank Account', hi: 'बैंक खाता खोलना' },
    desc: { en: 'Learn step by step how to open your first bank account', hi: 'अपना पहला बैंक खाता खोलने का तरीका सीखें' },
    duration: { en: '5 min', hi: '5 मिनट' },
    steps: [
      {
        title: { en: 'Choose Your Bank', hi: 'अपना बैंक चुनें' },
        content: {
          en: 'Compare different banks based on: minimum balance requirements, nearby branches and ATMs, online/mobile banking availability, and fees. Government banks like SBI, PNB have low minimum balance. Private banks offer better digital services.',
          hi: 'विभिन्न बैंकों की तुलना करें: न्यूनतम शेष आवश्यकता, पास की शाखाएं और ATM, ऑनलाइन/मोबाइल बैंकिंग उपलब्धता, और शुल्क। SBI, PNB जैसे सरकारी बैंकों में कम न्यूनतम शेष। निजी बैंक बेहतर डिजिटल सेवाएं देते हैं।'
        },
        tip: { en: 'Start with a Zero Balance account if you\'re unsure about maintaining minimum balance!', hi: 'अगर न्यूनतम शेष बनाए रखने में अनिश्चित हैं तो जीरो बैलेंस खाते से शुरू करें!' },
        animation: 'bank-compare'
      },
      {
        title: { en: 'Gather Documents (KYC)', hi: 'दस्तावेज़ इकट्ठा करें (KYC)' },
        content: {
          en: 'You\'ll need these documents:\n• Aadhaar Card (mandatory)\n• PAN Card (for accounts above ₹50,000)\n• Passport-size photographs (2-3)\n• Address proof (Aadhaar/Utility bill)\n• Mobile number linked to Aadhaar',
          hi: 'आपको ये दस्तावेज़ चाहिए:\n• आधार कार्ड (अनिवार्य)\n• पैन कार्ड (₹50,000 से ऊपर के खातों के लिए)\n• पासपोर्ट साइज़ फोटो (2-3)\n• पता प्रमाण (आधार/बिजली बिल)\n• आधार से लिंक मोबाइल नंबर'
        },
        tip: { en: 'Keep photocopies of all documents ready — banks usually ask for 2 sets!', hi: 'सभी दस्तावेज़ों की फोटोकॉपी तैयार रखें — बैंक आमतौर पर 2 सेट मांगते हैं!' },
        animation: 'documents'
      },
      {
        title: { en: 'Visit the Bank & Fill Form', hi: 'बैंक जाएं और फॉर्म भरें' },
        content: {
          en: 'At the bank branch:\n1. Ask for an Account Opening Form\n2. Fill in your personal details carefully\n3. Choose account type (Savings is best for beginners)\n4. Select nomination (family member)\n5. Submit form with documents\n6. You may need to deposit an initial amount',
          hi: 'बैंक शाखा में:\n1. खाता खोलने का फॉर्म मांगें\n2. अपना व्यक्तिगत विवरण ध्यान से भरें\n3. खाता प्रकार चुनें (बचत खाता शुरुआत के लिए सबसे अच्छा)\n4. नॉमिनेशन चुनें (परिवार का सदस्य)\n5. दस्तावेज़ों के साथ फॉर्म जमा करें\n6. प्रारंभिक राशि जमा करनी पड़ सकती है'
        },
        tip: { en: 'Many banks now allow online account opening with Video KYC — no branch visit needed!', hi: 'कई बैंक अब वीडियो KYC के साथ ऑनलाइन खाता खोलने की अनुमति देते हैं — शाखा जाने की ज़रूरत नहीं!' },
        animation: 'fill-form'
      },
      {
        title: { en: 'Get Your Kit & Start Using', hi: 'अपना किट प्राप्त करें और उपयोग शुरू करें' },
        content: {
          en: 'After approval you\'ll receive:\n• Passbook — records all transactions\n• Debit Card (ATM Card) — for withdrawals\n• Cheque Book — for payments\n• Internet Banking credentials\n• Mobile Banking app details\n\nActivate your debit card and set PIN immediately!',
          hi: 'अनुमोदन के बाद आपको मिलेगा:\n• पासबुक — सभी लेनदेन का रिकॉर्ड\n• डेबिट कार्ड (ATM कार्ड) — निकासी के लिए\n• चेक बुक — भुगतान के लिए\n• इंटरनेट बैंकिंग क्रेडेंशियल\n• मोबाइल बैंकिंग ऐप विवरण\n\nअपना डेबिट कार्ड तुरंत एक्टिवेट करें और PIN सेट करें!'
        },
        tip: { en: 'Save your Customer ID and register for SMS alerts to track every transaction!', hi: 'अपना Customer ID सेव करें और हर लेनदेन को ट्रैक करने के लिए SMS अलर्ट के लिए रजिस्टर करें!' },
        animation: 'bank-kit'
      }
    ],
    quiz: [
      {
        q: { en: 'What is the most important document needed to open a bank account in India?', hi: 'भारत में बैंक खाता खोलने के लिए सबसे ज़रूरी दस्तावेज़ कौन सा है?' },
        options: {
          en: ['Driving License', 'Aadhaar Card', 'Passport', 'Voter ID'],
          hi: ['ड्राइविंग लाइसेंस', 'आधार कार्ड', 'पासपोर्ट', 'वोटर आईडी']
        },
        correct: 1
      },
      {
        q: { en: 'Which account type is best for beginners?', hi: 'शुरुआत करने वालों के लिए कौन सा खाता सबसे अच्छा है?' },
        options: {
          en: ['Current Account', 'Savings Account', 'Fixed Deposit', 'Loan Account'],
          hi: ['चालू खाता', 'बचत खाता', 'सावधि जमा', 'ऋण खाता']
        },
        correct: 1
      },
      {
        q: { en: 'What should you do immediately after receiving your debit card?', hi: 'डेबिट कार्ड मिलने के तुरंत बाद क्या करना चाहिए?' },
        options: {
          en: ['Give it to a friend', 'Activate it and set PIN', 'Keep it unused', 'Share PIN with family'],
          hi: ['दोस्त को दे दें', 'एक्टिवेट करें और PIN सेट करें', 'इस्तेमाल न करें', 'परिवार के साथ PIN शेयर करें']
        },
        correct: 1
      }
    ]
  },
  {
    id: 'using-atm',
    icon: FaCreditCard,
    title: { en: 'Using ATMs Safely', hi: 'ATM का सुरक्षित उपयोग' },
    desc: { en: 'Master ATM usage with confidence and safety', hi: 'आत्मविश्वास और सुरक्षा के साथ ATM का उपयोग सीखें' },
    duration: { en: '4 min', hi: '4 मिनट' },
    steps: [
      {
        title: { en: 'Finding & Entering an ATM', hi: 'ATM ढूंढना और प्रवेश करना' },
        content: {
          en: 'Before using an ATM:\n• Use ATMs attached to bank branches when possible\n• Check if the ATM belongs to your bank (free transactions)\n• Look for well-lit ATMs, especially at night\n• Make sure no one is standing too close behind you\n• Check the card slot for any suspicious devices',
          hi: 'ATM उपयोग करने से पहले:\n• जब संभव हो बैंक शाखा से जुड़े ATM का उपयोग करें\n• जांचें कि ATM आपके बैंक का है (मुफ्त लेनदेन)\n• अच्छी रोशनी वाले ATM देखें, खासकर रात में\n• सुनिश्चित करें कि कोई आपके पीछे बहुत करीब न खड़ा हो\n• कार्ड स्लॉट में कोई संदिग्ध उपकरण तो नहीं'
        },
        tip: { en: 'You get 5 free transactions per month at your own bank\'s ATM!', hi: 'आपको अपने बैंक के ATM पर प्रति माह 5 मुफ्त लेनदेन मिलते हैं!' },
        animation: 'atm-find'
      },
      {
        title: { en: 'Withdrawing Cash', hi: 'नकद निकालना' },
        content: {
          en: 'Step-by-step withdrawal:\n1. Insert your debit card (chip side first)\n2. Select your language\n3. Enter your 4-digit PIN (cover the keypad!)\n4. Select "Cash Withdrawal"\n5. Choose Savings Account\n6. Enter the amount\n7. Collect cash, card, and receipt\n8. Count your cash before leaving',
          hi: 'चरण-दर-चरण निकासी:\n1. अपना डेबिट कार्ड डालें (चिप वाली तरफ पहले)\n2. अपनी भाषा चुनें\n3. अपना 4-अंकीय PIN दर्ज करें (कीपैड ढकें!)\n4. "Cash Withdrawal" चुनें\n5. Savings Account चुनें\n6. राशि दर्ज करें\n7. नकद, कार्ड और रसीद लें\n8. जाने से पहले पैसे गिनें'
        },
        tip: { en: 'Always cover the keypad with your hand while entering the PIN!', hi: 'PIN दर्ज करते समय हमेशा कीपैड को हाथ से ढकें!' },
        animation: 'atm-withdraw'
      },
      {
        title: { en: 'Other ATM Services', hi: 'अन्य ATM सेवाएं' },
        content: {
          en: 'ATMs offer more than just cash:\n• Check your account balance\n• Get a mini statement (last 5-10 transactions)\n• Transfer money between accounts\n• Change your PIN\n• Deposit cash (at deposit-enabled ATMs)\n• Pay bills (at some ATMs)',
          hi: 'ATM सिर्फ नकद से ज्यादा देते हैं:\n• अपना खाता शेष जांचें\n• मिनी स्टेटमेंट लें (पिछले 5-10 लेनदेन)\n• खातों के बीच पैसे ट्रांसफर करें\n• अपना PIN बदलें\n• नकद जमा करें (जमा-सक्षम ATM पर)\n• बिल भुगतान करें (कुछ ATM पर)'
        },
        tip: { en: 'Check balance via missed call or SMS to save ATM visits. Most banks offer this free!', hi: 'मिस्ड कॉल या SMS से बैलेंस चेक करें — ATM जाने की बचत! ज़्यादातर बैंक यह मुफ्त देते हैं!' },
        animation: 'atm-services'
      }
    ],
    quiz: [
      {
        q: { en: 'How many free transactions do you get at your own bank\'s ATM per month?', hi: 'अपने बैंक के ATM पर प्रति माह कितने मुफ्त लेनदेन मिलते हैं?' },
        options: { en: ['2', '3', '5', '10'], hi: ['2', '3', '5', '10'] },
        correct: 2
      },
      {
        q: { en: 'What should you do while entering your PIN at an ATM?', hi: 'ATM पर PIN दर्ज करते समय क्या करना चाहिए?' },
        options: {
          en: ['Say it aloud to remember', 'Cover keypad with hand', 'Write it on the card', 'Ask someone to help'],
          hi: ['याद रखने के लिए बोलें', 'कीपैड को हाथ से ढकें', 'कार्ड पर लिखें', 'किसी से मदद मांगें']
        },
        correct: 1
      },
      {
        q: { en: 'Which type of ATM often charges additional fees?', hi: 'किस प्रकार का ATM अक्सर अतिरिक्त शुल्क लेता है?' },
        options: {
          en: ['Your own bank ATM', 'Other bank ATM', 'All ATMs are free', 'Government ATMs'],
          hi: ['अपने बैंक का ATM', 'दूसरे बैंक का ATM', 'सभी ATM मुफ्त हैं', 'सरकारी ATM']
        },
        correct: 1
      }
    ]
  },
  {
    id: 'mobile-banking',
    icon: FaMobile,
    title: { en: 'Mobile Banking', hi: 'मोबाइल बैंकिंग' },
    desc: { en: 'Learn to manage your money on the go', hi: 'चलते-फिरते अपने पैसे को मैनेज करना सीखें' },
    duration: { en: '6 min', hi: '6 मिनट' },
    steps: [
      {
        title: { en: 'Download & Install Banking App', hi: 'बैंकिंग ऐप डाउनलोड और इंस्टॉल करें' },
        content: {
          en: 'Getting started:\n• Go to Google Play Store or Apple App Store\n• Search for your bank\'s official app (check bank name carefully!)\n• Download only apps with high ratings and many downloads\n• Install the app on your smartphone\n• Keep your phone number registered with the bank handy',
          hi: 'शुरुआत करना:\n• Google Play Store या Apple App Store पर जाएं\n• अपने बैंक का आधिकारिक ऐप खोजें (बैंक का नाम ध्यान से जांचें!)\n• केवल उच्च रेटिंग और कई डाउनलोड वाले ऐप डाउनलोड करें\n• अपने स्मार्टफोन पर ऐप इंस्टॉल करें\n• बैंक में पंजीकृत अपना फोन नंबर तैयार रखें'
        },
        tip: { en: 'Beware of fake apps! Always download from official app stores and verify the bank name.', hi: 'नकली ऐप से सावधान! हमेशा आधिकारिक ऐप स्टोर से डाउनलोड करें और बैंक का नाम सत्यापित करें।' },
        animation: 'app-download'
      },
      {
        title: { en: 'Register & Set Up', hi: 'रजिस्टर करें और सेट अप करें' },
        content: {
          en: 'First-time setup:\n1. Open the app and select "New User" or "Register"\n2. Enter your Customer ID or Account Number\n3. Verify your mobile number (registered with bank)\n4. Create a strong Password/MPIN (4-6 digits)\n5. Set up security questions\n6. You may receive an OTP for verification',
          hi: 'पहली बार सेटअप:\n1. ऐप खोलें और "नया उपयोगकर्ता" या "रजिस्टर" चुनें\n2. अपना Customer ID या खाता नंबर दर्ज करें\n3. अपना मोबाइल नंबर सत्यापित करें (बैंक में पंजीकृत)\n4. एक मजबूत Password/MPIN बनाएं (4-6 अंक)\n5. सुरक्षा प्रश्न सेट करें\n6. सत्यापन के लिए OTP प्राप्त हो सकता है'
        },
        tip: { en: 'Use a unique MPIN that you don\'t use anywhere else. Avoid birthdays or 1234!', hi: 'एक अनोखा MPIN उपयोग करें जो आप कहीं और उपयोग नहीं करते। जन्मदिन या 1234 से बचें!' },
        animation: 'app-register'
      },
      {
        title: { en: 'Key Features & How to Use', hi: 'मुख्य विशेषताएं और उपयोग' },
        content: {
          en: 'What you can do with mobile banking:\n• Check account balance anytime\n• View transaction history (mini statement)\n• Transfer money to any bank account (UPI/NEFT/IMPS)\n• Pay bills (electricity, phone, DTH)\n• Recharge mobile & DTH\n• Block/unblock debit card if lost\n• Apply for loans or FDs',
          hi: 'मोबाइल बैंकिंग से क्या कर सकते हैं:\n• कभी भी खाता शेष जांचें\n• लेनदेन इतिहास देखें (मिनी स्टेटमेंट)\n• किसी भी बैंक खाते में पैसे ट्रांसफर करें (UPI/NEFT/IMPS)\n• बिल भुगतान करें (बिजली, फोन, DTH)\n• मोबाइल और DTH रिचार्ज करें\n• खो जाने पर डेबिट कार्ड ब्लॉक/अनब्लॉक करें\n• लोन या FD के लिए आवेदन करें'
        },
        tip: { en: 'Enable transaction alerts via SMS to get notified of every activity instantly!', hi: 'हर activity की तुरंत सूचना पाने के लिए SMS के माध्यम से लेनदेन अलर्ट सक्षम करें!' },
        animation: 'app-features'
      },
      {
        title: { en: 'Stay Safe & Secure', hi: 'सुरक्षित रहें' },
        content: {
          en: 'Security best practices:\n• Never share your MPIN, password, or OTP with anyone\n• Don\'t save passwords in your phone or browser\n• Always logout after using the app\n• Enable biometric login (fingerprint/face) if available\n• Update the app regularly\n• Use secure Wi-Fi, avoid public networks for banking\n• If phone is lost, immediately call bank to block app access',
          hi: 'सुरक्षा सर्वोत्तम प्रथाएं:\n• अपना MPIN, पासवर्ड, या OTP किसी के साथ साझा न करें\n• अपने फोन या ब्राउज़र में पासवर्ड सेव न करें\n• ऐप उपयोग करने के बाद हमेशा लॉगआउट करें\n• यदि उपलब्ध हो तो बायोमेट्रिक लॉगिन (फिंगरप्रिंट/फेस) सक्षम करें\n• ऐप को नियमित रूप से अपडेट करें\n• सुरक्षित Wi-Fi उपयोग करें, बैंकिंग के लिए सार्वजनिक नेटवर्क से बचें\n• यदि फोन खो जाए, तुरंत बैंक को कॉल करें और ऐप एक्सेस ब्लॉक करें'
        },
        tip: { en: 'Banks will NEVER ask for your password or OTP over phone or email!', hi: 'बैंक कभी भी फोन या ईमेल पर आपका पासवर्ड या OTP नहीं मांगेंगे!' },
        animation: 'security'
      }
    ],
    quiz: [
      {
        q: { en: 'What should you do first when setting up mobile banking?', hi: 'मोबाइल बैंकिंग सेट अप करते समय पहले क्या करना चाहिए?' },
        options: {
          en: ['Share your password', 'Download official bank app', 'Use public WiFi', 'Save password in phone'],
          hi: ['पासवर्ड शेयर करें', 'आधिकारिक बैंक ऐप डाउनलोड करें', 'सार्वजनिक WiFi उपयोग करें', 'फोन में पासवर्ड सेव करें']
        },
        correct: 1
      },
      {
        q: { en: 'What should you NEVER share with anyone?', hi: 'आपको किसी के साथ क्या कभी साझा नहीं करना चाहिए?' },
        options: {
          en: ['Your name', 'Your MPIN/OTP', 'Your bank\'s name', 'Your account balance'],
          hi: ['अपना नाम', 'अपना MPIN/OTP', 'अपने बैंक का नाम', 'अपना खाता शेष']
        },
        correct: 1
      },
      {
        q: { en: 'What happens if your phone gets lost?', hi: 'यदि आपका फोन खो जाए तो क्या होगा?' },
        options: {
          en: ['Nothing to worry', 'Immediately call bank to block access', 'Wait and see', 'Tell your friends'],
          hi: ['चिंता की कोई बात नहीं', 'तुरंत बैंक को कॉल करें एक्सेस ब्लॉक करने के लिए', 'प्रतीक्षा करें और देखें', 'अपने दोस्तों को बताएं']
        },
        correct: 1
      }
    ]
  }
];

// ─── Safety Tips Data ────────────────────────────────────────────────────────
const safetyTipsData = [
  {
    icon: FaShieldAlt,
    title: { en: 'Protect Your PIN', hi: 'अपना PIN सुरक्षित रखें' },
    desc: {
      en: 'Never share your ATM PIN, UPI PIN, or passwords. Cover the keypad when entering PIN.',
      hi: 'अपना ATM PIN, UPI PIN, या पासवर्ड कभी साझा न करें। PIN दर्ज करते समय कीपैड ढकें।'
    }
  },
  {
    icon: FaPhoneAlt,
    title: { en: 'Beware of Fraud Calls', hi: 'धोखाधड़ी कॉल से सावधान' },
    desc: {
      en: 'Banks never ask for OTP, PIN, or CVV over phone. Hang up if someone asks for these.',
      hi: 'बैंक कभी फोन पर OTP, PIN, या CVV नहीं मांगते। कोई मांगे तो फोन काट दें।'
    }
  },
  {
    icon: FaLock,
    title: { en: 'Use Strong Passwords', hi: 'मजबूत पासवर्ड उपयोग करें' },
    desc: {
      en: 'Create unique passwords for banking apps. Avoid birthdays, names, or simple patterns like 1234.',
      hi: 'बैंकिंग ऐप के लिए अनोखे पासवर्ड बनाएं। जन्मदिन, नाम, या 1234 जैसे सरल पैटर्न से बचें।'
    }
  },
  {
    icon: FaMobile,
    title: { en: 'Keep Phone Secure', hi: 'फोन सुरक्षित रखें' },
    desc: {
      en: 'Enable screen lock and biometric security. Update your banking apps regularly.',
      hi: 'स्क्रीन लॉक और बायोमेट्रिक सुरक्षा सक्षम करें। अपने बैंकिंग ऐप को नियमित रूप से अपडेट करें।'
    }
  },
  {
    icon: FaUserShield,
    title: { en: 'Verify Before Clicking', hi: 'क्लिक करने से पहले सत्यापित करें' },
    desc: {
      en: 'Don\'t click on suspicious links in SMS or emails claiming to be from banks.',
      hi: 'बैंक से होने का दावा करने वाले SMS या ईमेल में संदिग्ध लिंक पर क्लिक न करें।'
    }
  },
  {
    icon: FaExclamationTriangle,
    title: { en: 'Report Fraud Immediately', hi: 'धोखाधड़ी तुरंत रिपोर्ट करें' },
    desc: {
      en: 'If you notice unauthorized transactions, immediately call your bank and block your cards.',
      hi: 'यदि अनधिकृत लेनदेन दिखे, तुरंत अपने बैंक को कॉल करें और कार्ड ब्लॉक करें।'
    }
  }
];

// ─── Step Animation Component ────────────────────────────────────────────────
const StepAnimation = ({ type }) => {
  const animations = {
    'bank-compare': (
      <div className="flex justify-center gap-4 py-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-50 border border-gray-300 rounded-lg flex items-center justify-center text-primary-600">
              <FaUniversity className="text-2xl" />
            </div>
            <div className="mt-2 text-xs text-gray-600">Bank {i}</div>
          </div>
        ))}
      </div>
    ),
    'documents': (
      <div className="grid grid-cols-2 gap-4 py-6">
        {['Aadhaar', 'PAN', 'Photo', 'Address'].map((doc, i) => (
          <div key={i} className="border border-gray-300 rounded-lg p-3 text-center bg-white">
            <FaRegCreditCard className="text-primary-600 mx-auto mb-2" />
            <div className="text-xs text-gray-600">{doc}</div>
          </div>
        ))}
      </div>
    ),
    'fill-form': (
      <div className="py-6">
        <div className="bg-white border border-gray-300 rounded-lg p-4 space-y-3">
          <div className="h-2 bg-gray-200 rounded w-3/4"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
          <div className="h-2 bg-gray-200 rounded w-5/6"></div>
          <div className="h-8 bg-primary-600 rounded w-24 mt-4"></div>
        </div>
      </div>
    ),
    'bank-kit': (
      <div className="grid grid-cols-3 gap-3 py-6">
        {['Passbook', 'Card', 'Cheque'].map((item, i) => (
          <div key={i} className="border border-gray-300 rounded-lg p-3 text-center bg-primary-50">
            <div className="text-primary-600 text-sm font-medium">{item}</div>
          </div>
        ))}
      </div>
    ),
    'atm-find': (
      <div className="py-6 flex justify-center">
        <div className="w-32 h-40 bg-primary-50 border-2 border-primary-600 rounded-lg flex flex-col items-center justify-center">
          <FaCreditCard className="text-4xl text-primary-600 mb-2" />
          <div className="text-xs text-gray-600">ATM</div>
        </div>
      </div>
    ),
    'atm-withdraw': (
      <div className="py-6 space-y-3">
        {['Insert Card', 'Enter PIN', 'Select Amount', 'Collect Cash'].map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm">
              {i + 1}
            </div>
            <div className="flex-1 bg-gray-100 border border-gray-300 rounded px-3 py-2 text-sm">{step}</div>
          </div>
        ))}
      </div>
    ),
    'atm-services': (
      <div className="grid grid-cols-2 gap-3 py-6">
        {['Balance', 'Statement', 'Transfer', 'Change PIN'].map((service, i) => (
          <div key={i} className="border border-gray-300 rounded-lg p-3 text-center bg-white hover:bg-primary-50 transition-colors">
            <div className="text-sm text-gray-700">{service}</div>
          </div>
        ))}
      </div>
    ),
    'app-download': (
      <div className="py-6 flex justify-center">
        <div className="w-48 bg-white border border-gray-300 rounded-lg p-4 text-center">
          <FaMobile className="text-5xl text-primary-600 mx-auto mb-3" />
          <div className="text-sm text-gray-700 mb-2">Banking App</div>
          <div className="bg-primary-600 text-white text-xs rounded py-1">Download</div>
        </div>
      </div>
    ),
    'app-register': (
      <div className="py-6">
        <div className="bg-white border border-gray-300 rounded-lg p-4 space-y-3">
          <input type="text" placeholder={strings.placeholderCustomerId} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" readOnly />
          <input type="text" placeholder={strings.placeholderMobileNumber} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" readOnly />
          <input type="password" placeholder={strings.placeholderCreateMPIN} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" readOnly />
          <button className="w-full bg-primary-600 text-white rounded py-2 text-sm">Register</button>
        </div>
      </div>
    ),
    'app-features': (
      <div className="grid grid-cols-2 gap-3 py-6">
        {[
          { icon: FaMoneyBillWave, label: 'Transfer' },
          { icon: FaCreditCard, label: 'Cards' },
          { icon: FaLightbulb, label: 'Bills' },
          { icon: FaChartLine, label: 'Statement' }
        ].map((item, i) => (
          <div key={i} className="border border-gray-300 rounded-lg p-4 text-center bg-white">
            <item.icon className="text-2xl text-primary-600 mx-auto mb-2" />
            <div className="text-xs text-gray-600">{item.label}</div>
          </div>
        ))}
      </div>
    ),
    'security': (
      <div className="py-6">
        <div className="bg-primary-50 border border-primary-600 rounded-lg p-4 text-center">
          <FaShieldAlt className="text-4xl text-primary-600 mx-auto mb-3" />
          <div className="text-sm text-gray-700 font-medium">Security First</div>
          <div className="text-xs text-gray-600 mt-2">Your money is safe</div>
        </div>
      </div>
    )
  };

  return animations[type] || null;
};

// ─── Tutorial Modal Component ────────────────────────────────────────────────
const TutorialModal = ({ tutorial, onClose, onComplete }) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleQuizSubmit = () => {
    let score = 0;
    tutorial.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= tutorial.quiz.length * 0.7) {
      onComplete(tutorial.id, score, tutorial.quiz.length);
    }
  };

  const currentStepData = tutorial.steps[currentStep];
  const progress = ((currentStep + 1) / tutorial.steps.length) * 100;

  if (!showQuiz) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-primary-600 text-white p-6 rounded-t-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <tutorial.icon className="text-3xl" />
                <div>
                  <h2 className="text-xl font-bold">{tutorial.title[language]}</h2>
                  <p className="text-sm text-white">{tutorial.desc[language]}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-2 transition-colors">
                <FaTimes />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-xs mt-2 text-white">
              Step {currentStep + 1} of {tutorial.steps.length}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentStepData.title[language]}</h3>
            
            {/* Animation */}
            {currentStepData.animation && (
              <div className="bg-gray-50 border border-gray-300 rounded-lg mb-6">
                <StepAnimation type={currentStepData.animation} />
              </div>
            )}

            {/* Content */}
            <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5">
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {currentStepData.content[language]}
              </div>
            </div>

            {/* Tip */}
            {currentStepData.tip && (
              <div className="bg-primary-50 border border-primary-600 rounded-lg p-4 flex gap-3">
                <FaLightbulb className="text-primary-600 text-xl flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-primary-700 mb-1">
                    {language === 'en' ? 'Pro Tip' : 'सुझाव'}
                  </div>
                  <div className="text-sm text-gray-700">{currentStepData.tip[language]}</div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-300 p-4 flex justify-between rounded-b-lg">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600 hover:text-primary-600'
              }`}
            >
              <FaArrowLeft /> {language === 'en' ? 'Previous' : 'पिछला'}
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              {currentStep === tutorial.steps.length - 1
                ? (language === 'en' ? 'Take Quiz' : 'क्विज लें')
                : (language === 'en' ? 'Next' : 'अगला')
              }
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz View
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="bg-primary-600 text-white p-6 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaTrophy className="text-3xl" />
            <div>
              <h2 className="text-xl font-bold">{language === 'en' ? 'Test Your Knowledge' : 'अपना ज्ञान परखें'}</h2>
              <p className="text-sm text-white">
                {language === 'en' ? 'Answer all questions to earn your certificate' : 'अपना प्रमाणपत्र पाने के लिए सभी प्रश्नों के उत्तर दें'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-2 transition-colors">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {tutorial.quiz.map((question, qIdx) => (
            <div key={qIdx} className="bg-white border border-gray-300 rounded-lg p-5">
              <div className="font-semibold text-gray-800 mb-4 flex items-start gap-2">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">
                  {qIdx + 1}
                </span>
                <span>{question.q[language]}</span>
              </div>
              <div className="space-y-2">
                {question.options[language].map((option, oIdx) => {
                  const isSelected = quizAnswers[qIdx] === oIdx;
                  const isCorrect = oIdx === question.correct;
                  const showResult = quizSubmitted;

                  return (
                    <button
                      key={oIdx}
                      onClick={() => !quizSubmitted && handleQuizAnswer(qIdx, oIdx)}
                      disabled={quizSubmitted}
                      className={`w-full text-left p-3 rounded border transition-colors ${
                        showResult && isCorrect
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : showResult && isSelected && !isCorrect
                          ? 'bg-red-50 border-red-500 text-red-700'
                          : isSelected
                          ? 'bg-primary-50 border-primary-600 text-primary-700'
                          : 'bg-white border-gray-300 hover:border-primary-600 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            showResult && isCorrect
                              ? 'border-green-500 bg-green-500'
                              : showResult && isSelected && !isCorrect
                              ? 'border-red-500 bg-red-500'
                              : isSelected
                              ? 'border-primary-600 bg-primary-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {showResult && isCorrect && <FaCheckCircle className="text-white text-xs" />}
                          {showResult && isSelected && !isCorrect && <FaTimes className="text-white text-xs" />}
                          {isSelected && !showResult && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        {option}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {quizSubmitted && (
            <div className={`border rounded-lg p-5 ${
              quizScore >= tutorial.quiz.length * 0.7
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-center gap-3">
                {quizScore >= tutorial.quiz.length * 0.7 ? (
                  <FaTrophy className="text-3xl text-green-600" />
                ) : (
                  <FaTimes className="text-3xl text-red-600" />
                )}
                <div>
                  <div className="font-bold text-lg">
                    {language === 'en' ? 'Your Score:' : 'आपका स्कोर:'} {quizScore}/{tutorial.quiz.length}
                  </div>
                  <div className="text-sm">
                    {quizScore >= tutorial.quiz.length * 0.7
                      ? (language === 'en' ? 'Congratulations! You passed!' : 'बधाई हो! आप उत्तीर्ण हो गए!')
                      : (language === 'en' ? 'Try again to pass (70% required)' : 'उत्तीर्ण होने के लिए फिर से प्रयास करें (70% आवश्यक)')
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-300 p-4 flex justify-between rounded-b-lg">
          <button
            onClick={() => setShowQuiz(false)}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:border-primary-600 hover:text-primary-600 transition-colors"
          >
            {language === 'en' ? 'Back to Tutorial' : 'ट्यूटोरियल पर वापस जाएं'}
          </button>
          {!quizSubmitted ? (
            <button
              onClick={handleQuizSubmit}
              disabled={quizAnswers.length !== tutorial.quiz.length}
              className={`px-6 py-2 rounded transition-colors ${
                quizAnswers.length === tutorial.quiz.length
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {language === 'en' ? 'Submit Quiz' : 'क्विज जमा करें'}
            </button>
          ) : quizScore >= tutorial.quiz.length * 0.7 ? (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              {language === 'en' ? 'Get Certificate' : 'प्रमाणपत्र प्राप्त करें'}
            </button>
          ) : (
            <button
              onClick={() => {
                setQuizAnswers([]);
                setQuizSubmitted(false);
                setQuizScore(0);
              }}
              className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              {language === 'en' ? 'Retry Quiz' : 'क्विज फिर से करें'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Certificate Modal Component ─────────────────────────────────────────────
const CertificateModal = ({ tutorialTitle, score, totalQuestions, onClose }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const certificateRef = useRef();

  const handleDownload = () => {
    alert(language === 'en' ? 'Certificate download feature coming soon!' : 'प्रमाणपत्र डाउनलोड सुविधा जल्द आ रही है!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="bg-primary-600 text-white p-6 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaCertificate className="text-3xl" />
            <div>
              <h2 className="text-xl font-bold">{language === 'en' ? 'Certificate of Completion' : 'पूर्णता प्रमाणपत्र'}</h2>
              <p className="text-sm text-white">
                {language === 'en' ? 'Congratulations on your achievement!' : 'आपकी उपलब्धि पर बधाई!'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-2 transition-colors">
            <FaTimes />
          </button>
        </div>

        <div ref={certificateRef} className="p-8">
          <div className="border-4 border-primary-600 rounded-lg p-8 bg-white">
            {/* Certificate Header */}
            <div className="text-center mb-8">
              <FaTrophy className="text-6xl text-primary-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {language === 'en' ? 'Certificate of Completion' : 'पूर्णता प्रमाणपत्र'}
              </h1>
              <div className="h-1 w-32 bg-primary-600 mx-auto"></div>
            </div>

            {/* Certificate Content */}
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4">
                {language === 'en' ? 'This is to certify that' : 'यह प्रमाणित करता है कि'}
              </p>
              <h2 className="text-3xl font-bold text-primary-600 mb-4">
                {user?.name || (language === 'en' ? 'Student' : 'छात्र')}
              </h2>
              <p className="text-gray-600 mb-4">
                {language === 'en' ? 'has successfully completed the tutorial' : 'ने सफलतापूर्वक ट्यूटोरियल पूरा किया है'}
              </p>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                "{tutorialTitle}"
              </h3>
              
              {/* Score */}
              <div className="bg-primary-50 border border-primary-600 rounded-lg inline-block px-8 py-4 mb-6">
                <div className="text-sm text-gray-600 mb-1">
                  {language === 'en' ? 'Score Achieved' : 'प्राप्त स्कोर'}
                </div>
                <div className="text-4xl font-bold text-primary-600">
                  {score}/{totalQuestions}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  ({Math.round((score / totalQuestions) * 100)}%)
                </div>
              </div>

              {/* Date */}
              <p className="text-gray-600">
                {language === 'en' ? 'Completed on' : 'पूर्ण किया गया'} {new Date().toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Certificate Footer */}
            <div className="flex justify-between items-end border-t border-gray-300 pt-6">
              <div className="text-center">
                <div className="h-px w-32 bg-gray-400 mb-2"></div>
                <p className="text-sm text-gray-600">{language === 'en' ? 'Authorized Signature' : 'अधिकृत हस्ताक्षर'}</p>
              </div>
              <div className="text-center">
                <FaAward className="text-4xl text-primary-600 mx-auto" />
              </div>
              <div className="text-center">
                <div className="h-px w-32 bg-gray-400 mb-2"></div>
                <p className="text-sm text-gray-600">{language === 'en' ? 'Official Seal' : 'आधिकारिक मुहर'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-300 p-4 flex justify-center gap-3 rounded-b-lg">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            <FaDownload /> {language === 'en' ? 'Download Certificate' : 'प्रमाणपत्र डाउनलोड करें'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:border-primary-600 hover:text-primary-600 transition-colors"
          >
            {language === 'en' ? 'Close' : 'बंद करें'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function BankingEducation() {
  const { language } = useLanguage();
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [completedTutorials, setCompletedTutorials] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showCertificate, setShowCertificate] = useState(null);
  const [selectedSafetyTip, setSelectedSafetyTip] = useState(null);

  const handleTutorialComplete = (tutorialId, score, totalQuestions) => {
    if (!completedTutorials.includes(tutorialId)) {
      setCompletedTutorials([...completedTutorials, tutorialId]);
    }
    
    const tutorial = tutorialsData.find(t => t.id === tutorialId);
    const certificate = {
      tutorialId,
      tutorialTitle: tutorial.title[language],
      score,
      totalQuestions,
      completedAt: new Date()
    };
    
    setCertificates([...certificates, certificate]);
    setSelectedTutorial(null);
    setShowCertificate(certificate);
  };

  const completionRate = (completedTutorials.length / tutorialsData.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-6 py-8">
        {/* Hero Section */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-50 border border-primary-600 rounded-lg flex items-center justify-center">
              <FaGraduationCap className="text-3xl text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {language === 'en' ? 'Banking Education' : 'बैंकिंग शिक्षा'}
              </h1>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'Learn banking basics through interactive tutorials and earn certificates!'
                  : 'इंटरैक्टिव ट्यूटोरियल के माध्यम से बैंकिंग की मूल बातें सीखें और प्रमाणपत्र अर्जित करें!'}
              </p>
            </div>
          </div>

          {/* Progress Banner */}
          {completedTutorials.length > 0 && (
            <div className="bg-primary-50 border border-primary-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Your Progress' : 'आपकी प्रगति'}
                </span>
                <span className="text-sm font-bold text-primary-600">
                  {completedTutorials.length}/{tutorialsData.length} {language === 'en' ? 'Completed' : 'पूर्ण'}
                </span>
              </div>
              <div className="bg-white rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Certificate Banner */}
          {certificates.length > 0 && (
            <div className="mt-4 bg-primary-600 text-white rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaTrophy className="text-3xl" />
                <div>
                  <div className="font-bold text-white">
                    {language === 'en' ? 'Certificates Earned: ' : 'अर्जित प्रमाणपत्र: '} {certificates.length}
                  </div>
                  <div className="text-sm text-white">
                    {language === 'en' ? 'Keep learning to earn more!' : 'और जानने के लिए सीखते रहें!'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => certificates.length > 0 && setShowCertificate(certificates[certificates.length - 1])}
                className="bg-white text-primary-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
              >
                {language === 'en' ? 'View Latest' : 'नवीनतम देखें'}
              </button>
            </div>
          )}
        </div>

        {/* Tutorials Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {language === 'en' ? 'Interactive Tutorials' : 'इंटरैक्टिव ट्यूटोरियल'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorialsData.map(tutorial => {
              const isCompleted = completedTutorials.includes(tutorial.id);
              
              return (
                <div
                  key={tutorial.id}
                  className="bg-white border border-gray-300 rounded-lg p-6 hover:border-primary-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-primary-50 border border-primary-600 rounded-lg flex items-center justify-center">
                      <tutorial.icon className="text-2xl text-primary-600" />
                    </div>
                    {isCompleted && (
                      <div className="bg-green-50 border border-green-500 text-green-700 rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                        <FaCheckCircle /> {language === 'en' ? 'Completed' : 'पूर्ण'}
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2">{tutorial.title[language]}</h3>
                  <p className="text-sm text-gray-600 mb-4">{tutorial.desc[language]}</p>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-primary-600" />
                      {tutorial.duration[language]}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBookOpen className="text-primary-600" />
                      {tutorial.steps.length} {language === 'en' ? 'Steps' : 'चरण'}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTutorial(tutorial)}
                    className="w-full bg-primary-600 text-white py-3 rounded font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPlay />
                    {isCompleted
                      ? (language === 'en' ? 'Retake Tutorial' : 'ट्यूटोरियल दोबारा लें')
                      : (language === 'en' ? 'Start Tutorial' : 'ट्यूटोरियल शुरू करें')
                    }
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Tips */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <FaShieldAlt className="text-3xl text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              {language === 'en' ? 'Banking Safety Tips' : 'बैंकिंग सुरक्षा टिप्स'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyTipsData.map((tip, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedSafetyTip(selectedSafetyTip === idx ? null : idx)}
                className="bg-white border border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary-600 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 border border-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <tip.icon className="text-xl text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">{tip.title[language]}</h3>
                    <p className="text-sm text-gray-600">{tip.desc[language]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {selectedTutorial && (
        <TutorialModal
          tutorial={selectedTutorial}
          onClose={() => setSelectedTutorial(null)}
          onComplete={handleTutorialComplete}
        />
      )}

      {showCertificate && (
        <CertificateModal
          tutorialTitle={showCertificate.tutorialTitle}
          score={showCertificate.score}
          totalQuestions={showCertificate.totalQuestions}
          onClose={() => setShowCertificate(null)}
        />
      )}
    </div>
  );
}
