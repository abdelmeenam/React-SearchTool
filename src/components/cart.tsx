import { useCart } from '../context/CartContext';

const Cart = () => {
  const {
    cartItems,
    isCartOpen,
    updateQuantity,
    removeFromCart,
    closeCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed right-0 top-0 w-96 bg-white shadow-lg">
      <button onClick={closeCart}>Close</button>
      {cartItems.map(item => (
        <div key={item.drug.id}>
          {item.drug.name} - {item.quantity}
          <button onClick={() => updateQuantity(item.drug.id, item.quantity + 1)}>+</button>
          <button onClick={() => updateQuantity(item.drug.id, item.quantity - 1)}>-</button>
          <button onClick={() => removeFromCart(item.drug.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};