import React, { useState, useCallback } from "react";
import axios from "axios";
import debounce from "debounce";
import { useNavigate } from "react-router-dom";
import BaseUrlLoader, { loadConfig } from "../BaseUrlLoader"; // Import your config & loader
import { motion } from "framer-motion";
import Select from "react-select";

// Ensure the config is loaded (using top-level await if your setup supports it)
await loadConfig();
const API_BASE_URL = BaseUrlLoader.API_BASE_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

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

// Custom styles for react-select to make the option text black
const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    color: "black",
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: "black",
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    color: "black",
  }),
  placeholder: (provided: any, state: any) => ({
    ...provided,
    color: "black",
  }),
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

  // --- Insurance Flow: BIN ---
  const debouncedBinSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length > 0) {
        try {
          const { data } = await axios.get(
            `${API_BASE_URL}/drug/GetInsurancesBinsByName?bin=${query}`,
            { headers: getAuthHeader() }
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
    setBinQuery(`${bin.name} -  ${bin.bin}`);
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
      const { data } = await axios.get(
        `${API_BASE_URL}/drug/GetInsurancesPcnByBinId?binId=${bin.id}`,
        { headers: getAuthHeader() }
      );
      setPcnList(data);
    } catch (error) {
      console.error("Error fetching PCNs:", error);
    }
  };

  // --- Insurance Flow: PCN & Rx Group ---
  const handlePcnSelectFromSelect = async (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (!selectedOption) {
      setSelectedPcn(null);
      return;
    }
    const pcn = pcnList.find((item) => item.id === selectedOption.value) || null;
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
        const { data } = await axios.get(
          `${API_BASE_URL}/drug/GetInsurancesRxByPcnId?pcnId=${pcn.id}`,
          { headers: getAuthHeader() }
        );
        setRxGroups(data);
      } catch (error) {
        console.error("Error fetching Rx Groups:", error);
      }
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

    if (rxGroup) {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/drug/GetDrugsByInsuranceName?insurance=${rxGroup.rxGroup}`,
          { headers: getAuthHeader() }
        );
        setDrugs(data);
      } catch (error) {
        console.error("Error fetching drugs:", error);
      }
    }
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

  const handleDrugSelect = async (drug: DrugModel) => {
    setSelectedDrug(drug);
    setDrugSearchQuery(drug.name);
    setShowDrugSuggestions(false);
    // Clear any previous NDC selections
    setNdcList([]);
    setSelectedNdc("");
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/drug/getDrugNDCs?name=${drug.name}`,
        { headers: getAuthHeader() }
      );
      setNdcList(data);
      setSelectedNdc(data[0]);
    } catch (error) {
      console.error("Error fetching NDC list:", error);
    }
  };

  const handleNdcSelectFromSelect = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedNdc(selectedOption ? selectedOption.value : "");
  };

  return (
    <motion.div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-r from-blue-500 to-green-400 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Insurance Search
        </h1>

        {/* BIN Input */}
        <div className="mb-6 relative">
          <input
            type="text"
            value={binQuery}
            onChange={handleBinInputChange}
            onFocus={() => binQuery.length > 0 && setShowBinSuggestions(true)}
            placeholder="Type BIN or Insurance Name..."
            className="w-full px-4 py-3 border-2 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-600"
          />
          {showBinSuggestions && binSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md max-h-60 overflow-y-auto">
              {binSuggestions.map((bin) => (
                <button
                  key={bin.id}
                  onClick={() => handleBinSelect(bin)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800"
                >
                  {bin.bin} {bin.name && `- ${bin.name}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PCN Searchable Dropdown */}
        {pcnList.length > 0 && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">
              Select PCN:
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
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">
              Select Rx Group:
            </label>
            <Select
              value={
                selectedRxGroup
                  ? { value: selectedRxGroup.id, label: selectedRxGroup.rxGroup }
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
          <div className="mb-6 relative">
            <label className="block mb-2 font-semibold text-gray-700">
              Search for Drug:
            </label>
            <input
              type="text"
              value={drugSearchQuery}
              onChange={handleDrugSearchChange}
              onFocus={() => setShowDrugSuggestions(true)}
              placeholder="Type drug name..."
              className="w-full px-4 py-3 border-2 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-600"
            />
            {showDrugSuggestions && filteredDrugs.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md max-h-60 overflow-y-auto">
                {filteredDrugs.map((drug) => (
                  <button
                    key={drug.id}
                    onClick={() => handleDrugSelect(drug)}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800"
                  >
                    {drug.name} (NDC: {drug.ndc})
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NDC Searchable Dropdown */}
        {ndcList.length > 0 && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">
              Select NDC:
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

        {/* View Drug Details Button */}
        {selectedDrug && selectedNdc && (
          <button
            onClick={() =>
              navigate(
                `/drug/${selectedDrug.id}?ndc=${selectedNdc}&insuranceId=${
                  selectedRxGroup?.id || ""
                }`
              )
            }
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            View Drug Details
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default InsuranceSearch;
