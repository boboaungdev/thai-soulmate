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
