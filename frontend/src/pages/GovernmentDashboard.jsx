import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import theme from '../theme';

export default function GovernmentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtMetrics, setDistrictMetrics] = useState(null);

  useEffect(() => {
    loadDashboardData();
    loadInsights();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/government/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      const response = await api.get('/analytics/insights');
      setInsights(response.data);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const loadDistrictMetrics = async (districtCode) => {
    try {
      const response = await api.get(`/analytics/districts/${districtCode}`);
      setDistrictMetrics(response.data);
      setSelectedView('district');
    } catch (error) {
      console.error('Failed to load district metrics:', error);
    }
  };

  if (loading) return <Loading />;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-[#B91C1C] bg-[#FEF2F2]';
      case 'medium': return 'text-[#D97706] bg-[#FFFBEB]';
      case 'low': return 'text-[#1E3A8A] bg-[#EFF6FF]';
      default: return 'text-[#4B5563] bg-[#F9FAFB]';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-[#111827]">Government Analytics Dashboard</h1>
          <p className="text-[#4B5563] mt-2">Real-time insights into scheme performance and beneficiary impact</p>
        </div>

        {/* View Selector */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedView('overview')}
              className={`px-6 py-2.5 rounded-lg font-medium transition ${
                selectedView === 'overview'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-[#F9FAFB] text-[#4B5563] hover:bg-[#E5E7EB]'
              }`}
            >
              📊 National Overview
            </button>
            <button
              onClick={() => setSelectedView('districts')}
              className={`px-6 py-2.5 rounded-lg font-medium transition ${
                selectedView === 'districts'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-[#F9FAFB] text-[#4B5563] hover:bg-[#E5E7EB]'
              }`}
            >
              🗺️ District Analysis
            </button>
            <button
              onClick={() => setSelectedView('insights')}
              className={`px-6 py-2.5 rounded-lg font-medium transition ${
                selectedView === 'insights'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-[#F9FAFB] text-[#4B5563] hover:bg-[#E5E7EB]'
              }`}
            >
              💡 Insights & Alerts
            </button>
          </div>
        </div>

        {/* National Overview */}
        {selectedView === 'overview' && stats && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#4B5563] text-sm">Total Villages</p>
                    <p className="text-3xl font-bold text-[#1E3A8A] mt-1">{stats.total_villages}</p>
                  </div>
                  <div className="text-4xl">🏘️</div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#4B5563] text-sm">Active Agents</p>
                    <p className="text-3xl font-bold text-[#166534] mt-1">{stats.total_agents}</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#4B5563] text-sm">Total Applications</p>
                    <p className="text-3xl font-bold text-[#1E3A8A] mt-1">{stats.total_applications}</p>
                  </div>
                  <div className="text-4xl">📋</div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#4B5563] text-sm">Approval Rate</p>
                    <p className="text-3xl font-bold text-[#166534] mt-1">
                      {stats.overall_approval_rate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>
            </div>

            {/* Beneficiaries & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <h2 className="text-xl font-bold text-[#111827] mb-4">Beneficiary Impact</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-[#F0FDF4] border border-[#D1FAE5] rounded">
                    <span className="text-[#4B5563]">Total Beneficiaries</span>
                    <span className="text-2xl font-bold text-[#166534]">{stats.total_beneficiaries}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#EFF6FF] border border-[#DBEAFE] rounded">
                    <span className="text-[#4B5563]">Applications Approved</span>
                    <span className="text-2xl font-bold text-[#1E3A8A]">{stats.total_approved}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <h2 className="text-xl font-bold text-[#111827] mb-4">Top Performing Districts</h2>
                <div className="space-y-3">
                  {stats.top_performing_districts.slice(0, 5).map((district, index) => (
                    <div
                      key={district.district_code}
                      className="flex justify-between items-center p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded hover:bg-[#FFF7ED] cursor-pointer transition"
                      onClick={() => {
                        setSelectedDistrict(district.district_code);
                        loadDistrictMetrics(district.district_code);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-[#9CA3AF]">#{index + 1}</span>
                        <span className="text-[#111827]">{district.district_code}</span>
                      </div>
                      <span className="text-[#1E3A8A] font-semibold">{district.activity_count} activities</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* District Analysis */}
        {selectedView === 'district' && districtMetrics && (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
            <button
              onClick={() => setSelectedView('districts')}
              className="mb-4 text-[#1E3A8A] hover:text-[#1E40AF] flex items-center gap-2 font-medium"
            >
              ← Back to Districts
            </button>
            <h2 className="text-2xl font-bold text-[#111827] mb-4">{districtMetrics.district_name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-[#EFF6FF] border border-[#DBEAFE] rounded">
                <p className="text-[#4B5563] text-sm">Total Villages</p>
                <p className="text-3xl font-bold text-[#1E3A8A] mt-1">{districtMetrics.total_villages}</p>
              </div>
              <div className="p-4 bg-[#F0FDF4] border border-[#D1FAE5] rounded">
                <p className="text-[#4B5563] text-sm">Population Covered</p>
                <p className="text-3xl font-bold text-[#166534] mt-1">{districtMetrics.total_population.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-[#FFF7ED] border border-[#FED7AA] rounded">
                <p className="text-[#4B5563] text-sm">Active Agents</p>
                <p className="text-3xl font-bold text-[#C2410C] mt-1">{districtMetrics.active_agents}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded">
              <p className="text-[#4B5563] text-sm">District Approval Rate</p>
              <p className="text-3xl font-bold text-[#D97706] mt-1">{districtMetrics.approval_rate.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Insights & Alerts */}
        {selectedView === 'insights' && (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#111827] mb-4">Automated Insights & Alerts</h2>
            <div className="space-y-4">
              {insights.length === 0 ? (
                <p className="text-[#9CA3AF] text-center py-8">No insights available at the moment</p>
              ) : (
                insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.priority === 'high' ? 'border-[#B91C1C] bg-[#FEF2F2]' :
                      insight.priority === 'medium' ? 'border-[#D97706] bg-[#FFFBEB]' :
                      'border-[#1E3A8A] bg-[#EFF6FF]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#111827]">{insight.title}</h3>
                        <p className="text-[#4B5563] mt-1">{insight.description}</p>
                        <p className="text-sm text-[#9CA3AF] mt-2">
                          Affected: {insight.affected_entity}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(insight.priority)}`}>
                        {insight.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
