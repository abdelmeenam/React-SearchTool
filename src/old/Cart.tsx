import React, { useRef } from "react";
import { CartItem } from "../types";
import { generateReceiptText } from "../../utils/receipt";
import axiosInstance from "../api/axiosInstance";

interface CartProps {
  cartItems: CartItem[];
  onClearCart: () => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
}

export const Cart: React.FC<CartProps> = ({
  cartItems,
  onClearCart,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const receiptRef = useRef<HTMLDivElement>(null);
  const handleCheckout = async () => {
    const orderBody = localStorage.getItem("orderRequestBody");

    if (!orderBody) {
      alert("No order data found.");
      return;
    }

    try {
      const parsedOrder = JSON.parse(orderBody);
        console.log("Parsed Order:", parsedOrder);
      const response = await axiosInstance.post(
        "/order/CreateOrder",
        parsedOrder
      );

      // Success: clear cart + order body + notify
      console.log("Order submitted successfully:", response.data);
      alert("✅ Order submitted successfully!");
      onClearCart();
      localStorage.removeItem("orderRequestBody");
      localStorage.setItem("lastOrderSubmitted", JSON.stringify(parsedOrder));
    } catch (error) {
      console.error("❌ Order submission failed:", error);
      alert("❌ Failed to submit order. Please try again.");
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

  return (
    <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <section
        className="fixed top-[64px] right-0 w-96 max-w-full h-[calc(100vh-64px)] p-6 shadow-xl bg-white dark:bg-gray-900 z-50 overflow-y-auto border-l border-gray-200 dark:border-gray-800"
        aria-label="Cart Sidebar"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          🛒 Shopping Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Your cart is empty.
          </p>
        ) : (
          <>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Unit Price: ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      aria-label="Remove item"
                    >
                      🗑 Remove
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-2 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-white">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={handlePrint}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Print Receipt
              </button>
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
