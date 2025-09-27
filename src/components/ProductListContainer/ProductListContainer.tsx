import Filters from "@/components/Filters/Filters";
import FilterToggle from "@/components/FilterToggle/FilterToggle";
import Pagination from "@/components/Pagination/Pagination";
import ProductListFooter from "@/components/ProductListFooter/ProductListFooter";
import RenderLogger from "@/components/RenderLogger";
import Search from "@/components/Search/Search";
import Sort from "@/components/Sort/Sort";
import { useFiltersContext } from "@/context/FiltersContext";
import ProductList from "@/components/ProductList/ProductList";

const ProductListContainer = () => {
  const { open } = useFiltersContext();
  return (
    <div
      className={`product-list-container ${
        open ? "filters-open" : "filters-closed"
      }`}
    >
      <RenderLogger name="product-list-container children" />
      <FilterToggle />
      <Search />
      <Sort />
      <Filters />
      <ProductList />
      <ProductListFooter />
      <Pagination />
    </div>
  );
};

export default ProductListContainer;
