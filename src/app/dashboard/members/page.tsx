import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { can, Role } from "@/lib/permissions";
import { Users, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, ROLE_COLORS, canAssignRole, getAssignableRoles } from "@/lib/roles";
import { RoleChangeForm } from "@/components/members/role-change-form";

export const metadata: Metadata = {
  title: "Members | Church Ola",
};

export default async function MembersPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const actorRole = (session.user as any)?.role as Role;

  if (!can(actorRole, "user:create")) {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Member Management</h1>
        <p className="text-muted-foreground mt-1">Manage user roles and permissions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-primary" /> All Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Role</th>
                  <th className="py-3 px-4 font-medium">Last Login</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {user.name?.charAt(0) ?? "?"}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge className={ROLE_COLORS[user.role as Role]}>
                        {ROLE_LABELS[user.role as Role]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="py-3 px-4">
                      {canAssignRole(actorRole, user.role as Role) && actorRole !== user.role ? (
                        <RoleChangeForm userId={user.id} currentRole={user.role} assignableRoles={getAssignableRoles(actorRole)} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}