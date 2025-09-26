import type { VNode } from "preact";

// ----------------- Core Types -----------------
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  image?: string;
  inStock?: boolean;
  rating?: number;
  [key: string]: any;
}

// ----------------- API Option Types -----------------
export interface LoadProductsResult {
  products: Product[];
  filters?: FilterOption[]; // optional → not all backends will include facets
}

export interface LoadProductsOptions {
  signal?: AbortSignal;
  page?: number;
  pageSize?: number;

  /** Search query string */
  query?: string;

  /** Key-value pairs of filters (e.g. { category: ["Shirts"] }) */
  filters?: Record<string, string[]>;

  /** Sort option id (e.g. "price-asc", "name-desc") */
  sort?: string;
}

export interface LoadFiltersOptions {
  signal?: AbortSignal;
}

export interface LoadSortOptions {
  signal?: AbortSignal;
}

export interface SearchProductsOptions {
  signal?: AbortSignal;
  query: string;
}

export interface CartOptions {
  signal?: AbortSignal;
  item?: Product;
}

export interface WishlistOptions {
  signal?: AbortSignal;
  item?: Product;
}

// ----------------- Config -----------------
export interface Config {
  api: {
    // products
    loadProducts: (
      options?: LoadProductsOptions
    ) => Promise<LoadProductsResult>;
    loadFilters: (options?: LoadFiltersOptions) => Promise<FilterOption[]>; // can be no-op when facets come from loadProducts
    loadSortOptions: (options?: LoadSortOptions) => Promise<SortOption[]>;

    // cart
    getCart: (options?: { signal?: AbortSignal }) => Promise<Product[]>;
    subscribeToCart: (
      cb: (cart: Product[]) => void,
      options?: { signal?: AbortSignal }
    ) => () => void;
    addToCart: (options: {
      item: Product;
      signal?: AbortSignal;
    }) => Promise<void>;
    removeFromCart: (options: {
      item: Product;
      signal?: AbortSignal;
    }) => Promise<void>;

    // wishlist
    getWishlist: (options?: { signal?: AbortSignal }) => Promise<Product[]>;
    subscribeToWishlist: (
      cb: (wishlist: Product[]) => void,
      options?: { signal?: AbortSignal }
    ) => () => void;
    addToWishlist: (options: {
      item: Product;
      signal?: AbortSignal;
    }) => Promise<void>;
    removeFromWishlist: (options: {
      item: Product;
      signal?: AbortSignal;
    }) => Promise<void>;
  };

  callouts: CalloutsConfig;

  featureFlags: {
    addToCart: boolean;
    callouts: boolean;
    filters: boolean;
    searchbar: boolean;
    sortOptions: boolean;
    wishlist: boolean;
    carousel: boolean;
    virtualize: boolean;
    infiniteScroll?: boolean;
    loadMoreButtons?: boolean;
    pagination?: boolean;
  };

  pagination?: {
    pageSize: number;
  };

  search?: {
    debounceMs: number;
    placeholder?: string;
  };

  slots?: SlotsConfig;
  icons?: IconsConfig;

  /**
   * Image formatter to transform raw image URLs into backend-specific ones.
   * Example: Shopify → append `?width=400`, Adobe → wrap in Scene7 URL, etc.
   */
  imageFormatter?: (
    url: string,
    options?: { width?: number; height?: number }
  ) => string;
}

// ----------------- Slots -----------------
export interface SlotsConfig {
  Product?: (product: Product, extra?: any) => VNode;
  ProductList?: (products: Product[]) => VNode;
  Filter?: (filter: FilterOption, onChange: (value: string) => void) => VNode;
  Sort?: (
    options: SortOption[],
    onChange: (option: SortOption) => void
  ) => VNode;
  Callout?: (callout: CalloutItem) => VNode;
  WishlistButton?: (product: Product, inWishlist: boolean) => VNode;
  AddToCartButton?: (product: Product) => VNode;
  SearchBar?: (query: string, onChange: (value: string) => void) => VNode;
  Pagination?: (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
  ) => VNode;

  [key: string]: ((...args: any[]) => VNode) | VNode | undefined;
}

// ----------------- Supporting Types -----------------
export interface CalloutsConfig {
  items: CalloutItem[];
}

export interface CalloutItem {
  id: string;
  text: string;
  color: string;
  backgroundColor: string;
  backgroundImage: string;
  position: number;
}

export interface FilterOption {
  id: string;
  label: string;
  values: { label: string; count?: number }[];
}

export interface SortOption {
  id: string;
  label: string;
  direction?: "asc" | "desc";
}

export interface IconsConfig {
  wishlist?: {
    add: VNode | (() => VNode);
    remove: VNode | (() => VNode);
  };
  cart?: {
    add: VNode | (() => VNode);
    remove: VNode | (() => VNode);
  };
  filters?: {
    open: VNode | (() => VNode);
    close: VNode | (() => VNode);
  };
  search?: {
    icon: VNode | (() => VNode);
    clear: VNode | (() => VNode);
  };
  [key: string]:
    | VNode
    | (() => VNode)
    | Record<string, VNode | (() => VNode)>
    | undefined;
}

export type { Product as ProductType };
