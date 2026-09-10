"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createVolunteerRole as createVolunteerRoleQuery,
  updateVolunteerRole as updateVolunteerRoleQuery,
  deleteVolunteerRole as deleteVolunteerRoleQuery,
} from "@/lib/db/queries/volunteers";

const VolunteerSchema = z.object({
  team: z.string().min(2, "Team name is required"),
  role: z.string().min(2, "Role is required"),
  userId: z.string().min(1, "Member is required"),
  active: z.preprocess((v) => v === "on", z.boolean()),
});

export type VolunteerFormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createVolunteerRole(
  _prev: VolunteerFormState | null,
  formData: FormData
): Promise<VolunteerFormState> {
  try {
    const parsed = VolunteerSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }
    await createVolunteerRoleQuery(parsed.data);
    revalidatePath("/dashboard/volunteers");
    return { success: true, message: "Volunteer role assigned" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to assign role",
    };
  }
}

export async function updateVolunteerRole(
  _prev: VolunteerFormState | null,
  formData: FormData
): Promise<VolunteerFormState> {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "Missing role id" };
    const parsed = VolunteerSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }
    await updateVolunteerRoleQuery(id, parsed.data);
    revalidatePath("/dashboard/volunteers");
    return { success: true, message: "Role updated" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update role",
    };
  }
}

export async function toggleVolunteerActive(
  _prev: VolunteerFormState | null,
  formData: FormData
): Promise<VolunteerFormState> {
  try {
    const id = formData.get("id") as string;
    const activeStr = formData.get("active") as string;
    if (!id) return { success: false, message: "Missing role id" };
    const active = activeStr === "true";
    await updateVolunteerRoleQuery(id, { active });
    revalidatePath("/dashboard/volunteers");
    return { success: true, message: "Status updated" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update status",
    };
  }
}

export async function deleteVolunteerRoleAction(
  _prev: VolunteerFormState | null,
  formData: FormData
): Promise<VolunteerFormState> {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "Missing role id" };
    await deleteVolunteerRoleQuery(id);
    revalidatePath("/dashboard/volunteers");
    return { success: true, message: "Role removed" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to remove role",
    };
  }
}