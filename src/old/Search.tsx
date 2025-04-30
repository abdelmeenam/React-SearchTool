import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "debounce";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X as XIcon, ExternalLink } from "lucide-react";
import {
  BestAlternative,
  Drug,
  DrugInsuranceInfo,
  Prescription,
} from "../types";
import BaseUrlLoader, { loadConfig } from "../BaseUrlLoader";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import axiosInstance from "../api/axiosInstance";

// A simple fade variant that only animates opacity:
const fadeVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
};

// Variant for the dropdown details panel (animates height and opacity)
const dropdownVariant = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.2, ease: "easeInOut" },
  },
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
  const [selectedInsurance, setSelectedInsurance] =
    useState<DrugInsuranceInfo | null>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] =
    useState<number>(-1);

  // State for controlling the visibility of the selected details dropdown
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // New state to store drug details (e.g. net price information)
  const [drugNetDetails, setDrugNetDetails] = useState<Prescription | null>(
    null
  );
  const [bestDrugNetDetails, setBestDrugNetDetails] =
    useState<Prescription | null>(null);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 1) {
        try {
          const { data } = await axiosInstance.get(
            `/drug/searchByName?name=${query}`
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
    setDrugNetDetails(null);
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
    setDrugNetDetails(null);

    try {
      const { data } = await axiosInstance.get(
        `/drug/getDrugNDCs?name=${drug.name}`
      );
      setNdcList(data);
    } catch (error) {
      console.error("Error fetching NDC list:", error);
    }
  };

  const handleNdcSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ndc = e.target.value;
    setSelectedNdc(ndc);
    // Reset insurance and net details each time a new NDC is chosen
    setInsurances([]);
    setSelectedInsurance(null);
    setDrugNetDetails(null);

    axiosInstance
      .get(`/drug/GetInsuranceByNdc?ndc=${ndc}`)
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
        `/drug/${selectedDrug.id}?ndc=${selectedNdc}&insuranceId=${
          selectedInsurance?.insuranceId || ""
        }`
      );
    }
  };

  // Fetch drug details (e.g. net price) if rxGroup is available along with NDC and insurance selection.
  useEffect(() => {
    async function fetchDrugDetails() {
      if (selectedDrug && selectedNdc && selectedInsurance) {
        try {
          const { data: response2 } = await axiosInstance.get(
            `/drug/GetDetails?ndc=${selectedNdc}&insuranceId=${selectedInsurance.insuranceId}`
          );
          // console.log("Fetched drug net details:", response2);
          // const response4 = await axiosInstance.get(
          //   `/drug/GetAllDrugs?classId=${response2.drugClassId}`
          // );
          // console.log(response4.data);
          // console.log(selectedInsurance.insuranceId)
          // const alternatives = response4.data.filter(
          //   (item: Prescription) => item.insuranceId === selectedInsurance.insuranceId
          // );
          // const sortedData = alternatives.sort(
          //               (a: Prescription, b: Prescription) => b.net - a.net
          //             );
          // console.log("Fetched drug best net details:" ,sortedData[0]);

          setDrugNetDetails(response2);
          // setBestDrugNetDetails(sortedData[0]);
          // setBestDrugNetDetails(response3);
        } catch (error) {
          console.error("Error fetching drug net details:", error);
        }
      } else {
        setDrugNetDetails(null); // clear details if dependencies are not met
      }
    }
    fetchDrugDetails();
  }, [selectedDrug, selectedNdc, selectedInsurance]);

  return (
    <motion.div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <PageMeta
        title="Search Medicines | TailAdmin"
        description="Search for medicines using our modern interface."
      />
      <PageBreadcrumb pageTitle="Search Medicines" />

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* Search Form Column */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            layout
            className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 p-6 shadow-lg"
          >
            <div className="px-6 py-5 text-center">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                Search for Medicines
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter the drug name to find matching NDC codes and insurance
                coverage.
              </p>
            </div>

            {/* Search Section */}
            <div className="mb-6 p-4 rounded-lg">
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
                  role="combobox" // Explicitly define the role
                  aria-label="Search for a drug by name"
                  aria-autocomplete="list"
                  aria-controls="suggestion-list"
                  aria-expanded={showSuggestions}
                  aria-activedescendant={
                    activeSuggestionIndex >= 0
                      ? `suggestion-${activeSuggestionIndex}`
                      : undefined
                  }
                  value={searchQuery}
                  onChange={(e) => {
                    handleSearchChange(e);
                    setActiveSuggestionIndex(-1);
                  }}
                  onFocus={() =>
                    searchQuery.length >= 1 && setShowSuggestions(true)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveSuggestionIndex((prev) =>
                        prev + 1 < suggestions.length ? prev + 1 : 0
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveSuggestionIndex((prev) =>
                        prev - 1 >= 0 ? prev - 1 : suggestions.length - 1
                      );
                    } else if (
                      e.key === "Enter" &&
                      activeSuggestionIndex >= 0
                    ) {
                      e.preventDefault();
                      handleDrugSelect(suggestions[activeSuggestionIndex]);
                    } else if (e.key === "Escape") {
                      setShowSuggestions(false);
                      setActiveSuggestionIndex(-1);
                    }
                  }}
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
                      aria-label="Clear search input"
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      <XIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      id="suggestion-list"
                      role="listbox"
                      aria-label="Drug search suggestions"
                      className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-md max-h-60 overflow-y-auto"
                    >
                      {suggestions.map((drug: Drug, index) => (
                        <button
                          key={drug.id}
                          id={`suggestion-${index}`}
                          role="option"
                          aria-selected={activeSuggestionIndex === index}
                          onClick={() => handleDrugSelect(drug)}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            activeSuggestionIndex === index
                              ? "bg-blue-100 text-blue-800"
                              : "hover:bg-gray-100 text-gray-800"
                          } focus:outline-none`}
                        >
                          {drug.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* NDC Selector */}
            {ndcList.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label
                  htmlFor="ndcSelect"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Select NDC
                </label>
                <select
                  id="ndcSelect"
                  aria-label="Select NDC code"
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
            )}

            {/* Insurance Selector */}
            {insurances.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label
                  htmlFor="insuranceSelect"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Select Insurance
                </label>
                <select
                  id="insuranceSelect"
                  aria-label="Select insurance group"
                  value={selectedInsurance?.insuranceId || ""}
                  onChange={(e) => {
                    const selected =
                      insurances.find(
                        (i) => i.insuranceId === Number(e.target.value)
                      ) || null;
                    setSelectedInsurance(selected);
                    setDrugNetDetails(null);
                  }}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select insurance...</option>
                  {insurances.map((insurance) => (
                    <option
                      key={insurance.insuranceId}
                      value={insurance.insuranceId}
                    >
                      {insurance.insurance}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                  aria-label="View Drug Details" // Match the visible text
                  className="w-full py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span>View Drug Details</span>
                  <ExternalLink className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>

          </motion.div>
        </div>

        {/* Redesigned Selected Details Section */}
        <div className="w-full md:w-1/3">
          <motion.div
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Header: Always visible */}
            <div className="flex justify-between items-center p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Selected Details
              </h2>
              <button
                onClick={clearSearch}
                title="Reset Search"
                className="p-2 transition-transform transform hover:scale-110 hover:bg-red-500 hover:text-white rounded-full"
              >
                <XIcon className="h-5 w-5 dark:text-white" />
              </button>
            </div>
            {/* Dropdown Details: Animates in on hover */}
            <motion.div
              variants={dropdownVariant}
              initial="hidden"
              animate={dropdownVisible ? "visible" : "hidden"}
              className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 dark:text-white"
            >
              <p>
                <strong>Drug Name: </strong>
                {selectedDrug ? selectedDrug.name : "N/A"}
              </p>
              {selectedDrug && (selectedDrug as any).rxGroup && (
                <p>
                  <strong>Rx Group: </strong>
                  {(selectedDrug as any).rxGroup}
                </p>
              )}
              <p>
                <strong>NDC: </strong>
                {selectedNdc || "N/A"}
              </p>
              <p>
                <strong>Insurance: </strong>
                {selectedInsurance ? (
                  <a
                    href={`/InsuranceDetails/${selectedInsurance.insuranceId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                  >
                    {selectedInsurance.insurance}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>

              {/* Newly added net price section */}
              {drugNetDetails && (
                <motion.div
                  layout
                  variants={fadeVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  <p>
                    <strong>Net Price: </strong>
                    {drugNetDetails.net ? `$${drugNetDetails.net}` : "N/A"}
                  </p>
                </motion.div>
              )}
              {/* {bestDrugNetDetails && (
                <motion.div
                  layout
                  variants={fadeVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="mt-4 p-4 bg-green-100 dark:bg-gray-700 rounded-lg"
                >
                  <p>
                    <strong>Best Alternative Drug: </strong>
                    {bestDrugNetDetails.drugName}
                  </p>
                  <p>
                    <strong>Best Alternative Drug NDC: </strong>
                    {bestDrugNetDetails.ndcCode}
                  </p>
            
                  <p>
                    <strong>Net Price: </strong>
                    {bestDrugNetDetails.net
                      ? `$${bestDrugNetDetails.net}`
                      : "N/A"}
                  </p>
                </motion.div>
              )} */}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Search;
