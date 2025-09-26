import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  type PropsWithChildren,
} from "preact/compat";

type SearchContextValue = {
  query: string;
  setQuery: (q: string) => void;
  clear: () => void;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export const SearchProvider = ({ children }: PropsWithChildren) => {
  const [query, setQueryState] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") ?? "";
  });

  const [pending, setPending] = useState(query);

  // Keep state in sync if user navigates with back/forward buttons
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setQueryState(params.get("q") ?? "");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Debounce URL updates
  useEffect(() => {
    const handler = setTimeout(() => {
      if (pending.length >= 3 || pending.length === 0) {
        const params = new URLSearchParams(window.location.search);
        if (pending.trim()) {
          params.set("q", pending);
        } else {
          params.delete("q");
        }
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, "", newUrl);
        setQueryState(pending);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [pending]);

  const setQuery = (q: string) => {
    setPending(q);
  };

  const clear = () => setQuery("");

  const value = useMemo(
    () => ({
      query,
      setQuery,
      clear,
    }),
    [query]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearchContext must be used inside SearchProvider");
  }
  return ctx;
};
