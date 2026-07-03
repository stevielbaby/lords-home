import { EventsOffer } from "@/components/events/EventsOffer";
import { funnelConfig } from "@/lib/funnel";
import { redirect } from "next/navigation";

type EventsPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  if (!funnelConfig.speakingEventsEnabled) {
    redirect("/");
  }

  const params = await searchParams;
  const orderId = params.order;

  if (!orderId) {
    redirect("/#offer");
  }

  return <EventsOffer orderId={orderId} />;
}
