// src/components/Cart.tsx
import React from 'react';
import { X, ShoppingCart as CartIcon } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import CartItem from './CartItem';
import {
  formatCurrency,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from '../utils/helpers';


interface CartProps {
  isOpen: boolean;
  items: CartItemType[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}) => {
  console.log('Cart items:', items);
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);
  const hasRequiredPrescriptions = items.some(
    (item) => item.drug
  );

  if(!isOpen) return null;
  return (
    <>
      {/* Backdrop */}
      <p>hddhtdh</p>
      <div
        className={`
          fixed inset-0 bg-black bg-opacity-30
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 right-0 h-full  bg-white shadow-2xl
          transition-transform duration-300 z-50
          w-full sm:w-80 md:w-96
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <CartIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">Your Cart</h2>
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <CartIcon className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.drug.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))
          )}
        </div>

        {/* Desktop & Tablet Footer */}
        {items.length > 0 && (
          <div className="hidden sm:block p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-medium">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (7%)</span>
                <span className="text-gray-800 font-medium">
                  {formatCurrency(tax)}
                </span>
              </div>
              <div className="flex justify-between pt-2 font-medium text-base border-t border-gray-200">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>

            {hasRequiredPrescriptions && (
              <div className="mt-4 p-3 bg-amber-50 text-amber-700 text-sm rounded-md">
                <p className="font-medium">Prescription Required</p>
                <p className="mt-1">
                  Some items in your cart require a valid prescription which
                  you'll need to provide during checkout.
                </p>
              </div>
            )}

            <button
              onClick={onCheckout}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Proceed to Checkout
            </button>
          </div>
        )}

        {/* Mobile-only Sticky Footer */}
        {items.length > 0 && (
          <div
            className="
              sm:hidden
              sticky bottom-0
              bg-white border-t border-gray-200
              p-3
              flex space-x-2
              shadow-inner
            "
          >
            <button
              onClick={onClose}
              className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              aria-label="Close Cart"
            >
              Close
            </button>
            <button
              onClick={onCheckout}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Cart;
