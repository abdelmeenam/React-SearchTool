import React from "react";
import { Drug, OrderItem, Prescription, SearchLog } from "../types";
import { useCart } from "../context/CartContext";

interface DrugDetailsModalProps {
  drug: Drug;
  drugDetail: Prescription | null;
  onClose: () => void;
  formatCurrency: (value: number) => string;
}

const DrugDetailsModal: React.FC<DrugDetailsModalProps> = ({
  drug,
  drugDetail,
  onClose,
  formatCurrency,
}) => {
  const { cartItems, addToCart } = useCart();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with subtle gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-blue-900/10 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Refined modal container */}

      {/* Refined modal container */}
      <div
        className="relative bg-white w-122 dark:bg-gray-800 rounded-xl shadow-2xl 
       overflow-hidden border border-white/20 dark:border-gray-700/50"
      >
        {" "}
        {/* Glossy header with improved gradient */}
        <div className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 flex justify-between items-center relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-20" />
          <div className="min-w-0 relative">
            <h3 className="text-lg font-bold text-white truncate pr-6">
              {drug.name}
            </h3>
            <p className="text-blue-100/90 text-sm truncate">{drug.strength}</p>
          </div>
          {/* <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-blue-800/50 transition-colors duration-150 group"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4 text-white/90 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button> */}
        </div>
        {/* Enhanced body with subtle animations */}
        <div className="px-5 py-4 space-y-4">
          {/* Metrics grid with hover effects */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Acquisition",
                value: formatCurrency(drug.acq),
                color: "blue",
              },
              {
                label: "Insurance",
                value: formatCurrency(drug.awp),
                color: "purple",
              },
              { label: "Status", value: "In Stock", color: "green" },
              {
                label: "Copay",
                value: formatCurrency(drug.acq ?? 0),
                color: "amber",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border bg-${item.color}-50/50 dark:bg-${item.color}-900/10 border-${item.color}-100 dark:border-${item.color}-900/20 hover:shadow-sm transition-shadow duration-200`}
              >
                <p
                  className={`text-xs text-${item.color}-600 dark:text-${item.color}-300`}
                >
                  {item.label}
                </p>
                <p className="text-base font-semibold mt-1 dark:text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Details list with improved typography */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 flex items-center">
                <svg
                  className="w-3.5 h-3.5 mr-2 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                NDC
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {drug.ndc}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 flex items-center">
                <svg
                  className="w-3.5 h-3.5 mr-2 opacity-70"
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
                Manufacturer
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[160px]">
                {drug.acq}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 dark:text-gray-400 flex items-center">
                <svg
                  className="w-3.5 h-3.5 mr-2 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Retail Price
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {formatCurrency(drug.acq)}
              </span>
            </div>
          </div>
        </div>
        {/* Premium footer with better button styling */}
        <div className="px-5 py-3 bg-gray-50/80 dark:bg-gray-700/30 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 dark:focus:ring-offset-gray-700"
          >
            Close
          </button>

          {cartItems.some((item) => item.id === drug.ndc) ? (
            <button
              disabled
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Added
            </button>
          ) : (
            <button
              onClick={() => {
                if (drug.acq !== undefined && drug.acq !== null) {
                  addToCart({
                    id: drug.ndc || Date.now().toString(),
                    name: drug.name || "Unnamed Drug",
                    price: drugDetail?.net ?? 0,
                    quantity: 1,
                  });

                  const storedSearchLog =
                    localStorage.getItem("searchLogDetails");
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
                    console.log("Current Order:", currentOrder);
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
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrugDetailsModal;
