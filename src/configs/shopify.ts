import type {
  Config,
  LoadProductsOptions,
  Product,
  SortOption,
  FilterOption,
} from "@/types";

export type ShopifyConfigOptions = {
  storeDomain: string; // myshop.myshopify.com
  storefrontToken: string; // Storefront access token
  apiVersion?: string; // default "2024-07" (adjust as needed)
} & Partial<Config>;

const mapSort = (sort?: string): { sortKey?: string; reverse?: boolean } => {
  if (!sort) return {};
  const [field, dir] = sort.split("-");
  const reverse = (dir || "asc").toLowerCase() === "desc";
  switch (field) {
    case "price":
      return { sortKey: "PRICE", reverse };
    case "name":
      return { sortKey: "TITLE", reverse };
    case "date":
      return { sortKey: "CREATED_AT", reverse };
    default:
      return {}; // let Shopify default/relevance kick in
  }
};

// Convert { key: ["A","B"] } into Shopify query fragments
// Example mappings:
//  - tag -> tag:'A' OR tag:'B'
//  - product_type -> product_type:'Shirts'
//  - vendor -> vendor:'Acme'
//  - available -> available:true
function filtersToShopifyQuery(filters: Record<string, string[]>): string[] {
  const parts: string[] = [];
  for (const [k, values] of Object.entries(filters || {})) {
    if (!values?.length) continue;
    switch (k) {
      case "tag":
      case "tags": {
        const ors = values.map((v) => `tag:'${escapeQuote(v)}'`);
        parts.push(ors.length > 1 ? `(${ors.join(" OR ")})` : ors[0]);
        break;
      }
      case "product_type": {
        const ors = values.map((v) => `product_type:'${escapeQuote(v)}'`);
        parts.push(ors.length > 1 ? `(${ors.join(" OR ")})` : ors[0]);
        break;
      }
      case "vendor": {
        const ors = values.map((v) => `vendor:'${escapeQuote(v)}'`);
        parts.push(ors.length > 1 ? `(${ors.join(" OR ")})` : ors[0]);
        break;
      }
      case "available": {
        // expect values like ["true"] or ["false"]
        const v = values[0]?.toLowerCase() === "true" ? "true" : "false";
        parts.push(`available:${v}`);
        break;
      }
      default: {
        // Fall back to generic text search on title
        const ors = values.map((v) => `title:'${escapeQuote(v)}'`);
        parts.push(ors.length > 1 ? `(${ors.join(" OR ")})` : ors[0]);
      }
    }
  }
  return parts;
}

function escapeQuote(s: string) {
  return s.replace(/'/g, "\\'");
}

export function createShopifyConfig({
  storeDomain,
  storefrontToken,
  apiVersion = "2024-07",
  ...overrides
}: ShopifyConfigOptions): Config {
  const endpoint = `https://${storeDomain}/api/${apiVersion}/graphql.json`;

  const loadProducts = async ({
    page = 1,
    pageSize = 8,
    query = "",
    filters = {},
    sort = "",
  }: LoadProductsOptions = {}): Promise<Product[]> => {
    // Build Shopify query string
    const filterFragments = filtersToShopifyQuery(filters);
    const terms: string[] = [];
    if (query) terms.push(`"${query}"`); // free text
    terms.push(...filterFragments);
    const shopifyQuery = terms.length ? terms.join(" AND ") : undefined;

    // sort mapping
    const { sortKey, reverse } = mapSort(sort);

    // Naive pagination: request first = page * pageSize, then slice last pageSize
    const first = page * pageSize;

    const gql = `
      query Products($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
        products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
          edges {
            node {
              id
              title
              handle
              description
              images(first: 1) { edges { node { url(transform: { maxWidth: 800 }) } } }
              priceRange {
                minVariantPrice { amount currencyCode }
              }
              availableForSale
            }
          }
        }
      }`;

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontToken,
      },
      body: JSON.stringify({
        query: gql,
        variables: { first, query: shopifyQuery, sortKey, reverse },
      }),
    });
    const json = await resp.json();
    const nodes: any[] =
      json?.data?.products?.edges?.map((e: any) => e.node) ?? [];

    // slice to requested page
    const start = Math.max(0, nodes.length - pageSize);
    const pageItems = nodes.slice(start);

    const products: Product[] = pageItems.map((n) => ({
      id: n.id,
      name: n.title,
      description: n.description,
      price: Number(n.priceRange?.minVariantPrice?.amount ?? 0),
      currency: n.priceRange?.minVariantPrice?.currencyCode,
      image: n.images?.edges?.[0]?.node?.url,
      inStock: !!n.availableForSale,
      rating: undefined,
      ...n,
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
    icons: {},
  };

  return { ...defaultConfig, ...overrides };
}
