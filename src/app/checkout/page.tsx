import { CheckoutExperience } from "@/components/checkout/CheckoutExperience";
import { getBookProduct, getShippingMethods } from "@/lib/shopify/client";

type CheckoutPageProps = {
  searchParams: Promise<{ cart?: string; variant?: string; qty?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const product = await getBookProduct();
  const shippingMethods = await getShippingMethods();

  return (
    <CheckoutExperience
      product={product}
      shippingMethods={shippingMethods}
      cartId={params.cart}
      fallbackVariantId={params.variant}
      fallbackQty={params.qty}
    />
  );
}
