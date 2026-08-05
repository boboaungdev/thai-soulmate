"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2, User, Venus, Mars } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { calculateAge } from "@/lib/date"

import { ProfileRow } from "./columns"

interface EditProfileSheetProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  profile: ProfileRow | null
}

export function EditProfileSheet({
  isOpen,
  onOpenChange,
  profile,
}: EditProfileSheetProps) {
  const initialAbout = profile?.personality?.about || ""
  const [about, setAbout] = useState(initialAbout)
  const [isSaving, setIsSaving] = useState(false)

  // Reset the form state when the sheet is opened
  useEffect(() => {
    if (isOpen) {
      setAbout(profile?.personality?.about || "")
    }
  }, [isOpen, profile])

  if (!profile) return null

  const hasChanges = about !== initialAbout

  const { personalDetails, photos } = profile
  const age = calculateAge(personalDetails?.dob)

  const handleSaveChanges = async () => {
    setIsSaving(true)
    // Here you would typically make an API call to save the changes.
    // For now, we'll just simulate it.
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Saving changes for profile:", profile.id, { about })
    toast.success("Profile updated successfully!")
    setIsSaving(false)
    onOpenChange(false)
    // You might want to trigger a data refresh here
    window.dispatchEvent(new Event("profile-updated"))
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="px-6 pt-6 text-left">
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to {personalDetails?.prefix} {personalDetails?.name}
            &apos;s profile.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-6 px-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border">
                <AvatarImage
                  src={photos?.headshot}
                  alt={personalDetails?.name}
                />
                <AvatarFallback>
                  {personalDetails?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {personalDetails?.prefix} {personalDetails?.name}
                </h2>
                <div className="mt-1 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {personalDetails?.gender === "Male" ? (
                      <Mars className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Venus className="h-4 w-4 text-pink-500" />
                    )}
                    <span>{personalDetails?.gender}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{age} years old</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about-textarea">About</Label>
              <Textarea
                id="about-textarea"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={8}
                placeholder="Tell us about this person..."
                disabled={isSaving}
              />
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="px-6 pb-6">
          <Button
            onClick={handleSaveChanges}
            disabled={isSaving || !hasChanges}
            className="btn-gradient w-full"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
