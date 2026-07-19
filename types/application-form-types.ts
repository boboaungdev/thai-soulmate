import { ApplicationForm as PrismaApplicationForm } from "@/lib/generated/prisma/client"

export interface PersonalDetails {
  name: string
  dob: string
  gender: string
  prefix: string
}

export interface Contact {
  email: string;
  phone: string;
  nationality: string;
  currentLocation: string;
}

export interface Career {
  occupation: string
  company: string
  education: string
}

export interface Appearance {
  height: string
  weight: string
  religion: string
}

export interface Personality {
  personality: string[]
  about: string
  bestQualities: string[]
  lookingForQualities: string[]
}

export interface Lifestyle {
  lifestyle: string[]
  smoking: string
  drinking: string
  exercise: string
  interests: string[]
}

export interface RelationshipGoals {
    lookingFor: string[]
    relocate: string
    settleDown: string
}

export interface IdealPartner {
  ageRange: string
  nationality: string
  location: string
  height: string
  education: string
  personality: string[]
  qualities: string[]
  dealBreakers: string[]
}

export interface Financial {
  income: string
  ownProperty: string
  ownBusiness: string
}

export interface Photos {
  headshot: string
  fullLength: string
  casualLifestyle: string
  recent: string
}

// Extend the Prisma ApplicationForm to use the typed JSON fields
export interface ApplicationForm extends Omit<PrismaApplicationForm, "personalDetails" | "contact" | "career" | "appearance" | "personality" | "lifestyle" | "relationshipGoals" | "idealPartner" | "financial" | "photos"> {
    personalDetails: PersonalDetails;
    contact: Contact;
    career: Career;
    appearance: Appearance;
    personality: Personality;
    lifestyle: Lifestyle;
    relationshipGoals: RelationshipGoals;
    idealPartner: IdealPartner;
    financial: Financial;
    photos: Photos;
}
