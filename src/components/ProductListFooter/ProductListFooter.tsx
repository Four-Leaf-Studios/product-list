import InfiniteScrollLoader from "@/components/InfiniteScrollLoader/InfiniteScrollLoader";
import LoadMoreProducts from "@/components/LoadMoreProducts/LoadMoreProducts";
import { useConfigContext } from "@/context/ConfigContext";
import { useProductsContext } from "@/context/ProductsContext";

const ProductListFooter = () => {
  const { featureFlags } = useConfigContext();
  const { page, products } = useProductsContext();

  const shouldShowFooter = products.length > 0 || page > 1;

  if (!shouldShowFooter) return null;

  if (featureFlags.infiniteScroll) {
    return <InfiniteScrollLoader />;
  }

  if (featureFlags.loadMoreButtons) {
    return <LoadMoreProducts />;
  }

  return null;
};

export default ProductListFooter;
