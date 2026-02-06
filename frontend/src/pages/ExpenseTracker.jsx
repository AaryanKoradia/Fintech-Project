import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { FaPen, FaTrash, FaChartPie, FaLightbulb, FaCalendar, FaShoppingCart, FaBus, FaUtensils, FaBolt, FaHeart, FaFilm, FaGraduationCap, FaEllipsisH, FaRupeeSign, FaPiggyBank, FaCheckCircle, FaTimes, FaMoneyBillWave, FaSave, FaListAlt, FaPlus, FaTrashAlt, FaChartBar } from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseTracker = () => {
  const { strings, currentLanguage } = useLanguage();
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');

  useEffect(() => {
    fetchExpenses();
    fetchAnalytics();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses/list?days=30');
      setExpenses(response.data.expenses || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/expenses/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    if (!amount || !description) {
      alert(currentLanguage === 'english' ? 'Please fill all fields' : 'सभी फील्ड भरें');
      return;
    }

    setLoading(true);
    try {
      await api.post('/expenses/add', {
        amount: parseFloat(amount),
        description,
        category
      });
      
      setAmount('');
      setDescription('');
      setCategory('food');
      setShowAddForm(false);
      
      fetchExpenses();
      fetchAnalytics();
      
      alert(strings.expenseAdded);
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (index) => {
    if (!confirm(currentLanguage === 'english' ? 'Delete this expense?' : 'यह खर्च हटाएं?')) {
      return;
    }

    try {
      await api.delete(`/expenses/${index}`);
      fetchExpenses();
      fetchAnalytics();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const getCategoryIcon = (cat) => {
    const icons = {
      food: <FaUtensils className="text-lg" />,
      transport: <FaBus className="text-lg" />,
      shopping: <FaShoppingCart className="text-lg" />,
      bills: <FaBolt className="text-lg" />,
      healthcare: <FaHeart className="text-lg" />,
      entertainment: <FaFilm className="text-lg" />,
      education: <FaGraduationCap className="text-lg" />,
      others: <FaMoneyBillWave className="text-lg" />
    };
    return icons[cat] || icons.others;
  };

  const getCategoryName = (cat) => {
    const names = {
      food: strings.foodDrinks,
      transport: strings.transport,
      shopping: strings.shopping,
      bills: strings.bills,
      healthcare: strings.healthcare,
      entertainment: strings.entertainment,
      education: strings.education,
      others: strings.others
    };
    return names[cat] || cat;
  };

  const getCategoryColor = (cat) => {
    const colors = {
      food: 'bg-orange-600',
      transport: 'bg-blue-600',
      shopping: 'bg-purple-600',
      bills: 'bg-yellow-600',
      healthcare: 'bg-red-600',
      entertainment: 'bg-indigo-600',
      education: 'bg-green-600',
      others: 'bg-gray-600'
    };
    return colors[cat] || colors.others;
  };

  const getChartColor = (cat) => {
    const colors = {
      food: '#ea580c',
      transport: '#2563eb',
      shopping: '#9333ea',
      bills: '#ca8a04',
      healthcare: '#dc2626',
      entertainment: '#4f46e5',
      education: '#16a34a',
      others: '#4b5563'
    };
    return colors[cat] || colors.others;
  };

  const getCategoryChartData = () => {
    if (!analytics?.categoryBreakdown) return [];
    return Object.entries(analytics.categoryBreakdown).map(([category, amount]) => ({
      name: getCategoryName(category),
      value: amount,
      category: category,
      color: getChartColor(category)
    }));
  };

  const getDailyTrends = () => {
    if (!expenses.length) return [];
    
    const dailyData = {};
    expenses.forEach(exp => {
      const date = new Date(exp.date || exp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      dailyData[date] = (dailyData[date] || 0) + exp.amount;
    });

    return Object.entries(dailyData)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-7) // Last 7 days
      .map(([date, amount]) => ({
        date,
        amount: amount
      }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">
        <div className="bg-white dark:bg-gray-800 border-l-4 border-[#FF9933] shadow-sm mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-[#FF9933] rounded flex items-center justify-center">
                  <FaMoneyBillWave className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{strings.expenseTracker}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{currentLanguage === 'english' ? 'Daily Expense Management System' : 'दैनिक व्यय प्रबंधन प्रणाली'}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`px-6 py-3 font-semibold rounded shadow-sm transition-all flex items-center gap-2 ${
                showAddForm 
                  ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                  : 'bg-[#138808] hover:bg-green-700 text-white'
              }`}
            >
              {showAddForm ? <FaTimes /> : <FaPlus />}
              {showAddForm ? strings.cancel : strings.addExpense}
            </button>
          </div>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              {currentLanguage === 'english' ? 'Add New Expense' : 'नया खर्च जोड़ें'}
            </h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {strings.expenseAmount} (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <FaRupeeSign />
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="100"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {strings.expenseDescription} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={currentLanguage === 'english' ? 'e.g., Vegetables from market' : 'जैसे, बाजार से सब्जियां'}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {strings.expenseCategory} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {['food', 'transport', 'shopping', 'bills', 'healthcare', 'entertainment', 'education', 'others'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-3 border transition-all ${
                        category === cat
                          ? 'border-[#FF9933] bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-[#FF9933]/50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 ${category === cat ? getCategoryColor(cat) : 'bg-gray-400'} flex items-center justify-center text-white rounded`}>
                          {getCategoryIcon(cat)}
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{getCategoryName(cat)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#138808] hover:bg-green-700 text-white font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FaSave />
                  {loading ? (currentLanguage === 'english' ? 'Saving...' : 'सहेजा जा रहा है...') : (currentLanguage === 'english' ? 'Save Expense' : 'खर्च सहेजें')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Analytics & AI Suggestion */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Total Summary */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-[#FF9933] flex items-center justify-center">
                  <FaChartBar className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {strings.thisMonth}
                </h3>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <FaRupeeSign className="text-2xl text-gray-700 dark:text-gray-300" />
                  <p className="text-4xl font-bold text-gray-800 dark:text-white">
                    {analytics.totalExpense?.toFixed(0) || 0}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {currentLanguage === 'english' ? 'Last 30 days total' : 'पिछले 30 दिनों का कुल'}
                </p>
              </div>

              <div className="space-y-2">
                {Object.entries(analytics.categoryBreakdown || {}).map(([cat, amt]) => (
                  <div key={cat} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 ${getCategoryColor(cat)} flex items-center justify-center text-white text-xs`}>
                        {getCategoryIcon(cat)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getCategoryName(cat)}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-white">₹{amt.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="lg:col-span-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-l-4 border-green-600 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-green-200 dark:border-green-800">
                <div className="w-10 h-10 bg-green-600 flex items-center justify-center">
                  <FaLightbulb className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {strings.aiSuggestion}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {currentLanguage === 'english' ? 'Powered by Google Gemini AI' : 'Google Gemini AI द्वारा संचालित'}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed text-sm">
                  {analytics.aiSuggestion?.text || (currentLanguage === 'english' ? 'Add more expenses to get personalized AI suggestions for better money management.' : 'बेहतर धन प्रबंधन के लिए व्यक्तिगत AI सुझाव प्राप्त करने हेतु और खर्च जोड़ें।')}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <FaPiggyBank className="text-green-600" />
                <span>{currentLanguage === 'english' ? 'AI analyzes your spending and suggests ways to save money' : 'AI आपके खर्च का विश्लेषण करता है और पैसे बचाने के तरीके सुझाता है'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Visual Analytics Charts */}
        {analytics && expenses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Category Breakdown - Pie Chart */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-[#FF9933] flex items-center justify-center">
                  <FaChartPie className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {currentLanguage === 'english' ? 'Spending by Category' : 'श्रेणी के अनुसार खर्च'}
                </h3>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getCategoryChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getCategoryChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Spending Trend - Bar Chart */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-[#138808] flex items-center justify-center">
                  <FaChartBar className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {currentLanguage === 'english' ? 'Daily Spending Trend' : 'दैनिक खर्च प्रवृत्ति'}
                </h3>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getDailyTrends()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, currentLanguage === 'english' ? 'Amount' : 'रकम']}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="amount" fill="#16a34a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                {currentLanguage === 'english' ? 'Last 7 days spending pattern' : 'पिछले 7 दिनों का खर्च पैटर्न'}
              </p>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaListAlt className="text-[#FF9933]" />
              {strings.expenseList}
              {expenses.length > 0 && (
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                  ({expenses.length} {currentLanguage === 'english' ? 'entries' : 'प्रविष्टियाँ'})
                </span>
              )}
            </h3>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPiggyBank className="text-4xl text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-semibold">
                {strings.noExpenses}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                {currentLanguage === 'english' ? 'Click "Add Expense" to start tracking' : '"खर्च जोड़ें" पर क्लिक करके ट्रैकिंग शुरू करें'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      {currentLanguage === 'english' ? 'Date' : 'तारीख'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      {currentLanguage === 'english' ? 'Category' : 'श्रेणी'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      {strings.expenseDescription}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      {strings.expenseAmount}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      {currentLanguage === 'english' ? 'Action' : 'क्रिया'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {expenses.map((expense, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(expense.date || expense.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 ${getCategoryColor(expense.category)} flex items-center justify-center text-white`}>
                            {getCategoryIcon(expense.category)}
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {getCategoryName(expense.category)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 dark:text-white">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-lg font-bold text-gray-800 dark:text-white">
                          ₹{expense.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDeleteExpense(index)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                          title={strings.deleteExpense}
                        >
                          <FaTrashAlt />
                          {currentLanguage === 'english' ? 'Delete' : 'हटाएं'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExpenseTracker;