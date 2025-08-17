import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ApiStatus: React.FC = () => {
  const [status, setStatus] = useState<'online' | 'offline' | 'rate-limited'>('online');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const { isDark } = useTheme();

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('https://fraud-detection-backend-9ssq.onrender.com/api/model/stats', {
          method: 'GET',
          timeout: 5000 as any
        });
        
        if (response.status === 429) {
          setStatus('rate-limited');
        } else if (response.ok) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (error) {
        setStatus('offline');
      }
      setLastCheck(new Date());
    };

    // Check immediately
    checkApiStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: Wifi,
          color: 'text-green-500',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          borderColor: 'border-green-200 dark:border-green-700',
          text: 'API Online',
          description: 'All systems operational'
        };
      case 'rate-limited':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          borderColor: 'border-yellow-200 dark:border-yellow-700',
          text: 'Rate Limited',
          description: 'API experiencing high traffic'
        };
      case 'offline':
        return {
          icon: WifiOff,
          color: 'text-red-500',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          borderColor: 'border-red-200 dark:border-red-700',
          text: 'API Offline',
          description: 'Service temporarily unavailable'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-3 py-2 rounded-lg border ${config.bgColor} ${config.borderColor}`}
    >
      <motion.div
        animate={{ rotate: status === 'rate-limited' ? [0, 360] : 0 }}
        transition={{ duration: 2, repeat: status === 'rate-limited' ? Infinity : 0 }}
      >
        <Icon className={`w-4 h-4 ${config.color} mr-2`} />
      </motion.div>
      <div className="text-sm">
        <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          {config.text}
        </div>
        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {config.description}
        </div>
      </div>
    </motion.div>
  );
};

export default ApiStatus;