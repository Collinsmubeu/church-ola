import { Metadata } from "next";
import { prisma } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/features/events/EventCard";
import { SermonCard } from "@/components/features/sermons/SermonCard";
import { Church, ArrowRight, Users, Heart, Calendar, Play } from "lucide-react";
import Link from "next/link";
import PublicLayout from "@/components/layouts/PublicLayout";

export const metadata: Metadata = {
  title: "Church Ola | Deep Faith. True Community.",
};

export default async function HomePage() {
  const [events, latestSermon, memberCount, sermonCount, donationCount] = await Promise.all([
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      include: { attendees: true },
      orderBy: { date: "asc" },
      take: 3,
    }),
    prisma.sermon.findFirst({ orderBy: { date: "desc" } }),
    prisma.user.count(),
    prisma.sermon.count(),
    prisma.donation.count(),
  ]);

  return (
    <PublicLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Welcome Home.<br />
              <span className="text-primary">Deep Faith.</span><br />
              True Community.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
              Church Ola is a welcoming community where everyone belongs. Join us
              for worship, small groups, and serving our city together.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/events">
                <Button size="lg" className="gap-2">
                  <Calendar className="size-5" /> Join Us This Sunday
                </Button>
              </Link>
              <Link href="/sermons">
                <Button size="lg" variant="outline" className="gap-2">
                  <Play className="size-5" /> Watch Live
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Members", value: memberCount },
              { icon: Heart, label: "Donations", value: donationCount },
              { icon: Calendar, label: "Events", value: events.length },
              { icon: Church, label: "Sermons", value: sermonCount },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="size-8 mx-auto mb-3 text-primary" />
                <div className="font-heading text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="ghost" className="gap-2">
                View all <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No upcoming events at the moment. Check back soon!
            </p>
          )}
        </div>
      </section>

      {latestSermon && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-heading text-3xl md:text-4xl font-bold">Latest Sermon</h2>
              <Link href="/sermons">
                <Button variant="ghost" className="gap-2">
                  All sermons <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
            <div className="max-w-2xl">
              <SermonCard sermon={latestSermon} />
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            Get Involved
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Small Groups",
                desc: "Connect with others in community groups that meet throughout the week.",
              },
              {
                icon: Heart,
                title: "Give Online",
                desc: "Support the mission of Church Ola with secure online giving.",
              },
              {
                icon: Church,
                title: "Serve Our City",
                desc: "Use your gifts to serve our church and local community.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="size-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="size-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}