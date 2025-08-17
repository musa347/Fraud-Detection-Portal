import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import FraudAnalyzer from './components/FraudAnalyzer';
import AdvancedCharts from './components/AdvancedCharts';
import AnimationTest from './components/AnimationTest';

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyzer" element={<FraudAnalyzer />} />
          <Route path="/charts" element={<AdvancedCharts />} />
          <Route path="/test" element={<AnimationTest />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
