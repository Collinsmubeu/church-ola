"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu, Church, Users, Calendar, Heart, Music, HandHeart, LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface User {
  name?: string | null;
  email?: string | null;
  role?: string;
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Calendar },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/sermons", label: "Sermons", icon: Music },
  { href: "/dashboard/donations", label: "Donations", icon: Heart },
  { href: "/dashboard/volunteers", label: "Volunteers", icon: HandHeart },
];

export function DashboardSidebar({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-40 md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>
      <aside className="hidden md:flex w-64 border-r border-border bg-background/80 flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Church className="size-8 text-primary" />
            <span className="font-heading text-xl font-bold">Church Ola</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-5" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            {user?.role && (
              <p className="text-xs text-muted-foreground capitalize mt-1">
                {user.role.toLowerCase()}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="size-5" /> Sign out
          </Button>
        </div>
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <Church className="size-7 text-primary" />
              <span className="font-heading text-lg font-bold">Church Ola</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="size-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-5" /> {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="size-5" /> Sign out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}