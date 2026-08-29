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
    id: "socials",
    email: "socials@gmail.com",
    name: "Socials",
    description: "Social media and public channel inquiries",
  },
  {
    id: "contact",
    email: "contact@thaisoulmate.com",
    name: "Contact",
    description: "Primary business and member inquiries",
  },
  {
    id: "admin",
    email: "admin@thaisoulmate.org",
    name: "Admin",
    description: "Administrative notifications and management",
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
