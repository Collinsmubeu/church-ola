import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { RsvpForm } from "@/components/features/events/RsvpForm";
import { EventCard } from "@/components/features/events/EventCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Church } from "lucide-react";
import { format } from "date-fns";

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "Event | Church Ola",
};

export default async function EventDetailPage({ params }: PageProps) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { attendees: true, createdBy: true },
  });

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.date);
  const isFull = event.capacity ? event.attendees.length >= event.capacity : false;

  const related = await prisma.event.findMany({
    where: { id: { not: event.id }, date: { gte: new Date() } },
    include: { attendees: true },
    orderBy: { date: "asc" },
    take: 3,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Badge className="mb-4">Event</Badge>
            <h1 className="font-heading text-4xl font-bold">{event.title}</h1>
            <p className="mt-4 text-muted-foreground text-lg">
              {event.description}
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-primary" />
                <div>
                  <p className="font-medium">{format(eventDate, "EEEE, MMMM d, yyyy")}</p>
                  <p className="text-sm text-muted-foreground">Date of the event</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="size-5 text-primary" />
                <div>
                  <p className="font-medium">{event.time}</p>
                  <p className="text-sm text-muted-foreground">Start time</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-primary" />
                <div>
                  <p className="font-medium">{event.location}</p>
                  <p className="text-sm text-muted-foreground">Location</p>
                </div>
              </div>
              {event.capacity && (
                <div className="flex items-center gap-3">
                  <Users className="size-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      {event.attendees.length} / {event.capacity} spots filled
                    </p>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-lg overflow-hidden border border-border">
            <div className="h-64 bg-muted flex items-center justify-center">
              <Church className="size-16 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground p-3 text-center">
              Map placeholder - {event.location}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="font-heading text-xl font-semibold mb-4">RSVP for this Event</h3>
              {isFull ? (
                <p className="text-muted-foreground mb-4">
                  This event is full. Please check back for future events.
                </p>
              ) : (
                <RsvpForm eventId={event.id} />
              )}
              <p className="mt-4 text-xs text-muted-foreground">
                {event.attendees.length} people are attending
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}