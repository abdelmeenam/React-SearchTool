import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import debounce from "debounce";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X as XIcon } from "lucide-react";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import BaseUrlLoader, { loadConfig } from "../BaseUrlLoader";
import axiosInstance from "../api/axiosInstance";
import { Prescription, SearchLog } from "../types";

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

// Optional fade variant used for various transitions
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

export const InsuranceSearch: React.FC = () => {
  const navigate = useNavigate();
  const [drugNetDetails, setDrugNetDetails] = useState<Prescription | null>(
    null
  );
  const [bestDrugNetDetails, setBestDrugNetDetails] =
    useState<Prescription | null>(null);

  // --- Insurance Flow States ---
  const [binQuery, setBinQuery] = useState("");
  const [binSuggestions, setBinSuggestions] = useState<BinModel[]>([]);
  const [showBinSuggestions, setShowBinSuggestions] = useState(false);
  const [selectedBin, setSelectedBin] = useState<BinModel | null>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] =
    useState<number>(-1);
  const [pcnList, setPcnList] = useState<PcnModel[]>([]);
  const [selectedPcn, setSelectedPcn] = useState<PcnModel | null>(null);
  // New PCN search state
  const [pcnSearchQuery, setPcnSearchQuery] = useState("");
  const [showPcnSuggestions, setShowPcnSuggestions] = useState(false);
  const [limitSearch, setLimitSearch] = useState(true); // Toggle state

  const [rxGroups, setRxGroups] = useState<RxGroupModel[]>([]);
  const [selectedRxGroup, setSelectedRxGroup] = useState<RxGroupModel | null>(
    null
  );
  const [Details, setDetails] = useState<SearchLog | null>(null);

  // New Rx Group search state
  const [rxGroupSearchQuery, setRxGroupSearchQuery] = useState("");
  const [showRxGroupSuggestions, setShowRxGroupSuggestions] = useState(false);

  // --- Drug Flow States ---
  const [drugs, setDrugs] = useState<DrugModel[]>([]);
  const [drugSearchQuery, setDrugSearchQuery] = useState("");
  const [showDrugSuggestions, setShowDrugSuggestions] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<DrugModel | null>(null);
  const [ndcList, setNdcList] = useState<string[]>([]);
  // Instead of a react‑select, NDC becomes a search input too:
  const [selectedNdc, setSelectedNdc] = useState("");
  const [ndcSearchQuery, setNdcSearchQuery] = useState("");
  const [showNdcSuggestions, setShowNdcSuggestions] = useState(false);

  // --- Insurance (Drug Coverage) States ---
  const [insurances, setInsurances] = useState<any[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<any | null>(null);

  // --- Dropdown state for Selected Details panel ---
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (Details) {
      localStorage.setItem("searchLogDetails", JSON.stringify(Details));
    }
  }, [Details]);
  useEffect(() => {
    async function fetchDrugDetails() {
      console.log("Hi : ", selectedNdc, selectedRxGroup);
      if (selectedNdc && selectedRxGroup) {
        try {
          const { data: response2 } = await axiosInstance.get(
            `/drug/GetDetails?ndc=${selectedNdc}&insuranceId=${selectedRxGroup.id}`
          );
          console.log(
            "Fetched drug net details:",
            response2.drugClassId,
            " ",
            response2.insuranceId
          );

          // const { data: response3 } = await axiosInstance.get(
          //   `/drug/GetBestAlternativeByNDCRxGroupId?classId=${response2.drugClassId}&insuranceId=${response2.insuranceId}`
          // );
          // console.log("Fetched drug best net details:", response3);

          setDrugNetDetails(response2);
          // setBestDrugNetDetails(response3);
        } catch (error) {
          console.error("Error fetching drug net details:", error);
        }
      } else {
        setDrugNetDetails(null); // clear details if dependencies are not met
      }
    }
    fetchDrugDetails();
  }, [selectedNdc, selectedRxGroup]);
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
    setPcnSearchQuery("");
    setRxGroupSearchQuery("");
    setNdcSearchQuery("");

    try {
      const { data } = await axiosInstance.get(
        `/drug/GetInsurancesPcnByBinId?binId=${bin.id}`
      );
      setPcnList(data);
      if (bin.name === "Medi-Cal") {
        setSelectedPcn(data[0]);
        setPcnSearchQuery(data[0]?.pcn || "");
        handlePcnSelect(data[0]);
      }

      await fetchDrugsBasedOnSelection({ selectedBin: bin });
    } catch (error) {
      console.error("Error fetching PCNs:", error);
    }
  };

  // --- Unified Drug Fetching Function with Overrides ---
  const fetchDrugsBasedOnSelection = async (
    overrides: SelectionOverrides = {}
  ) => {
    // const rxGroup = overrides.selectedRxGroup ?? selectedRxGroup;
    // const pcn = overrides.selectedPcn ?? selectedPcn;
    // const bin = overrides.selectedBin ?? selectedBin;
    // let url = "";
    // if (rxGroup) {
    //   url = `/drug/GetDrugsByInsuranceName?insurance=${rxGroup.rxGroup}`;
    // } else if (pcn) {
    //   url = `/drug/GetDrugsByPCN?pcn=${pcn.pcn}`;
    // } else if (bin) {
    //   url = `/drug/GetDrugsByBin?bin=${bin.bin}`;
    // }
    // console.log("search query : ", drugSearchQuery);
    // if (url && limitSearch === true) {
    //   try {
    //     const { data } = await axiosInstance.get(url);
    //     setDrugs(data);
    //   } catch (error) {
    //     console.error("Error fetching drugs:", error);
    //   }
    // }
  };

  // --- PCN Search Input Handlers ---
  const filteredPcnList = pcnSearchQuery
    ? pcnList.filter((item) =>
        item.pcn.toLowerCase().includes(pcnSearchQuery.toLowerCase())
      )
    : pcnList;

  const handlePcnSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPcnSearchQuery(e.target.value);
    setShowPcnSuggestions(true);
  };

  const handlePcnSelect = async (pcn: PcnModel) => {
    setSelectedPcn(pcn);
    setPcnSearchQuery(pcn.pcn);
    setShowPcnSuggestions(false);
    // Clear downstream selections
    setRxGroups([]);
    setSelectedRxGroup(null);
    setDrugs([]);
    setSelectedDrug(null);
    setDrugSearchQuery("");
    setNdcList([]);
    setSelectedNdc("");
    setRxGroupSearchQuery("");
    setNdcSearchQuery("");
    try {
      const { data } = await axiosInstance.get(
        `/drug/GetInsurancesRxByPcnId?pcnId=${pcn.id}`
      );
      setRxGroups(data);
      if (pcn.pcn === "Medi-Cal") {
        setRxGroupSearchQuery(data[0]?.rxGroup || "");
        setSelectedRxGroup(data[0]);
      }
    } catch (error) {
      console.error("Error fetching Rx Groups:", error);
    }
    await fetchDrugsBasedOnSelection({ selectedPcn: pcn });
  };

  // --- Rx Group Search Input Handlers ---
  const filteredRxGroupList = rxGroupSearchQuery
    ? rxGroups.filter((item) =>
        item.rxGroup.toLowerCase().includes(rxGroupSearchQuery.toLowerCase())
      )
    : rxGroups;

  const handleRxGroupSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRxGroupSearchQuery(e.target.value);
    setShowRxGroupSuggestions(true);
  };

  const handleRxGroupSelect = async (rxGroup: RxGroupModel) => {
    setSelectedRxGroup(rxGroup);
    setRxGroupSearchQuery(rxGroup.rxGroup);
    setShowRxGroupSuggestions(false);
    // Clear downstream selections
    setDrugs([]);
    setSelectedDrug(null);
    setDrugSearchQuery("");
    setNdcList([]);
    setSelectedNdc("");
    setNdcSearchQuery("");
    await fetchDrugsBasedOnSelection({ selectedRxGroup: rxGroup });
  };

  // --- NDC Search Input Handlers ---
  const filteredNdcList = ndcSearchQuery
    ? ndcList.filter((ndc) =>
        ndc.toLowerCase().includes(ndcSearchQuery.toLowerCase())
      )
    : ndcList;

  const handleNdcSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNdcSearchQuery(e.target.value);
    setShowNdcSuggestions(true);
  };

  const handleNdcSelect = (ndc: string) => {
    setSelectedNdc(ndc);
    setNdcSearchQuery(ndc);
    setShowNdcSuggestions(false);
  };

  // --- Drug Flow ---
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleDrugSearchChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value;
    setDrugSearchQuery(query);
    if (!limitSearch) {
      setCurrentPage(1);

      try {
        const url = `/drug/searchByName?name=${query}&pageNumber=1&pageSize=20`;
        const { data } = await axiosInstance.get(url);
        setDrugs(data);
      } catch (error) {
        console.error("Error fetching drugs:", error);
      }
    } else {
      var url = "";
      if (selectedRxGroup) {
        url = `/drug/GetDrugsByInsuranceNamePagintated?insurance=${selectedRxGroup.rxGroup}&drugName=${query}&pageNumber=1&pageSize=20`;
      } else if (selectedPcn) {
        url = `/drug/GetDrugsByPCNPagintated?insurance=${selectedPcn.pcn}&drugName=${query}&pageNumber=1&pageSize=20`;
      } else if (selectedBin) {
        url = `/drug/GetDrugsByBINPagintated?insurance=${selectedBin.bin}&drugName=${query}&pageNumber=1&pageSize=20`;
      }
      try {
        console.log("URL: ", url);
        const { data } = await axiosInstance.get(url);
        console.log("Data: ", data);
        setDrugs(data);
      } catch (error) {
        console.error("Error fetching drugs:", error);
      }
    }

    setShowDrugSuggestions(true);
  };

  const loadMoreDrugs = async () => {
    if (isLoadingMore || !drugSearchQuery) return;

    setIsLoadingMore(true);

    if (limitSearch) {
      var url = "";
      if (selectedRxGroup) {
        url = `/drug/GetDrugsByInsuranceNamePagintated?insurance=${
          selectedRxGroup.rxGroup
        }&drugName=${drugSearchQuery}&pageNumber=${
          currentPage + 1
        }&pageSize=20`;
      } else if (selectedPcn) {
        url = `/drug/GetDrugsByPCNPagintated?insurance=${
          selectedPcn.pcn
        }&drugName=${drugSearchQuery}&pageNumber=${
          currentPage + 1
        }&pageSize=20`;
      } else if (selectedBin) {
        url = `/drug/GetDrugsByBINPagintated?insurance=${
          selectedBin.bin
        }&drugName=${drugSearchQuery}&pageNumber=${
          currentPage + 1
        }&pageSize=20`;
      }
      try {
        const { data } = await axiosInstance.get(url);
        setDrugs((prev) => [...prev, ...data]);
        setCurrentPage((prev) => prev + 1);
      } catch (error) {
        console.error("Error loading more drugs:", error);
      } finally {
        setIsLoadingMore(false);
      }
    } else {
      try {
        const nextPage = currentPage + 1;
        const url = `/drug/searchByName?name=${drugSearchQuery}&pageNumber=${nextPage}&pageSize=20`;
        const { data } = await axiosInstance.get(url);

        setDrugs((prev) => [...prev, ...data]);
        setCurrentPage(nextPage);
      } catch (error) {
        console.error("Error loading more drugs:", error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    const target = dropdownRef.current;
    if (!target) return;

    const handleScroll = (e: Event) => {
      const el = e.target as HTMLElement;
      const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 5;

      if (atBottom && showDrugSuggestions && !isLoadingMore) {
        loadMoreDrugs();
      }
    };

    target.addEventListener("scroll", handleScroll);
    return () => {
      target.removeEventListener("scroll", handleScroll);
    };
  }, [showDrugSuggestions, drugSearchQuery, currentPage, isLoadingMore]);

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
      setNdcSearchQuery(combinedNdcs[0]);
    } else {
      console.error("No NDC found for the selected drug");
    }
  };

  // --- Reset All / Clear Selections ---
  const clearAll = () => {
    setBinQuery("");
    setBinSuggestions([]);
    setShowBinSuggestions(false);
    setSelectedBin(null);
    setPcnList([]);
    setSelectedPcn(null);
    setRxGroups([]);
    setSelectedRxGroup(null);
    setDrugs([]);
    setSelectedDrug(null);
    setDrugSearchQuery("");
    setNdcList([]);
    setSelectedNdc("");
    setPcnSearchQuery("");
    setRxGroupSearchQuery("");
    setNdcSearchQuery("");
    setInsurances([]);
    setSelectedInsurance(null);
  };

  return (
    <motion.div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <PageMeta
        title="Insurance Search | TailAdmin"
        description="Search for medicines using our modern interface."
      />
      <PageBreadcrumb pageTitle="Insurance Search" />

      {/* Responsive Layout: Form on left; Selected Details sidebar on right */}
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* Main Form Column */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            layout
            className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 p-6 shadow-lg"
          >
            {/* Header */}
            <div className="px-6 py-5 text-center">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                Insurance Search
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Search for drugs based on BIN, PCN, and Rx Group criteria.
              </p>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700 sm:p-6 space-y-6">
              {/* Toggle to Limit Search */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="limit-search-toggle"
                  className="text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Limit Search to Selected Insurance Data
                </label>
                <button
                  id="limit-search-toggle"
                  type="button"
                  onClick={() => {
                    clearAll();
                    setLimitSearch(!limitSearch);
                    setDrugs([]);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    limitSearch ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  aria-pressed={limitSearch}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      limitSearch ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
            {/* Search Section */}
            <div className="mb-6 p-4 rounded-lg">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
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

            {/* PCN & Rx Group Section */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {/* PCN Search Input */}
              <AnimatePresence>
                {pcnList.length > 0 && (
                  <motion.div
                    layout
                    variants={fadeVariant}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="mb-4 relative"
                  >
                    <label
                      htmlFor="pcnSearch"
                      className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Search for PCN
                    </label>
                    <input
                      id="pcnSearch"
                      type="text"
                      value={pcnSearchQuery}
                      onChange={handlePcnSearchChange}
                      onFocus={() => setShowPcnSuggestions(true)}
                      placeholder="e.g., Your PCN..."
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    />
                    <AnimatePresence>
                      {showPcnSuggestions && filteredPcnList.length > 0 && (
                        <motion.div
                          layout
                          initial={fadeVariant.initial}
                          animate={fadeVariant.animate}
                          exit={fadeVariant.exit}
                          className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-theme-xs max-h-60 overflow-y-auto"
                        >
                          {filteredPcnList.map((pcn) => (
                            <button
                              key={pcn.id}
                              onClick={() => handlePcnSelect(pcn)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                            >
                              {pcn.pcn}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rx Group Search Input */}
              <AnimatePresence>
                {rxGroups.length > 0 && (
                  <motion.div
                    layout
                    variants={fadeVariant}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="mb-4 relative"
                  >
                    <label
                      htmlFor="rxGroupSearch"
                      className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Search for Rx Group
                    </label>
                    <input
                      id="rxGroupSearch"
                      type="text"
                      value={rxGroupSearchQuery}
                      onChange={handleRxGroupSearchChange}
                      onFocus={() => setShowRxGroupSuggestions(true)}
                      placeholder="e.g., Your Rx Group..."
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    />
                    <AnimatePresence>
                      {showRxGroupSuggestions &&
                        filteredRxGroupList.length > 0 && (
                          <motion.div
                            layout
                            initial={fadeVariant.initial}
                            animate={fadeVariant.animate}
                            exit={fadeVariant.exit}
                            className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-theme-xs max-h-60 overflow-y-auto"
                          >
                            {filteredRxGroupList.map((rx) => (
                              <button
                                key={rx.id}
                                onClick={() => handleRxGroupSelect(rx)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                              >
                                {rx.rxGroup}
                              </button>
                            ))}
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Drug Search Input with Infinite Scrolling */}
              {(selectedBin?.bin ?? "").length > 0 && (
                <div className="relative">
                  <label className="mb-1.5 mt-6 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Search for Drug
                  </label>
                  <input
                    type="text"
                    value={drugSearchQuery}
                    onChange={handleDrugSearchChange}
                    onFocus={() => setShowDrugSuggestions(true)}
                    placeholder="e.g., Metformin"
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  />
                  <AnimatePresence>
                    {showDrugSuggestions && drugs.length > 0 && (
                      <motion.div
                        ref={dropdownRef}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        role="listbox"
                        aria-label="Drug search suggestions"
                        className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-md max-h-60 overflow-y-auto drug-suggestions-box"
                      >
                        {(() => {
                          const matched = drugs.filter((drug) =>
                            drug.name
                              .toLowerCase()
                              .includes(drugSearchQuery.toLowerCase())
                          );
                          const unmatched = drugs.filter(
                            (drug) =>
                              !drug.name
                                .toLowerCase()
                                .includes(drugSearchQuery.toLowerCase())
                          );

                          return (
                            <>
                              {/* 🟢 Matched */}
                              {matched.map((drug, index) => (
                                <button
                                  key={drug.id}
                                  id={`suggestion-matched-${index}`}
                                  role="option"
                                  aria-selected={
                                    activeSuggestionIndex === index
                                  }
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
                              {/* 🟡 Did you mean */}
                              {unmatched.length > 0 && (
                                <div className="px-4 py-2 text-sm text-yellow-700 bg-yellow-50">
                                Did You Mean?{" "}
                                </div>
                              )}
                              {/* 🔵 Remaining Unmatched */}
                              {unmatched.map((drug, index) => (
                                <button
                                  key={drug.id}
                                  id={`suggestion-unmatched-${index}`}
                                  role="option"
                                  aria-selected={
                                    activeSuggestionIndex === index
                                  }
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
                            </>
                          );
                        })()}

                        {isLoadingMore && (
                          <div className="text-center py-2 text-sm text-gray-500">
                            Loading more...
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              {/* NDC Search Input */}
              {ndcList.length > 0 && (
                <div className="relative">
                  <label
                    htmlFor="ndcSearch"
                    className="mb-1.5 mt-6 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Search for NDC
                  </label>
                  <input
                    id="ndcSearch"
                    type="text"
                    value={ndcSearchQuery}
                    onChange={handleNdcSearchChange}
                    onFocus={() => setShowNdcSuggestions(true)}
                    placeholder="e.g., Your NDC..."
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  />
                  <AnimatePresence>
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
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Action Button */}
            <AnimatePresence>
              {selectedDrug && selectedNdc && (
                <motion.button
                  layout
                  variants={fadeVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onClick={async () => {
                    setDetails({
                      rxgroupId: selectedInsurance?.insuranceId || 0,
                      binId: selectedBin?.id || 0, // Assign a default number value
                      pcnId: selectedPcn?.id || 0,
                      drugNDC: selectedDrug?.ndc || "",
                      date: new Date().toISOString(),
                      searchType: "Search By Full Insurance",
                    });
                    const action = `User Search for that NDC: ${
                      selectedDrug?.ndc || ""
                    } 
                    using search Type: Search By Full Insurance 
                    with the following insurance Data: 
                    BinId: ${selectedInsurance?.insuranceId || 0}, 
                    PCN: ${selectedPcn?.id || 0}, 
                    RxGroup: ${selectedInsurance?.insuranceId || 0}`;
                    const response = await axiosInstance.post(
                      "/order/ViewDrugDetailsLog",
                      JSON.stringify(action), // make it a JSON string
                      {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    localStorage.setItem(
                      "selectedRx",
                      selectedInsurance?.insurance || ""
                    );
                    localStorage.setItem("selectedPcn", selectedPcn?.pcn || "");
                    localStorage.setItem("selectedBin", selectedPcn?.pcn || "");
                    navigate(
                      `/drug/${
                        selectedDrug.id
                      }?ndc=${selectedNdc}&insuranceId=${
                        selectedRxGroup?.id || ""
                      }`
                    );
                  }}
                  className="w-full mt-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-md"
                >
                  <span>View Drug Details</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Redesigned Selected Details Section */}
        {/* <div className="w-full md:w-1/3">
          <motion.div
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="flex justify-between items-center p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Selected Details
              </h2>
              <button
                onClick={clearAll}
                title="Reset Search"
                className="p-2 transition-transform transform hover:scale-110 hover:bg-red-500  hover:text-white rounded-full"
              >
                <XIcon className="h-5 w-5 dark:text-white" />
              </button>
            </div>
            <motion.div
              variants={dropdownVariant}
              initial="hidden"
              animate={dropdownVisible ? "visible" : "visible"}
              className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 dark:text-white"
            >
              <p>
                <strong>BIN: </strong>
                {selectedBin ? (
                  <a
                    href={`/InsuranceBINDetails/${selectedBin.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                  >
                    {`${selectedBin.name || ""} - ${selectedBin.bin}`}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>PCN: </strong>
                {selectedPcn ? (
                  <a
                    href={`/InsurancePCNDetails/${selectedPcn.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                  >
                    {selectedPcn.pcn}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
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
            </motion.div>
          </motion.div>
        </div> */}
      </div>
    </motion.div>
  );
};

export default InsuranceSearch;
