import { useProductsContext } from "@/context/ProductsContext";
import RenderLogger from "@/components/RenderLogger";
import { useEffect, useRef } from "preact/hooks";

function InfiniteScrollLoader() {
  const { loadMore, hasMore, loading } = useProductsContext();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div ref={sentinelRef} class="infinite-scroll-loader">
      <RenderLogger name="InfiniteScrollLoader" />
      {loading
        ? "Loading more…"
        : hasMore
        ? "Scroll to load more"
        : "No more products"}
    </div>
  );
}

export default InfiniteScrollLoader;
