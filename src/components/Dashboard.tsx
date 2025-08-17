import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Brain,
  Zap,
  Target
} from 'lucide-react';
import { getModelStats, getTransactionHistory } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import ApiStatus from './ApiStatus';

interface ModelStats {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  totalTransactions: number;
  fraudDetected: number;
  falsePositives: number;
  lastUpdated: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<ModelStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelStats, history] = await Promise.all([
          getModelStats(),
          getTransactionHistory(10)
        ]);
        setStats(modelStats);
        setRecentTransactions(history);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: isDark 
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
          : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`p-6 rounded-xl shadow-lg hover-lift cursor-pointer ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'HIGH': return 'bg-orange-500';
      case 'CRITICAL': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
            🧠 AI Fraud Detection Dashboard
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Real-time machine learning insights and analytics
          </p>
          <ApiStatus />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Brain}
            title="Model Accuracy"
            value={`${(stats?.accuracy * 100).toFixed(1)}%`}
            subtitle="ML Performance"
            color="bg-blue-500"
          />
          <StatCard
            icon={Target}
            title="Precision"
            value={`${(stats?.precision * 100).toFixed(1)}%`}
            subtitle="True Positive Rate"
            color="bg-green-500"
          />
          <StatCard
            icon={Shield}
            title="Fraud Detected"
            value={stats?.fraudDetected.toLocaleString()}
            subtitle={`${stats?.totalTransactions.toLocaleString()} total transactions`}
            color="bg-red-500"
          />
          <StatCard
            icon={Zap}
            title="F1 Score"
            value={stats?.f1Score.toFixed(3)}
            subtitle="Harmonic Mean"
            color="bg-purple-500"
          />
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl shadow-lg p-6 ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Activity className="w-6 h-6 mr-2" />
              Recent Transaction Analysis
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Live Monitoring
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Transaction ID
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Amount
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Type
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Risk Level
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Fraud Probability
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                  >
                    <td className="py-3 px-4 font-mono text-sm">
                      {tx.id.substring(0, 12)}...
                    </td>
                    <td className="py-3 px-4">
                      ${tx.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getRiskColor(tx.riskLevel)}`}>
                        {tx.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-full bg-gray-200 rounded-full h-2 ${isDark ? 'bg-gray-700' : ''}`}>
                          <div
                            className={`h-2 rounded-full ${
                              tx.fraudProbability > 0.7 ? 'bg-red-500' :
                              tx.fraudProbability > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${tx.fraudProbability * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium min-w-[3rem]">
                          {(tx.fraudProbability * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {tx.flagged ? (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Model Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mt-8 rounded-xl shadow-lg p-6 ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            ML Model Performance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={isDark ? "#374151" : "#e5e7eb"}
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${stats?.accuracy * 100}, 100`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{(stats?.accuracy * 100).toFixed(1)}%</span>
                </div>
              </div>
              <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Accuracy</p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={isDark ? "#374151" : "#e5e7eb"}
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${stats?.precision * 100}, 100`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{(stats?.precision * 100).toFixed(1)}%</span>
                </div>
              </div>
              <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Precision</p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={isDark ? "#374151" : "#e5e7eb"}
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeDasharray={`${stats?.recall * 100}, 100`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{(stats?.recall * 100).toFixed(1)}%</span>
                </div>
              </div>
              <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Recall</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;