import { useConfigContext } from "@/context/ConfigContext";
import { useSubscription } from "@/hooks/useSubscription";
import type { Product } from "@/types";

export function useCart() {
  const { api } = useConfigContext();

  const cart = useSubscription<Product[]>({
    subscribe: api.subscribeToCart,
    getInitial: api.getCart,
  });

  return {
    cart: cart ?? [],
    addToCart: api.addToCart,
    removeFromCart: api.removeFromCart,
  };
}
