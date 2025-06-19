
// Cart.tsx
import React, { useRef } from "react";

interface CartProps {
  cartItems: any[];
  onClearCart: () => void;
}

export const Cart: React.FC<CartProps> = ({ cartItems, onClearCart }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const win = window.open("", "", "width=600,height=600");
      win?.document.write(`<html><head><title>Receipt</title></head><body>${printContents}</body></html>`);
      win?.document.close();
      win?.print();
    }
  };

  return (
    <aside className="fixed right-0 top-0 h-full w-80 bg-gray-100 dark:bg-gray-800 shadow-lg p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">🛒 Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">No items in cart.</p>
      ) : (
        <>
          <div ref={receiptRef}>
            <h3 className="text-md font-semibold mb-2">Receipt</h3>
            <ul className="space-y-2">
              {cartItems.map((item, index) => (
                <li key={index} className="border-b pb-2">
                  <p className="font-medium">{item.drug.name ?? "Drug Item"}</p>
                  <p className="text-sm text-gray-600">ACQ: ${item.drug.acq.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">AWP: ${item.drug.awp}</p>
                  <p className="text-sm text-gray-600">Net: ${item.drugDetail?.net ?? 0}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 space-x-2">
            <button onClick={handlePrint} className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">Print Receipt</button>
            <button onClick={onClearCart} className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">Clear Cart</button>
          </div>
        </>
      )}
    </aside>
  );
};
