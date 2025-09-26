import type {
  Config,
  FilterOption,
  LoadProductsOptions,
  Product,
  SortOption,
} from "@/types";

export function createAdobeCommerceConfig({
  commerceCoreEndpoint,
  environmentId,
  environmentType,
  apiKey,
  websiteCode,
  storeCode,
  storeViewCode,
  ...overrides
}: {
  commerceCoreEndpoint: string;
  environmentId: string;
  environmentType: string;
  apiKey: string;
  websiteCode: string;
  storeCode: string;
  storeViewCode: string;
} & Partial<Config>): Config {
  const productSearchQuery = `
    query productSearch(
      $phrase: String!,
      $pageSize: Int,
      $currentPage: Int,
      $filter: [SearchClauseInput!],
      $sort: [ProductSearchSortInput!],
      $context: QueryContextInput
    ) {
      productSearch(
        phrase: $phrase,
        page_size: $pageSize,
        current_page: $currentPage,
        filter: $filter,
        sort: $sort,
        context: $context
      ) {
        total_count
        items {
          productView {
            sku
            name
            inStock
            images { url }

            ... on SimpleProductView {
              price {
                final { amount { value currency } }
                regular { amount { value currency } }
              }
            }

            ... on ComplexProductView {
              priceRange {
                minimum {
                  final { amount { value currency } }
                }
                maximum {
                  final { amount { value currency } }
                }
              }
            }
          }
        }
        facets {
          title
          attribute
          buckets {
            __typename
            title
            ... on CategoryView { name count path }
            ... on ScalarBucket { count }
            ... on RangeBucket { from to count }
            ... on StatsBucket { min max }
          }
        }
      }
    }
  `;

  const loadProducts = async ({
    page = 1,
    pageSize = 8,
    query = "",
    filters = {},
    sort,
  }: LoadProductsOptions = {}): Promise<{
    products: Product[];
    filters: FilterOption[];
  }> => {
    const filter: any[] = [
      {
        attribute: "visibility",
        in: ["Catalog", "Catalog, Search"],
      },
      ...Object.entries(filters).map(([attribute, values]) =>
        values.length === 1
          ? { attribute, eq: values[0] }
          : { attribute, in: values }
      ),
    ];

    const sortInput = sort
      ? [
          {
            attribute: sort.split("-")[0],
            direction: sort.split("-")[1]?.toUpperCase() || "ASC",
          },
        ]
      : [{ attribute: "relevance", direction: "DESC" }];

    const variables = {
      phrase: query ?? "",
      pageSize,
      currentPage: page,
      filter,
      sort: sortInput,
      context: { customerGroup: "" },
    };

    const res = await fetch(commerceCoreEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "Magento-Environment-Id": environmentId,
        "Magento-Website-Code": websiteCode,
        "Magento-Store-Code": storeCode,
        "Magento-Store-View-Code": storeViewCode,
        ...(environmentType
          ? { "Magento-Environment-Type": environmentType }
          : {}),
      },
      body: JSON.stringify({ query: productSearchQuery, variables }),
    });

    const data = await res.json();
    const items = data?.data?.productSearch?.items ?? [];
    const facets = data?.data?.productSearch?.facets ?? [];

    const products: Product[] = items.map((i: any) => ({
      id: i.productView?.sku,
      name: i.productView?.name,
      price:
        i.productView?.price?.final?.amount?.value ??
        i.productView?.priceRange?.minimum?.final?.amount?.value ??
        0,
      currency:
        i.productView?.price?.final?.amount?.currency ??
        i.productView?.priceRange?.minimum?.final?.amount?.currency ??
        "USD",
      image: i.productView?.images?.[0]?.url,
      inStock: i.productView?.inStock,
    }));

    const filterOptions: FilterOption[] = facets.map((f: any) => ({
      id: f.attribute,
      label: f.title,
      values: f.buckets.map((b: any) => ({
        label: b.title,
        count: b.count, // may be undefined
      })),
    }));

    return { products, filters: filterOptions };
  };

  const defaultConfig: Config = {
    api: {
      loadProducts,
      loadFilters: async () => [], // no longer needed
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
      pagination: false,
    },
    callouts: { items: [] },
    search: { debounceMs: 300, placeholder: "Search products..." },
    slots: {},
  };

  return { ...defaultConfig, ...overrides };
}
