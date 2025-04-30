import React from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Drug } from '../types';
import { formatCurrency } from '../utils/helpers';

interface DrugItemProps {
  drug: Drug;
  onAddToCart: (drug: Drug) => void;
}

const DrugItem: React.FC<DrugItemProps> = ({ drug, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <div className="h-40 overflow-hidden">
        <img
          src={drug.image}
          alt={drug.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{drug.name}</h3>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {drug.category.replace('-', ' ')}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{drug.dosage}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mt-2">{drug.description}</p>
        
        {drug.requiresPrescription && (
          <div className="flex items-center mt-3 text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>Requires prescription</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-semibold text-blue-600">{formatCurrency(drug.price)}</span>
          <button
            onClick={() => onAddToCart(drug)}
            className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrugItem;