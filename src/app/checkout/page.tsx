import { CheckoutExperience } from "@/components/checkout/CheckoutExperience";
import {
  getBookProduct,
  getShippingMethods,
  getVariantById,
} from "@/lib/shopify/client";

type CheckoutPageProps = {
  searchParams: Promise<{ variant?: string; qty?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const product = await getBookProduct();
  const shippingMethods = await getShippingMethods();

  const requestedVariant = params.variant
    ? await getVariantById(params.variant)
    : null;
  const variant =
    requestedVariant ??
    product.variants.find((item) => item.badge) ??
    product.variants[0];

  const qty = Math.max(1, Number.parseInt(params.qty ?? "1", 10) || 1);

  return (
    <CheckoutExperience
      product={product}
      initialVariant={variant}
      initialQty={qty}
      shippingMethods={shippingMethods}
    />
  );
}
