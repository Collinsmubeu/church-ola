import type { SermonWithMeta } from "@/types/sermon";
import { Calendar, Clock, Play, Volume2, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface SermonCardProps {
  sermon: SermonWithMeta;
}

export function SermonCard({ sermon }: SermonCardProps) {
  const sermonDate = new Date(sermon.date);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <Play className="size-16 text-primary" />
        {sermon.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {Math.floor(sermon.duration / 60)} min
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Calendar className="size-3" /> {format(sermonDate, "MMM d, yyyy")}
        </div>
        <h3 className="font-heading text-lg font-semibold mb-1">{sermon.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {sermon.description || "No description available."}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Pastor {sermon.speaker}</span>
          <div className="flex gap-1">
            {sermon.audioUrl && (
              <Button size="icon-sm" variant="ghost" aria-label="Listen to audio">
                <Volume2 className="size-4" />
              </Button>
            )}
            <Button size="icon-sm" variant="ghost" aria-label="Share">
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}