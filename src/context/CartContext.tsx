import type { Product } from "@/types";
import { useCart } from "@/hooks/useCart";
import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";

type CartContextValue = {
  cart: Product[];
  addToCart: (p: Product) => Promise<void>;
  removeFromCart: (p: Product) => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({
  children,
}: {
  children: preact.ComponentChildren;
}) => {
  const { cart, addToCart, removeFromCart } = useCart();

  const cartContext = useMemo(
    () => ({
      cart,
      addToCart: (p: Product) => addToCart({ item: p }),
      removeFromCart: (p: Product) => removeFromCart({ item: p }),
    }),
    [cart, addToCart, removeFromCart]
  );

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return ctx;
};
