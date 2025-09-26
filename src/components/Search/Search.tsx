import { useSearchContext } from "@/context/SearchContext";

function Search() {
  const { query, setQuery, clear } = useSearchContext();

  return (
    <div class="search">
      <input
        type="text"
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
        placeholder="Search products..."
        class="search-input"
      />
      {query && (
        <button onClick={clear} class="clear-btn">
          ✕
        </button>
      )}
    </div>
  );
}

export default Search;
