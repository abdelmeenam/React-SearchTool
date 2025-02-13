import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import debounce from "debounce";
import axios from "axios";
import { motion } from "framer-motion";
import { Drug, DrugInsuranceInfo, Insurance } from "../types";

const API_BASE_URL = "https://api.medisearchtool.com";

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Drug[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [insurances, setInsurances] = useState<DrugInsuranceInfo[]>([]);
  const [selectedInsurance, setSelectedInsurance] =
    useState<DrugInsuranceInfo | null>(null);
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
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 1) {
        try {
          const { data } = await axios.get(
            `${API_BASE_URL}/drug/searchByName?name=${query}`
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

  const handleDrugSelect = async (drug: Drug) => {
    setSelectedDrug(drug);
    setSearchQuery(drug.name);
    setShowSuggestions(false);
    setNdcList([]);
    setSelectedNdc("");
    setInsurances([]);
    setSelectedInsurance(null);

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/drug/getDrugNDCs?name=${drug.name}`
      );
      setNdcList(data);
    } catch (error) {
      console.error("Error fetching NDC list:", error);
    }
  };

  const handleNdcSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ndc = e.target.value;
    setSelectedNdc(ndc);
    setInsurances([]);
    setSelectedInsurance(null);

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/drug/GetInsuranceByNdc?ndc=${ndc}`
      );
      console.log(data);
      setInsurances(data);
    } catch (error) {
      console.error("Error fetching insurance:", error);
    }
  };

  const handleSearch = () => {
    if (selectedDrug) {
      navigate(
        `/drug/${selectedDrug.id}?ndc=${selectedNdc}&insuranceId=${
          selectedInsurance?.insuranceId || ""
        }`
      );
    }
  };

  return (
    <motion.div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-r from-blue-500 to-green-400 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Search for Medicines
        </h1>
        <div className="space-y-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() =>
                searchQuery.length >= 2 && setShowSuggestions(true)
              }
              placeholder="Search for a drug..."
              className="w-full px-4 py-3 border-2 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-3 text-blue-600 hover:text-blue-800"
            >
              <SearchIcon className="h-6 w-6" />
            </button>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md max-h-60 overflow-y-auto">
                {[
                  ...new Map(
                    suggestions.map((drug) => [drug.name, drug])
                  ).values(),
                ].map((drug) => (
                  <button
                    key={drug.id}
                    onClick={() => handleDrugSelect(drug)}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800"
                  >
                    <span className="font-semibold">{drug.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
          {insurances.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Select Insurance</h2>
              <select
                value={selectedInsurance?.insuranceId || ""}
                onChange={(e) => {
                  const selected =
                    insurances.find(
                      (i) => i.insuranceId.toString() === e.target.value
                    ) || null;
                  setSelectedInsurance(selected);
                }}
                className="w-full px-4 py-3 border-2 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select insurance...</option>
                {insurances.map((insurance) => (
                  <option
                    key={insurance.insuranceId}
                    value={insurance.insuranceId}
                  >
                    {insurance_mapping[insurance.insuranceName] || insurance.insuranceName}
                  </option>
                ))}
              </select>
            </div>
          )}
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
