import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { can, Role } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Heart, Music, HandHeart, ArrowRight, Clock, Shield } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Overview | Church Ola",
};

export default async function DashboardOverview() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const user = session.user as { id?: string; role?: Role; name?: string | null };
  const userRole = (user?.role || "GUEST") as Role;

  const [userCount, events, sermons, donations, recentDonations] = await Promise.all([
    can(userRole, "user:create") ? prisma.user.count() : Promise.resolve(0),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      include: { attendees: true },
      orderBy: { date: "asc" },
      take: 5,
    }),
    prisma.sermon.count(),
    can(userRole, "giving:viewAll") ? prisma.donation.count() : Promise.resolve(0),
    can(userRole, "giving:viewAll")
      ? prisma.donation.findMany({
          include: { donor: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
      : Promise.resolve([]),
  ]);

  const stats = [
    { label: "Total Members", value: userCount, icon: Users, color: "text-primary", show: can(userRole, "user:create") },
    { label: "Upcoming Events", value: events.length, icon: Calendar, color: "text-primary", show: true },
    { label: "Total Sermons", value: sermons, icon: Music, color: "text-primary", show: true },
    { label: "Donations", value: donations, icon: Heart, color: "text-primary", show: can(userRole, "giving:viewAll") },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {session.user?.name}. Here is what is happening at Church Ola.
        </p>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Shield className="size-3" /> Your role: {userRole.toLowerCase().replace("_", " ")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.filter(s => s.show).map((stat) => (
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
              <p className="text-muted-foreground text-sm">No donation data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/events" className="block">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" /> Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Browse and register for church events.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/sermons" className="block">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="size-5 text-primary" /> Sermons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Listen to recent messages and the archive.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/donations" className="block">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="size-5 text-primary" /> Give
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Make a donation or view your giving history.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}