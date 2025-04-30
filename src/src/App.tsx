import React, { useState } from 'react';
import { CartItem, PatientInfo, PrescriptionInfo, OrderSummary } from './types';
import { drugs } from './data/drugs';
import { generateOrderId, formatDate, calculateSubtotal, calculateTax, calculateTotal } from './utils/helpers';
import Header from './components/Header';
import DrugsList from './components/DrugsList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Receipt from './components/Receipt';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [view, setView] = useState<'shopping' | 'checkout' | 'receipt'>('shopping');
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  const handleAddToCart = (drug: CartItem['drug']) => {
    const existingItem = cartItems.find(item => item.drug.id === drug.id);
    
    if (existingItem) {
      const updatedItems = cartItems.map(item => 
        item.drug.id === drug.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, { drug, quantity: 1 }]);
    }
    
    setIsCartOpen(true);
  };
  
  const handleUpdateCartItemQuantity = (id: string, quantity: number) => {
    const updatedItems = cartItems.map(item => 
      item.drug.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
  };
  
  const handleRemoveCartItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.drug.id !== id);
    setCartItems(updatedItems);
  };
  
  const handleCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
  };
  
  const handleCompleteCheckout = (patientInfo: PatientInfo, prescriptionInfo: PrescriptionInfo) => {
    const subtotal = calculateSubtotal(cartItems);
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);
    
    const order: OrderSummary = {
      orderId: generateOrderId(),
      orderDate: formatDate(new Date()),
      patientInfo,
      prescriptionInfo,
      items: [...cartItems],
      subtotal,
      tax,
      total
    };
    
    setOrderSummary(order);
    setView('receipt');
  };
  
  const handleReturnToShopping = () => {
    setCartItems([]);
    setView('shopping');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {view === 'shopping' && (
        <>
          <Header 
            cartItemsCount={cartItems.reduce((total, item) => total + item.quantity, 0)} 
            onCartClick={() => setIsCartOpen(true)} 
          />
          
          <DrugsList drugs={drugs} onAddToCart={handleAddToCart} />
          
          <Cart 
            isOpen={isCartOpen} 
            items={cartItems} 
            onClose={() => setIsCartOpen(false)} 
            onUpdateQuantity={handleUpdateCartItemQuantity} 
            onRemove={handleRemoveCartItem} 
            onCheckout={handleCheckout} 
          />
        </>
      )}
      
      {view === 'checkout' && (
        <Checkout 
          items={cartItems} 
          onBack={() => setView('shopping')} 
          onComplete={handleCompleteCheckout} 
        />
      )}
      
      {view === 'receipt' && orderSummary && (
        <Receipt 
          orderSummary={orderSummary} 
          onReturnToShopping={handleReturnToShopping} 
        />
      )}
    </div>
  );
}

export default App;