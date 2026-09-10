import { useSession } from "next-auth/react";
import { can, isAtLeast, Role } from "@/lib/permissions";

export function usePermissions() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || ("GUEST" as Role);

  return {
    role,
    can: (action: string) => can(role, action),
    isAtLeast: (minimumRole: Role) => isAtLeast(role, minimumRole),
  };
}