import type { Product } from "@/types";
import RenderLogger from "@/components/RenderLogger";
import { useConfigContext } from "@/context/ConfigContext";

const ProductImage = ({ image, name }: Product) => {
  const { imageFormatter } = useConfigContext();

  // Format the image if a formatter exists
  const formattedImage = image
    ? imageFormatter?.(image, { width: 400 }) ?? image
    : undefined;

  return (
    <div class="product-image">
      <RenderLogger name={`ProductImage ${name}`} />
      {formattedImage ? (
        <img src={formattedImage} alt={name} loading="lazy" />
      ) : (
        <div class="product-image--placeholder">No Image</div>
      )}
    </div>
  );
};

export default ProductImage;
