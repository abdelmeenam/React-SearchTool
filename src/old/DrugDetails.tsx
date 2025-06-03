import React, { JSX, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Pill,
  AlertCircle,
  Repeat,
  ArrowUpDown,
  Activity,
  Shield,
  Barcode,
  MapPin,
  Info,
  Table,
  Layers,
  Key,
  Wallet,
  UserCheck,
  Hash,
  Link2Icon,
  BarChart2,
  Link2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BookCheck,
  Weight,
  ShieldCheck,
  Droplet,
  Fingerprint,
  Eye,
  Clock,
  CopyPlus,
} from "lucide-react";
import {
  Tag,
  DollarSign,
  Percent,
  Zap,
  BarChart,
  CreditCard,
  User,
  Package,
  Building,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

// Utility function to format numbers as currency
const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
import { Drug, DrugMedi, OrderItem, Prescription, SearchLog } from "../types";
import axiosInstance from "../api/axiosInstance";
import { useCart } from "../context/CartContext"; // adjust path
import DrugDetailsModal from "../components/DrugDetailsModal";

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
  </div>
);

interface ErrorMessageProps {
  message: string;
}
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="text-center text-red-600 dark:text-red-400 p-8">
    <AlertCircle className="h-12 w-12 mx-auto mb-4" />
    <p>{message}</p>
  </div>
);

interface DrugHeaderProps {
  drug: Drug;
  padCode: (code: string) => string;
  temp: string;
  drugClass: string;
}
/* newwwwww comp */
// Removed duplicate declaration of DrugInformation to resolve the error.

export const DrugHeader: React.FC<DrugHeaderProps> = ({
  drug,
  padCode,
  drugClass,
}) => (
  <header className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-lg text-white flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
    <div className="flex-shrink-0 flex items-center justify-center bg-white/20 rounded-full h-14 w-14 shadow-lg">
      <Pill className="h-8 w-8 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <h1 className="text-3xl font-extrabold tracking-tight truncate">
        {drug.name}
      </h1>
      <div className="flex items-center space-x-3 mt-2">
        <a
          href={`https://ndclist.com/ndc/${padCode(drug.ndc)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1 bg-blue-700/40 rounded-full text-blue-100 hover:underline text-sm font-mono"
          title="View on NDC List"
        >
          <Barcode className="h-4 w-4 mr-1" />
          NDC: {padCode(drug.ndc)}
        </a>
        <span className="inline-flex items-center px-3 py-1 bg-indigo-700/40 rounded-full text-indigo-100 text-sm ml-2">
          <CopyPlus className="h-4 w-4 mr-1" />
          Drug Class : {drugClass}
        </span>
      </div>
    </div>
  </header>
);
// Define the DrugMediSection interface
interface DrugMediSection {
  drugMedi: DrugMedi[]; // Adjust the type of drugMedi based on your data structure
}

export const DrugMediSection: React.FC<DrugMediSection> = ({ drugMedi }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchNdc, setSearchNdc] = useState("");
  const [searchName, setSearchName] = useState("");
  const itemsPerPage = 10;

  // Filter logic for search
  const filteredDrugs = drugMedi.filter((item) => {
    const ndcMatch = searchNdc
      ? item.drugNDC?.toLowerCase().includes(searchNdc.toLowerCase())
      : true;
    const nameMatch = searchName
      ? item.drugName?.toLowerCase().includes(searchName.toLowerCase())
      : true;
    return ndcMatch && nameMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDrugs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDrugs.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 on search
  }, [searchNdc, searchName]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Selected drug and alternatives Medical Coverage Policy Information
      </h3>
      {/* Search Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="flex flex-col">
          <label
            htmlFor="searchNdc"
            className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Search by NDC
          </label>
          <input
            id="searchNdc"
            type="text"
            value={searchNdc}
            onChange={(e) => setSearchNdc(e.target.value)}
            placeholder="Enter NDC code"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="searchName"
            className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Search by Name
          </label>
          <input
            id="searchName"
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter drug name"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg dark:bg-gray-800 bg-white border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {[
                "#",
                "Name",
                "NDC",
                "Prior Authorization",
                "Extended Duration",
                "Cost Ceiling Tier",
                "Non-Capitated Indicator",
                "CCS Panel Authority",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.drugName || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  <a
                    href={`https://ndclist.com/ndc/${padCode(item.drugNDC)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition"
                  >
                    {item.drugNDC || "N/A"}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {item.priorAuthorization || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {item.extendedDuration || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {item.costCeilingTier || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {item.nonCapitatedDrugIndicator || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {item.ccsPanelAuthority || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md transition ${
              currentPage === 1
                ? "bg-gray-300 dark:bg-gray-500 cursor-not-allowed text-gray-600 dark:text-gray-200"
                : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md transition ${
              currentPage === totalPages
                ? "bg-gray-300 dark:bg-gray-500 cursor-not-allowed text-gray-600 dark:text-gray-200"
                : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

interface DrugInformationProps {
  drug: Drug;
  drugDetail?: Prescription | null;
  classNameStr: string;
  bestDrugNet: Prescription | null;
  drugMedi: DrugMedi | null;
  drugClass: string;
}
export const DrugInformation: React.FC<DrugInformationProps> = ({
  drug,
  drugDetail,
  bestDrugNet,
  drugMedi,
  drugClass,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDrugDetails, setShowDrugDetails] = useState(false);

  const net = drugDetail?.net ?? 0;
  const netPositive = net >= 0;
  const bestNet = bestDrugNet?.net ?? 0;
  const { addToCart } = useCart();
  const cartItems = useCart().cartItems;
  // ...inside DrugInformation component...
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState<string | null>(null);
  return (
    <div className="relative mx-auto border border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
      {/* Recommendation Badge */}
      {popupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-w-[260px] max-w-xs max-h-[80vh] flex flex-col">
            <div
              className="mb-4 text-gray-900 dark:text-gray-100 break-words overflow-y-auto"
              style={{ maxHeight: "50vh" }}
            >
              {popupContent}
            </div>
            <button
              onClick={() => setPopupOpen(false)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {bestNet !== 0 && (
        <div
          className={`absolute bottom-4 left-4 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-white shadow-md
        ${
          net === bestNet
            ? "bg-green-600"
            : net >= bestNet * 0.7
            ? "bg-yellow-500"
            : net >= bestNet * 0.5
            ? "bg-orange-400"
            : "bg-red-500"
        }`}
        >
          {net === bestNet ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Top Recommendation
            </>
          ) : net >= bestNet * 0.7 ? (
            <>
              <AlertTriangle className="w-4 h-4" />
              Good Option
            </>
          ) : net >= bestNet * 0.5 ? (
            <>
              <AlertTriangle className="w-4 h-4" />
              Average Option
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4" />
              Not Recommended
            </>
          )}
        </div>
      )}

      {/* Details Modal */}
      {showDetails && (
        <DrugDetailsModal
          drug={drug}
          drugDetail={drugDetail ?? null}
          onClose={() => setShowDetails(false)}
          formatCurrency={formatCurrency}
          drugClass={drugClass}
        />
      )}

      <section className="space-y-8">
        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded shadow-sm min-w-0">
            <DollarSign className="h-5 w-5 text-blue-500 dark:text-blue-300 flex-shrink-0" />
            <dl className="min-w-0">
              <dt className="text-xs text-gray-500 truncate">ACQ</dt>
              <dd className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                ${drug.acq?.toFixed(2) ?? "NA"}
              </dd>
            </dl>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded shadow-sm min-w-0">
            <Percent className="h-5 w-5 text-blue-500 dark:text-blue-300 flex-shrink-0" />
            <dl className="min-w-0">
              <dt className="text-xs text-gray-500 truncate">AWP</dt>
              <dd className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                ${drug.awp ?? "NA"}
              </dd>
            </dl>
          </div>
          <div className="flex flex-col p-3 bg-white dark:bg-gray-800 rounded shadow-sm min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <BarChart2 className="h-5 w-5 text-blue-500 dark:text-blue-300 flex-shrink-0" />
              <dl className="min-w-0">
                <dt className="text-xs text-gray-500 truncate">Net</dt>
                <dd
                  className={`text-sm font-semibold ${
                    netPositive ? "text-green-600" : "text-red-600"
                  } truncate`}
                >
                  {netPositive ? "+" : "-"}${Math.abs(net).toFixed(2)}
                </dd>
              </dl>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded mt-2">
              <div
                className={`h-1.5 rounded transition-all duration-500 ease-out ${
                  netPositive ? "bg-green-500" : "bg-red-500"
                }`}
                style={{
                  width: `${
                    bestDrugNet?.net !== undefined && bestDrugNet.net !== 0
                      ? Math.min((net / bestNet) * 100, 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Drug Reference Section */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-blue-500 dark:text-blue-300" />
            Drug Reference Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                icon: (
                  <Fingerprint className="h-4 w-1 text-blue-500 dark:text-blue-300" />
                ),
                label: "RxCUI",
                value: drug?.rxcui ?? "NA",
              },
              {
                icon: (
                  <Droplet className="h-4 w-8 text-blue-500 dark:text-blue-300" />
                ),
                label: "Ingredient",
                value: drug?.ingrdient ?? "NA",
              },
              {
                icon: (
                  <ShieldCheck className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                ),
                label: "TE Code",
                value: drug?.teCode || "NA",
              },
              {
                icon: (
                  <Tag className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                ),
                label: "Market Type",
                value: drug?.type || "NA",
              },
              {
                icon: (
                  <Weight className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                ),
                label: "Strength",
                value: `${drug.strength ?? "NA"} ${drug?.strengthUnit ?? ""}`,
              },
            ].map((item, idx) => (
              <div
                key={item.label}
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded min-w-0"
              >
                {item.icon}
                <dl className="min-w-0">
                  <dt className="text-xs text-gray-500 truncate">
                    {item.label}
                  </dt>
                  <dd
                    className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[180px] cursor-pointer"
                    title={
                      item.value !== undefined ? String(item.value) : undefined
                    }
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPopupContent(
                        item.value !== undefined ? String(item.value) : "N/A"
                      );
                      setPopupOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setPopupContent(
                          item.value !== undefined ? String(item.value) : "N/A"
                        );
                        setPopupOpen(true);
                      }
                    }}
                  >
                    {item.value}
                  </dd>
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* Drug Detail Section */}
        <section aria-labelledby="drug-details-heading">
          <h2
            id="drug-details-heading"
            className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-3"
          >
            <CreditCard className="h-4 w-4 text-blue-500 dark:text-blue-300" />
            Drug Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <CreditCard className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                ),
                label: "Insurance Pay",
                value: drugDetail?.insurancePayment ?? "NA",
              },
              {
                icon: (
                  <User className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                ),
                label: "Patient Pay",
                value: drugDetail?.patientPayment ?? 0,
              },
              {
                icon: (
                  <Package className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                ),
                label: "Quantity",
                value: "NA",
              },
            ].map((item, idx) => (
              <div
                key={item.label}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded shadow-sm min-w-0"
              >
                {item.icon}
                <dl className="min-w-0">
                  <dt className="text-xs text-gray-500 truncate">
                    {item.label}
                  </dt>
                  <dd
                    className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px] cursor-pointer"
                    title={
                      item.value !== undefined ? String(item.value) : undefined
                    }
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPopupContent(
                        item.value !== undefined ? String(item.value) : "N/A"
                      );
                      setPopupOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setPopupContent(
                          item.value !== undefined ? String(item.value) : "N/A"
                        );
                        setPopupOpen(true);
                      }
                    }}
                  >
                    {item.value}
                  </dd>
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* Drug Medi Section */}
        {drugMedi && (
          <section>
            <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                  Drug Medical Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  {
                    icon: (
                      <FileText className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                    ),
                    label: "Prior Authorization",
                    value: drugMedi.priorAuthorization,
                  },
                  {
                    icon: (
                      <Clock className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                    ),
                    label: "Extended Duration",
                    value: drugMedi.extendedDuration,
                  },
                  {
                    icon: (
                      <Wallet className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                    ),
                    label: "Cost Ceiling Tier",
                    value: drugMedi.costCeilingTier,
                  },
                  {
                    icon: (
                      <ShieldCheck className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                    ),
                    label: "Non-Capitated Indicator",
                    value: drugMedi.nonCapitatedDrugIndicator,
                  },
                  {
                    icon: (
                      <UserCheck className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                    ),
                    label: "CCS Panel Authority",
                    value: drugMedi.ccsPanelAuthority,
                  },
                ].map((item, idx) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded shadow p-2 min-w-0"
                  >
                    {item.icon}
                    <div className="min-w-0">
                      <span className="block text-xs text-gray-500 dark:text-gray-400 font-semibold truncate">
                        {item.label}
                      </span>
                      <span
                        className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px] cursor-pointer"
                        title={item.value}
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopupContent(
                            item.value !== undefined
                              ? String(item.value)
                              : "N/A"
                          );
                          setPopupOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setPopupContent(
                              item.value !== undefined
                                ? String(item.value)
                                : "N/A"
                            );
                            setPopupOpen(true);
                          }
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Insurance Details Section */}
        <section className="mt-6">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-3">
            <Building className="h-4 w-4 text-blue-500 dark:text-blue-300" />
            Insurance Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <Building className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                ),
                label: "BIN",
                value: drugDetail?.bin
                  ? `${drugDetail.binFullName} - ${drugDetail.bin}`
                  : "NA",
              },
              {
                icon: (
                  <FileText className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                ),
                label: "PCN",
                value: drugDetail?.pcn ?? "NA",
              },
              {
                icon: (
                  <Activity className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                ),
                label: "RXGroup",
                value: drugDetail?.rxgroup ?? "NA",
              },
            ].map((item, idx) => (
              <div
                key={item.label}
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded min-w-0"
              >
                {item.icon}
                <dl className="min-w-0">
                  <dt className="text-xs text-gray-500 truncate">
                    {item.label}
                  </dt>
                  <dd
                    className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px] cursor-pointer"
                    title={item.value}
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPopupContent(
                        item.value !== undefined ? String(item.value) : "N/A"
                      );
                      setPopupOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setPopupContent(
                          item.value !== undefined ? String(item.value) : "N/A"
                        );
                        setPopupOpen(true);
                      }
                    }}
                  >
                    {item.value}
                  </dd>
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* Show Details Button */}
        <div className="mt-6 flex justify-center sm:justify-end">
          <button
            onClick={() => setShowDetails(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition text-sm"
            aria-label="Show more drug details"
          >
            <Eye className="h-4 w-4" />
            Show Details
          </button>
        </div>
      </section>
    </div>
  );
};

interface AlternativesTableProps {
  alternatives: Prescription[];
  classNameStr?: string;
  padCode: (code: string) => string;
  selectedInsurance: string;
  handleInsuranceFilterChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  uniqueInsuranceNames: string[];
  selectedBin: string;
  handleBinFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  uniqueBinValues: { bin: string; binFullName: string }[];
  selectedPcn: string;
  handlePcnFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  uniquePcnValues: string[];
  handleSort: () => void;
  sortOrder: "asc" | "desc";
  setBestNetDrug: (drug: Prescription) => void;
}

export const AlternativesTable: React.FC<AlternativesTableProps> = ({
  alternatives,
  classNameStr = "",
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
  setBestNetDrug,
}) => {
  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalDrug, setModalDrug] = useState<Prescription | null>(null);

  // Filter and pagination logic
  const filtered = useMemo(() => {
    const result = alternatives.filter(
      (alt) =>
        (!selectedInsurance || alt.insuranceName === selectedInsurance) &&
        (!selectedBin || alt.bin === selectedBin) &&
        (!selectedPcn || alt.pcn === selectedPcn)
    );
    return result.length > 0 ? result : alternatives;
  }, [alternatives, selectedInsurance, selectedBin, selectedPcn]);

  // setBestNetDrug(filtered[0]);
  useEffect(() => {
    if (filtered.length > 0) {
      setBestNetDrug(filtered[0]);
    }
  }, [filtered, setBestNetDrug]);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);
  const { addToCart, cartItems } = useCart();

  useEffect(
    () => setPage(1),
    [selectedInsurance, selectedBin, selectedPcn, alternatives]
  );

  // Handlers
  const openModal = (drug: Prescription) => {
    setModalDrug(drug);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalDrug(null);
  };

  return (
    <section
      className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 ${classNameStr}`}
    >
      {/* Modal */}
      {showModal && modalDrug && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 mt-18">
          {/* Animated gradient backdrop */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-gray-900/20 backdrop-blur-lg animate-gradientBackground" />
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
              onClick={closeModal}
            />
          </div>

          {/* Modal card with 3D effect */}
          <div className="relative w-137">
            ` {/* Floating card shadow */}
            <div className="absolute -inset-2 bg-blue-500/10 rounded-2xl blur-xl opacity-70 animate-float" />
            {/* Main card */}
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 dark:border-gray-700/50 overflow-hidden transform transition-all duration-500 will-change-transform animate-cardEntry">
              {/* Dynamic status indicator */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 animate-pulse-slow" />

              {/* Header with contextual icon */}
              <div className="px-6 py-4 flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-300">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                      {modalDrug.drugName}
                    </h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                        {modalDrug.drugClass}
                      </span>
                      <a
                        href={`https://ndclist.com/ndc/${padCode(
                          modalDrug.ndcCode
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                      >
                        {padCode(modalDrug.ndcCode)}
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 -m-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content with scrollable area */}
              <div className="px-6 pb-2 max-h-[60vh] overflow-y-auto custom-scrollbar-ultra">
                {/* Animated price indicator */}
                <div className="mb-6 px-4 py-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-700/30 dark:to-gray-700/20 rounded-xl border border-gray-200/30 dark:border-gray-700/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-10 dark:opacity-5" />
                  <div className="relative flex justify-between items-center">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Net Price
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        ${modalDrug.net.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Acquisition Cost
                      </p>
                      <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mt-1">
                        ${modalDrug.acquisitionCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/20 border border-gray-200/30 dark:border-gray-700/30">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Branch
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1.5">
                      {modalDrug.branchName}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/20 border border-gray-200/30 dark:border-gray-700/30">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Drug Class
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1.5">
                      {modalDrug.drugClass}
                    </p>
                  </div>
                  {/* <div className="p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/20 border border-gray-200/30 dark:border-gray-700/30">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Last Updated
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1.5">
                      Just now
                    </p>
                  </div> */}
                  <div className="p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/20 border border-gray-200/30 dark:border-gray-700/30">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                      Inventory
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1.5">
                      In Stock
                    </p>
                  </div>
                </div>

                {/* Alternatives section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      <BookCheck />
                      Recommended Alternatives
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {pageItems.map((alt, index) => {
                      // Determine row background color based on rank
                      let rowBgClass = "";
                      if (sortOrder === "desc") {
                        if (index === 0) {
                          rowBgClass = "bg-green-100 dark:bg-green-800"; // Most recommended
                        } else if (index === 1) {
                          rowBgClass = "bg-yellow-100 dark:bg-yellow-800"; // Semi-recommended
                        }
                      } else if (sortOrder === "asc") {
                        if (index === 0) {
                          rowBgClass = "bg-red-100 dark:bg-red-800"; // Least recommended
                        } else if (index === 1) {
                          rowBgClass = "bg-orange-100 dark:bg-orange-800"; // Second least recommended
                        }
                      }

                      return (
                        <div
                          key={index}
                          className={`group relative p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/30 hover:border-blue-300/50 dark:hover:border-blue-500/30 transition-all duration-200 cursor-pointer hover:shadow-sm ${rowBgClass}`}
                        >
                          <a
                            href={`/drug/${alt.drugId}?ndc=${alt.ndcCode}&insuranceId=${alt.rxgroupId}`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`mt-0.5 flex-shrink-0 w-2.5 h-2.5 rounded-full ${
                                    index === 0
                                      ? "bg-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-400/30"
                                      : index === 1
                                      ? "bg-blue-400 ring-1 ring-blue-200 dark:ring-blue-400/30"
                                      : "bg-purple-400 ring-1 ring-purple-200 dark:ring-purple-400/30"
                                  }`}
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {alt.drugName}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {alt.drugClass}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {padCode(alt.ndcCode)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-700 dark:text-white ">
                                  ${alt.net}
                                </p>
                              </div>
                            </div>
                            <button className="absolute right-3 top-3 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-blue-500">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer with contextual actions */}
              <div className="px-6 py-4 bg-gray-50/70 dark:bg-gray-700/30 border-t border-gray-200/30 dark:border-gray-700/30 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Prices updated according to the last scripts
                  </span>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    Close
                  </button>

                  {cartItems.some((item) => item.id === modalDrug.ndcCode) ? (
                    <button
                      disabled
                      className="px-4 py-2 text-sm font-medium text-white bg-emerald-500/90 rounded-lg flex items-center space-x-1.5 cursor-not-allowed"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Added</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addToCart({
                          id:
                            modalDrug.ndcCode || `${modalDrug.drugId}-uniqueId`,
                          name: modalDrug.drugName || "Unnamed Drug",
                          ndc: padCode(modalDrug.ndcCode),
                          acq: modalDrug.acquisitionCost,
                          insurancePayment: modalDrug.insurancePayment,
                          patientPayment: modalDrug.patientPayment,
                          price: modalDrug.net,
                          quantity: 1,
                          insurance: modalDrug.rxgroup || "Unknown",
                        });
                        const storedSearchLog =
                          localStorage.getItem("searchLogDetails");
                        if (storedSearchLog) {
                          const searchLog: SearchLog =
                            JSON.parse(storedSearchLog);
                          const newOrderItem: OrderItem = {
                            drugId: modalDrug.drugId,
                            netPrice: modalDrug?.net ?? 0,
                            patientPay: modalDrug?.patientPayment ?? 0,
                            insurancePay: modalDrug?.insurancePayment ?? 0,
                            acquisitionCost: modalDrug.acquisitionCost,
                            additionalCost: 0,
                            insuranceRxId: modalDrug?.rxgroupId ?? 0,
                            amount: 1,
                          };

                          const currentOrder = JSON.parse(
                            localStorage.getItem("orderRequestBody") ||
                              '{"orderItems":[],"searchLogs":[]}'
                          );
                          currentOrder.orderItems.push(newOrderItem);
                          currentOrder.searchLogs.push(searchLog);
                          localStorage.setItem(
                            "orderRequestBody",
                            JSON.stringify(currentOrder)
                          );
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] flex items-center space-x-1.5"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          drug alternatives with reimbursement and copay details for a selected
          insurance plan
        </h2>
      </header>

      {/* Filters & Controls omitted for brevity, keep existing JSX here */}

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="insuranceFilter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            RxGroups
          </label>
          <select
            id="insuranceFilter"
            value={selectedInsurance}
            onChange={handleInsuranceFilterChange}
            className="w-full border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All RxGroups</option>
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
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            BIN
          </label>
          <select
            id="binFilter"
            value={selectedBin}
            onChange={handleBinFilterChange}
            className="w-full border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All BINs</option>
            {uniqueBinValues.map(({ bin, binFullName }) => (
              <option key={bin} value={bin}>
                {binFullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="pcnFilter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            PCN
          </label>
          <select
            id="pcnFilter"
            value={selectedPcn}
            onChange={handlePcnFilterChange}
            className="w-full border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All PCNs</option>
            {uniquePcnValues.map((pcn) => (
              <option key={pcn} value={pcn}>
                {pcn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort & Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <button
          onClick={handleSort}
          className="mb-2 md:mb-0 inline-flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ minWidth: "44px", minHeight: "44px" }} // Ensure minimum size
        >
          Sort by Net Price (
          {sortOrder === "asc" ? "Low to High" : "High to Low"})
        </button>
        {totalPages > 1 && (
          <div className="inline-flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? "bg-gray-200 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              }`}
            >
              Prev
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${
                page === totalPages
                  ? "bg-gray-200 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {[
                "Name",
                "Class",
                "NDC",
                "Form",
                "Strength",
                "Ingredient",
                "Route",
                "TE Code",
                "Market Status",
                "Net Price",
                "Coverage",
                "Patient Pay",
                "ACQ",
                "Branch Name",
                "Rx Group",
                "BIN",
                "Insurance",
                "PCN",
                "Date",
                "Details",
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {pageItems.map((rec, idx) => {
              // Determine row background color based on rank
              let rowBgClass = "";
              if (sortOrder === "desc") {
                if (idx === 0) {
                  rowBgClass = "bg-green-100 dark:bg-green-800"; // Most recommended
                } else if (idx === 1) {
                  rowBgClass = "bg-yellow-100 dark:bg-yellow-800"; // Semi-recommended
                }
              } else if (sortOrder === "asc") {
                if (idx === 0) {
                  rowBgClass = "bg-red-100 dark:bg-red-800"; // Least recommended
                } else if (idx === 1) {
                  rowBgClass = "bg-orange-100 dark:bg-orange-800"; // Second least recommended
                }
              }
              return (
                <tr
                  key={idx}
                  className={`hover:bg-gray-200 dark:hover:bg-gray-600 ${rowBgClass}`}
                >
                  <td className="px-4 py-2">
                    <a
                      href={`/drug/${rec.drugId}?ndc=${rec.ndcCode}&insuranceId=${rec.rxgroupId}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                    >
                      {rec.drugName}
                    </a>
                  </td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-100">
                    {rec.drugClass}
                  </td>

                  <td className="px-4 py-2 font-mono">
                    <a
                      href={`https://ndclist.com/ndc/${padCode(rec.ndcCode)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                    >
                      {padCode(rec.ndcCode)}
                    </a>
                  </td>

                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {rec.form || "NA"}
                  </td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {rec.strength
                      ? `${rec.strength} ${rec.strengthUnit || ""}`
                      : "NA"}
                  </td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {rec.ingrdient || "NA"}
                  </td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {rec.route || "NA"}
                  </td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {rec.teCode || "NA"}
                  </td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {rec.type || "NA"}
                  </td>
                  <td className="px-4 py-2 text-green-700 dark:text-green-400">
                    ${rec.net.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-green-700 dark:text-green-400">
                    ${rec.insurancePayment.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-green-700 dark:text-green-400">
                    ${rec.patientPayment.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-red-500 dark:text-red-400">
                    ${rec.acquisitionCost.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-100">
                    {rec.branchName}
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={`/InsuranceDetails/${rec.rxgroupId}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                    >
                      {rec.insuranceName}
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={`/InsuranceBINDetails/${rec.binId}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                    >
                      {rec.bin}
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={`/InsuranceBINDetails/${rec.binId}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                    >
                      {rec.binFullName}
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={`/InsurancePCNDetails/${rec.pcnId}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                    >
                      {rec.pcn}
                    </a>
                  </td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {new Date(rec.date).toISOString().split("T")[0]}
                  </td>
                  {/* Add to Cart Button */}

                  {/* ...other td cells... */}
                  <td key={idx} className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => openModal(rec)}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
  uniqueBinValues: { bin: string; binFullName: string }[];
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredBranchDrugs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBranchDrugs.slice(
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
    <section className="rounded-lg shadow-lg dark:bg-gray-800 bg-white p-6 transition-all duration-200">
      <div className="flex items-center gap-2 mb-4">
        <Repeat className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Branch Drugs
        </h2>
      </div>

      {/* Filters Section */}
      <div className="rounded-lg p-4 mb-6 dark:bg-gray-700 bg-gray-50">
        <div className="flex flex-wrap gap-4">
          <div>
            <label
              htmlFor="branchInsuranceFilter"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Filter by Rx Group
            </label>
            <select
              id="branchInsuranceFilter"
              value={selectedInsurance}
              onChange={handleInsuranceFilterChange}
              className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset dark:bg-gray-600 dark:ring-gray-500 dark:text-white bg-white ring-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500`}
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
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Filter by BIN
            </label>
            <select
              id="branchBinFilter"
              value={selectedBin}
              onChange={handleBinFilterChange}
              className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset dark:bg-gray-600 dark:ring-gray-500 dark:text-white bg-white ring-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">All</option>
              {uniqueBinValues.map(({ bin, binFullName }) => (
                <option key={bin} value={bin}>
                  {bin} - {binFullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="branchPcnFilter"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Filter by PCN
            </label>
            <select
              id="branchPcnFilter"
              value={selectedPcn}
              onChange={handlePcnFilterChange}
              className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset dark:bg-gray-600 dark:ring-gray-500 dark:text-white bg-white ring-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500`}
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border dark:border-gray-700 border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700 transition-colors duration-200">
            <tr>
              {[
                "Name",
                "Class",
                "Branch",
                "NDC Codes",
                "Rx Group",
                "BIN",
                "Insurance Name",
                "PCN",
                "Net Price",
                "Insurance Coverage",
                "Patient Pay",
                "Quantity",
                "ACQ",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider sticky top-0 bg-inherit backdrop-blur-sm backdrop-filter"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((alt, index) => (
              <tr
                key={`${alt.ndcCode}-${index}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  <a
                    href={`/drug/${alt.drugId}?ndc=${alt.ndcCode}&insuranceId=${alt.rxgroupId}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition duration-200"
                  >
                    {alt.drugName}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {alt.drugClass}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {alt.branchName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  <a
                    href={`https://ndclist.com/ndc/${padCode(alt.ndcCode)}`}
                    className="text-blue-500 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {padCode(alt.ndcCode)}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  <a
                    href={`/InsuranceDetails/${alt.rxgroupId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition duration-200"
                  >
                    {alt.insuranceName}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  <a
                    href={`/InsuranceBINDetails/${alt.binId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition duration-200"
                  >
                    {alt.bin}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`/InsuranceBINDetails/${alt.binId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition duration-200"
                  >
                    {alt.binFullName}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  <a
                    href={`/InsurancePCNDetails/${alt.pcnId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition duration-200"
                  >
                    {alt.pcn}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600 dark:text-green-400">
                  {alt.insuranceName ? "$" + alt.net.toFixed(2) : "NA"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600 dark:text-green-400">
                  {alt.insuranceName
                    ? "$" + alt.insurancePayment.toFixed(2)
                    : "NA"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600 dark:text-green-400">
                  {alt.insuranceName
                    ? "$" + alt.patientPayment.toFixed(2)
                    : "NA"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-900 dark:text-gray-100">
                  NA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                  ${alt.acquisitionCost.toFixed(2)}
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
                ? "bg-gray-300 dark:bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 dark:bg-blue-700 text-white"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 dark:bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 dark:bg-blue-700 text-white"
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
  uniqueBinValues: { bin: string; binFullName: string }[];
  selectedPcn: string;
  handlePcnFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  uniquePcnValues: string[];
}
interface OtherAlternativesTablePropsV2 {
  alternatives: Drug[];
  classNameStr: string;
  padCode: (code: string) => string;
  selectedBin: string;
  handleBinFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  uniqueBinValues: { bin: string; binFullName: string }[];
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
  const [searchNdc, setSearchNdc] = useState("");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // ...inside DrugInformation component...
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState<string | null>(null);
  // Filter alternatives based on search inputs and selected filters
  const filteredAlternatives = useMemo(() => {
    return alternatives.filter(
      (alt) =>
        (!selectedBin || alt.bin === selectedBin) &&
        (!selectedPcn || alt.pcn === selectedPcn) &&
        (!searchNdc ||
          alt.ndcCode?.toLowerCase().includes(searchNdc.toLowerCase())) &&
        (!searchName ||
          alt.drugName?.toLowerCase().includes(searchName.toLowerCase()))
    );
  }, [alternatives, selectedBin, selectedPcn, searchNdc, searchName]);

  const totalPages = Math.ceil(filteredAlternatives.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAlternatives.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBin, selectedPcn, searchNdc, searchName, alternatives]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <section className="mt-8">
      {popupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-w-[260px] max-w-xs max-h-[80vh] flex flex-col">
            <div
              className="mb-4 text-gray-900 dark:text-gray-100 break-words overflow-y-auto"
              style={{ maxHeight: "50vh" }}
            >
              {popupContent}
            </div>
            <button
              onClick={() => setPopupOpen(false)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        drug alternatives without available selected insurance plan data
      </h3>

      {/* Search Inputs */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NDC Search */}
        <div className="flex flex-col">
          <label
            htmlFor="searchNdc"
            className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Search by NDC
          </label>
          <input
            id="searchNdc"
            type="text"
            value={searchNdc}
            onChange={(e) => setSearchNdc(e.target.value)}
            placeholder="Enter NDC code"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Name Search */}
        <div className="flex flex-col">
          <label
            htmlFor="searchName"
            className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Search by Name
          </label>
          <input
            id="searchName"
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter drug name"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg dark:bg-gray-800 bg-white mt-4 border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {[
                "Name",
                "Class",
                "NDC Codes",
                "Form",
                "Strength",
                "Ingredient",
                "Route",
                "TE Code",
                "Market Status",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((alt, index) => (
              <tr
                key={`${alt.ndcCode}-${index}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap max-w-[160px]">
                  <div
                    className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate cursor-pointer"
                    title={alt.drugName || "N/A"}
                    tabIndex={0}
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    //   setPopupContent(
                    //     alt.drugName !== undefined ? String(alt.drugName) : "N/A"
                    //   );
                    //   setPopupOpen(true);
                    // }}
                    // onKeyDown={(e) => {
                    //   if (e.key === "Enter" || e.key === " ") {
                    //     setPopupContent(
                    //       alt.drugName !== undefined ? String(alt.drugName) : "N/A"
                    //     );
                    //     setPopupOpen(true);
                    //   }
                    // }}
                  >
                    <a
                      href={`/drug/${alt.drugId}?ndc=${alt.ndcCode}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition duration-200"
                      tabIndex={-1}
                    >
                      {alt.drugName ? alt.drugName : "N/A"}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-[120px]">
                  <div
                    className="text-sm text-gray-500 dark:text-gray-300 truncate cursor-pointer"
                    title={alt.drugClass || "N/A"}
                    tabIndex={0}
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    //   setPopupContent(
                    //     alt.drugName !== undefined ? String(alt.drugClass) : "N/A"
                    //   );
                    //   setPopupOpen(true);
                    // }}
                    // onKeyDown={(e) => {
                    //   if (e.key === "Enter" || e.key === " ") {
                    //     setPopupContent(
                    //       alt.drugClass !== undefined ? String(alt.drugClass) : "N/A"
                    //     );
                    //     setPopupOpen(true);
                    //   }
                    // }}
                  >
                    {alt.drugClass ? alt.drugClass : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-[120px]">
                  <div
                    className="text-sm text-gray-500 dark:text-gray-300 truncate cursor-pointer"
                    title={padCode(alt.ndcCode)}
                    tabIndex={0}
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    //   setPopupContent(
                    //     alt.ndcCode !== undefined ? String(alt.ndcCode) : "N/A"
                    //   );
                    //   setPopupOpen(true);
                    // }}
                    // onKeyDown={(e) => {
                    //   if (e.key === "Enter" || e.key === " ") {
                    //     setPopupContent(
                    //       alt.ndcCode !== undefined ? String(alt.ndcCode) : "N/A"
                    //     );
                    //     setPopupOpen(true);
                    //   }
                    // }}
                  >
                    <a
                      href={`https://ndclist.com/ndc/${padCode(alt.ndcCode)}`}
                      className="text-blue-500 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={-1}
                    >
                      {padCode(alt.ndcCode)}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-[120px]">
                  <div
                    className="text-sm text-gray-500 dark:text-gray-300 truncate cursor-pointer"
                    title={alt.form || "N/A"}
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(alt.form || "N/A");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        alert(alt.form || "N/A");
                      }
                    }}
                  >
                    {alt.form ? alt.form : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-[100px]">
                  <div
                    className="text-sm text-gray-500 dark:text-gray-300 truncate cursor-pointer"
                    title={alt.strength || "N/A"}
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(alt.strength || "N/A");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        alert(alt.strength || "N/A");
                      }
                    }}
                  >
                    {alt.strength ? alt.strength + alt.strengthUnit : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-[120px]">
                  <div
                    className="text-sm text-gray-500 dark:text-gray-300 truncate cursor-pointer"
                    title={alt.ingrdient || "N/A"}
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(alt.ingrdient || "N/A");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        alert(alt.ingrdient || "N/A");
                      }
                    }}
                  >
                    {alt.ingrdient ? alt.ingrdient : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-[100px]">
                  <div
                    className="text-sm text-gray-500 dark:text-gray-300 truncate cursor-pointer"
                    title={alt.route || "N/A"}
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(alt.route || "N/A");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        alert(alt.route || "N/A");
                      }
                    }}
                  >
                    {alt.route ? alt.route : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-[100px]">
                  <div
                    className="text-sm text-gray-500 dark:text-gray-300 truncate cursor-pointer"
                    title={alt.teCode !== "" ? alt.teCode : "N/A"}
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(alt.teCode !== "" ? alt.teCode : "N/A");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        alert(alt.teCode !== "" ? alt.teCode : "N/A");
                      }
                    }}
                  >
                    {alt.teCode !== "" ? alt.teCode : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-[100px]">
                  <div
                    className="text-sm text-gray-500 dark:text-gray-300 truncate cursor-pointer"
                    title={alt.type !== "" ? alt.type : "N/A"}
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(alt.type !== "" ? alt.type : "N/A");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        alert(alt.type !== "" ? alt.type : "N/A");
                      }
                    }}
                  >
                    {alt.type !== "" ? alt.type : "N/A"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md transition ${
              currentPage === 1
                ? "bg-gray-300 dark:bg-gray-500 cursor-not-allowed text-gray-600 dark:text-gray-200"
                : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md transition ${
              currentPage === totalPages
                ? "bg-gray-300 dark:bg-gray-500 cursor-not-allowed text-gray-600 dark:text-gray-200"
                : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

const OtherAlternativesTableV2: React.FC<OtherAlternativesTablePropsV2> = ({
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchNdc, setSearchNdc] = useState("");
  const [searchName, setSearchName] = useState("");

  const itemsPerPage = 10;

  // ✅ Apply search filters
  const filteredAlternatives = alternatives.filter((alt) => {
    const ndcMatch = searchNdc
      ? alt.ndc.toLowerCase().includes(searchNdc.toLowerCase())
      : true;
    const nameMatch = searchName
      ? alt.name?.toLowerCase().includes(searchName.toLowerCase())
      : true;
    return ndcMatch && nameMatch;
  });

  const totalPages = Math.ceil(filteredAlternatives.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAlternatives.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchNdc, searchName, selectedBin, selectedPcn, alternatives]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Suggested Alternative Drugs Without Available Insurance Price Data
      </h3>

      {/* Search Inputs */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label
            htmlFor="searchNdc"
            className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Search by NDC
          </label>
          <input
            id="searchNdc"
            type="text"
            value={searchNdc}
            onChange={(e) => setSearchNdc(e.target.value)}
            placeholder="Enter NDC code"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="searchName"
            className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Search by Name
          </label>
          <input
            id="searchName"
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter drug name"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg dark:bg-gray-800 bg-white mt-4 border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {[
                "Name",
                "Form",
                "Strength",
                "Ingredient",
                "Route",
                "TE Code",
                "Market Status",
                "Strength Unit",
                "NDC Codes",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((alt, index) => (
              <tr
                key={`${alt.ndc}-${index}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`/drug/${alt.id}?ndc=${alt.ndc}`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition"
                  >
                    {alt.name || "N/A"}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {alt.form || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {alt.strength || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {alt.ingrdient || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {alt.route || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {alt.teCode || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {alt.type || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {alt.strengthUnit || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  <a
                    href={`https://ndclist.com/ndc/${padCode(alt.ndc)}`}
                    className="text-blue-500 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {padCode(alt.ndc)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md transition ${
              currentPage === 1
                ? "bg-gray-300 dark:bg-gray-500 cursor-not-allowed text-gray-600 dark:text-gray-200"
                : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md transition ${
              currentPage === totalPages
                ? "bg-gray-300 dark:bg-gray-500 cursor-not-allowed text-gray-600 dark:text-gray-200"
                : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700"
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
  const [sortedAlternativesV2, setSortedAlternativesV2] = useState<Drug[]>([]);
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
  const [bestNetDrug, setBestNetDrug] = useState<Prescription | null>(null);
  // activeTable state controls which table is shown: "insurance" or "branch"
  const [activeTable, setActiveTable] = useState<"insurance" | "branch">(
    "insurance"
  );
  const [alternativesSortOrder, setAlternativesSortOrder] = useState<
    "asc" | "desc"
  >("desc");
  const [temp, setTemp] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // With a single state:
  const [classVersion, setClassVersion] = useState<1 | 2 | 3>(1);

  // Helper booleans for compatibility with existing logic:
  const classV1 = classVersion === 1;
  const classV2 = classVersion === 2;
  const classV3 = classVersion === 3;

  const [drugmedi, setDrugmedi] = useState<DrugMedi[]>([]);
  const [drugDeatilsMedi, setDrugDeatilsMedi] = useState<DrugMedi>();
  const [mediToggle, setMediToggle] = useState(false);
  const [showAlternativesTable, setShowAlternativesTable] = useState(false);
  const [showClassLoader, setShowClassLoader] = useState(false);

  // Fetch drug details and alternatives
  useEffect(() => {
    const fetchDrugDetails = async () => {
      try {
        let response2;
        if (!insuranceId) {
          let response;
          if (ndcCode) {
            response = await axiosInstance.get(
              `/drug/SearchByNdc?ndc=${ndcCode}`
            );
          } else {
            response = await axiosInstance.get(
              `/drug/GetDrugById?id=${drugId}`
            );
          }
          setDrug(response.data);
          // const mediResponse = await axiosInstance.get(
          //   `/drug/GetAllMediDrugs?classId=${response.data?.drugClassId}`
          // );
          // setDrugmedi(mediResponse.data);
          // setDrugDeatilsMedi(
          //   mediResponse.data.find((item: DrugMedi) => item.drugNDC === ndcCode)
          // );
          // Get all alternatives and sort descending by net price:
          if (classV1 === true) {
            response2 = await axiosInstance.get(
              `/drug/GetAllDrugs?classId=${response.data.drugClassId}`
            );
            console.log("response2: ", response2.data);

            const sortedData = response2.data
              .sort((a: Prescription, b: Prescription) => b.net - a.net)
              .filter((alt: Prescription) => alt.type !== "DISCN");

            setSortedAlternatives(sortedData);
          } else if (classV2 === true) {
            response2 = await axiosInstance.get(
              `/drug/GetAllDrugsV2?classId=${response.data.drugClassV2Id}`
            );
            console.log("response2z2: ", response2.data);

            const sortedData = response2.data
              .sort((a: Prescription, b: Prescription) => b.net - a.net)
              .filter((alt: Prescription) => alt.type !== "DISCN");

            setSortedAlternatives(sortedData);
          } else if (classV3 === true) {
            response2 = await axiosInstance.get(
              `/drug/GetAllDrugsV3?classId=${response.data.drugClassV3Id}`
            );
            console.log("response2zzz: ", response2.data);

            const sortedData = response2.data
              .sort((a: Prescription, b: Prescription) => b.net - a.net)
              .filter((alt: Prescription) => alt.type !== "DISCN");

            setSortedAlternatives(sortedData);
          } else {
            response2 = await axiosInstance.get(
              `/drug/GetAllDrugsV2?classId=${response.data.drugClassV2Id}`
            );
            console.log("response2V2: ", response2.data);
            const sortedData = response2.data;
            setSortedAlternativesV2(sortedData);
          }
          const response10 = await axiosInstance.get(
            `/drug/GetAlternativesByClassIdBranchId?classId=${response.data.drugClassId}`
          );
          setBranchDrugs(response10.data);
          const response3 = await axiosInstance.get(
            `/drug/GetClassById?id=${response.data.drugClassId}`
          );
          setClassName(response3.data.name);
        } else {
          // If an insuranceId is provided:
          const response = await axiosInstance.get(
            `/drug/SearchByNdc?ndc=${ndcCode}`
          );
          const drugData = response.data;
          console.log(drugData);
          setDrug(drugData);
          response2 = await axiosInstance.get(
            `/drug/GetDetails?ndc=${ndcCode}&insuranceId=${insuranceId}`
          );

          const mediResponse = await axiosInstance.get(
            `/drug/GetAllMediDrugs?classId=${response.data?.drugClassId}`
          );
          setDrugmedi(mediResponse.data);
          setDrugDeatilsMedi(
            mediResponse.data.find((item: DrugMedi) => item.drugNDC === ndcCode)
          );

          console.log("sadasd:  ", response2.data);
          const response3 = await axiosInstance.get(
            `/drug/GetClassById?id=${response.data.drugClassId}`
          );
          setClassName(response3.data.name);
          const response10 = await axiosInstance.get(
            `/drug/GetAlternativesByClassIdBranchId?classId=${response.data.drugClassId}`
          );
          setDrugDetail(response2.data);
          setBranchDrugs(response10.data);
          if (response3.data.name !== "other") {
            console.log("state : ", classV1, " : ", classV2, " : ", classV3);
            let response4;
            if (classV1 === true) {
              response4 = await axiosInstance.get(
                `/drug/GetAllDrugs?classId=${response.data.drugClassId}`
              );
              console.log("response4: ", response4.data);

              const matchingAlt = response4.data.find(
                (alt: Prescription) =>
                  alt.insuranceId.toString() === insuranceId
              );
              setBranchSelectedInsurance(matchingAlt?.insuranceName || "");
              const sortedData = response4.data
                .sort((a: Prescription, b: Prescription) => {
                  if (b.net !== a.net) {
                    return b.net - a.net;
                  }
                  return b.insurancePayment - a.insurancePayment;
                })
                .filter((alt: Prescription) => alt.type !== "DISCN");
              setSortedAlternatives(sortedData);
              setSortedAlternatives(sortedData);
              console.log("sortedData", sortedData);
            } else if (classV2 === true) {
              response4 = await axiosInstance.get(
                `/drug/GetAllDrugsV2?classId=${response.data.drugClassV2Id}`
              );
              console.log("response4z22: ", response4.data);

              const matchingAlt = response4.data.find(
                (alt: Prescription) =>
                  alt.insuranceId.toString() === insuranceId
              );

              setBranchSelectedInsurance(matchingAlt?.insuranceName || "");
              const sortedData = response4.data
                .sort((a: Prescription, b: Prescription) => {
                  if (b.net !== a.net) {
                    return b.net - a.net;
                  }
                  return b.insurancePayment - a.insurancePayment;
                })
                .filter((alt: Prescription) => alt.type !== "DISCN");
              setSortedAlternatives(sortedData);
              setSortedAlternatives(sortedData);
              console.log("sortedData", sortedData);
            } else if (classV3 === true) {
              response4 = await axiosInstance.get(
                `/drug/GetAllDrugsV3?classId=${response.data.drugClassV3Id}`
              );
              console.log("response4zzzz: ", response4.data);

              const matchingAlt = response4.data.find(
                (alt: Prescription) =>
                  alt.insuranceId.toString() === insuranceId
              );

              setBranchSelectedInsurance(matchingAlt?.insuranceName || "");
              const sortedData = response4.data
                .sort((a: Prescription, b: Prescription) => {
                  if (b.net !== a.net) {
                    return b.net - a.net;
                  }
                  return b.insurancePayment - a.insurancePayment;
                })
                .filter((alt: Prescription) => alt.type !== "DISCN");
              setSortedAlternatives(sortedData);
              setSortedAlternatives(sortedData);
              console.log("sortedData", sortedData);
            } else {
              response4 = await axiosInstance.get(
                `/drug/GetAllDrugsV2?classId=${response.data.drugClassV2Id}`
              );
              console.log("response2V2: ", response4.data);
              const sortedData = response4.data;
              setSortedAlternativesV2(sortedData);
            }
          } else {
            setSortedAlternatives([]);
          }
        }
      } catch (err) {
        setError("Failed to load drug details");
      } finally {
        setLoading(false);
        setShowClassLoader(false); // Hide loader after fetch
      }
    };

    fetchDrugDetails();
  }, [drugId, ndcCode, insuranceId, classVersion]);

  // Map the provided insuranceId to the insurance name using the sorted alternatives
  useEffect(() => {
    if (insuranceId && sortedAlternatives.length > 0) {
      const matchingInsurance = sortedAlternatives.find(
        (alt) => alt.insuranceId && alt.insuranceId.toString() === insuranceId
      );

      if (matchingInsurance) {
        localStorage.setItem("selectedRx", matchingInsurance.rxgroup || "");
        localStorage.setItem("selectedPcn", matchingInsurance.pcn || "");
        localStorage.setItem(
          "selectedBin",
          (matchingInsurance.bin || "") +
            " - " +
            (matchingInsurance.binFullName || "")
        );
        setSelectedInsurance(matchingInsurance.rxgroup || "");
        setSelectedBin(matchingInsurance.bin || "");
        setSelectedPcn(matchingInsurance.pcn || "");
        setBranchSelectedBin(matchingInsurance.bin || "");
        setBranchSelectedInsurance(matchingInsurance.rxgroup || "");
        setBranchSelectedPcn(matchingInsurance.pcn || "");
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
    (alt) => alt.rxgroup
  );
  const alternativesWithoutInsurance = sortedAlternatives.filter(
    (alt) => !alt.bin
  );
  const alternativesWithoutInsuranceV2 = sortedAlternativesV2;
  const uniqueInsuranceNames: string[] = [
    ...new Set(alternativesWithInsurance.map((alt) => alt.insuranceName)),
  ].sort();
  const uniqueBinValues = Array.from(
    alternativesWithInsurance.reduce((binMap, alt) => {
      if (!binMap.has(alt.bin)) {
        binMap.set(alt.bin, alt.binFullName);
      }
      return binMap;
    }, new Map<string, string>())
  ).map(([bin, binFullName]) => ({ bin, binFullName }));
  const uniquePcnValues: string[] = [
    ...new Set(alternativesWithInsurance.map((alt) => alt.pcn)),
  ].sort();

  const branchUniqueInsuranceNames: string[] = [
    ...new Set(branchDrugs.map((drug) => drug.insuranceName)),
  ].sort();
  const branchUniqueBinValues = Array.from(
    branchDrugs.reduce((binMap, drug) => {
      if (!binMap.has(drug.bin)) {
        binMap.set(drug.bin, drug.binFullName);
      }
      return binMap;
    }, new Map<string, string>())
  ).map(([bin, binFullName]) => ({ bin, binFullName }));
  const branchUniquePcnValues: string[] = [
    ...new Set(branchDrugs.map((drug) => drug.pcn)),
  ].sort();

  const uniqueOtherBinValues = Array.from(
    alternativesWithoutInsurance.reduce((binMap, alt) => {
      if (!binMap.has(alt.bin)) {
        binMap.set(alt.bin, alt.binFullName);
      }
      return binMap;
    }, new Map<string, string>())
  ).map(([bin, binFullName]) => ({ bin, binFullName }));
  const uniqueOtherPcnValues: string[] = [
    ...new Set(alternativesWithoutInsurance.map((alt) => alt.pcn)),
  ].sort();

  return (
    <motion.div>
      <div className="min-h-screen dark:bg-gray-900 bg-gray-100">
        <main
          role="main"
          className="bg-amber-25 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          {/* Header landmark */}
          <header>
            <DrugHeader
              drug={drug}
              padCode={padCode}
              temp={temp}
              drugClass={classNameStr}
            />
          </header>

          {/* Main content section */}
          <motion.section
            aria-label="Drug Information and Alternatives"
            className="p-6 space-y-6"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <DrugInformation
              drug={drug}
              drugDetail={drugDetail}
              classNameStr={classNameStr}
              bestDrugNet={bestNetDrug}
              drugMedi={drugDeatilsMedi ?? null}
              drugClass={classNameStr}
            />

            {activeTable === "insurance" ? (
              <section
                aria-label="Alternative Medications with Insurance"
                className="mt-6"
              >
                {sortedAlternatives.length > 0 && (
                  <div className="space-y-6">
                    {/* Button Group */}
                    <div className="flex flex-wrap gap-3 mb-2">
                      <button
                        onClick={() =>
                          setShowAlternativesTable((prev) => !prev)
                        }
                        className={`inline-flex items-center gap-2 px-5 py-2 rounded-md font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition
                        ${
                          showAlternativesTable
                            ? "bg-gray-200 dark:bg-gray-600 text-blue-700 dark:text-blue-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                            : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700"
                        }
                      `}
                      >
                        {showAlternativesTable
                          ? "Hide Insurance Alternative Table"
                          : "Show Insurance Alternative Table"}
                      </button>
                      <button
                        onClick={() =>
                          setShowOtherAlternatives((prev) => !prev)
                        }
                        className={`inline-flex items-center gap-2 px-5 py-2 rounded-md font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition
                        ${
                          showOtherAlternatives
                            ? "bg-gray-200 dark:bg-gray-600 text-blue-700 dark:text-blue-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                            : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700"
                        }
                      `}
                      >
                        {showOtherAlternatives
                          ? "Hide Other Alternatives"
                          : "Show Other Alternatives"}
                      </button>
                      <button
                        onClick={() => setMediToggle(!mediToggle)}
                        className={`inline-flex items-center gap-2 px-5 py-2 rounded-md font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition
                        ${
                          mediToggle
                            ? "bg-gray-200 dark:bg-gray-600 text-blue-700 dark:text-blue-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                            : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700"
                        }
                      `}
                      >
                        {mediToggle
                          ? "Hide Medi-Cal Section"
                          : "Show Medi-Cal Section"}
                      </button>
                      {insuranceId !== "615" && (
                        <div className="flex items-center gap-3">
                          <label
                            htmlFor="classVersionSelect"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Class Version
                          </label>
                          <select
                            id="classVersionSelect"
                            value={classVersion}
                            onChange={(e) => {
                              setShowClassLoader(true);
                              setClassVersion(
                                Number(e.target.value) as 1 | 2 | 3
                              );
                            }}
                            className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={1}>Class V1</option>
                            <option value={2}>Class V2</option>
                            <option value={3}>Class V3</option>
                          </select>
                        </div>
                      )}
                    </div>
                    {/* Insurance Alternatives Table */}
                    {showAlternativesTable && (
                      <AlternativesTable
                        alternatives={alternativesWithInsurance}
                        classNameStr={classNameStr}
                        padCode={padCode}
                        selectedInsurance={selectedInsurance}
                        handleInsuranceFilterChange={
                          handleInsuranceFilterChange
                        }
                        uniqueInsuranceNames={uniqueInsuranceNames}
                        selectedBin={selectedBin}
                        handleBinFilterChange={handleBinFilterChange}
                        uniqueBinValues={uniqueBinValues}
                        selectedPcn={selectedPcn}
                        handlePcnFilterChange={handlePcnFilterChange}
                        uniquePcnValues={uniquePcnValues}
                        handleSort={handleSort}
                        sortOrder={alternativesSortOrder}
                        setBestNetDrug={setBestNetDrug}
                      />
                    )}
                    {/* Other Alternatives Table */}
                    {showClassLoader && (
                      <div
                        className="fixed inset-0 z-[999] flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.25)" }}
                      >
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mb-4"></div>
                          <span className="text-gray-700 dark:text-gray-200">
                            Loading class alternatives...
                          </span>
                        </div>
                      </div>
                    )}
                    {showOtherAlternatives && (
                      <div className="space-y-4">
                        <section aria-label="Other Alternatives Without Insurance">
                          {(classV1 || classV2 || classV3) && (
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
                        </section>
                      </div>
                    )}
                    {/* Medi Section */}
                    {mediToggle && (
                      <div className="pt-4">
                        <DrugMediSection drugMedi={drugmedi} />
                      </div>
                    )}
                  </div>
                )}
              </section>
            ) : (
              <section aria-label="Branch Drugs">
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
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No branch drugs found
                  </p>
                )}
              </section>
            )}
          </motion.section>
        </main>
      </div>
    </motion.div>
  );
};

const padCode = (code: string | undefined): string => {
  if (!code) {
    return "N/A"; // Return a default value if code is undefined or null
  }
  return code.padStart(11, "0");
};
export default DrugDetails;
