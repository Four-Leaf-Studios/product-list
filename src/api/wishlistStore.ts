// api/wishlistStore.ts
import type { Product } from "@/types";

let wishlist: Product[] = [];
let wishlistListeners: Array<(wishlist: Product[]) => void> = [];

export const wishlistApi = {
  getWishlist: async () => wishlist,
  subscribeToWishlist: (cb: (wishlist: Product[]) => void) => {
    wishlistListeners.push(cb);
    cb(wishlist);
    return () => {
      wishlistListeners = wishlistListeners.filter((l) => l !== cb);
    };
  },
  addToWishlist: async (product: Product) => {
    wishlist = [...wishlist, product];
    wishlistListeners.forEach((cb) => cb(wishlist));
  },
  removeFromWishlist: async (product: Product) => {
    wishlist = wishlist.filter((p) => p.id !== product.id);
    wishlistListeners.forEach((cb) => cb(wishlist));
  },
};
