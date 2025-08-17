import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkFraud } from '../services/api';

interface ChatMessage {
  id: number;
  text: string;
  time: string;
}

export default function Home() {
  const [step, setStep] = useState('');
  const [type, setType] = useState('TRANSFER');
  const [amount, setAmount] = useState('');
  const [oldbalanceOrg, setOldbalanceOrg] = useState('');
  const [newbalanceOrig, setNewbalanceOrig] = useState('');
  const [oldbalanceDest, setOldbalanceDest] = useState('');
  const [newbalanceDest, setNewbalanceDest] = useState('');
  const [result, setResult] = useState<{ fraudProbability: number; flagged: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chartData, setChartData] = useState<{ name: string; probability: number }[]>([]);
  const navigate = useNavigate();

  const handleCheck = async () => {
    try {
      setLoading(true);
      const transactionData = {
        step: parseInt(step),
        type,
        amount: parseFloat(amount),
        oldbalanceOrg: parseFloat(oldbalanceOrg),
        newbalanceOrig: parseFloat(newbalanceOrig),
        oldbalanceDest: parseFloat(oldbalanceDest),
        newbalanceDest: parseFloat(newbalanceDest),
      };
      const response = await checkFraud(transactionData);
      console.log('API Response:', response);
      setResult(response);
      if (response && typeof response.fraudProbability === 'number') {
        const newMessage = {
          id: Date.now(),
          text: `Transaction analyzed. Fraud Probability: ${response.fraudProbability.toFixed(4)}. Flagged: ${response.flagged ? 'Yes' : 'No'}`,
          time: new Date().toLocaleTimeString(),
        };
        setChatMessages((prev) => [...prev, newMessage].slice(-5));
        setChartData((prev) => [
          ...prev,
          { name: `Tx${prev.length + 1}`, probability: response.fraudProbability }
        ].slice(-10));
      } else {
        throw new Error('Invalid response format: fraud_probability is missing or not a number');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error:', error);
      alert(`Failed to analyze transaction: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">AI-Powered Fraud Detection Portal</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Step (Hour)</label>
              <input
                placeholder="Enter step"
                value={step}
                onChange={(e) => setStep(e.target.value)}
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="TRANSFER">Transfer</option>
                <option value="CASH_OUT">Cash Out</option>
                <option value="PAYMENT">Payment</option>
                <option value="CASH_IN">Cash In</option>
                <option value="DEBIT">Debit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Origin Old Balance</label>
              <input
                placeholder="Enter old balance (origin)"
                value={oldbalanceOrg}
                onChange={(e) => setOldbalanceOrg(e.target.value)}
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Origin New Balance</label>
              <input
                placeholder="Enter new balance (origin)"
                value={newbalanceOrig}
                onChange={(e) => setNewbalanceOrig(e.target.value)}
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Destination Old Balance</label>
              <input
                placeholder="Enter old balance (destination)"
                value={oldbalanceDest}
                onChange={(e) => setOldbalanceDest(e.target.value)}
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Destination New Balance</label>
              <input
                placeholder="Enter new balance (destination)"
                value={newbalanceDest}
                onChange={(e) => setNewbalanceDest(e.target.value)}
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleCheck}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Transaction'
              )}
            </button>
            <button
              onClick={() => navigate('/chart')}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              View Fraud Trends
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg h-96 overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">AI Analysis Log</h2>
              {chatMessages.length === 0 ? (
                <p className="text-gray-500">No transactions analyzed yet.</p>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="mb-2 p-2 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">{msg.time}</p>
                    <p className="text-gray-800">{msg.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}