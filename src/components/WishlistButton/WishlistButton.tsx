import type { Product } from "@/types";
import RenderLogger from "@/components/RenderLogger";
import { useWishlistContext } from "@/context/WishlistContext";
import { useConfigContext } from "@/context/ConfigContext";
import { useMutation } from "@/hooks/useMutation";

interface WishlistButtonProps {
  product: Product;
}

const WishlistButton = ({ product }: WishlistButtonProps) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistContext();
  const config = useConfigContext();

  const inWishlist = wishlist.some((p) => p.id === product.id);

  const { mutate, isLoading } = useMutation<void, Product>(
    inWishlist ? removeFromWishlist : addToWishlist
  );

  const Icon = inWishlist
    ? config.icons?.wishlist?.remove
    : config.icons?.wishlist?.add;

  return (
    <button
      class="product-wishlist-btn"
      onClick={() => mutate(product)}
      disabled={isLoading}
    >
      <RenderLogger name={`WishlistButton ${product.name}`} />
      {isLoading ? "Loading..." : typeof Icon === "function" ? Icon() : Icon}
      {isLoading
        ? ""
        : inWishlist
        ? " Remove from Wishlist"
        : " Add to Wishlist"}
    </button>
  );
};

export default WishlistButton;
