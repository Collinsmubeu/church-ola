# Church Ola - AGENTS.md

## Project Overview
Church Ola is a Next.js 15 (App Router) church management application built with TypeScript, Tailwind CSS, shadcn/ui, Prisma + PostgreSQL, and NextAuth.js.

## Tech Stack
- Next.js 15 (App Router) with src/ directory
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + PostgreSQL
- NextAuth.js v5
- next-themes for dark mode
- lucide-react for icons
- zustand for state management
- sonner for toasts

## Project Structure
See TODO.md for full structure reference.

## Key Conventions
- Server Components by default; "use client" only where interactivity needed
- Server Actions for mutations (useActionState + useActionState)
- Toasts via sonner
- Auth guard via middleware.ts + auth() in dashboard layout
- Floating audio player via zustand (useAudioPlayer)
- Prisma queries in lib/db/queries
- shadcn/ui components in src/components/ui

## Database
- PostgreSQL via Prisma
- Schema in prisma/schema.prisma
- Seed in prisma/seed.ts (run: `npx prisma db seed`)

## Environment Variables
- DATABASE_URL: postgresql connection string
- AUTH_SECRET / NEXTAUTH_SECRET
- AUTH_URL / NEXTAUTH_URL

## Scripts
- `npm run dev` - start dev server
- `npm run build` - build production
- `npm run prisma:push` - push schema
- `npm run prisma:seed` - seed data
- `npm run typecheck` - type check

## Design Guidelines
- Playfair Display for headings (serif), Inter for body
- Warm, welcoming color palette (neutral base with warm accents)
- Responsive: mobile-first, works on all screen sizes
- Dark mode support via next-themes
- Smooth transitions and hover states
- Accessible: proper ARIA labels, keyboard navigation