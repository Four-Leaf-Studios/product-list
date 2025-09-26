import type { Product as ProductType } from "@/types";
import RenderLogger from "@/components/RenderLogger";
import ProductImage from "@/components/ProductImage/ProductImage";
import ProductName from "@/components/ProductName/ProductName";
import ProductPrice from "@/components/ProductPrice/ProductPrice";
import WishlistButton from "@/components/WishlistButton/WishlistButton";
import AddToCartButton from "@/components/AddToCartButton/AddToCartButton";
import { memo } from "preact/compat";
import { useConfigContext } from "@/standalone";

const Product = memo((product: ProductType) => {
  const { featureFlags } = useConfigContext();
  return (
    <li class="product-card">
      <RenderLogger name={`Product ${product.name}`} />
      <ProductImage {...product} />
      <div class="product-card__details">
        <ProductName {...product} />
        <ProductPrice price={product.price} currency={product.currency} />
      </div>

      <div class="product-card__actions">
        {featureFlags?.wishlist && <WishlistButton product={product} />}
        {featureFlags?.addToCart && <AddToCartButton product={product} />}
      </div>
    </li>
  );
});

export default Product;
