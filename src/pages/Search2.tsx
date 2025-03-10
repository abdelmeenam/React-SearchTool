import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import debounce from "debounce";
import axios from "axios";
import { motion } from "framer-motion";
import { Drug, Insurance } from "../types";

const API_BASE_URL = "https://store.medisearchtool.com";

// Helper function to retrieve the token header
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

export const Search2: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [insuranceSuggestions, setInsuranceSuggestions] = useState<Insurance[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(
    null
  );

  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

  // New states for drug search functionality
  const [drugSearchQuery, setDrugSearchQuery] = useState("");
  const [filteredDrugSuggestions, setFilteredDrugSuggestions] = useState<
    Drug[]
  >([]);
  const [showDrugSuggestions, setShowDrugSuggestions] = useState(false);

  const [ndcList, setNdcList] = useState<string[]>([]);
  const [selectedNdc, setSelectedNdc] = useState("");

  const insurance_mapping = {
    AL: "Aetna (AL)",
    BW: "aetna (BW)",
    AD: "Aetna Medicare (AD)",
    AF: "Anthem BCBS (AF)",
    DS: "Blue Cross Blue Shield (DS)",
    CA: "blue shield medicare (CA)",
    FQ: "Capital Rx (FQ)",
    BF: "Caremark (BF)",
    ED: "CatalystRx (ED)",
    AM: "Cigna (AM)",
    BO: "Default Claim Format (BO)",
    AP: "Envision Rx Options (AP)",
    CG: "Express Scripts (CG)",
    BI: "Horizon (BI)",
    AJ: "Humana Medicare (AJ)",
    BP: "informedRx (BP)",
    AO: "MEDCO HEALTH (AO)",
    AC: "MEDCO MEDICARE PART D (AC)",
    AQ: "MEDGR (AQ)",
    CC: "MY HEALTH LA (CC)",
    AG: "Navitus Health Solutions (AG)",
    AH: "OptumRx (AH)",
    AS: "PACIFICARE LIFE AND H (AS)",
    FJ: "Paramount Rx (FJ)",
    "X ": "PF - DEFAULT (X )",
    EA: "Pharmacy Data Management (EA)",
    DW: "phcs (DW)",
    AX: "PINNACLE (AX)",
    BN: "Prescription Solutions (BN)",
    AA: "Tri-Care Express Scripts (AA)",
    AI: "United Healthcare (AI)",
  };

  // Debounced insurance search
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 1) {
        try {
          const { data } = await axios.get(
            `${API_BASE_URL}/drug/GetInsurances?insurance=${query}`,
            { headers: getAuthHeader() }
          );
          setInsuranceSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error searching insurances:", error);
        }
      } else {
        setInsuranceSuggestions([]);
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

  // When an insurance is selected, fetch drugs associated with it.
  const handleInsuranceSelect = async (insurance: Insurance) => {
    setSelectedInsurance(insurance);
    setSearchQuery(insurance.name);
    setShowSuggestions(false);
    // Clear any previous selections
    setDrugs([]);
    setSelectedDrug(null);
    setDrugSearchQuery("");
    setFilteredDrugSuggestions([]);
    setShowDrugSuggestions(false);
    setNdcList([]);
    setSelectedNdc("");

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/drug/GetDrugsByInsuranceName?insurance=${insurance.name}`,
        { headers: getAuthHeader() }
      );
      setDrugs(data);
    } catch (error) {
      console.error("Error fetching drugs by insurance:", error);
    }
  };

  // When a drug is selected, fetch its NDC codes.
  const handleDrugSelect = async (drug: Drug) => {
    setSelectedDrug(drug);
    setDrugSearchQuery(drug.name);
    setShowDrugSuggestions(false);
    // Clear previous NDC selection
    setNdcList([]);
    setSelectedNdc("");
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

  const handleDrugSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setDrugSearchQuery(query);
    if (query.trim() !== "") {
      const suggestions = drugs.filter((drug) =>
        drug.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDrugSuggestions(suggestions);
      setShowDrugSuggestions(true);
    } else {
      setFilteredDrugSuggestions([]);
      setShowDrugSuggestions(false);
    }
  };

  const handleNdcSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNdc(e.target.value);
  };

  const handleSearch = () => {
    if (selectedDrug) {
      navigate(
        `/drug/${selectedDrug.id}?ndc=${selectedNdc}&insuranceId=${
          selectedNdc?selectedInsurance?.id : ""
        }`
      );
    }
  };

  return (
    <motion.div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-r from-blue-500 to-green-400 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Search for Medicines by Insurance
        </h1>
        <div className="space-y-8">
          {/* Insurance Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() =>
                searchQuery.length >= 1 && setShowSuggestions(true)
              }
              placeholder="Search for an Insurance..."
              className="w-full px-4 py-3 border-2 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-3 text-blue-600 hover:text-blue-800"
            >
              <SearchIcon className="h-6 w-6" />
            </button>
            {showSuggestions && insuranceSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md max-h-60 overflow-y-auto">
                {insuranceSuggestions.map((insurance) => (
                  <button
                    key={insurance.id}
                    onClick={() => handleInsuranceSelect(insurance)}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800"
                  >
                    <span className="font-semibold">
                      {insurance_mapping[insurance.name] || insurance.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Drug Search */}
          {drugs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Search Drug</h2>
              <div className="relative">
                <input
                  type="text"
                  value={drugSearchQuery}
                  onChange={handleDrugSearchChange}
                  onFocus={() =>
                    drugSearchQuery.length >= 1 && setShowDrugSuggestions(true)
                  }
                  placeholder="Search for a drug..."
                  className="w-full px-4 py-3 border-2 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600"
                />
                {showDrugSuggestions && filteredDrugSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md max-h-60 overflow-y-auto">
                    {filteredDrugSuggestions.map((drug) => (
                      <button
                        key={drug.id}
                        onClick={() => handleDrugSelect(drug)}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800"
                      >
                        {drug.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NDC Dropdown */}
          {ndcList.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Select NDC</h2>
              <select
                value={selectedNdc}
                onChange={handleNdcSelect}
                className="w-full px-4 py-3 border-2 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-600"
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

          {/* View Details Button */}
          {selectedDrug && (
            <button
              onClick={handleSearch}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Drug Details
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
