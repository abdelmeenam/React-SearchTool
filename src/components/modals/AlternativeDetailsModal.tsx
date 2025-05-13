import React from 'react';
import { Prescription } from '../../types';
import { useCart } from '../../context/CartContext';

interface AlternativeDetailsModalProps {
  alternative: Prescription;
  onClose: () => void;
  padCode: (code: string) => string;
}

const AlternativeDetailsModal: React.FC<AlternativeDetailsModalProps> = ({ 
  alternative, 
  onClose,
  padCode
}) => {
  const { cartItems, addToCart } = useCart();

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 mt-18">
      {/* Animated gradient backdrop */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-gray-900/20 backdrop-blur-lg animate-gradientBackground" />
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      </div>

      {/* Modal card with 3D effect */}
      <div className="relative w-full max-w-md">
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
                  {alternative.drugName}
                </h3>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    {alternative.drugClass}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {padCode(alternative.ndcCode)}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
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
                    ${alternative.net.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Acquisition Cost</p>
                  <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    ${alternative.acquisitionCost.toFixed(2)}
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
                  {alternative.branchName}
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
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Close
                </button>
                
                {cartItems.some((item) => item.id === alternative.ndcCode) ? (
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
                      id: alternative.ndcCode || `${alternative.drugId}-uniqueId`,
                      name: alternative.drugName || "Unnamed Drug",
                      price: alternative.acquisitionCost,
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
    </div>
  );
};

export default AlternativeDetailsModal;