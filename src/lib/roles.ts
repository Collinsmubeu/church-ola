import type { Role } from "@prisma/client";

// Role assignment matrix: which actor roles can assign each target role.
// Follows church management platform best practices:
// - Owner: everything, including billing and assigning Owner
// - Admin: full management except billing
// - Editor / Content Manager: content only
// - Treasurer / Finance: giving & donor reports
// - Ministry / Group Leader: own ministry roster & check-in
// - Standard Staff: member profiles, events, communications
// - Member: self-service only
// - Guest: public content only
export const ROLE_ASSIGNMENT_MATRIX: Record<Role, Role[]> = {
  OWNER: ["OWNER"],
  ADMIN: ["OWNER", "ADMIN"],
  EDITOR: ["OWNER", "ADMIN"],
  TREASURER: ["OWNER", "ADMIN"],
  MINISTRY_LEAD: ["OWNER", "ADMIN"],
  STANDARD_STAFF: ["OWNER", "ADMIN"],
  MEMBER: ["OWNER", "ADMIN", "STANDARD_STAFF"],
  GUEST: ["OWNER", "ADMIN", "STANDARD_STAFF", "MINISTRY_LEAD"],
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
  OWNER: "Owner",
  ADMIN: "Admin",
  EDITOR: "Editor",
  TREASURER: "Treasurer",
  MINISTRY_LEAD: "Ministry Lead",
  STANDARD_STAFF: "Staff",
  MEMBER: "Member",
  GUEST: "Guest",
};

export const ROLE_COLORS: Record<Role, string> = {
  OWNER: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  ADMIN: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  EDITOR: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  TREASURER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  MINISTRY_LEAD: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  STANDARD_STAFF: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  MEMBER: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  GUEST: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};