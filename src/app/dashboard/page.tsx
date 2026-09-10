import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Heart, Music, HandHeart, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Overview | Church Ola",
};

export default async function DashboardOverview() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const [userCount, events, sermons, donations, recentDonations] = await Promise.all([
    prisma.user.count(),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      include: { attendees: true },
      orderBy: { date: "asc" },
      take: 5,
    }),
    prisma.sermon.count(),
    prisma.donation.count(),
    prisma.donation.findMany({
      include: { donor: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Total Members", value: userCount, icon: Users, color: "text-primary" },
    { label: "Upcoming Events", value: events.length, icon: Calendar, color: "text-primary" },
    { label: "Total Sermons", value: sermons, icon: Music, color: "text-primary" },
    { label: "Donations", value: donations, icon: Heart, color: "text-primary" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {session.user?.name}. Here is what is happening at Church Ola.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`size-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="font-heading text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <ul className="space-y-4">
                {events.map((event) => (
                  <li key={event.id} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.date), "MMM d")} at {event.time}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {event.attendees.length} RSVPs
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No upcoming events.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDonations.length > 0 ? (
              <ul className="space-y-4">
                {recentDonations.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        ${d.amount.toFixed(2)} {d.currency}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {d.donor?.name || "Anonymous"} - {d.type.toLowerCase()}
                      </p>
                    </div>
                    <Clock className="size-4 text-muted-foreground" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No donations yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/events" className="block">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" /> Manage Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create, edit, and manage church events and RSVPs.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/sermons" className="block">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="size-5 text-primary" /> Manage Sermons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload sermons, set speakers, and organize your archive.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/donations" className="block">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="size-5 text-primary" /> Manage Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View donation history and export CSV reports.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}