import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import debounce from "debounce";
import axios from "axios";
import { motion } from "framer-motion";
import { Drug, DrugInsuranceInfo, Insurance } from "../types";

const API_BASE_URL = "https://store.medisearchtool.com";
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});
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
  const insuranceMapping: Record<string, string> = {
    "1": "CR",
    "2": "GF",
    "3": "AV",
    "4": "CY",
    "5": "GH",
    "6": "EQ",
    "7": "CM",
    "8": "BT",
    "9": "HE",
    "10": "GC",
    "11": "FT",
    "12": "GJ",
    "13": "HB",
    "14": "BE",
    "15": "HG",
    "16": "EY",
    "17": "EW",
    "18": "ET",
    "19": "FS",
    "20": "GE",
    "21": "GV",
    "22": "GY",
    "23": "GS",
    "24": "EB",
    "25": "CS",
    "26": "FB",
    "27": "FN",
    "28": "EP",
    "29": "HJ",
    "30": "HC",
    "31": "CO",
    "32": "GP",
    "33": "EJ",
    "34": "AL",
    "35": "BW",
    "36": "AD",
    "37": "GM",
    "38": "AF",
    "39": "AT",
    "40": "EN",
    "41": "GX",
    "42": "DS",
    "43": "CA",
    "44": "CA, HK",
    "45": "FQ",
    "46": "AB",
    "47": "BF",
    "48": "",
    "49": "AM",
    "50": "GO",
    "51": "BO",
    "52": "CG",
    "53": "BI",
    "54": "AJ",
    "55": "AO",
    "56": "AC",
    "57": "AQ",
    "58": "CC",
    "59": "AG",
    "60": "FA",
    "61": "AH",
    "62": "AS",
    "63": "X",
    "64": "AX",
    "65": "BN",
    "66": "GI",
    "67": "BR",
    "68": "GZ",
    "69": "AA",
    "70": "AI",
    "71": "AP",
    "72": "BP",
    "73": "DW",
    "74": "EA",
    "75": "ED",
    "76": "FJ"
  };
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 1) {
        try {
          const { data } = await axios.get(
            `${API_BASE_URL}/drug/searchByName?name=${query}`,
            { headers: getAuthHeader() }
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
        `${API_BASE_URL}/drug/getDrugNDCs?name=${drug.name}`,
        { headers: getAuthHeader() }
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
        `${API_BASE_URL}/drug/GetInsuranceByNdc?ndc=${ndc}`,
        { headers: getAuthHeader() }
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
                    {insurance_mapping[insuranceMapping[insurance.insuranceId]] || insuranceMapping[insurance.insuranceId]}
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
