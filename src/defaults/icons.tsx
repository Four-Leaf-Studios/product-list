// defaults/icons.tsx

export const defaultIcons = {
  wishlist: {
    add: () => <span>♡</span>,
    remove: () => <span>♥</span>,
  },
  cart: {
    add: () => <span>🛒</span>,
    remove: () => <span>✖</span>,
  },
  filters: {
    open: () => <span>☰</span>,
    close: () => <span>✕</span>,
  },
  search: {
    icon: () => <span>🔍</span>,
    clear: () => <span>✖</span>,
  },
} as const;
