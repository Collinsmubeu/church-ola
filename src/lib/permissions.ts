import type { Role } from "@prisma/client";

export { Role };

// Role hierarchy: lower index = higher privilege
export const ROLE_HIERARCHY: Role[] = [
  "OWNER",
  "ADMIN",
  "EDITOR",
  "TREASURER",
  "MINISTRY_LEAD",
  "STANDARD_STAFF",
  "MEMBER",
  "GUEST",
];

// Permission map: action -> minimum role required
export const PERMISSIONS: Record<string, Role> = {
  // Admin
  "user:create": "ADMIN",
  "user:edit": "ADMIN",
  "user:delete": "ADMIN",
  "user:changeRole": "ADMIN",
  "settings:edit": "ADMIN",
  "audit:view": "ADMIN",
  "role:manage": "ADMIN",

  // Editor / Content Manager
  "content:create": "EDITOR",
  "content:edit": "EDITOR",
  "content:delete": "EDITOR",
  "sermon:upload": "EDITOR",
  "sermon:edit": "EDITOR",
  "sermon:delete": "EDITOR",
  "event:create": "EDITOR",
  "event:edit": "EDITOR",
  "event:delete": "EDITOR",
  "announcement:publish": "EDITOR",

  // Treasurer / Finance
  "giving:viewAll": "TREASURER",
  "giving:export": "TREASURER",
  "giving:refund": "TREASURER",
  "reports:financial": "TREASURER",

  // Ministry / Group Leader
  "group:viewRoster": "MINISTRY_LEAD",
  "group:addMember": "MINISTRY_LEAD",
  "group:removeMember": "MINISTRY_LEAD",
  "group:sendMessage": "MINISTRY_LEAD",
  "checkin:manage": "MINISTRY_LEAD",

  // Standard Staff
  "member:viewProfile": "STANDARD_STAFF",
  "member:editProfile": "STANDARD_STAFF",
  "member:export": "STANDARD_STAFF",
  "event:register": "STANDARD_STAFF",
  "communication:send": "STANDARD_STAFF",
  "member:viewDirectory": "STANDARD_STAFF",

  // Member (self-service)
  "profile:edit": "MEMBER",
  "giving:make": "MEMBER",
  "event:register:self": "MEMBER",
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