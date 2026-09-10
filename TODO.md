# Church Ola - Website Structure Reference

This file tracks the Church Ola project structure for future reference.

## Tech Stack
- Next.js 15 (App Router) with src/ directory
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Prisma + PostgreSQL
- NextAuth.js (v5)
- next-themes for dark mode
- lucide-react for icons
- zustand for state management
- sonner for toasts

## Project Structure
```
src/
├── app/
│   ├── layout.tsx              ← Root layout (fonts, ThemeProvider, metadata)
│   ├── page.tsx                ← Landing page
│   ├── globals.css
│   ├── about/page.tsx
│   ├── events/page.tsx         ← Events list
│   ├── events/[id]/page.tsx    ← Event detail
│   ├── sermons/page.tsx        ← Sermon archive
│   ├── sermons/[id]/page.tsx   ← Sermon player
│   ├── auth/login/page.tsx
│   ├── auth/register/page.tsx
│   ├── auth/layout.tsx
│   ├── dashboard/layout.tsx    ← Sidebar + auth guard
│   ├── dashboard/dashboard/page.tsx  ← Overview
│   ├── dashboard/events/page.tsx
│   ├── dashboard/sermons/page.tsx
│   ├── dashboard/donations/page.tsx
│   ├── dashboard/volunteers/page.tsx
│   └── api/
│       ├── events/route.ts
│       ├── events/[id]/route.ts
│       ├── sermons/route.ts
│       ├── sermons/[id]/route.ts
│       ├── donations/route.ts
│       ├── auth/[...nextauth]/route.ts
│       └── auth/register/route.ts
├── components/
│   ├── layouts/PublicLayout.tsx
│   ├── layouts/DashboardSidebar.tsx
│   ├── theme-toggle.tsx
│   ├── ui/delete-button.tsx
│   ├── features/events/EventCard.tsx, EventForm.tsx, RsvpForm.tsx
│   ├── features/sermons/SermonCard.tsx, SermonPlayer.tsx, SermonForm.tsx
│   ├── features/donations/DonationForm.tsx, DonationTable.tsx
│   ├── features/volunteers/VolunteerForm.tsx, TeamCard.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── db/client.ts, queries/{events,sermons,donations,volunteers}.ts
│   ├── actions/{events,sermons,donations,volunteers}.ts
│   ├── auth/options.ts, auth.ts
│   └── utils.ts
├── hooks/useAudioPlayer.ts
├── types/{event,sermon,donation,volunteer,index}.ts
└── middleware.ts
```

## Key Patterns
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

## Environment
- DATABASE_URL: postgresql connection string
- AUTH_SECRET / NEXTAUTH_SECRET
- AUTH_URL / NEXTAUTH_URL

## Scripts
- `npm run dev` - start dev server
- `npm run build` - build production
- `npm run prisma:push` - push schema
- `npm run prisma:seed` - seed data
- `npm run typecheck` - type check