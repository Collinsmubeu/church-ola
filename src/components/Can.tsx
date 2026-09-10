import { usePermissions } from "@/hooks/usePermissions";

interface CanProps {
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ action, children, fallback = null }: CanProps) {
  const { can } = usePermissions();
  return can(action) ? <>{children}</> : <>{fallback}</>;
}

interface RoleGateProps {
  role: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ role, children, fallback = null }: RoleGateProps) {
  const { role: userRole } = usePermissions();
  const roles = Array.isArray(role) ? role : [role];
  const hasRole = roles.includes(userRole);
  return hasRole ? <>{children}</> : <>{fallback}</>;
}