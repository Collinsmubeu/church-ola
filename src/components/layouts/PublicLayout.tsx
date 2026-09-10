import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Church, Menu, X } from "lucide-react";
import { Suspense } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/sermons", label: "Sermons" },
  { href: "/#give", label: "Give" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
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
            <Link href="/auth/login" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm">
                Member Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Join Us</Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
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
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Visit Us</h4>
              <p className="text-sm text-muted-foreground">
                123 Faith Avenue<br />
                Community City, CC 12345
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Church Ola. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}