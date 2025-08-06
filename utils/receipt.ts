import { CartItem } from "../src/types"
export const generateReceiptText = (items: CartItem[]): string => {
  let receipt = "🧾 Receipt\n\n";
  let total = 0;
  for (const item of items) {
    const subtotal = item.quantity * item.price;
    total += subtotal;
    receipt += `${item.name} - ${item.quantity} x $${item.price.toFixed(
      2
    )} = $${subtotal.toFixed(2)}\n`;
  }
  receipt += `\nTotal: $${total.toFixed(2)}\n\nThank you for your purchase!`;
  return receipt;
};
