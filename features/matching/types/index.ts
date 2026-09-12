import { TrackingStatus, TrackingNoteType } from "@/lib/generated/prisma/enums"

export type MatchCriterion =
  | "Ideal Partner Age Range"
  | "Ideal Partner Height"
  | "Ideal Partner Weight"
  | "Ideal Partner Nationality"
  | "Ideal Partner Location"
  | "Ideal Partner Education"
  | "Ideal Partner Qualities"
  | "Ideal Partner Personality"
  | "Deal Breakers"
  | "Relocation Preference"
  | "Smoking Preference"
  | "Drinking Preference"
  | "Children Preference"
  | "Hobbies"
  | "Languages Spoken %"

export type MatchCriteriaMap = Record<string, boolean>

export interface MatchResult {
  score: number
  applicant: any
}

export interface MatchBreakdownItem {
  key: string
  category: string
  label: string
  malePreference: string
  femaleValue: string
  malePrefMatch: boolean
  femalePreference: string
  maleValue: string
  femalePrefMatch: boolean
  weight: number
  malePoints: number
  femalePoints: number
  malePossiblePoints: number
  femalePossiblePoints: number
}

export interface DealBreakerPenalty {
  key: string
  label: string
  matched: boolean
  penalty: number
}

export interface MatchComparisonResult {
  male: any
  female: any
  pairTrackings: any[]
  matchPercentage: number
  matchBreakdown: MatchBreakdownItem[]
  dealBreakerPenalties: DealBreakerPenalty[]
}

export interface GetMatchesOptions {
  userId?: string | null
  criteria?: string | null
  filter?: string
  matchRange?: string
  sortKey?: string
  sortOrder?: string
}

export interface GetTrackingsOptions {
  search?: string
  memberId?: string
  status?: string
  sortKey?: string
  sortOrder?: "asc" | "desc"
  page?: number
  pageSize?: number
}

export interface TrackingMemberInfo {
  id: string
  name: string
  prefix?: string
  customId: number
  gender: "Male" | "Female"
  headshot?: string
}

export interface GetTrackingsResponse {
  success: boolean
  trackings: any[]
  totalCount: number
  filteredCount: number
  page: number
  pageSize: number
  totalPages: number
  allMembers: TrackingMemberInfo[]
  message?: string
}

export interface CreateTrackingInput {
  maleId: string
  femaleId: string
  matchPercentage: number
}

export interface UpdateTrackingInput {
  status?: TrackingStatus
  note?: string
  googleMeetLink?: string
  googleMeetTime?: Date | string
  sendEmail?: boolean
  changedBy?: string
  interviewSchedule1?: Date | string
  interviewSchedule2?: Date | string
  feedbackInterview1?: string
  feedbackInterview2?: string
}

export interface CreateTrackingNoteInput {
  message: string
  userId: string
  type?: TrackingNoteType
}

export interface UpdateTrackingNoteInput {
  message?: string
  type?: TrackingNoteType
}
