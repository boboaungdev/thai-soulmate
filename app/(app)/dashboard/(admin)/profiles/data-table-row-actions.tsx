"use client"

import {
  Copy,
  Eye,
  MoreHorizontal,
  Printer,
  Send,
  Loader2,
  Check,
  ChevronsUpDown,
  FileEdit,
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
import { ProfileRow } from "./columns"

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

  const personalDetails =
    typeof user.personalDetails === "string"
      ? JSON.parse(user.personalDetails)
      : user.personalDetails || {}

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
          profile: personalDetails,
          to: selectedUserToSend?.personalDetails,
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
    } finally {
      setIsSendingProfile(false)
      setSelectedUserIdToSend(null)
      setSelectedUserToSend(null)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        onOpenChange(open)
        if (!open) {
          setSelectedUserIdToSend(null)
          setSelectedUserToSend(null)
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={e => e.stopPropagation()}
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
                          sendToUsers.find(u => u.id === selectedUserIdToSend)
                            ?.personalDetails?.prefix
                        } ${
                          sendToUsers.find(u => u.id === selectedUserIdToSend)
                            ?.personalDetails?.name
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
                      {sendToUsers.map(u => {
                        const userAge =
                          u.personalDetails?.dob &&
                          !isNaN(new Date(u.personalDetails.dob).getTime())
                            ? new Date().getFullYear() -
                              new Date(u.personalDetails.dob).getFullYear()
                            : "N/A"
                        return (
                          <CommandItem
                            key={u.id}
                            value={`${u.personalDetails?.prefix || ""} ${
                              u.personalDetails?.name || ""
                            } ${String(u.customId).padStart(4, "0")}`}
                            onSelect={() => {
                              setSelectedUserIdToSend(u.id)
                              setSelectedUserToSend(u)
                              setIsComboboxOpen(false)
                            }}
                            className="flex items-center gap-3"
                          >
                            <Check
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
                                {u.personalDetails?.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {u.personalDetails.prefix}{" "}
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
            onClick={e => {
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
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

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
        router.refresh()
        return "Status updated successfully"
      },
      error: () => {
        setIsUpdatingStatus(false)
        return "Failed to update status"
      },
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            onClick={event => event.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[180px]"
          onClick={event => event.stopPropagation()}
        >
          <DropdownMenuItem onClick={handleViewProfile}>
            <Eye className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FileEdit className="mr-2 h-4 w-4" />
              <span>Change Status</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {Object.values(ProfileStatus).map(status => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdatingStatus || user.status === status}
                >
                  {isUpdatingStatus && user.status !== status ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        user.status === status ? "opacity-100" : "opacity-0"
                      )}
                    />
                  )}
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={handleSendProfile}>
            <Send className="mr-2 h-4 w-4" />
            <span>Send Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/print/profile/${user.id}?print=true`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyId}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy ID</span>
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
