import type { Product } from "@/types";
import { useCartContext } from "@/context/CartContext";
import { useConfigContext } from "@/context/ConfigContext";
import { useMutation } from "@/hooks/useMutation";

export function AddToCartButton({ product }: { product: Product }) {
  const { cart, addToCart, removeFromCart } = useCartContext();
  const config = useConfigContext();

  const inCart = cart.some((p) => p.id === product.id);

  const { mutate, isLoading } = useMutation<void, Product>(
    inCart ? removeFromCart : addToCart
  );

  const Icon = inCart ? config.icons?.cart?.remove : config.icons?.cart?.add;

  return (
    <button
      class="product-cart-btn"
      onClick={() => mutate(product)}
      disabled={isLoading}
    >
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          {typeof Icon === "function" ? Icon() : Icon}
          {inCart ? " Remove from Cart" : ` Add to Cart`}
        </>
      )}
    </button>
  );
}

export default AddToCartButton;
