import { Metadata } from "next";
import { prisma } from "@/lib/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Church, Mail, Phone, User, Shield } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";
import { ROLE_LABELS } from "@/lib/roles";

export const metadata: Metadata = {
  title: "Staff &amp; Leadership | Church Ola",
};

export default async function StaffPage() {
  const staff = await prisma.user.findMany({
    where: {
      isActive: true,
      role: {
        in: ["SUPER_ADMIN", "ADMIN", "PASTOR", "ELDER", "DEACON", "MINISTRY_LEAD", "COUNSELOR"],
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <PublicLayout>
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="size-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Church className="size-10 text-primary" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Staff &amp; Leadership</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Meet the people who serve Church Ola every day.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {staff.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {staff.map((person) => (
                <Card key={person.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="size-8 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-lg font-semibold truncate">{person.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {ROLE_LABELS[person.role as keyof typeof ROLE_LABELS] ?? person.role}
                        </Badge>
                        <div className="mt-3 space-y-2">
                          {person.email && (
                            <a
                              href={`mailto:${person.email}`}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                              <Mail className="size-4" /> {person.email}
                            </a>
                          )}
                          {person.phone && (
                            <a
                              href={`tel:${person.phone}`}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                              <Phone className="size-4" /> {person.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Staff information is being updated. Check back soon!</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              For pastoral care or confidential matters, contact{" "}
              <a href="mailto:care@churchola.org" className="text-primary hover:underline">
                care@churchola.org
              </a>.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}