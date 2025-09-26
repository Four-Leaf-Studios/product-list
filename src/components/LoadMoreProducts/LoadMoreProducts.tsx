import { useProductsContext } from "@/context/ProductsContext";
import RenderLogger from "@/components/RenderLogger";

function LoadMoreProducts() {
  const { loadMore, loading, hasMore } = useProductsContext();

  return (
    <div class="load-more">
      <RenderLogger name="LoadMoreProducts" />
      {hasMore && !loading && <button onClick={loadMore}>Load More</button>}
      {!hasMore && <span>No more products</span>}
    </div>
  );
}

export default LoadMoreProducts;
