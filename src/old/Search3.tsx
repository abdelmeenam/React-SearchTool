import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X as XIcon } from "lucide-react";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import axiosInstance from "../api/axiosInstance";
import { Prescription, SearchLog } from "../types";

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
  const [drugNetDetails, setDrugNetDetails] = useState<Prescription | null>(
    null
  );
  const [limitSearch, setLimitSearch] = useState(false); // Toggle state

  const [bestDrugNetDetails, setBestDrugNetDetails] =
    useState<Prescription | null>(null);

  // --- Rx Group States ---
  const [rxGroups, setRxGroups] = useState<RxGroupModel[]>([]);
  const [selectedRxGroup, setSelectedRxGroup] = useState<RxGroupModel | null>(
    null
  );
  // New state for Rx Group search input and suggestion list
  const [rxGroupSearchQuery, setRxGroupSearchQuery] = useState("");
  const [showRxGroupSuggestions, setShowRxGroupSuggestions] = useState(false);
  const [Details, setDetails] = useState<SearchLog | null>(null);

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
  useEffect(() => {
    localStorage.removeItem("searchLogDetails");
  }, []);
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
      if (selectedRxGroup && limitSearch === true) {
        try {
          const { data } = await axiosInstance.get(
            `/drug/GetDrugsByInsuranceName?insurance=${selectedRxGroup.rxGroup}`
          );
          setDrugs(data);
        } catch (error) {
          console.error("Error fetching drugs by insurance:", error);
        }
      } else if (drugSearchQuery) {
        try {
          const { data } = await axiosInstance.get(
            `/drug/searchByName?name=${drugSearchQuery}`
          );
          setDrugs(data);
        } catch (error) {
          console.error("Error fetching drugs by name:", error);
        }
      } else {
        setDrugs([]); // Clear the drug list if no query or RxGroup is provided
      }
    };

    fetchDrugs();
  }, [selectedRxGroup, drugSearchQuery, limitSearch]);
  useEffect(() => {
    async function fetchDrugDetails() {
      console.log("Hi : ", selectedNdc, selectedRxGroup);
      if (selectedNdc && selectedRxGroup) {
        try {
          const { data: response2 } = await axiosInstance.get(
            `/drug/GetDetails?ndc=${selectedNdc}&insuranceId=${selectedRxGroup.id}`
          );
          console.log("Fetched drug net details:", response2);

          // const { data: response3 } = await axiosInstance.get(
          //   `/drug/GetBestAlternativeByNDCRxGroupId?classId=${response2.drugClassId}&rxGroupId=${response2.insuranceId}`
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
    <motion.div className="min-h-screen" initial="initial" animate="animate">
      <PageMeta
        title="Search Medicines | TailAdmin"
        description="Search for medicines using our modern interface."
      />
      <PageBreadcrumb pageTitle="RxGroup, Drugs & NDC" />

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* Main Search Form */}
        <section
          className="flex-1 max-w-2xl"
          aria-labelledby="search-form-heading"
        >
          <h1 id="search-form-heading" className="sr-only">
            Search Medicines
          </h1>
          <form
            className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-4 shadow-lg"
            role="search"
          >
            <header className="px-6 py-5 text-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                RxGroup, Drugs & NDC
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Search for an Rx Group and drug to view details.
              </p>
            </header>
            <div className="border-t border-gray-100 dark:border-gray-700 sm:p-6 space-y-6">
              {/* Toggle to Limit Search */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="limit-search-toggle"
                  className="text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Limit Search to Selected Rx Group
                </label>
                <button
                  id="limit-search-toggle"
                  type="button"
                  onClick={() => {
                    clearAll();
                    setLimitSearch(!limitSearch);
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
            <div className="border-t border-gray-100 dark:border-gray-700 sm:p-6 space-y-6">
              {/* Rx Group Combobox */}
              <div>
                <label
                  id="rxgroup-label"
                  htmlFor="rxgroup-search"
                  className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Search for Rx Group
                </label>
                <div
                  className="relative"
                  role="combobox"
                  aria-haspopup="listbox"
                  aria-expanded={showRxGroupSuggestions}
                  aria-owns="rxgroup-listbox"
                  aria-labelledby="rxgroup-label"
                >
                  <input
                    id="rxgroup-search"
                    type="text"
                    value={rxGroupSearchQuery}
                    onChange={(e) => {
                      setRxGroupSearchQuery(e.target.value);
                      // update filteredRxGroups and setShowRxGroupSuggestions(true)
                    }}
                    onFocus={() => setShowRxGroupSuggestions(true)}
                    placeholder="Type Rx Group..."
                    aria-autocomplete="list"
                    aria-controls="rxgroup-listbox"
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-xs placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                  />
                  {showRxGroupSuggestions && filteredRxGroups.length > 0 && (
                    <ul
                      id="rxgroup-listbox"
                      role="listbox"
                      className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xs max-h-60 overflow-y-auto"
                    >
                      {filteredRxGroups.map((rg) => (
                        <li
                          key={rg.id}
                          id={`rxgroup-option-${rg.id}`}
                          role="option"
                          tabIndex={0}
                          onClick={() => handleRxGroupSelect(rg)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleRxGroupSelect(rg)
                          }
                          className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          {rg.rxGroup}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Drug Combobox */}
              {selectedRxGroup?.id && (
                <div>
                  <label
                    id="drug-label"
                    htmlFor="drug-search"
                    className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Search for Drug
                  </label>
                  <div
                    className="relative"
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={showDrugSuggestions}
                    aria-owns="drug-listbox"
                    aria-labelledby="drug-label"
                  >
                    <input
                      id="drug-search"
                      type="text"
                      value={drugSearchQuery}
                      onChange={handleDrugSearchChange}
                      onFocus={() => setShowDrugSuggestions(true)}
                      placeholder="Type drug name..."
                      aria-autocomplete="list"
                      aria-controls="drug-listbox"
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-xs placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                    />
                    {showDrugSuggestions && uniqueFilteredDrugs.length > 0 && (
                      <ul
                        id="drug-listbox"
                        role="listbox"
                        className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xs max-h-60 overflow-y-auto"
                      >
                        {uniqueFilteredDrugs.map((drug) => (
                          <li
                            key={drug.id}
                            id={`drug-option-${drug.id}`}
                            role="option"
                            tabIndex={0}
                            onClick={() => handleDrugSelect(drug)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleDrugSelect(drug)
                            }
                            className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            {drug.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* NDC Combobox */}
              {ndcList.length > 0 && (
                <div>
                  <label
                    id="ndc-label"
                    htmlFor="ndc-search"
                    className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Search for NDC
                  </label>
                  <div
                    className="relative"
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={showNdcSuggestions}
                    aria-owns="ndc-listbox"
                    aria-labelledby="ndc-label"
                  >
                    <input
                      id="ndc-search"
                      type="text"
                      value={ndcSearchQuery}
                      onChange={(e) => setNdcSearchQuery(e.target.value)}
                      onFocus={() => setShowNdcSuggestions(true)}
                      placeholder="Type NDC..."
                      aria-autocomplete="list"
                      aria-controls="ndc-listbox"
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-xs placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                    />
                    {showNdcSuggestions && filteredNdcList.length > 0 && (
                      <ul
                        id="ndc-listbox"
                        role="listbox"
                        className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xs max-h-60 overflow-y-auto"
                      >
                        {filteredNdcList.map((ndc) => (
                          <li
                            key={ndc}
                            id={`ndc-option-${ndc}`}
                            role="option"
                            tabIndex={0}
                            onClick={() => handleNdcSelect(ndc)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleNdcSelect(ndc)
                            }
                            className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            {ndc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {selectedDrug && selectedNdc && (
                <button
                  type="button"
                  onClick={async () => {
                    setDetails({
                      rxgroupId: selectedRxGroup?.id || 0,
                      binId: 0, // Assign a default number value
                      pcnId: 0,
                      drugId: selectedDrug?.id || 0,
                      date: new Date().toISOString(),
                      searchType: "Search By Drug",
                    });
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
                  View Drug Details
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Selected Details Panel */}
        {/* <aside
          className="w-full md:w-1/3"
          aria-labelledby="selected-details-heading"
        >
          <h2 id="selected-details-heading" className="sr-only">
            Selected Details
          </h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Selected Details
              </h3>
              <button
                type="button"
                onClick={clearAll}
                aria-label="Reset selection"
                className="p-2 transition-transform transform hover:scale-110 hover:bg-red-500 hover:text-white rounded-full"
              >
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 dark:text-white">
              <p>
                <strong>Rx Group: </strong>
                {selectedRxGroup ? (
                  <a
                    href={`/InsuranceDetails/${selectedRxGroup.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline hover:text-blue-800"
                  >
                    {selectedRxGroup.rxGroup}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>Drug: </strong>
                {selectedDrug?.name || "N/A"}
              </p>
              <p>
                <strong>NDC: </strong>
                {selectedNdc || "N/A"}
              </p>
              {drugNetDetails && (
                <div
                  role="region"
                  aria-labelledby="net-price-heading"
                  className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  <h4 id="net-price-heading" className="sr-only">
                    Net Price
                  </h4>
                  <p>
                    <strong>Net Price: </strong>
                    {drugNetDetails.net ? `$${drugNetDetails.net}` : "N/A"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside> */}
      </div>
    </motion.div>
  );
};

export default Search3;
