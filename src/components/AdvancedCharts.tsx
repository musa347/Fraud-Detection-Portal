import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Activity,
  Download,
  RefreshCw,
} from 'lucide-react';
import { getTransactionHistory } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  riskLevel: RiskLevel;
  fraudProbability: number;
  flagged: boolean;
  timestamp: string;
}

interface ChartData {
  daily: Array<{ date: string; total: number; fraud: number; legitimate: number; avgRisk: number; totalAmount: number; fraudRate: number }>;
  types: Array<{ name: string; total: number; fraud: number; value: number; fraudRate: number }>;
  risks: Array<{ name: string; value: number; color: string }>;
  amounts: Array<{ name: string; min: number; max: number; count: number; fraud: number; fraudRate: number }>;
  scatter: Array<{ amount: number; fraudProbability: number; type: string; flagged: boolean }>;
}

interface DailyStats {
  [key: string]: {
    date: string;
    total: number;
    fraud: number;
    legitimate: number;
    avgRisk: number;
    totalAmount: number;
  };
}

interface TypeStats {
  [key: string]: {
    name: string;
    total: number;
    fraud: number;
    value: number;
  };
}

interface RiskStats {
  LOW: { name: string; value: number; color: string };
  MEDIUM: { name: string; value: number; color: string };
  HIGH: { name: string; value: number; color: string };
  CRITICAL: { name: string; value: number; color: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number | string; color: string }>;
  label?: string;
}

const AdvancedCharts: React.FC = () => {
  const [data, setData] = useState<ChartData>({ daily: [], types: [], risks: [], amounts: [], scatter: [] });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState('trend');
  const { isDark } = useTheme();

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const history = await getTransactionHistory(100);
      setData(processDataForCharts(history));
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processDataForCharts = (transactions: Transaction[]): ChartData => {
    const dailyData = processDailyTrends(transactions);
    const typeData = processTransactionTypes(transactions);
    const riskData = processRiskLevels(transactions);
    const amountData = processAmountDistribution(transactions);
    
    return {
      daily: dailyData,
      types: typeData,
      risks: riskData,
      amounts: amountData,
      scatter: processScatterData(transactions),
    };
  };

  const processDailyTrends = (transactions: Transaction[]) => {
    const dailyStats: DailyStats = {};
    
    transactions.forEach(tx => {
      const date = new Date(tx.timestamp).toLocaleDateString();
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          total: 0,
          fraud: 0,
          legitimate: 0,
          avgRisk: 0,
          totalAmount: 0,
        };
      }
      
      dailyStats[date].total += 1;
      dailyStats[date].totalAmount += tx.amount;
      
      if (tx.flagged) {
        dailyStats[date].fraud += 1;
      } else {
        dailyStats[date].legitimate += 1;
      }
      
      dailyStats[date].avgRisk += tx.fraudProbability;
    });
    
    return Object.values(dailyStats).map((day) => ({
      ...day,
      avgRisk: day.avgRisk / day.total,
      fraudRate: (day.fraud / day.total) * 100,
    })).slice(-7);
  };

  const processTransactionTypes = (transactions: Transaction[]) => {
    const typeStats: TypeStats = {};
    
    transactions.forEach(tx => {
      if (!typeStats[tx.type]) {
        typeStats[tx.type] = {
          name: tx.type,
          total: 0,
          fraud: 0,
          value: 0,
        };
      }
      
      typeStats[tx.type].total += 1;
      typeStats[tx.type].value += tx.amount;
      
      if (tx.flagged) {
        typeStats[tx.type].fraud += 1;
      }
    });
    
    return Object.values(typeStats).map((type) => ({
      ...type,
      fraudRate: (type.fraud / type.total) * 100,
    }));
  };

  const processRiskLevels = (transactions: Transaction[]) => {
    const riskStats: RiskStats = {
      LOW: { name: 'Low Risk', value: 0, color: '#10b981' },
      MEDIUM: { name: 'Medium Risk', value: 0, color: '#f59e0b' },
      HIGH: { name: 'High Risk', value: 0, color: '#f97316' },
      CRITICAL: { name: 'Critical Risk', value: 0, color: '#ef4444' },
    };
    
    transactions.forEach(tx => {
      riskStats[tx.riskLevel].value += 1;
    });
    
    return Object.values(riskStats);
  };

  const processAmountDistribution = (transactions: Transaction[]) => {
    const ranges: Array<{ name: string; min: number; max: number; count: number; fraud: number }> = [
      { name: '$0-1K', min: 0, max: 1000, count: 0, fraud: 0 },
      { name: '$1K-5K', min: 1000, max: 5000, count: 0, fraud: 0 },
      { name: '$5K-10K', min: 5000, max: 10000, count: 0, fraud: 0 },
      { name: '$10K-25K', min: 10000, max: 25000, count: 0, fraud: 0 },
      { name: '$25K+', min: 25000, max: Infinity, count: 0, fraud: 0 },
    ];
    
    transactions.forEach(tx => {
      const range = ranges.find(r => tx.amount >= r.min && tx.amount < r.max);
      if (range) {
        range.count += 1;
        if (tx.flagged) range.fraud += 1;
      }
    });
    
    return ranges.map(range => ({
      ...range,
      fraudRate: range.count > 0 ? (range.fraud / range.count) * 100 : 0,
    }));
  };

  const processScatterData = (transactions: Transaction[]) => {
    return transactions.map(tx => ({
      amount: tx.amount,
      fraudProbability: tx.fraudProbability * 100,
      type: tx.type,
      flagged: tx.flagged,
    }));
  };

  const exportChart = () => {
    console.log('Exporting chart data...');
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'
        }`}>
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
                📊 Advanced Analytics
              </h1>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Deep insights into fraud patterns and trends
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <option value="1d">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchData}
                className={`p-2 rounded-lg ${
                  isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                } border ${isDark ? 'border-gray-600' : 'border-gray-300'} transition-colors`}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportChart}
                className={`p-2 rounded-lg ${
                  isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                } border ${isDark ? 'border-gray-600' : 'border-gray-300'} transition-colors`}
              >
                <Download className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Chart Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'trend', label: 'Fraud Trends', icon: TrendingUp },
              { id: 'types', label: 'Transaction Types', icon: BarChart3 },
              { id: 'risk', label: 'Risk Distribution', icon: PieChartIcon },
              { id: 'amounts', label: 'Amount Analysis', icon: Activity },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setChartType(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  chartType === tab.id
                    ? 'bg-blue-500 text-white'
                    : isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div
          key={chartType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {chartType === 'trend' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fraud Trend Line Chart */}
              <div className={`p-6 rounded-xl shadow-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Daily Fraud Rate Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="fraudRate" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Transaction Volume Area Chart */}
              <div className={`p-6 rounded-xl shadow-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Transaction Volume
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="legitimate" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="fraud" 
                      stackId="1"
                      stroke="#ef4444" 
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {chartType === 'types' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Transaction Types Bar Chart */}
              <div className={`p-6 rounded-xl shadow-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Fraud Rate by Transaction Type
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.types}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="fraudRate" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Scatter Plot */}
              <div className={`p-6 rounded-xl shadow-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Amount vs Fraud Probability
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis 
                      type="number" 
                      dataKey="amount" 
                      name="Amount" 
                      stroke={isDark ? '#9ca3af' : '#6b7280'}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="fraudProbability" 
                      name="Fraud %" 
                      stroke={isDark ? '#9ca3af' : '#6b7280'}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter 
                      name="Transactions" 
                      data={data.scatter}
                      fill="#8884d8"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {chartType === 'risk' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Risk Distribution Pie Chart */}
              <div className={`p-6 rounded-xl shadow-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Risk Level Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.risks}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.risks.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Amount Distribution */}
              <div className={`p-6 rounded-xl shadow-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Fraud Rate by Amount Range
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.amounts}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="fraudRate" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {chartType === 'amounts' && (
            <div className="grid grid-cols-1 gap-8">
              {/* Combined Analysis */}
              <div className={`p-6 rounded-xl shadow-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Transaction Count vs Fraud Rate by Amount Range
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data.amounts}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <YAxis yAxisId="left" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <YAxis yAxisId="right" orientation="right" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Transaction Count" />
                    <Bar yAxisId="right" dataKey="fraudRate" fill="#ef4444" name="Fraud Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedCharts;