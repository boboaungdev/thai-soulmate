"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { ApplicationForm } from "@/types/application-form"

import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  MapPin,
  Cake,
  Copy,
  Ruler,
  Weight,
  BookUser,
  Briefcase,
  GraduationCap,
  Languages,
  Church,
  Camera,
  Download,
  Mars,
  Venus,
  Home,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

const ProfileInfo = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) => (
  <div className="flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
)

const AboutSection = ({
  content,
  personalityTraits,
}: {
  content: string
  personalityTraits: string[] | undefined
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-gradient">About Me</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-muted-foreground">{content || "N/A"}</p>
      {personalityTraits && personalityTraits.length > 0 && (
        <div>
          <h3 className="font-semibold">Personality</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {personalityTraits.map((trait) => (
              <Badge key={trait} variant="secondary">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
)

const DetailsSection = ({ user }: { user: ApplicationForm }) => {
  const { personalDetails, appearance, career } = user
  const age =
    personalDetails?.dob && !isNaN(new Date(personalDetails.dob).getTime())
      ? new Date().getFullYear() - new Date(personalDetails.dob).getFullYear()
      : "N/A"

  const languageParts = []
  if (appearance?.thaiFluency?.[0] !== undefined) {
    languageParts.push(
      appearance.thaiFluency[0] === 100
        ? "Thai (Native Speaker)"
        : `Thai ${appearance.thaiFluency[0]}%`
    )
  }
  if (appearance?.englishFluency?.[0] !== undefined) {
    languageParts.push(
      appearance.englishFluency[0] === 100
        ? "English (Native Speaker)"
        : `English ${appearance.englishFluency[0]}%`
    )
  }

  const details = [
    {
      icon: <Cake className="h-5 w-5 text-muted-foreground" />,
      label: "Age",
      value: age,
    },
    {
      icon: <Ruler className="h-5 w-5 text-muted-foreground" />,
      label: "Height",
      value: appearance?.height ? `${appearance.height} cm` : "N/A",
    },
    {
      icon: <Weight className="h-5 w-5 text-muted-foreground" />,
      label: "Weight",
      value: appearance?.weight ? `${appearance.weight} kg` : "N/A",
    },
    {
      icon: <BookUser className="h-5 w-5 text-muted-foreground" />,
      label: "Nationality",
      value: personalDetails?.nationality || "N/A",
    },
    {
      icon: <Church className="h-5 w-5 text-muted-foreground" />,
      label: "Religion",
      value: appearance?.religion || "N/A",
    },
    {
      icon: <Briefcase className="h-5 w-5 text-muted-foreground" />,
      label: "Occupation",
      value: career?.occupation || "N/A",
    },
    {
      icon: <GraduationCap className="h-5 w-5 text-muted-foreground" />,
      label: "Education",
      value: career?.education || "N/A",
    },
    {
      icon: <Languages className="h-5 w-5 text-muted-foreground" />,
      label: "Languages",
      value: languageParts.join(", ") || "N/A",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gradient">Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6">
        {details.map((item) => (
          <ProfileInfo
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </CardContent>
    </Card>
  )
}

const LifestyleSection = ({ user }: { user: ApplicationForm }) => {
  const { lifestyle } = user
  const lifestyleItems = [
    { label: "Smoking", value: lifestyle?.smoking || "N/A" },
    { label: "Drinking", value: lifestyle?.drinking || "N/A" },
    { label: "Exercise", value: lifestyle?.exercise || "N/A" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gradient">Lifestyle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lifestyleItems.map((item) => (
          <div key={item.label} className="flex justify-between">
            <p className="text-muted-foreground">{item.label}</p>
            <p className="font-semibold">{item.value}</p>
          </div>
        ))}
        <Separator />
        <div>
          <h3 className="font-semibold">Interests</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {lifestyle?.interests?.map((interest) => (
              <Badge key={interest} variant="secondary">
                {interest}
              </Badge>
            )) || <p className="text-sm text-muted-foreground">N/A</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const LookingForSection = ({ user }: { user: ApplicationForm }) => {
  const { relationshipGoals, personality, idealPartner } = user
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gradient">Looking For</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Relationship Goals</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {relationshipGoals?.lookingFor?.map((goal) => (
              <Badge key={goal} variant="outline">
                {goal}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Qualities in a Partner</h3>
          <p className="text-muted-foreground">
            {personality?.lookingForQualities?.join(", ") || "N/A"}
          </p>
        </div>
        {idealPartner?.ageRange && (
          <div>
            <h3 className="font-semibold">Ideal Age Range</h3>
            <p className="text-muted-foreground">{idealPartner.ageRange}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const OverviewSection = ({ user }: { user: ApplicationForm }) => (
  <div className="space-y-6">
    <AboutSection
      content={user.personality?.about || ""}
      personalityTraits={user.personality?.personality}
    />
    <DetailsSection user={user} />
  </div>
)

function PhotoGrid({
  photos,
  onImageClick,
  onDownloadClick,
  downloading,
}: {
  photos: ApplicationForm["photos"]
  onImageClick: (url: string, key: string) => void
  onDownloadClick: (url: string, imgKey: string) => void
  downloading: string | null
}) {
  const photoEntries = [
    ["headshot", "Headshot", photos?.headshot],
    ["fullLength", "Full Length", photos?.fullLength],
    ["casualLifestyle", "Casual Lifestyle", photos?.casualLifestyle],
  ].filter(([, , value]) => Boolean(value))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="text-muted-foreground">
          <Camera />
        </div>
        <CardTitle className="text-gradient">Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          {photoEntries.map(([key, label, value]) => (
            <div key={key as string} className="flex flex-col gap-2">
              <div
                className="relative h-56 w-full cursor-pointer overflow-hidden rounded-md"
                onClick={() => onImageClick(value as string, key as string)}
              >
                <Image
                  src={value as string}
                  alt={label as string}
                  fill
                  className="rounded-md object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-center gap-10">
                <span className="text-center text-sm text-muted-foreground">
                  {label}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onDownloadClick(value as string, key as string)
                  }
                  className="text-muted-foreground"
                  disabled={!!downloading}
                >
                  {downloading === key ? (
                    <>
                      <Download className="mr-2 h-4 w-4 animate-bounce" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function UserDetailPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const router = useRouter()
  const [user, setUser] = useState<ApplicationForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewingImage, setViewingImage] = useState<{
    url: string
    key: string
  } | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      if (!id) return
      try {
        const response = await fetch(`/api/gallery/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const data = await response.json()
        setUser(data.profile)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [id])

  const handleDownload = async (url: string, imgKey: string) => {
    setDownloading(imgKey)

    try {
      const key = new URL(url).pathname.slice(1)

      const response = await fetch(
        `/api/download?key=${encodeURIComponent(key)}`
      )

      if (!response.ok) {
        throw new Error("Download failed.")
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = objectUrl
      link.download = key.split("/").pop() ?? "photo"
      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(objectUrl)

      toast.success(`${imgKey.toUpperCase()} photo downloaded successfully.`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not download photo."
      )
    } finally {
      setDownloading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl py-8">
        <Skeleton className="mb-4 h-8 w-24" />
        <Card>
          <CardContent className="flex flex-col items-center pt-4">
            <Skeleton className="mx-auto mb-4 h-24 w-24 rounded-full" />
            <Skeleton className="mt-4 h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-32" />
            <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 text-center">User not found.</div>
    )
  }

  const { personalDetails, photos } = user

  const age =
    personalDetails?.dob && !isNaN(new Date(personalDetails.dob).getTime())
      ? new Date().getFullYear() - new Date(personalDetails.dob).getFullYear()
      : "N/A"

  const mainPhoto =
    photos?.headshot || Object.values(photos || {}).find((p) => p)

  const handleCopyId = () => {
    const idToCopy = String(user.customId).padStart(4, "0")
    navigator.clipboard
      .writeText(idToCopy)
      .then(() => {
        toast.success("ID copied to clipboard!")
      })
      .catch(() => {
        toast.error("Failed to copy ID.")
      })
  }
  const photoLabels: Record<string, string> = {
    headshot: "Headshot",
    fullLength: "Full Length",
    casualLifestyle: "Casual Lifestyle",
  }

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={() => router.back()}
          className="flex items-center gap-1 p-0 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <Dialog
        open={!!viewingImage}
        onOpenChange={(open) => !open && setViewingImage(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Photo Preview</DialogTitle>
            <DialogDescription>
              {photoLabels[viewingImage?.key ?? ""] ?? viewingImage?.key}
            </DialogDescription>
          </DialogHeader>
          <div className="relative mt-4 h-[70vh] w-full">
            {viewingImage?.url && (
              <Image
                src={viewingImage.url}
                alt="Full size photo preview"
                fill
                className="object-contain"
              />
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setViewingImage(null)}>
              Close
            </Button>
            {viewingImage && (
              <Button
                variant="default"
                onClick={() =>
                  handleDownload(viewingImage.url, viewingImage.key)
                }
                className="btn-gradient"
                disabled={!!downloading}
              >
                {downloading === viewingImage.key ? (
                  <>
                    <Download className="mr-2 h-4 w-4 animate-bounce" />
                    Downloading...
                  </>
                ) : (
                  "Download"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center pt-6">
          <Avatar className="mx-auto mb-4 h-32 w-32 border-4 border-background">
            <AvatarImage src={mainPhoto} alt="Profile photo" />
            <AvatarFallback>
              {personalDetails?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-gradient text-3xl font-bold">
            {personalDetails?.nickname
              ? ` ${personalDetails.nickname}`
              : personalDetails.name}
          </h1>
          <div className="mt-2 flex items-center justify-center gap-4 text-muted-foreground">
            <div
              className="flex cursor-pointer items-center gap-1 hover:text-foreground"
              onClick={handleCopyId}
            >
              <p>ID: {String(user.customId).padStart(4, "0")}</p>
              <Copy className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1">
              {personalDetails?.gender === "Male" ? (
                <Mars className="h-5 w-5 text-blue-500" />
              ) : personalDetails?.gender === "Female" ? (
                <Venus className="h-5 w-5 text-pink-500" />
              ) : null}
              <p>{age} years old</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-5 w-5" />
              <p>{personalDetails?.currentLocation || "N/A"}</p>
            </div>
            <div className="flex items-center gap-1">
              <Home className="h-5 w-5" />
              <p>{personalDetails?.nationality || "N/A"}</p>
            </div>
          </div>

          <div className="mt-10 w-full space-y-6">
            <OverviewSection user={user} />
            <LifestyleSection user={user} />
            <LookingForSection user={user} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <PhotoGrid
          photos={photos}
          onImageClick={(url, key) => setViewingImage({ url, key })}
          onDownloadClick={handleDownload}
          downloading={downloading}
        />
      </div>
    </div>
  )
}
