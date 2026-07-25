export interface ApplicationForm {
  id: string
  customId: number
  personalDetails: PersonalDetails
  career: Career
  appearance: Appearance
  personality: Personality
  lifestyle: Lifestyle
  relationshipGoals: RelationshipGoals
  idealPartner: IdealPartner
  financial: Financial
  photos: Photos
  createdAt: Date
  updatedAt: Date
}

export interface PersonalDetails {
  nickname?: string
  prefix: string
  name: string
  gender: string
  dob: string | Date
  email: string
  phone: string
  nationality: string
  currentLocation: string
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
  thaiFluency: number[]
  englishFluency: number[]
}

export interface Personality {
  personality: string[]
  about: string
  bestQualities: string[]
  lookingForQualities: string[]
  maritalStatus: string
  hasChildren: string
  childrenCount: number
}

export interface Lifestyle {
  lifestyle: string[]
  smoking: string
  drinking: string
  exercise: string
  interests: string[]
  otherInterest: string
  travelDestinations: string[]
  weekendActivity: string
  familyImportance: string
  futureChildren: string
  values: string[]
}

export interface RelationshipGoals {
  relocate: string
  lookingFor: string[]
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
  ownBusiness: string
  ownProperty: string
}

export interface Photos {
  recent: string
  headshot: string
  fullLength: string
  casualLifestyle: string
}
