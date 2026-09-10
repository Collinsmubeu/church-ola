import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { can, Role } from "@/lib/permissions";
import { DonationTable } from "@/components/features/donations/DonationTable";
import { DonationForm } from "@/components/features/donations/DonationForm";
import { deleteDonationAction } from "@/lib/actions/donations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, DollarSign, TrendingUp, Download } from "lucide-react";
import { Can } from "@/components/Can";

export const metadata: Metadata = {
  title: "Donations | Church Ola",
};

interface DonationWithDonor {
  id: string;
  amount: number;
  currency: string;
  type: string;
  note: string | null;
  createdAt: Date;
  donor: { name: string | null; email: string | null } | null;
}

export default async function DashboardDonationsPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const userRole = (session.user as any)?.role as Role;

  if (!can(userRole, "giving:viewAll")) {
    redirect("/dashboard");
  }

  const donations = await prisma.donation.findMany({
    include: { donor: true },
    orderBy: { createdAt: "desc" },
  }) as DonationWithDonor[];

  const total = donations.reduce((sum, d) => sum + d.amount, 0);
  const thisMonth = donations
    .filter((d) => {
      const now = new Date();
      return (
        d.createdAt.getFullYear() === now.getFullYear() &&
        d.createdAt.getMonth() === now.getMonth()
      );
    })
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Donations</h1>
          <p className="text-muted-foreground mt-1">Track and manage donations.</p>
        </div>
        <Can action="giving:refund">
          <DonationForm />
        </Can>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="font-heading text-2xl font-bold mt-1">
                  ${total.toFixed(2)}
                </p>
              </div>
              <DollarSign className="size-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="font-heading text-2xl font-bold mt-1">
                  ${thisMonth.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="size-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="font-heading text-2xl font-bold mt-1">{donations.length}</p>
              </div>
              <Heart className="size-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold">Donation History</h3>
            <Can action="giving:export">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="size-4" /> Export CSV
              </Button>
            </Can>
          </div>
          <DonationTable donations={donations} />
        </CardContent>
      </Card>
    </div>
  );
}