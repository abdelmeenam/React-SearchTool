import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import debounce from "debounce";
import { api } from "../api/api";
import { Drug, Insurance } from "../types";
import axios from "axios";
import { motion } from "framer-motion";
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
export const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Drug[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(
    null
  );

  const [ndcList, setNdcList] = useState<string[]>([]);
  const [selectedNdc, setSelectedNdc] = useState<string>("");

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 2) {
        //const results = await api.searchDrugsSuggestions(query);
        try {
          const results = await axios.get(
            `https://api.medisearchtool.com/drug/searchByName?name=${query}`
          );
          setSuggestions(results.data);
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

  const handleSearch = async () => {
    if (selectedDrug) {
      navigate(
        `/drug/${selectedDrug.id}?ndc=${selectedNdc}&insuranceId=${selectedInsurance?.id}`
      );
    }
    return;

    try {
      const results = await axios.get(
        `http://localhost:5107/drug/searchByName?name=${searchQuery}`
      );
      setDrugs(results.data);
      setSelectedDrug(null);
      setInsurances([]);

      setSelectedInsurance(null);
      setSelectedNdc("");

      setShowSuggestions(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrugSelect = async (drug: Drug) => {
    console.log(drug);
    setSelectedDrug(drug);
    setSearchQuery(drug.name);
    setShowSuggestions(false);

    try {
      //const insuranceList = await api.getInsuranceForDrug(drug.id);
      //http://localhost:5107/drug/getDrugNDCs?name=CLINDAMYCIN%20%20SOL%201%25
      //http://localhost:5107/drug/getDrugInsurances?name=CLINDAMYCIN%20%20SOL%201%25

      const insuranceList = await axios.get(
        `https://api.medisearchtool.com/drug/getDrugInsurances?name=${drug.name}`
      );
      //http://localhost:5107/drug/getDrugNDCsByNameInsuance?drugName=METHOTREXATE%20TAB%202.5MG&insurnaceId=6

      const ndcList = await axios.get(
        `https://api.medisearchtool.com/drug/getDrugNDCs?name=${drug.name}`
      );
      console.log(insuranceList.data);
      console.log(ndcList.data);

      setInsurances(insuranceList.data);
      setNdcList(ndcList.data);
    } catch (error) {
      console.error("Error fetching insurance:", error);
    }
  };

  return (
    <motion.div>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-blue-500 to-green-400 rounded-lg shadow-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Search for Medicines
          </h1>

          <div className="space-y-8">
            {/* Search Input with Suggestions */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() =>
                  searchQuery.length >= 2 && setShowSuggestions(true)
                }
                placeholder="Search for a drug..."
                className="w-full px-4 py-3 border-2 border-transparent rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-3 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                <SearchIcon className="h-6 w-6" />
              </button>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md overflow-hidden">
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
                      <span className="text-sm text-gray-500 ml-2">
                        {drug.classId}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Drug Results */}
            {drugs.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Results</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drugs.map((drug) => (
                    <button
                      key={drug.id}
                      onClick={() => handleDrugSelect(drug)}
                      className={`p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white text-gray-800 hover:bg-blue-50 ${
                        selectedDrug?.id === drug.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      <h3 className="font-bold text-lg">{drug.name}</h3>
                      <p className="text-sm text-gray-500">Class: {drug.id}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Insurance Selection */}
            {insurances.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Select Insurance</h2>
                <select
                  value={selectedInsurance?.id || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const insurance = insurances.find(
                      (i) => i.id.toString() === selectedId
                    );
                    setSelectedInsurance(insurance || null);
                    console.log("Selected Insurance:", insurance);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white text-gray-900"
                >
                  <option value="" className="text-gray-500">
                    Select insurance...
                  </option>
                  {insurances
                    .filter((insurance) => insurance.name?.trim()) // Remove empty or whitespace-only names
                    .map((insurance) => (
                      <option
                        key={insurance.id}
                        value={insurance.id}
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        {insurance_mapping[insurance.name] || insurance.name}
                      </option>
                    ))}
                </select>
               
              </div>
            )}

            {/* NDC Selection */}
            {selectedInsurance && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Select NDC</h2>
                <select
                  value={selectedNdc}
                  onChange={(e) => setSelectedNdc(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white text-gray-900"
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

            {/* Search Button */}
            {selectedDrug  && (
              <button
                onClick={handleSearch}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View Drug Details
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
