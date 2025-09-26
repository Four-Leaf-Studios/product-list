import { useProductsContext } from "@/context/ProductsContext";
import RenderLogger from "@/components/RenderLogger";
import { useConfigContext } from "@/standalone";

function Pagination() {
  const { refetch, hasMore, loading, page, products } = useProductsContext();
  const { featureFlags } = useConfigContext();

  const shouldShowPagination =
    (products.length > 0 || page > 1) && featureFlags.pagination;

  if (!shouldShowPagination) {
    return null;
  }

  const goToPage = async (targetPage: number) => {
    await refetch(targetPage);
  };

  return (
    <nav class="pagination">
      <RenderLogger name={`Pagination Page ${page}`} />
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1 || loading}
      >
        Previous
      </button>
      <span>Page {page}</span>
      <button onClick={() => goToPage(page + 1)} disabled={!hasMore || loading}>
        Next
      </button>
    </nav>
  );
}

export default Pagination;
