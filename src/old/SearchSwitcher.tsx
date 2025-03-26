import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "./Search";            // Drug search by name
import { InsuranceSearch } from "./Search2";    // Insurance-first search flow
import { Search3 } from "./Search3";            // Rx Group–first search flow

export const SearchSwitcher: React.FC = () => {
  // Clear stored selections on mount
  useEffect(() => {
    localStorage.removeItem("selectedRx");
    localStorage.removeItem("selectedPcn");
    localStorage.removeItem("selectedBin");
  }, []);

  // "drug" for the drug search flow, "insurance" for the insurance-first flow,
  // "rx" for the Rx Group–first search flow.
  const [activeFlow, setActiveFlow] = useState<"drug" | "insurance" | "rx">("drug");

  // Base styles for the toggle buttons
  const buttonBase = "px-4 py-2 rounded-md transition-colors duration-150";
  const activeButton = "bg-blue-600 text-white";
  const inactiveButton = "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6 space-x-4">
  <button
    onClick={() => setActiveFlow("drug")}
    className={`${buttonBase} ${activeFlow === "drug" ? activeButton : inactiveButton} transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-300`}
  >
    Search by Drug
  </button>
  <button
    onClick={() => setActiveFlow("insurance")}
    className={`${buttonBase} ${activeFlow === "insurance" ? activeButton : inactiveButton} transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-300`}
  >
    Search by Insurance
  </button>
  <button
    onClick={() => setActiveFlow("rx")}
    className={`${buttonBase} ${activeFlow === "rx" ? activeButton : inactiveButton} transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-300`}
  >
    Search by Rx Group
  </button>
</div>



{/*
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveFlow("drug")}
          className={`${buttonBase} ${activeFlow === "drug" ? activeButton : inactiveButton}`}
        >
          Search by Drug
        </button>
        <button
          onClick={() => setActiveFlow("insurance")}
          className={`${buttonBase} ${activeFlow === "insurance" ? activeButton : inactiveButton}`}
        >
          Search by Insurance
        </button>
        <button
          onClick={() => setActiveFlow("rx")}
          className={`${buttonBase} ${activeFlow === "rx" ? activeButton : inactiveButton}`}
        >
          Search by Rx Group
        </button>
      </div>
*/}
      {/* Render the selected search flow with smooth fade transitions */}
      <AnimatePresence mode="wait">
        {activeFlow === "drug" && (
          <motion.div
            key="drug"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Search />
          </motion.div>
        )}
        {activeFlow === "insurance" && (
          <motion.div
            key="insurance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InsuranceSearch />
          </motion.div>
        )}
        {activeFlow === "rx" && (
          <motion.div
            key="rx"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Search3 />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchSwitcher;
