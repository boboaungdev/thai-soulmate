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
    career,
    appearance,
    personality,
    lifestyle,
    relationshipGoals,
    idealPartner,
    financial,
    photos,
  } = user

  const age =
    personalDetails?.dob && !isNaN(new Date(personalDetails.dob).getTime())
      ? new Date().getFullYear() - new Date(personalDetails.dob).getFullYear()
      : "N/A"

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {personalDetails?.name || "User Profile"} (ID:{" "}
            {user.id.slice(0, 4).toUpperCase()})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Photos Section */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Photos</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {photos &&
                Object.entries(photos).map(([key, url]) =>
                  url ? (
                    <div key={key} className="relative aspect-square w-full">
                      <Image
                        src={url}
                        alt={key}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ) : null
                )}
            </div>
          </section>

          {/* About Section */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">About</h2>
            <p>{personality?.about || "N/A"}</p>
          </section>

          {/* Details Section */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Personal Details</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <p>
                <strong>Name:</strong> {personalDetails?.name || "N/A"}
              </p>
              <p>
                <strong>Age:</strong> {age}
              </p>
              <p>
                <strong>Gender:</strong> {personalDetails?.gender || "N/A"}
              </p>
              <p>
                <strong>Nationality:</strong> {contact?.nationality || "N/A"}
              </p>
              <p>
                <strong>Location:</strong> {contact?.currentLocation || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {contact?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {contact?.phone || "N/A"}
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Career & Education</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <p>
                <strong>Occupation:</strong> {career?.occupation || "N/A"}
              </p>
              <p>
                <strong>Company:</strong> {career?.company || "N/A"}
              </p>
              <p>
                <strong>Education:</strong> {career?.education || "N/A"}
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Appearance</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <p>
                <strong>Height:</strong>{" "}
                {appearance?.height ? `${appearance.height} cm` : "N/A"}
              </p>
              <p>
                <strong>Weight:</strong>{" "}
                {appearance?.weight ? `${appearance.weight} kg` : "N/A"}
              </p>
              <p>
                <strong>Religion:</strong> {appearance?.religion || "N/A"}
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Personality</h2>
            <p>
              <strong>Personality Traits:</strong>{" "}
              {personality?.personality?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Best Qualities:</strong>{" "}
              {personality?.bestQualities?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Qualities Looking For:</strong>{" "}
              {personality?.lookingForQualities?.join(", ") || "N/A"}
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Lifestyle</h2>
            <p>
              <strong>Lifestyle:</strong>{" "}
              {lifestyle?.lifestyle?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Smoking:</strong> {lifestyle?.smoking || "N/A"}
            </p>
            <p>
              <strong>Drinking:</strong> {lifestyle?.drinking || "N/A"}
            </p>
            <p>
              <strong>Exercise:</strong> {lifestyle?.exercise || "N/A"}
            </p>
            <p>
              <strong>Interests:</strong>{" "}
              {lifestyle?.interests?.join(", ") || "N/A"}
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Relationship Goals</h2>
            <p>
              <strong>Looking For:</strong>{" "}
              {relationshipGoals?.lookingFor?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Willing to Relocate:</strong>{" "}
              {relationshipGoals?.relocate || "N/A"}
            </p>
            <p>
              <strong>Settle Down Timeline:</strong>{" "}
              {relationshipGoals?.settleDown || "N/A"}
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Ideal Partner</h2>
            <p>
              <strong>Age Range:</strong> {idealPartner?.ageRange || "N/A"}
            </p>
            <p>
              <strong>Nationality:</strong> {idealPartner?.nationality || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {idealPartner?.location || "N/A"}
            </p>
            <p>
              <strong>Height:</strong> {idealPartner?.height || "N/A"}
            </p>
            <p>
              <strong>Education:</strong> {idealPartner?.education || "N/A"}
            </p>
            <p>
              <strong>Personality:</strong>{" "}
              {idealPartner?.personality?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Qualities:</strong>{" "}
              {idealPartner?.qualities?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Deal Breakers:</strong>{" "}
              {idealPartner?.dealBreakers?.join(", ") || "N/A"}
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              Financial Information
            </h2>
            <p>
              <strong>Income:</strong> {financial?.income || "N/A"}
            </p>
            <p>
              <strong>Owns Property:</strong> {financial?.ownProperty || "N/A"}
            </p>
            <p>
              <strong>Owns Business:</strong> {financial?.ownBusiness || "N/A"}
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
