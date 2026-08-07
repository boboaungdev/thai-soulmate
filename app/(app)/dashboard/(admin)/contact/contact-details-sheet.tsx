"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Contact } from "@/lib/generated/prisma/client"
import { formatDateTime } from "@/lib/date"

interface ContactDetailsSheetProps {
  item: Contact | null
  onClose: () => void
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className="break-all sm:col-span-2">{value}</span>
    </div>
  )
}

export function ContactDetailsSheet({
  item,
  onClose,
}: ContactDetailsSheetProps) {
  if (!item) {
    return null
  }

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="text-xl">Contact from: {item.name}</SheetTitle>
          <SheetDescription>
            Full details of the contact submission.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)] px-6">
          <div className="grid gap-6 py-6 pr-4">
            <DetailItem label="Name" value={item.name} />
            <DetailItem label="Email" value={item.email} />
            <DetailItem label="Subject" value={item.subject} />
            <DetailItem label="Message" value={item.message} />
            <DetailItem
              label="Submitted"
              value={formatDateTime(item.createdAt)}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
