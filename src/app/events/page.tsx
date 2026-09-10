import { Metadata } from "next";
import { prisma } from "@/lib/db/client";
import { EventCard } from "@/components/features/events/EventCard";
import PublicLayout from "@/components/layouts/PublicLayout";

export const metadata: Metadata = {
  title: "Events | Church Ola",
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: { attendees: true },
    orderBy: { date: "asc" },
  });

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Upcoming Events</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Find something that fits your schedule and your heart. We have events for
            everyone in the family.
          </p>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No upcoming events at the moment.</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}