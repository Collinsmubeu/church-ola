import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { SermonPlayer } from "@/components/features/sermons/SermonPlayer";
import { SermonCard } from "@/components/features/sermons/SermonCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Share2, Volume2 } from "lucide-react";
import { format } from "date-fns";

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "Sermon | Church Ola",
};

export default async function SermonDetailPage({ params }: PageProps) {
  const sermon = await prisma.sermon.findUnique({ where: { id: params.id } });
  if (!sermon) notFound();

  const related = await prisma.sermon.findMany({
    where: { id: { not: sermon.id } },
    orderBy: { date: "desc" },
    take: 3,
  });

  const sermonDate = new Date(sermon.date);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Badge className="mb-4">Sermon</Badge>
            <h1 className="font-heading text-4xl font-bold">{sermon.title}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="size-4" /> {sermon.speaker}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-4" /> {format(sermonDate, "MMMM d, yyyy")}
              </span>
              {sermon.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="size-4" /> {Math.floor(sermon.duration / 60)} min
                </span>
              )}
            </div>
          </div>

          <SermonPlayer sermon={sermon} />

          {sermon.description && (
            <div className="mt-8">
              <h2 className="font-heading text-2xl font-semibold mb-3">About this sermon</h2>
              <p className="text-muted-foreground leading-relaxed">
                {sermon.description}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="gap-2">
              <Share2 className="size-4" /> Share
            </Button>
            {sermon.audioUrl && (
              <Button variant="outline" className="gap-2">
                <Volume2 className="size-4" /> Download Audio
              </Button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <h3 className="font-heading text-xl font-semibold mb-4">More Sermons</h3>
          <div className="space-y-4">
            {related.length > 0 ? (
              related.map((s) => <SermonCard key={s.id} sermon={s} />)
            ) : (
              <p className="text-sm text-muted-foreground">No other sermons yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}