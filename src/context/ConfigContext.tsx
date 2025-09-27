// src/context/ConfigContext.tsx
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { PropsWithChildren } from "preact/compat";
import type { Config } from "@/types";
import { defaultConfig } from "@/configs/default";

const ConfigContext = createContext<Config>(defaultConfig);

export const ConfigProvider = ({
  children,
  config,
}: PropsWithChildren<{ config?: Config }>) => {
  return (
    <ConfigContext.Provider value={config ?? defaultConfig}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => useContext(ConfigContext);
