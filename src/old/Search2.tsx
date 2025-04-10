import React, { useState, useCallback } from "react";
import axios from "axios";
import debounce from "debounce";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import BaseUrlLoader, { loadConfig } from "../BaseUrlLoader";
import axiosInstance from "../api/axiosInstance";



// Define types
interface BinModel {
  id: number;
  name?: string;
  bin: string;
  helpDeskNumber?: string;
}

interface PcnModel {
  id: number;
  pcn: string;
  insuranceId: number;
}

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

interface SelectionOverrides {
  selectedBin?: BinModel | null;
  selectedPcn?: PcnModel | null;
  selectedRxGroup?: RxGroupModel | null;
}

// Custom styles for react-select (keeping options black)
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

// Optional fade variant for AnimatePresence (feel free to adjust)
const fadeVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const InsuranceSearch: React.FC = () => {
  const navigate = useNavigate();

  // --- Insurance Flow States ---
  const [binQuery, setBinQuery] = useState("");
  const [binSuggestions, setBinSuggestions] = useState<BinModel[]>([]);
  const [showBinSuggestions, setShowBinSuggestions] = useState(false);
  const [selectedBin, setSelectedBin] = useState<BinModel | null>(null);

  const [pcnList, setPcnList] = useState<PcnModel[]>([]);
  const [selectedPcn, setSelectedPcn] = useState<PcnModel | null>(null);

  const [rxGroups, setRxGroups] = useState<RxGroupModel[]>([]);
  const [selectedRxGroup, setSelectedRxGroup] = useState<RxGroupModel | null>(
    null
  );

  // --- Drug Flow States ---
  const [drugs, setDrugs] = useState<DrugModel[]>([]);
  const [drugSearchQuery, setDrugSearchQuery] = useState("");
  const [showDrugSuggestions, setShowDrugSuggestions] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<DrugModel | null>(null);
  const [ndcList, setNdcList] = useState<string[]>([]);
  const [selectedNdc, setSelectedNdc] = useState("");

  // --- BIN Flow ---
  const debouncedBinSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length > 0) {
        try {
          const { data } = await axiosInstance.get(
            `/drug/GetInsurancesBinsByName?bin=${query}`
          );
          setBinSuggestions(data);
          setShowBinSuggestions(true);
        } catch (error) {
          console.error("Error fetching BIN suggestions:", error);
        }
      } else {
        setBinSuggestions([]);
        setShowBinSuggestions(false);
      }
    }, 300),
    []
  );

  const handleBinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setBinQuery(query);
    debouncedBinSearch(query);
  };

  const handleBinSelect = async (bin: BinModel) => {
    setSelectedBin(bin);
    setBinQuery(`${bin.name} - ${bin.bin}`);
    setShowBinSuggestions(false);
    // Clear downstream selections
    setPcnList([]);
    setSelectedPcn(null);
    setRxGroups([]);
    setSelectedRxGroup(null);
    setDrugs([]);
    setSelectedDrug(null);
    setDrugSearchQuery("");
    setNdcList([]);
    setSelectedNdc("");

    try {
      const { data } = await axiosInstance.get(
        `/drug/GetInsurancesPcnByBinId?binId=${bin.id}`
      );
      setPcnList(data);
      await fetchDrugsBasedOnSelection({ selectedBin: bin });
    } catch (error) {
      console.error("Error fetching PCNs:", error);
    }
  };

  // --- Unified Drug Fetching Function with Overrides ---
  const fetchDrugsBasedOnSelection = async (
    overrides: SelectionOverrides = {}
  ) => {
    const rxGroup = overrides.selectedRxGroup ?? selectedRxGroup;
    const pcn = overrides.selectedPcn ?? selectedPcn;
    const bin = overrides.selectedBin ?? selectedBin;
    let url = "";
    if (rxGroup) {
      url = `/drug/GetDrugsByInsuranceName?insurance=${rxGroup.rxGroup}`;
    } else if (pcn) {
      url = `/drug/GetDrugsByPCN?pcn=${pcn.pcn}`;
    } else if (bin) {
      url = `/drug/GetDrugsByBin?bin=${bin.bin}`;
    }
    if (url) {
      try {
        const { data } = await axiosInstance.get(url);
        setDrugs(data);
      } catch (error) {
        console.error("Error fetching drugs:", error);
      }
    }
  };

  // --- PCN & Rx Group Selection ---
  const handlePcnSelectFromSelect = async (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (!selectedOption) {
      setSelectedPcn(null);
      return;
    }
    const pcn =
      pcnList.find((item) => item.id === selectedOption.value) || null;
    setSelectedPcn(pcn);
    // Clear downstream selections
    setRxGroups([]);
    setSelectedRxGroup(null);
    setDrugs([]);
    setSelectedDrug(null);
    setDrugSearchQuery("");
    setNdcList([]);
    setSelectedNdc("");

    if (pcn) {
      try {
        const { data } = await axiosInstance.get(
          `/drug/GetInsurancesRxByPcnId?pcnId=${pcn.id}`
        );
        setRxGroups(data);
      } catch (error) {
        console.error("Error fetching Rx Groups:", error);
      }
      await fetchDrugsBasedOnSelection({ selectedPcn: pcn });
    }
  };

  const handleRxGroupSelectFromSelect = async (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (!selectedOption) {
      setSelectedRxGroup(null);
      return;
    }
    const rxGroup =
      rxGroups.find((item) => item.id === selectedOption.value) || null;
    setSelectedRxGroup(rxGroup);
    // Clear downstream selections
    setDrugs([]);
    setSelectedDrug(null);
    setDrugSearchQuery("");
    setNdcList([]);
    setSelectedNdc("");
    await fetchDrugsBasedOnSelection({ selectedRxGroup: rxGroup });
  };

  // --- Drug Flow ---
  const handleDrugSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setDrugSearchQuery(query);
    setShowDrugSuggestions(true);
  };

  const filteredDrugs = drugSearchQuery
    ? drugs.filter((drug) =>
        drug.name.toLowerCase().includes(drugSearchQuery.toLowerCase())
      )
    : drugs;

  const uniqueFilteredDrugs = Array.from(
    new Map(filteredDrugs.map((drug) => [drug.name, drug])).values()
  );

  const handleDrugSelect = (drug: DrugModel) => {
    // Combine unique NDCs from drugs with the same name.
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

  // --- NDC Selection via react-select ---
  const handleNdcSelectFromSelect = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedNdc(selectedOption ? selectedOption.value : "");
  };

  return (
    <motion.div className="min-h-screen">
      <PageMeta
        title="Insurance Search | TailAdmin"
        description="Search for medicines using our modern interface."
      />
      <PageBreadcrumb pageTitle="Insurance Search" />

      <motion.div
        layout
        className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-full max-w-2xl mx-auto my-8 p-4"
      >
        {/* Header */}
        <div className="px-6 py-5 text-center">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Insurance Search
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Search for drugs based on BIN, PCN, and Rx Group criteria.
          </p>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 sm:p-6">
          <motion.div layout className="space-y-6">
            {/* BIN Input */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400">
                Type BIN or Insurance Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={binQuery}
                  onChange={handleBinInputChange}
                  onFocus={() =>
                    binQuery.length > 0 && setShowBinSuggestions(true)
                  }
                  placeholder="e.g., 123456 or HealthCo"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
                <AnimatePresence>
                  {showBinSuggestions && binSuggestions.length > 0 && (
                    <motion.div
                      layout
                      initial={fadeVariant.initial}
                      animate={fadeVariant.animate}
                      exit={fadeVariant.exit}
                      className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-theme-xs max-h-60 overflow-y-auto"
                    >
                      {binSuggestions.map((bin) => (
                        <button
                          key={bin.id}
                          onClick={() => handleBinSelect(bin)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                        >
                          {bin.bin} {bin.name && `- ${bin.name}`}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* PCN Searchable Dropdown */}
            {pcnList.length > 0 && (
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Select PCN
                </label>
                <Select
                  value={
                    selectedPcn
                      ? { value: selectedPcn.id, label: selectedPcn.pcn }
                      : null
                  }
                  onChange={handlePcnSelectFromSelect}
                  options={pcnList.map((pcn) => ({
                    value: pcn.id,
                    label: pcn.pcn,
                  }))}
                  placeholder="Select a PCN..."
                  styles={customStyles}
                  className="basic-single"
                  classNamePrefix="select"
                />
              </div>
            )}

            {/* Rx Group Searchable Dropdown */}
            {rxGroups.length > 0 && (
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Select Rx Group
                </label>
                <Select
                  value={
                    selectedRxGroup
                      ? {
                          value: selectedRxGroup.id,
                          label: selectedRxGroup.rxGroup,
                        }
                      : null
                  }
                  onChange={handleRxGroupSelectFromSelect}
                  options={rxGroups.map((rx) => ({
                    value: rx.id,
                    label: rx.rxGroup,
                  }))}
                  placeholder="Select an Rx Group..."
                  styles={customStyles}
                  className="basic-single"
                  classNamePrefix="select"
                />
              </div>
            )}

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
                    placeholder="e.g., Metformin"
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

            {/* NDC Searchable Dropdown */}
            {ndcList.length > 0 && (
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Select NDC
                </label>
                <Select
                  value={
                    selectedNdc
                      ? { value: selectedNdc, label: selectedNdc }
                      : null
                  }
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
                  onClick={() => {
                    localStorage.setItem(
                      "selectedRx",
                      selectedRxGroup?.rxGroup || ""
                    );
                    localStorage.setItem("selectedPcn", selectedPcn?.pcn || "");
                    localStorage.setItem(
                      "selectedBin",
                      (selectedBin?.name || "") +
                        " - " +
                        (selectedBin?.bin || "")
                    );
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
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InsuranceSearch;
