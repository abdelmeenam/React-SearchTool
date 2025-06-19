import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "../types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false); // <- NEW
  
    useEffect(() => {
      const stored = localStorage.getItem("cart");
      if (stored) setCartItems(JSON.parse(stored));
      setIsLoaded(true); // <- only after loading from localStorage
    }, []);
  
    useEffect(() => {
      if (isLoaded) {
        localStorage.setItem("cart", JSON.stringify(cartItems));
      }
    }, [cartItems, isLoaded]);
  
    const addToCart = (item: CartItem) => {
      setCartItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        }
        return [...prev, item];
      });
    };
  
    const clearCart = () => setCartItems([]);
  
    // Don't render children until loaded
    if (!isLoaded) return null;
  
    return (
      <CartContext.Provider value={{ cartItems, addToCart, clearCart, setCartItems }}>
        {children}
      </CartContext.Provider>
    );
  };

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
