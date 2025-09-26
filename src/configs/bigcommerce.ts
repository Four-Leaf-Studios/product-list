import type {
  Config,
  LoadProductsOptions,
  Product,
  SortOption,
  FilterOption,
} from "@/types";

export type BigCommerceConfigOptions = {
  apiUrl: string; // e.g. https://api.bigcommerce.com/stores/{hash}/v3
  token: string; // X-Auth-Token (API Account)
  clientId: string; // X-Auth-Client
} & Partial<Config>;

function applyBCFilters(url: URL, filters: Record<string, string[]>) {
  for (const [key, values] of Object.entries(filters || {})) {
    if (!values?.length) continue;
    switch (key) {
      case "brand_id":
      case "brand":
        url.searchParams.set("brand_id:in", values.join(","));
        break;
      case "categories":
      case "category_id":
      case "category":
        url.searchParams.set("categories:in", values.join(","));
        break;
      case "name":
        // partial match
        url.searchParams.set("name:like", values[0]);
        break;
      case "inStock":
      case "available":
        // BigCommerce inventory is nuanced; a rough approximation:
        if (values[0]?.toLowerCase() === "true") {
          url.searchParams.set("inventory_level:greater", "0");
        }
        break;
      default:
        // Generic 'in' filter on arbitrary field (if supported)
        url.searchParams.set(`${key}:in`, values.join(","));
    }
  }
}

export function createBigCommerceConfig({
  apiUrl,
  token,
  clientId,
  ...overrides
}: BigCommerceConfigOptions): Config {
  const loadProducts = async ({
    page = 1,
    pageSize = 8,
    query = "",
    filters = {},
    sort = "",
  }: LoadProductsOptions = {}): Promise<Product[]> => {
    const url = new URL(`${apiUrl}/catalog/products`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(pageSize));
    url.searchParams.set("is_visible", "true");
    url.searchParams.set("include", "images");

    if (query) {
      url.searchParams.set("name:like", query);
    }

    applyBCFilters(url, filters);

    if (sort) {
      const [field, dir] = sort.split("-");
      url.searchParams.set("sort", field); // e.g., price, name, date_modified
      url.searchParams.set(
        "direction",
        (dir || "asc").toLowerCase() === "desc" ? "desc" : "asc"
      );
    }

    const res = await fetch(url.toString(), {
      headers: {
        "X-Auth-Token": token,
        "X-Auth-Client": clientId,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    const items = data?.data ?? [];

    const products: Product[] = items.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      description: p.description,
      price: Number(p.price ?? 0),
      currency: p.currency ?? undefined,
      image: p.images?.[0]?.url_standard ?? p.images?.[0]?.url_thumbnail,
      inStock: undefined, // could derive via inventory endpoint if needed
      rating: undefined,
      ...p,
    }));

    return products;
  };

  const defaultConfig: Config = {
    api: {
      loadProducts,
      loadFilters: async (): Promise<FilterOption[]> => [],
      loadSortOptions: async (): Promise<SortOption[]> => [
        { id: "price-asc", label: "Price: Low to High" },
        { id: "price-desc", label: "Price: High to Low" },
        { id: "name-asc", label: "Name: A → Z" },
        { id: "name-desc", label: "Name: Z → A" },
      ],
      getCart: async () => [],
      subscribeToCart: () => () => {},
      addToCart: async () => {},
      removeFromCart: async () => {},
      getWishlist: async () => [],
      subscribeToWishlist: () => () => {},
      addToWishlist: async () => {},
      removeFromWishlist: async () => {},
    },
    pagination: { pageSize: 8 },
    featureFlags: {
      addToCart: true,
      wishlist: true,
      filters: true,
      searchbar: true,
      sortOptions: true,
      callouts: false,
      carousel: false,
      virtualize: false,
      infiniteScroll: false,
      loadMoreButtons: true,
      pagination: true,
    },
    callouts: { items: [] },
    search: { debounceMs: 300, placeholder: "Search products..." },
    slots: {},
  };

  return { ...defaultConfig, ...overrides };
}
