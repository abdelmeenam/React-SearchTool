// components/CheckoutModal.tsx
import { useCart } from "../context/CartContext";
import { Checkout } from "./checkout";
import { X } from "lucide-react";
import { useEffect } from "react";

export const CheckoutModal = () => {
  const { isCheckoutOpen, closeCheckout, closeCart } = useCart();

  // Close both cart and checkout when clicking overlay
  const handleClose = () => {
    closeCheckout();
    closeCart();
  };

  // Add escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isCheckoutOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCheckoutOpen, handleClose]);

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto w-full ">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="
          fixed inset-0 bg-grey bg-opacity-50 transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />
        
        {/* Modal */}
        + <div className="inline-block w-full ml-77 align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative">
        <div className="absolute top-0 right-0 pt-4 pr-4 ">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <Checkout />
        </div>
      </div>
    </div>
  );
};