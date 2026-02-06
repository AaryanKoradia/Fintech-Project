/**
 * AI-Powered Financial Planning & Expense Tracker
 * Complete financial management with milestone tracking
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const ExpenseTracker = () => {
  const { strings } = useLanguage();
  
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
  
  const addMilestone = () => {
    if (milestoneForm.goal && milestoneForm.estimatedCost) {
      setProfileForm({
        ...profileForm,
        lifeMilestones: [...profileForm.lifeMilestones, { ...milestoneForm, estimatedCost: parseFloat(milestoneForm.estimatedCost), targetYear: parseInt(milestoneForm.targetYear) }]
      });
      setMilestoneForm({ goal: '', targetYear: new Date().getFullYear() + 1, estimatedCost: '', priority: 'medium' });
    }
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
      fetchMonthlyData();
    } catch (error) {
      alert('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteExpense = async (expenseId) => {
    try {
      await api.delete(`/financial-planning/expenses/${expenseId}`);
      fetchMonthlyData();
    } catch (error) {
      alert('Failed to delete expense');
    }
  };
  
  const expenseCategories = [
    { value: 'food', label: '🍽️ Food & Groceries', color: 'bg-green-100 text-green-800' },
    { value: 'transport', label: '🚗 Transportation', color: 'bg-blue-100 text-blue-800' },
    { value: 'utilities', label: '💡 Utilities', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'healthcare', label: '🏥 Healthcare', color: 'bg-red-100 text-red-800' },
    { value: 'education', label: '📚 Education', color: 'bg-purple-100 text-purple-800' },
    { value: 'entertainment', label: '🎬 Entertainment', color: 'bg-pink-100 text-pink-800' },
    { value: 'shopping', label: '🛍️ Shopping', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'other', label: '📦 Other', color: 'bg-gray-100 text-gray-800' }
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
            <div className="h-1 w-12 bg-gray-300"></div>
            <StepIndicator step={2} label="AI Plan" active={currentStep === 'plan'} completed={aiPlan !== null} />
            <div className="h-1 w-12 bg-gray-300"></div>
            <StepIndicator step={3} label="Track" active={currentStep === 'tracker'} completed={false} />
          </div>
        </div>
        
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
            addMilestone={addMilestone}
            handleProfileSubmit={handleProfileSubmit}
            loading={loading}
          />
        )}
        
        {currentStep === 'plan' && (
          <GenerateAIPlanScreen
            profile={profile}
            generatingPlan={generatingPlan}
            onGenerate={generateAIPlan}
          />
        )}
        
        {currentStep === 'tracker' && aiPlan && monthlyData && (
          <ExpenseTrackerMain
            aiPlan={aiPlan}
            monthlyData={monthlyData}
            expenses={expenses}
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

// Component exports truncated for brevity - see full version in next message
export default ExpenseTracker;
