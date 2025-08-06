import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Search } from './Search';
import { InsuranceSearch } from './Search2';
import { Search3 } from './Search3';
import { InsuranceSearch2 } from './Search4'; // <-- Add this import

const SearchSwitcher: React.FC = () => {
  // Clear previous selections on mount
  useEffect(() => {
    localStorage.removeItem('selectedRx');
    localStorage.removeItem('selectedPcn');
    localStorage.removeItem('selectedBin');
  }, []);

  // Determine initial flow from URL param
  const { id } = useParams<{ id: string }>();
  const [activeFlow, setActiveFlow] = useState<'drug' | 'insurance' | 'rx' | 'drugClass'>(() => {
    switch (id) {
      case '2':
        return 'insurance';
      case '3':
        return 'rx';
      case '4':
        return 'drugClass';
      default:
        return 'drug';
    }
  });

  useEffect(() => {
    if (id === '1') setActiveFlow('drug');
    else if (id === '2') setActiveFlow('insurance');
    else if (id === '3') setActiveFlow('rx');
    else if (id === '4') setActiveFlow('drugClass');
  }, [id]);

  const flows = [
    { key: 'drug', label: 'Search by Drug' },
    { key: 'insurance', label: 'Search by Insurance' },
    { key: 'rx', label: 'Search by Rx Group' },
    { key: 'drugClass', label: 'Search by Drug Class' }, // <-- Add this
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Tablist for selecting search flow */}
      {/* <div
        role="tablist"
        aria-label="Search methods"
        className="flex flex-col sm:flex-row justify-center mb-6 gap-4"
      >
        {flows.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            type="button"
            id={`${key}-tab`}
            aria-controls={`${key}-panel`}
            aria-selected={activeFlow === key}
            onClick={() => setActiveFlow(key as any)}
            className={`py-2 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
              ${activeFlow === key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'}`}
          >
            {label}
          </button>
        ))}
      </div> */}

      {/* Panels with fade animations */}
      <section>
        <AnimatePresence mode="wait">
          {activeFlow === 'drug' && (
            <motion.div
              key="drug"
              role="tabpanel"
              id="drug-panel"
              aria-labelledby="drug-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Search />
            </motion.div>
          )}

          {activeFlow === 'insurance' && (
            <motion.div
              key="insurance"
              role="tabpanel"
              id="insurance-panel"
              aria-labelledby="insurance-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <InsuranceSearch />
            </motion.div>
          )}

          {activeFlow === 'rx' && (
            <motion.div
              key="rx"
              role="tabpanel"
              id="rx-panel"
              aria-labelledby="rx-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Search3 />
            </motion.div>
          )}

          {activeFlow === 'drugClass' && (
            <motion.div
              key="drugClass"
              role="tabpanel"
              id="drugClass-panel"
              aria-labelledby="drugClass-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <InsuranceSearch2 />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
};

export default SearchSwitcher;