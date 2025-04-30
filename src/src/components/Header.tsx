import React from 'react';
import { ShoppingCart, Pill, Menu, X } from 'lucide-react';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Pill className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-blue-600">MediScript</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                <li><a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Medications</a></li>
                <li><a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Prescriptions</a></li>
                <li><a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">About</a></li>
              </ul>
            </nav>
            
            <button 
              onClick={onCartClick}
              className="relative p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={onCartClick}
              className="relative p-2 mr-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-blue-600" />
              ) : (
                <Menu className="h-5 w-5 text-blue-600" />
              )}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <nav className="mt-4 pb-4 md:hidden">
            <ul className="flex flex-col space-y-3">
              <li><a href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">Home</a></li>
              <li><a href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">Medications</a></li>
              <li><a href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">Prescriptions</a></li>
              <li><a href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">About</a></li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;