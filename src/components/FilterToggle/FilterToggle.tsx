// src/components/FilterToggle/FilterToggle.tsx
import { useFiltersContext } from "@/context/FiltersContext";

const FilterToggle = () => {
  const { open, toggle } = useFiltersContext();

  return (
    <button
      type="button"
      className="product-wishlist-btn" // reuse button styling
      onClick={toggle}
    >
      {open ? "Hide Filters" : "Show Filters"}
    </button>
  );
};

export default FilterToggle;
