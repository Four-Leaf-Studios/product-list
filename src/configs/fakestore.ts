import type { Config, Product } from "@/types";

type FakeStoreOptions = {
  baseUrl?: string;
  userId?: number; // Fake Store carts are tied to a userId
};

export function createFakeStoreConfig({
  baseUrl = "https://fakestoreapi.com",
  userId = 1,
}: FakeStoreOptions = {}): Config {
  let cart: Product[] = [];
  let listeners: Array<(c: Product[]) => void> = [];

  function notify() {
    listeners.forEach((cb) => cb(cart));
  }

  return {
    api: {
      // ---------------- Products ----------------
      loadProducts: async ({ page = 1, pageSize = 8, query, sort } = {}) => {
        const res = await fetch(`${baseUrl}/products`);
        let data: any[] = await res.json();

        if (query) {
          data = data.filter((p) =>
            p.title.toLowerCase().includes(query.toLowerCase())
          );
        }

        if (sort === "price-asc") data.sort((a, b) => a.price - b.price);
        if (sort === "price-desc") data.sort((a, b) => b.price - a.price);
        if (sort === "name-asc")
          data.sort((a, b) => a.title.localeCompare(b.title));
        if (sort === "name-desc")
          data.sort((a, b) => b.title.localeCompare(a.title));

        const start = (page - 1) * pageSize;
        const products: Product[] = data
          .slice(start, start + pageSize)
          .map((p) => ({
            id: String(p.id),
            name: p.title,
            description: p.description,
            price: p.price,
            currency: "USD",
            image: p.image,
            inStock: true,
          }));

        return {
          products,
          filters: [], // FakeStore has no facets
        };
      },

      loadFilters: async () => {
        const res = await fetch(`${baseUrl}/products/categories`);
        const categories: string[] = await res.json();
        return [{ id: "category", label: "Category", values: categories }];
      },

      loadSortOptions: async () => [
        { id: "price-asc", label: "Price: Low to High" },
        { id: "price-desc", label: "Price: High to Low" },
        { id: "name-asc", label: "Name: A → Z" },
        { id: "name-desc", label: "Name: Z → A" },
      ],

      // ---------------- Cart ----------------
      getCart: async () => {
        const res = await fetch(`${baseUrl}/carts/user/${userId}`);
        const carts = await res.json();
        const latest = carts[carts.length - 1];
        const products: Product[] =
          latest?.products?.map((p: any) => ({
            id: String(p.productId),
            name: `Product ${p.productId}`, // if you want, you can refetch details
            price: 0,
          })) ?? [];
        cart = products;
        notify();
        return cart;
      },

      subscribeToCart: (cb) => {
        listeners.push(cb);
        cb(cart);
        return () => {
          listeners = listeners.filter((l) => l !== cb);
        };
      },

      addToCart: async ({ item }) => {
        cart = [...cart, item];
        notify();
        await fetch(`${baseUrl}/carts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            date: new Date().toISOString(),
            products: cart.map((c) => ({
              productId: Number(c.id),
              quantity: 1,
            })),
          }),
        });
      },

      removeFromCart: async ({ item }) => {
        cart = cart.filter((c) => c.id !== item.id);
        notify();
        await fetch(`${baseUrl}/carts/1`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            date: new Date().toISOString(),
            products: cart.map((c) => ({
              productId: Number(c.id),
              quantity: 1,
            })),
          }),
        });
      },

      // ---------------- Wishlist (not supported → fallback) ----------------
      getWishlist: async () => [],
      subscribeToWishlist: () => () => {},
      addToWishlist: async () => {},
      removeFromWishlist: async () => {},
    },

    pagination: { pageSize: 8 },
    featureFlags: {
      addToCart: true,
      wishlist: false,
      filters: true,
      searchbar: true,
      sortOptions: true,
      callouts: false,
      carousel: false,
      virtualize: false,
      infiniteScroll: false,
      loadMoreButtons: true,
      pagination: false,
    },
    callouts: { items: [] },
    search: { debounceMs: 300, placeholder: "Search products..." },
    slots: {},
  };
}
