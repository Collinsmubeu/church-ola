import { Metadata } from "next";
import { prisma } from "@/lib/db/client";
import { VolunteerForm } from "@/components/features/volunteers/VolunteerForm";
import { TeamCard } from "@/components/features/volunteers/TeamCard";
import { HandHeart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Volunteers | Church Ola",
};

interface VolunteerRoleWithUser {
  id: string;
  team: string;
  role: string;
  active: boolean;
  createdAt: Date;
  user: { id: string; name: string | null; email: string | null };
}

interface UserOption {
  id: string;
  name: string | null;
  email: string | null;
}

export default async function DashboardVolunteersPage() {
  const [roles, users] = await Promise.all([
    prisma.volunteerRole.findMany({
      include: { user: true },
      orderBy: [{ active: "desc" }, { team: "asc" }],
    }) as Promise<VolunteerRoleWithUser[]>,
    prisma.user.findMany({ select: { id: true, name: true, email: true } }) as Promise<UserOption[]>,
  ]);

  const teams = Array.from(new Set(roles.map((r) => r.team)));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Volunteers</h1>
          <p className="text-muted-foreground mt-1">Manage volunteer teams and roles.</p>
        </div>
        <VolunteerForm users={users} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Roles</p>
                <p className="font-heading text-2xl font-bold mt-1">{roles.length}</p>
              </div>
              <HandHeart className="size-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="font-heading text-2xl font-bold mt-1">
                  {roles.filter((r) => r.active).length}
                </p>
              </div>
              <Users className="size-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Teams</p>
                <p className="font-heading text-2xl font-bold mt-1">{teams.length}</p>
              </div>
              <Users className="size-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team}
              team={team}
              roles={roles.filter((r) => r.team === team)}
              users={users}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <HandHeart className="size-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No volunteer roles yet. Assign your first role.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}