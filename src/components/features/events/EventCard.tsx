import type { EventWithAttendees } from "@/types/event";
import { Calendar, MapPin, Users, Clock, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";

interface EventCardProps {
  event: EventWithAttendees;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isFull = event.capacity ? event.attendees.length >= event.capacity : false;

  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">
                {format(eventDate, "MMM d, yyyy")}
              </p>
              <CardTitle className="text-lg mt-1">{event.title}</CardTitle>
            </div>
            {isFull && <Badge variant="secondary">Full</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" /> {event.time}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" /> {event.location}
            </div>
            {event.capacity && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="size-4" /> {event.attendees.length} / {event.capacity} attending
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="w-full gap-2" disabled={isFull}>
            <BadgeCheck className="size-4" /> RSVP
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}