import { ThankYouExperience } from "@/components/thank-you/ThankYouExperience";
import { getBookProduct } from "@/lib/shopify/client";

type ThankYouPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;
  const product = await getBookProduct();
  const orderId = params.order ?? "LH-DEMO";

  return <ThankYouExperience orderId={orderId} product={product} />;
}
