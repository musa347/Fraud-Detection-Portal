import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Heart, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from './LoadingSpinner';

const AnimationTest: React.FC = () => {
  const [showCard, setShowCard] = useState(true);
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  const handleTestAnimation = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowCard(!showCard);
    }, 2000);
  };

  return (
    <div className={`min-h-screen p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            🎨 Animation Test
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Testing all animations and styles
          </p>
        </motion.div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Hover Effects Card */}
          <motion.div
            whileHover={{ 
              scale: 1.05,
              rotateY: 5,
              boxShadow: isDark 
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            whileTap={{ scale: 0.95 }}
            className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}
          >
            <div className="flex items-center mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold">Hover Effects</h3>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Hover over this card to see 3D transform effects
            </p>
          </motion.div>

          {/* Pulse Animation Card */}
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1],
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0)",
                "0 0 0 10px rgba(59, 130, 246, 0.1)",
                "0 0 0 0 rgba(59, 130, 246, 0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`p-6 rounded-2xl ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}
          >
            <div className="flex items-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg mr-3"
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold">Pulse Animation</h3>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Continuous pulsing effect with glow
            </p>
          </motion.div>

          {/* Bounce Animation Card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className={`p-6 rounded-2xl ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}
          >
            <div className="flex items-center mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg mr-3"
              >
                <Star className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold">Bounce Effect</h3>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Floating animation with rotation
            </p>
          </motion.div>
        </div>

        {/* Interactive Test Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`p-8 rounded-2xl ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          } border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-lg mb-8`}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Interactive Animation Test</h2>
          
          <div className="flex flex-col items-center space-y-6">
            {/* Test Button */}
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTestAnimation}
              disabled={loading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="text-white" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Test Animations</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Animated Card */}
            <AnimatePresence mode="wait">
              {showCard && (
                <motion.div
                  key="test-card"
                  initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                  transition={{ 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className={`p-6 rounded-xl ${
                    isDark ? 'bg-gradient-to-br from-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-100 to-purple-100'
                  } border-2 border-blue-500 max-w-md`}
                >
                  <div className="flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">Animation Success!</h3>
                  <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    All animations are working perfectly with smooth transitions and effects.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CSS Animation Tests */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className={`p-8 rounded-2xl ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          } border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">CSS Animation Classes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
              <p className="text-sm">Pulse</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 animate-bounce"></div>
              <p className="text-sm">Bounce</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-2 animate-spin"></div>
              <p className="text-sm">Spin</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-2 animate-ping"></div>
              <p className="text-sm">Ping</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimationTest;