import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { formatCurrency } from '../utils/helpers';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { drug, quantity } = item;
  
  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(drug.id, quantity - 1);
    } else {
      onRemove(drug.id);
    }
  };
  
  const handleIncrement = () => {
    onUpdateQuantity(drug.id, quantity + 1);
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200 last:border-b-0">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={drug.image}
          alt={drug.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <h3 className="font-medium text-gray-800">{drug.name}</h3>
        <p className="text-sm text-gray-500">{drug.dosage}</p>
        <p className="mt-1 text-sm text-blue-600 font-medium">{formatCurrency(drug.price)}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={handleDecrement}
            className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <span className="w-8 text-center text-gray-800">{quantity}</span>
          
          <button
            onClick={handleIncrement}
            className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <button
          onClick={() => onRemove(drug.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;