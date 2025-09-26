import RenderLogger from "@/components/RenderLogger";

function ProductSkeleton() {
  return (
    <li class="product-card skeleton">
      <RenderLogger name="ProductSkeleton" />
      <div class="skeleton-image" />
      <div class="skeleton-text short" />
      <div class="skeleton-text long" />
      <div class="skeleton-buttons" />
    </li>
  );
}

export default ProductSkeleton;
