"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createSermon as createSermonQuery,
  updateSermon as updateSermonQuery,
  deleteSermon as deleteSermonQuery,
} from "@/lib/db/queries/sermons";

const SermonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().default(""),
  videoUrl: z.string().url("Must be a valid URL"),
  audioUrl: z.string().optional().or(z.literal("")),
  speaker: z.string().min(2, "Speaker is required"),
  date: z.string().datetime("Invalid date"),
  duration: z.preprocess(
    (v) => (v === "" || v === null ? null : Number(v)),
    z.number().int().positive().nullable()
  ),
});

export type SermonFormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createSermon(
  _prev: SermonFormState | null,
  formData: FormData
): Promise<SermonFormState> {
  try {
    const parsed = SermonSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }
    const d = parsed.data;
    await createSermonQuery({
      ...d,
      date: new Date(d.date),
      audioUrl: d.audioUrl || undefined,
      duration: d.duration ?? undefined,
    });
    revalidatePath("/dashboard/sermons");
    revalidatePath("/sermons");
    return { success: true, message: "Sermon added successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create sermon",
    };
  }
}

export async function updateSermon(
  _prev: SermonFormState | null,
  formData: FormData
): Promise<SermonFormState> {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "Missing sermon id" };
    const parsed = SermonSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }
    const d = parsed.data;
    await updateSermonQuery(id, {
      ...d,
      date: new Date(d.date),
      audioUrl: d.audioUrl || null,
      duration: d.duration ?? null,
    });
    revalidatePath("/dashboard/sermons");
    revalidatePath("/sermons");
    return { success: true, message: "Sermon updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update sermon",
    };
  }
}

export async function deleteSermonAction(
  _prev: SermonFormState | null,
  formData: FormData
): Promise<SermonFormState> {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "Missing sermon id" };
    await deleteSermonQuery(id);
    revalidatePath("/dashboard/sermons");
    revalidatePath("/sermons");
    return { success: true, message: "Sermon deleted" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete sermon",
    };
  }
}