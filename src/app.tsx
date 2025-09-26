import { CartProvider } from "@/context/CartContext";
import RenderLogger from "./components/RenderLogger";
import { ConfigProvider } from "./context/ConfigContext";
import { FiltersProvider } from "./context/FiltersContext";
import { ProductsProvider } from "./context/ProductsContext";
import { SortDropdownProvider } from "./context/SortDropdownContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SearchProvider } from "@/context/SearchContext";
import ProductListContainer from "@/components/ProductListContainer/ProductListContainer";
import { createFakeStoreConfig } from "@/configs/fakestore";
import ConfigSwitcher from "@/components/ConfigSwitcher/ConfigSwitcher";
import { useState } from "preact/hooks";

export function App() {
  const [config, setConfig] = useState(createFakeStoreConfig());

  return (
    <>
      <ConfigSwitcher onChange={setConfig} />
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
    </>
  );
}
