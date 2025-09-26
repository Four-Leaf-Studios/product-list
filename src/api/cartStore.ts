// api/cartStore.ts
import type { Product } from "@/types";

let cart: Product[] = [];
let cartListeners: Array<(cart: Product[]) => void> = [];

export const cartApi = {
  getCart: async () => cart,
  subscribeToCart: (cb: (cart: Product[]) => void) => {
    cartListeners.push(cb);
    cb(cart); // emit immediately
    return () => {
      cartListeners = cartListeners.filter((l) => l !== cb);
    };
  },
  addToCart: async (product: Product) => {
    cart = [...cart, product];
    cartListeners.forEach((cb) => cb(cart));
  },
  removeFromCart: async (product: Product) => {
    cart = cart.filter((p) => p.id !== product.id);
    cartListeners.forEach((cb) => cb(cart));
  },
};
