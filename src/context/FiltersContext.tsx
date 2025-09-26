// src/context/FiltersContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "preact/compat";

type FiltersState = Record<string, string[]>;

type FiltersContextValue = {
  filters: FiltersState;
  open: boolean;
  toggle: () => void;
  close: () => void;
  setFilter: (key: string, values: string[]) => void;
  clearFilters: () => void;
  setFilters: (next: FiltersState) => void;
};

const FiltersContext = createContext<FiltersContextValue | undefined>(
  undefined
);

export const FiltersProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState<FiltersState>(() => {
    const params = new URLSearchParams(window.location.search);
    const entries: FiltersState = {};
    params.forEach((value, key) => {
      if (key.startsWith("filter_")) {
        const filterKey = key.replace("filter_", "");
        entries[filterKey] = value.split(",");
      }
    });
    return entries;
  });

  // keep filters synced to query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(`filter_${key}`, values.join(","));
      } else {
        params.delete(`filter_${key}`);
      }
    });
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
  }, [filters]);

  const setFilter = (key: string, values: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
  };

  const clearFilters = () => setFilters({});

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  const value = useMemo(
    () => ({
      filters,
      open,
      toggle,
      close,
      setFilter,
      clearFilters,
      setFilters,
    }),
    [filters, open]
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};

export const useFiltersContext = () => {
  const ctx = useContext(FiltersContext);
  if (!ctx)
    throw new Error("useFiltersContext must be used in FiltersProvider");
  return ctx;
};
