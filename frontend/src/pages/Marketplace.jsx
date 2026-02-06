import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { 
  FaCoins, FaRupeeSign, FaShoppingCart, FaHistory, FaCheckCircle, 
  FaInfoCircle, FaTrophy, FaGift, FaExclamationTriangle 
} from 'react-icons/fa';

const Marketplace = () => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('shop'); // shop, history, stats
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [redeeming, setRedeeming] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  const fetchMarketplaceData = async () => {
    try {
      setLoading(true);
      const [itemsRes, statsRes, redemptionsRes] = await Promise.all([
        api.get('/marketplace/items'),
        api.get('/marketplace/stats'),
        api.get('/marketplace/redemptions')
      ]);
      
      setItems(itemsRes.data);
      setStats(statsRes.data);
      setRedemptions(redemptionsRes.data);
    } catch (error) {
      console.error('Failed to fetch marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!selectedItem) return;
    
    try {
      setRedeeming(true);
      const response = await api.post('/marketplace/redeem', {
        item_id: selectedItem.id,
        quantity: quantity
      });
      
      setMessage({
        type: 'success',
        text: currentLanguage === 'english' 
          ? `Successfully redeemed! Transaction ID: ${response.data.transaction_id}` 
          : `सफलतापूर्वक भुनाया गया! लेनदेन आईडी: ${response.data.transaction_id}`
      });
      
      // Refresh data
      await fetchMarketplaceData();
      setSelectedItem(null);
      setQuantity(1);
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Redemption failed'
      });
    } finally {
      setRedeeming(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      utilities: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      food: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      fuel: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      communication: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      education: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      healthcare: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      transport: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      lifestyle: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {currentLanguage === 'english' ? 'Loading marketplace...' : 'बाज़ार लोड हो रहा है...'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 w-full px-6 py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {currentLanguage === 'english' ? 'Government Benefits Marketplace' : 'सरकारी लाभ बाज़ार'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLanguage === 'english' 
              ? 'Redeem your learning coins for real-life benefits. Government funded!' 
              : 'अपने सीखने के सिक्कों को वास्तविक जीवन लाभों के लिए भुनाएं। सरकार द्वारा वित्त पोषित!'}
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`max-w-7xl mx-auto mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
              <p>{message.text}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaCoins className="text-3xl opacity-80" />
              <span className="text-sm opacity-80">
                {currentLanguage === 'english' ? 'Available' : 'उपलब्ध'}
              </span>
            </div>
            <p className="text-3xl font-bold">{stats?.current_coins || 0}</p>
            <p className="text-sm opacity-90">
              {currentLanguage === 'english' ? 'Coins' : 'सिक्के'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaRupeeSign className="text-3xl opacity-80" />
              <span className="text-sm opacity-80">
                {currentLanguage === 'english' ? 'Potential' : 'संभावित'}
              </span>
            </div>
            <p className="text-3xl font-bold">₹{stats?.potential_rupees || 0}</p>
            <p className="text-sm opacity-90">
              {currentLanguage === 'english' ? 'Value' : 'मूल्य'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaTrophy className="text-3xl opacity-80" />
              <span className="text-sm opacity-80">
                {currentLanguage === 'english' ? 'Total Saved' : 'कुल बचत'}
              </span>
            </div>
            <p className="text-3xl font-bold">₹{stats?.total_saved || 0}</p>
            <p className="text-sm opacity-90">
              {currentLanguage === 'english' ? 'Benefits Received' : 'लाभ प्राप्त'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FaGift className="text-3xl opacity-80" />
              <span className="text-sm opacity-80">
                {currentLanguage === 'english' ? 'Redemptions' : 'भुनाए'}
              </span>
            </div>
            <p className="text-3xl font-bold">{stats?.total_redemptions || 0}</p>
            <p className="text-sm opacity-90">
              {currentLanguage === 'english' ? 'Items' : 'आइटम'}
            </p>
          </div>
        </div>

        {/* Conversion Info */}
        <div className="max-w-7xl mx-auto mb-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-600 dark:text-blue-400 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                {currentLanguage === 'english' ? 'Government Subsidy 100%' : 'सरकारी सब्सिडी 100%'}
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                {currentLanguage === 'english' 
                  ? '1 Coin = ₹2 with government subsidy! Learn more, save more!' 
                  : '1 सिक्का = ₹2 सरकारी सब्सिडी के साथ! अधिक सीखें, अधिक बचाएं!'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex gap-2 border-b border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'shop'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FaShoppingCart className="inline mr-2" />
              {currentLanguage === 'english' ? 'Shop' : 'खरीदें'}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'history'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FaHistory className="inline mr-2" />
              {currentLanguage === 'english' ? 'History' : 'इतिहास'}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Shop Tab */}
          {activeTab === 'shop' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-6 transition-all ${
                    item.can_afford
                      ? 'border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:shadow-lg cursor-pointer'
                      : 'border-gray-200 dark:border-gray-800 opacity-60'
                  }`}
                  onClick={() => item.can_afford && setSelectedItem(item)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{item.icon}</div>
                    <span className={`text-xs px-3 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {currentLanguage === 'english' ? item.name : item.name_hi}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {currentLanguage === 'english' ? item.description : item.description_hi}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-primary-600">
                      <FaCoins />
                      <span className="font-bold text-lg">{item.coins_required}</span>
                      <span className="text-sm text-gray-500">
                        {currentLanguage === 'english' ? 'coins' : 'सिक्के'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                      <FaRupeeSign />
                      <span>{item.rupees_value}</span>
                    </div>
                  </div>
                  
                  {item.subsidy_percent > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs px-3 py-2 rounded mb-3">
                      🎉 {item.subsidy_percent}% {currentLanguage === 'english' ? 'Govt. Subsidy' : 'सरकारी सब्सिडी'}
                    </div>
                  )}
                  
                  <button
                    disabled={!item.can_afford}
                    className={`w-full py-2 rounded-lg font-medium transition-all ${
                      item.can_afford
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {item.can_afford 
                      ? (currentLanguage === 'english' ? 'Redeem Now' : 'अभी भुनाएं')
                      : (currentLanguage === 'english' ? 'Insufficient Coins' : 'अपर्याप्त सिक्के')}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              {redemptions.length === 0 ? (
                <div className="text-center py-12">
                  <FaHistory className="text-6xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentLanguage === 'english' ? 'No redemptions yet' : 'अभी तक कोई भुनाई नहीं'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {redemptions.map((redemption) => (
                    <div key={redemption.id} className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{redemption.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {currentLanguage === 'english' ? redemption.item_name : redemption.item_name_hi}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(redemption.redeemed_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          redemption.status === 'approved'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}>
                          {redemption.status === 'approved' 
                            ? (currentLanguage === 'english' ? 'Approved' : 'स्वीकृत')
                            : (currentLanguage === 'english' ? 'Pending' : 'लंबित')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {currentLanguage === 'english' ? 'Coins Spent' : 'सिक्के खर्च'}
                          </p>
                          <p className="font-semibold text-primary-600">{redemption.coins_spent}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {currentLanguage === 'english' ? 'Value' : 'मूल्य'}
                          </p>
                          <p className="font-semibold text-green-600">₹{redemption.rupees_value}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {currentLanguage === 'english' ? 'Transaction ID' : 'लेनदेन आईडी'}
                          </p>
                          <p className="font-mono text-xs text-gray-700 dark:text-gray-300">
                            {redemption.transaction_id?.substring(0, 15)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Redemption Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {currentLanguage === 'english' ? 'Confirm Redemption' : 'भुनाई की पुष्टि करें'}
              </h3>
              
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{selectedItem.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {currentLanguage === 'english' ? selectedItem.name : selectedItem.name_hi}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentLanguage === 'english' ? selectedItem.description : selectedItem.description_hi}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {currentLanguage === 'english' ? 'Coins Required' : 'सिक्के आवश्यक'}
                    </span>
                    <span className="font-semibold text-primary-600">
                      {selectedItem.coins_required * quantity}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {currentLanguage === 'english' ? 'You will receive' : 'आपको मिलेगा'}
                    </span>
                    <span className="font-semibold text-green-600">
                      ₹{selectedItem.rupees_value * quantity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {currentLanguage === 'english' ? 'Remaining Coins' : 'शेष सिक्के'}
                    </span>
                    <span className="font-semibold">
                      {stats.current_coins - (selectedItem.coins_required * quantity)}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLanguage === 'english' ? 'Quantity' : 'मात्रा'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={Math.floor(stats.current_coins / selectedItem.coins_required)}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  {currentLanguage === 'english' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  onClick={handleRedeem}
                  disabled={redeeming}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {redeeming 
                    ? (currentLanguage === 'english' ? 'Processing...' : 'प्रसंस्करण...')
                    : (currentLanguage === 'english' ? 'Redeem Now' : 'अभी भुनाएं')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
