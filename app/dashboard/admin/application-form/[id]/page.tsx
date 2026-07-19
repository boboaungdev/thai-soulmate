"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Helper component for displaying a field
function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null
  return (
    <div className="flex flex-col sm:flex-row sm:items-start">
      <p className="w-full font-semibold sm:w-1/4">{label}:</p>
      <div className="w-full sm:w-3/4">{value}</div>
    </div>
  )
}

// Helper component for displaying a list of items as badges
function DetailList({ label, items }: { label: string; items: string[] | undefined }) {
  if (!items || items.length === 0) return null
  return (
    <div className="flex flex-col sm:flex-row sm:items-start">
      <p className="w-full font-semibold sm:w-1/4">{label}:</p>
      <div className="flex w-full flex-wrap gap-2 sm:w-3/4">
        {items.map((item, index) => (
          <Badge key={`${item}-${index}`} variant="secondary">
            {item}
          </Badge>
        ))}
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
      <header>
        <h1 className="text-2xl font-bold">
          {personalDetails?.name || "Application"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Submitted on: {new Date(createdAt).toLocaleDateString()}
        </p>
        <Badge variant="outline">{personalDetails?.gender}</Badge>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {photos?.headshot && <Image src={photos.headshot} width={150} height={150} alt="Headshot" className="rounded-lg object-cover" />}
            {photos?.fullLength && <Image src={photos.fullLength} width={150} height={150} alt="Full Length" className="rounded-lg object-cover" />}
            {photos?.casualLifestyle && <Image src={photos.casualLifestyle} width={150} height={150} alt="Casual Lifestyle" className="rounded-lg object-cover" />}
            {photos?.recent && <Image src={photos.recent} width={150} height={150} alt="Recent Photo" className="rounded-lg object-cover" />}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Prefix" value={personalDetails?.prefix} />
            <DetailField label="Full Name" value={personalDetails?.name} />
            <DetailField label="Nickname" value={personalDetails?.nickname} />
            <DetailField label="Date of Birth" value={personalDetails?.dob ? new Date(personalDetails.dob).toLocaleDateString() : "-"} />
            <DetailField label="Nationality" value={personalDetails?.nationality} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Email" value={contact?.email} />
            <DetailField label="Phone" value={contact?.phone} />
            <DetailField label="Current Location" value={contact?.currentLocation} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Career & Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Occupation" value={career?.occupation} />
            <DetailField label="Company / Industry" value={career?.company} />
            <DetailField label="Education" value={career?.education} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Physical Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Height" value={appearance?.height} />
            <DetailField label="Weight" value={appearance?.weight} />
            <DetailField label="Religion" value={appearance?.religion} />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Personality & About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="About" value={personality?.about} />
            <DetailList label="Personality Traits" items={personality?.personality} />
            <DetailList label="Best Qualities" items={personality?.bestQualities} />
            <DetailList label="Looking for in Partner" items={personality?.lookingForQualities} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Lifestyle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Smoking" value={lifestyle?.smoking} />
            <DetailField label="Drinking" value={lifestyle?.drinking} />
            <DetailField label="Exercise" value={lifestyle?.exercise} />
            <DetailList label="Lifestyle" items={lifestyle?.lifestyle} />
            <DetailList label="Interests" items={lifestyle?.interests} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Income" value={financial?.income} />
            <DetailField label="Owns Property" value={financial?.ownProperty} />
            <DetailField label="Owns Business" value={financial?.ownBusiness} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Relationship Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Looking For" value={relationshipGoals?.lookingFor?.join(", ")} />
            <DetailField label="Willing to Relocate" value={relationshipGoals?.relocate} />
            <DetailField label="Settle Down Timeline" value={relationshipGoals?.settleDown} />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Ideal Partner Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label="Age Range" value={idealPartner?.ageRange} />
            <DetailField label="Nationality" value={idealPartner?.nationality} />
            <DetailField label="Location" value={idealPartner?.location} />
            <DetailField label="Height" value={idealPartner?.height} />
            <DetailField label="Education" value={idealPartner?.education} />
            <DetailList label="Personality Traits" items={idealPartner?.personality} />
            <DetailList label="Desired Qualities" items={idealPartner?.qualities} />
            <DetailList label="Deal Breakers" items={idealPartner?.dealBreakers} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
