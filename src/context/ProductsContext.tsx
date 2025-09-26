// src/context/ProductsContext.tsx
import { createContext } from "preact";
import { useContext, useMemo, useState, useEffect } from "preact/hooks";
import type { PropsWithChildren } from "preact/compat";
import type { FilterOption, LoadProductsOptions, Product } from "@/types";
import { useConfigContext } from "./ConfigContext";
import { useAsyncQuery } from "@/hooks/useAsyncQuery";
import { useSearchContext } from "./SearchContext";
import { useFiltersContext } from "./FiltersContext";
import { useSortDropdownContext } from "./SortDropdownContext";

type ProductsContextValue = {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refetch: (page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  page: number;
  setPage: (page: number) => void;
  availableFilters: FilterOption[];
};

const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined
);

export const ProductsProvider = ({ children }: PropsWithChildren) => {
  const { api, pagination } = useConfigContext();
  const { query } = useSearchContext();
  const { filters } = useFiltersContext();
  const { sort } = useSortDropdownContext();

  const [products, setProducts] = useState<Product[]>([]);
  const [availableFilters, setAvailableFilters] = useState<FilterOption[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { run, loading, error } = useAsyncQuery<
    { products: Product[]; filters?: FilterOption[] },
    LoadProductsOptions
  >(api.loadProducts);

  useEffect(() => {
    setPage(1);
    run({
      page: 1,
      pageSize: pagination?.pageSize,
      query,
      filters,
      sort,
    }).then((result) => {
      if (result) {
        setProducts(result.products);
        setAvailableFilters(result.filters ?? []);
        setHasMore(result.products.length >= (pagination?.pageSize ?? 0));
      }
    });
  }, [query, filters, sort, pagination?.pageSize, run, api]);

  const refetch = async (targetPage = 1) => {
    const result = await run({
      page: targetPage,
      pageSize: pagination?.pageSize,
      query,
      filters,
      sort,
    });
    if (result) {
      setProducts(result.products);
      setAvailableFilters(result.filters ?? []);
      setHasMore(result.products.length >= (pagination?.pageSize ?? 0));
      setPage(targetPage);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    const result = await run({
      page: nextPage,
      pageSize: pagination?.pageSize,
      query,
      filters,
      sort,
    });
    if (result) {
      setProducts((prev) => [...prev, ...result.products]);
      setHasMore(result.products.length >= (pagination?.pageSize ?? 0));
      if (result.filters) setAvailableFilters(result.filters);
      setPage(nextPage);
    }
  };

  const value = useMemo(
    () => ({
      products,
      availableFilters,
      loading,
      error,
      refetch,
      loadMore,
      hasMore,
      page,
      setPage,
    }),
    [products, availableFilters, loading, error, hasMore, page]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx)
    throw new Error("useProductsContext must be used inside ProductsProvider");
  return ctx;
};
