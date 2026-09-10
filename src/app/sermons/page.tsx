import { Metadata } from "next";
import { prisma } from "@/lib/db/client";
import { SermonCard } from "@/components/features/sermons/SermonCard";

export const metadata: Metadata = {
  title: "Sermons | Church Ola",
};

export default async function SermonsPage() {
  const sermons = await prisma.sermon.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold">Sermon Archive</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Listen to past teachings and grow in your faith journey.
        </p>
      </div>
      {sermons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon) => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No sermons available yet.</p>
        </div>
      )}
    </div>
  );
}