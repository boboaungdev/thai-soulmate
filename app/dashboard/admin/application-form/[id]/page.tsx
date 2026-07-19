"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Helper component for displaying a field
function DetailField({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  const displayValue =
    value === null || value === undefined || value === "" ? "-" : value
  return (
    <div className="flex flex-col sm:flex-row sm:items-start">
      <p className="w-full font-semibold sm:w-1/4">{label}:</p>
      <div className="w-full sm:w-3/4">{displayValue}</div>
    </div>
  )
}

// Helper component for displaying a list of items as badges
function DetailList({
  label,
  items,
}: {
  label: string
  items: string[] | undefined
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start">
      <p className="w-full font-semibold sm:w-1/4">{label}:</p>
      <div className="flex w-full flex-wrap gap-2 sm:w-3/4">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <Badge key={`${item}-${index}`} variant="secondary">
              {item}
            </Badge>
          ))
        ) : (
          <Badge variant="secondary">-</Badge>
        )}
      </div>
    </div>
  )
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const loadApplication = async () => {
        try {
          const res = await fetch(`/api/application-form/${params.id}`)
          if (!res.ok) {
            throw new Error("Failed to fetch application")
          }
          const data = await res.json()
          console.log(data)

          setApplication(data.application)
        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
      loadApplication()
    }
  }, [params.id])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!application) {
    return <div className="p-6">Application not found</div>
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
    createdAt,
  } = application

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {personalDetails?.name || "Application"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Submitted on: {new Date(createdAt).toLocaleDateString()}
          </p>
          <Badge variant="outline">{personalDetails?.gender}</Badge>
        </div>
        {photos?.headshot && (
          <div className="relative h-40 w-40 flex-shrink-0">
            <Image
              src={photos.headshot}
              alt="Headshot"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Personal & Contact Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal & Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Prefix" value={personalDetails?.prefix} />
            <DetailField label="Name" value={personalDetails?.name} />
            <DetailField label="Gender" value={personalDetails?.gender} />
            <DetailField
              label="Date of Birth"
              value={
                personalDetails?.dob
                  ? new Date(personalDetails.dob).toLocaleDateString()
                  : "-"
              }
            />
            <DetailField label="Email" value={contact?.email} />
            <DetailField label="Phone" value={contact?.phone} />
            <DetailField label="Nationality" value={contact?.nationality} />
            <DetailField
              label="Current Location"
              value={contact?.currentLocation}
            />
          </CardContent>
        </Card>

        {/* Career & Financial */}
        <Card>
          <CardHeader>
            <CardTitle>Career & Financial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Occupation" value={career?.occupation} />
            <DetailField label="Company" value={career?.company} />
            <DetailField label="Education" value={career?.education} />
            <DetailField label="Annual Income" value={financial?.income} />
            <DetailField label="Owns Property" value={financial?.ownProperty} />
            <DetailField label="Owns Business" value={financial?.ownBusiness} />
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField
              label="Height"
              value={appearance?.height ? `${appearance.height} cm` : "-"}
            />
            <DetailField
              label="Weight"
              value={appearance?.weight ? `${appearance.weight} kg` : "-"}
            />
            <DetailField label="Religion" value={appearance?.religion} />
            <DetailField
              label="Thai Fluency"
              value={
                appearance?.thaiFluency ? `${appearance.thaiFluency}%` : "-"
              }
            />
            <DetailField
              label="English Fluency"
              value={
                appearance?.englishFluency
                  ? `${appearance.englishFluency}%`
                  : "-"
              }
            />
          </CardContent>
        </Card>

        {/* Personality */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personality & Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="About" value={personality?.about} />
            <DetailList
              label="Personality Traits"
              items={personality?.personality}
            />
            <DetailList
              label="Best Qualities"
              items={personality?.bestQualities}
            />
            <DetailList
              label="Looking For Qualities"
              items={personality?.lookingForQualities}
            />
            <DetailField
              label="Marital Status"
              value={personality?.maritalStatus}
            />
            <DetailField
              label="Has Children"
              value={personality?.hasChildren}
            />
            {personality?.hasChildren === "Yes" && (
              <DetailField
                label="Children Count"
                value={personality?.childrenCount}
              />
            )}
          </CardContent>
        </Card>

        {/* Lifestyle & Interests */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Lifestyle & Interests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailList label="Lifestyle" items={lifestyle?.lifestyle} />
            <DetailField label="Smoking" value={lifestyle?.smoking} />
            <DetailField label="Drinking" value={lifestyle?.drinking} />
            <DetailField label="Exercise" value={lifestyle?.exercise} />
            <DetailList label="Interests" items={lifestyle?.interests} />
            {lifestyle?.otherInterest && (
              <DetailField
                label="Other Interest"
                value={lifestyle.otherInterest}
              />
            )}
            <DetailList
              label="Travel Destinations"
              items={lifestyle?.travelDestinations}
            />
            <DetailField
              label="Weekend Activity"
              value={lifestyle?.weekendActivity}
            />
            <DetailField
              label="Family Importance"
              value={lifestyle?.familyImportance}
            />
            <DetailField
              label="Future Children"
              value={lifestyle?.futureChildren}
            />
            <DetailList label="Values" items={lifestyle?.values} />
          </CardContent>
        </Card>

        {/* Ideal Partner */}
        <Card>
          <CardHeader>
            <CardTitle>Ideal Partner Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Age Range" value={idealPartner?.ageRange} />
            <DetailField
              label="Nationality"
              value={idealPartner?.nationality}
            />
            <DetailField label="Location" value={idealPartner?.location} />
            <DetailField label="Height" value={idealPartner?.height} />
            <DetailField label="Education" value={idealPartner?.education} />
            <DetailList
              label="Personality Traits"
              items={idealPartner?.personality}
            />
            <DetailList
              label="Desired Qualities"
              items={idealPartner?.qualities}
            />
            <DetailList
              label="Deal Breakers"
              items={idealPartner?.dealBreakers}
            />
          </CardContent>
        </Card>

        {/* Relationship Goals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Relationship Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailList
              label="Looking For"
              items={relationshipGoals?.lookingFor}
            />
            <DetailField
              label="Willing to Relocate"
              value={relationshipGoals?.relocate}
            />
            <DetailField
              label="Settle Down Timeline"
              value={relationshipGoals?.settleDown}
            />
          </CardContent>
        </Card>

        {/* Photos */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {photos?.headshot && (
              <div className="relative h-64 w-full">
                <Image
                  src={photos.headshot}
                  alt="Headshot"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            {photos?.fullLength && (
              <div className="relative h-64 w-full">
                <Image
                  src={photos.fullLength}
                  alt="Full Length"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            {photos?.casualLifestyle && (
              <div className="relative h-64 w-full">
                <Image
                  src={photos.casualLifestyle}
                  alt="Casual Lifestyle"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            {photos?.recent && (
              <div className="relative h-64 w-full">
                <Image
                  src={photos.recent}
                  alt="Recent Photo"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
