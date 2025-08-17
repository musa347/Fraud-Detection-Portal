import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

interface FraudChartProps {
  data: { name: string; probability: number }[];
}

const FraudChart = ({ data }: FraudChartProps) => {
  return (
    <div className="h-96 w-full bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Fraud Probability Trend</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis domain={[0, 1]} stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
          <Line type="monotone" dataKey="probability" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FraudChart;
