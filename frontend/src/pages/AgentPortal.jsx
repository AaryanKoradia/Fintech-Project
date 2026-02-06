import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import theme from '../theme';

export default function AgentPortal() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scorecard, setScorecard] = useState(null);
  const [agentProfile, setAgentProfile] = useState(null);
  const [actionHistory, setActionHistory] = useState([]);
  const [assistedApplications, setAssistedApplications] = useState([]);
  const [geoLocation, setGeoLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('scorecard');

  useEffect(() => {
    loadAgentData();
    requestGeolocation();
  }, []);

  const loadAgentData = async () => {
    try {
      setLoading(true);
      
      // Load agent profile
      const profileResponse = await api.get('/agents/me');
      setAgentProfile(profileResponse.data);

      // Load scorecard
      const scorecardResponse = await api.get(`/agents/scorecard/${user.id}`);
      setScorecard(scorecardResponse.data);

      // Load action history
      const actionsResponse = await api.get('/agents/actions/my-history?days=30');
      setActionHistory(actionsResponse.data.actions || []);

      // Load assisted applications
      const appsResponse = await api.get('/applications/agent/assisted');
      setAssistedApplications(appsResponse.data.applications || []);
    } catch (error) {
      console.error('Failed to load agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.warn('Geolocation permission denied:', error);
        }
      );
    }
  };

  const logAgentAction = async (actionType, villageCode, userId, schemeId, metadata = {}) => {
    try {
      await api.post('/agents/actions', {
        action_type: actionType,
        village_code: villageCode,
        user_id: userId,
        scheme_id: schemeId,
        geo_location: geoLocation,
        metadata
      });
      
      // Reload data
      loadAgentData();
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  };

  if (loading) return <Loading />;

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-[#F0FDF4] text-[#166534]';
      case 'pending': return 'bg-[#FFFBEB] text-[#D97706]';
      case 'rejected': return 'bg-[#FEF2F2] text-[#B91C1C]';
      case 'delivered': return 'bg-[#EFF6FF] text-[#1E3A8A]';
      default: return 'bg-[#F9FAFB] text-[#4B5563]';
    }
  };

  const getPerformanceLevel = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-[#166534]', emoji: '🌟' };
    if (score >= 60) return { label: 'Good', color: 'text-[#1E3A8A]', emoji: '👍' };
    if (score >= 40) return { label: 'Average', color: 'text-[#D97706]', emoji: '📊' };
    return { label: 'Needs Improvement', color: 'text-[#B91C1C]', emoji: '📈' };
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#111827]">Agent Portal</h1>
              <p className="text-[#4B5563] mt-2">Welcome, {agentProfile?.full_name}</p>
              <div className="flex gap-4 mt-3">
                <span className="text-sm text-[#9CA3AF]">Type: <strong className="text-[#111827]">{agentProfile?.agent_type}</strong></span>
                <span className="text-sm text-[#9CA3AF]">Village: <strong className="text-[#111827]">{agentProfile?.assigned_villages?.[0] || 'Not assigned'}</strong></span>
              </div>
            </div>
            
            {geoLocation ? (
              <div className="text-[#166534] bg-[#F0FDF4] border border-[#D1FAE5] px-4 py-2 rounded-lg">
                📍 Location Active
              </div>
            ) : (
              <div className="text-[#D97706] bg-[#FFFBEB] border border-[#FDE68A] px-4 py-2 rounded-lg">
                📍 Location Off
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('scorecard')}
              className={`px-6 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'scorecard'
                  ? 'bg-[#C2410C] text-white'
                  : 'bg-[#F9FAFB] text-[#4B5563] hover:bg-[#FFF7ED]'
              }`}
            >
              📊 Performance Scorecard
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'applications'
                  ? 'bg-[#C2410C] text-white'
                  : 'bg-[#F9FAFB] text-[#4B5563] hover:bg-[#FFF7ED]'
              }`}
            >
              📋 Assisted Applications
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'history'
                  ? 'bg-[#C2410C] text-white'
                  : 'bg-[#F9FAFB] text-[#4B5563] hover:bg-[#FFF7ED]'
              }`}
            >
              📜 Action History
            </button>
          </div>
        </div>

        {/* Performance Scorecard */}
        {activeTab === 'scorecard' && scorecard && (
          <>
            {/* Overall Performance */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-[#111827] mb-4">Overall Performance</h2>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-[#C2410C]">
                    {scorecard.performance_score.toFixed(0)}
                  </div>
                  <p className="text-[#9CA3AF] mt-2">Performance Score</p>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-[#F9FAFB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C2410C]"
                      style={{ width: `${scorecard.performance_score}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-3xl">{getPerformanceLevel(scorecard.performance_score).emoji}</span>
                    <span className={`text-lg font-semibold ${getPerformanceLevel(scorecard.performance_score).color}`}>
                      {getPerformanceLevel(scorecard.performance_score).label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <p className="text-[#9CA3AF] text-sm">Villagers Assisted</p>
                <p className="text-3xl font-bold text-[#C2410C] mt-1">{scorecard.villagers_assisted}</p>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <p className="text-[#9CA3AF] text-sm">Applications Submitted</p>
                <p className="text-3xl font-bold text-[#1E3A8A] mt-1">{scorecard.applications_submitted}</p>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <p className="text-[#9CA3AF] text-sm">Applications Approved</p>
                <p className="text-3xl font-bold text-[#166534] mt-1">{scorecard.applications_approved}</p>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <p className="text-[#9CA3AF] text-sm">Approval Rate</p>
                <p className="text-3xl font-bold text-[#D97706] mt-1">{scorecard.approval_rate.toFixed(1)}%</p>
              </div>
            </div>

            {/* Completion Time & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#111827] mb-3">Avg. Completion Time</h3>
                <p className="text-4xl font-bold text-[#C2410C]">{scorecard.avg_completion_time_hours.toFixed(1)} hrs</p>
                <p className="text-[#9CA3AF] mt-2">Time from application to approval</p>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#111827] mb-3">Last Activity</h3>
                <p className="text-lg text-[#4B5563]">{new Date(scorecard.last_activity).toLocaleDateString()}</p>
                <p className="text-[#9CA3AF] mt-2">{new Date(scorecard.last_activity).toLocaleTimeString()}</p>
              </div>
            </div>
          </>
        )}

        {/* Assisted Applications */}
        {activeTab === 'applications' && (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#111827] mb-4">Applications You've Assisted</h2>
            {assistedApplications.length === 0 ? (
              <p className="text-[#9CA3AF] text-center py-8">No applications assisted yet</p>
            ) : (
              <div className="space-y-4">
                {assistedApplications.map((app) => (
                  <div key={app.id} className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#C2410C] hover:bg-[#FFF7ED] transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#111827]">{app.scheme_id}</h3>
                        <p className="text-sm text-[#4B5563] mt-1">Village: {app.village_code}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action History */}
        {activeTab === 'history' && (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#111827] mb-4">Your Action History (Last 30 Days)</h2>
            {actionHistory.length === 0 ? (
              <p className="text-[#9CA3AF] text-center py-8">No actions recorded yet</p>
            ) : (
              <div className="space-y-3">
                {actionHistory.map((action, index) => (
                  <div key={action.id || index} className="border-l-4 border-[#C2410C] pl-4 py-2 bg-[#FFF7ED] rounded-r">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-[#111827]">{action.action_type}</p>
                        <p className="text-sm text-[#4B5563] mt-1">Village: {action.village_code}</p>
                        {action.geo_location && (
                          <p className="text-xs text-[#166534] mt-1">
                            📍 Location verified ({action.geo_location.accuracy}m accuracy)
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-[#9CA3AF]">
                        {new Date(action.timestamp).toLocaleDateString()} {new Date(action.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
