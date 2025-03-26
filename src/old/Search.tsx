import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "debounce";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X as XIcon, ExternalLink } from "lucide-react";
import { Drug, DrugInsuranceInfo } from "../types";
import BaseUrlLoader, { loadConfig } from "../BaseUrlLoader";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

await loadConfig();
const API_BASE_URL = BaseUrlLoader.API_BASE_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

// A simple fade variant that only animates opacity:
const fadeVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
};

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Drug[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [ndcList, setNdcList] = useState<string[]>([]);
  const [selectedNdc, setSelectedNdc] = useState("");
  const [insurances, setInsurances] = useState<DrugInsuranceInfo[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<DrugInsuranceInfo | null>(null);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 1) {
        try {
          const { data } = await axios.get(
            `${API_BASE_URL}/drug/searchByName?name=${query}`,
            { headers: getAuthHeader() }
          );
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error searching drugs:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedDrug(null);
    setNdcList([]);
    setSelectedNdc("");
    setInsurances([]);
    setSelectedInsurance(null);
  };

  const handleDrugSelect = async (drug: Drug) => {
    setSelectedDrug(drug);
    setSearchQuery(drug.name);
    setShowSuggestions(false);
    // Reset dependent fields
    setNdcList([]);
    setSelectedNdc("");
    setInsurances([]);
    setSelectedInsurance(null);

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/drug/getDrugNDCs?name=${drug.name}`,
        { headers: getAuthHeader() }
      );
      setNdcList(data);
    } catch (error) {
      console.error("Error fetching NDC list:", error);
    }
  };

  const handleNdcSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ndc = e.target.value;
    setSelectedNdc(ndc);
    // Reset insurance each time a new NDC is chosen
    setInsurances([]);
    setSelectedInsurance(null);

    axios
      .get(`${API_BASE_URL}/drug/GetInsuranceByNdc?ndc=${ndc}`, {
        headers: getAuthHeader(),
      })
      .then(({ data }) => {
        setInsurances(data);
      })
      .catch((error) => {
        console.error("Error fetching insurance:", error);
      });
  };

  const handleSearch = () => {
    if (selectedDrug) {
      localStorage.setItem("selectedRx", selectedInsurance?.insurance || "");
      navigate(
        `/drug/${selectedDrug.id}?ndc=${selectedNdc}&insuranceId=${selectedInsurance?.insuranceId || ""}`
      );
    }
  };

  return (
    <motion.div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageMeta
        title="Search Medicines | TailAdmin"
        description="Search for medicines using our modern interface."
      />
      <PageBreadcrumb pageTitle="Search Medicines" />

      <motion.div
        layout
        className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 w-full max-w-2xl mx-auto my-8 p-6 shadow-lg"
      >
        {/* Header */}
        <div className="px-6 py-5 text-center">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Search for Medicines
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter the drug name to find matching NDC codes and insurance coverage.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <label
            htmlFor="drugSearch"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Search for a Drug
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="drugSearch"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length >= 1 && setShowSuggestions(true)}
              placeholder="e.g., Metformin"
              className="h-11 w-full rounded-lg border border-blue-300 pl-10 pr-10 py-2.5 text-sm shadow-md placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-3 flex items-center"
                  title="Clear"
                >
                  <XIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-md max-h-60 overflow-y-auto"
                >
                  {[...new Map(suggestions.map((d) => [d.name, d])).values()].map(
                    (drug: Drug) => (
                      <button
                        key={drug.id}
                        onClick={() => handleDrugSelect(drug)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                      >
                        {drug.name}
                      </button>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* NDC & Insurance Section */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {/* NDC Selector */}
          <AnimatePresence>
            {ndcList.length > 0 && (
              <motion.div
                layout
                variants={fadeVariant}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mb-4"
              >
                <label
                  htmlFor="ndcSelect"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Select NDC
                </label>
                <div className="relative">
                  <select
                    id="ndcSelect"
                    value={selectedNdc}
                    onChange={handleNdcSelect}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select NDC code...</option>
                    {ndcList.map((ndc) => (
                      <option key={ndc} value={ndc}>
                        {ndc}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Insurance Selector */}
          <AnimatePresence>
            {insurances.length > 0 && (
              <motion.div
                layout
                variants={fadeVariant}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <label
                  htmlFor="insuranceSelect"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Select Insurance
                </label>
                <div className="relative">
                  <select
                    id="insuranceSelect"
                    value={selectedInsurance?.insuranceId || ""}
                    onChange={(e) => {
                      const selected =
                        insurances.find(
                          (i) => i.insuranceId === Number(e.target.value)
                        ) || null;
                      setSelectedInsurance(selected);
                    }}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select insurance...</option>
                    {insurances.map((insurance) => (
                      <option key={insurance.insuranceId} value={insurance.insuranceId}>
                        {insurance.insurance}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <AnimatePresence>
          {selectedDrug && (
            <motion.button
              layout
              variants={fadeVariant}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={handleSearch}
              className="w-full py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-md"
            >
              <span>View Drug Details</span>
              <ExternalLink className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Search;
