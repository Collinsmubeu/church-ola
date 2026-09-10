"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Role } from "@prisma/client";
import { logAudit } from "@/lib/actions/audit";
import { signIn } from "@/lib/auth";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validators/auth";

export type RegisterState = {
  success?: boolean;
  message?: string;
  email?: string;
  password?: string;
  errors?: Record<string, string[]>;
};

export async function register(
  _prev: RegisterState | null,
  formData: FormData
): Promise<RegisterState> {
  try {
    const parsed = registerSchema.safeParse(Object.fromEntries(formData));
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

    // First person to sign up becomes SUPER_ADMIN
    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: isFirstUser ? ("SUPER_ADMIN" as Role) : ("GUEST" as Role),
        provider: "credentials",
        phone: phone || undefined,
        lastLoginAt: new Date(),
        loginCount: 1,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    await logAudit("USER_CREATED", user.id, user.name, { provider: "credentials" });

    revalidatePath("/auth/register");
    return { success: true, message: "Account created successfully", email, password };
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
    const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { email } = parsed.data;

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

    await logAudit("PASSWORD_RESET_REQUESTED", user.id, user.name);

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
    const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { email, token, password } = parsed.data;

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

    await logAudit("PASSWORD_RESET", user.id, user.name);

    revalidatePath("/auth/reset-password");
    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to reset password",
    };
  }
}