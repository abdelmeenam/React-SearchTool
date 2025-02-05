import React, { useEffect, useState } from 'react';
import { BarChart3, AlertTriangle, PieChart, Pill } from 'lucide-react';
import { api } from '../api/api';
import { PharmacySale, SalesAnalytics } from '../types';

export const Dashboard: React.FC = () => {
  const [sales, setSales] = useState<PharmacySale[]>([]);
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [salesData, analyticsData] = await Promise.all([
        api.getPharmacySales(),
        api.getSalesAnalytics()
      ]);
      setSales(salesData);
      setAnalytics(analyticsData);
    };
    fetchData();
  }, []);

  const belowNetPriceSales = sales.filter(sale => sale.salePrice < sale.netPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Pharmacy Dashboard</h1>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Scripts</p>
              <p className="text-3xl font-semibold">{analytics?.totalScripts}</p>
            </div>
            <Pill className="h-10 w-10" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Sales</p>
              <p className="text-3xl font-semibold">{analytics?.totalSales}</p>
            </div>
            <BarChart3 className="h-10 w-10" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-semibold">
                ${analytics?.totalRevenue.toFixed(2)}
              </p>
            </div>
            <PieChart className="h-10 w-10" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Below Net Price</p>
              <p className="text-3xl font-semibold">{analytics?.belowNetPriceCount}</p>
            </div>
            <AlertTriangle className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* Below Net Price Sales Alert */}
      {belowNetPriceSales.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Below Net Price Sales</h2>
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Pharmacy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Drug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Sale Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Net Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Difference
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {belowNetPriceSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.pharmacyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.drugName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      ${sale.salePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${sale.netPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      -${(sale.netPrice - sale.salePrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sales by Drug */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sales by Drug</h2>
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Drug Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Scripts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics && Object.entries(analytics.salesByDrug).map(([drugName, data]) => (
                <tr key={drugName}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {drugName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.scripts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    ${data.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};