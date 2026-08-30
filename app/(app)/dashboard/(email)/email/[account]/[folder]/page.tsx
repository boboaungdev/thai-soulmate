"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Mail,
  Inbox,
  Send,
  Settings2,
  Search,
  Plus,
  RefreshCw,
  Trash2,
  Star,
  Archive,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Save,
  Pencil,
  Lock,
} from "lucide-react"

import { EMAIL_ACCOUNTS, EMAIL_FOLDERS } from "@/constants/email"
import { useAuthStore } from "@/stores/auth-store"
import { ComposeEmailDialog } from "@/components/email/compose-email-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Email type
type MockEmail = {
  id: string
  from?: string
  to?: string
  subject: string
  preview: string
  date: string
  unread: boolean
  starred: boolean
}

// Mock emails data for demo
const mockEmails: {
  inbox: MockEmail[]
  sent: MockEmail[]
} = {
  inbox: [
    {
      id: "1",
      from: "Liam Walker <liam.walker@example.com>",
      subject: "Inquiry regarding 1-to-1 Matchmaking Service",
      preview:
        "Hello team, I recently came across Thai Soulmate and would like to know more about the membership tiers...",
      date: "10:42 AM",
      unread: true,
      starred: true,
    },
    {
      id: "2",
      from: "Sophia Chen <sophia.chen@example.com>",
      subject: "Follow up: Video consultation schedule",
      preview:
        "Hi, can we reschedule our upcoming consultation session to next Tuesday at 3 PM GMT+7?",
      date: "Yesterday",
      unread: false,
      starred: false,
    },
    {
      id: "3",
      from: "Stripe Billing <notifications@stripe.com>",
      subject: "Receipt for membership invoice #INV-2026-08",
      preview:
        "Your payment of ฿34,999.00 has been successfully processed for Thai Soulmate 3-Month Plan.",
      date: "Aug 28",
      unread: false,
      starred: false,
    },
  ],

  sent: [
    {
      id: "s1",
      to: "Liam Walker <liam.walker@example.com>",
      subject: "Re: Inquiry regarding 1-to-1 Matchmaking Service",
      preview:
        "Hi Liam, thank you for reaching out! We would love to introduce you to our matchmakers. Attached is the overview...",
      date: "11:15 AM",
      unread: false,
      starred: false,
    },
    {
      id: "s2",
      to: "Member Support <support@thaisoulmate.org>",
      subject: "Monthly System Health & Inquiries Summary",
      preview:
        "Here is the monthly log of all verified matches and pending member applications for August 2026...",
      date: "Aug 25",
      unread: false,
      starred: false,
    },
  ],
}

export default function EmailFolderDynamicPage() {
  const params = useParams()
  const router = useRouter()

  const accountParam = Array.isArray(params?.account)
    ? params.account[0]
    : (params?.account as string) || "socials"
  const folderParam = Array.isArray(params?.folder)
    ? params.folder[0]
    : (params?.folder as string) || "inbox"

  const { user } = useAuthStore()

  const currentAccount =
    accountParam === "personal"
      ? {
          id: "personal",
          email: user?.email || "personal@thaisoulmate.org",
          name: user?.name ? `${user.name} (Personal)` : "Personal",
          description: "Your personal mailbox and correspondence",
        }
      : EMAIL_ACCOUNTS.find((a) => a.id === accountParam) || EMAIL_ACCOUNTS[0]

  const [searchQuery, setSearchQuery] = React.useState("")
  const [composeOpen, setComposeOpen] = React.useState(false)
  const [composeData, setComposeData] = React.useState<{
    to?: string
    subject?: string
    body?: string
  }>({})

  const [selectedEmail, setSelectedEmail] = React.useState<MockEmail | null>(
    null
  )

  // Settings State
  const defaultDisplayName = `Thai Soulmate - ${currentAccount?.name}`
  const defaultSignature = `Best regards,\n${currentAccount?.name}\n${currentAccount?.email}`

  const [displayName, setDisplayName] = React.useState(defaultDisplayName)
  const [savedDisplayName, setSavedDisplayName] =
    React.useState(defaultDisplayName)

  const [notificationEmail, setNotificationEmail] = React.useState("")
  const [savedNotificationEmail, setSavedNotificationEmail] = React.useState("")

  const [signature, setSignature] = React.useState(defaultSignature)
  const [savedSignature, setSavedSignature] = React.useState(defaultSignature)

  const [isEditingConfig, setIsEditingConfig] = React.useState(false)
  const [isEditingSignature, setIsEditingSignature] = React.useState(false)

  // Sync settings when current mailbox account changes
  React.useEffect(() => {
    const newDisplayName = `Thai Soulmate - ${currentAccount?.name}`
    const newSignature = `Best regards,\n${newDisplayName}\n${currentAccount?.email}`
    setDisplayName(newDisplayName)
    setSavedDisplayName(newDisplayName)
    setNotificationEmail("")
    setSavedNotificationEmail("")
    setSignature(newSignature)
    setSavedSignature(newSignature)
    setIsEditingConfig(false)
    setIsEditingSignature(false)
  }, [currentAccount?.name, currentAccount?.email])

  const isNotificationSameAsCurrent =
    notificationEmail.trim().length > 0 &&
    notificationEmail.trim().toLowerCase() ===
      currentAccount.email.toLowerCase()

  const isNotificationValid =
    notificationEmail.trim() === "" ||
    /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(notificationEmail.trim())

  const hasConfigChanged =
    displayName.trim() !== savedDisplayName.trim() ||
    notificationEmail.trim() !== savedNotificationEmail.trim()

  const isSaveConfigDisabled =
    !hasConfigChanged || isNotificationSameAsCurrent || !isNotificationValid

  const hasSignatureChanged = signature.trim() !== savedSignature.trim()
  const isSaveSignatureDisabled = !hasSignatureChanged

  const handleSaveConfig = () => {
    if (isNotificationSameAsCurrent) {
      toast.error(
        "Notification address cannot be the same as current email address."
      )
      return
    }

    if (!isNotificationValid) {
      toast.error("Please enter a single valid notification email address.")
      return
    }

    setSavedDisplayName(displayName.trim())
    setSavedNotificationEmail(notificationEmail.trim())
    setIsEditingConfig(false)
    toast.success("Mailbox configuration saved successfully!")
  }

  const handleSaveSignature = () => {
    setSavedSignature(signature.trim())
    setIsEditingSignature(false)
    toast.success("Email signature saved successfully!")
  }

  const emailList = folderParam === "sent" ? mockEmails.sent : mockEmails.inbox

  const filteredEmails = emailList.filter(
    (email) =>
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {currentAccount?.name} Email
            </h1>
            <Badge variant="outline" className="text-xs font-normal">
              {currentAccount?.email}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentAccount?.description ??
              `Managing emails for ${currentAccount?.email}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Account Selector Dropdown/Switcher */}
          <Tabs
            value={folderParam}
            onValueChange={(val) =>
              router.push(`/dashboard/email/${accountParam}/${val}`)
            }
          >
            <TabsList>
              {EMAIL_FOLDERS.map((f) => (
                <TabsTrigger key={f.id} value={f.slug} className="capitalize">
                  {f.id === "inbox" && <Inbox className="mr-1.5 size-4" />}
                  {f.id === "sent" && <Send className="mr-1.5 size-4" />}
                  {f.id === "settings" && (
                    <Settings2 className="mr-1.5 size-4" />
                  )}
                  {f.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button
            className="btn-gradient gap-1.5"
            onClick={() => {
              setComposeData({})
              setComposeOpen(true)
            }}
          >
            <Plus className="size-4" />
            <span>Compose</span>
          </Button>

          <ComposeEmailDialog
            open={composeOpen}
            onOpenChange={setComposeOpen}
            fromEmail={currentAccount.email}
            fromName={currentAccount.name}
            initialTo={composeData.to}
            initialSubject={composeData.subject}
            initialBody={composeData.body}
          />
        </div>
      </div>

      {/* View Switcher based on folder */}
      {folderParam === "settings" ? (
        /* Settings View */
        <div className="grid gap-6 md:grid-cols-2">
          {/* Mailbox Configuration Card */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 border-b p-4 sm:p-5">
              <div>
                <CardTitle>Mailbox Configuration</CardTitle>
                <CardDescription className="pt-1">
                  Account identity, routing, and alert delivery for{" "}
                  {currentAccount.email}
                </CardDescription>
              </div>
              {!isEditingConfig && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingConfig(true)}
                  className="shrink-0 gap-1.5"
                >
                  <Pencil className="size-3.5" />
                  <span>Edit</span>
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-5">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={!isEditingConfig}
                  placeholder="Thai Soulmate"
                  className={cn(
                    !isEditingConfig && "bg-muted/40 text-muted-foreground"
                  )}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-addr">Email Address</Label>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <Lock className="size-3 text-muted-foreground/70" />
                    <span>Locked</span>
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Input
                    id="email-addr"
                    value={currentAccount.email}
                    disabled
                    className="cursor-not-allowed bg-muted/50 pr-8 text-muted-foreground"
                  />
                  <Lock className="pointer-events-none absolute right-2.5 size-3.5 text-muted-foreground/50" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reply-to">Reply-To Address</Label>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <Lock className="size-3 text-muted-foreground/70" />
                    <span>Locked</span>
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Input
                    id="reply-to"
                    value={currentAccount.email}
                    disabled
                    className="cursor-not-allowed bg-muted/50 pr-8 text-muted-foreground"
                  />
                  <Lock className="pointer-events-none absolute right-2.5 size-3.5 text-muted-foreground/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-to">Notification To Address</Label>
                <Input
                  id="notification-to"
                  placeholder="e.g. your@example.com"
                  value={notificationEmail}
                  onChange={(e) => {
                    // Strictly single email: disallow commas, semicolons, and spaces
                    const clean = e.target.value.replace(/[\s,;]/g, "")
                    setNotificationEmail(clean)
                  }}
                  disabled={!isEditingConfig}
                  className={cn(
                    !isEditingConfig && "bg-muted/40 text-muted-foreground",
                    isEditingConfig &&
                      (isNotificationSameAsCurrent ||
                        (!isNotificationValid &&
                          notificationEmail.length > 0)) &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {isEditingConfig && isNotificationSameAsCurrent && (
                  <div className="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-destructive">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>
                      Notification address cannot be the same as current email
                      address.
                    </span>
                  </div>
                )}
                {isEditingConfig &&
                  !isNotificationSameAsCurrent &&
                  !isNotificationValid &&
                  notificationEmail.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-destructive">
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span>
                        Only a single valid email address is allowed (no
                        commas).
                      </span>
                    </div>
                  )}
                {(!isEditingConfig ||
                  (!isNotificationSameAsCurrent && isNotificationValid)) && (
                  <p className="text-xs text-muted-foreground">
                    Optional single backup email address for receiving delivery
                    and system alerts (no commas).
                  </p>
                )}
              </div>

              {/* Save & Cancel Controls (Under inputs when editing) */}
              {isEditingConfig && (
                <div className="flex animate-in items-center gap-2 pt-2 duration-150 fade-in-50">
                  <Button
                    onClick={handleSaveConfig}
                    disabled={isSaveConfigDisabled}
                    className="btn-gradient gap-1.5"
                  >
                    <Save className="size-4" />
                    <span>Save Changes</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingConfig(false)
                      setDisplayName(savedDisplayName)
                      setNotificationEmail(savedNotificationEmail)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Signature Card */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 border-b p-4 sm:p-5">
              <div>
                <CardTitle>Email Signature</CardTitle>
                <CardDescription className="pt-1">
                  Customize the sign-off automatically appended to outgoing
                  correspondence
                </CardDescription>
              </div>
              {!isEditingSignature && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingSignature(true)}
                  className="shrink-0 gap-1.5"
                >
                  <Pencil className="size-3.5" />
                  <span>Edit</span>
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-5">
              <div className="space-y-2">
                <Label htmlFor="signature">Signature Text</Label>
                <Textarea
                  id="signature"
                  rows={5}
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  disabled={!isEditingSignature}
                  placeholder={`Best regards,\n${currentAccount.name}\n${currentAccount.email}`}
                  className={cn(
                    "font-mono text-xs leading-relaxed",
                    !isEditingSignature && "bg-muted/40 text-muted-foreground"
                  )}
                />
              </div>

              {/* Live Preview Box */}
              <div className="rounded-lg border bg-muted/20 p-3 text-xs">
                <div className="mb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Signature Preview
                </div>
                <div className="font-sans leading-relaxed whitespace-pre-line text-foreground">
                  {signature || "(No signature specified)"}
                </div>
              </div>

              {/* Save & Cancel Controls (Under inputs when editing) */}
              {isEditingSignature && (
                <div className="flex animate-in items-center gap-2 pt-2 duration-150 fade-in-50">
                  <Button
                    onClick={handleSaveSignature}
                    disabled={isSaveSignatureDisabled}
                    className="btn-gradient gap-1.5"
                  >
                    <Save className="size-4" />
                    <span>Save Changes</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingSignature(false)
                      setSignature(savedSignature)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Email List (Inbox / Sent) View */
        <Card className="flex flex-1 flex-col">
          <CardHeader className="border-b p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${folderParam}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon-sm">
                  <RefreshCw className="size-4" />
                </Button>
                <Button variant="outline" size="icon-sm">
                  <Archive className="size-4" />
                </Button>
                <Button variant="outline" size="icon-sm">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0">
            {filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Inbox className="mb-3 size-12 stroke-[1.2] text-muted-foreground/50" />
                <p className="font-medium text-foreground">No emails found</p>
                <p className="text-xs">
                  {searchQuery
                    ? "Try adjusting your search criteria."
                    : `Your ${folderParam} folder is empty.`}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`group flex cursor-pointer items-start gap-4 p-4 transition-colors hover:bg-muted/50 ${
                      "unread" in email && email.unread
                        ? "bg-muted/30 font-medium"
                        : ""
                    }`}
                  >
                    <div className="pt-0.5">
                      <Star
                        className={`size-4 ${
                          email.starred
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/40 group-hover:text-muted-foreground"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm">
                          {"from" in email ? email.from : email.to}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {email.date}
                        </span>
                      </div>

                      <div className="mt-0.5 truncate text-sm font-medium">
                        {email.subject}
                      </div>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {email.preview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Email Viewer Dialog */}
      <Dialog
        open={Boolean(selectedEmail)}
        onOpenChange={(open) => !open && setSelectedEmail(null)}
      >
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>{selectedEmail?.subject}</DialogTitle>
            <DialogDescription className="flex items-center justify-between pt-1 text-xs">
              <span>
                {selectedEmail && "from" in selectedEmail
                  ? selectedEmail.from
                  : selectedEmail?.to}
              </span>
              <span>{selectedEmail?.date}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto py-4 text-sm leading-relaxed whitespace-pre-wrap [&_img]:my-2 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:shadow-xs">
            {selectedEmail &&
            "bodyHtml" in selectedEmail &&
            selectedEmail.bodyHtml ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedEmail.bodyHtml as string,
                }}
              />
            ) : (
              <>
                {selectedEmail?.preview}
                {"\n\n"}
                Thank you for choosing Thai Soulmate! Please feel free to reach
                out if you require any additional assistance.
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEmail(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedEmail) {
                  const replyTo =
                    "from" in selectedEmail ? selectedEmail.from : ""
                  const replySubject = selectedEmail.subject.startsWith("Re:")
                    ? selectedEmail.subject
                    : `Re: ${selectedEmail.subject}`
                  const replyBody = `<br/><br/><blockquote>On ${selectedEmail.date}, ${replyTo} wrote:<br/>${selectedEmail.preview}</blockquote>`

                  setComposeData({
                    to: replyTo,
                    subject: replySubject,
                    body: replyBody,
                  })
                }
                setSelectedEmail(null)
                setComposeOpen(true)
              }}
              className="gap-1.5"
            >
              <Send className="size-4" />
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
