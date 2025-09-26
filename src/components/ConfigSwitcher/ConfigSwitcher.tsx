import { useState } from "preact/hooks";
import { createFakeStoreConfig } from "@/configs/fakestore";
import { createShopifyConfig } from "@/configs/shopify";
import { createAdobeCommerceConfig } from "@/configs/adobe";
import { createBigCommerceConfig } from "@/configs/bigcommerce";
import type { Config } from "@/types";
import "./ConfigSwitcher.css";

type ConfigOption = {
  id: string;
  label: string;
  create: () => Config;
};

const configOptions: ConfigOption[] = [
  {
    id: "fakestore",
    label: "Fake Store API",
    create: () => createFakeStoreConfig(),
  },
  {
    id: "shopify",
    label: "Shopify",
    create: () =>
      createShopifyConfig({
        storeDomain: "your-shop.myshopify.com",
        storefrontToken: "",
      }),
  },
  {
    id: "adobe",
    label: "Adobe Commerce",
    create: () =>
      createAdobeCommerceConfig({
        imageFormatter: (url, { width } = {}) =>
          width ? `${url}?wid=${width}&fmt=webp-alpha` : url,
        environmentId: "08f157a5-85ea-4467-984f-ab0938107a9c",
        environmentType: "testing",
        apiKey: "storefront-widgets",
        websiteCode: "base",
        storeCode: "main_website_store",
        storeViewCode: "default",
        commerceCoreEndpoint:
          "https://catalog-service-sandbox.adobe.io/graphql",
      }),
  },
  {
    id: "bigcommerce",
    label: "BigCommerce",
    create: () =>
      createBigCommerceConfig({
        apiUrl: "",
        token: "",
        clientId: "",
      }),
  },
];

interface ConfigSwitcherProps {
  onChange: (config: Config) => void;
}

export default function ConfigSwitcher({ onChange }: ConfigSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(configOptions[0].id);

  const handleChange = (id: string) => {
    setSelected(id);
    const option = configOptions.find((o) => o.id === id);
    if (option) {
      onChange(option.create());
    }
    setOpen(false);
  };

  return (
    <div class="config-switcher">
      <button
        class="config-switcher__toggle"
        onClick={() => setOpen((o) => !o)}
      >
        ⚙️ {configOptions.find((o) => o.id === selected)?.label}
      </button>
      {open && (
        <div class="config-switcher__panel">
          {configOptions.map((option) => (
            <button
              key={option.id}
              class={`config-switcher__option ${
                option.id === selected ? "active" : ""
              }`}
              onClick={() => handleChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
