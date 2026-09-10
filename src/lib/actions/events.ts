"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createEvent as createEventQuery,
  updateEvent as updateEventQuery,
  deleteEvent as deleteEventQuery,
  addAttendee,
} from "@/lib/db/queries/events";

const EventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().datetime("Invalid date"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location is required"),
  capacity: z.preprocess(
    (v) => (v === "" || v === null ? null : Number(v)),
    z.number().int().positive().nullable()
  ),
});

export type EventFormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createEvent(
  _prev: EventFormState | null,
  formData: FormData
): Promise<EventFormState> {
  try {
    const parsed = EventSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const data = parsed.data;
    await createEventQuery({
      ...data,
      date: new Date(data.date),
      createdById: undefined,
      capacity: data.capacity ?? undefined,
    });

    revalidatePath("/dashboard/events");
    revalidatePath("/events");
    return { success: true, message: "Event created successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create event",
    };
  }
}

export async function updateEvent(
  _prev: EventFormState | null,
  formData: FormData
): Promise<EventFormState> {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "Missing event id" };

    const parsed = EventSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    await updateEventQuery(id, {
      ...parsed.data,
      date: new Date(parsed.data.date),
      capacity: parsed.data.capacity ?? null,
    });

    revalidatePath("/dashboard/events");
    revalidatePath("/events");
    return { success: true, message: "Event updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update event",
    };
  }
}

export async function deleteEventAction(
  _prev: EventFormState | null,
  formData: FormData
): Promise<EventFormState> {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "Missing event id" };
    await deleteEventQuery(id);
    revalidatePath("/dashboard/events");
    revalidatePath("/events");
    return { success: true, message: "Event deleted" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete event",
    };
  }
}

export async function rsvpToEvent(
  _prev: EventFormState | null,
  formData: FormData
): Promise<EventFormState> {
  try {
    const eventId = formData.get("eventId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    if (!eventId || !name) {
      return { success: false, message: "Name is required" };
    }
    await addAttendee(eventId, { name, email: email || undefined });
    revalidatePath(`/events/${eventId}`);
    return { success: true, message: "Thank you for RSVPing!" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "RSVP failed",
    };
  }
}