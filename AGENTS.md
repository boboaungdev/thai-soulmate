<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Thai Soulmate — Project & Agent Rules

## 1. Absolute Hard Constraints

1. **Prohibited Location Name**:
   - STRICT RULE: Exactly **0 occurrences** of the Thai capital city name (B-word) across all codebase files, copy, UI labels, seed data, form options, and comments.
   - Always use **"Thailand"** or country-level references instead.

2. **No Third-Party Countries API**:
   - Never fetch country or dial code lists from third-party remote APIs (e.g. `countries.dev`).
   - Strictly load country, dialing code, and flag data from local `features/shared/data/countries.json` via `@/features/shared`.

3. **Service Identity & Positioning**:
   - Never refer to Thai Soulmate as an "app", "dating site", or "automated algorithm".
   - Positioning: "Personal Assistant in Your Search for a Life Partner in Thailand" — 1-2-1 dedicated, confidential, verified human matchmaking.

---

## 2. Architecture Guidelines (kkhay Server-First Style)

Strictly adhere to the **Server-First / Feature-Based Architecture**:

### A. Zero `app/api/` Routes & Zero Non-Route Files in `app/`

- **NO `app/api/` directory**: Do NOT create API routes for internal mutations, data fetching, or standard workflows. No `fetch('/api/...')` from client components.
- **Incoming Redirects / Webhooks**: Use Route Handlers under `app/auth/callback/[provider]/route.ts` or `app/webhooks/[provider]/route.ts` only when strictly required (e.g. OAuth callbacks, third-party webhook signature inspection).
- **0 non-route files in `app/`**: The `app/` directory must contain ONLY route entry points (`page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx`, `error.tsx`, `route.ts`). All components, forms, tables, schemas, and dialogs belong in `features/<feature>/` or `components/ui/`.

### B. Ultra-Thin Page Wrappers (`app/**/page.tsx`)

- App router pages must be ultra-thin wrappers (strictly 4–10 lines).
- **No inline HTML tags, titles, headers (`<h1>`, `<p>`), or layout divs** in `page.tsx`.
- Pages simply import and render the corresponding feature view component (e.g. `<CalendarView />`, `<WebsiteGalleryView />`).

### C. 3-Tier Layering Inside Features (`features/<feature>/`)

Every domain feature lives under `features/<feature>/`:

- `actions/`: `"use server"` Server Actions (strongly typed with Zod schemas, returning `{ ok: true, data: T } | { ok: false, error: string }`).
- `services/`: Pure business logic, email notifications, data transformations (decoupled from HTTP/React).
- `repositories/`: Pure database access layer with Prisma. Only place where `prisma.<model>` queries live.
- `components/`: Feature-specific UI components, forms, dialogs, sheets, tables, and page views (`<feature>-view.tsx`).
- `schemas/`: Zod validation schemas shared across forms and server actions.
- `store/`: Feature-scoped Zustand stores (if client state is needed). No global store sprawl.
- `types/` & `constants/`: Feature TypeScript interfaces and static configurations.
- `index.ts`: Clean public exports for the feature.

### D. Clean Root Directories

- `components/ui/`: shadcn primitive UI components (`button.tsx`, `dialog.tsx`, `data-table/`, etc.).
- `components/layout/`: Global layout components (`web-nav-bar.tsx`, `app-sidebar.tsx`, `footer.tsx`).
- `components/`: Only global providers (`theme-provider.tsx`, `app-name.tsx`, `motion.tsx`). **Zero feature forms or screens**.
- `lib/`: Shared utilities (`utils.ts`, `prisma.ts`, `generated/prisma/`).

---

## 3. UI Design System & Brand Aesthetic (Luxury Modern SaaS Style)

Combine the **Linear / Modern SaaS / DevTools** aesthetic with Thai Soulmate's **Luxury Brand**:

### A. Luxury Brand Tokens

- **Gold**: `#D3A753` / `#CFA14F` (primary brand, highlights, CTAs)
- **Blush**: `#E791A7` (gradient midpoint, soft badges)
- **Rose**: `#CA617D` (gradient terminus, heart/love accents)
- **Burgundy / Dark Background**: `#11070A`, `#1C0E12`, `#5A0816`
- **Warm Cream**: `#FBF8F3` (email templates)
- **Utilities**: `text-gradient`, `btn-gradient`, ambient radial glows (`rgba(211, 167, 83, 0.08)`)

### B. Aesthetic & Typography

- **Surfaces**: Frosted glass headers (`backdrop-blur-md bg-background/80 supports-[backdrop-filter]:bg-background/70`) with crisp borders (`border-border/70`).
- **Cards & Tiles**: Clean rounded bento cards (`rounded-xl border bg-card/60 shadow-xs`) with dedicated icon containers (`size-8` / `size-9` rounded containers with soft tints `bg-primary/10 text-primary`).
- **Typography**: `text-sm` for base body text and inputs, `text-xs sm:text-sm` for descriptions (`text-muted-foreground`), and `text-xs` for status badges. Avoid arbitrary sub-12px sizes (`text-[9px]`, `text-[10px]`).

### C. Mobile-First & Responsive Standards

- **Zero Horizontal Overflow**: Outer containers must use `overflow-x-clip` or `overflow-x-hidden`.
- **Standard Padding**: Always use `px-4 sm:px-6 lg:px-8` with `mx-auto max-w-7xl` (or `max-w-5xl` for forms/content).
- **Touch Targets**: Minimum 44×44px touch targets on mobile (`min-h-11 min-w-11` or accessible tap padding).
- **Adaptive Controls**: Tables wrap in `overflow-x-auto` or card views; forms collapse to single-column on mobile (`grid-cols-1`) and expand on desktop (`sm:grid-cols-2`, `lg:grid-cols-3`).
- **Floating Overlays**: High z-index with mobile-safe offsets (`right-4 bottom-4 sm:right-6 sm:bottom-6`), never obstructing action buttons.

---

## 4. Prisma & Database Workflow

- **Prisma Client Path**: Generated to `./lib/generated/prisma` (imported via `@/lib/generated/prisma/client`).
- **Database Driver**: Neon Serverless PostgreSQL with `@prisma/adapter-neon`.
- **Direct Script Execution**: Standalone scripts run via `dotenv/config` or `node --env-file=.env ./node_modules/.bin/tsx <script-path>`.
- **Verification Rule**: Always run `npx tsc --noEmit` and `npm run build` to guarantee 0 TypeScript or bundling errors.

---

## 5. Email Templates & Communications

- **Engine**: React-Email with Resend.
- **Shared Layout & Primitives**: Shared email templates and layout live in `features/shared/emails/` (`<MemberEmailLayout>`, `<EmailSignature>`, `<AdminNotification>`).
- **Feature-Colocated Emails**: Feature-specific emails live in `features/<feature>/emails/` (e.g. `features/interest/emails/`, `features/matching/emails/`).
- **Preview Route**: Test email rendering visually at `/preview/member-emails` and `/preview/admin-notification`.
