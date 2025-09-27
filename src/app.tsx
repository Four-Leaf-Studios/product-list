import { createFakeStoreConfig } from "@/configs/fakestore";
import ConfigSwitcher from "@/components/ConfigSwitcher/ConfigSwitcher";
import { useState } from "preact/hooks";
import { ProductList } from "@/index";

export function App() {
  const [config, setConfig] = useState(createFakeStoreConfig());

  return (
    <div>
      <ConfigSwitcher onChange={setConfig} />
      <ProductList config={config} />
    </div>
  );
}
