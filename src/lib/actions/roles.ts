"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
import { canAssignRole } from "@/lib/roles";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ChangeRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.string().min(1, "Role is required"),
});

export type ChangeRoleState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function changeRole(
  _prev: ChangeRoleState | null,
  formData: FormData
): Promise<ChangeRoleState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const parsed = ChangeRoleSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { userId, role } = parsed.data;
    const targetRole = role as any;

    const actor = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!actor) {
      return { success: false, message: "Actor not found" };
    }

    if (!canAssignRole(actor.role, targetRole)) {
      return {
        success: false,
        message: `You cannot assign the role "${role}"`,
      };
    }

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) {
      return { success: false, message: "User not found" };
    }

    const fromRole = target.role;
    await prisma.user.update({
      where: { id: userId },
      data: { role: targetRole },
    });

    await prisma.auditLog.create({
      data: {
        action: "ROLE_CHANGED",
        targetId: userId,
        targetName: target.name,
        actorId: session.user.id,
        actorName: session.user.name ?? "Unknown",
        details: { from: fromRole, to: targetRole } as any,
      },
    });

    revalidatePath("/dashboard/members");
    return { success: true, message: `Role updated for ${target.name}` };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to change role",
    };
  }
}

export async function logAudit(
  action: string,
  targetId: string,
  targetName: string,
  details?: object,
  ip?: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.auditLog.create({
      data: {
        action,
        targetId,
        targetName,
        actorId: session.user.id,
        actorName: session.user.name ?? "Unknown",
        details: details as any,
        ip,
      },
    });
  } catch (error) {
    console.error("Audit log error:", error);
  }
}