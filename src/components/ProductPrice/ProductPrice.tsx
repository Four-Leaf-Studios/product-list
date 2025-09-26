import RenderLogger from "@/components/RenderLogger";

interface ProductPriceProps {
  price: number;
  currency?: string;
}

const ProductPrice = ({ price, currency }: ProductPriceProps) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
  });

  return (
    <p class="product-price">
      <RenderLogger name={`ProductPrice ${price}`} />
      {formatter.format(price)}
    </p>
  );
};

export default ProductPrice;
