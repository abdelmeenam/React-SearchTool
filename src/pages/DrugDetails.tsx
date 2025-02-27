import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Pill, AlertCircle, Repeat, ArrowUpDown } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { Drug, Prescription } from "../types";
const baseUrl = "http://localhost:5107";

// -----------------------
// Loading & Error Components
// -----------------------
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

interface ErrorMessageProps {
  message: string;
}
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="text-center text-red-600 p-8">
    <AlertCircle className="h-12 w-12 mx-auto mb-4" />
    <p>{message}</p>
  </div>
);

// -----------------------
// Header Component
// -----------------------
interface DrugHeaderProps {
  drug: Drug;
  padCode: (code: string) => string;
  temp: string;
}
const DrugHeader: React.FC<DrugHeaderProps> = ({ drug, padCode, temp }) => (
  <div className="bg-blue-600 p-6 text-white">
    <div className="flex items-center space-x-4">
      <Pill className="h-8 w-8" />
      <div>
        <h1 className="text-2xl font-bold">{drug.name}</h1>
        <a
          href={`https://ndclist.com/ndc/${padCode(drug.ndc)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-100"
        >
          NDC: {padCode(drug.ndc)}
        </a>
        {temp && <p>{temp}</p>}
      </div>
    </div>
  </div>
);

// -----------------------
// Drug Information Component
// -----------------------
interface DrugInformationProps {
  drug: Drug;
  drugDetail?: Prescription | null;
  classNameStr: string;
}
const DrugInformation: React.FC<DrugInformationProps> = ({
  drug,
  drugDetail,
  classNameStr,
}) => {
  if (!drugDetail) {
    return (
      <>
        <div className="bg-gray-50 p-4 rounded-lg">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Class Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{classNameStr}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">AWP</dt>
              <dd className="mt-1 text-sm text-gray-900">${drug.awp}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Strength</dt>
              <dd className="mt-1 text-sm text-gray-900">{drug.strength}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Form</dt>
              <dd className="mt-1 text-sm text-gray-900">{drug.form}</dd>
            </div>
          </dl>
        </div>
        <div className="text-center text-2xl font-bold my-4">Other Drugs</div>
      </>
    );
  } else {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Class Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{classNameStr}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">ACQ</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${drug.acq.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">AWP</dt>
            <dd className="mt-1 text-sm text-gray-900">${drug.awp}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Strength</dt>
            <dd className="mt-1 text-sm text-gray-900">{drug.strength}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Net</dt>
            <dd className="mt-1 text-sm text-gray-900">${drugDetail.net}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Insurance Pay</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${drugDetail.insurancePayment}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Patient Pay</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${drugDetail.patientPayment}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Quantity</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {drugDetail.quantity}
            </dd>
          </div>
        </dl>
      </div>
    );
  }
};

// -----------------------
// Alternatives Table (with Insurance) with Pagination & Sort Toggle
// -----------------------
interface AlternativesTableProps {
  alternatives: Prescription[];
  classNameStr: string;
  padCode: (code: string) => string;
  insuranceMapping: Record<string, string>;
  selectedInsurance: string;
  handleInsuranceFilterChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  handleSort: () => void;
  uniqueInsuranceNames: string[];
  sortOrder: "asc" | "desc";
}
const AlternativesTable: React.FC<AlternativesTableProps> = ({
  alternatives,
  classNameStr,
  padCode,
  insuranceMapping,
  selectedInsurance,
  handleInsuranceFilterChange,
  handleSort,
  uniqueInsuranceNames,
  sortOrder,
}) => {
  const filteredAlternatives = useMemo(
    () =>
      alternatives.filter(
        (alt) => !selectedInsurance || alt.insuranceName === selectedInsurance
      ),
    [alternatives, selectedInsurance]
  );

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAlternatives.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAlternatives.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedInsurance, alternatives]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Repeat className="h-5 w-5 mr-2" />
          Alternative Medications with Insurance
        </h2>
        <div
          className="flex items-center text-sm text-gray-500 cursor-pointer"
          onClick={handleSort}
        >
          <ArrowUpDown className="h-4 w-4 mr-1" />
          Sorted by Net Price ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="insuranceFilter"
          className="block text-sm font-medium text-gray-700"
        >
          Filter by Insurance Name
        </label>
        <select
          id="insuranceFilter"
          value={selectedInsurance}
          onChange={handleInsuranceFilterChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All</option>
          {uniqueInsuranceNames.map((name) => (
            <option key={name} value={name}>
              {insuranceMapping[name] || name}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NDC Codes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Insurance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Insurance Coverage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Pay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACQ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((alt, index) => (
                <tr key={`${alt.ndcCode}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <a
                        href={`/drug/${alt.drugId}`}
                        className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                      >
                        {alt.drugName}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{classNameStr}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{alt.branchName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      <a
                        href={`https://ndclist.com/ndc/${padCode(alt.ndcCode)}`}
                        className="text-blue-500 hover:text-blue-700 hover:underline transition duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {padCode(alt.ndcCode)}
                      </a>
                    </div>
                  </td>
                  <td className="px-10 py-4">
                    <div className="text-sm text-gray-500">
                      <a
                        href={`/InsruanceDetails/${alt.insuranceName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                      >
                        {insuranceMapping[alt.insuranceName] || alt.insuranceName}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {alt.insuranceName ? "$" + alt.net.toFixed(2) : "NA"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {alt.insuranceName
                        ? "$" + alt.insurancePayment.toFixed(2)
                        : "NA"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {alt.insuranceName ? "$" + alt.patientPayment.toFixed(2) : "NA"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {alt.insuranceName ? alt.quantity : "NA"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {alt.acquisitionCost}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No insurance found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

// -----------------------
// Branch Drugs Table (with Insurance Filter, Pagination & Sort Toggle)
// -----------------------
interface BranchDrugsTableProps {
  branchDrugs: Prescription[];
  classNameStr: string;
  padCode: (code: string) => string;
  insuranceMapping: Record<string, string>;
  selectedInsurance: string;
  handleInsuranceFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  uniqueInsuranceNames: string[];
}
const BranchDrugsTable: React.FC<BranchDrugsTableProps> = ({
  branchDrugs,
  classNameStr,
  padCode,
  insuranceMapping,
  selectedInsurance,
  handleInsuranceFilterChange,
  uniqueInsuranceNames,
}) => {
  const filteredBranchDrugs = useMemo(
    () =>
      branchDrugs.filter(
        (drug) => !selectedInsurance || drug.insuranceName === selectedInsurance
      ),
    [branchDrugs, selectedInsurance]
  );

  // Local sort state for branch drugs
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedBranchDrugs = useMemo(() => {
    return [...filteredBranchDrugs].sort((a, b) =>
      sortOrder === "asc" ? a.net - b.net : b.net - a.net
    );
  }, [filteredBranchDrugs, sortOrder]);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedBranchDrugs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBranchDrugs.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedInsurance, branchDrugs]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Repeat className="h-5 w-5 mr-2" />
          Branch Drugs
        </h2>
        <div
          className="flex items-center text-sm text-gray-500 cursor-pointer"
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
        >
          <ArrowUpDown className="h-4 w-4 mr-1" />
          Sorted by Net Price ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="branchInsuranceFilter"
          className="block text-sm font-medium text-gray-700"
        >
          Filter by Insurance Name
        </label>
        <select
          id="branchInsuranceFilter"
          value={selectedInsurance}
          onChange={handleInsuranceFilterChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All</option>
          {uniqueInsuranceNames.map((name) => (
            <option key={name} value={name}>
              {insuranceMapping[name] || name}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NDC Codes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Insurance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Insurance Coverage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Pay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACQ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((drug, index) => (
                <tr key={`${drug.ndcCode}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <a
                        href={`/drug/${drug.drugId}`}
                        className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                      >
                        {drug.drugName}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{classNameStr}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{drug.branchName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      <a
                        href={`https://ndclist.com/ndc/${padCode(drug.ndcCode)}`}
                        className="text-blue-500 hover:text-blue-700 hover:underline transition duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {padCode(drug.ndcCode)}
                      </a>
                    </div>
                  </td>
                  <td className="px-10 py-4">
                    <div className="text-sm text-gray-500">
                      <a
                        href={`/InsruanceDetails/${drug.insuranceName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                      >
                        {drug.insuranceName}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {drug.insuranceName ? "$" + drug.net.toFixed(2) : "NA"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {drug.insuranceName
                        ? "$" + drug.insurancePayment.toFixed(2)
                        : "NA"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {drug.insuranceName ? "$" + drug.patientPayment.toFixed(2) : "NA"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {drug.insuranceName ? drug.quantity : "NA"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {drug.acquisitionCost}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No branch drugs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

// -----------------------
// Main Container Component
// -----------------------
export const DrugDetails: React.FC = () => {
  const { drugId } = useParams();
  const [searchParams] = useSearchParams();
  const ndcCode = searchParams.get("ndc");
  const insuranceId = searchParams.get("insuranceId");

  const [drug, setDrug] = useState<Drug | null>(null);
  const [sortedAlternatives, setSortedAlternatives] = useState<Prescription[]>([]);
  const [drugDetail, setDrugDetail] = useState<Prescription | null>(null);
  const [branchDrugs, setBranchDrugs] = useState<Prescription[]>([]);
  const [classNameStr, setClassName] = useState("");
  const [showOtherAlternatives, setShowOtherAlternatives] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<string>("");
  // Separate filter state for branch drugs table:
  const [branchSelectedInsurance, setBranchSelectedInsurance] = useState<string>("");
  // State to switch between table views:
  const [activeTable, setActiveTable] = useState<"insurance" | "branch">("insurance");
  // State for sort order for alternatives table:
  const [alternativesSortOrder, setAlternativesSortOrder] = useState<"asc" | "desc">("desc");
  const [temp, setTemp] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Insurance mapping object
  const insuranceMapping: Record<string, string> = {
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

  // Helper: pad NDC code to 11 digits
  const padCode = (code: string) => code.padStart(11, "0");

  // Toggle display for alternatives without insurance
  const toggleOtherAlternatives = () => {
    setShowOtherAlternatives((prev) => !prev);
  };

  // Fetch drug and alternatives data
  useEffect(() => {
    const fetchDrugDetails = async () => {
      try {
        let response2;
        if (!insuranceId) {
          let response;
          if (ndcCode) {
            response = await axios.get(
              `${baseUrl}/drug/SearchByNdc?ndc=${ndcCode}`
            );
          } else {
            response = await axios.get(
              `${baseUrl}/drug/GetDrugById?id=${drugId}`
            );
          }
          setDrug(response.data);
          response2 = await axios.get(
            `${baseUrl}/drug/GetAllDrugs?classId=${response.data.drugClassId}`
          );
          setSortedAlternatives(response2.data);
          // Fetch branch drugs as well
          const response10 = await axios.get(
            `${baseUrl}/drug/GetAlternativesByClassIdBranchId?classId=${response.data.drugClassId}&branchId=${1}`
          );
          setBranchDrugs(response10.data);
          const response3 = await axios.get(
            `${baseUrl}/drug/GetClassById?id=${response.data.drugClassId}`
          );
          setClassName(response3.data.name);
        } else {
          const response = await axios.get(
            `${baseUrl}/drug/SearchByNdc?ndc=${ndcCode}`
          );
          const drugData = response.data;
          setDrug(drugData);
          response2 = await axios.get(
            `${baseUrl}/drug/GetDetails?ndc=${ndcCode}&insuranceId=${insuranceId}`
          );
          setDrugDetail(response2.data);
          const response3 = await axios.get(
            `${baseUrl}/drug/GetClassById?id=${response.data.drugClassId}`
          );
          setClassName(response3.data.name);
          const response10 = await axios.get(
            `${baseUrl}/drug/GetAlternativesByClassIdBranchId?classId=${response.data.drugClassId}&branchId=${1}`
          );
          setBranchDrugs(response10.data);
          if (response3.data.name !== "other") {
            const response4 = await axios.get(
              `${baseUrl}/drug/GetAllDrugs?classId=${response.data.drugClassId}`
            );
            setSortedAlternatives(response4.data);
          } else {
            setSortedAlternatives([]);
          }
        }
      } catch (err) {
        setError("Failed to load drug details");
      } finally {
        setLoading(false);
      }
    };

    fetchDrugDetails();
  }, [drugId, ndcCode, insuranceId]);

  if (loading) return <LoadingSpinner />;
  if (error || !drug)
    return <ErrorMessage message={error || "Drug not found"} />;

  // Sort alternatives by net price toggle in parent component
  const handleSort = () => {
    const newSortOrder = alternativesSortOrder === "desc" ? "asc" : "desc";
    const sorted = [...sortedAlternatives].sort((a, b) =>
      newSortOrder === "asc" ? a.net - b.net : b.net - a.net
    );
    setSortedAlternatives(sorted);
    setAlternativesSortOrder(newSortOrder);
  };

  // Handle insurance filter change for alternatives table
  const handleInsuranceFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedInsurance(event.target.value);
  };

  // Handle insurance filter change for branch table
  const handleBranchInsuranceFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setBranchSelectedInsurance(event.target.value);
  };

  // Split alternatives into those with and without an insurance name
  const alternativesWithInsurance = sortedAlternatives.filter(
    (alt) => alt.insuranceName
  );
  const alternativesWithoutInsurance = sortedAlternatives.filter(
    (alt) => !alt.insuranceName
  );

  // Compute unique insurance names for the alternatives table
  const uniqueInsuranceNames: string[] = [
    ...new Set([
      ...alternativesWithInsurance.map((alt) => alt.insuranceName),
      "AA","AB","AC","AD","AF","AG","AH","AI","AJ","AL","AM",
      "AO","AQ","AS","AT","AU","AV","AX","BE","BF","BI","BL",
      "BM","BN","BO","BP","BR","BU","BW","CA","CC","CE","CG",
      "CJ","CK","CL","CM","CO","CQ","CR","CU","CY","DJ","DQ",
      "DS","DW","EA","EB","ED","EH","EJ","EO","EP","EQ","ER",
      "ET","EW","EY","FA","FF","FG","FJ","FQ","FS","FT","GA",
      "GC","GE","GF","GH","GI","GJ","GM","GO","GQ","GS","GT",
      "GV","GX","GY","GZ","HB","HE","X ",
    ]),
  ].sort();

  // Compute unique insurance names for branch drugs table
  const branchUniqueInsuranceNames: string[] = [
    ...new Set(branchDrugs.map((drug) => drug.insuranceName)),
  ].sort();

  return (
    <motion.div>
      <div className="max-w-10xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <DrugHeader drug={drug} padCode={padCode} temp={temp} />
          <div className="p-6 space-y-6">
            <DrugInformation
              drug={drug}
              drugDetail={drugDetail}
              classNameStr={classNameStr}
            />

            {/* Switch button to toggle between tables */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() =>
                  setActiveTable(
                    activeTable === "insurance" ? "branch" : "insurance"
                  )
                }
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                {activeTable === "insurance"
                  ? "Switch to Branch Drugs"
                  : "Switch to Alternative Medications with Insurance"}
              </button>
            </div>

            {activeTable === "insurance" ? (
              <>
                {sortedAlternatives.length > 0 && (
                  <>
                    <AlternativesTable
                      alternatives={alternativesWithInsurance}
                      classNameStr={classNameStr}
                      padCode={padCode}
                      insuranceMapping={insuranceMapping}
                      selectedInsurance={selectedInsurance}
                      handleInsuranceFilterChange={handleInsuranceFilterChange}
                      handleSort={handleSort}
                      uniqueInsuranceNames={uniqueInsuranceNames}
                      sortOrder={alternativesSortOrder}
                    />
                    <button
                      onClick={toggleOtherAlternatives}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      {showOtherAlternatives
                        ? "Hide Other Alternatives"
                        : "Show Other Alternatives"}
                    </button>
                    {showOtherAlternatives && (
                      <OtherAlternativesTable
                        alternatives={alternativesWithoutInsurance}
                        classNameStr={classNameStr}
                        padCode={padCode}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {branchDrugs.length > 0 ? (
                  <BranchDrugsTable
                    branchDrugs={branchDrugs}
                    classNameStr={classNameStr}
                    padCode={padCode}
                    insuranceMapping={insuranceMapping}
                    selectedInsurance={branchSelectedInsurance}
                    handleInsuranceFilterChange={handleBranchInsuranceFilterChange}
                    uniqueInsuranceNames={branchUniqueInsuranceNames}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    No branch drugs found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// -----------------------
// Other Alternatives Table (without Insurance) with Pagination
// -----------------------
interface OtherAlternativesTableProps {
  alternatives: Prescription[];
  classNameStr: string;
  padCode: (code: string) => string;
}
const OtherAlternativesTable: React.FC<OtherAlternativesTableProps> = ({
  alternatives,
  classNameStr,
  padCode,
}) => {
  const memoizedAlternatives = useMemo(() => alternatives, [alternatives]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(memoizedAlternatives.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = memoizedAlternatives.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [memoizedAlternatives]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900">
        Alternative Medications without Insurance
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NDC Codes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACQ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((alt, index) => (
              <tr key={`${alt.ndcCode}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    <a
                      href={`/drug/${alt.drugId}`}
                      className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                    >
                      {alt.drugName}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{classNameStr}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    <a
                      href={`https://ndclist.com/ndc/${padCode(alt.ndcCode)}`}
                      className="text-blue-500 hover:text-blue-700 hover:underline transition duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {padCode(alt.ndcCode)}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{alt.acquisitionCost}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};
