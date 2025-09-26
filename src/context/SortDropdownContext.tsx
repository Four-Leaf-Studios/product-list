// src/context/SortDropdownContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "preact/compat";

type SortContextValue = {
  sort: string;
  setSort: (value: string) => void;
  clearSort: () => void;
};

const SortDropdownContext = createContext<SortContextValue | undefined>(
  undefined
);

export const SortDropdownProvider = ({ children }: PropsWithChildren) => {
  const [sort, setSortState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("sort") || "";
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
  }, [sort]);

  const setSort = (value: string) => setSortState(value);
  const clearSort = () => setSortState("");

  const value = useMemo(() => ({ sort, setSort, clearSort }), [sort]);

  return (
    <SortDropdownContext.Provider value={value}>
      {children}
    </SortDropdownContext.Provider>
  );
};

export const useSortDropdownContext = () => {
  const ctx = useContext(SortDropdownContext);
  if (!ctx)
    throw new Error(
      "useSortDropdownContext must be used in SortDropdownProvider"
    );
  return ctx;
};
