import type { Role } from "@prisma/client";

export const ROLE_ASSIGNMENT_MATRIX: Record<Role, Role[]> = {
  SUPER_ADMIN: [],
  ADMIN: ["SUPER_ADMIN"],
  PASTOR: ["SUPER_ADMIN", "ADMIN"],
  ELDER: ["SUPER_ADMIN"],
  DEACON: ["SUPER_ADMIN", "ADMIN", "ELDER"],
  MINISTRY_LEAD: ["SUPER_ADMIN", "ADMIN", "PASTOR"],
  COUNSELOR: ["SUPER_ADMIN", "ADMIN"],
  MEMBER: ["SUPER_ADMIN", "ADMIN", "PASTOR"],
  GUEST: ["SUPER_ADMIN", "ADMIN", "PASTOR", "MINISTRY_LEAD"],
};

export function canAssignRole(actorRole: Role, targetRole: Role): boolean {
  return ROLE_ASSIGNMENT_MATRIX[targetRole]?.includes(actorRole) ?? false;
}

export function getAssignableRoles(actorRole: Role): Role[] {
  return (Object.keys(ROLE_ASSIGNMENT_MATRIX) as Role[]).filter((role) =>
    canAssignRole(actorRole, role)
  );
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  PASTOR: "Pastor",
  ELDER: "Elder",
  DEACON: "Deacon",
  MINISTRY_LEAD: "Ministry Lead",
  COUNSELOR: "Counselor",
  MEMBER: "Member",
  GUEST: "Guest",
};

export const ROLE_COLORS: Record<Role, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  ADMIN: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  PASTOR: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  ELDER: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  DEACON: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  MINISTRY_LEAD: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  COUNSELOR: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  MEMBER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  GUEST: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};