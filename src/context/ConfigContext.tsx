import type { Config } from "@/types";
import { defaultIcons } from "@/defaults/icons";
import { useContext, useMemo } from "preact/hooks";
import { createContext } from "preact";

const ConfigContext = createContext<Config | undefined>(undefined);

export const ConfigProvider = ({
  children,
  config,
}: {
  config: Config;
  children: preact.ComponentChildren;
}) => {
  const mergedConfig: Config = useMemo(() => {
    return {
      ...config,
      icons: {
        ...defaultIcons,
        ...(config.icons || {}),
        wishlist: {
          ...defaultIcons.wishlist,
          ...(config.icons?.wishlist || {}),
        },
        cart: { ...defaultIcons.cart, ...(config.icons?.cart || {}) },
        filters: { ...defaultIcons.filters, ...(config.icons?.filters || {}) },
        search: { ...defaultIcons.search, ...(config.icons?.search || {}) },
      },
      slots: { ...(config.slots || {}) },
    };
  }, [config]);

  return (
    <ConfigContext.Provider value={mergedConfig}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  const ctx = useContext(ConfigContext);
  if (!ctx)
    throw new Error("useConfigContext must be used within ConfigProvider");
  return ctx;
};
