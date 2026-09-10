import { Metadata } from "next";
import { prisma } from "@/lib/db/client";
import { SermonForm } from "@/components/features/sermons/SermonForm";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteSermonAction } from "@/lib/actions/sermons";
import { Music } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sermons | Church Ola",
};

interface SermonWithMeta {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  audioUrl: string | null;
  speaker: string;
  date: Date;
  duration: number | null;
}

export default async function DashboardSermonsPage() {
  const sermons = await prisma.sermon.findMany({
    orderBy: { date: "desc" },
  }) as SermonWithMeta[];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Manage Sermons</h1>
          <p className="text-muted-foreground mt-1">Upload and organize sermons.</p>
        </div>
        <SermonForm />
      </div>
      {sermons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sermons.map((sermon) => (
            <Card key={sermon.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <p className="text-xs text-muted-foreground">
                    {new Date(sermon.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="font-heading text-lg font-semibold mt-1">{sermon.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {sermon.description || "No description"}
                  </p>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>Speaker: {sermon.speaker}</p>
                    {sermon.duration && (
                      <p>Duration: {Math.floor(sermon.duration / 60)} min</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 p-4 border-t border-border bg-muted/30">
                  <SermonForm
                    sermon={{
                      id: sermon.id,
                      title: sermon.title,
                      description: sermon.description || "",
                      videoUrl: sermon.videoUrl,
                      audioUrl: sermon.audioUrl || "",
                      speaker: sermon.speaker,
                      date: new Date(sermon.date).toISOString().slice(0, 16),
                      duration: sermon.duration ?? undefined,
                    }}
                  />
                  <DeleteButton action={deleteSermonAction} id={sermon.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Music className="size-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No sermons yet. Add your first sermon.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}