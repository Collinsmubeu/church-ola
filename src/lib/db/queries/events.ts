import { prisma } from "@/lib/db/client";
import type { Event, Attendee } from "@prisma/client";

export async function getEvents(limit?: number, upcoming = true) {
  const now = new Date();
  return prisma.event.findMany({
    where: upcoming ? { date: { gte: now } } : {},
    include: { attendees: true },
    orderBy: { date: "asc" },
    take: limit,
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: { attendees: true, createdBy: true },
  });
}

export async function createEvent(data: {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  capacity?: number;
  createdById?: string;
}) {
  return prisma.event.create({ data, include: { attendees: true } });
}

export async function updateEvent(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
    capacity: number | null;
  }>
) {
  return prisma.event.update({
    where: { id },
    data,
    include: { attendees: true },
  });
}

export async function deleteEvent(id: string) {
  return prisma.event.delete({ where: { id } });
}

export async function addAttendee(eventId: string, data: { name: string; email?: string }) {
  return prisma.attendee.create({ data: { ...data, eventId } });
}