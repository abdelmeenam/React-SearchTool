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
import { Drug, OrderItem, Prescription, SearchLog } from "../types";
import axiosInstance from "../api/axiosInstance";
import { useCart } from "../context/CartContext"; // adjust path
import DrugDetailsModal from "../components/drugDetails";

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
}
/* newwwwww comp */
// Removed duplicate declaration of DrugInformation to resolve the error.

export const DrugHeader: React.FC<DrugHeaderProps> = ({ drug, padCode }) => (
  <header className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-lg text-white flex items-center space-x-4">
    <Pill className="h-8 w-8" />
    <div>
      <h1 className="text-2xl font-bold">{drug.name}</h1>
      <a
        href={`https://ndclist.com/ndc/${padCode(drug.ndc)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-100 hover:underline"
      >
        NDC: {padCode(drug.ndc)}
      </a>
    </div>
  </header>
);

interface DrugInformationProps {
  drug: Drug;
  drugDetail?: Prescription | null;
  classNameStr: string;
  bestDrugNet: Prescription | null;
}
export const DrugInformation: React.FC<DrugInformationProps> = ({
  drug,
  drugDetail,
  bestDrugNet,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const net = drugDetail?.net ?? 0;
  const netPositive = net >= 0;
  const bestNet = bestDrugNet?.net ?? 0;
  const { addToCart } = useCart();
  const cartItems = useCart().cartItems;
  return (
    <div className="relative max-w-4xl mx-auto border border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
      {bestNet !== 0 && (
        <div
          className={`absolute bottom-4 left-4 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-white shadow-md
          ${net === bestNet
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

      {/* try */}

      {/* Show Details Button */}


      {/* Details Modal */}

       {/* Modal Component */}
       {showDetails && (
        <DrugDetailsModal
          drug={drug}
          onClose={() => setShowDetails(false)}
          formatCurrency={formatCurrency}
        />
      )}
    
      {/* Modal Backdrop */}
    
      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <dl>
            <dt className="text-sm font-medium text-gray-500">ACQ</dt>
            <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
              ${drug.acq.toFixed(2)}
            </dd>
          </dl>
        </div>

        <div className="flex items-center space-x-2">
          <Percent className="h-5 w-5 text-gray-400" />
          <dl>
            <dt className="text-sm font-medium text-gray-500">AWP</dt>
            <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
              ${drug.awp}
            </dd>
          </dl>
        </div>

        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-gray-400" />
          <dl>
            <dt className="text-sm font-medium text-gray-500">Strength</dt>
            <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
              {drug.strength}
            </dd>
          </dl>
        </div>

        <div className="flex items-center space-x-2">
          <BarChart2 className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500">Net</dt>
              <dd
                className={`mt-1 text-base font-semibold ${netPositive ? "text-gray-800" : "text-red-600"
                  }`}
              >
                {netPositive ? "+" : "-"}${Math.abs(net).toFixed(2)}
              </dd>
            </dl>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded mt-1">
              <div
                className={`h-2 rounded ${netPositive ? "bg-green-500" : "bg-red-500"
                  }`}
                style={{
                  width: `${bestDrugNet?.net !== undefined && bestDrugNet.net !== 0
                      ? Math.min((net / bestNet) * 100, 100)
                      : 0
                    }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Details Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-6 text-sm font-medium text-blue-600 hover:underline"
      >
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
      {showDetails && (
        <section
          aria-labelledby="drug-details-heading"
          className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6"
        >
          <h2 id="drug-details-heading" className="sr-only">
            Drug Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <dl>
                <dt className="text-sm font-medium text-gray-500">
                  Insurance Pay
                </dt>
                <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {drugDetail?.insurancePayment ?? "NA"}
                </dd>
              </dl>
            </div>

            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <dl>
                <dt className="text-sm font-medium text-gray-500">
                  Patient Pay
                </dt>
                <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {drugDetail?.patientPayment ?? 0}
                </dd>
              </dl>
            </div>

            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-gray-400" />
              <dl>
                <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  NA
                </dd>
              </dl>
            </div>
          </div>

          <details className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <summary className="flex items-center space-x-2 cursor-pointer">
              <Building className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Insurance Details
              </span>
            </summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-gray-400" />
                <dl>
                  <dt className="text-sm font-medium text-gray-500">BIN</dt>
                  <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
                    {drugDetail?.bin
                      ? `${drugDetail.binFullName} - ${drugDetail.bin}`
                      : "NA"}
                  </dd>
                </dl>
              </div>

              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <dl>
                  <dt className="text-sm font-medium text-gray-500">PCN</dt>
                  <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
                    {drugDetail?.pcn ?? "NA"}
                  </dd>
                </dl>
              </div>

              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-gray-400" />
                <dl>
                  <dt className="text-sm font-medium text-gray-500">RXGroup</dt>
                  <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
                    {drugDetail?.rxgroup ?? "NA"}
                  </dd>
                </dl>
              </div>
            </div>
          </details>
        </section>
      )}
      {/* Show Details Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setShowDetails(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Show Details
        </button>
      </div>
      {/*
<div className="mt-6 flex justify-end">
  {cartItems.some((item) => item.id === drug.ndc) ? (
    <button
      disabled
      className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md cursor-not-allowed"
      aria-label={`"${drug.name || "Unnamed Drug"}" is already in the cart`}
    >
      Added
    </button>
  ) : (


    <button
      onClick={() => {
        if (drug.acq !== undefined && drug.acq !== null) {
          addToCart({
            id: drug.ndc || Date.now().toString(),
            name: drug.name || "Unnamed Drug",
            price: drug.acq,
            quantity: 1,
          });

          const storedSearchLog = localStorage.getItem("searchLogDetails");
          if (storedSearchLog) {
            const searchLog: SearchLog = JSON.parse(storedSearchLog);
            const newOrderItem: OrderItem = {
              drugId: drug.id,
              netPrice: drugDetail?.net ?? 0,
              patientPay: drugDetail?.patientPayment ?? 0,
              insurancePay: drugDetail?.insurancePayment ?? 0,
              acquisitionCost: drug.acq,
              additionalCost: 0,
              insuranceRxId: drugDetail?.rxgroupId ?? 0,
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
        }
      }}
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
      aria-label={`Add "${drug.name || "Unnamed Drug"}" to cart`}
    >
      Add to Cart2
    </button>
  )}
</div>
*/}
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
  const filtered = useMemo(
    () =>
      alternatives.filter(
        (alt) =>
          (!selectedInsurance || alt.insuranceName === selectedInsurance) &&
          (!selectedBin || alt.bin === selectedBin) &&
          (!selectedPcn || alt.pcn === selectedPcn)
      ),
    [alternatives, selectedInsurance, selectedBin, selectedPcn]
  );
  setBestNetDrug(filtered[0]);

  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);
  const { addToCart, cartItems } = useCart();

  useEffect(() => setPage(1), [selectedInsurance, selectedBin, selectedPcn, alternatives]);

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
    <section className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 ${classNameStr}
     overflow-y-auto  transition-transform duration-1600 ease-in-out transform translate-x-0 ` }
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
    {/* Floating card shadow */}
    <div className="absolute -inset-2 bg-blue-500/10 rounded-2xl blur-xl opacity-70 animate-float" />
    
    {/* Main card */}
    <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 dark:border-gray-700/50 overflow-hidden transform transition-all duration-500 will-change-transform animate-cardEntry">
      {/* Dynamic status indicator */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 animate-pulse-slow" />

      {/* Header with contextual icon */}
      <div className="px-6 py-4 flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {padCode(modalDrug.ndcCode)}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={closeModal}
          className="p-1.5 -m-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
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
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Net Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ${modalDrug.net.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Acquisition Cost</p>
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
              <svg className="w-3 h-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Branch
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1.5">
              {modalDrug.branchName}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/20 border border-gray-200/30 dark:border-gray-700/30">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <svg className="w-3 h-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Category
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1.5">
              Prescription
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/20 border border-gray-200/30 dark:border-gray-700/30">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <svg className="w-3 h-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last Updated
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1.5">
              Just now
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/20 border border-gray-200/30 dark:border-gray-700/30">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <svg className="w-3 h-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
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
              <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Recommended Alternatives
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">Savings up to 25%</span>
          </div>
          
          <div className="space-y-2">
            {['Alternative 1', 'Alternative 2', 'Alternative 3'].map((alt, index) => (
              <div 
                key={index}
                className="group relative p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/30 hover:border-blue-300/50 dark:hover:border-blue-500/30 transition-all duration-200 cursor-pointer hover:shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className={`mt-0.5 flex-shrink-0 w-2.5 h-2.5 rounded-full ${
                      index === 0 ? 'bg-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-400/30' : 
                      index === 1 ? 'bg-blue-400 ring-1 ring-blue-200 dark:ring-blue-400/30' : 
                      'bg-purple-400 ring-1 ring-purple-200 dark:ring-purple-400/30'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {alt}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {modalDrug.drugClass} • Generic
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${(modalDrug.net * (0.75 + index * 0.1)).toFixed(2)}
                    </p>
                    <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-0.5">
                      Save {20 + index * 5}%
                    </p>
                  </div>
                </div>
                <button className="absolute right-3 top-3 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-blue-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with contextual actions */}
      <div className="px-6 py-4 bg-gray-50/70 dark:bg-gray-700/30 border-t border-gray-200/30 dark:border-gray-700/30 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-gray-500 dark:text-gray-400">Prices updated in real-time</span>
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
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Added</span>
            </button>
          ) : (
            <button
              onClick={() => addToCart({
                id: modalDrug.ndcCode || `${modalDrug.drugId}-uniqueId`,
                name: modalDrug.drugName || "Unnamed Drug",
                price: modalDrug.acquisitionCost,
                quantity: 1,
              })}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] flex items-center space-x-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Insurance Alternatives</h2>
      </header>

      {/* Filters & Controls omitted for brevity, keep existing JSX here */}

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="insuranceFilter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Insurance
          </label>
          <select
            id="insuranceFilter"
            value={selectedInsurance}
            onChange={handleInsuranceFilterChange}
            className="w-full border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Insurances</option>
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
              className={`px-3 py-1 rounded ${page === 1
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
              className={`px-3 py-1 rounded ${page === totalPages
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {[
                "Date",
                "Name",
                "Class",
                "Branch",
                "NDC",
                "Rx Group",
                "BIN",
                "Insurance",
                "PCN",
                "Net Price",
                "Coverage",
                "Patient Pay",
                "ACQ",
                "Add to Cart",
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
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {new Date(rec.date).toISOString().split("T")[0]}
                  </td>
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
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-100">
                    {rec.branchName}
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
                  <td className="px-4 py-2 text-green-700 dark:text-green-400">
                    ${rec.net.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-green-700 dark:text-green-400">
                    ${rec.insurancePayment.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-green-700 dark:text-green-400">
                    ${rec.patientPayment.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    ${rec.acquisitionCost.toFixed(2)}
                  </td>

                  {/* Add to Cart Button */}
                  <td className="px-4 py-2 text-right">
                    {cartItems.some((item) => item.id === rec.ndcCode) ? (
                      <button
                        disabled
                        className="px-3 py-1 bg-gray-400 text-white text-sm font-semibold rounded cursor-not-allowed"
                        aria-label={`${rec.drugName} already added to cart`}
                      >
                        Added
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          addToCart({
                            id: rec.ndcCode || `${rec.drugId}-${idx}`,
                            name: rec.drugName || "Unnamed Drug",
                            price: rec.acquisitionCost,
                            quantity: 1,
                          })
                        }
                        className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`Add ${rec.drugName || "Drug"} to cart`}
                      >
                        Add
                      </button>
                    )}
                  </td>

                  {/* ...other td cells... */}
                  <td key={idx} className="px-4 py-2 text-right space-x-2">
                    <button onClick={() => openModal(rec)} className="px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Details</button>

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
            className={`px-4 py-2 rounded-md ${currentPage === 1
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
            className={`px-4 py-2 rounded-md ${currentPage === totalPages
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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Suggested Alternative Drugs Without Available Insurance Price Data
      </h3>
      <div className="overflow-x-auto shadow-lg rounded-lg dark:bg-gray-800 bg-white mt-4">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                NDC Codes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((alt, index) => (
              <tr
                key={`${alt.ndcCode}-${index}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    <a
                      href={`/drug/${alt.drugId}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition duration-200"
                    >
                      {alt.drugName}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {classNameStr}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    <a
                      href={`https://ndclist.com/ndc/${padCode(alt.ndcCode)}`}
                      className="text-blue-500 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition duration-200"
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
            className={`px-4 py-2 rounded-md ${currentPage === 1
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
            className={`px-4 py-2 rounded-md ${currentPage === totalPages
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
          // Get all alternatives and sort descending by net price:
          response2 = await axiosInstance.get(
            `/drug/GetAllDrugs?classId=${response.data.drugClassId}`
          );
          const sortedData = response2.data.sort(
            (a: Prescription, b: Prescription) => b.net - a.net
          );
          setSortedAlternatives(sortedData);
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
          setDrug(drugData);
          response2 = await axiosInstance.get(
            `/drug/GetDetails?ndc=${ndcCode}&insuranceId=${insuranceId}`
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
            const response4 = await axiosInstance.get(
              `/drug/GetAllDrugs?classId=${response.data.drugClassId}`
            );
            const matchingAlt = response4.data.find(
              (alt: Prescription) => alt.insuranceId.toString() === insuranceId
            );
            setBranchSelectedInsurance(matchingAlt?.insuranceName || "");
            const sortedData = response4.data.sort(
              (a: Prescription, b: Prescription) => b.net - a.net
            );
            setSortedAlternatives(sortedData);
            console.log("sortedData", sortedData);
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
            <DrugHeader drug={drug} padCode={padCode} temp={temp} />
          </header>

          {/* Main content section */}
          <section
            aria-label="Drug Information and Alternatives"
            className="p-6 space-y-6"
          >
            <DrugInformation
              drug={drug}
              drugDetail={drugDetail}
              classNameStr={classNameStr}
              bestDrugNet={bestNetDrug}
            />

            {activeTable === "insurance" ? (
              <section aria-label="Alternative Medications with Insurance">
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
                      setBestNetDrug={setBestNetDrug}
                    />

                    <button
                      onClick={() => setShowOtherAlternatives((prev) => !prev)}
                      className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md transition-colors duration-200"
                    >
                      {showOtherAlternatives
                        ? "Hide Other Alternatives"
                        : "Show Other Alternatives"}
                    </button>

                    {showOtherAlternatives && (
                      <section aria-label="Other Alternatives Without Insurance">
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
                      </section>
                    )}
                  </>
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
          </section>
        </main>
      </div>
    </motion.div>
  );
};

const padCode = (code: string) => code.padStart(11, "0");

export default DrugDetails;
