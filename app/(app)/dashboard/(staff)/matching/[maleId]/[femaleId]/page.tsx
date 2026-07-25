"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
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
  Calendar,
  Sparkles,
  Palette,
  Handshake,
  HeartHandshake,
  Target,
  DollarSign,
  Building,
  Home as HomeIcon,
  Camera,
} from "lucide-react"

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
  return (
    <div className="flex items-start justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-right">
        <span className="text-muted-foreground">{value}</span>
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

function ApplicantColumn({
  applicant,
  comparison,
}: {
  applicant: any
  comparison?: { idealPartner: any; female: any }
}) {
  const age = calculateAge(applicant.personalDetails?.dob)

  const checkMatch = (checker: () => boolean) => {
    if (!comparison) return undefined
    return checker()
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
              {applicant.personalDetails?.name}
            </h2>
            <p className="text-muted-foreground">
              {applicant.personalDetails?.nickname}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" />
              <span>{age} years old</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{applicant.personalDetails?.currentLocation}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Home className="h-4 w-4" />
              <span>From {applicant.personalDetails?.nationality}</span>
            </div>
          </div>
        </div>
      </Card>

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
          label="Personality Traits"
          value={applicant.personality?.personality?.join(", ")}
          isMatch={checkMatch(() =>
            comparison!.idealPartner?.personality?.some((p: string) =>
              comparison!.female.personality?.personality?.includes(p)
            )
          )}
        />
        <DetailRow
          icon={<Sparkles />}
          label="Best Qualities"
          value={applicant.personality?.bestQualities?.join(", ")}
          isMatch={checkMatch(() =>
            comparison!.idealPartner?.qualities?.some((q: string) =>
              comparison!.female.personality?.bestQualities?.includes(q)
            )
          )}
        />
        <DetailRow
          icon={<Heart />}
          label="Marital Status"
          value={applicant.personality?.maritalStatus}
        />
        <DetailRow
          icon={<Users />}
          label="Has Children"
          value={applicant.personality?.hasChildren}
        />
      </ProfileSection>

      <ProfileSection title="Lifestyle" icon={<Palette />}>
        <DetailRow
          icon={<Handshake />}
          label="Values"
          value={applicant.lifestyle?.values?.join(", ")}
        />
        <DetailRow
          icon={<HeartHandshake />}
          label="Family Importance"
          value={applicant.lifestyle?.familyImportance}
        />
        <DetailRow
          icon={<Target />}
          label="Interests"
          value={applicant.lifestyle?.interests?.join(", ")}
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
          {Object.entries(applicant.photos || {}).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-2">
              <Avatar className="h-40 w-full rounded-md">
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

export default function MatchComparisonPage() {
  const { maleId, femaleId } = useParams<{
    maleId: string
    femaleId: string
  }>()
  const [data, setData] = useState<{ male: any; female: any } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/matching/${maleId}/${femaleId}`)
        if (!res.ok) {
          throw new Error("Failed to fetch match details")
        }
        const result = await res.json()
        if (result.error) {
          throw new Error(result.error)
        }
        setData(result)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [maleId, femaleId])

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="mb-6 h-8 w-1/3" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Error: {error}
      </div>
    )
  }

  if (!data) {
    return notFound()
  }

  return (
    <main className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Match Comparison</h1>
        <p className="text-muted-foreground">
          Detailed comparison between{" "}
          <span className="font-semibold text-primary">
            {data.male.personalDetails.name}
          </span>{" "}
          and{" "}
          <span className="font-semibold text-pink-500">
            {data.female.personalDetails.name}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        {/* Male Column */}
        <ApplicantColumn applicant={data.male} />

        {/* Female Column */}
        <ApplicantColumn
          applicant={data.female}
          comparison={{
            idealPartner: data.male.idealPartner,
            female: data.female,
          }}
        />
      </div>
    </main>
  )
}
