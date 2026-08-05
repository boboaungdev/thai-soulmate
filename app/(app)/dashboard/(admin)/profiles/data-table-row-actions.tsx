import {
  Copy,
  Eye,
  MoreHorizontal,
  Printer,
  Send,
  Loader2,
  CheckCircle2,
  ChevronsUpDown,
  FileEdit,
  Clock,
  Trash2,
  FileText,
} from "lucide-react"
import { Row } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ProfileStatus } from "@/lib/generated/prisma/enums"
import { useAuthStore } from "@/stores/auth-store"
import { Textarea } from "@/components/ui/textarea"
import { ProfileRow } from "./columns"

const profileStatuses = [
  {
    value: ProfileStatus.PENDING,
    label: "Pending",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    value: ProfileStatus.COMPLETED,
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-500",
  },
]

function SendProfileDialog({
  isOpen,
  onOpenChange,
  user,
}: {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  user: ProfileRow
}) {
  const [sendToUsers, setSendToUsers] = useState<ProfileRow[]>([])
  const [isFetchingSendToUsers, setIsFetchingSendToUsers] = useState(false)
  const [selectedUserIdToSend, setSelectedUserIdToSend] = useState<
    string | null
  >(null)
  const [selectedUserToSend, setSelectedUserToSend] =
    useState<ProfileRow | null>(null)
  const [isSendingProfile, setIsSendingProfile] = useState(false)
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)

  const personalDetails = user.personalDetails || {}
  const toPersonalDetails = selectedUserToSend?.personalDetails || {}
  const toPhotos = selectedUserToSend?.photos || {}

  useEffect(() => {
    if (!isOpen || !user) return

    async function fetchSendToUsers() {
      setIsFetchingSendToUsers(true)
      try {
        const response = await fetch(`/api/profiles`)
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()
        setSendToUsers(data.data)
      } catch (error) {
        console.error(error)
        toast.error("Could not fetch users to send profile to.")
      } finally {
        setIsFetchingSendToUsers(false)
      }
    }

    fetchSendToUsers()
  }, [isOpen, user, personalDetails?.gender])

  const handleSendProfile = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSendingProfile(true)

    try {
      const res = await fetch("/api/profiles/send-profile-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: user?.id,
          profile: { ...personalDetails, photos: user.photos },
          to: { ...toPersonalDetails, photos: toPhotos },
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Profile sent")
        onOpenChange(false)
        setSelectedUserIdToSend(null)
        setSelectedUserToSend(null)
      }
    } catch (error) {
      toast.error("Failed to send")
      console.log(error)
    } finally {
      setIsSendingProfile(false)
      setSelectedUserIdToSend(null)
      setSelectedUserToSend(null)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          setSelectedUserIdToSend(null)
          setSelectedUserToSend(null)
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Send Profile</DialogTitle>
          <DialogDescription>
            Select a user to send {personalDetails?.prefix}{" "}
            {personalDetails?.name}
            &apos;s profile to.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user-select" className="text-right">
              To
            </Label>
            <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isComboboxOpen}
                  className="col-span-3 justify-between"
                  disabled={isFetchingSendToUsers || isSendingProfile}
                >
                  {isFetchingSendToUsers
                    ? "Loading users..."
                    : selectedUserIdToSend
                      ? `${
                          sendToUsers.find((u) => u.id === selectedUserIdToSend)
                            ?.personalDetails.prefix
                        } ${
                          sendToUsers.find((u) => u.id === selectedUserIdToSend)
                            ?.personalDetails.name
                        }`
                      : personalDetails?.gender === "Male"
                        ? "Select a female"
                        : personalDetails?.gender === "Female"
                          ? "Select a male"
                          : "Select a user"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search user..." />
                  <CommandList>
                    <CommandEmpty>
                      {isFetchingSendToUsers ? "Loading..." : "No users found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {sendToUsers.map((u) => {
                        const userAge =
                          u.personalDetails.dob &&
                          !isNaN(new Date(u.personalDetails.dob).getTime())
                            ? new Date().getFullYear() -
                              new Date(u.personalDetails.dob).getFullYear()
                            : "N/A"
                        return (
                          <CommandItem
                            key={u.id}
                            value={`${u.personalDetails.prefix || ""} ${
                              u.personalDetails.name || ""
                            } ${String(u.customId).padStart(4, "0")}`}
                            onSelect={() => {
                              setSelectedUserIdToSend(u.id)
                              setSelectedUserToSend(u)
                              setIsComboboxOpen(false)
                            }}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle2
                              className={cn(
                                "h-4 w-4",
                                selectedUserIdToSend === u.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.photos?.headshot} />
                              <AvatarFallback>
                                {u.personalDetails.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {u.personalDetails.prefix || ""}{" "}
                                {u.personalDetails?.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ID: {String(u.customId).padStart(4, "0")},{" "}
                                {userAge} years old
                              </span>
                            </div>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSendingProfile}
            onClick={(e) => {
              e.stopPropagation()
              onOpenChange(false)
              setSelectedUserIdToSend(null)
              setSelectedUserToSend(null)
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSendProfile}
            disabled={isSendingProfile || !selectedUserIdToSend}
            className="btn-gradient"
          >
            {isSendingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSendingProfile ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const user = row.original as ProfileRow
  const { user: authUser } = useAuthStore()
  const [message, setMessage] = useState("")
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation()
    const idToCopy = String(user.customId).padStart(4, "0")
    navigator.clipboard.writeText(idToCopy)
    toast.success(`Copied ID: ${idToCopy}`)
  }

  const handleSendProfile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSendDialogOpen(true)
  }

  const handleViewProfile = () => {
    router.push(`/dashboard/profiles/${user.id}`)
  }

  const handleStatusChange = async (status: ProfileStatus) => {
    setIsUpdatingStatus(true)
    const promise = fetch(`/api/profiles/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })

    toast.promise(promise, {
      loading: "Updating status...",
      success: () => {
        setIsUpdatingStatus(false)
        window.dispatchEvent(new Event("profile-updated"))
        return "Status updated successfully"
      },
      error: () => {
        setIsUpdatingStatus(false)
        return "Failed to update status"
      },
    })
  }

  const handleAddNote = async () => {
    if (!authUser?.id) {
      toast.error("You must be logged in to add a note.")
      return
    }

    if (!message.trim()) {
      toast.error("Please enter a note.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/notes/${user.id}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userId: authUser.id }),
      })

      if (res.ok) {
        toast.success("Note added successfully.")
        setMessage("")
        setIsNoteDialogOpen(false)
        window.dispatchEvent(new Event("profile-updated"))
      } else {
        const { message: errorMessage, error } = await res.json()
        toast.error(errorMessage || error || "Failed to add note.")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[180px]"
          onClick={(event) => event.stopPropagation()}
        >
          <DropdownMenuItem onClick={handleViewProfile}>
            <Eye className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/profiles/${user.id}/edit`}
              onClick={(e) => e.stopPropagation()}
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </DropdownMenuItem>
          <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <FileText className="mr-2 h-4 w-4" />
                Add Note
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Note</DialogTitle>
                <DialogDescription>
                  Add a note to this profile record.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                <Label htmlFor="profile-note">Note</Label>
                <Textarea
                  id="profile-note"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={4}
                  placeholder="Type your note here."
                  disabled={isLoading}
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setIsNoteDialogOpen(false)}
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddNote}
                  disabled={isLoading || !message.trim()}
                  className="btn-gradient"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isLoading ? "Adding..." : "Add Note"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              <span>Change Status</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {profileStatuses.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={isUpdatingStatus || user.status === status.value}
                  className={cn(status.color)}
                >
                  {isUpdatingStatus && user.status !== status.value ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <status.icon
                      className={cn("mr-2 h-4 w-4", {
                        "opacity-40": user.status === status.value,
                      })}
                    />
                  )}
                  {status.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSendProfile}>
            <Send className="mr-2 h-4 w-4" />
            <span>Send Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyId}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy ID</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/print/profile/${user.id}?print=true`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SendProfileDialog
        isOpen={isSendDialogOpen}
        onOpenChange={setIsSendDialogOpen}
        user={user}
      />
    </>
  )
}
