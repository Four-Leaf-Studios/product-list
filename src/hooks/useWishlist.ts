import { useConfigContext } from "@/context/ConfigContext";
import { useSubscription } from "@/hooks/useSubscription";
import type { Product } from "@/types";

export function useWishlist() {
  const { api } = useConfigContext();

  const wishlist = useSubscription<Product[]>({
    subscribe: api.subscribeToWishlist,
    getInitial: api.getWishlist,
  });

  return {
    wishlist: wishlist ?? [],
    addToWishlist: api.addToWishlist,
    removeFromWishlist: api.removeFromWishlist,
  };
}
