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
} from "lucide-react"
import { ApplicationForm } from "@/types/application-form"
import React from "react"
import { FaSmoking } from "react-icons/fa"
import { BASE_URL } from "@/constants"

import Image from "next/image" // Import next/image
import { ApplicantHeader } from "./applicant-header"
type MatchBreakdownItem = {
  key: string
  category: string
  label: string
  malePreference: string
  femaleValue: string
  matched: boolean
  weight: number
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
  if (!value && value !== 0) return null // Don't render row if value is null or undefined
  const displayValue = Array.isArray(value) ? value.join(", ") : value

  return (
    <div className="flex items-start justify-between py-2">
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
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  const hasContent = React.Children.toArray(children).some(
    (child) => child !== null
  )
  if (!hasContent) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        {icon}
        <CardTitle className="text-gradient">{title}</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">{children}</CardContent>
    </Card>
  )
}

function MatchBreakdown({
  items,
  penalties,
}: {
  items: MatchBreakdownItem[]
  penalties: DealBreakerPenalty[]
}) {
  if (!items.length) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Male Preference Match</CardTitle>
        <CardDescription>
          The male application is the main profile. Each row compares his
          preference or matching signal against the female application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.key} className="rounded-md border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    {item.category}
                  </p>
                  <h3 className="font-semibold">{item.label}</h3>
                </div>
                <Badge
                  variant={item.matched ? "outline" : "destructive"}
                  className={`flex shrink-0 items-center gap-1 ${
                    item.matched
                      ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                      : "border-red"
                  }`}
                >
                  {item.matched ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5" />
                      <span>No Match</span>
                    </>
                  )}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="break-words">
                  <p className="text-xs text-muted-foreground">
                    Male preference
                  </p>
                  <p>{item.malePreference}</p>
                </div>
                <div className="break-words">
                  <p className="text-xs text-muted-foreground">Female value</p>
                  <p className="font-medium">{item.femaleValue}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Weight: {item.weight}
              </p>
            </div>
          ))}
        </div>
        {penalties.length > 0 && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
            <h3 className="font-semibold text-destructive">
              Deal Breaker Penalties
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {penalties.map((penalty) => (
                <div
                  key={penalty.key}
                  className="flex items-center justify-between gap-3 rounded-md bg-background px-3 py-2 text-sm"
                >
                  <span>{penalty.label}</span>
                  <Badge variant="destructive">-{penalty.penalty}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Explicitly define ApplicantColumn as a server component if it doesn't need client features
// (which it shouldn't, as it just displays props)
function ApplicantColumn({
  applicant,
  comparison,
}: {
  applicant: ApplicationForm
  comparison?: {
    matchByKey: Record<string, boolean>
  }
}) {
  const getMatch = (key: string) => {
    if (!comparison) return undefined
    return comparison.matchByKey[key] ?? false
  }
  const age = applicant.personalDetails?.dob
    ? new Date().getFullYear() -
      new Date(applicant.personalDetails.dob).getFullYear()
    : 0
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <ApplicantHeader applicant={applicant} />
      </Card>

      <ProfileSection title="Personal Details" icon={<User />}>
        <DetailRow
          icon={<User />}
          label="name"
          value={`${applicant.personalDetails?.prefix} ${applicant.personalDetails?.name}`}
        />
        <DetailRow
          icon={<PersonStanding />}
          label="Gender"
          value={applicant.personalDetails?.gender}
        />
        <DetailRow
          icon={<Mail />}
          label="Email"
          value={applicant.personalDetails?.email}
        />
        <DetailRow
          icon={<Phone />}
          label="Phone"
          value={applicant.personalDetails?.phone}
        />
        <DetailRow
          icon={<LocateFixed />}
          label="Location"
          value={applicant.personalDetails?.currentLocation}
          isMatch={getMatch("location")}
        />
        <DetailRow
          icon={<Home />}
          label="Nationality"
          value={applicant.personalDetails?.nationality}
          isMatch={getMatch("nationality")}
        />
        <DetailRow
          icon={<Cake />}
          label="Age"
          value={age}
          isMatch={getMatch("ageRange")}
        />
        <DetailRow
          icon={<Users2 />}
          label="Marital Status"
          value={applicant.personality?.maritalStatus}
        />
        <DetailRow
          icon={<Baby />}
          label="Has Children"
          value={applicant.personality?.hasChildren}
        />
        {applicant.personality?.hasChildren === "Yes" && (
          <DetailRow
            icon={<Users2 />}
            label="Children Count"
            value={applicant.personality?.childrenCount}
          />
        )}
      </ProfileSection>

      <ProfileSection title="Career & Education" icon={<Briefcase />}>
        <DetailRow
          icon={<GraduationCap />}
          label="Education"
          value={applicant.career?.education}
          isMatch={getMatch("education")}
        />
        <DetailRow
          icon={<Briefcase />}
          label="Occupation"
          value={applicant.career?.occupation}
        />
        <DetailRow
          icon={<Building />}
          label="Company"
          value={applicant.career?.company}
        />
      </ProfileSection>

      <ProfileSection title="Appearance" icon={<Sparkles />}>
        <DetailRow
          icon={<Ruler />}
          label="Height"
          value={
            applicant.appearance?.height
              ? `${applicant.appearance.height} cm ${cmToFeetAndInches(applicant.appearance.height)}`
              : ""
          }
          isMatch={getMatch("height")}
        />
        <DetailRow
          icon={<Scale />}
          label="Weight"
          value={`${applicant.appearance?.weight} kg`}
        />
        <DetailRow
          icon={<BookOpen />}
          label="Religion"
          value={applicant.appearance?.religion}
        />
        <DetailRow
          icon={<Languages />}
          label="English Fluency"
          value={`${applicant.appearance?.englishFluency?.[0] || 0}%`}
          isMatch={getMatch("languages")}
        />
        <DetailRow
          icon={<Languages />}
          label="Thai Fluency"
          value={`${applicant.appearance?.thaiFluency?.[0] || 0}%`}
          isMatch={getMatch("languages")}
        />
      </ProfileSection>

      <ProfileSection title="Personality" icon={<Smile />}>
        <DetailRow
          icon={<Smile />}
          label="About Me"
          value={applicant.personality?.about}
        />
        <DetailRow
          icon={<Smile />}
          label="Personality Traits"
          value={applicant.personality?.personality?.join(", ")}
          isMatch={getMatch("personality")}
        />
        <DetailRow
          icon={<Sparkles />}
          label="Best Qualities"
          value={applicant.personality?.bestQualities?.join(", ")}
          isMatch={getMatch("qualities")}
        />
        <DetailRow
          icon={<Heart />}
          label="Looking For Qualities"
          value={applicant.personality?.lookingForQualities?.join(", ")}
        />
      </ProfileSection>

      <ProfileSection title="Lifestyle" icon={<LifestyleIcon />}>
        <DetailRow
          icon={<Handshake />}
          label="Values"
          value={applicant.lifestyle?.values?.join(", ")}
        />
        <DetailRow
          icon={<FaSmoking />}
          label="Smoking"
          value={applicant.lifestyle?.smoking}
          isMatch={getMatch("smoking")}
        />
        <DetailRow
          icon={<GlassWater />}
          label="Drinking"
          value={applicant.lifestyle?.drinking}
          isMatch={getMatch("drinking")}
        />
        <DetailRow
          icon={<Dumbbell />}
          label="Exercise"
          value={applicant.lifestyle?.exercise}
        />
        <DetailRow
          icon={<Target />}
          label="Interests"
          value={applicant.lifestyle?.interests?.join(", ")}
          isMatch={getMatch("hobbies")}
        />
        <DetailRow
          icon={<HomeIcon />}
          label="Future Children"
          value={applicant.lifestyle?.futureChildren}
          isMatch={getMatch("children")}
        />
        <DetailRow
          icon={<Sun />}
          label="Weekend Activity"
          value={applicant.lifestyle?.weekendActivity}
        />
        <DetailRow
          icon={<HeartHandshake />}
          label="Family Importance"
          value={applicant.lifestyle?.familyImportance}
        />
        <DetailRow
          icon={<Plane />}
          label="Travel Destinations"
          value={applicant.lifestyle?.travelDestinations?.join(", ")}
        />
        <DetailRow
          icon={<Utensils />}
          label="Other Interest"
          value={applicant.lifestyle?.otherInterest}
        />
      </ProfileSection>

      <ProfileSection title="Relationship Goals" icon={<Heart />}>
        <DetailRow
          icon={<Waypoints />}
          label="Relocate"
          value={applicant.relationshipGoals?.relocate}
          isMatch={getMatch("relocation")}
        />
        <DetailRow
          icon={<Heart />}
          label="Looking For"
          value={applicant.relationshipGoals?.lookingFor?.join(", ")}
        />
        <DetailRow
          icon={<CalendarDays />}
          label="Settle Down"
          value={applicant.relationshipGoals?.settleDown}
        />
      </ProfileSection>

      <ProfileSection title="Ideal Partner" icon={<Accessibility />}>
        <DetailRow
          icon={<Ruler />}
          label="Height"
          value={applicant.idealPartner?.height}
        />
        <DetailRow
          icon={<Cake />}
          label="Age Range"
          value={applicant.idealPartner?.ageRange}
        />
        <DetailRow
          icon={<MapPin />}
          label="Location"
          value={applicant.idealPartner?.location}
        />
        <DetailRow
          icon={<GraduationCap />}
          label="Education"
          value={applicant.idealPartner?.education}
        />
        <DetailRow
          icon={<Sparkles />}
          label="Qualities"
          value={applicant.idealPartner?.qualities?.join(", ")}
        />
        <DetailRow
          icon={<Home />}
          label="Nationality"
          value={applicant.idealPartner?.nationality}
        />
        <DetailRow
          icon={<Smile />}
          label="Personality"
          value={applicant.idealPartner?.personality?.join(", ")}
        />
        <DetailRow
          icon={<HeartCrack />}
          label="Deal Breakers"
          value={applicant.idealPartner?.dealBreakers?.join(", ")}
        />
      </ProfileSection>

      <ProfileSection title="Financial" icon={<DollarSign />}>
        <DetailRow
          icon={<Building />}
          label="Owns Business"
          value={applicant.financial?.ownBusiness}
        />
        <DetailRow
          icon={<HomeIcon />}
          label="Owns Property"
          value={applicant.financial?.ownProperty}
        />
      </ProfileSection>

      <ProfileSection title="Photos" icon={<Camera />}>
        <div className="grid grid-cols-3 gap-4 pt-4">
          {Object.entries(applicant.photos || {})
            .filter(([key]) =>
              ["headshot", "fullLength", "casualLifestyle"].includes(key)
            )
            .map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-md bg-secondary sm:h-56 md:h-64">
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
                <span className="text-center text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
              </div>
            ))}
        </div>
      </ProfileSection>
    </div>
  )
}

type MatchComparisonPageProps = {
  params: {
    maleId: string
    femaleId: string
  }
}

import { ConnectButton } from "./ConnectButton";

export default async function MatchComparisonPage({
  params,
}: MatchComparisonPageProps) {
  const { maleId, femaleId } = await params;

  const res = await fetch(`${BASE_URL}/api/matching/${maleId}/${femaleId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-red-500">
        Error: Failed to fetch match details.
        <br />
        API responded with: {res.status} {res.statusText}
        {errorText && (
          <pre className="mt-4 whitespace-pre-wrap">{errorText}</pre>
        )}
      </div>
    );
  }

  const data = await res.json();

  if (data.error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Error from API: {data.error}
      </div>
    );
  }

  if (!data.male || !data.female) {
    return notFound();
  }

  const {
    male,
    female,
    matchPercentage,
    matchBreakdown = [],
    dealBreakerPenalties = [],
  } = data;
  const matchByKey = Object.fromEntries(
    matchBreakdown.map((item: MatchBreakdownItem) => [item.key, item.matched])
  );

  return (
    <main className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <Button asChild variant="link" className="p-0 text-muted-foreground hover:text-foreground">
          <Link href="/dashboard/matching">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Matching
          </Link>
        </Button>

        <ConnectButton maleId={maleId} femaleId={femaleId} />
      </div>

      <div className="mb-6 rounded-lg border bg-card p-4">
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

      <div className="mb-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        {/* Male Column */}
        <ApplicantColumn applicant={male} />

        {/* Female Column */}
        <ApplicantColumn
          applicant={female}
          comparison={{
            matchByKey,
          }}
        />
      </div>

      <MatchBreakdown items={matchBreakdown} penalties={dealBreakerPenalties} />
    </main>
  )
}
