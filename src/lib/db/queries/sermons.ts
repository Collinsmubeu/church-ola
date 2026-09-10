import { prisma } from "@/lib/db/client";
import type { Sermon } from "@prisma/client";

export type SermonWithMeta = Sermon;

export async function getSermons(speaker?: string, search?: string) {
  return prisma.sermon.findMany({
    where: {
      ...(speaker ? { speaker } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { date: "desc" },
  });
}

export async function getSermonById(id: string) {
  return prisma.sermon.findUnique({ where: { id } });
}

export async function createSermon(data: {
  title: string;
  description?: string;
  videoUrl: string;
  audioUrl?: string;
  speaker: string;
  date: Date;
  duration?: number;
}) {
  return prisma.sermon.create({ data });
}

export async function updateSermon(
  id: string,
  data: Partial<{
    title: string;
    description: string | null;
    videoUrl: string;
    audioUrl: string | null;
    speaker: string;
    date: Date;
    duration: number | null;
  }>
) {
  return prisma.sermon.update({ where: { id }, data });
}

export async function deleteSermon(id: string) {
  return prisma.sermon.delete({ where: { id } });
}