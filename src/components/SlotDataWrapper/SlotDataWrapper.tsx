import { useCartContext } from "@/context/CartContext";
import { useConfigContext } from "@/context/ConfigContext";
import { useWishlistContext } from "@/context/WishlistContext";
import type { VNode } from "preact";

const SlotDataWrapper = ({ children }: { children: (args: any) => VNode }) => {
  const config = useConfigContext();
  const cart = useCartContext();
  const wishlist = useWishlistContext();

  const data = { config, cart, wishlist };

  return children(data);
};

export default SlotDataWrapper;
