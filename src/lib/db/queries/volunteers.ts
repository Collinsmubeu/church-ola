import { prisma } from "@/lib/db/client";
import type { VolunteerRole } from "@prisma/client";

export async function getVolunteerRoles() {
  return prisma.volunteerRole.findMany({
    include: { user: true },
    orderBy: [{ active: "desc" }, { team: "asc" }],
  });
}

export async function createVolunteerRole(data: {
  team: string;
  role: string;
  userId: string;
  active?: boolean;
}) {
  return prisma.volunteerRole.create({ data });
}

export async function updateVolunteerRole(
  id: string,
  data: Partial<{ team: string; role: string; active: boolean }>
) {
  return prisma.volunteerRole.update({ where: { id }, data });
}

export async function deleteVolunteerRole(id: string) {
  return prisma.volunteerRole.delete({ where: { id } });
}

export async function getVolunteerTeams() {
  const roles = await prisma.volunteerRole.groupBy({
    by: ["team"],
    _count: true,
  });
  return roles.map((r) => ({ team: r.team, count: r._count }));
}