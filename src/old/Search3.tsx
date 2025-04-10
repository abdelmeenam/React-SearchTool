import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BaseUrlLoader, { loadConfig } from "../BaseUrlLoader";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import axiosInstance from "../api/axiosInstance";

// Ensure the config is loaded

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

// Custom styles for react-select (ensuring option text appears in black)
const customStyles = {
  option: (provided: any) => ({
    ...provided,
    color: "black",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "black",
  }),
  input: (provided: any) => ({
    ...provided,
    color: "black",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "black",
  }),
};

const fadeVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const Search3: React.FC = () => {
  const navigate = useNavigate();

  // --- Rx Group States ---
  const [rxGroups, setRxGroups] = useState<RxGroupModel[]>([]);
  const [selectedRxGroup, setSelectedRxGroup] = useState<RxGroupModel | null>(null);

  // --- Drug Flow States ---
  const [drugs, setDrugs] = useState<DrugModel[]>([]);
  const [drugSearchQuery, setDrugSearchQuery] = useState("");
  const [showDrugSuggestions, setShowDrugSuggestions] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<DrugModel | null>(null);

  // --- NDC States ---
  const [ndcList, setNdcList] = useState<string[]>([]);
  const [selectedNdc, setSelectedNdc] = useState("");

  // --- Fetch all Rx Groups on component mount ---
  useEffect(() => {
    const fetchRxGroups = async () => {
      try {
        const { data } = await axiosInstance.get(`/Insurance/GetAllRxGroups`, {
        });
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
    localStorage.setItem("selectedBin", (data?.binFullName || "") + " - " + data?.bin);
    console.log(data);
  };

  const handleNdcSelectFromSelect = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedNdc(selectedOption ? selectedOption.value : "");
  };

  return (
    <motion.div className="min-h-screen">
      <PageMeta
        title="Search Medicines | TailAdmin"
        description="Search for medicines using our modern interface."
      />
      <PageBreadcrumb pageTitle="RxGroup, Drugs & NDC" />

      <motion.div
        layout
        className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-full max-w-2xl mx-auto my-8 p-4"
      >
        {/* Header */}
        <div className="px-6 py-5 text-center">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            RxGroup, Drugs & NDC
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select an Rx Group and search for drugs to view details.
          </p>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 sm:p-6">
          <div className="space-y-6">
            {/* Rx Group Dropdown */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400">
                Select Rx Group
              </label>
              <Select
                value={
                  selectedRxGroup
                    ? { value: selectedRxGroup.id, label: selectedRxGroup.rxGroup }
                    : null
                }
                onChange={(option) => {
                  const selected = rxGroups.find((rg) => rg.id === option?.value) || null;
                  setSelectedRxGroup(selected);
                  // Clear downstream selections when Rx Group changes
                  setDrugs([]);
                  setSelectedDrug(null);
                  setDrugSearchQuery("");
                  setNdcList([]);
                  setSelectedNdc("");
                }}
                options={rxGroups.map((rg) => ({
                  value: rg.id,
                  label: rg.rxGroup,
                }))}
                placeholder="Select an Rx Group..."
                styles={customStyles}
                className="basic-single"
                classNamePrefix="select"
              />
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
                  <AnimatePresence>
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
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* NDC Dropdown */}
            {ndcList.length > 0 && (
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Select NDC
                </label>
                <Select
                  value={selectedNdc ? { value: selectedNdc, label: selectedNdc } : null}
                  onChange={handleNdcSelectFromSelect}
                  options={ndcList.map((ndc) => ({ value: ndc, label: ndc }))}
                  placeholder="Select an NDC..."
                  styles={customStyles}
                  className="basic-single"
                  classNamePrefix="select"
                />
              </div>
            )}

            {/* Action Button */}
            <AnimatePresence>
              {selectedDrug && selectedNdc && (
                <motion.button
                  layout
                  initial={fadeVariant.initial}
                  animate={fadeVariant.animate}
                  exit={fadeVariant.exit}
                  onClick={async () => {
                    if (selectedRxGroup) {
                      localStorage.setItem("selectedRx", selectedRxGroup.rxGroup);
                    }
                    await handleDrugDetails();
                    navigate(
                      `/drug/${selectedDrug.id}?ndc=${selectedNdc}&insuranceId=${selectedRxGroup?.id || ""}`
                    );
                  }}
                  className="w-full py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>View Drug Details</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Search3;
