import React, { useState, useEffect } from 'react';

export const LogsPage: React.FC = () => {
  // Simulated logs data
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('thisMonth');
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);

  useEffect(() => {
    // Simulating fetching data from an API
    const simulatedLogs = [
      { drugName: 'Paracetamol', quantity: 10, pricePerUnit: 5, totalPrice: 50, soldAt: '2025-02-01T10:00:00' },
      { drugName: 'Ibuprofen', quantity: 15, pricePerUnit: 8, totalPrice: 120, soldAt: '2025-01-30T11:30:00' },
      { drugName: 'Amoxicillin', quantity: 20, pricePerUnit: 3, totalPrice: 60, soldAt: '2025-02-02T12:15:00' },
      { drugName: 'Cetirizine', quantity: 8, pricePerUnit: 4, totalPrice: 32, soldAt: '2025-01-25T14:45:00' },
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Pharmacy Logs</h1>

      <div className="mb-6 flex justify-center space-x-4">
        <button
          onClick={() => setFilter('thisMonth')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'thisMonth' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setFilter('lastMonth')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'lastMonth' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Last Month
        </button>
        <button
          onClick={() => setFilter('thisWeek')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'thisWeek' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          All Logs
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-xl p-8">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">
                Drug Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">
                Quantity Sold
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">
                Price per Unit
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">
                Sold At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {log.drugName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {log.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  ${log.pricePerUnit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                  ${log.totalPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.soldAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
