import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import {
  FaBook, FaLandmark, FaComments, FaPiggyBank, FaUser,
  FaCheckCircle, FaArrowRight, FaClock, FaStar
} from 'react-icons/fa';

const DailyNudges = () => {
  const { strings, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [nudgesData, setNudgesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedToday, setCompletedToday] = useState([]);

  useEffect(() => {
    fetchDailyNudges();
  }, []);

  const fetchDailyNudges = async () => {
    setLoading(true);
    try {
      const response = await api.get('/nudges/daily');
      setNudgesData(response.data);
    } catch (error) {
      console.error('Error fetching nudges:', error);
      // Fallback data when API fails
      setNudgesData({
        context: {
          greeting: {
            en: "Good Day!",
            hi: "शुभ दिन!"
          },
          message: {
            en: "Let's start your financial learning journey today!",
            hi: "आइए आज अपनी वित्तीय शिक्षा यात्रा शुरू करें!"
          }
        },
        nudges: [
          {
            id: "complete_lesson",
            type: "lesson",
            priority: "high",
            title: {
              en: "Complete your next financial lesson",
              hi: "अपना अगला वित्तीय पाठ पूरा करें"
            },
            description: {
              en: "Build your knowledge step by step",
              hi: "अपने ज्ञान को धीरे-धीरे बढ़ाएं"
            },
            icon: "book",
            action: "/user/learn",
            actionText: {
              en: "Start Learning",
              hi: "सीखना शुरू करें"
            }
          }
        ],
        confidenceScore: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNudgeAction = async (nudge) => {
    if (nudge.action) {
      navigate(nudge.action);
    }
    
    try {
      await api.post(`/nudges/complete/${nudge.id}`);
      setCompletedToday([...completedToday, nudge.id]);
    } catch (error) {
      console.error('Error completing nudge:', error);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      'book': <FaBook />,
      'landmark': <FaLandmark />,
      'comments': <FaComments />,
      'piggy-bank': <FaPiggyBank />,
      'user': <FaUser />
    };
    return icons[iconName] || <FaStar />;
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'from-red-400 to-pink-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      default: return 'from-blue-400 to-cyan-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF9933] border-t-transparent"></div>
      </div>
    );
  }

  if (!nudgesData) return null;

  const { context, nudges, confidenceScore } = nudgesData;
  const lang = currentLanguage === 'english' ? 'en' : 'hi';

  return (
    <div className="space-y-6">
      {/* Greeting Card */}
      <div className="bg-gradient-to-r from-[#FF9933]/10 via-white to-[#138808]/10 dark:from-[#FF9933]/5 dark:via-gray-800 dark:to-[#138808]/5 rounded-3xl p-6 border-2 border-[#FF9933]/30">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] bg-clip-text text-transparent mb-2">
          {context.greeting[lang]}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {context.message[lang]}
        </p>
        
        {/* Mini confidence score */}
        <div className="flex items-center gap-3 mt-4 bg-white/50 dark:bg-gray-700/50 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-500 text-xl" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {strings.confidenceScore}:
            </span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {confidenceScore}
          </span>
        </div>
      </div>

      {/* Nudges Title */}
      <div className="flex items-center gap-3">
        <FaClock className="text-2xl text-[#FF9933]" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {strings.todayActions}
        </h3>
      </div>

      {/* Nudges List */}
      <div className="grid gap-4">
        {nudges.map((nudge, idx) => {
          const isCompleted = completedToday.includes(nudge.id);
          
          return (
            <div
              key={nudge.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getPriorityColor(nudge.priority)} flex items-center justify-center text-white text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {getIcon(nudge.icon)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-1">
                    {nudge.title[lang]}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {nudge.description[lang]}
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={() => handleNudgeAction(nudge)}
                    disabled={isCompleted}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isCompleted
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gradient-to-r from-[#FF9933] to-[#138808] text-white hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <FaCheckCircle />
                        <span>{strings.done}</span>
                      </>
                    ) : (
                      <>
                        <span>{nudge.actionText[lang]}</span>
                        <FaArrowRight />
                      </>
                    )}
                  </button>
                </div>

                {/* Priority Badge */}
                {!isCompleted && (
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    nudge.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    nudge.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {nudge.priority}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Footer */}
      <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl">
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          {currentLanguage === 'english' 
            ? '💪 Complete these actions to improve your financial confidence!' 
            : '💪 अपने वित्तीय आत्मविश्वास को बढ़ाने के लिए ये कार्य पूरे करें!'}
        </p>
      </div>
    </div>
  );
};

export default DailyNudges;