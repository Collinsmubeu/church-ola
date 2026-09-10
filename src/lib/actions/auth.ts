"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Role } from "@prisma/client";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  phone: z.string().optional().or(z.literal("")),
});

export type RegisterState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function register(
  _prev: RegisterState | null,
  formData: FormData
): Promise<RegisterState> {
  try {
    const parsed = RegisterSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { name, email, password, phone } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, message: "An account with that email already exists" };
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "GUEST" as Role,
        provider: "credentials",
        phone: phone || undefined,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    await prisma.auditLog.create({
      data: {
        action: "USER_CREATED",
        targetId: user.id,
        targetName: user.name,
        actorId: user.id,
        actorName: user.name,
        details: { provider: "credentials" } as any,
      },
    });

    revalidatePath("/auth/register");
    return { success: true, message: "Account created successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create account",
    };
  }
}

export async function forgotPassword(
  _prev: RegisterState | null,
  formData: FormData
): Promise<RegisterState> {
  try {
    const email = formData.get("email") as string;
    if (!email) {
      return { success: false, message: "Email is required" };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return {
        success: true,
        message: "If that email exists, a reset link has been sent.",
      };
    }

    const crypto = await import("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000);

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    await prisma.auditLog.create({
      data: {
        action: "PASSWORD_RESET_REQUESTED",
        targetId: user.id,
        targetName: user.name,
        actorId: user.id,
        actorName: user.name,
      },
    });

    return {
      success: true,
      message: "If that email exists, a reset link has been sent.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to request password reset",
    };
  }
}

export async function resetPassword(
  _prev: RegisterState | null,
  formData: FormData
): Promise<RegisterState> {
  try {
    const email = formData.get("email") as string;
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;

    if (!email || !token || !password) {
      return { success: false, message: "Email, token, and password are required" };
    }

    if (password.length < 8) {
      return { success: false, message: "Password must be at least 8 characters" };
    }

    const verification = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verification || verification.identifier !== email || verification.expires < new Date()) {
      return { success: false, message: "Invalid or expired token" };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, message: "Invalid or expired token" };
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    await prisma.verificationToken.delete({ where: { token } });

    await prisma.auditLog.create({
      data: {
        action: "PASSWORD_RESET",
        targetId: user.id,
        targetName: user.name,
        actorId: user.id,
        actorName: user.name,
      },
    });

    revalidatePath("/auth/reset-password");
    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to reset password",
    };
  }
}