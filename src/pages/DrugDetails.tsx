import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Pill, AlertCircle, Repeat, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api/api';
import { Drug } from '../types';

export const DrugDetails: React.FC = () => {
  const { drugId } = useParams();
  const [searchParams] = useSearchParams();
  const ndcCode = searchParams.get('ndc');
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortedAlternatives, setSortedAlternatives] = useState<Drug[]>([]);

  useEffect(() => {
    const fetchDrugDetails = async () => {
      if (!drugId || !ndcCode) return;
      
      try {
        const drugData = await api.getDrugDetails(drugId, ndcCode);
        setDrug(drugData);
        // Sort alternatives by net price ascending
        const sorted = [...drugData.alternatives].sort((a, b) => a.netPrice - b.netPrice);
        setSortedAlternatives(sorted);
      } catch (err) {
        setError('Failed to load drug details');
      } finally {
        setLoading(false);
      }
    };

    fetchDrugDetails();
  }, [drugId, ndcCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !drug) {
    return (
      <div className="text-center text-red-600 p-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>{error || 'Drug not found'}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
    >
      <div className="bg-blue-600 p-6 text-white rounded-t-lg flex items-center space-x-4">
        <Pill className="h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold">{drug.name}</h1>
          <p className="text-blue-200">NDC: {ndcCode}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Drug Information</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Class Name</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{drug.className}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Price</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">${drug.netPrice.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{drug.description}</dd>
              </div>
            </dl>
          </div>
        </section>

        {sortedAlternatives.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 flex items-center">
              <Repeat className="h-5 w-5 mr-2" /> Alternative Medications
            </h2>
            <div className="overflow-x-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <table className="min-w-full text-gray-900 dark:text-gray-100">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Class</th>
                    <th className="px-4 py-2 text-left">Net Price</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAlternatives.map((alt) => (
                    <tr key={alt.id} className="border-b dark:border-gray-700">
                      <td className="px-4 py-2">{alt.name}</td>
                      <td className="px-4 py-2">{alt.className}</td>
                      <td className="px-4 py-2">${alt.netPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

          {/* Insurance Coverage */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Insurance Coverage</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Insurance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coverage Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Copay
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(drug.pricing).map(([insuranceId, pricing]) => (
                    <tr key={insuranceId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {insuranceId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${pricing.insuranceCoverage.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${pricing.patientPay.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Alternatives */}
          {sortedAlternatives.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Repeat className="h-5 w-5 mr-2" />
                  Alternative Medications
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  Sorted by Net Price
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NDC Codes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Insurance Coverage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedAlternatives.map((alt) => (
                      <tr key={alt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{alt.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{alt.className}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {alt.ndc.map((code) => (
                              <div key={code}>{code}</div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${alt.netPrice.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {Object.entries(alt.pricing).map(([insuranceId, pricing]) => (
                              <div key={insuranceId} className="text-sm text-gray-500">
                                <span className="font-medium">{insuranceId}:</span>
                                <span className="ml-1">
                                  Coverage: ${pricing.insuranceCoverage.toFixed(2)},
                                  Copay: ${pricing.patientPay.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
      </div>
    </motion.div>
  );
};
