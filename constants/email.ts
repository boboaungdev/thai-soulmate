export interface EmailAccount {
  id: string
  email: string
  name: string
  description?: string
}

export interface EmailFolder {
  id: string
  title: string
  slug: string
}

export const EMAIL_ACCOUNTS: EmailAccount[] = [
  {
    id: "contact",
    email: "contact@thaisoulmate.org",
    name: "Contact",
    description: "Primary business and member inquiries",
  },
  {
    id: "admin",
    email: "admin@thaisoulmate.org",
    name: "Admin",
    description: "Administrative notifications and management",
  },
  {
    id: "socials",
    email: "socials@thaisoulmate.org",
    name: "Socials",
    description: "Social media and public channel inquiries",
  },
]

export const EMAIL_FOLDERS: EmailFolder[] = [
  {
    id: "inbox",
    title: "Inbox",
    slug: "inbox",
  },
  {
    id: "sent",
    title: "Sent",
    slug: "sent",
  },
  {
    id: "settings",
    title: "Settings",
    slug: "settings",
  },
]

// List of reserved / disallowed usernames and email addresses
export const DISALLOWED_EMAIL_USERNAMES = [
  // Administrative & System
  "admin",
  "administrator",
  "root",
  "system",
  "sysadmin",
  "superuser",
  "webmaster",
  "postmaster",
  "hostmaster",
  "daemon",
  "security",
  "auth",

  // Organization & Brand
  "thaisoulmate",
  "official",
  "company",
  "corp",
  "office",
  "hq",

  // Team & Roles
  "team",
  "staff",
  "member",
  "members",
  "moderator",
  "mod",
  "manager",
  "executive",
  "ceo",
  "cto",
  "cfo",
  "hr",
  "dev",
  "developer",
  "developers",

  // Support & Inquiries
  "contact",
  "support",
  "help",
  "info",
  "inquiry",
  "inquiries",
  "service",
  "services",
  "customercare",
  "feedback",

  // Finance, Legal & Sales
  "billing",
  "finance",
  "payment",
  "payments",
  "invoice",
  "invoices",
  "accounting",
  "sales",
  "legal",
  "compliance",
  "privacy",

  // Notifications & Marketing
  "notify",
  "notification",
  "notifications",
  "noreply",
  "no-reply",
  "donotreply",
  "alert",
  "alerts",
  "newsletter",
  "news",
  "updates",
  "marketing",
  "socials",
  "press",
  "media",
  "promo",

  // Matchmaking & Platform Features
  "matchmaking",
  "matchmaker",
  "matchmakers",
  "match",
  "soulmate",
  "vip",
  "premium",
  "api",
  "mail",
  "email",
  "inbox",
  "test",
  "demo",
] as const

/**
 * Checks if a given username or email address is in the disallowed/reserved list
 */
export function isDisallowedEmail(usernameOrEmail: string): boolean {
  if (!usernameOrEmail) return false
  const clean = usernameOrEmail
    .toLowerCase()
    .replace(/@thaisoulmate\.org$/i, "")
    .replace(/[@\s]/g, "")
    .trim()

  return (DISALLOWED_EMAIL_USERNAMES as readonly string[]).includes(clean)
}
