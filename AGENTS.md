<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Thai Soulmate — Project & Agent Rules

## 1. Absolute Hard Constraints

1. **Prohibited Location Name**:
   - STRICT RULE: Exactly **0 occurrences** of the Thai capital city name (B-word) across all codebase files, copy, UI labels, seed data, form options, and comments.
   - Always use **"Thailand"** or country-level references instead.

2. **Application Form Protection**:
   - Do **NOT** modify, refactor, or delete `/application-form` (`app/(website)/application-form/page.tsx`) without explicit instruction from the user.

---

## 2. Brand & Luxury Design System

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

## 3. Register Interest Architecture & Data Contract

The **Register Interest** consultation flow on the home page (`components/register-interest-form.tsx`) has a strict data contract. Do not add fictitious fields or artificial sources.

### Data Collected Strictly from User
| Field | Type | Description / Accepted Values |
|---|---|---|
| `prefix` | `string` | `"Mr."`, `"Ms."`, `"Mrs."`, `"Dr."` |
| `name` | `string` | User's `firstName` + `lastName` |
| `gender` | `string` | `"Male"`, `"Female"` |
| `currentLocation` | `string` | Country name selected from combobox (e.g. `"Thailand"`, `"United Kingdom"`) |
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

## 4. Prisma & Database Workflow

- **Prisma Client Path**: Generated to `./lib/generated/prisma` (imported via `@/lib/generated/prisma/client`).
- **Database Driver**: Neon Serverless PostgreSQL with `@prisma/adapter-neon`.
- **Direct Script Execution**: When running standalone tsx/Prisma scripts, always import `dotenv/config` or run via `node --env-file=.env ./node_modules/.bin/tsx <script-path>`.
- **Verification**: Always run `npx tsc --noEmit` after changing schema, seed, or types to ensure 0 TypeScript errors.

---

## 5. Email Templates & Communications

- **Engine**: React-Email with Resend (`emails/`).
- **Shared Layout**: All member emails use `<MemberEmailLayout>` (`emails/components/member-email-layout.tsx`) with warm cream background (`#FBF8F3`), branded SVG gradient wordmark, and `<EmailSignature />`.
- **Preview Route**: Test email rendering visually at `/preview/member-emails` and `/preview/admin-emails`.

---

## 6. Service Identity & Copywriting Tone

- **Not a Dating App**: We never refer to Thai Soulmate as an app, dating site, or automated algorithm.
- **Positioning**: "Personal Assistant in Your Search for a Life Partner in Thailand" — 1-2-1 dedicated, confidential, curated human matchmaking.
- **Values**: Integrity, Empathy, Discretion, Mutual Consent, In-person/Video verification.
