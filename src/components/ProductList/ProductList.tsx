// src/components/ProductList/ProductList.tsx
import { useProductsContext } from "@/context/ProductsContext";
import type { Product as ProductType } from "@/types";
import Product from "@/components/Product/Product";
import RenderLogger from "@/components/RenderLogger";
import ProductSkeleton from "@/components/ProductSkeleton/ProductSkeleton";
import { useConfigContext } from "@/context/ConfigContext";

function ProductList() {
  const { products, loading, page } = useProductsContext();
  const { pagination } = useConfigContext();

  const pageSize = pagination?.pageSize ?? 8;
  const isFirstPage = page === 1 && products.length === 0;

  return (
    <ul class="product-list">
      <RenderLogger name="ProductList children" />

      {/* First load or refetch → full skeleton grid */}
      {isFirstPage && loading ? (
        Array.from({ length: pageSize }).map((_, i) => (
          <ProductSkeleton key={`skeleton-initial-${i}`} />
        ))
      ) : (
        <>
          {/* Render loaded products */}
          {products.map((p: ProductType) => (
            <Product key={p.id ?? p.name} {...p} />
          ))}

          {/* While loading more → skeletons at the end */}
          {loading &&
            Array.from({ length: pageSize }).map((_, i) => (
              <ProductSkeleton key={`skeleton-loadmore-${i}`} />
            ))}
        </>
      )}
    </ul>
  );
}

export default ProductList;
