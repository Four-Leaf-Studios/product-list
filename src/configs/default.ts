// src/configs/default.ts
import type { Config } from "@/types";

export const defaultConfig: Config = {
  api: {
    loadProducts: async () => ({ products: [], filters: [] }),
    loadFilters: async () => [],
    loadSortOptions: async () => [],

    getCart: async () => [],
    subscribeToCart: () => () => {},
    addToCart: async () => {},
    removeFromCart: async () => {},

    getWishlist: async () => [],
    subscribeToWishlist: () => () => {},
    addToWishlist: async () => {},
    removeFromWishlist: async () => {},
  },

  callouts: { items: [] },

  featureFlags: {
    addToCart: false,
    wishlist: false,
    filters: false,
    searchbar: false,
    sortOptions: false,
    callouts: false,
    carousel: false,
    virtualize: false,
    infiniteScroll: false,
    loadMoreButtons: false,
    pagination: false,
  },

  pagination: { pageSize: 8 },
  search: { debounceMs: 300, placeholder: "Search..." },
  slots: {},
  icons: {},
};
