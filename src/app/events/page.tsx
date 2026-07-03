import { EventsOffer } from "@/components/events/EventsOffer";
import { funnelConfig } from "@/lib/funnel";
import { redirect } from "next/navigation";

type EventsPageProps = {
  searchParams: Promise<{ cart?: string; order?: string }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  if (!funnelConfig.speakingEventsEnabled) {
    redirect("/");
  }

  const params = await searchParams;
  // Prefer cart= (new flow). Legacy order= links fall back to home offer.
  const cartId = params.cart;
  if (!cartId) {
    redirect("/#offer");
  }

  return <EventsOffer cartId={cartId} />;
}
