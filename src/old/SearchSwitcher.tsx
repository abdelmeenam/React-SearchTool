import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Search } from "./Search"; // Drug search by name
import { InsuranceSearch } from "./Search2"; // Insurance-first search flow
import { Search3 } from "./Search3"; // Rx Group–first search flow

export const SearchSwitcher: React.FC = () => {
  // Remove any previously stored selections on mount
  useEffect(() => {
    localStorage.removeItem("selectedRx");
    localStorage.removeItem("selectedPcn");
    localStorage.removeItem("selectedBin");
  }, []);

  // Get the id from the route parameters
  const { id } = useParams<{ id: string }>();

  // "drug" for the drug search flow, "insurance" for the insurance-first flow,
  // "rx" for the Rx Group–first search flow.
  const [activeFlow, setActiveFlow] = useState<"drug" | "insurance" | "rx">("drug");

  // Update activeFlow based on the id from the URL
  useEffect(() => {
    if (id === "1") {
      setActiveFlow("drug");
    } else if (id === "2") {
      setActiveFlow("insurance");
    } else if (id === "3") {
      setActiveFlow("rx");
    }
  }, [id]);

  const ResponsiveButton = ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <motion.button
      whileHover={{
        scale: 1.1,
        boxShadow: "0px 8px 20px rgba(59, 130, 246, 0.4)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="w-full sm:w-auto px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200"
    >
      {children}
    </motion.button>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Toggle Buttons */}
      {/* <div className="flex flex-col sm:flex-row justify-center mb-6 gap-4">
        <ResponsiveButton onClick={() => setActiveFlow("drug")}>
          Search by Drug
        </ResponsiveButton>
        <ResponsiveButton onClick={() => setActiveFlow("insurance")}>
          Search by Insurance
        </ResponsiveButton>
        <ResponsiveButton onClick={() => setActiveFlow("rx")}>
          Search by Rx Group
        </ResponsiveButton>
      </div> */}

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
