import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  XCircle,
  Heart,
  Briefcase,
  GraduationCap,
  Ruler,
  Scale,
  BookOpen,
  Languages,
  Smile,
  Users2,
  MapPin,
  Sparkles,
  Handshake,
  HeartHandshake,
  Target,
  DollarSign,
  Building,
  Home as HomeIcon,
  Camera,
  Waypoints,
  Baby,
  Cake,
  Phone,
  Mail,
  LocateFixed,
  CalendarDays,
  Utensils,
  Sun,
  Dumbbell,
  Plane,
  GlassWater,
  PersonStanding,
  Palette as LifestyleIcon,
  Accessibility,
  HeartCrack,
  ChevronLeft,
  Home,
  User,
  MoreHorizontal,
  Printer,
  GitMerge,
  GitCompare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ApplicationForm } from "@/types/application-form"
import React from "react"
import { FaSmoking } from "react-icons/fa"
import { env } from "@/lib/env"
import Image from "next/image"
import { ApplicantHeader } from "./applicant-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConnectButton } from "./ConnectButton"
import { MatchBreakdownTable } from "./match-breakdown-table"

type MatchBreakdownItem = {
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

type DealBreakerPenalty = {
  key: string
  label: string
  penalty: number
}

const cmToFeetAndInches = (cm: number | string | null | undefined): string => {
  const cmValue = Number(cm)
  if (!cmValue || Number.isNaN(cmValue)) {
    return ""
  }
  const totalInches = cmValue / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  return `(${feet}'${inches}")`
}

const idealPartnerNationalityOptions = [
  { display: "Asian", value: "Asia" },
  { display: "European", value: "Europe" },
  { display: "African", value: "Africa" },
  { display: "Oceanian", value: "Oceania" },
  { display: "American", value: "Americas" },
  { display: "Polar", value: "Polar" },
  { display: "Antarctic", value: "Antarctic" },
  { display: "Antarctic Ocean", value: "Antarctic Ocean" },
  { display: "Any", value: "Any" },
]

const getNationalityDisplayValue = (value: string | undefined | null) => {
  if (!value) return null
  const option = idealPartnerNationalityOptions.find(
    (opt) => opt.value === value
  )
  return option ? option.display : value
}

const getMatchScoreClass = (score: number) => {
  if (score > 80) {
    return "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
  }
  if (score >= 50) {
    return "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300"
  }
  return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
}

function DetailRow({
  icon,
  label,
  value,
  isMatch,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  isMatch?: boolean
}) {
  if (!value && value !== 0) return null
  const displayValue = Array.isArray(value) ? value.join(", ") : value

  return (
    <div className="flex items-start justify-between py-2 text-sm">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-right">
        <span className="text-muted-foreground">{displayValue}</span>
        {isMatch !== undefined && (
          <div className="w-5">
            {isMatch ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileSection({
  title,
  icon,
  gender,
  children,
}: {
  title: string
  icon: React.ReactNode
  gender?: "Male" | "Female"
  children: React.ReactNode
}) {
  const isMale = gender === "Male" || title.includes("(Male)")
  const isFemale = gender === "Female" || title.includes("(Female)")

  return (
    <Card className="flex h-full flex-col overflow-hidden border">
      <CardHeader className="flex flex-row items-center gap-3 border-b bg-muted/10 pb-3">
        <div
          className={
            isMale
              ? "text-[#D3A753]"
              : isFemale
                ? "text-pink-500"
                : "text-primary"
          }
        >
          {icon}
        </div>
        <CardTitle
          className={cn(
            "text-base font-bold tracking-tight",
            isMale
              ? "text-[#b48735] dark:text-[#E5BE6C]"
              : isFemale
                ? "text-pink-600 dark:text-pink-400"
                : "text-foreground"
          )}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between divide-y p-5">
        <div className="flex w-full flex-1 flex-col justify-between divide-y">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

type MatchComparisonPageProps = {
  params: Promise<{
    maleId: string
    femaleId: string
  }>
}

export default async function MatchComparisonPage({
  params,
}: MatchComparisonPageProps) {
  const { maleId, femaleId } = await params

  const res = await fetch(
    `${env.BASE_URL}/api/matching/${maleId}/${femaleId}`,
    {
      cache: "no-store",
    }
  )

  if (!res.ok) {
    const errorText = await res.text()
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-red-500">
        Error: Failed to fetch match details.
        <br />
        API responded with: {res.status} {res.statusText}
        {errorText && (
          <pre className="mt-4 whitespace-pre-wrap">{errorText}</pre>
        )}
      </div>
    )
  }

  const data = await res.json()

  if (data.error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Error from API: {data.error}
      </div>
    )
  }

  if (!data.male || !data.female) {
    return notFound()
  }

  const {
    male,
    female,
    pairTrackings = [],
    matchPercentage,
    matchBreakdown = [],
    dealBreakerPenalties = [],
  } = data

  const activePairTracking = pairTrackings.find(
    (t: any) => t.status !== "CLOSED"
  )
  const latestPairTracking = pairTrackings[0]

  const femaleMatchByKey = Object.fromEntries(
    matchBreakdown.map((item: MatchBreakdownItem) => [
      item.key,
      item.malePrefMatch,
    ])
  )

  const maleMatchByKey = Object.fromEntries(
    matchBreakdown.map((item: MatchBreakdownItem) => [
      item.key,
      item.femalePrefMatch,
    ])
  )

  const getMaleMatch = (key: string) => maleMatchByKey[key] ?? false
  const getFemaleMatch = (key: string) => femaleMatchByKey[key] ?? false

  const maleAge = male.personalDetails?.dob
    ? new Date().getFullYear() -
      new Date(male.personalDetails.dob).getFullYear()
    : 0

  const femaleAge = female.personalDetails?.dob
    ? new Date().getFullYear() -
      new Date(female.personalDetails.dob).getFullYear()
    : 0

  return (
    <main className="space-y-6 p-4 md:p-6">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="link"
          className="p-0 text-muted-foreground hover:text-foreground"
        >
          <Link href="/dashboard/matching">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Matching
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <ConnectButton
            maleId={maleId}
            femaleId={femaleId}
            matchPercentage={matchPercentage}
            activeTrackingId={activePairTracking?.id}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                title="Print options"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open print options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a
                  href={`/print/matching?maleId=${maleId}&femaleId=${femaleId}&print=true`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print comparison
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Pair Connection History Banner */}
      {pairTrackings.length > 0 && (
        <div
          className={cn(
            "flex flex-col items-start justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center",
            activePairTracking
              ? "border-blue-500/30 bg-blue-500/10 text-blue-900 dark:text-blue-200"
              : "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background/80 shadow-xs">
              <GitMerge className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold">
                <span>Pair Connection History:</span>
                <Badge variant="outline" className="text-xs font-semibold">
                  Matched {pairTrackings.length} time
                  {pairTrackings.length > 1 ? "s" : ""}
                </Badge>
                {activePairTracking ? (
                  <Badge className="bg-blue-600 text-xs text-white">
                    Currently Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Past Connection (Closed)
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-xs opacity-90">
                Last Status:{" "}
                <strong>
                  {latestPairTracking?.closedFromStatus ||
                    latestPairTracking?.status}
                </strong>{" "}
                • Created on{" "}
                {new Date(latestPairTracking?.createdAt).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short", year: "numeric" }
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Match Score Banner */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold">Match Comparison</h1>
            <p className="text-muted-foreground">
              Male profile compared with female profile.
            </p>
          </div>
          <div
            className={`rounded-md border px-5 py-3 text-center ${getMatchScoreClass(
              matchPercentage
            )}`}
          >
            <div className="text-3xl font-bold">{matchPercentage}%</div>
            <div className="text-sm font-medium opacity-80">Match Score</div>
          </div>
        </div>
      </div>

      {/* Tabs: Details & Matching Compare */}
      <Tabs defaultValue="details" className="w-full space-y-6">
        <TabsList className="grid h-10 w-full max-w-md grid-cols-2 p-1">
          <TabsTrigger
            value="details"
            variant="gradient"
            className="gap-2 text-sm font-medium"
          >
            <Users2 className="h-4 w-4" />
            <span>Details</span>
          </TabsTrigger>
          <TabsTrigger
            value="compare"
            variant="gradient"
            className="gap-2 text-sm font-medium"
          >
            <GitCompare className="h-4 w-4" />
            <span>Matching Compare</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          {/* ROW 1: Applicant Headers */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
            <Card className="flex h-full flex-col justify-between p-6">
              <ApplicantHeader applicant={male} />
            </Card>
            <Card className="flex h-full flex-col justify-between p-6">
              <ApplicantHeader applicant={female} />
            </Card>
          </div>

          {/* ROW 2: Personal Details */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
            <ProfileSection
              title="Personal Details (Male)"
              icon={<User className="text-[#D3A753]" />}
            >
              <DetailRow
                icon={<User />}
                label="Name"
                value={`${male.personalDetails?.prefix || ""} ${male.personalDetails?.name || ""}`}
              />
              <DetailRow
                icon={<PersonStanding />}
                label="Gender"
                value={male.personalDetails?.gender}
              />
              <DetailRow
                icon={<Mail />}
                label="Email"
                value={male.personalDetails?.email}
              />
              <DetailRow
                icon={<Phone />}
                label="Phone"
                value={male.personalDetails?.phone}
              />
              <DetailRow
                icon={<LocateFixed />}
                label="Location"
                value={male.personalDetails?.currentLocation}
                isMatch={getMaleMatch("location")}
              />
              <DetailRow
                icon={<Home />}
                label="Nationality"
                value={male.personalDetails?.nationality}
                isMatch={getMaleMatch("nationality")}
              />
              <DetailRow
                icon={<Cake />}
                label="Age"
                value={maleAge > 0 ? `${maleAge} years` : "N/A"}
                isMatch={getMaleMatch("ageRange")}
              />
              <DetailRow
                icon={<Users2 />}
                label="Marital Status"
                value={male.personality?.maritalStatus}
              />
              <DetailRow
                icon={<Baby />}
                label="Has Children"
                value={male.personality?.hasChildren}
              />
              {male.personality?.hasChildren === "Yes" && (
                <DetailRow
                  icon={<Users2 />}
                  label="Children Count"
                  value={male.personality?.childrenCount}
                />
              )}
            </ProfileSection>

            <ProfileSection
              title="Personal Details (Female)"
              icon={<User className="text-pink-500" />}
            >
              <DetailRow
                icon={<User />}
                label="Name"
                value={`${female.personalDetails?.prefix || ""} ${female.personalDetails?.name || ""}`}
              />
              <DetailRow
                icon={<PersonStanding />}
                label="Gender"
                value={female.personalDetails?.gender}
              />
              <DetailRow
                icon={<Mail />}
                label="Email"
                value={female.personalDetails?.email}
              />
              <DetailRow
                icon={<Phone />}
                label="Phone"
                value={female.personalDetails?.phone}
              />
              <DetailRow
                icon={<LocateFixed />}
                label="Location"
                value={female.personalDetails?.currentLocation}
                isMatch={getFemaleMatch("location")}
              />
              <DetailRow
                icon={<Home />}
                label="Nationality"
                value={female.personalDetails?.nationality}
                isMatch={getFemaleMatch("nationality")}
              />
              <DetailRow
                icon={<Cake />}
                label="Age"
                value={femaleAge > 0 ? `${femaleAge} years` : "N/A"}
                isMatch={getFemaleMatch("ageRange")}
              />
              <DetailRow
                icon={<Users2 />}
                label="Marital Status"
                value={female.personality?.maritalStatus}
              />
              <DetailRow
                icon={<Baby />}
                label="Has Children"
                value={female.personality?.hasChildren}
              />
              {female.personality?.hasChildren === "Yes" && (
                <DetailRow
                  icon={<Users2 />}
                  label="Children Count"
                  value={female.personality?.childrenCount}
                />
              )}
            </ProfileSection>
          </div>

          {/* ROW 3: Career & Education */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
            <ProfileSection
              title="Career & Education (Male)"
              icon={<Briefcase className="text-[#D3A753]" />}
            >
              <DetailRow
                icon={<GraduationCap />}
                label="Education"
                value={male.career?.education}
                isMatch={getMaleMatch("education")}
              />
              <DetailRow
                icon={<Briefcase />}
                label="Occupation"
                value={male.career?.occupation}
              />
              <DetailRow
                icon={<Building />}
                label="Company"
                value={male.career?.company}
              />
            </ProfileSection>

            <ProfileSection
              title="Career & Education (Female)"
              icon={<Briefcase className="text-pink-500" />}
            >
              <DetailRow
                icon={<GraduationCap />}
                label="Education"
                value={female.career?.education}
                isMatch={getFemaleMatch("education")}
              />
              <DetailRow
                icon={<Briefcase />}
                label="Occupation"
                value={female.career?.occupation}
              />
              <DetailRow
                icon={<Building />}
                label="Company"
                value={female.career?.company}
              />
            </ProfileSection>
          </div>

          {/* ROW 4: Appearance */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
            <ProfileSection
              title="Appearance (Male)"
              icon={<Sparkles className="text-[#D3A753]" />}
            >
              <DetailRow
                icon={<Ruler />}
                label="Height"
                value={
                  male.appearance?.height
                    ? `${male.appearance.height} cm ${cmToFeetAndInches(male.appearance.height)}`
                    : ""
                }
                isMatch={getMaleMatch("height")}
              />
              <DetailRow
                icon={<Scale />}
                label="Weight"
                value={
                  male.appearance?.weight ? `${male.appearance.weight} kg` : ""
                }
                isMatch={getMaleMatch("weight")}
              />
              <DetailRow
                icon={<BookOpen />}
                label="Religion"
                value={male.appearance?.religion}
              />
              <DetailRow
                icon={<Languages />}
                label="English Fluency"
                value={`${male.appearance?.englishFluency?.[0] || 0}%`}
                isMatch={getMaleMatch("languageEnglish")}
              />
              <DetailRow
                icon={<Languages />}
                label="Thai Fluency"
                value={`${male.appearance?.thaiFluency?.[0] || 0}%`}
                isMatch={getMaleMatch("languageThai")}
              />
            </ProfileSection>

            <ProfileSection
              title="Appearance (Female)"
              icon={<Sparkles className="text-pink-500" />}
            >
              <DetailRow
                icon={<Ruler />}
                label="Height"
                value={
                  female.appearance?.height
                    ? `${female.appearance.height} cm ${cmToFeetAndInches(female.appearance.height)}`
                    : ""
                }
                isMatch={getFemaleMatch("height")}
              />
              <DetailRow
                icon={<Scale />}
                label="Weight"
                value={
                  female.appearance?.weight
                    ? `${female.appearance.weight} kg`
                    : ""
                }
                isMatch={getFemaleMatch("weight")}
              />
              <DetailRow
                icon={<BookOpen />}
                label="Religion"
                value={female.appearance?.religion}
              />
              <DetailRow
                icon={<Languages />}
                label="English Fluency"
                value={`${female.appearance?.englishFluency?.[0] || 0}%`}
                isMatch={getFemaleMatch("languageEnglish")}
              />
              <DetailRow
                icon={<Languages />}
                label="Thai Fluency"
                value={`${female.appearance?.thaiFluency?.[0] || 0}%`}
                isMatch={getFemaleMatch("languageThai")}
              />
            </ProfileSection>
          </div>

          {/* ROW 5: Personality & About Me (Equalized height with flex-1 spacing) */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
            <ProfileSection
              title="Personality & Bio (Male)"
              icon={<Smile className="text-[#D3A753]" />}
            >
              <div className="space-y-1 py-2">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  <Sparkles className="h-3.5 w-3.5 text-[#D3A753]" />
                  <span>About Me</span>
                </div>
                <p className="min-h-[80px] rounded-lg border border-border/40 bg-muted/20 p-3 text-sm whitespace-pre-line text-foreground/90">
                  {male.personality?.about || "No bio provided."}
                </p>
              </div>
              <DetailRow
                icon={<Smile />}
                label="Personality Traits"
                value={male.personality?.personality?.join(", ")}
                isMatch={getMaleMatch("personality")}
              />
              <DetailRow
                icon={<Sparkles />}
                label="Best Qualities"
                value={male.personality?.bestQualities?.join(", ")}
                isMatch={getMaleMatch("qualities")}
              />
              <DetailRow
                icon={<Heart />}
                label="Looking For Qualities"
                value={male.personality?.lookingForQualities?.join(", ")}
              />
            </ProfileSection>

            <ProfileSection
              title="Personality & Bio (Female)"
              icon={<Smile className="text-pink-500" />}
            >
              <div className="space-y-1 py-2">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                  <span>About Me</span>
                </div>
                <p className="min-h-[80px] rounded-lg border border-border/40 bg-muted/20 p-3 text-sm whitespace-pre-line text-foreground/90">
                  {female.personality?.about || "No bio provided."}
                </p>
              </div>
              <DetailRow
                icon={<Smile />}
                label="Personality Traits"
                value={female.personality?.personality?.join(", ")}
                isMatch={getFemaleMatch("personality")}
              />
              <DetailRow
                icon={<Sparkles />}
                label="Best Qualities"
                value={female.personality?.bestQualities?.join(", ")}
                isMatch={getFemaleMatch("qualities")}
              />
              <DetailRow
                icon={<Heart />}
                label="Looking For Qualities"
                value={female.personality?.lookingForQualities?.join(", ")}
              />
            </ProfileSection>
          </div>

          {/* ROW 6: Lifestyle */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
            <ProfileSection
              title="Lifestyle (Male)"
              icon={<LifestyleIcon className="text-[#D3A753]" />}
            >
              <DetailRow
                icon={<Handshake />}
                label="Values"
                value={male.lifestyle?.values?.join(", ")}
              />
              <DetailRow
                icon={<FaSmoking />}
                label="Smoking"
                value={male.lifestyle?.smoking}
                isMatch={getMaleMatch("smoking")}
              />
              <DetailRow
                icon={<GlassWater />}
                label="Drinking"
                value={male.lifestyle?.drinking}
                isMatch={getMaleMatch("drinking")}
              />
              <DetailRow
                icon={<Dumbbell />}
                label="Exercise"
                value={male.lifestyle?.exercise}
              />
              <DetailRow
                icon={<Target />}
                label="Interests"
                value={male.lifestyle?.interests?.join(", ")}
                isMatch={getMaleMatch("hobbies")}
              />
              <DetailRow
                icon={<HomeIcon />}
                label="Future Children"
                value={male.lifestyle?.futureChildren}
                isMatch={getMaleMatch("children")}
              />
              <DetailRow
                icon={<Sun />}
                label="Weekend Activity"
                value={male.lifestyle?.weekendActivity}
              />
              <DetailRow
                icon={<HeartHandshake />}
                label="Family Importance"
                value={male.lifestyle?.familyImportance}
              />
              <DetailRow
                icon={<Plane />}
                label="Travel Destinations"
                value={male.lifestyle?.travelDestinations?.join(", ")}
              />
              <DetailRow
                icon={<Utensils />}
                label="Other Interest"
                value={male.lifestyle?.otherInterest}
              />
            </ProfileSection>

            <ProfileSection
              title="Lifestyle (Female)"
              icon={<LifestyleIcon className="text-pink-500" />}
            >
              <DetailRow
                icon={<Handshake />}
                label="Values"
                value={female.lifestyle?.values?.join(", ")}
              />
              <DetailRow
                icon={<FaSmoking />}
                label="Smoking"
                value={female.lifestyle?.smoking}
                isMatch={getFemaleMatch("smoking")}
              />
              <DetailRow
                icon={<GlassWater />}
                label="Drinking"
                value={female.lifestyle?.drinking}
                isMatch={getFemaleMatch("drinking")}
              />
              <DetailRow
                icon={<Dumbbell />}
                label="Exercise"
                value={female.lifestyle?.exercise}
              />
              <DetailRow
                icon={<Target />}
                label="Interests"
                value={female.lifestyle?.interests?.join(", ")}
                isMatch={getFemaleMatch("hobbies")}
              />
              <DetailRow
                icon={<HomeIcon />}
                label="Future Children"
                value={female.lifestyle?.futureChildren}
                isMatch={getFemaleMatch("children")}
              />
              <DetailRow
                icon={<Sun />}
                label="Weekend Activity"
                value={female.lifestyle?.weekendActivity}
              />
              <DetailRow
                icon={<HeartHandshake />}
                label="Family Importance"
                value={female.lifestyle?.familyImportance}
              />
              <DetailRow
                icon={<Plane />}
                label="Travel Destinations"
                value={female.lifestyle?.travelDestinations?.join(", ")}
              />
              <DetailRow
                icon={<Utensils />}
                label="Other Interest"
                value={female.lifestyle?.otherInterest}
              />
            </ProfileSection>
          </div>

          {/* ROW 7: Relationship Goals */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
            <ProfileSection
              title="Relationship Goals (Male)"
              icon={<Heart className="text-[#D3A753]" />}
            >
              <DetailRow
                icon={<Waypoints />}
                label="Relocate"
                value={male.relationshipGoals?.relocate}
                isMatch={getMaleMatch("relocation")}
              />
              <DetailRow
                icon={<Heart />}
                label="Looking For"
                value={male.relationshipGoals?.lookingFor?.join(", ")}
              />
              <DetailRow
                icon={<CalendarDays />}
                label="Settle Down"
                value={male.relationshipGoals?.settleDown}
              />
            </ProfileSection>

            <ProfileSection
              title="Relationship Goals (Female)"
              icon={<Heart className="text-pink-500" />}
            >
              <DetailRow
                icon={<Waypoints />}
                label="Relocate"
                value={female.relationshipGoals?.relocate}
                isMatch={getFemaleMatch("relocation")}
              />
              <DetailRow
                icon={<Heart />}
                label="Looking For"
                value={female.relationshipGoals?.lookingFor?.join(", ")}
              />
              <DetailRow
                icon={<CalendarDays />}
                label="Settle Down"
                value={female.relationshipGoals?.settleDown}
              />
            </ProfileSection>
          </div>

          {/* ROW 8: Ideal Partner */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
            <ProfileSection
              title="Ideal Partner (Male)"
              icon={<Accessibility className="text-[#D3A753]" />}
            >
              <DetailRow
                icon={<Ruler />}
                label="Height"
                value={male.idealPartner?.height}
                isMatch={getMaleMatch("height")}
              />
              <DetailRow
                icon={<Scale />}
                label="Weight"
                value={male.idealPartner?.weight}
                isMatch={getMaleMatch("weight")}
              />
              <DetailRow
                icon={<Cake />}
                label="Age Range"
                value={male.idealPartner?.ageRange}
                isMatch={getMaleMatch("ageRange")}
              />
              <DetailRow
                icon={<MapPin />}
                label="Location"
                value={male.idealPartner?.location}
                isMatch={getMaleMatch("location")}
              />
              <DetailRow
                icon={<GraduationCap />}
                label="Education"
                value={male.idealPartner?.education}
                isMatch={getMaleMatch("education")}
              />
              <DetailRow
                icon={<Sparkles />}
                label="Qualities"
                value={male.idealPartner?.qualities?.join(", ")}
                isMatch={getMaleMatch("qualities")}
              />
              <DetailRow
                icon={<Home />}
                label="Nationality"
                value={getNationalityDisplayValue(
                  male.idealPartner?.nationality
                )}
                isMatch={getMaleMatch("nationality")}
              />
              <DetailRow
                icon={<Smile />}
                label="Personality"
                value={male.idealPartner?.personality?.join(", ")}
                isMatch={getMaleMatch("personality")}
              />
              <DetailRow
                icon={<HeartCrack />}
                label="Deal Breakers"
                value={male.idealPartner?.dealBreakers?.join(", ")}
              />
            </ProfileSection>

            <ProfileSection
              title="Ideal Partner (Female)"
              icon={<Accessibility className="text-pink-500" />}
            >
              <DetailRow
                icon={<Ruler />}
                label="Height"
                value={female.idealPartner?.height}
                isMatch={getFemaleMatch("height")}
              />
              <DetailRow
                icon={<Scale />}
                label="Weight"
                value={female.idealPartner?.weight}
                isMatch={getFemaleMatch("weight")}
              />
              <DetailRow
                icon={<Cake />}
                label="Age Range"
                value={female.idealPartner?.ageRange}
                isMatch={getFemaleMatch("ageRange")}
              />
              <DetailRow
                icon={<MapPin />}
                label="Location"
                value={female.idealPartner?.location}
                isMatch={getFemaleMatch("location")}
              />
              <DetailRow
                icon={<GraduationCap />}
                label="Education"
                value={female.idealPartner?.education}
                isMatch={getFemaleMatch("education")}
              />
              <DetailRow
                icon={<Sparkles />}
                label="Qualities"
                value={female.idealPartner?.qualities?.join(", ")}
                isMatch={getFemaleMatch("qualities")}
              />
              <DetailRow
                icon={<Home />}
                label="Nationality"
                value={getNationalityDisplayValue(
                  female.idealPartner?.nationality
                )}
                isMatch={getFemaleMatch("nationality")}
              />
              <DetailRow
                icon={<Smile />}
                label="Personality"
                value={female.idealPartner?.personality?.join(", ")}
                isMatch={getFemaleMatch("personality")}
              />
              <DetailRow
                icon={<HeartCrack />}
                label="Deal Breakers"
                value={female.idealPartner?.dealBreakers?.join(", ")}
              />
            </ProfileSection>
          </div>

          {/* ROW 9: Financial */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
            <ProfileSection
              title="Financial (Male)"
              icon={<DollarSign className="text-[#D3A753]" />}
            >
              <DetailRow
                icon={<Building />}
                label="Owns Business"
                value={male.financial?.ownBusiness}
              />
              <DetailRow
                icon={<HomeIcon />}
                label="Owns Property"
                value={male.financial?.ownProperty}
              />
            </ProfileSection>

            <ProfileSection
              title="Financial (Female)"
              icon={<DollarSign className="text-pink-500" />}
            >
              <DetailRow
                icon={<Building />}
                label="Owns Business"
                value={female.financial?.ownBusiness}
              />
              <DetailRow
                icon={<HomeIcon />}
                label="Owns Property"
                value={female.financial?.ownProperty}
              />
            </ProfileSection>
          </div>

          {/* ROW 10: Photos */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
            <ProfileSection
              title="Photos (Male)"
              icon={<Camera className="text-[#D3A753]" />}
            >
              <div className="grid grid-cols-3 gap-3 pt-2">
                {Object.entries(male.photos || {})
                  .filter(([key]) =>
                    ["headshot", "fullLength", "casualLifestyle"].includes(key)
                  )
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border bg-secondary">
                        {value ? (
                          <Image
                            src={value as string}
                            alt={key.replace(/([A-Z])/g, " $1")}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <span className="text-center text-xs font-medium text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                    </div>
                  ))}
              </div>
            </ProfileSection>

            <ProfileSection
              title="Photos (Female)"
              icon={<Camera className="text-pink-500" />}
            >
              <div className="grid grid-cols-3 gap-3 pt-2">
                {Object.entries(female.photos || {})
                  .filter(([key]) =>
                    ["headshot", "fullLength", "casualLifestyle"].includes(key)
                  )
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border bg-secondary">
                        {value ? (
                          <Image
                            src={value as string}
                            alt={key.replace(/([A-Z])/g, " $1")}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <span className="text-center text-xs font-medium text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                    </div>
                  ))}
              </div>
            </ProfileSection>
          </div>
        </TabsContent>

        <TabsContent value="compare" className="space-y-6">
          {/* Match Breakdown Section */}
          <MatchBreakdownTable
            items={matchBreakdown}
            penalties={dealBreakerPenalties}
            matchPercentage={matchPercentage}
          />
        </TabsContent>
      </Tabs>
    </main>
  )
}
