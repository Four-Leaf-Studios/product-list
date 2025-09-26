import { useEffect, useState } from "preact/hooks";
import { useConfigContext } from "@/context/ConfigContext";
import { useSortDropdownContext } from "@/context/SortDropdownContext";
import RenderLogger from "@/components/RenderLogger";

const Sort = () => {
  const { api } = useConfigContext();
  const { sort, setSort } = useSortDropdownContext();
  const [options, setOptions] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    let active = true;
    api.loadSortOptions().then((opts) => {
      if (active) setOptions(opts);
    });
    return () => {
      active = false;
    };
  }, [api]);

  return (
    <div class="sort">
      <RenderLogger name="Sort" />
      <select
        class="sort__select"
        value={sort}
        onChange={(e) => setSort((e.target as HTMLSelectElement).value)}
      >
        <option value="">Sort by…</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Sort;
