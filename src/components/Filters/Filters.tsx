import { useEffect, useState } from "preact/hooks";
import { useConfigContext } from "@/context/ConfigContext";
import { useFiltersContext } from "@/context/FiltersContext";
import { useProductsContext } from "@/context/ProductsContext";
import RenderLogger from "@/components/RenderLogger";
import type { FilterOption } from "@/types";

const Filters = () => {
  const { api } = useConfigContext();
  const { filters, setFilters } = useFiltersContext();
  const { availableFilters } = useProductsContext();

  const [options, setOptions] = useState<FilterOption[]>([]);

  useEffect(() => {
    if (availableFilters.length > 0) {
      setOptions(availableFilters);
    } else {
      let active = true;
      api.loadFilters().then((opts) => {
        if (active) setOptions(opts);
      });
      return () => {
        active = false;
      };
    }
  }, [api, availableFilters]);

  const toggleFilter = (id: string, value: string) => {
    const prev = filters[id] || [];
    const newValues = prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value];

    setFilters({ ...filters, [id]: newValues });
  };

  return (
    <div class="filters">
      <RenderLogger name="Filters" />
      {options.map((filter) => (
        <div key={filter.id} class="filters__group">
          <h4 class="filters__label">{filter.label}</h4>
          <div class="filters__options">
            {filter.values.map((v) => (
              <label key={v.label} class="filters__option">
                <input
                  type="checkbox"
                  checked={filters[filter.id]?.includes(v.label) ?? false}
                  onChange={() => toggleFilter(filter.id, v.label)}
                />
                {v.label} {v.count !== undefined ? `(${v.count})` : ""}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Filters;
