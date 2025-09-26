import { useConfigContext } from "@/context/ConfigContext";
import type { ComponentType, VNode } from "preact";

interface SlotProps<TArgs extends unknown[] = unknown[]> {
  name: string;
  args: TArgs;
  fallback: (...args: TArgs) => VNode;
  componentWrapper?: ComponentType<{ children: (extra: any) => VNode }>;
}

const Slot = <TArgs extends unknown[]>({
  name,
  args,
  fallback,
  componentWrapper: Wrapper,
}: SlotProps<TArgs>) => {
  const { slots } = useConfigContext();
  const slot = slots?.[name];

  const renderSlot = (...finalArgs: TArgs): VNode => {
    if (!slot) return fallback(...finalArgs);
    if (typeof slot === "function") {
      return (slot as (...a: TArgs) => VNode)(...finalArgs);
    }
    return slot as VNode;
  };

  if (Wrapper) {
    return (
      <Wrapper
        children={(extra) => {
          const merged = [...args, extra] as unknown as TArgs;
          return renderSlot(...merged);
        }}
      />
    );
  }

  return renderSlot(...args);
};

export default Slot;
