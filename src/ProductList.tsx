import { CartProvider } from "@/context/CartContext";
import RenderLogger from "./components/RenderLogger";
import { ConfigProvider } from "./context/ConfigContext";
import { FiltersProvider } from "./context/FiltersContext";
import { ProductsProvider } from "./context/ProductsContext";
import { SortDropdownProvider } from "./context/SortDropdownContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SearchProvider } from "@/context/SearchContext";
import ProductListContainer from "@/components/ProductListContainer/ProductListContainer";
import type { Config } from "@/types";

const ProductList = (config: Config) => {
  return (
    <ConfigProvider config={config}>
      <RenderLogger name="ConfigProvider children" />
      <SearchProvider>
        <FiltersProvider>
          <RenderLogger name="FiltersProvider children" />
          <SortDropdownProvider>
            <RenderLogger name="SortDropdownProvider children" />
            <ProductsProvider>
              <RenderLogger name="ProductsProvider children" />
              <CartProvider>
                <WishlistProvider>
                  <ProductListContainer />
                </WishlistProvider>
              </CartProvider>
            </ProductsProvider>
          </SortDropdownProvider>
        </FiltersProvider>
      </SearchProvider>
    </ConfigProvider>
  );
};

export default ProductList;
