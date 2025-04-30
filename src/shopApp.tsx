import React, { useState } from 'react';
import { CartItem, PatientInfo, PrescriptionInfo, OrderSummary, Drug } from './src/types';
import { drugs } from './src/data/drugs';
import { generateOrderId, formatDate, calculateSubtotal, calculateTax, calculateTotal } from './src/utils/helpers';
import Header from './src/components/Header';
import DrugsList from './src/components/DrugsList';
import Cart from './src/components/Cart';
import Checkout from './src/components/Checkout';
import Receipt from './src/components/Receipt';

const ShopApp: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<'shopping' | 'checkout' | 'receipt'>('shopping');
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  const handleAddToCart = (drug: Drug) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.drug.id === drug.id);
      if (exists) {
        return prev.map((item) =>
          item.drug.id === drug.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { drug, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    setCartItems(cs =>
      cs.map(i => (i.drug.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const handleRemove = (id: string) => {
    setCartItems(cs => cs.filter(i => i.drug.id !== id));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
  };

  const handleComplete = (patientInfo: PatientInfo, prescriptionInfo: PrescriptionInfo) => {
    const subtotal = calculateSubtotal(cartItems);
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);
    const order: OrderSummary = {
      orderId: generateOrderId(),
      orderDate: formatDate(new Date()),
      patientInfo,
      prescriptionInfo,
      items: cartItems,
      subtotal,
      tax,
      total,
    };
    setOrderSummary(order);
    setView('receipt');
  };

  const handleReturn = () => {
    setCartItems([]);
    setView('shopping');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {view === 'shopping' && (
        <>
          <Header
            cartItemsCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
            onCartClick={() => setIsCartOpen(true)}
          />
          <DrugsList drugs={drugs} onAddToCart={handleAddToCart} />
          <Cart
            isOpen={isCartOpen}
            items={cartItems}
            onClose={() => setIsCartOpen(false)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
            onCheckout={handleCheckout}
          />
        </>
      )}

      {view === 'checkout' && (
        <Checkout
          items={cartItems}
          onBack={() => setView('shopping')}
          onComplete={handleComplete}
        />
      )}

      {view === 'receipt' && orderSummary && (
        <Receipt
          orderSummary={orderSummary}
          onReturnToShopping={handleReturn}
        />
      )}
    </div>
  );
};

export default ShopApp;
