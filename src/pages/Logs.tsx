import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, FileText } from 'lucide-react';

export const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('thisMonth');
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);

  useEffect(() => {
    const simulatedLogs = [
      { drugName: 'Paracetamol', quantity: 10, pricePerUnit: 5, totalPrice: 50, soldAt: '2025-02-01T10:00:00', paymentMethod: 'Credit Card' },
      { drugName: 'Ibuprofen', quantity: 15, pricePerUnit: 8, totalPrice: 120, soldAt: '2025-01-30T11:30:00', paymentMethod: 'Cash' },
      { drugName: 'Amoxicillin', quantity: 20, pricePerUnit: 3, totalPrice: 60, soldAt: '2025-02-02T12:15:00', paymentMethod: 'Debit Card' },
      { drugName: 'Cetirizine', quantity: 8, pricePerUnit: 4, totalPrice: 32, soldAt: '2025-01-25T14:45:00', paymentMethod: 'Insurance' },
    ];
    setLogs(simulatedLogs);
  }, []);

  useEffect(() => {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());

    let filtered;
    if (filter === 'thisMonth') {
      filtered = logs.filter(log => new Date(log.soldAt) >= startOfThisMonth);
    } else if (filter === 'lastMonth') {
      filtered = logs.filter(
        log => new Date(log.soldAt) >= startOfLastMonth && new Date(log.soldAt) < startOfThisMonth
      );
    } else if (filter === 'thisWeek') {
      filtered = logs.filter(log => new Date(log.soldAt) >= startOfThisWeek);
    } else {
      filtered = logs;
    }
    setFilteredLogs(filtered);
  }, [filter, logs]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Pharmacy Logs</h1>

      <motion.div className="mb-6 flex justify-center space-x-4">
        {['thisMonth', 'lastMonth', 'thisWeek', 'all'].map((key) => (
          <motion.button
            key={key}
            onClick={() => setFilter(key)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-4 py-2 rounded-lg font-medium ${filter === key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </motion.button>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-xl p-8"
      >
        <motion.table 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg"
        >
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase">Drug Name</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase">Price per Unit</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase">Total Price</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase">Sold At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log, index) => (
              <motion.tr 
                key={index} 
                whileHover={{ scale: 1.02 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{log.drugName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{log.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-700">${log.pricePerUnit.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-green-600 font-bold">${log.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500 flex items-center"><Calendar className="h-5 w-5 mr-2" />{new Date(log.soldAt).toLocaleString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </motion.div>
    </motion.div>
  );
};
