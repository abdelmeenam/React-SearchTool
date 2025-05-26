import React from "react";
import { Drug, OrderItem, Prescription, SearchLog } from "../types";
import { useCart } from "../context/CartContext";
import {
  X,
  CalendarDays,
  Pill,
  BadgeCheck,
  Package,
  Route,
  BadgeDollarSign,
  FlaskConical,
} from "lucide-react";

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
      <div
        className="relative bg-white w-122 dark:bg-gray-800 rounded-xl shadow-2xl 
       overflow-hidden border border-white/20 dark:border-gray-700/50"
      >
        {/* Glossy header with improved gradient */}
        <div className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 flex justify-between items-center relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-20" />
          <div className="min-w-0 relative">
            <h3 className="text-lg font-bold text-white truncate pr-6">
              {drug.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-blue-800/50 transition-colors duration-150 group absolute top-2 right-2"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
          </button>
        </div>
        {/* Enhanced body with subtle animations */}
        <div className="px-5 py-4 space-y-4">
          {/* Metrics grid with hover effects */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Acquisition",
                value: formatCurrency(drugDetail?.acquisitionCost ?? 0),
                color: "blue",
              },
              {
                label: "Insurance",
                value: formatCurrency(drugDetail?.insurancePayment ?? 0),
                color: "purple",
              },
              {
                label: "Patient Pay",
                value: formatCurrency(drugDetail?.patientPayment ?? 0),
                color: "amber",
              },
              {
                label: "Net",
                value: formatCurrency(drugDetail?.net ?? 0),
                color: "green",
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
          <div className="space-y-2 text-sm">
            {[
              {
                icon: <CalendarDays className="w-4 h-4 mr-2 opacity-70" />,
                label: "NDC",
                value: drug.ndc,
                border: true,
              },
              {
                icon: <BadgeCheck className="w-4 h-4 mr-2 opacity-70" />,
                label: "Drug Strength",
                value: `${drug.strength} ${drug.strengthUnit}`,
                border: true,
                truncate: true,
              },
              {
                icon: <FlaskConical className="w-4 h-4 mr-2 opacity-70" />,
                label: "Active Ingredient",
                value: drug.ingrdient,
                border: false,
              },
              {
                icon: <BadgeCheck className="w-4 h-4 mr-2 opacity-70" />,
                label: "TE Code",
                value: drug.teCode,
                border: false,
              },
              {
                icon: <Package className="w-4 h-4 mr-2 opacity-70" />,
                label: "Dosage Form",
                value: drug.form,
                border: false,
              },
              {
                icon: <Route className="w-4 h-4 mr-2 opacity-70" />,
                label: "Route",
                value: drug.route,
                border: false,
              },
              {
                icon: <BadgeDollarSign className="w-4 h-4 mr-2 opacity-70" />,
                label: "Market Status",
                value: drug.type,
                border: false,
              },
            ].map((item, idx) => (
              <div
                key={item.label}
                className={`flex justify-between items-center py-2 ${
                  item.border && "border-b border-gray-100 dark:border-gray-700"
                }`}
              >
                <span className="text-gray-500 dark:text-gray-400 flex items-center font-medium">
                  {item.icon}
                  {item.label}
                </span>
                <span
                  className={`font-semibold text-gray-900 dark:text-gray-100 ${
                    item.truncate
                      ? "truncate max-w-[160px]"
                      : "truncate max-w-[120px]"
                  } cursor-pointer`}
                  title={item.value}
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(item.value || "N/A");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      alert(item.value || "N/A");
                    }
                  }}
                >
                  {item.value || "N/A"}
                </span>
              </div>
            ))}
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
