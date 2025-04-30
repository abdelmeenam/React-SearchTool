import React, { JSX, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Minus, Plus } from 'lucide-react';
import { formatCurrency } from '../src/utils/helpers';
// import axiosInstance from '../api/axiosInstance' // or however you fetch

import DrugItem from "../src/components/DrugItem";
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
  ShoppingCart,
  X,
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
import { Drug, Prescription } from "../src/types/index";
import axiosInstance from "../api/axiosInstance";

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



//   tryyyyyyyy
// src/components/CartSidebar.tsx


interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    items,
    addToCart,
    remove,
    updateQuantity,
    closeCart,
    openCheckout,
  } = useCart()

  // STEP MANAGEMENT
  const [step, setStep] = useState(1)

  // --- Step 1 state: search & insurance ---
  const [searchTerm, setSearchTerm] = useState('')
  const [insuranceId, setInsuranceId] = useState<string>('')
  const [results, setResults] = useState<typeof items>([])

  useEffect(() => {
    if (step === 1 && searchTerm.trim()) {
      axiosInstance
        .get(`/drugs?q=${encodeURIComponent(searchTerm)}&ins=${insuranceId}`)
        .then((res) => setResults(res.data))
        .catch(console.error)
    } else {
      setResults([])
    }
  }, [searchTerm, insuranceId, step])

  // --- Step 2 helper: replace with alternative ---
  const replaceWithAlternative = (origId: string, alt: typeof items[0]) => {
    remove(origId)
    addToCart(alt.drug)
  }

  // --- Totals & copay (stubbed) ---
  const subtotal = items.reduce(
    (sum, it) => sum + it.drug.acq * it.quantity,
    0
  )
  const copayPercent = 14 // or fetch from insurance API

  const handleConfirmDispense = () => {
    closeCart()
    openCheckout()
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
    >
      {/* Stepper */}
      <div className="flex items-center space-x-4 p-4 border-b">
        {['Search', 'Review', 'Confirm'].map((label, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium ${
                step > i + 1
                  ? 'bg-blue-600 text-white'
                  : step === i + 1
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`ml-2 ${
                step >= i + 1 ? 'text-gray-800' : 'text-gray-500'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Your Cart ({items.length})
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100%-200px)] p-4">
        {step === 1 && (
          <>
            {/* --- STEP 1: Search & Add --- */}
            <input
              type="text"
              placeholder="Search drugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <select
              value={insuranceId}
              onChange={(e) => setInsuranceId(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded"
            >
              <option value="">Select Insurance</option>
              {/* map your insurers here */}
              <option value="ins1">Insurer 1</option>
              <option value="ins2">Insurer 2</option>
            </select>
            <ul className="space-y-2">
              {results.map((r) => (
                <li
                  key={r.drug.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <div>
                    <p className="font-medium">{r.drug.name}</p>
                    <small className="text-gray-500">{r.drug.strength}</small>
                  </div>
                  <button
                    onClick={() => addToCart(r.drug)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {step === 2 && (
          <>
            {/* --- STEP 2: Review Script --- */}
            {items.map((it) => (
              <div key={it.drug.id} className="mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">
                      {it.drug.name} <small>{it.drug.strength}</small>
                    </h4>
                    <p className="text-sm text-gray-600">
                      ${it.drug.acq} × {it.quantity}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(it.drug.id, Math.max(1, it.quantity - 1))
                      }
                    >
                      <Minus className="h-4 w-4 text-gray-600 hover:text-gray-800" />
                    </button>
                    <span>{it.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(it.drug.id, it.quantity + 1)
                      }
                    >
                      <Plus className="h-4 w-4 text-gray-600 hover:text-gray-800" />
                    </button>
                  </div>
                </div>

                <details className="mt-2 text-sm">
                  <summary className="text-blue-600 hover:underline cursor-pointer">
                    See Alternatives
                  </summary>
                  <ul className="pl-4 space-y-1">
                    {(it.alternatives || []).map((alt: any) => (
                      <li
                        key={alt.id}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {alt.name} <small>{alt.strength}</small>
                        </span>
                        <button
                          onClick={() =>
                            replaceWithAlternative(it.drug.id, alt)
                          }
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Replace
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>

                <button
                  onClick={() => remove(it.drug.id)}
                  className="mt-2 text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </>
        )}

        {step === 3 && (
          <>
            {/* --- STEP 3: Confirm Dispense --- */}
            <div className="grid grid-cols-1 gap-2 mb-4">
              {items.map((it) => (
                <div
                  key={it.drug.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {it.drug.name} × {it.quantity}
                  </span>
                  <span>
                    {formatCurrency(it.drug.acq * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mb-4">
              <div className="flex justify-between text-base font-medium">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Patient Copay</span>
                <span>{copayPercent}%</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Nav */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <div className="flex justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleConfirmDispense}
              disabled={items.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Confirm Dispense
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// newww
interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
/*
const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { items, remove, updateQuantity ,closeCart,openCheckout } = useCart();
  const [step, setStep] = useState(1);

  const total = items.reduce(
    (sum, item) => sum + item.drug.acq * item.quantity,
    0
  );
// side cart code
  return (
  

    <div
      className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex items-center space-x-4 p-4 border-b">
  {['Search','Review','Confirm'].map((label, i) => (
    <div key={i} className="flex items-center">
      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium
          ${step>i+1 ? 'bg-blue-600 text-white' : step===i+1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
        {i+1}
      </div>
      <span className={`ml-2 ${step>=i+1 ? 'text-gray-800' : 'text-gray-500'}`}>{label}</span>
    </div>
  ))}
</div>

      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Your Cart ({items.length})
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100%-200px)] p-4">
  {step === 1 && <Step1_SearchAndAdd onAdd={items} insuranceList={items}/>}

  {step === 2 && <Step2_ReviewScript
     items={items}
     onQtyChange={updateQuantity}
     onRemove={remove}
     onReplace={replaceWithAlternative}
  />}

  {step === 3 && <Step3_ConfirmDispense
     items={items}
     total={total}
     copayPercent={copayPercent}
  />}
</div>


      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex justify-between mb-2">
          <span>Total:</span>
          <span className="font-semibold">{formatCurrency(total)}</span>
        </div>
      
<button
  onClick={() => {
    closeCart(); // Close the cart sidebar
    openCheckout(); // Open the checkout modal
  }}
  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
  disabled={items.length === 0}
>
  Proceed to Checkout
</button>
      </div>
    </div>
  );
};
*/
//end
interface DrugInformationProps {
  drug: Drug;
  drugDetail?: Prescription | null;
  classNameStr: string;
   onAddToCart: (drug: Drug) => void;
 
}
interface DrugItemProps {
  drug: Drug;
  onAddToCart: (drug: Drug) => void;
}


export const DrugInformation: React.FC<DrugInformationProps> = ({
  drug,
  drugDetail,
  classNameStr,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { addToCart, isOpen, closeCart } = useCart(); // Get cart state from context

  const net = drugDetail?.net ?? 0;
  const netPositive = net >= 0;

  // No need for local isCartOpen state anymore
  const handleAdd = () => {
    console.log("Add clicked for", drug);
    addToCart(drug as Drug); // This will automatically open the cart
  };





  
 
  return (
    <div className="max-w-4xl mx-auto border border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
   
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
                className={`mt-1 text-base font-semibold ${
                  netPositive ? "text-gray-800" : "text-red-600"
                }`}
              >
                {netPositive ? "+" : "-"}${Math.abs(net).toFixed(2)}
              </dd>
            </dl>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded mt-1">
              <div
                className={`h-2 rounded ${
                  netPositive ? "bg-green-500" : "bg-red-500"
                }`}
                style={{
                  width: `${Math.min((drug.acq / drug.awp) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
        <div className="p-4">
       
     {/* Add to Cart Button remains the same */}
     <div className="my-4 flex justify-end">
          <button
            onClick={handleAdd}
            className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to cart
          </button>
        </div>
      </div>

      {/* Cart Sidebar - now uses context's isOpen and closeCart */}
      <CartSidebar isOpen={isOpen} onClose={closeCart} />
      
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeCart}
        />
      )}
    

    

         {/* Add to Cart Button */}
        
   
      </div>
      
    
      {/* Toggle Details Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-6 text-sm font-medium text-blue-600 hover:underline"
      >
        {showDetails ? "Hide Details" : "Show Details"}
      </button>

      {/* Detailed Section with ARIA Landmark */}
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
    </div>
  );
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
  uniqueBinValues: { bin: string; binFullName: string }[];
  selectedPcn: string;
  handlePcnFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  uniquePcnValues: string[];
  handleSort: () => void;
  sortOrder: "asc" | "desc";
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
}) => {
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

  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(
    () => setPage(1),
    [selectedInsurance, selectedBin, selectedPcn, alternatives]
  );

  
  const { addToCart, isOpen, closeCart } = useCart();

    const handleAddToCart = (rec: Prescription) => {
      const drugItem: Drug = {
        id: `${rec.ndc}-${rec.bin}-${rec.pcn}`, // Composite key
        name: rec.drugName, // adjust based on your actual data structure
        description: rec.description || "No description available",
        price: rec.price || 0,
        category: rec.category || "Uncategorized",
        requiresPrescription: rec.requiresPrescription || false,
   /*     strength: rec.strength || "N/A",
        acq: rec.acqCost || 0,
        awp: rec.awpPrice || 0,
        */
      };
      addToCart(drugItem);
    };  

  return (
    <section
      className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 ${classNameStr}`}
    >
      <header className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Insurance Alternatives
        </h2>
      </header>

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
                "Cart",
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
            {pageItems.map((rec, idx) => (
              <tr key={`${rec.ndc}-${rec.bin}-${idx}`}>
                 <td className="px-4 py-2">
                <div className="my-4 flex justify-end">
                  <button
                    onClick={() => handleAddToCart(rec)}
                    className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add 
                  </button>
                </div>
                  
                </td>
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
                <td className="px-4 py-2 text-gray-800 dark:text-gray-100">
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
              </tr>
            ))}
          </tbody>
        </table>
              {/* Cart Sidebar - same one we created earlier */}
      <CartSidebar isOpen={isOpen} onClose={closeCart} />
      
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeCart}
        />
      )}

      {/* Pagination Controls */}
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


  const { addToCart, isOpen, closeCart } = useCart();

  const handleAddToCart = (alt: Prescription) => {
    const drugItem: Drug = {
      id: `${alt.ndcCode}-${alt.bin}-${alt.pcn}`, // Unique composite ID
      name: alt.drugName,
   /*   ndc: alt.ndcCode,
      acq: alt.acqCost || 0, // Provide fallback if undefined
      awp: alt.awpPrice || 0, // Provide fallback if undefined
      strength: alt.strength || 'N/A'
      */
    };
    addToCart(drugItem);
  };
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
                Cart
              </th>
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
                                <div className="my-4 flex justify-end">
                  <button
                    onClick={() => handleAddToCart(alt)}
                    className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add 
                  </button>
                </div>
</td>
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
                {/* Cart Sidebar - same one we created earlier */}
      <CartSidebar isOpen={isOpen} onClose={closeCart} />
      
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeCart}
        />
      )}
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
