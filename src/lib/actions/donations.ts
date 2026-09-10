"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DonationType } from "@prisma/client";
import {
  createDonation as createDonationQuery,
  deleteDonation as deleteDonationQuery,
} from "@/lib/db/queries/donations";

const DonationSchema = z.object({
  amount: z.preprocess((v) => Number(v), z.number().positive("Amount must be positive")),
  currency: z.string().default("USD"),
  type: z.nativeEnum(DonationType).default(DonationType.ONE_TIME),
  note: z.string().optional().or(z.literal("")),
  donorId: z.string().optional().or(z.literal("")),
});

export type DonationFormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createDonation(
  _prev: DonationFormState | null,
  formData: FormData
): Promise<DonationFormState> {
  try {
    const parsed = DonationSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }
    const d = parsed.data;
    await createDonationQuery({
      amount: d.amount,
      currency: d.currency,
      type: d.type,
      note: d.note || undefined,
      donorId: d.donorId || undefined,
    });
    revalidatePath("/dashboard/donations");
    return { success: true, message: "Donation recorded successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to record donation",
    };
  }
}

export async function deleteDonationAction(
  _prev: DonationFormState | null,
  formData: FormData
): Promise<DonationFormState> {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "Missing donation id" };
    await deleteDonationQuery(id);
    revalidatePath("/dashboard/donations");
    return { success: true, message: "Donation deleted" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete donation",
    };
  }
}