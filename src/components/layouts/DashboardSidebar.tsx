"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Can } from "@/components/Can";
import {
  Menu,
  Church,
  Users,
  Calendar,
  Heart,
  Music,
  HandHeart,
  LogOut,
  X,
  Shield,
  BarChart3,
  Settings,
  FolderOpen,
  Megaphone,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface User {
  name?: string | null;
  email?: string | null;
  role?: string;
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: BarChart3, action: null },
  { href: "/dashboard/events", label: "Events", icon: Calendar, action: "event:create" },
  { href: "/dashboard/sermons", label: "Sermons", icon: Music, action: "sermon:upload" },
  { href: "/dashboard/donations", label: "Donations", icon: Heart, action: "giving:viewAll" },
  { href: "/dashboard/volunteers", label: "Volunteers", icon: HandHeart, action: "group:viewRoster" },
  { href: "/dashboard/members", label: "Members", icon: Users, action: "user:create" },
  { href: "/dashboard/staff", label: "Staff", icon: Shield, action: "user:create" },
  { href: "/dashboard/ministries", label: "Ministries", icon: Users, action: "group:viewRoster" },
  { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone, action: "announcement:publish" },
  { href: "/dashboard/reports", label: "Reports", icon: FolderOpen, action: "reports:financial" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, action: "settings:edit" },
];

export function DashboardSidebar({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
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
      <aside
        className={`hidden md:flex border-r border-border bg-background/80 flex-col transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold">Dashboard</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`size-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </Button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const link = (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-5" />
                {!collapsed && item.label}
              </Link>
            );
            return item.action ? (
              <Can key={item.href} action={item.action}>
                {link}
              </Can>
            ) : (
              link
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className={`px-3 py-2 mb-2 ${collapsed && "hidden"}`}>
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            {user?.role && (
              <p className="text-xs text-muted-foreground capitalize mt-1 flex items-center gap-1">
                <Shield className="size-3" /> {user.role.toLowerCase().replace("_", " ")}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="size-5" />
            {!collapsed && "Sign out"}
          </Button>
        </div>
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <span className="font-heading text-lg font-bold">Dashboard</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="size-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const link = (
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
              return item.action ? (
                <Can key={item.href} action={item.action}>
                  {link}
                </Can>
              ) : (
                link
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