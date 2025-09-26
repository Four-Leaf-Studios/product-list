import type { CalloutItem } from "@/types";
import RenderLogger from "@/components/RenderLogger";

const Callout = ({ text, color, backgroundColor }: CalloutItem) => (
  <div class="product-callout" style={{ color, backgroundColor }}>
    <RenderLogger name={`Callout ${text}`} />
    {text}
  </div>
);

export default Callout;
