// src/context/CartContext.tsx
import React, { createContext, useContext, useState } from 'react'
import { CartItem, Drug } from '../src/types'

interface CartContextType {
  items: CartItem[]
  addToCart: (drug: Drug) => void
  remove: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  isCheckoutOpen: boolean
  openCheckout: () => void
  closeCheckout: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const openCheckout = () => setIsCheckoutOpen(true)
  const closeCheckout = () => setIsCheckoutOpen(false)

  const addToCart = (drug: Drug) => {
    console.log('Adding drug:', drug)
    setItems(cur => {
      console.log('Current cart before update:', cur)
      const ex = cur.find(i => i.drug.id === drug.id)
      if (ex) {
        const updated = cur.map(i => 
          i.drug.id === drug.id ? { ...i, quantity: i.quantity + 1 } : i
        )
        console.log('Cart after quantity increment:', updated)
        return updated
      }
      const added = [...cur, { drug, quantity: 1 }]
      console.log('Cart after new item:', added)
      return added
    })
    openCart()
  }

  const remove = (id: string) =>
    setItems(cur => cur.filter(i => i.drug.id !== id))

  const updateQuantity = (id: string, qty: number) =>
    setItems(cur => cur.map(i => i.drug.id === id ? { ...i, quantity: qty } : i))

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addToCart, 
        remove, 
        updateQuantity, 
        isOpen, 
        openCart, 
        closeCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}