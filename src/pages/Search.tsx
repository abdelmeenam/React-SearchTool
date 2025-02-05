import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import debounce from 'debounce';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Drug, Insurance } from '../types';

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Drug[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null);
  const [ndcList, setNdcList] = useState<string[]>([]);
  const [selectedNdc, setSelectedNdc] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-10 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700"
    >
      <div className="bg-white dark:bg-white shadow-2xl rounded-lg p-10 text-gray-900 dark:text-gray-900">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-blue-600 dark:text-blue-400">Search for Medicines</h1>
        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search for a drug..."
            className="w-full px-5 py-4 border rounded-lg bg-white dark:bg-white text-gray-900 dark:text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-600"
          />
        </div>
      </div>
    </motion.div>
  );
};
