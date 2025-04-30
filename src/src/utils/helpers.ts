import { CartItem } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.drug.price * item.quantity, 0);
};

export const calculateTax = (subtotal: number): number => {
  return subtotal * 0.07; // 7% tax rate
};

export const calculateTotal = (subtotal: number, tax: number): number => {
  return subtotal + tax;
};

export const generateOrderId = (): string => {
  return `RX-${Math.floor(100000 + Math.random() * 900000)}`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};