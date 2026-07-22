"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

import { RegisterInterest } from "@/lib/generated/prisma/client"

import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"

dayjs.extend(localizedFormat)

interface RegisterInterestDetailsProps {
  item: RegisterInterest | null
  onClose: () => void
}

export function RegisterInterestDetails({
  item,
  onClose,
}: RegisterInterestDetailsProps) {
  if (!item) {
    return null
  }

  const age = dayjs().diff(item.dob, "year")

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
     <SheetContent className="w-[400px] sm:w-[540px]">
  <SheetHeader className="px-6 pt-6">
    <SheetTitle className="text-xl">
      {item.prefix} {item.name}
    </SheetTitle>

    <SheetDescription>
      Full details of the registered interest.
    </SheetDescription>
  </SheetHeader>

  <ScrollArea className="h-[calc(100vh-120px)] px-6">
    <div className="grid gap-6 py-6 pr-4">
      <DetailItem
        label="Gender"
        value={item.gender}
      />

      <DetailItem
        label="Date of Birth"
        value={`${dayjs(item.dob).format("LL")} (${age} years old)`}
      />

      <DetailItem
        label="Nationality"
        value={item.nationality}
      />

      <DetailItem
        label="Current Location"
        value={item.currentLocation}
      />

      <DetailItem
        label="Email"
        value={item.email}
      />

      <DetailItem
        label="Phone"
        value={`(${item.phoneCountry}) ${item.phone}`}
      />

      <DetailItem
        label="Source"
        value={item.source}
      />

      {item.otherSource && (
        <DetailItem
          label="Other Source"
          value={item.otherSource}
        />
      )}

      <DetailItem
        label="Status"
        value={item.status}
      />

      <DetailItem
        label="Registered On"
        value={dayjs(item.createdAt).format("LLL")}
      />
    </div>
  </ScrollArea>
</SheetContent>
    </Sheet>
  )
}


function DetailItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4">
      <span className="font-semibold text-muted-foreground">
        {label}
      </span>

      <span className="break-all sm:col-span-2">
        {value}
      </span>
    </div>
  )
}