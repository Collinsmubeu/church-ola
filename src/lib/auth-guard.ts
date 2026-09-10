import { auth } from "@/lib/auth";
import { can, Role } from "@/lib/permissions";

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function requirePermission(action: string): Promise<{
  userId: string;
  role: Role;
  name: string | null | undefined;
  email: string | null | undefined;
}> {
  const session = await auth();
  const user = session?.user as { id?: string; role?: Role; name?: string | null; email?: string | null } | undefined;

  if (!user?.id) {
    throw new ForbiddenError("Unauthorized");
  }

  if (!can(user.role as Role, action)) {
    throw new ForbiddenError(`Insufficient permissions for ${action}`);
  }

  return {
    userId: user.id,
    role: user.role as Role,
    name: user.name,
    email: user.email,
  };
}

export async function requireRole(minimumRole: Role) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: Role } | undefined;

  if (!user?.id) {
    throw new ForbiddenError("Unauthorized");
  }

  const { isAtLeast } = await import("@/lib/permissions");
  if (!isAtLeast(user.role as Role, minimumRole)) {
    throw new ForbiddenError("Insufficient role");
  }

  return { userId: user.id, role: user.role as Role };
}

export function handleAuthError(error: unknown): Response {
  if (error instanceof ForbiddenError) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ error: "Internal server error" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}