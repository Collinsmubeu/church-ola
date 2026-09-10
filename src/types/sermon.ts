import type { Sermon } from "@prisma/client";

export interface SermonFormValues {
  title: string;
  description: string;
  videoUrl: string;
  audioUrl: string;
  speaker: string;
  date: string;
  duration?: number | null;
}

export type SermonWithMeta = Sermon;