import { ApplicationForm as PrismaApplicationForm } from "@/lib/generated/prisma/client"

export interface PersonalDetails {
  name: string
  dob: string
  gender: string
  prefix: string
}

export interface Contact {
    currentLocation: string;
}

export interface Photos {
  headshot: string
}

// Extend the Prisma ApplicationForm to use the typed JSON fields
export interface ApplicationForm extends Omit<PrismaApplicationForm, "personalDetails" | "contact" | "career" | "appearance" | "personality" | "lifestyle" | "relationshipGoals" | "idealPartner" | "financial" | "photos"> {
    personalDetails: PersonalDetails;
    contact: Contact;
    photos: Photos;
}
