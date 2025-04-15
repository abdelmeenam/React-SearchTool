import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X as XIcon } from "lucide-react";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import axiosInstance from "../api/axiosInstance";

// Define types
interface RxGroupModel {
  id: number;
  rxGroup: string;
  insurancePCNId: number;
}

interface DrugModel {
  id: number;
  name: string;
  ndc: string;
  form: string;
  strength: string;
  drugClassId: number;
  drugClass?: string;
  acq: number;
  awp: number;
  rxcui: number;
}

// A basic fade variant for smooth fade‑ins on buttons and inputs
const fadeVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease: "easeInOut" } },
  exit: { opacity: 0 },
};

export const Search3: React.FC = () => {
  const navigate = useNavigate();

  // --- Rx Group States ---
  const [rxGroups, setRxGroups] = useState<RxGroupModel[]>([]);
  const [selectedRxGroup, setSelectedRxGroup] = useState<RxGroupModel | null>(
    null
  );
  // New state for Rx Group search input and suggestion list
  const [rxGroupSearchQuery, setRxGroupSearchQuery] = useState("");
  const [showRxGroupSuggestions, setShowRxGroupSuggestions] = useState(false);

  // --- Drug Flow States ---
  const [drugs, setDrugs] = useState<DrugModel[]>([]);
  const [drugSearchQuery, setDrugSearchQuery] = useState("");
  const [showDrugSuggestions, setShowDrugSuggestions] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<DrugModel | null>(null);

  // --- NDC States ---
  const [ndcList, setNdcList] = useState<string[]>([]);
  // Instead of a react‑select, NDC is now an input with suggestions.
  const [selectedNdc, setSelectedNdc] = useState("");
  const [ndcSearchQuery, setNdcSearchQuery] = useState("");
  const [showNdcSuggestions, setShowNdcSuggestions] = useState(false);

  // --- Fetch all Rx Groups on component mount ---
  useEffect(() => {
    const fetchRxGroups = async () => {
      try {
        const { data } = await axiosInstance.get(`/Insurance/GetAllRxGroups`);
        setRxGroups(data);
      } catch (error) {
        console.error("Error fetching Rx Groups:", error);
      }
    };
    fetchRxGroups();
  }, []);

  // --- Fetch Drugs When an Rx Group is Selected ---
  useEffect(() => {
    const fetchDrugs = async () => {
      if (selectedRxGroup) {
        try {
          const { data } = await axiosInstance.get(
            `/drug/GetDrugsByInsuranceName?insurance=${selectedRxGroup.rxGroup}`
          );
          setDrugs(data);
        } catch (error) {
          console.error("Error fetching drugs:", error);
        }
      } else {
        setDrugs([]);
      }
    };
    fetchDrugs();
  }, [selectedRxGroup]);

  // --- Drug Search Handling ---
  const handleDrugSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrugSearchQuery(e.target.value);
    setShowDrugSuggestions(true);
  };

  const filteredDrugs = drugSearchQuery
    ? drugs.filter((drug) =>
        drug.name.toLowerCase().includes(drugSearchQuery.toLowerCase())
      )
    : drugs;

  // Create a unique list of drugs based on their name
  const uniqueFilteredDrugs = Array.from(
    new Map(filteredDrugs.map((drug) => [drug.name, drug])).values()
  );

  // --- When a drug is selected, combine NDCs from all drugs with the same name ---
  const handleDrugSelect = (drug: DrugModel) => {
    const selectedDrugs = drugs.filter((d) => d.name === drug.name);
    const combinedNdcs = Array.from(new Set(selectedDrugs.map((d) => d.ndc)));
    setSelectedDrug(drug);
    setDrugSearchQuery(drug.name);
    setShowDrugSuggestions(false);
    setNdcList(combinedNdcs);
    if (combinedNdcs.length > 0) {
      setSelectedNdc(combinedNdcs[0]);
      setNdcSearchQuery(combinedNdcs[0]);
    } else {
      console.error("No NDC found for the selected drug");
    }
  };

  const handleDrugDetails = async () => {
    const { data } = await axiosInstance.get(
      `/drug/GetDetails?ndc=${selectedNdc}&insuranceId=${
        selectedRxGroup?.id || ""
      }`
    );
    localStorage.setItem("selectedPcn", data.pcn);
    localStorage.setItem(
      "selectedBin",
      (data?.binFullName || "") + " - " + data?.bin
    );
    console.log(data);
  };

  // --- Rx Group Search Input Filtering & Selection ---
  const filteredRxGroups = rxGroupSearchQuery
    ? rxGroups.filter((rg) =>
        rg.rxGroup.toLowerCase().includes(rxGroupSearchQuery.toLowerCase())
      )
    : rxGroups;

  const handleRxGroupSelect = (rg: RxGroupModel) => {
    setSelectedRxGroup(rg);
    setRxGroupSearchQuery(rg.rxGroup);
    setShowRxGroupSuggestions(false);
    // Clear downstream selections when Rx Group changes
    setDrugs([]);
    setSelectedDrug(null);
    setDrugSearchQuery("");
    setNdcList([]);
    setSelectedNdc("");
    setNdcSearchQuery("");
  };

  // --- NDC Search Input Filtering & Selection ---
  const filteredNdcList = ndcSearchQuery
    ? ndcList.filter((ndc) =>
        ndc.toLowerCase().includes(ndcSearchQuery.toLowerCase())
      )
    : ndcList;

  const handleNdcSelect = (ndc: string) => {
    setSelectedNdc(ndc);
    setNdcSearchQuery(ndc);
    setShowNdcSuggestions(false);
  };

  // --- Clear All Selections ---
  const clearAll = () => {
    setSelectedRxGroup(null);
    setRxGroupSearchQuery("");
    setDrugs([]);
    setSelectedDrug(null);
    setDrugSearchQuery("");
    setNdcList([]);
    setSelectedNdc("");
    setNdcSearchQuery("");
  };

  return (
    <motion.div className="min-h-screen">
      <PageMeta
        title="Search Medicines | TailAdmin"
        description="Search for medicines using our modern interface."
      />
      <PageBreadcrumb pageTitle="RxGroup, Drugs & NDC" />

      {/* Responsive two-column layout */}
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* Main Form Column */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            layout
            className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 shadow-lg"
          >
            {/* Header */}
            <div className="px-6 py-5 text-center">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                RxGroup, Drugs & NDC
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Search for an Rx Group and drug to view details.
              </p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 sm:p-6 space-y-6">
              {/* Rx Group Search Input */}
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Search for Rx Group
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rxGroupSearchQuery}
                    onChange={(e) => {
                      setRxGroupSearchQuery(e.target.value);
                      setShowRxGroupSuggestions(true);
                    }}
                    onFocus={() => setShowRxGroupSuggestions(true)}
                    placeholder="Type Rx Group..."
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  />
                  {showRxGroupSuggestions && filteredRxGroups.length > 0 && (
                    <motion.div
                      layout
                      initial={fadeVariant.initial}
                      animate={fadeVariant.animate}
                      exit={fadeVariant.exit}
                      className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-theme-xs max-h-60 overflow-y-auto"
                    >
                      {filteredRxGroups.map((rg) => (
                        <button
                          key={rg.id}
                          onClick={() => handleRxGroupSelect(rg)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                        >
                          {rg.rxGroup}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Drug Search Input & Suggestions */}
              {drugs.length > 0 && (
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400">
                    Search for Drug
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={drugSearchQuery}
                      onChange={handleDrugSearchChange}
                      onFocus={() => setShowDrugSuggestions(true)}
                      placeholder="Type drug name..."
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    />
                    {showDrugSuggestions && uniqueFilteredDrugs.length > 0 && (
                      <motion.div
                        layout
                        initial={fadeVariant.initial}
                        animate={fadeVariant.animate}
                        exit={fadeVariant.exit}
                        className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-theme-xs max-h-60 overflow-y-auto"
                      >
                        {uniqueFilteredDrugs.map((drug) => (
                          <button
                            key={drug.id}
                            onClick={() => handleDrugSelect(drug)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                          >
                            {drug.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* NDC Search Input */}
              {ndcList.length > 0 && (
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400">
                    Search for NDC
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={ndcSearchQuery}
                      onChange={(e) => {
                        setNdcSearchQuery(e.target.value);
                        setShowNdcSuggestions(true);
                      }}
                      onFocus={() => setShowNdcSuggestions(true)}
                      placeholder="Type NDC..."
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    />
                    {showNdcSuggestions && filteredNdcList.length > 0 && (
                      <motion.div
                        layout
                        initial={fadeVariant.initial}
                        animate={fadeVariant.animate}
                        exit={fadeVariant.exit}
                        className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-theme-xs max-h-60 overflow-y-auto"
                      >
                        {filteredNdcList.map((ndc, index) => (
                          <button
                            key={index}
                            onClick={() => handleNdcSelect(ndc)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                          >
                            {ndc}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {selectedDrug && selectedNdc && (
                <motion.button
                  layout
                  initial={fadeVariant.initial}
                  animate={fadeVariant.animate}
                  exit={fadeVariant.exit}
                  onClick={async () => {
                    if (selectedRxGroup) {
                      localStorage.setItem(
                        "selectedRx",
                        selectedRxGroup.rxGroup
                      );
                    }
                    await handleDrugDetails();
                    navigate(
                      `/drug/${
                        selectedDrug.id
                      }?ndc=${selectedNdc}&insuranceId=${
                        selectedRxGroup?.id || ""
                      }`
                    );
                  }}
                  className="w-full py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>View Drug Details</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Selected Details Dropdown Panel */}
        <div className="w-full md:w-1/3">
          <motion.div
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
            initial={{ height: "4rem" }}
            whileHover={{ height: "auto" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* Header: always visible */}
            <div className="flex justify-between items-center p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Selected Details
              </h2>
              <button
                onClick={clearAll}
                title="Reset Selection"
                className="p-2 transition-transform transform hover:scale-110 hover:bg-red-500 hover:text-white rounded-full"
              >
                <XIcon className="h-5 w-5 dark:text-white" />
              </button>
            </div>
            {/* Details: hidden by default; fade in on hover */}
            <motion.div
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 dark:text-white"
            >
              <p>
                <strong>Rx Group: </strong>
                {selectedRxGroup ? (
                  <a
                    href={`/InsuranceDetails/${selectedRxGroup.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                  >
                    {selectedRxGroup.rxGroup}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>Drug: </strong>
                {selectedDrug ? selectedDrug.name : "N/A"}
              </p>
              <p>
                <strong>NDC: </strong>
                {selectedNdc || "N/A"}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Search3;
