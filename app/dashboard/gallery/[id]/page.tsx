"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { ApplicationForm } from "@/types/application-form-types"

export default function UserDetailPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const [user, setUser] = useState<ApplicationForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      if (!id) return
      try {
        const response = await fetch(`/api/gallery/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const data = await response.json()
        setUser(data.application)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
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

  const {
    personalDetails,
    contact,
    appearance,
    personality,
    lifestyle,
    relationshipGoals,
    idealPartner,
    photos,
  } = user

  const age =
    personalDetails?.dob && !isNaN(new Date(personalDetails.dob).getTime())
      ? new Date().getFullYear() - new Date(personalDetails.dob).getFullYear()
      : "N/A"

  const mainPhoto =
    photos?.headshot || Object.values(photos || {}).find((p) => p)
  const galleryPhotos = Object.entries(photos || {}).filter(
    ([key, url]) => url && url !== mainPhoto
  )

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        {mainPhoto && (
          <div className="relative h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={mainPhoto}
              alt="Main profile photo"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {personalDetails?.name || "User"}, {age}
          </h1>
          <p className="text-muted-foreground">
            🇹🇭 {contact?.currentLocation || "N/A"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {personality?.about || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Nickname</p>
              <p className="text-muted-foreground">
                {personalDetails?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Age</p>
              <p className="text-muted-foreground">{age}</p>
            </div>
            <div>
              <p className="font-semibold">Gender</p>
              <p className="text-muted-foreground">
                {personalDetails?.gender || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Height</p>
              <p className="text-muted-foreground">
                {appearance?.height ? `${appearance.height} cm` : "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Weight</p>
              <p className="text-muted-foreground">
                {appearance?.weight ? `${appearance.weight} kg` : "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Nationality</p>
              <p className="text-muted-foreground">
                {contact?.nationality || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Religion</p>
              <p className="text-muted-foreground">
                {appearance?.religion || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lifestyle?.interests?.map((interest) => (
                <div
                  key={interest}
                  className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground"
                >
                  {interest}
                </div>
              )) || <p className="text-muted-foreground">N/A</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lifestyle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Smoking:</strong> {lifestyle?.smoking || "N/A"}
            </p>
            <p>
              <strong>Drinking:</strong> {lifestyle?.drinking || "N/A"}
            </p>
            <p>
              <strong>Exercise:</strong> {lifestyle?.exercise || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Looking For</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              {relationshipGoals?.lookingFor?.map((item, index) => (
                <li key={`lookingFor-${item}-${index}`}>{item}</li>
              ))}
              {personality?.lookingForQualities?.map((item, index) => (
                <li key={`qualities-${item}-${index}`}>{item}</li>
              ))}
              {idealPartner?.ageRange && <li>Age {idealPartner.ageRange}</li>}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {galleryPhotos.length > 0 ? (
              galleryPhotos.map(([key, url]) => (
                <div key={key} className="relative aspect-square w-full">
                  <Image
                    src={url as string}
                    alt={`Gallery photo ${key}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No additional photos.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
