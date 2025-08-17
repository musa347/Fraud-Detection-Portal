import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  DollarSign,
  CreditCard,
  BarChart3,
  Download,
  Sparkles
} from 'lucide-react';
import { checkFraud, TransactionData, FraudResult } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const FraudAnalyzer: React.FC = () => {
  const [formData, setFormData] = useState<TransactionData>({
    step: 0,
    type: 'TRANSFER',
    amount: 0,
    oldbalanceOrg: 0,
    newbalanceOrig: 0,
    oldbalanceDest: 0,
    newbalanceDest: 0,
  });
  
  const [result, setResult] = useState<FraudResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<FraudResult[]>([]);
  const [rateLimitWarning, setRateLimitWarning] = useState(false);
  const { isDark } = useTheme();

  const handleInputChange = (field: keyof TransactionData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'type' ? value : parseFloat(value) || 0
    }));
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setRateLimitWarning(false);
      
      const analysisResult = await checkFraud(formData);
      setResult(analysisResult);
      setAnalysisHistory(prev => [analysisResult, ...prev].slice(0, 5));
      
      // Check if this was a mock response due to rate limiting
      if (analysisResult.modelVersion?.includes('mock')) {
        setRateLimitWarning(true);
      }
    } catch (error: any) {
      console.error('Analysis failed:', error);
      
      if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
        alert('API rate limit exceeded. Please wait a moment before trying again.');
        setRateLimitWarning(true);
      } else {
        alert('Analysis failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'from-green-400 to-green-600';
      case 'MEDIUM': return 'from-yellow-400 to-yellow-600';
      case 'HIGH': return 'from-orange-400 to-orange-600';
      case 'CRITICAL': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'LOW': return <CheckCircle className="w-6 h-6" />;
      case 'MEDIUM': return <Clock className="w-6 h-6" />;
      case 'HIGH': return <AlertTriangle className="w-6 h-6" />;
      case 'CRITICAL': return <AlertTriangle className="w-6 h-6" />;
      default: return <CheckCircle className="w-6 h-6" />;
    }
  };

  const exportResults = () => {
    if (!result) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      transaction: formData,
      analysis: result
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraud-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
            🔍 AI Fraud Analyzer
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Advanced machine learning fraud detection with real-time insights
          </p>
        </motion.div>

        {/* Rate Limit Warning */}
        <AnimatePresence>
          {rateLimitWarning && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-6 mx-auto max-w-4xl"
            >
              <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                      API Rate Limit Notice
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      The ML API is experiencing high traffic. Results shown are simulated. 
                      Please wait 2-3 seconds between requests for real API responses.
                    </p>
                  </div>
                  <button
                    onClick={() => setRateLimitWarning(false)}
                    className="ml-auto text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
                  >
                    ×
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-2xl shadow-xl p-8 ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-2" />
              Transaction Details
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Time Step (Hour)
                  </label>
                  <input
                    type="number"
                    value={formData.step}
                    onChange={(e) => handleInputChange('step', e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all`}
                    placeholder="e.g., 1"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Transaction Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all`}
                  >
                    <option value="TRANSFER">Transfer</option>
                    <option value="CASH_OUT">Cash Out</option>
                    <option value="PAYMENT">Payment</option>
                    <option value="CASH_IN">Cash In</option>
                    <option value="DEBIT">Debit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Transaction Amount
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all`}
                  placeholder="e.g., 10000.00"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Origin Old Balance
                  </label>
                  <input
                    type="number"
                    value={formData.oldbalanceOrg}
                    onChange={(e) => handleInputChange('oldbalanceOrg', e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all`}
                    placeholder="e.g., 50000.00"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Origin New Balance
                  </label>
                  <input
                    type="number"
                    value={formData.newbalanceOrig}
                    onChange={(e) => handleInputChange('newbalanceOrig', e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all`}
                    placeholder="e.g., 40000.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Destination Old Balance
                  </label>
                  <input
                    type="number"
                    value={formData.oldbalanceDest}
                    onChange={(e) => handleInputChange('oldbalanceDest', e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all`}
                    placeholder="e.g., 0.00"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Destination New Balance
                  </label>
                  <input
                    type="number"
                    value={formData.newbalanceDest}
                    onChange={(e) => handleInputChange('newbalanceDest', e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all`}
                    placeholder="e.g., 10000.00"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnalyze}
                disabled={loading}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Analyzing with AI...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Analyze Transaction
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-2xl shadow-xl p-8 ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Sparkles className="w-6 h-6 mr-2" />
                AI Analysis Results
              </h2>
              {result && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportResults}
                  className={`p-2 rounded-lg ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <Download className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Risk Level Card */}
                  <div className={`p-6 rounded-xl bg-gradient-to-r ${getRiskColor(result.riskLevel)} text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Risk Assessment</h3>
                        <p className="text-2xl font-bold">{result.riskLevel} RISK</p>
                      </div>
                      {getRiskIcon(result.riskLevel)}
                    </div>
                  </div>

                  {/* Fraud Probability */}
                  <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="text-lg font-semibold mb-4">Fraud Probability</h3>
                    <div className="relative">
                      <div className={`w-full bg-gray-300 rounded-full h-4 ${isDark ? 'bg-gray-600' : ''}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.fraudProbability * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-4 rounded-full ${
                            result.fraudProbability > 0.7 ? 'bg-red-500' :
                            result.fraudProbability > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                        />
                      </div>
                      <p className="text-center mt-2 text-2xl font-bold">
                        {(result.fraudProbability * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Model Insights */}
                  <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="text-lg font-semibold mb-4">Model Insights</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Confidence</p>
                        <p className="font-semibold">{(result.confidence * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Processing Time</p>
                        <p className="font-semibold">{result.processingTime.toFixed(0)}ms</p>
                      </div>
                      <div>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Model Version</p>
                        <p className="font-semibold">{result.modelVersion}</p>
                      </div>
                      <div>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Status</p>
                        <p className="font-semibold">{result.flagged ? '🚨 Flagged' : '✅ Clear'}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Explanations */}
                  <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="text-lg font-semibold mb-4">AI Explanation</h3>
                    <div className="space-y-2">
                      {result.explanation.map((explanation, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} border-l-4 border-blue-500`}
                        >
                          {explanation}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Feature Importance */}
                  <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Feature Importance
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(result.featureImportance)
                        .sort(([,a], [,b]) => b - a)
                        .map(([feature, importance]) => (
                          <div key={feature} className="flex items-center justify-between">
                            <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <div className="flex items-center space-x-2 flex-1 ml-4">
                              <div className={`flex-1 bg-gray-300 rounded-full h-2 ${isDark ? 'bg-gray-600' : ''}`}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${importance * 100}%` }}
                                  transition={{ duration: 0.8, delay: 0.2 }}
                                  className="h-2 bg-blue-500 rounded-full"
                                />
                              </div>
                              <span className="text-sm font-medium min-w-[3rem]">
                                {(importance * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Brain className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Enter transaction details and click "Analyze Transaction" to see AI-powered fraud detection results
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Analysis History */}
        {analysisHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`mt-8 rounded-2xl shadow-xl p-8 ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Recent Analysis History
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysisHistory.map((analysis, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} border ${
                    isDark ? 'border-gray-600' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getRiskColor(analysis.riskLevel).replace('from-', 'bg-').replace(' to-', '').split(' ')[0]}`}>
                      {analysis.riskLevel}
                    </span>
                    <span className="text-sm font-bold">
                      {(analysis.fraudProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {analysis.flagged ? '🚨 Flagged as fraud' : '✅ Cleared transaction'}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FraudAnalyzer;