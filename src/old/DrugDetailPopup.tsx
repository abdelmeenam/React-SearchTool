import React, { useState } from "react";
import {
  X,
  ShoppingCart,
  AlertTriangle,
  Check,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Drug, OrderItem, Prescription, SearchLog } from "../types";
import { useCart } from "../context/CartContext";

interface DrugDetailPopupProps {
  drug: Drug;
  drugDetail: Prescription | null;
  insuranceRxGroup?: string;
  onClose: () => void;
}

const DrugDetailPopup: React.FC<DrugDetailPopupProps> = ({
  drug,
  drugDetail,
  insuranceRxGroup,
  onClose,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const coverageInfo = drugDetail ? drugDetail.rxgroup : false;
  const isCovered = coverageInfo;
  const copay = drugDetail ? drugDetail.acquisitionCost : 0;
  const totalCost = quantity * copay;

  const handleAddToCart = () => {
    if (drug.acq !== undefined && drug.acq !== null) {
      addToCart({
        id: drug.ndc || Date.now().toString(),
        name: drug.name || "Unnamed Drug",
        price: (drugDetail?.acquisitionCost ?? 0) / (drugDetail?.quantity || 1),
        quantity: 1,
        ndc: drug.ndc || "N/A",
        insurance: drugDetail?.rxgroup || "N/A",
        insurancePayment:
          (drugDetail?.insurancePayment ?? 0) / (drugDetail?.quantity || 1),
        patientPayment:
          (drugDetail?.patientPayment ?? 0) / (drugDetail?.quantity || 1),
        acq: (drugDetail?.acquisitionCost ?? 0) / (drugDetail?.quantity || 1),
      });

      const storedSearchLog = localStorage.getItem("searchLogDetails");
      console.log("Stored Search Log:", storedSearchLog);
      if (storedSearchLog) {
        const searchLog: SearchLog = JSON.parse(storedSearchLog);
        const newOrderItem: OrderItem = {
          drugNDC: drug.ndc || "N/A",
          netPrice: (drugDetail?.net ?? 0) / (drugDetail?.quantity || 1),
          patientPay:
            (drugDetail?.patientPayment ?? 0) / (drugDetail?.quantity || 1),
          insurancePay:
            (drugDetail?.insurancePayment ?? 0) / (drugDetail?.quantity || 1),
          acquisitionCost: (drug.acq ?? 0) / (drugDetail?.quantity || 1),
          additionalCost: 0,
          insuranceRxId: drugDetail?.rxgroupId ?? 0,
          amount: 1,
        };
        console.log("Adding to order:", newOrderItem);
        const currentOrder = JSON.parse(
          localStorage.getItem("orderRequestBody") ||
            '{"orderItems":[],"searchLogs":[]}'
        );
        currentOrder.orderItems.push(newOrderItem);
        currentOrder.searchLogs.push(searchLog);
        console.log("Current Order:", currentOrder);
        localStorage.setItem("orderRequestBody", JSON.stringify(currentOrder));
      }
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0  z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex  items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
        <div
          className="fixed inset-0  bg-black bg-opacity-70 transition-opacity "
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  className="text-2xl leading-6 font-bold text-blue-900"
                  id="modal-title"
                >
                  {drug.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {drug.name} • {drug.strength}
                </p>

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        Drug Information
                      </h4>
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <dt className="text-sm text-gray-500">NDC</dt>
                        <dd className="text-sm text-gray-900">{drug.ndc}</dd>

                        <dt className="text-sm text-gray-500">Strength</dt>
                        <dd className="text-sm text-gray-900">
                          {drug.strength}
                        </dd>

                        <dt className="text-sm text-gray-500">
                          Acquisition Cost
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {formatCurrency(drug.acq)}
                        </dd>

                        <dt className="text-sm text-gray-500">Net Price</dt>
                        <dd className="text-sm text-gray-900">
                          {drugDetail ? formatCurrency(drugDetail.net) : "N/A"}
                        </dd>
                      </dl>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        Insurance Details
                      </h4>
                      {insuranceRxGroup ? (
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="text-sm text-gray-500 mr-2">
                              Coverage Status:
                            </span>
                            {isCovered ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" /> Covered
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertCircle className="h-3 w-3 mr-1" /> Not
                                Covered
                              </span>
                            )}
                          </div>

                          {isCovered && coverageInfo ? (
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                              <dt className="text-sm text-gray-500">
                                Insurance Reimbursement
                              </dt>
                              <dd className="text-sm text-gray-900">
                                {formatCurrency(
                                  drugDetail?.insurancePayment ?? 0
                                )}
                              </dd>

                              <dt className="text-sm text-gray-500">
                                Patient Copay
                              </dt>
                              <dd className="text-sm text-blue-700 font-medium">
                                {formatCurrency(copay)}
                              </dd>

                              <dt className="text-sm text-gray-500">
                                Formulary Tier
                              </dt>
                              <dd className="text-sm text-gray-900">
                                Tier {drugDetail?.rxgroup}
                              </dd>

                              <dt className="text-sm text-gray-500">
                                Prior Authorization
                              </dt>
                              <dd className="text-sm text-gray-900">
                                {coverageInfo ? "Required" : "Not Required"}
                              </dd>
                            </dl>
                          ) : (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-yellow-700">
                                    This medication is not covered by the
                                    selected insurance plan.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded p-3">
                          <p className="text-sm text-gray-500">
                            No insurance information provided. Patient will pay
                            retail price.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-lg mb-2">
                      Dispensing Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Quantity
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            min="1"
                            max={1}
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(parseInt(e.target.value))
                            }
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        {/* <p className="mt-1 text-sm text-gray-500">
                          Available: {1000000} units
                        </p> */}
                      </div>

                      <div>
                        <div className="bg-blue-50 border border-blue-200 rounded p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Patient Pays:
                            </span>
                            <span className="text-lg font-bold text-blue-800">
                              {formatCurrency(totalCost)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-blue-600">
                            <CreditCard className="h-4 w-4 mr-1" />
                            {isCovered ? "Insurance applied" : "Cash price"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={quantity > 1}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugDetailPopup;
