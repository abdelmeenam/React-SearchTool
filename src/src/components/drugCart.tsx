import React, { useState } from 'react';
import { DollarSign, Percent, Zap, BarChart2 } from 'lucide-react';
import Cart from './Cart';
import { CartItem as CartItemType, Drug } from '../types';

interface DrugCardProps {
  drug: Drug;
}

const DrugCard: React.FC<DrugCardProps> = ({ drug }) => {
  // Cart state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  // Compute net and positive flag
  const net = drug.acq - drug.awp;
  const netPositive = net >= 0;

  // Handler: add this drug to cart
  const handleAddToCart = () => {
    // Check if already in cart
    const exists = cartItems.find(item => item.drug.id === drug.id);
    if (exists) {
      // bump quantity
      setCartItems(items =>
        items.map(item =>
          item.drug.id === drug.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems(items => [...items, { drug, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  // Cart callbacks
  const handleCloseCart = () => setIsCartOpen(false);
  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.drug.id === id ? { ...item, quantity } : item
      )
    );
  };
  const handleRemove = (id: string) => {
    setCartItems(items => items.filter(item => item.drug.id !== id));
  };
  const handleCheckout = () => {
    // implement checkout logic
    console.log('Proceeding to checkout with items:', cartItems);
    // close cart after action
    setIsCartOpen(false);
  };

  return (
    <>      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ACQ */}
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <dl>
            <dt className="text-sm font-medium text-gray-500">ACQ</dt>
            <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
              ${drug.acq.toFixed(2)}
            </dd>
          </dl>
        </div>

        {/* AWP */}
        <div className="flex items-center space-x-2">
          <Percent className="h-5 w-5 text-gray-400" />
          <dl>
            <dt className="text-sm font-medium text-gray-500">AWP</dt>
            <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
              ${drug.awp}
            </dd>
          </dl>
        </div>

        {/* Strength */}
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-gray-400" />
          <dl>
            <dt className="text-sm font-medium text-gray-500">Strength</dt>
            <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
              {drug.strength}
            </dd>
          </dl>
        </div>

        {/* Net with bar */}
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500">Net</dt>
              <dd
                className={`mt-1 text-base font-semibold ${
                  netPositive ? 'text-gray-800' : 'text-red-600'
                }`}
              >
                {netPositive ? '+' : '-'}${Math.abs(net).toFixed(2)}
              </dd>
            </dl>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded mt-1">
              <div
                className={`h-2 rounded ${
                  netPositive ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min((drug.acq / drug.awp) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="p-4 flex items-center justify-end">
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        items={cartItems}
        onClose={handleCloseCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
      />
    </>
  );
};

export default DrugCard;
