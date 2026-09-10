import { Metadata } from "next";
import { prisma } from "@/lib/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, Church, BookOpen, Music, Calendar, Phone, Mail, User } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";

export const metadata: Metadata = {
  title: "Ministries | Church Ola",
};

export default async function MinistriesPage() {
  const volunteerRoles = await prisma.volunteerRole.findMany({
    include: { user: true },
    where: { active: true },
  });

  const teams = volunteerRoles.reduce<Record<string, { role: string; user: any }[]>>((acc, vr) => {
    if (!acc[vr.team]) acc[vr.team] = [];
    acc[vr.team].push({ role: vr.role, user: vr.user });
    return acc;
  }, {});

  const teamIcons: Record<string, typeof Users> = {
    Kids: BookOpen,
    Youth: Music,
    Worship: Music,
    Outreach: Heart,
    Small: Users,
    Media: Church,
    Hospitality: Heart,
    Ushering: Users,
    Prayer: Heart,
  };

  return (
    <PublicLayout>
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="size-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="size-10 text-primary" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Ministries &amp; Involvement</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Find your place to serve and connect. We have ministries for every age group and interest.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {Object.keys(teams).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(teams).map(([team, members]) => {
                const Icon = teamIcons[team] ?? Users;
                return (
                  <Card key={team}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="size-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-semibold">{team}</h3>
                          <p className="text-sm text-muted-foreground">
                            {members.length} active volunteer{members.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {members.map((m) => (
                          <li key={m.user.id} className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium text-sm">{m.user.name}</p>
                              <p className="text-xs text-muted-foreground">{m.role}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {m.user.phone && (
                                <a
                                  href={`tel:${m.user.phone}`}
                                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                >
                                  <Phone className="size-3" /> {m.user.phone}
                                </a>
                              )}
                              {m.user.email && (
                                <a
                                  href={`mailto:${m.user.email}`}
                                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                >
                                  <Mail className="size-3" /> Email
                                </a>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Ministry information is being updated. Check back soon!</p>
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Small Groups", desc: "Connect in community throughout the week." },
              { icon: Heart, title: "Serve Our City", desc: "Use your gifts to help our neighbors." },
              { icon: Church, title: "Kids &amp; Youth", desc: "Safe, engaging programs for every age." },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6 text-center">
                  <item.icon className="size-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-heading text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-muted-foreground">
              Want to get involved? Contact us at{" "}
              <a href="mailto:info@churchola.org" className="text-primary hover:underline">
                info@churchola.org
              </a>.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}