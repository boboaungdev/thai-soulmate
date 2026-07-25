import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  XCircle,
  Heart,
  Briefcase,
  GraduationCap,
  Ruler,
  Scale,
  BookOpen,
  Languages,
  Smile,
  Users,
  Home,
  MapPin,
  Sparkles,
  Palette,
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
  Flag,
  CalendarDays,
  Utensils,
  Sun,
  Dumbbell,
  Plane,
  GlassWater,
  ShieldQuestion,
  PersonStanding,
  Palette as LifestyleIcon,
  Accessibility,
  HeartCrack,
} from "lucide-react"
import { ApplicationForm } from "@/types/application-form"
import React from "react"
import { FaSmoking } from "react-icons/fa"
import { BASE_URL } from "@/constants"

const calculateAge = (dob: string | Date) => {
  if (!dob) return 0
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
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
              <CheckCircle className="h-5 w-5 text-green-500" />
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
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">{children}</CardContent>
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
  comparison?: { idealPartner: ApplicationForm["idealPartner"]; female: ApplicationForm }
}) {
  const age = calculateAge(applicant.personalDetails?.dob)

  const checkMatch = (checker: () => boolean) => {
    if (!comparison) return undefined
    try {
      return checker()
    } catch (e) {
      console.error("Error in checkMatch:", e)
      return false
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Avatar className="h-32 w-32 border-4 border-primary/20">
            <AvatarImage src={applicant.photos?.headshot} />
            <AvatarFallback>
              {applicant.personalDetails?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">
              {applicant.personalDetails?.name}{" "}
              {applicant.personalDetails?.nickname &&
                `(${applicant.personalDetails?.nickname})`}
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Cake className="h-4 w-4" />
              <span>{age} years old</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{applicant.personalDetails?.currentLocation}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flag className="h-4 w-4" />
              <span>From {applicant.personalDetails?.nationality}</span>
            </div>
          </div>
        </div>
      </Card>

      <ProfileSection title="Personal Details" icon={<PersonStanding />}>
        <DetailRow
          icon={<PersonStanding />}
          label="Gender"
          value={applicant.personalDetails?.gender}
        />
        <DetailRow
          icon={<PersonStanding />}
          label="Prefix"
          value={applicant.personalDetails?.prefix}
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
          isMatch={checkMatch(
            () =>
              comparison!.idealPartner?.location ===
              comparison!.female.personalDetails?.currentLocation
          )}
        />
        <DetailRow
          icon={<Flag />}
          label="Nationality"
          value={applicant.personalDetails?.nationality}
          isMatch={checkMatch(
            () =>
              comparison!.idealPartner?.nationality ===
              comparison!.female.personalDetails?.nationality
          )}
        />
        <DetailRow
          icon={<Cake />}
          label="Age"
          value={age}
          isMatch={checkMatch(() => {
            const femaleAge = calculateAge(comparison!.female.personalDetails.dob)
            const [min, max] =
              comparison!.idealPartner.ageRange?.split("-").map(Number) ?? []
            return femaleAge >= min && femaleAge <= max
          })}
        />
        <DetailRow
          icon={<Users />}
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
            icon={<Users />}
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
          isMatch={checkMatch(
            () =>
              comparison!.idealPartner?.education ===
              comparison!.female.career?.education
          )}
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
          value={`${applicant.appearance?.height} cm`}
          isMatch={checkMatch(
            () =>
              comparison!.idealPartner?.height ===
              comparison!.female.appearance?.height
          )}
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
        />
        <DetailRow
          icon={<Languages />}
          label="Thai Fluency"
          value={`${applicant.appearance?.thaiFluency?.[0] || 0}%`}
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
          isMatch={checkMatch(() =>
            comparison!.idealPartner?.personality?.some((p: string) =>
              applicant.personality?.personality?.includes(p)
            )
          )}
        />
        <DetailRow
          icon={<Sparkles />}
          label="Best Qualities"
          value={applicant.personality?.bestQualities?.join(", ")}
          isMatch={checkMatch(() =>
            comparison!.idealPartner?.qualities?.some((q: string) =>
              applicant.personality?.bestQualities?.includes(q)
            )
          )}
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
        />
        <DetailRow
          icon={<GlassWater />}
          label="Drinking"
          value={applicant.lifestyle?.drinking}
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
        />
        <DetailRow
          icon={<HomeIcon />}
          label="Future Children"
          value={applicant.lifestyle?.futureChildren}
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
          isMatch={checkMatch(
            () =>
              applicant.idealPartner?.height ===
              comparison!.female.appearance?.height
          )}
        />
        <DetailRow
          icon={<Cake />}
          label="Age Range"
          value={applicant.idealPartner?.ageRange}
          isMatch={checkMatch(() => {
            const femaleAge = calculateAge(comparison!.female.personalDetails.dob)
            const [min, max] =
              applicant.idealPartner.ageRange?.split("-").map(Number) ?? []
            return femaleAge >= min && femaleAge <= max
          })}
        />
        <DetailRow
          icon={<MapPin />}
          label="Location"
          value={applicant.idealPartner?.location}
          isMatch={checkMatch(
            () =>
              applicant.idealPartner?.location ===
              comparison!.female.personalDetails?.currentLocation
          )}
        />
        <DetailRow
          icon={<GraduationCap />}
          label="Education"
          value={applicant.idealPartner?.education}
          isMatch={checkMatch(
            () =>
              applicant.idealPartner?.education ===
              comparison!.female.career?.education
          )}
        />
        <DetailRow
          icon={<Sparkles />}
          label="Qualities"
          value={applicant.idealPartner?.qualities?.join(", ")}
          isMatch={checkMatch(() =>
            applicant.idealPartner?.qualities?.some((q: string) =>
              comparison!.female.personality?.bestQualities?.includes(q)
            )
          )}
        />
        <DetailRow
          icon={<Flag />}
          label="Nationality"
          value={applicant.idealPartner?.nationality}
          isMatch={checkMatch(
            () =>
              applicant.idealPartner?.nationality ===
              comparison!.female.personalDetails?.nationality
          )}
        />
        <DetailRow
          icon={<Smile />}
          label="Personality"
          value={applicant.idealPartner?.personality?.join(", ")}
          isMatch={checkMatch(() =>
            applicant.idealPartner?.personality?.some((p: string) =>
              comparison!.female.personality?.personality?.includes(p)
            )
          )}
        />
        <DetailRow
          icon={<HeartCrack />}
          label="Deal Breakers"
          value={applicant.idealPartner?.dealBreakers?.join(", ")}
        />
      </ProfileSection>

      <ProfileSection title="Financial" icon={<DollarSign />}>
        <DetailRow
          icon={<DollarSign />}
          label="Income"
          value={applicant.financial?.income}
        />
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
        <div className="grid grid-cols-2 gap-4 pt-4">
          {Object.entries(applicant.photos || {})
            .filter(([key]) =>
              ["headshot", "fullLength", "recent", "casualLifestyle"].includes(
                key
              )
            )
            .map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <Avatar className="h-40 w-full rounded-md sm:h-56 md:h-64">
                  <AvatarImage
                    src={value as string}
                    className="rounded-md object-cover"
                  />
                  <AvatarFallback className="rounded-md">Img</AvatarFallback>
                </Avatar>
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

export default async function MatchComparisonPage({
  params,
}: MatchComparisonPageProps) {
  const { maleId, femaleId } = await params

  // Ensure process.env.NEXT_PUBLIC_BASE_URL is defined in your environment variables
  // For development, you might set it to http://localhost:3000 or your dev URL
  // For production, it should be your deployed frontend URL
  const baseUrl = BASE_URL 

  const res = await fetch(
    `${baseUrl}/api/matching/${maleId}/${femaleId}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    const errorText = await res.text()
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-red-500">
        Error: Failed to fetch match details.
        <br />
        API responded with: {res.status} {res.statusText}
        {errorText && <pre className="mt-4 whitespace-pre-wrap">{errorText}</pre>}
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

  const { male, female, matchPercentage } = data

  return (
    <main className="p-4 md:p-6">
      <div className="mb-6 rounded-lg bg-card p-4 shadow">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold">Match Comparison</h1>
            <p className="text-muted-foreground">
              {male.personalDetails.name} &amp; {female.personalDetails.name}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            {/* Added a basic radial progress indicator. You might need to import or define `radial-progress` style from your CSS framework (e.g., DaisyUI if used, or custom). */}
            <div
              className="radial-progress text-primary"
              style={
                {
                  "--value": matchPercentage,
                  "--size": "6rem",
                  "--thickness": "8px",
                } as React.CSSProperties
              }
            >
              <span className="text-xl font-bold">{matchPercentage}%</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Match Score
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        {/* Male Column */}
        <ApplicantColumn applicant={male} />

        {/* Female Column */}
        <ApplicantColumn
          applicant={female}
          comparison={{
            idealPartner: male.idealPartner,
            female: female,
          }}
        />
      </div>
    </main>
  )
}
