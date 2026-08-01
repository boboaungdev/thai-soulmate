"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

// Assuming these enums and types are defined elsewhere or will be.
// For now, defined here for UI development purposes.
enum SoulmateStatus {
  INITIAL_CONNECT = "Initial Connect",
  MALE_PROFILE_SENT = "Male Profile Sent",
  FEMALE_PROFILE_SENT = "Female Profile Sent",
  PROFILES_ACCEPTED = "Profiles Accepted",
  FIRST_GOOGLE_MEET = "First Google Meet",
  SECOND_GOOGLE_MEET = "Second Google Meet",
  FOLLOW_UP = "Follow Up",
  MALE_REJECT = "Male Rejected", // Added for completeness, might need specific handling
  FEMALE_REJECT = "Female Rejected", // Added for completeness, might need specific handling
}

interface Soulmate {
  id: string;
  maleId: string;
  femaleId: string;
  status: SoulmateStatus;
}

const allSoulmateStatuses = [
  SoulmateStatus.INITIAL_CONNECT,
  SoulmateStatus.MALE_PROFILE_SENT,
  SoulmateStatus.FEMALE_PROFILE_SENT,
  SoulmateStatus.PROFILES_ACCEPTED,
  SoulmateStatus.FIRST_GOOGLE_MEET,
  SoulmateStatus.SECOND_GOOGLE_MEET,
  SoulmateStatus.FOLLOW_UP,
  // Rejected statuses might terminate the flow, so they are not part of the sequential progress
  // SoulmateStatus.MALE_REJECT,
  // SoulmateStatus.FEMALE_REJECT,
];

const dummySoulmates: Soulmate[] = [
  {
    id: "soul1",
    maleId: "male_john_doe",
    femaleId: "female_jane_smith",
    status: SoulmateStatus.MALE_PROFILE_SENT,
  },
  {
    id: "soul2",
    maleId: "male_peter_jones",
    femaleId: "female_alice_brown",
    status: SoulmateStatus.PROFILES_ACCEPTED,
  },
  {
    id: "soul3",
    maleId: "male_david_lee",
    femaleId: "female_susan_chen",
    status: SoulmateStatus.INITIAL_CONNECT,
  },
  {
    id: "soul4",
    maleId: "male_mike_wong",
    femaleId: "female_lisa_tran",
    status: SoulmateStatus.FEMALE_PROFILE_SENT,
  },
  {
    id: "soul5",
    maleId: "male_chris_green",
    femaleId: "female_olivia_white",
    status: SoulmateStatus.FOLLOW_UP,
  },
];

const SoulmateStatusLine: React.FC<{ currentStatus: SoulmateStatus }> = ({
  currentStatus,
}) => {
  const currentIndex = allSoulmateStatuses.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between gap-1 text-xs">
      {allSoulmateStatuses.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        let textColorClass = "text-gray-500";
        let separatorColorClass = "bg-gray-300";

        if (isCompleted) {
          textColorClass = "text-green-700";
          separatorColorClass = "bg-green-500";
        } else if (isCurrent) {
          textColorClass = "text-blue-700 font-semibold";
        }

        const shouldShowSeparator = index < allSoulmateStatuses.length - 1;

        return (
          <React.Fragment key={status}>
            <div className="flex flex-col items-center flex-1 min-w-0">
              {isCompleted ? (
                <CheckCircle2 className="size-4 text-green-500" title={status} />
              ) : isCurrent ? (
                <Circle className="size-4 text-blue-500 fill-blue-500" title={status} />
              ) : (
                <Circle className="size-4 text-gray-300 fill-gray-300" title={status} />
              )}
              <span
                className={cn(
                  "mt-1 text-center truncate",
                  textColorClass,
                  "max-w-[70px] whitespace-normal"
                )}
              >
                {status}
              </span>
            </div>
            {shouldShowSeparator && (
              <div
                className={cn("h-1 flex-1", separatorColorClass, "mx-1")}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default function TrackingPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Soulmate Tracking</h1>

      {dummySoulmates.map((soulmate) => (
        <Card key={soulmate.id} className="w-full">
          <CardHeader>
            <CardTitle>
              Soulmate Match: {soulmate.maleId} & {soulmate.femaleId}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Current Status:</p>
              <p className="text-lg font-medium">{soulmate.status}</p>
            </div>
            <Separator className="my-4" />
            <SoulmateStatusLine currentStatus={soulmate.status} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
