"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/client";

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