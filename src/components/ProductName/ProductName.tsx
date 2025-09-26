import RenderLogger from "@/components/RenderLogger";

interface ProductNameProps {
  name: string;
}

const ProductName = ({ name }: ProductNameProps) => (
  <h3 class="product-title">
    <RenderLogger name={`ProductName ${name}`} />
    {name}
  </h3>
);

export default ProductName;
