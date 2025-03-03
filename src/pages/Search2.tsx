import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import debounce from "debounce";
import axios from "axios";
import { motion } from "framer-motion";
import { Drug, Insurance } from "../types";

const API_BASE_URL = "http://localhost:5107";

// Helper function to retrieve the token header
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

export const Search2: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [insuranceSuggestions, setInsuranceSuggestions] = useState<Insurance[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [ndcList, setNdcList] = useState<string[]>([]);
  const [selectedNdc, setSelectedNdc] = useState("");

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

  const handleNdcSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNdc(e.target.value);
  };

  const handleSearch = () => {
    if (selectedDrug) {
      // Passing the selected insurance name as a query parameter; adjust if needed.
      navigate(
        `/drug/${selectedDrug.id}?ndc=${selectedNdc}&insurance=${selectedInsurance?.name || ""}`
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
              onFocus={() => searchQuery.length >= 1 && setShowSuggestions(true)}
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
                    <span className="font-semibold">{insurance.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Drugs Dropdown */}
          {drugs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Select Drug</h2>
              <select
                value={selectedDrug?.id || ""}
                onChange={(e) => {
                  const drug = drugs.find(
                    (d) => d.id.toString() === e.target.value
                  );
                  if (drug) {
                    handleDrugSelect(drug);
                  }
                }}
                className="w-full px-4 py-3 border-2 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select Drug...</option>
                {drugs.map((drug) => (
                  <option key={drug.id} value={drug.id}>
                    {drug.name}
                  </option>
                ))}
              </select>
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
