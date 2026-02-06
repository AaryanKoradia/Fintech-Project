import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { 
  FaUser, FaUsers, FaBullseye, FaRobot, FaChartLine, FaMoneyBillWave,
  FaPlus, FaTimes, FaTrash, FaCheckCircle, FaExclamationTriangle,
  FaPiggyBank, FaShoppingCart, FaBus, FaUtensils, FaBolt, FaHeart,
  FaFilm, FaGraduationCap, FaLightbulb, FaCoins, FaChild, FaRing,
  FaHome, FaCar, FaBriefcase, FaCalendarAlt
} from 'react-icons/fa';

const ExpenseTracker = () => {
  const {strings, currentLanguage } = useLanguage();
  
  // Step Management
  const [currentStep, setCurrentStep] = useState('check'); // 'check', 'profile', 'plan', 'tracker'
  const [loading, setLoading] = useState(false);
  
  // Financial Profile State
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    monthlyIncome: '',
    occupation: '',
    hasBankAccount: false,
    hasInsurance: false,
    familyMembers: [],
    lifeMilestones: []
  });
  
  // AI Plan State
  const [aiPlan, setAiPlan] = useState(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  
  // Expense Tracker State
  const [expenses, setExpenses] = useState([]);
  const [monthlyData, setMonthlyData] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Family Member Form
  const [familyMemberForm, setFamilyMemberForm] = useState({
    name: '',
    relationship: 'son',
    age: '',
    gender: 'male'
  });
  
  // Milestone Form
  const [milestoneForm, setMilestoneForm] = useState({
    goal: '',
    targetYear: new Date().getFullYear() + 1,
    estimatedCost: '',
    priority: 'medium'
  });
  
  useEffect(() => {
    checkUserProfile();
  }, []);
  
  const checkUserProfile = async () => {
    try {
      const response = await api.get('/financial-planning/profile');
      setProfile(response.data);
      setCurrentStep('plan');
      fetchAIPlan();
    } catch (error) {
      if (error.response?.status === 404) {
        setCurrentStep('profile');
      }
    }
  };
  
  const fetchAIPlan = async () => {
    try {
      const response = await api.get('/financial-planning/plan');
      setAiPlan(response.data);
      setCurrentStep('tracker');
      fetchMonthlyData();
    } catch (error) {
      if (error.response?.status === 404) {
        setCurrentStep('plan');
      }
    }
  };
  
  const fetchMonthlyData = async () => {
    try {
      const response = await api.get('/financial-planning/expenses/monthly');
      setMonthlyData(response.data);
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error('Failed to fetch monthly data:', error);
    }
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/financial-planning/profile', profileForm);
      setProfile(response.data);
      setCurrentStep('plan');
    } catch (error) {
      alert('Failed to save profile: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  const addFamilyMember = () => {
    if (familyMemberForm.name && familyMemberForm.age) {
      setProfileForm({
        ...profileForm,
        familyMembers: [...profileForm.familyMembers, { ...familyMemberForm, age: parseInt(familyMemberForm.age) }]
      });
      setFamilyMemberForm({ name: '', relationship: 'son', age: '', gender: 'male' });
    }
  };
  
  const removeFamilyMember = (index) => {
    setProfileForm({
      ...profileForm,
      familyMembers: profileForm.familyMembers.filter((_, i) => i !== index)
    });
  };
  
  const addMilestone = () => {
    if (milestoneForm.goal && milestoneForm.estimatedCost) {
      setProfileForm({
        ...profileForm,
        lifeMilestones: [...profileForm.lifeMilestones, { 
          ...milestoneForm, 
          estimatedCost: parseFloat(milestoneForm.estimatedCost), 
          targetYear: parseInt(milestoneForm.targetYear) 
        }]
      });
      setMilestoneForm({ goal: '', targetYear: new Date().getFullYear() + 1, estimatedCost: '', priority: 'medium' });
    }
  };
  
  const removeMilestone = (index) => {
    setProfileForm({
      ...profileForm,
      lifeMilestones: profileForm.lifeMilestones.filter((_, i) => i !== index)
    });
  };
  
  const generateAIPlan = async () => {
    setGeneratingPlan(true);
    try {
      const response = await api.post('/financial-planning/generate-plan');
      setAiPlan(response.data);
      setCurrentStep('tracker');
      fetchMonthlyData();
    } catch (error) {
      alert('Failed to generate AI plan: ' + (error.response?.data?.detail || error.message));
    } finally {
      setGeneratingPlan(false);
    }
  };
  
const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/financial-planning/expenses', {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      setNewExpense({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
      setShowExpenseForm(false);
      fetchMonthlyData();
    } catch (error) {
      alert('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteExpense = async (expenseId) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await api.delete(`/financial-planning/expenses/${expenseId}`);
      fetchMonthlyData();
    } catch (error) {
      alert('Failed to delete expense');
    }
  };
  
  const expenseCategories = [
    { value: 'food', label: '🍽️ Food', icon: <FaUtensils />, color: 'bg-green-500' },
    { value: 'transport', label: '🚗 Transport', icon: <FaBus />, color: 'bg-blue-500' },
    { value: 'utilities', label: '💡 Utilities', icon: <FaBolt />, color: 'bg-yellow-500' },
    { value: 'healthcare', label: '🏥 Healthcare', icon: <FaHeart />, color: 'bg-red-500' },
    { value: 'education', label: '📚 Education', icon: <FaGraduationCap />, color: 'bg-purple-500' },
    { value: 'entertainment', label: '🎬 Entertainment', icon: <FaFilm />, color: 'bg-pink-500' },
    { value: 'shopping', label: '🛍️ Shopping', icon: <FaShoppingCart />, color: 'bg-indigo-500' },
    { value: 'other', label: '📦 Other', icon: <FaMoneyBillWave />, color: 'bg-gray-500' }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      
      <main className="flex-1 px-4 md:px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
            💰 AI Financial Planner
          </h1>
          <p className="text-gray-600 text-lg">
            Smart expense tracking with personalized financial roadmap
          </p>
        </div>
        
        {/* Step Indicator */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center space-x-4">
            <StepIndicator step={1} label="Profile" active={currentStep === 'profile'} completed={profile !== null} />
            <div className="h-1 w-16 bg-gray-300"></div>
            <StepIndicator step={2} label="AI Plan" active={currentStep === 'plan'} completed={aiPlan !== null} />
            <div className="h-1 w-16 bg-gray-300"></div>
            <StepIndicator step={3} label="Track" active={currentStep === 'tracker'} completed={false} />
          </div>
        </div>
        
        {/* Loading State */}
        {currentStep === 'check' && (
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your financial profile...</p>
          </div>
        )}
        
        {/* Financial Profile Form */}
        {currentStep === 'profile' && (
          <ProfileForm
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            familyMemberForm={familyMemberForm}
            setFamilyMemberForm={setFamilyMemberForm}
            milestoneForm={milestoneForm}
            setMilestoneForm={setMilestoneForm}
            addFamilyMember={addFamilyMember}
            removeFamilyMember={removeFamilyMember}
            addMilestone={addMilestone}
            removeMilestone={removeMilestone}
            handleProfileSubmit={handleProfileSubmit}
            loading={loading}
          />
        )}
        
        {/* Generate AI Plan Screen */}
        {currentStep === 'plan' && (
          <GenerateAIPlanScreen
            profile={profile}
            generatingPlan={generatingPlan}
            onGenerate={generateAIPlan}
          />
        )}
        
        {/* Expense Tracker with AI Plan */}
        {currentStep === 'tracker' && aiPlan && monthlyData && (
          <ExpenseTrackerMain
            aiPlan={aiPlan}
            monthlyData={monthlyData}
            expenses={expenses}
            showExpenseForm={showExpenseForm}
            setShowExpenseForm={setShowExpenseForm}
            newExpense={newExpense}
            setNewExpense={setNewExpense}
            handleExpenseSubmit={handleExpenseSubmit}
            deleteExpense={deleteExpense}
            expenseCategories={expenseCategories}
            loading={loading}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

// Step Indicator Component
const StepIndicator = ({ step, label, active, completed }) => (
  <div className="flex flex-col items-center">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
      completed ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
    }`}>
      {completed ? <FaCheckCircle /> : step}
    </div>
    <span className={`mt-2 text-sm font-medium ${active ? 'text-blue-600' : 'text-gray-500'}`}>{label}</span>
  </div>
);

// Profile Form Component
const ProfileForm = ({ 
  profileForm, setProfileForm, familyMemberForm, setFamilyMemberForm,
  milestoneForm, setMilestoneForm, addFamilyMember, removeFamilyMember,
  addMilestone, removeMilestone, handleProfileSubmit, loading
}) => (
  <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
    <div className="space-y-8">
      {/* Basic Info */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaUser className="text-blue-600" /> Basic Information
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Income (₹)</label>
            <input
              type="number"
              value={profileForm.monthlyIncome}
              onChange={(e) => setProfileForm({...profileForm, monthlyIncome: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="30000"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
            <input
              type="text"
              value={profileForm.occupation}
              onChange={(e) => setProfileForm({...profileForm, occupation: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Teacher, Farmer, Business..."
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={profileForm.hasBankAccount}
              onChange={(e) => setProfileForm({...profileForm, hasBankAccount: e.target.checked})}
              className="w-5 h-5 text-blue-600"
            />
            <span className="text-gray-700">I have a Bank Account</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={profileForm.hasInsurance}
              onChange={(e) => setProfileForm({...profileForm, hasInsurance: e.target.checked})}
              className="w-5 h-5 text-blue-600"
            />
            <span className="text-gray-700">I have Insurance</span>
          </label>
        </div>
      </div>
      
      {/* Family Members */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaUsers className="text-blue-600" /> Family Members
        </h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-4">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              value={familyMemberForm.name}
              onChange={(e) => setFamilyMemberForm({...familyMemberForm, name: e.target.value})}
              className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            
            <select
              value={familyMemberForm.relationship}
              onChange={(e) => setFamilyMemberForm({...familyMemberForm, relationship: e.target.value, gender: e.target.value === 'daughter' ? 'female' : e.target.value === 'son' ? 'male' : familyMemberForm.gender})}
              className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="son">Son</option>
              <option value="daughter">Daughter</option>
              <option value="spouse">Spouse</option>
              <option value="mother">Mother</option>
              <option value="father">Father</option>
            </select>
            
            <input
              type="number"
              placeholder="Age"
              value={familyMemberForm.age}
              onChange={(e) => setFamilyMemberForm({...familyMemberForm, age: e.target.value})}
              className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            
            <button
              type="button"
              onClick={addFamilyMember}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <FaPlus /> Add
            </button>
          </div>
          
          {profileForm.familyMembers.length > 0 && (
            <div className="space-y-2">
              {profileForm.familyMembers.map((member, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{member.relationship === 'daughter' ? '👧' : member.relationship === 'son' ? '👦' : member.relationship === 'spouse' ? '💑' : '👨‍👩'}</span>
                    <div>
                      <span className="font-semibold text-gray-800">{member.name}</span>
                      <span className="text-gray-600 text-sm ml-2">({member.relationship}, Age: {member.age})</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Life Milestones */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaBullseye className="text-blue-600" /> Life Milestones & Goals
        </h2>
        
        <div className="bg-green-50 p-6 rounded-lg mb-4">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Goal (e.g., Daughter's Wedding)"
              value={milestoneForm.goal}
              onChange={(e) => setMilestoneForm({...milestoneForm, goal: e.target.value})}
              className="md:col-span-2 px-4 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
            />
            
            <input
              type="number"
              placeholder="Year"
              value={milestoneForm.targetYear}
              onChange={(e) => setMilestoneForm({...milestoneForm, targetYear: e.target.value})}
              className="px-4 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
            />
            
            <input
              type="number"
              placeholder="Cost (₹)"
              value={milestoneForm.estimatedCost}
              onChange={(e) => setMilestoneForm({...milestoneForm, estimatedCost: e.target.value})}
              className="px-4 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <select
              value={milestoneForm.priority}
              onChange={(e) => setMilestoneForm({...milestoneForm, priority: e.target.value})}
              className="px-4 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <button
              type="button"
              onClick={addMilestone}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 md:col-start-4"
            >
              <FaPlus /> Add Goal
            </button>
          </div>
          
          {profileForm.lifeMilestones.length > 0 && (
            <div className="mt-4 space-y-2">
              {profileForm.lifeMilestones.map((milestone, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {milestone.goal.toLowerCase().includes('wedding') ? '💍' : 
                       milestone.goal.toLowerCase().includes('education') ? '🎓' :
                       milestone.goal.toLowerCase().includes('house') || milestone.goal.toLowerCase().includes('home') ? '🏠' :
                       milestone.goal.toLowerCase().includes('car') ? '🚗' : '🎯'}
                    </span>
                    <div>
                      <span className="font-semibold text-gray-800">{milestone.goal}</span>
                      <span className="text-gray-600 text-sm ml-2">
                        (Year: {milestone.targetYear}, Cost: ₹{milestone.estimatedCost.toLocaleString()}, {milestone.priority} priority)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMilestone(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? 'Saving Profile...' : 'Save Profile & Continue'}
      </button>
    </div>
  </form>
);

// Generate AI Plan Screen Component
const GenerateAIPlanScreen = ({ profile, generatingPlan, onGenerate }) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto text-center">
    <div className="mb-6">
      <FaRobot className="text-6xl text-blue-600 mx-auto mb-4 animate-bounce" />
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Ready to Generate Your AI Financial Plan</h2>
      <p className="text-gray-600">
        Based on your profile, our AI will create a personalized financial roadmap with scheme recommendations and milestone planning.
      </p>
    </div>
    
    {profile && (
      <div className="bg-blue-50 p-6 rounded-xl mb-6 text-left">
        <h3 className="font-bold text-gray-800 mb-3">Your Profile Summary:</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>💰 Monthly Income: ₹{profile.monthlyIncome?.toLocaleString()}</p>
          <p>👥 Family Members: {profile.familyMembers?.length || 0}</p>
          <p>🎯 Life Goals: {profile.lifeMilestones?.length || 0}</p>
        </div>
      </div>
    )}
    
    <button
      onClick={onGenerate}
      disabled={generatingPlan}
      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {generatingPlan ? (
        <span className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          Generating AI Plan...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-3">
          <FaLightbulb /> Generate AI Financial Plan
        </span>
      )}
    </button>
  </div>
);

// Expense Tracker Main Component
const ExpenseTrackerMain = ({ 
  aiPlan, monthlyData, expenses, showExpenseForm, setShowExpenseForm,
  newExpense, setNewExpense, handleExpenseSubmit, deleteExpense, expenseCategories, loading
}) => (
  <div className="space-y-6">
    {/* Budget Summary Cards */}
    <div className="grid md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">Monthly Income</span>
          <FaMoneyBillWave className="text-2xl opacity-80" />
        </div>
        <p className="text-3xl font-bold">₹{monthlyData?.totalIncome?.toLocaleString()}</p>
      </div>
      
      <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">Total Expenses</span>
          <FaShoppingCart className="text-2xl opacity-80" />
        </div>
        <p className="text-3xl font-bold">₹{monthlyData?.totalExpenses?.toLocaleString()}</p>
      </div>
      
      <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">Remaining</span>
          <FaPiggyBank className="text-2xl opacity-80" />
        </div>
        <p className="text-3xl font-bold">₹{monthlyData?.remaining?.toLocaleString()}</p>
      </div>
      
      <div className={`bg-gradient-to-br p-6 rounded-xl shadow-lg text-white ${
        monthlyData?.budgetStatus === 'exceeded' ? 'from-red-600 to-red-800' :
        monthlyData?.budgetStatus === 'warning' ? 'from-yellow-600 to-yellow-800' :
        'from-green-600 to-green-800'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">Status</span>
          {monthlyData?.budgetStatus === 'exceeded' ? <FaExclamationTriangle className="text-2xl" /> :
           monthlyData?.budgetStatus === 'warning' ? <FaExclamationTriangle className="text-2xl" /> :
           <FaCheckCircle className="text-2xl" />}
        </div>
        <p className="text-2xl font-bold capitalize">{monthlyData?.budgetStatus}</p>
      </div>
    </div>
    
    {/* AI Recommendations & Milestone Roadmap */}
    <div className="grid md:grid-cols-2 gap-6">
      {/* Recommended Schemes */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaLightbulb className="text-yellow-500" /> Recommended Government Schemes
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {aiPlan?.recommendedSchemes && aiPlan.recommendedSchemes.length > 0 ? (
            aiPlan.recommendedSchemes.map((scheme, idx) => (
              <div key={idx} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-900 mb-1">{scheme.schemeName}</h4>
                <p className="text-sm text-gray-700 mb-2">{scheme.reason}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>💰 Benefit: {scheme.benefit}</span>
                  <span className="bg-blue-200 px-2 py-1 rounded">Priority: {scheme.priority}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No schemes recommended</p>
          )}
        </div>
      </div>
      
      {/* Milestone Roadmap Tree */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaBullseye className="text-green-500" /> Milestone Roadmap
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {aiPlan?.milestoneRoadmap && aiPlan.milestoneRoadmap.length > 0 ? (
            aiPlan.milestoneRoadmap.map((milestone, idx) => (
              <div key={idx} className="relative">
                {idx !== 0 && <div className="absolute left-6 -top-4 w-0.5 h-4 bg-gray-300"></div>}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year}
                  </div>
                  <div className="flex-1 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-bold text-green-900 mb-1">{milestone.milestone}</h4>
                    <div className="text-sm text-gray-700">
                      <p>💰 Target: ₹{milestone.targetAmount?.toLocaleString()}</p>
                      <p>📅 Save Monthly: ₹{milestone.monthlySavingNeeded?.toLocaleString()}</p>
                      {milestone.action && <p className="mt-2 text-green-700">✅ {milestone.action}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No milestones planned</p>
          )}
        </div>
      </div>
    </div>
    
    {/* AI Advice */}
    {aiPlan?.aiAdvice && (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <FaRobot className="text-purple-600" /> AI Financial Advice
        </h3>
        <div className="text-gray-700 whitespace-pre-line leading-relaxed">{aiPlan.aiAdvice}</div>
      </div>
    )}
    
    {/* Expense Form */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Daily Expense Tracker</h3>
        <button
          onClick={() => setShowExpenseForm(!showExpenseForm)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            showExpenseForm ? 'bg-gray-400 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {showExpenseForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Expense</>}
        </button>
      </div>
      
      {showExpenseForm && (
        <form onSubmit={handleExpenseSubmit} className="bg-blue-50 p-6 rounded-lg mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />
            
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Select Category</option>
              {expenseCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />
            
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      )}
      
      {/* Expense List */}
      <div className="space-y-3">
        {expenses && expenses.length > 0 ? (
          expenses.map((expense) => (
            <div key={expense._id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border-l-4 border-gray-400">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  expenseCategories.find(c => c.value === expense.category)?.color || 'bg-gray-500'
                }`}>
                  {expenseCategories.find(c => c.value === expense.category)?.icon || <FaMoneyBillWave />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-gray-800">{expense.description}</h4>
                    {expense.isUnnecessary && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <FaExclamationTriangle /> Unnecessary
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{expense.category}</span>
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">₹{expense.amount}</p>
                </div>
                <button
                  onClick={() => deleteExpense(expense._id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FaPiggyBank className="text-6xl mx-auto mb-4 opacity-30" />
            <p>No expenses added yet. Click "Add Expense" to start tracking!</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ExpenseTracker;