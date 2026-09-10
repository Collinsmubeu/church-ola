import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "403 - Access Denied | Church Ola",
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <ShieldAlert className="size-16 text-muted-foreground mb-4" />
      <h1 className="font-heading text-4xl font-bold">403 — Access Denied</h1>
      <p className="mt-2 text-muted-foreground max-w-md">
        You do not have permission to view this page. If you believe this is an error,
        please contact the church office.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}