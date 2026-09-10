import { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";

export const metadata: Metadata = {
  title: "Dashboard | Church Ola",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as { name?: string | null; email?: string | null; role?: string; id?: string } | undefined;
  if (!session || !user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center px-6 bg-background/80 backdrop-blur">
          <h2 className="font-heading text-lg font-semibold">Dashboard</h2>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}