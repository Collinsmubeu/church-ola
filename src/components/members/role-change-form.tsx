"use client";

import { Label } from "@/components/ui/label";
import { ROLE_LABELS } from "@/lib/roles";
import { changeRoleAction } from "@/lib/actions/roles";
import type { Role } from "@prisma/client";

export function RoleChangeForm({
  userId,
  currentRole,
  assignableRoles,
}: {
  userId: string;
  currentRole: string;
  assignableRoles: Role[];
}) {
  return (
    <form action={changeRoleAction as any} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <Label htmlFor="role" className="sr-only">Role</Label>
      <select
        id="role"
        name="role"
        defaultValue={currentRole}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
      >
        {assignableRoles.map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="h-8 px-2 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90"
      >
        Save
      </button>
    </form>
  );
}