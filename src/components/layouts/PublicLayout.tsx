"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Church, Menu, X, LogOut } from "lucide-react";
import { Suspense } from "react";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/sermons", label: "Sermons" },
  { href: "/give", label: "Give" },
  { href: "/ministries", label: "Ministries" },
  { href: "/staff", label: "Staff" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && status === "authenticated" && session?.user;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Church className="size-8 text-primary" />
            <span className="font-heading text-xl font-bold tracking-tight">
              Church Ola
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Suspense fallback={<div className="size-9" />}>
              <ThemeToggle />
            </Suspense>
            {isLoggedIn ? (
              <Link href="/dashboard" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm">
                  Member Login
                </Button>
              </Link>
            )}
            {!isLoggedIn && (
              <Link href="/auth/register">
                <Button size="sm">Join Us</Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Church className="size-7 text-primary" />
                <span className="font-heading text-lg font-bold">Church Ola</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Deep Faith. True Community. Welcome home.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Sundays 10:00 AM</li>
                <li>Wednesdays 7:00 PM</li>
                <li>Youth Fridays 7:00 PM</li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/events" className="hover:text-foreground">Events</Link></li>
                <li><Link href="/sermons" className="hover:text-foreground">Sermons</Link></li>
                <li><Link href="/give" className="hover:text-foreground">Give</Link></li>
                <li><Link href="/ministries" className="hover:text-foreground">Ministries</Link></li>
                <li><Link href="/staff" className="hover:text-foreground">Staff</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Visit Us</h4>
              <p className="text-sm text-muted-foreground">
                123 Faith Avenue
                <br />
                Community City, CC 12345
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Church Ola. All rights reserved.
          </div>
        </div>
      </footer>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <Church className="size-7 text-primary" />
              <span className="font-heading text-lg font-bold">Church Ola</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="size-5" />
            </Button>
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="size-4 mr-2" /> Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Member Login</Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setOpen(false)}>
                    <Button className="w-full">Join Us</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}