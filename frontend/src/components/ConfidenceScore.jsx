/**
 * Confidence Score Component
 * Displays financial confidence score with visual indicators
 * Shows score breakdown and improvement suggestions
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { 
  FaTrophy, FaStar, FaFire, FaMedal, FaChartLine, 
  FaBook, FaLandmark, FaComments, FaRocket,
  FaCheckCircle, FaArrowUp
} from 'react-icons/fa';

const ConfidenceScore = ({ compact = false }) => {
  const { strings, currentLanguage } = useLanguage();
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfidenceScore();
  }, []);

  const fetchConfidenceScore = async () => {
    setLoading(true);
    try {
      const response = await api.get('/confidence/score');
      setScoreData(response.data);
    } catch (error) {
      console.error('Error fetching confidence score:', error);
      // Fallback data when API fails
      setScoreData({
        score: {
          totalScore: 10,
          level: "low",
          breakdown: {
            lessonsScore: 10,
            schemesScore: 0,
            practiceScore: 0,
            engagementScore: 20
          }
        },
        suggestions: [
          {
            type: "lessons",
            priority: "high",
            action: "complete_lessons"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF9933] border-t-transparent"></div>
      </div>
    );
  }

  if (!scoreData) return null;

  const { score, suggestions } = scoreData;
  const { totalScore, level, breakdown } = score;

  const getLevelIcon = () => {
    switch(level) {
      case 'expert': return <FaTrophy className="text-4xl text-yellow-500" />;
      case 'high': return <FaMedal className="text-4xl text-purple-500" />;
      case 'medium': return <FaStar className="text-4xl text-blue-500" />;
      default: return <FaRocket className="text-4xl text-green-500" />;
    }
  };

  const getLevelText = () => {
    switch(level) {
      case 'expert': return strings.expertConfidence;
      case 'high': return strings.highConfidence;
      case 'medium': return strings.mediumConfidence;
      default: return strings.lowConfidence;
    }
  };

  const getLevelColor = () => {
    switch(level) {
      case 'expert': return 'from-yellow-400 to-orange-500';
      case 'high': return 'from-purple-400 to-pink-500';
      case 'medium': return 'from-blue-400 to-cyan-500';
      default: return 'from-green-400 to-emerald-500';
    }
  };

  // Compact view for dashboard
  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {strings.confidenceScore}
          </h3>
          {getLevelIcon()}
        </div>
        
        <div className="mb-4">
          <div className="flex items-end gap-2 mb-2">
            <span className={`text-5xl font-bold bg-gradient-to-r ${getLevelColor()} bg-clip-text text-transparent`}>
              {totalScore}
            </span>
            <span className="text-2xl text-gray-500 dark:text-gray-400 mb-2">/100</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getLevelText()}
          </p>
        </div>

        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getLevelColor()} rounded-full transition-all duration-500`}
            style={{ width: `${totalScore}%` }}
          ></div>
        </div>
      </div>
    );
  }

  // Full detailed view
  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FF9933]/20 to-[#138808]/20 rounded-full flex items-center justify-center animate-pulse">
              {getLevelIcon()}
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {strings.yourConfidence}
          </h2>
          
          <div className="flex items-end justify-center gap-2 mb-2">
            <span className={`text-6xl font-bold bg-gradient-to-r ${getLevelColor()} bg-clip-text text-transparent`}>
              {totalScore}
            </span>
            <span className="text-3xl text-gray-500 dark:text-gray-400 mb-2">/100</span>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
            {getLevelText()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
          <div 
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getLevelColor()} rounded-full transition-all duration-1000 animate-shimmer`}
            style={{ width: `${totalScore}%` }}
          ></div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaChartLine className="text-[#FF9933]" />
          {strings.scoreBreakdown}
        </h3>

        <div className="space-y-4">
          {/* Lessons Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FaBook className="text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {strings.lessonsScore}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                {breakdown.lessonsScore}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.lessonsScore}%` }}
              ></div>
            </div>
          </div>

          {/* Schemes Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FaLandmark className="text-purple-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {strings.schemesScore}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                {breakdown.schemesScore}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.schemesScore}%` }}
              ></div>
            </div>
          </div>

          {/* Practice Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FaComments className="text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {strings.practiceScore}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                {breakdown.practiceScore}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.practiceScore}%` }}
              ></div>
            </div>
          </div>

          {/* Engagement Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FaFire className="text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {strings.engagementScore}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                {breakdown.engagementScore}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.engagementScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="bg-gradient-to-r from-[#FF9933]/10 to-[#138808]/10 rounded-3xl p-6 border-2 border-[#FF9933]/30">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FaArrowUp className="text-[#138808]" />
            {strings.improveScore}
          </h3>

          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl"
              >
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {suggestion.type === 'lessons' && strings.nudgeCompleteLesson}
                    {suggestion.type === 'schemes' && strings.nudgeCheckScheme}
                    {suggestion.type === 'practice' && strings.nudgePracticeBank}
                    {suggestion.type === 'engagement' && strings.nudgeDailySaving}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                  suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {suggestion.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfidenceScore;