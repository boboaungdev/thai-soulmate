"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Heart,
  HeartPulse,
  Star,
  XCircle,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { WelcomeBanner } from "@/components/dashboard/welcome-banner"

const membershipData = {
  plan: "Membership (3 Months)",
  status: "Active",
  nextBillingDate: "2024-10-23",
  renewalPrice: "฿49,900",
  benefits: [
    "Unlimited Matches",
    "Advanced Search Filters",
    "Priority Customer Support",
    "Monthly Progress Reports",
  ],
}

const matchingProgressData = [
  {
    stage: "Application Review",
    status: "Completed",
    date: "2026-07-15 at 10:00 AM",
  },
  {
    stage: "Payment Confirmation",
    status: "Completed",
    date: "2026-07-20 at 11:30 AM",
  },
  {
    stage: "First Match Sent",
    status: "Completed",
    date: "2026-07-22 at 2:00 PM",
  },
  {
    stage: "Partner Confirmation",
    status: "Completed",
    date: "2026-07-25 at 3:00 PM",
  },
  {
    stage: "First Google Meet",
    status: "Completed",
    date: "2026-07-27 at 2:00 PM",
  },
  { stage: "Feedback Received", status: "Pending", date: null },
  { stage: "Second Google Meet", status: "Locked", date: null },
]

const soulmateData = {
  name: "Amara",
  age: 28,
  occupation: "Graphic Designer",
  location: "Bangkok, Thailand",
  matchDate: "2024-08-01",
  compatibilityScore: 92,
  interests: ["Art", "Traveling", "Yoga", "Cooking"],
  avatarUrl: "https://randomuser.me/api/portraits/women/75.jpg",
}

const StatusIcon = ({
  status,
}: {
  status: "Completed" | "Pending" | "Locked"
}) => {
  switch (status) {
    case "Completed":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case "Pending":
      return <Clock className="h-5 w-5 text-orange-500" />
    case "Locked":
      return <XCircle className="h-5 w-5 text-gray-400" />
  }
}

const UserDashboardPage = () => {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-6 lg:p-6">
      {/* ── Title Section ── */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Member Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s a snapshot of your journey to finding your soulmate.
          </p>
        </div>
      </div>

      {/* ── Personalized Welcome Card with Live Time & Greeting ── */}
      <WelcomeBanner />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Membership Details */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Membership</CardTitle>
            <CreditCard className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold">{membershipData.plan}</span>
                <Badge
                  className={cn(
                    "flex items-center gap-1",
                    membershipData.status === "Active" &&
                      "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                  )}
                  variant={
                    membershipData.status === "Active"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {membershipData.status === "Active" && (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                  {membershipData.status}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">
                  Next Billing Date
                </p>
                <p className="font-semibold">
                  {membershipData.nextBillingDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Renewal Price</p>
                <p className="font-semibold">{membershipData.renewalPrice}</p>
              </div>
              <Separator />
              <h3 className="font-semibold">Plan Benefits:</h3>
              <ul className="list-disc space-y-2 pl-5">
                {membershipData.benefits.map((benefit) => (
                  <li key={benefit} className="text-sm">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Current Soulmate Match */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-pink-500" />
              <CardTitle>Your Current Match: {soulmateData.name}</CardTitle>
            </div>
            <Button size="sm" variant="outline">
              View Profile
            </Button>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center text-center">
              <Image
                src={soulmateData.avatarUrl}
                alt={soulmateData.name}
                width={128}
                height={128}
                className="rounded-full"
              />
              <h3 className="mt-4 text-xl font-bold">{soulmateData.name}</h3>
              <p className="text-muted-foreground">
                {soulmateData.age}, {soulmateData.occupation}
              </p>
              <p className="text-sm text-muted-foreground">
                {soulmateData.location}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold">
                  {soulmateData.compatibilityScore}% Compatibility
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Shared Interests</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {soulmateData.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
          </CardContent>
        </Card>

        {/* Matching Progress */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-teal-500" />
              <CardTitle>Your Matching Journey</CardTitle>
            </div>
            <CardDescription>
              Follow your progress step-by-step.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-6">
              <div className="absolute top-0 left-3 h-full w-0.5 bg-gray-200" />
              {matchingProgressData.map((item, index) => (
                <div key={index} className="relative flex items-start pl-10">
                  <div className="absolute top-0 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                    <StatusIcon
                      status={item.status as "Completed" | "Pending" | "Locked"}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.stage}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.status} {item.date && `- ${item.date}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default UserDashboardPage
