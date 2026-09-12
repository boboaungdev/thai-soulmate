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
   - Strictly load country, dialing code, and flag data from the local `data/countries.json` file.

---

## 2. Architecture Guidelines (kkhay Server-First Style)

Always adhere strictly to the **kkhay Server-First / Feature-Based Architecture**:

### A. Zero `app/api/` Routes
- Do **NOT** create `app/api/` routes for internal app data fetching, mutations, or workflows.
- No `fetch('/api/...')` style calls from client components.
- The only exception is third-party webhooks requiring raw request payload inspection.

### B. Server Actions First
- Implement all data mutations, form submissions, and data retrieval actions as Server Actions located in `features/<feature>/actions/`.
- Keep actions modular, strongly typed with Zod schemas (`features/<feature>/schemas/`), and returning consistent typed result envelopes:
  `{ ok: true, data: T } | { ok: false, error: string }`.

### C. 3-Tier Layering Inside Features
Every domain module lives under `features/<feature>/`:
- `actions/`: `"use server"` Server Actions (input validation with Zod, calling services).
- `services/`: Domain business logic, email notification triggers, and data transformation (decoupled from HTTP).
- `repositories/`: Pure database access layer with Prisma. Only place where `prisma.<model>` queries live.
- `components/`: Feature-specific UI components, forms, cards, and modal dialogs.
- `schemas/`: Zod validation schemas shared across client forms and server actions.
- `store/`: Feature-scoped Zustand stores (if client state is needed). No global store sprawl.
- `types/`: Feature-specific TypeScript interfaces and types.
- `index.ts`: Clean public exports for the feature.

### D. Clean Root `components/` Directory
The root `components/` folder is strictly reserved for:
- `components/ui/`: shadcn primitive UI components (`button.tsx`, `dialog.tsx`, `input.tsx`, etc.).
- `components/layout/`: Global layout components (`web-nav-bar.tsx`, `app-sidebar.tsx`, `footer.tsx`).
- Global providers (`theme-provider.tsx`, `theme-toggle.tsx`, `app-name.tsx`).
- **NO feature components, NO forms, and NO application-form files in root `components/`**. All feature components must reside in their corresponding `features/<feature>/components/` directory.

### E. Ultra-Thin Page Wrappers (`app/**/page.tsx`)
- App router pages must be ultra-thin wrappers (10–30 lines).
- Pages simply import and render the corresponding feature component and pass necessary server/search params.

---

## 3. Brand & Luxury Design System

The brand identity is an exclusive, luxury personal matchmaking service for foreign gentlemen and relationship-minded Thai ladies.

### Color Tokens
- **Gold**: `#D3A753` / `#CFA14F` (accents, buttons, primary highlights)
- **Blush**: `#E791A7` (gradient midpoint, soft badges)
- **Rose**: `#CA617D` (gradient terminus, heart/love accents)
- **Burgundy / Dark Background**: `#11070A`, `#1C0E12`, `#5A0816`
- **Warm Cream (Email Background)**: `#FBF8F3`

### Common CSS Classes & Utilities
- Gradient text: `text-gradient` (`bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D] bg-clip-text text-transparent`)
- Gradient buttons: `btn-gradient`
- Atmosphere: Radial background glows (`rgba(211, 167, 83, 0.08)`), Framer Motion smooth reveals, floating luxury elements.

---

## 4. Register Interest Architecture & Data Contract

The **Register Interest** consultation flow (`features/interest/components/register-interest-form.tsx`) has a strict data contract. Do not add fictitious fields or artificial sources.

### Data Collected Strictly from User
| Field | Type | Description / Accepted Values |
|---|---|---|
| `prefix` | `string` | `"Mr."`, `"Ms."`, `"Mrs."`, `"Dr."` |
| `name` | `string` | User's `firstName` + `lastName` |
| `gender` | `string` | `"Male"`, `"Female"` |
| `currentLocation` | `string` | Country name selected from combobox (loaded from `data/countries.json`) |
| `email` | `string` | Validated lowercase email |
| `phoneCountry` | `string` | International calling code with `+` (e.g. `"+66"`, `"+44"`, `"+1"`). **NOT** ISO 2-letter codes. |
| `phone` | `string` | Phone / WhatsApp digits only (e.g. `"901234567"`) |
| `relationshipGoal` | `string` | `"Marriage / Life Partner"`, `"Long-Term Relationship"`, `"Companionship"`, `"I'm Not Sure Yet"` |
| `preferredContactDate` | `DateTime` | Selected appointment date within next 7 days (weekdays only) |
| `preferredContactTime` | `string` | 1-hour window: `"10:00 - 11:00"` through `"19:00 - 20:00"` (ICT) |

### System & Default Fields
- `source`: Strictly `"Website Consultation"` (do not introduce arbitrary social media sources like Facebook, Instagram, Google).
- `nationality` & `nationalityRegion`: Auto-derived from `currentLocation`.
- `currentLocationRegion`: Auto-derived from `currentLocation`.
- `dob`: **NOT** collected in Register Interest (remains `null` in DB; only collected in full Application Form).
- `status`: Defaults to `RECEIVED`.

---

## 5. Prisma & Database Workflow

- **Prisma Client Path**: Generated to `./lib/generated/prisma` (imported via `@/lib/generated/prisma/client`).
- **Database Driver**: Neon Serverless PostgreSQL with `@prisma/adapter-neon`.
- **Direct Script Execution**: When running standalone tsx/Prisma scripts, always import `dotenv/config` or run via `node --env-file=.env ./node_modules/.bin/tsx <script-path>`.
- **Verification**: Always run `npx tsc --noEmit` after changing schema, seed, or types to ensure 0 TypeScript errors.

---

## 6. Email Templates & Communications

- **Engine**: React-Email with Resend (`emails/`).
- **Shared Layout**: All member emails use `<MemberEmailLayout>` (`emails/components/member-email-layout.tsx`) with warm cream background (`#FBF8F3`), branded SVG gradient wordmark, and `<EmailSignature />`.
- **Preview Route**: Test email rendering visually at `/preview/member-emails` and `/preview/admin-notification`.

---

## 7. Service Identity & Copywriting Tone

- **Not a Dating App**: We never refer to Thai Soulmate as an app, dating site, or automated algorithm.
- **Positioning**: "Personal Assistant in Your Search for a Life Partner in Thailand" — 1-2-1 dedicated, confidential, curated human matchmaking.
- **Values**: Integrity, Empathy, Discretion, Mutual Consent, In-person/Video verification.

---

## 8. Responsive & Adaptive Layout Design Standards

All layouts, pages, components, and interactive widgets must be built strictly mobile-first and responsive across all viewports (Mobile `< 640px`, Tablet `640px - 1024px`, Desktop `> 1024px`).

### Layout & Container Rules
- **Zero Horizontal Overflow**: Never allow unintentional horizontal scrolling. Outer containers must use `overflow-x-clip` or `overflow-x-hidden`.
- **Standard Page Padding**: Always use standard responsive horizontal container padding: `px-4 sm:px-6 lg:px-8` with `mx-auto max-w-7xl` (or `max-w-5xl` for content/forms).
- **Section Spacing**: Vertical rhythm should scale responsively: `py-12 sm:py-16 md:py-24`.
- **Fluid Typography**: Scale headings fluidly across breakpoints (e.g. `text-2xl sm:text-3xl md:text-4xl lg:text-5xl`).

### Forms & Interactive Elements
- **Grid Adaptability**: Form rows and grids must collapse to single-column on mobile (`grid-cols-1`) and expand cleanly on desktop (`sm:grid-cols-2`, `lg:grid-cols-3`).
- **Touch Targets**: All buttons, triggers, comboboxes, and form inputs must maintain accessible touch-friendly heights (minimum `h-9` to `h-11` on mobile) and accessible tap padding.
- **Popovers, Dialogs & Sheets**:
  - Ensure popovers (calendars, country comboboxes) fit viewport widths with `max-w-[calc(100vw-2rem)]` or responsive width classes (`w-[300px] sm:w-[400px]`).
  - Sheets and slide-over drawers should use `w-full sm:max-w-md` or `w-[90vw] sm:w-[540px]`.

### Sticky Elements & Overlays
- **Floating Widgets**: The floating WhatsApp button must have mobile-safe offsets (`right-4 bottom-4 sm:right-6 sm:bottom-6`) with high z-index, ensuring it never obstructs submit buttons or essential form actions.
- **Navigation Bar**: Responsive mobile hamburger menu with full slide-over navigation sheet, blur backdrop, and lock scroll when open.
- **Data Tables (Dashboard)**: Wrap tables in scroll containers (`overflow-x-auto`) or provide card views for mobile screens.
