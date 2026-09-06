export interface ApplicationFormData {
  // Chapter 1: Identity & Background
  prefix: string // "Mr.", "Ms.", "Mrs.", "Dr."
  name: string
  firstName: string
  lastName: string
  nickname: string // Thai ladies
  gender: string // "Male" | "Female"
  dob: string // "YYYY-MM-DD"
  email: string
  phoneCountry: string // e.g. "+66"
  phone: string // digits
  nationality: string
  nationalityRegion: string
  currentLocation: string
  currentLocationRegion: string
  religion: string
  maritalStatus: string // "Never Married", "Divorced", "Widowed"

  // Chapter 2: Career, Education & Lifestyle
  education: string
  occupation: string
  company: string
  ownBusiness: boolean
  ownProperty: boolean
  englishFluency: number // 0-100
  thaiFluency: number // 0-100
  smoking: string // "Never", "Occasionally", "Regularly"
  drinking: string // "Never", "Socially", "Regularly"
  exercise: string // "Daily", "Weekly", "Occasionally", "Never"
  lifestyle: string // "Relaxed", "Active", "Family-Focused", "Career-Focused", "Luxury-Oriented", "Adventurous"

  // Chapter 3: Personality, Values & Family
  hasChildren: string // "Yes" | "No"
  childrenCount: number
  futureChildren: string // "Yes", "No", "Maybe"
  familyImportance: string // "Very Important", "Important", "Somewhat Important"
  personality: string[] // e.g. ["Kind", "Loyal", "Ambitious", "Romantic"]
  values: string[] // e.g. ["Honesty", "Family", "Trust", "Loyalty"]
  interests: string[] // e.g. ["Travel", "Golf", "Fine Dining", "Cooking"]
  about: string // Bio / paragraph
  bestQualities: string[]
  lookingForQualities: string[]

  // Chapter 4: Your Ideal Life Partner
  relationshipGoal: string // "Marriage / Life Partner", "Long-Term Relationship", "Companionship", "I'm Not Sure Yet"
  relocate: string // "Yes", "No", "Maybe"
  settleDown: string // "Within 1 Year", "1–3 Years", "No Specific Timeline"
  idealPartnerMinAge: number
  idealPartnerMaxAge: number
  idealPartnerMinHeight: number
  idealPartnerMaxHeight: number
  idealPartnerLocation: string
  idealPartnerNationality: string
  dealBreakers: string[]

  // Chapter 5: Photos & Final Agreement
  headshotUrl: string | null
  fullLengthUrl: string | null
  casualLifestyleUrl: string | null
  agreedToTruth: boolean
  agreedToPrivacy: boolean
}

export const INITIAL_APPLICATION_FORM_DATA: ApplicationFormData = {
  prefix: "Mr.",
  name: "",
  firstName: "",
  lastName: "",
  nickname: "",
  gender: "Male",
  dob: "",
  email: "",
  phoneCountry: "+66",
  phone: "",
  nationality: "Thailand",
  nationalityRegion: "Asia",
  currentLocation: "Thailand",
  currentLocationRegion: "Asia",
  religion: "Buddhism",
  maritalStatus: "Never Married",

  education: "Bachelor's Degree",
  occupation: "",
  company: "",
  ownBusiness: false,
  ownProperty: false,
  englishFluency: 70,
  thaiFluency: 50,
  smoking: "Never",
  drinking: "Socially",
  exercise: "Weekly",
  lifestyle: "Family-Focused",

  hasChildren: "No",
  childrenCount: 0,
  futureChildren: "Maybe",
  familyImportance: "Very Important",
  personality: ["Kind", "Family-Oriented"],
  values: ["Honesty", "Loyalty", "Trust"],
  interests: ["Travel", "Cooking"],
  about: "",
  bestQualities: ["Kind", "Honest"],
  lookingForQualities: ["Loyal", "Kind"],

  relationshipGoal: "Marriage / Life Partner",
  relocate: "Open to discussion",
  settleDown: "1–3 Years",
  idealPartnerMinAge: 25,
  idealPartnerMaxAge: 40,
  idealPartnerMinHeight: 155,
  idealPartnerMaxHeight: 175,
  idealPartnerLocation: "Thailand",
  idealPartnerNationality: "Thai",
  dealBreakers: [],

  headshotUrl: null,
  fullLengthUrl: null,
  casualLifestyleUrl: null,
  agreedToTruth: false,
  agreedToPrivacy: false,
}

export type ApplicationStage = "gatekeeper" | "form" | "review" | "thank-you"

export interface RegisterInterestLead {
  id: string
  prefix: string
  name: string
  gender: string
  email: string
  phoneCountry: string
  phone: string
  currentLocation: string
  relationshipGoal?: string | null
  preferredContactDate?: string | null
  preferredContactTime?: string | null
}

export type Country = {
  name: string
  nationality: string
  flag: string
  code: string
  callCode: string
  region: string
}

/**
 * Converts height in cm to feet and inches notation (e.g. 175 -> 5'9", 205 with isPlus -> 6'9"+)
 */
export function cmToFeetAndInches(cm: number, isPlus: boolean = false): string {
  const totalInches = Math.round(cm / 2.54)
  const feet = Math.floor(totalInches / 12)
  const inches = totalInches % 12
  return `${feet}'${inches}"${isPlus ? "+" : ""}`
}

/**
 * Formats preferred partner age range with open upper bound (e.g. "25 – 70+ Years")
 */
export function formatPartnerAgeRange(min: number, max: number): string {
  const maxLabel = max >= 70 ? "70+" : `${max}`
  return `${min} – ${maxLabel} Years`
}

/**
 * Formats preferred partner height range with both cm and feet/inches
 * (e.g. "155 – 205+ cm (5'1" – 6'9"+)")
 */
export function formatPartnerHeightRange(min: number, max: number): string {
  const isMaxPlus = max >= 205
  const maxLabel = isMaxPlus ? "205+" : `${max}`
  const minFt = cmToFeetAndInches(min)
  const maxFt = cmToFeetAndInches(max, isMaxPlus)
  return `${min} – ${maxLabel} cm (${minFt} – ${maxFt})`
}
