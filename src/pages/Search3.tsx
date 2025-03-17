import React, { useState, useEffect } from "react";
import axios from "axios";
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

export const Search3: React.FC = () => {
  const navigate = useNavigate();

  // --- Rx Group States ---
  const [rxGroups, setRxGroups] = useState<RxGroupModel[]>([]);
  const [selectedRxGroup, setSelectedRxGroup] = useState<RxGroupModel | null>(
    null
  );

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
        // Assuming an endpoint exists to fetch all Rx Groups
        const { data } = await axios.get(
          `${API_BASE_URL}/drug/GetAllRxGroups`,
          {
            headers: getAuthHeader(),
          }
        );
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
          // Use the Rx Group value to fetch drugs.
          const { data } = await axios.get(
            `${API_BASE_URL}/drug/GetDrugsByInsuranceName?insurance=${selectedRxGroup.rxGroup}`,
            { headers: getAuthHeader() }
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
          Search3: RxGroup, Drugs & NDC
        </h1>

        {/* Rx Group Dropdown */}
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
            onChange={(option) => {
              const selected =
                rxGroups.find((rg) => rg.id === option?.value) || null;
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

        {/* NDC Dropdown */}
        {ndcList.length > 0 && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">
              Select NDC:
            </label>
            <Select
              value={
                selectedNdc ? { value: selectedNdc, label: selectedNdc } : null
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

        {/* View Drug Details Button */}
        {selectedDrug && selectedNdc && (
          <button
            onClick={() => {
              if (selectedRxGroup) {
                localStorage.setItem("selectedRx", selectedRxGroup.rxGroup);
              }
              navigate(
                `/drug/${selectedDrug.id}?ndc=${selectedNdc}&insuranceId=${
                  selectedRxGroup?.id || ""
                }`
              );
            }}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            View Drug Details
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Search3;
