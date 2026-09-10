import { Metadata } from "next";
import { prisma } from "@/lib/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Church, Heart, Users, BookOpen, MapPin, Clock } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";

export const metadata: Metadata = {
  title: "About | Church Ola",
};

export default async function AboutPage() {
  const [members, volunteerRoles] = await Promise.all([
    prisma.user.count(),
    prisma.volunteerRole.findMany({ include: { user: true } }),
  ]);

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">About Church Ola</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            We are a community of faith, hope, and love, dedicated to serving God and our neighbors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Users, label: "Members", value: members },
            { icon: Heart, label: "Volunteers", value: volunteerRoles.length },
            { icon: BookOpen, label: "Sermons", value: "100+" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6 text-center">
                <stat.icon className="size-10 mx-auto mb-3 text-primary" />
                <div className="font-heading text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="font-heading text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Church Ola began with a simple vision: to create a welcoming space where people of all
              backgrounds could explore faith together. What started as a small gathering has grown
              into a vibrant community of over 500 members.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe that faith is not just a personal journey but a collective one. Through
              worship, small groups, and serving our city, we seek to reflect the love of Christ
              in every corner of our community.
            </p>
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold mb-4">Our Values</h2>
            <ul className="space-y-3">
              {[
                "Welcome - Everyone belongs, no exceptions",
                "Community - We do life together",
                "Growth - We pursue spiritual maturity",
                "Service - We serve our city and the world",
                "Generosity - We give our time, talent, and treasure",
              ].map((value) => (
                <li key={value} className="flex items-start gap-3">
                  <Heart className="size-5 text-primary mt-0.5 shrink-0" />
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="size-5 text-primary" /> Service Times
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex justify-between"><span>Sunday Worship</span><span>10:00 AM</span></li>
                <li className="flex justify-between"><span>Wednesday Prayer</span><span>7:00 PM</span></li>
                <li className="flex justify-between"><span>Youth Group</span><span>Friday 7:00 PM</span></li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="size-5 text-primary" /> Location
              </h3>
              <p className="text-muted-foreground">
                123 Faith Avenue<br />
                Community City, CC 12345
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}