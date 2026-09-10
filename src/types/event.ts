import type { Event, Attendee } from "@prisma/client";

export interface EventFormValues {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity?: number | null;
}

export type EventWithAttendees = Event & { attendees: Attendee[] };