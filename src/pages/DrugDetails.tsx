import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Pill, AlertCircle, Repeat, ArrowUpDown } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { Drug, Prescription } from "../types";
import BaseUrlLoader, { loadConfig } from "../BaseUrlLoader";

await loadConfig();

const baseUrl = BaseUrlLoader.API_BASE_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

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

interface AlternativesTableProps {
  alternatives: Prescription[];
  classNameStr: string;
  padCode: (code: string) => string;
  selectedInsurance: string;
  handleInsuranceFilterChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  uniqueInsuranceNames: string[];
  selectedBin: string;
  handleBinFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  uniqueBinValues: string[];
  selectedPcn: string;
  handlePcnFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  uniquePcnValues: string[];
  handleSort: () => void;
  sortOrder: "asc" | "desc";
}
const AlternativesTable: React.FC<AlternativesTableProps> = ({
  alternatives,
  classNameStr,
  padCode,
  selectedInsurance,
  handleInsuranceFilterChange,
  uniqueInsuranceNames,
  selectedBin,
  handleBinFilterChange,
  uniqueBinValues,
  selectedPcn,
  handlePcnFilterChange,
  uniquePcnValues,
  handleSort,
  sortOrder,
}) => {
  const filteredAlternatives = useMemo(
    () =>
      alternatives.filter(
        (alt) =>
          (!selectedInsurance || alt.insuranceName === selectedInsurance) &&
          (!selectedBin || alt.bin === selectedBin) &&
          (!selectedPcn || alt.pcn === selectedPcn)
      ),
    [alternatives, selectedInsurance, selectedBin, selectedPcn]
  );

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
  }, [selectedInsurance, selectedBin, selectedPcn, alternatives]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <section>
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Repeat className="h-5 w-5 mr-2" />
          Alternative Medications with Insurance
        </h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label
              htmlFor="insuranceFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by Rx Group
            </label>
            <select
              id="insuranceFilter"
              value={selectedInsurance}
              onChange={handleInsuranceFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="">All</option>
              {uniqueInsuranceNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="binFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by BIN
            </label>
            <select
              id="binFilter"
              value={selectedBin}
              onChange={handleBinFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="">All</option>
              {uniqueBinValues.map((bin) => (
                <option key={bin} value={bin}>
                  {bin}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="pcnFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by PCN
            </label>
            <select
              id="pcnFilter"
              value={selectedPcn}
              onChange={handlePcnFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="">All</option>
              {uniquePcnValues.map((pcn) => (
                <option key={pcn} value={pcn}>
                  {pcn}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          className="flex items-center text-sm text-gray-500 cursor-pointer"
          onClick={handleSort}
        >
          <ArrowUpDown className="h-4 w-4 mr-1" />
          Sorted by Net Price (
          {sortOrder === "asc" ? "Ascending" : "Descending"})
        </div>
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
              <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rx Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                BIN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PCN
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
                <tr
                  key={`${alt.ndcCode}-${index}`}
                  className="hover:bg-gray-50"
                >
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
                    <div className="text-sm text-gray-500">
                      {alt.branchName}
                    </div>
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
                        href={`/InsuranceDetails/${alt.insuranceName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                      >
                        {alt.insuranceName}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{alt.bin}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{alt.pcn}</div>
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
                      {alt.insuranceName
                        ? "$" + alt.patientPayment.toFixed(2)
                        : "NA"}
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
                  colSpan={13}
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

interface BranchDrugsTableProps {
  branchDrugs: Prescription[];
  classNameStr: string;
  padCode: (code: string) => string;
  selectedInsurance: string;
  handleInsuranceFilterChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  uniqueInsuranceNames: string[];
  selectedBin: string;
  handleBinFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  uniqueBinValues: string[];
  selectedPcn: string;
  handlePcnFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  uniquePcnValues: string[];
}
const BranchDrugsTable: React.FC<BranchDrugsTableProps> = ({
  branchDrugs,
  classNameStr,
  padCode,
  selectedInsurance,
  handleInsuranceFilterChange,
  uniqueInsuranceNames,
  selectedBin,
  handleBinFilterChange,
  uniqueBinValues,
  selectedPcn,
  handlePcnFilterChange,
  uniquePcnValues,
}) => {
  const filteredBranchDrugs = useMemo(
    () =>
      branchDrugs.filter(
        (drug) =>
          (!selectedInsurance || drug.insuranceName === selectedInsurance) &&
          (!selectedBin || drug.bin === selectedBin) &&
          (!selectedPcn || drug.pcn === selectedPcn)
      ),
    [branchDrugs, selectedInsurance, selectedBin, selectedPcn]
  );

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedBranchDrugs = useMemo(() => {
    return [...filteredBranchDrugs].sort((a, b) =>
      sortOrder === "asc" ? a.net - b.net : b.net - a.net
    );
  }, [filteredBranchDrugs, sortOrder]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedBranchDrugs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBranchDrugs.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedInsurance, selectedBin, selectedPcn, branchDrugs]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <section>
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Repeat className="h-5 w-5 mr-2" />
          Branch Drugs
        </h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label
              htmlFor="branchInsuranceFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by Rx Group
            </label>
            <select
              id="branchInsuranceFilter"
              value={selectedInsurance}
              onChange={handleInsuranceFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="">All</option>
              {uniqueInsuranceNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="branchBinFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by BIN
            </label>
            <select
              id="branchBinFilter"
              value={selectedBin}
              onChange={handleBinFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="">All</option>
              {uniqueBinValues.map((bin) => (
                <option key={bin} value={bin}>
                  {bin}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="branchPcnFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by PCN
            </label>
            <select
              id="branchPcnFilter"
              value={selectedPcn}
              onChange={handlePcnFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="">All</option>
              {uniquePcnValues.map((pcn) => (
                <option key={pcn} value={pcn}>
                  {pcn}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          className="flex items-center text-sm text-gray-500 cursor-pointer"
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          <ArrowUpDown className="h-4 w-4 mr-1" />
          Sorted by Net Price (
          {sortOrder === "asc" ? "Ascending" : "Descending"})
        </div>
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
              <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rx Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                BIN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PCN
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
                <tr
                  key={`${drug.ndcCode}-${index}`}
                  className="hover:bg-gray-50"
                >
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
                    <div className="text-sm text-gray-500">
                      {drug.branchName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      <a
                        href={`https://ndclist.com/ndc/${padCode(
                          drug.ndcCode
                        )}`}
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
                        href={`/InsuranceDetails/${drug.insuranceName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                      >
                        {drug.insuranceName}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{drug.bin}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{drug.pcn}</div>
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
                      {drug.insuranceName
                        ? "$" + drug.patientPayment.toFixed(2)
                        : "NA"}
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
                  colSpan={13}
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

interface OtherAlternativesTableProps {
  alternatives: Prescription[];
  classNameStr: string;
  padCode: (code: string) => string;
  selectedBin: string;
  handleBinFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  uniqueBinValues: string[];
  selectedPcn: string;
  handlePcnFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  uniquePcnValues: string[];
}
const OtherAlternativesTable: React.FC<OtherAlternativesTableProps> = ({
  alternatives,
  classNameStr,
  padCode,
  selectedBin,
  handleBinFilterChange,
  uniqueBinValues,
  selectedPcn,
  handlePcnFilterChange,
  uniquePcnValues,
}) => {
  const filteredAlternatives = useMemo(
    () =>
      alternatives.filter(
        (alt) =>
          (!selectedBin || alt.bin === selectedBin) &&
          (!selectedPcn || alt.pcn === selectedPcn)
      ),
    [alternatives, selectedBin, selectedPcn]
  );

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
  }, [selectedBin, selectedPcn, alternatives]);

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

export const DrugDetails: React.FC = () => {
  const { drugId } = useParams();
  const [searchParams] = useSearchParams();
  const ndcCode = searchParams.get("ndc");
  const insuranceId = searchParams.get("insuranceId");

  const [drug, setDrug] = useState<Drug | null>(null);
  const [sortedAlternatives, setSortedAlternatives] = useState<Prescription[]>(
    []
  );
  const [drugDetail, setDrugDetail] = useState<Prescription | null>(null);
  const [branchDrugs, setBranchDrugs] = useState<Prescription[]>([]);
  const [classNameStr, setClassName] = useState("");
  const [showOtherAlternatives, setShowOtherAlternatives] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<string>("");
  const [selectedBin, setSelectedBin] = useState<string>("");
  const [selectedPcn, setSelectedPcn] = useState<string>("");

  const [branchSelectedInsurance, setBranchSelectedInsurance] =
    useState<string>("");
  const [branchSelectedBin, setBranchSelectedBin] = useState<string>("");
  const [branchSelectedPcn, setBranchSelectedPcn] = useState<string>("");

  const [otherSelectedBin, setOtherSelectedBin] = useState<string>("");
  const [otherSelectedPcn, setOtherSelectedPcn] = useState<string>("");

  const [activeTable, setActiveTable] = useState<"insurance" | "branch">(
    "insurance"
  );
  const [alternativesSortOrder, setAlternativesSortOrder] = useState<
    "asc" | "desc"
  >("desc");
  const [temp, setTemp] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch drug details and alternatives
  useEffect(() => {
    const fetchDrugDetails = async () => {
      try {
        let response2;
        if (!insuranceId) {
          let response;
          if (ndcCode) {
            response = await axios.get(
              `${baseUrl}/drug/SearchByNdc?ndc=${ndcCode}`,
              { headers: getAuthHeader() }
            );
          } else {
            response = await axios.get(
              `${baseUrl}/drug/GetDrugById?id=${drugId}`,
              { headers: getAuthHeader() }
            );
          }
          setDrug(response.data);
          // Get all alternatives and sort descending by net price:
          response2 = await axios.get(
            `${baseUrl}/drug/GetAllDrugs?classId=${response.data.drugClassId}`,
            { headers: getAuthHeader() }
          );
          const sortedData = response2.data.sort((a, b) => b.net - a.net);
          setSortedAlternatives(sortedData);
          const response10 = await axios.get(
            `${baseUrl}/drug/GetAlternativesByClassIdBranchId?classId=${response.data.drugClassId}`,
            { headers: getAuthHeader() }
          );
          setBranchDrugs(response10.data);
          const response3 = await axios.get(
            `${baseUrl}/drug/GetClassById?id=${response.data.drugClassId}`,
            { headers: getAuthHeader() }
          );
          setClassName(response3.data.name);
        } else {
          // If an insuranceId is provided:
          const response = await axios.get(
            `${baseUrl}/drug/SearchByNdc?ndc=${ndcCode}`,
            { headers: getAuthHeader() }
          );
          const drugData = response.data;
          setDrug(drugData);
          response2 = await axios.get(
            `${baseUrl}/drug/GetDetails?ndc=${ndcCode}&insuranceId=${insuranceId}`,
            { headers: getAuthHeader() }
          );
          setDrugDetail(response2.data);
          const response3 = await axios.get(
            `${baseUrl}/drug/GetClassById?id=${response.data.drugClassId}`,
            { headers: getAuthHeader() }
          );
          setClassName(response3.data.name);
          const response10 = await axios.get(
            `${baseUrl}/drug/GetAlternativesByClassIdBranchId?classId=${response.data.drugClassId}`,
            { headers: getAuthHeader() }
          );
          setBranchDrugs(response10.data);
          console.log(response10.data);
          if (response3.data.name !== "other") {
            const response4 = await axios.get(
              `${baseUrl}/drug/GetAllDrugs?classId=${response.data.drugClassId}`,
              { headers: getAuthHeader() }
            );
            // Sort descending by net price when alternatives are loaded:
            const matchingAlt = response4.data.find(
              (alt) => alt.insuranceId.toString() === insuranceId
            );
            setSelectedInsurance(matchingAlt?.insuranceName || "");
            setBranchSelectedInsurance(matchingAlt?.insuranceName || "");
            
            const sortedData = response4.data.sort((a, b) => b.net - a.net);
            setSortedAlternatives(sortedData);
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

  // Map the provided insuranceId to the insurance name using the sorted alternatives
  useEffect(() => {
    if (insuranceId && sortedAlternatives.length > 0) {
    const matchingInsurance = sortedAlternatives.find(
  (alt) => alt.insuranceId && alt.insuranceId.toString() === insuranceId
);

      if (matchingInsurance) {
        setSelectedInsurance(matchingInsurance.insuranceName);
        setBranchSelectedInsurance(matchingInsurance.insuranceName);
      } else {
        setSelectedInsurance("");
        setBranchSelectedInsurance("");
      }
    }
  }, [insuranceId, sortedAlternatives]);

  if (loading) return <LoadingSpinner />;
  if (error || !drug)
    return <ErrorMessage message={error || "Drug not found"} />;

  const handleSort = () => {
    const newSortOrder = alternativesSortOrder === "desc" ? "asc" : "desc";
    const sorted = [...sortedAlternatives].sort((a, b) =>
      newSortOrder === "asc" ? a.net - b.net : b.net - a.net
    );
    setSortedAlternatives(sorted);
    setAlternativesSortOrder(newSortOrder);
  };

  const handleInsuranceFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedInsurance(event.target.value);
  };
  const handleBinFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedBin(event.target.value);
  };
  const handlePcnFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPcn(event.target.value);
  };

  const handleBranchInsuranceFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setBranchSelectedInsurance(event.target.value);
  };
  const handleBranchBinFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setBranchSelectedBin(event.target.value);
  };
  const handleBranchPcnFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setBranchSelectedPcn(event.target.value);
  };

  const handleOtherBinFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setOtherSelectedBin(event.target.value);
  };
  const handleOtherPcnFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setOtherSelectedPcn(event.target.value);
  };

  const alternativesWithInsurance = sortedAlternatives.filter(
    (alt) => alt.insuranceName
  );
  const alternativesWithoutInsurance = sortedAlternatives.filter(
    (alt) => !alt.bin
  );

  const uniqueInsuranceNames: string[] = [
    ...new Set(alternativesWithInsurance.map((alt) => alt.insuranceName)),
  ].sort();
  const uniqueBinValues: string[] = [
    ...new Set(alternativesWithInsurance.map((alt) => alt.bin)),
  ].sort();
  const uniquePcnValues: string[] = [
    ...new Set(alternativesWithInsurance.map((alt) => alt.pcn)),
  ].sort();

  const branchUniqueInsuranceNames: string[] = [
    ...new Set(branchDrugs.map((drug) => drug.insuranceName)),
  ].sort();
  const branchUniqueBinValues: string[] = [
    ...new Set(branchDrugs.map((drug) => drug.bin)),
  ].sort();
  const branchUniquePcnValues: string[] = [
    ...new Set(branchDrugs.map((drug) => drug.pcn)),
  ].sort();

  const uniqueOtherBinValues: string[] = [
    ...new Set(alternativesWithoutInsurance.map((alt) => alt.bin)),
  ].sort();
  const uniqueOtherPcnValues: string[] = [
    ...new Set(alternativesWithoutInsurance.map((alt) => alt.pcn)),
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
            {activeTable === "insurance" ? (
              <>
                {sortedAlternatives.length > 0 && (
                  <>
                    <AlternativesTable
                      alternatives={alternativesWithInsurance}
                      classNameStr={classNameStr}
                      padCode={padCode}
                      selectedInsurance={selectedInsurance}
                      handleInsuranceFilterChange={handleInsuranceFilterChange}
                      uniqueInsuranceNames={uniqueInsuranceNames}
                      selectedBin={selectedBin}
                      handleBinFilterChange={handleBinFilterChange}
                      uniqueBinValues={uniqueBinValues}
                      selectedPcn={selectedPcn}
                      handlePcnFilterChange={handlePcnFilterChange}
                      uniquePcnValues={uniquePcnValues}
                      handleSort={handleSort}
                      sortOrder={alternativesSortOrder}
                    />
                    <button
                      onClick={() => setShowOtherAlternatives((prev) => !prev)}
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
                        selectedBin={otherSelectedBin}
                        handleBinFilterChange={handleOtherBinFilterChange}
                        uniqueBinValues={uniqueOtherBinValues}
                        selectedPcn={otherSelectedPcn}
                        handlePcnFilterChange={handleOtherPcnFilterChange}
                        uniquePcnValues={uniqueOtherPcnValues}
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
                    selectedInsurance={branchSelectedInsurance}
                    handleInsuranceFilterChange={
                      handleBranchInsuranceFilterChange
                    }
                    uniqueInsuranceNames={branchUniqueInsuranceNames}
                    selectedBin={branchSelectedBin}
                    handleBinFilterChange={handleBranchBinFilterChange}
                    uniqueBinValues={branchUniqueBinValues}
                    selectedPcn={branchSelectedPcn}
                    handlePcnFilterChange={handleBranchPcnFilterChange}
                    uniquePcnValues={branchUniquePcnValues}
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

const padCode = (code: string) => code.padStart(11, "0");
