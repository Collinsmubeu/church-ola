import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { can, Role } from "@/lib/permissions";
import { EventForm } from "@/components/features/events/EventForm";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteEventAction } from "@/lib/actions/events";
import { Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Can } from "@/components/Can";

export const metadata: Metadata = {
  title: "Events | Church Ola",
};

interface EventWithMeta {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  capacity: number | null;
  attendees: { id: string }[];
  createdBy: { name: string | null } | null;
}

export default async function DashboardEventsPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const userRole = (session.user as any)?.role as Role;

  const events = await prisma.event.findMany({
    include: { attendees: true, createdBy: true },
    orderBy: { date: "desc" },
  }) as EventWithMeta[];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Manage Events</h1>
          <p className="text-muted-foreground mt-1">Create, edit, and delete church events.</p>
        </div>
        <Can action="event:create">
          <EventForm />
        </Can>
      </div>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="font-heading text-lg font-semibold mt-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {event.description}
                      </p>
                      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                        <p>{event.time} - {event.location}</p>
                        {event.capacity && (
                          <p>{event.attendees.length} / {event.capacity} attending</p>
                        )}
                        {event.createdBy?.name && (
                          <p className="text-xs">By {event.createdBy.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 p-4 border-t border-border bg-muted/30">
                  <Can action="event:edit">
                    <EventForm
                      event={{
                        id: event.id,
                        title: event.title,
                        description: event.description,
                        date: new Date(event.date).toISOString().slice(0, 16),
                        time: event.time,
                        location: event.location,
                        capacity: event.capacity ?? undefined,
                      }}
                    />
                  </Can>
                  <Can action="event:delete">
                    <DeleteButton action={deleteEventAction} id={event.id} />
                  </Can>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="size-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No events yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}