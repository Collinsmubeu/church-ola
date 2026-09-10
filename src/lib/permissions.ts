import type { Role } from "@prisma/client";

export { Role };

// Role hierarchy: lower index = higher privilege
export const ROLE_HIERARCHY: Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "PASTOR",
  "ELDER",
  "DEACON",
  "MINISTRY_LEAD",
  "COUNSELOR",
  "MEMBER",
  "GUEST",
];

// Permission map: action -> minimum role required
export const PERMISSIONS: Record<string, Role> = {
  // Admin
  "user:create": "ADMIN",
  "user:edit": "ADMIN",
  "user:delete": "ADMIN",
  "user:changeRole": "SUPER_ADMIN",
  "settings:edit": "ADMIN",
  "audit:view": "SUPER_ADMIN",
  "role:manage": "SUPER_ADMIN",

  // Pastor / Content Manager
  "content:create": "PASTOR",
  "content:edit": "PASTOR",
  "content:delete": "SUPER_ADMIN",
  "sermon:upload": "PASTOR",
  "sermon:edit": "PASTOR",
  "sermon:delete": "SUPER_ADMIN",
  "event:create": "PASTOR",
  "event:edit": "PASTOR",
  "event:delete": "SUPER_ADMIN",
  "announcement:publish": "PASTOR",

  // Elder / Deacon
  "member:viewProfile": "ELDER",
  "member:editProfile": "DEACON",
  "member:export": "ELDER",
  "event:register:self": "MEMBER",
  "communication:send": "DEACON",
  "member:viewDirectory": "ELDER",
  "giving:viewAll": "ELDER",
  "giving:export": "ELDER",

  // Ministry Lead
  "group:viewRoster": "MINISTRY_LEAD",
  "group:addMember": "MINISTRY_LEAD",
  "group:removeMember": "MINISTRY_LEAD",
  "group:sendMessage": "MINISTRY_LEAD",
  "checkin:manage": "MINISTRY_LEAD",

  // Counselor
  "care:notes": "COUNSELOR",
  "care:view": "COUNSELOR",
  "care:edit": "COUNSELOR",

  // Member (self-service)
  "profile:edit": "MEMBER",
  "giving:make": "MEMBER",
  "sermon:view": "MEMBER",
  "sermon:download": "MEMBER",
  "directory:view": "MEMBER",
  "group:view:self": "MEMBER",
  "announcement:view": "MEMBER",
};

export function can(userRole: Role, action: string): boolean {
  const requiredRole = PERMISSIONS[action];
  if (!requiredRole) return false;
  const userIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  return userIndex <= requiredIndex;
}

export function getAssignableRoles(actorRole: Role): Role[] {
  const actorIndex = ROLE_HIERARCHY.indexOf(actorRole);
  return ROLE_HIERARCHY.filter((_, i) => i >= actorIndex);
}

export function isAtLeast(userRole: Role, minimumRole: Role): boolean {
  return ROLE_HIERARCHY.indexOf(userRole) <= ROLE_HIERARCHY.indexOf(minimumRole);
}