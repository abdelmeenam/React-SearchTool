import React, { useEffect, useRef, useState } from "react";
import { CartItem } from "../types";
import { generateReceiptText } from "../../utils/receipt";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router";
import { CheckCircle, XCircle } from "react-feather";
import { Pill } from "lucide-react";

interface CartProps {
  cartItems: CartItem[];
  onClearCart: () => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  toggleCart: () => void;
}

export const Cart: React.FC<CartProps> = ({
  cartItems,
  onClearCart,
  onUpdateQuantity,
  onRemoveItem,
  toggleCart,
}) => {
  // Subtotal is sum of all item totals (net * quantity + $10 per Medi-Cal item per quantity)
  const subtotal = cartItems.reduce((acc, item) => {
    const net = item.price ?? 0;
    const isMediCal =
      item.insurance && item.insurance.toLowerCase().includes("medi-cal");
    const mediCalFee = isMediCal ? 10 * 1 : 0;
    return acc + (net * item.quantity )+ mediCalFee;
  }, 0);

  const total = subtotal;

  const cartRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");

  // Smooth close cart when clicking outside the cart
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsVisible(false);
        setTimeout(() => {
          toggleCart();
        }, 600);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleCart]);

  const handleCheckout = async () => {
    const orderBody = localStorage.getItem("orderRequestBody");

    if (!orderBody) {
      setStatus("error");
      setMessage("No order data found.");
      return;
    }

    try {
      const parsedOrder = JSON.parse(orderBody);
      const response = await axiosInstance.post(
        "/order/CreateOrder",
        parsedOrder
      );

      setStatus("success");
      setMessage("Order submitted successfully!");
      onClearCart();
      localStorage.removeItem("orderRequestBody");
      localStorage.setItem("lastOrderSubmitted", JSON.stringify(parsedOrder));
    } catch (error) {
      setStatus("error");
      setMessage("Failed to submit order. Please try again.");
    }
  };

  const handlePrint = () => {
    const printContent = receiptRef.current?.innerText;
    const printWindow = window.open("", "_blank", "width=600,height=800");
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);
  return (
    <div className="relative bg-white dark:bg-gray-900">
      {/* Success Popup */}
      {status === "success" && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6 shadow-lg z-50">
          <CheckCircle className="w-12 h-12 text-green-500 animate-bounce mb-4" />
          <p className="font-medium text-green-800 dark:text-green-200 mb-2">
            ✅ {message}
          </p>
        </div>
      )}

      {/* Error Popup */}
      {status === "error" && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6 shadow-lg z-50">
          <XCircle className="w-12 h-12 text-red-500 animate-shake mb-4" />
          <p className="font-medium text-red-800 dark:text-red-200">
            ❌ {message}
          </p>
        </div>
      )}

      <section
        ref={cartRef}
        className={`fixed top-20 right-0 w-105 max-w-full h-[calc(100vh-60px)] p-6 shadow-2xl bg-white dark:bg-gray-900 z-50
        overflow-y-auto border-l border-gray-200/70 dark:border-gray-800/80 transition-transform duration-600 ease-in-out transform
        ${isVisible ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Shopping Cart"
      >
        {/* Cart Header with Close Button */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Shopping Cart
            </h2>
            <span className="ml-4 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm font-medium rounded-full">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-light"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                toggleCart();
              }, 600);
            }}
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              Your cart is empty
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Start adding items to continue
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ul className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {cartItems.map((item) => {
                const acquisitionCost = item.acq ?? item.acq ?? 0;
                const insurancePayment = item.insurancePayment ?? 0;
                const patientPayment = item.patientPayment ?? 0;
                const net = item.price ?? item.price ?? 0;
                const isMediCal =
                  item.insurance &&
                  item.insurance.toLowerCase().includes("medi-cal");
                const mediCalFee = isMediCal ? 10 * 1 : 0;
                const itemTotal = net * item.quantity + mediCalFee;
                return (
                  <li key={item.id} className="py-4">
                    <div className="flex justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                          <Pill className="w-8 h-8 text-blue-500 dark:text-blue-300" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            ${net.toFixed(2)} each
                          </p>
                          {item.insurance && (
                            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                              Insurance: {item.insurance}
                            </p>
                          )}
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            ACQ: ${acquisitionCost.toFixed(2)}<br />
                            Insurance Payment: ${insurancePayment * item.quantity + 10}<br />
                            Patient Payment: ${patientPayment.toFixed(2)}
                          </div>
                          <div className="mt-2 flex items-center">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30"
                              aria-label="Decrease quantity"
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
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="mx-2 text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                              aria-label="Increase quantity"
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
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                          ${net.toFixed(2)}
                          {isMediCal && (
                            <span className="block text-xs text-blue-600 dark:text-blue-300">
                              (+${mediCalFee} Medi-Cal)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Cart Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Tax (estimated)</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg hover:shadow-md transition-all flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Proceed to Checkout
                </button>

                <button
                  onClick={handlePrint}
                  className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print Receipt
                </button>
              </div>

              {/* Insurance Note */}
              {cartItems.some(
                (item) =>
                  item.insurance &&
                  item.insurance.toLowerCase().includes("medi-cal")
              ) && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 text-blue-800 dark:text-blue-200 rounded">
                  <strong>Note:</strong> Each <span className="font-semibold">Medi-Cal</span> insurance drug in your cart adds <span className="font-semibold">$10</span> per unit to the total.
                </div>
              )}
            </div>
          </>
        )}

        {/* Hidden Receipt for Print */}
        <div ref={receiptRef} className="hidden">
          {generateReceiptText(cartItems)}
        </div>
      </section>
    </div>
  );
};