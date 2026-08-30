"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  Inbox,
  Send,
  Settings2,
  Search,
  Plus,
  RefreshCw,
  Trash2,
  Star,
  AlertCircle,
  Save,
  Pencil,
  Lock,
  Reply,
  Forward,
  Paperclip,
  Download,
  FileText,
  Upload,
  X,
} from "lucide-react"

import { EMAIL_ACCOUNTS, EMAIL_FOLDERS } from "@/constants/email"
import { useAuthStore } from "@/stores/auth-store"
import {
  ComposeEmailDialog,
  TagEmailInput,
} from "@/components/email/compose-email-dialog"
import { extractCleanEmail } from "@/lib/email-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Database Email type
export interface DbEmailMessage {
  id: string
  resendId?: string | null
  mailbox: string
  folder: "INBOX" | "SENT" | "DRAFT" | "TRASH" | "ARCHIVE" | "SPAM"
  direction: "INBOUND" | "OUTBOUND"
  fromEmail: string
  fromName?: string | null
  toEmails: string[]
  ccEmails: string[]
  bccEmails: string[]
  replyTo?: string | null
  subject: string
  preview?: string | null
  bodyText?: string | null
  bodyHtml: string
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
  isTrash: boolean
  attachments: Array<{
    id: string
    filename: string
    contentType: string
    size: number
    url: string
    r2Key: string
    isInline: boolean
  }>
  sentAt?: string | null
  receivedAt?: string | null
  createdAt: string
  updatedAt: string
}

function formatEmailDate(dateStr?: string | Date | null) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ""
  const now = new Date()
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()

  if (isToday) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()

  if (isYesterday) {
    return "Yesterday"
  }

  return d.toLocaleDateString([], { month: "short", day: "numeric" })
}

function formatFileSize(bytes: number) {
  if (!bytes || bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

// Helper to parse name and email
function parseEmailParty(name?: string | null, email?: string) {
  if (name && email) {
    const parts = name.split(" ")
    const initials =
      parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase()
    return { name, email, initials }
  }
  if (email) {
    const clean = extractCleanEmail(email)
    const initials = clean.slice(0, 2).toUpperCase()
    return { name: clean.split("@")[0], email: clean, initials }
  }
  return { name: "Unknown", email: "", initials: "U" }
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
  const userEmail = user?.email || ""

  const currentAccount = React.useMemo(() => {
    if (accountParam === "personal") {
      return {
        id: "personal",
        email: userEmail,
        name: user?.name ? `${user.name}` : "Personal",
        description: "Your personal mailbox",
      }
    }
    const found = EMAIL_ACCOUNTS.find(
      (a) =>
        a.id.toLowerCase() === accountParam.toLowerCase() ||
        a.email.toLowerCase() === accountParam.toLowerCase()
    )
    if (found) return found
    return {
      id: accountParam,
      email: `${accountParam}@thaisoulmate.org`,
      name: accountParam.charAt(0).toUpperCase() + accountParam.slice(1),
      description: `Managing emails for ${accountParam}@thaisoulmate.org`,
    }
  }, [accountParam, user?.name, userEmail])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [composeOpen, setComposeOpen] = React.useState(false)
  const [composeData, setComposeData] = React.useState<{
    to?: string
    subject?: string
    body?: string
    disableTo?: boolean
  }>({})

  const [emails, setEmails] = React.useState<DbEmailMessage[]>([])
  const [isLoadingEmails, setIsLoadingEmails] = React.useState(true)
  const [selectedEmail, setSelectedEmail] =
    React.useState<DbEmailMessage | null>(null)

  // Settings State
  const defaultDisplayName = React.useMemo(
    () => `Thai Soulmate - ${currentAccount.name}`,
    [currentAccount.name]
  )
  const defaultSignature = React.useMemo(
    () =>
      `Best regards,\n${currentAccount.name}\n${currentAccount.email}\n\nCONFIDENTIALITY NOTICE: This email and any attachments are intended only for the person or entity to whom they are addressed and may contain confidential information. If you have received this email in error, please notify the sender and delete it. Any unauthorized copying, disclosure, or use of this email or its contents is prohibited.`,
    [currentAccount.name, currentAccount.email]
  )

  const [displayName, setDisplayName] = React.useState(defaultDisplayName)
  const [savedDisplayName, setSavedDisplayName] =
    React.useState(defaultDisplayName)

  const [notificationEmails, setNotificationEmails] = React.useState<string[]>(
    []
  )
  const [savedNotificationEmails, setSavedNotificationEmails] = React.useState<
    string[]
  >([])

  const [signature, setSignature] = React.useState(defaultSignature)
  const [savedSignature, setSavedSignature] = React.useState(defaultSignature)

  const [signatureImage, setSignatureImage] = React.useState<string | null>(
    null
  )
  const [savedSignatureImage, setSavedSignatureImage] = React.useState<
    string | null
  >(null)

  const [signatureSize, setSignatureSize] = React.useState<"sm" | "md" | "lg">(
    "md"
  )
  const [savedSignatureSize, setSavedSignatureSize] = React.useState<
    "sm" | "md" | "lg"
  >("md")

  const signatureFileInputRef = React.useRef<HTMLInputElement>(null)

  const [isEditingConfig, setIsEditingConfig] = React.useState(false)
  const [isEditingSignature, setIsEditingSignature] = React.useState(false)
  const [isSavingSettings, setIsSavingSettings] = React.useState(false)

  // Fetch real emails from database API
  const fetchEmails = React.useCallback(async () => {
    if (folderParam === "settings") return
    setIsLoadingEmails(true)
    try {
      const userEmailParam =
        accountParam === "personal" && userEmail
          ? `&userEmail=${encodeURIComponent(userEmail)}`
          : ""
      const res = await fetch(
        `/api/email?mailbox=${encodeURIComponent(accountParam)}&folder=${encodeURIComponent(
          folderParam
        )}&q=${encodeURIComponent(searchQuery)}${userEmailParam}`
      )
      const json = await res.json()
      if (json.success) {
        setEmails(json.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch emails from database", err)
    } finally {
      setIsLoadingEmails(false)
    }
  }, [accountParam, folderParam, searchQuery, userEmail])

  React.useEffect(() => {
    fetchEmails()
  }, [fetchEmails])

  // Fetch mailbox settings from database API
  const fetchSettings = React.useCallback(async () => {
    try {
      const res = await fetch(
        `/api/email/settings?mailbox=${encodeURIComponent(accountParam)}`
      )
      const json = await res.json()
      if (json.success && json.data) {
        const s = json.data
        const loadedDisplayName = s.displayName || defaultDisplayName
        const loadedSignature = s.signatureText || defaultSignature
        const loadedNotificationEmails = s.notificationEmails || []
        const loadedSigImg = s.signatureImageUrl || null
        const loadedSigSize = (s.signatureSize as "sm" | "md" | "lg") || "md"

        setDisplayName(loadedDisplayName)
        setSavedDisplayName(loadedDisplayName)
        setNotificationEmails(loadedNotificationEmails)
        setSavedNotificationEmails(loadedNotificationEmails)
        setSignature(loadedSignature)
        setSavedSignature(loadedSignature)
        setSignatureImage(loadedSigImg)
        setSavedSignatureImage(loadedSigImg)
        setSignatureSize(loadedSigSize)
        setSavedSignatureSize(loadedSigSize)
      } else {
        setDisplayName(defaultDisplayName)
        setSavedDisplayName(defaultDisplayName)
        setNotificationEmails([])
        setSavedNotificationEmails([])
        setSignature(defaultSignature)
        setSavedSignature(defaultSignature)
        setSignatureImage(null)
        setSavedSignatureImage(null)
        setSignatureSize("md")
        setSavedSignatureSize("md")
      }
    } catch (err) {
      console.error("Failed to fetch settings", err)
    }
  }, [accountParam, defaultDisplayName, defaultSignature])

  React.useEffect(() => {
    fetchSettings()
    setIsEditingConfig(false)
    setIsEditingSignature(false)
  }, [fetchSettings])

  const handleSignatureImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Signature image must be less than 2MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const src = event.target?.result as string
      if (src) {
        setSignatureImage(src)
        toast.success("Signature image attached")
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const hasCurrentAccountInNotification = notificationEmails.some(
    (e) => e.trim().toLowerCase() === currentAccount.email.toLowerCase()
  )

  const hasConfigChanged =
    displayName.trim() !== savedDisplayName.trim() ||
    JSON.stringify(notificationEmails) !==
      JSON.stringify(savedNotificationEmails)

  const isSaveConfigDisabled =
    !hasConfigChanged || hasCurrentAccountInNotification || isSavingSettings

  const hasSignatureChanged =
    signature.trim() !== savedSignature.trim() ||
    signatureImage !== savedSignatureImage ||
    signatureSize !== savedSignatureSize

  const isSaveSignatureDisabled = !hasSignatureChanged || isSavingSettings

  // Save Mailbox Config to Database
  const handleSaveConfig = async () => {
    if (hasCurrentAccountInNotification) {
      toast.error(
        "Notification address cannot include the current account email address."
      )
      return
    }

    setIsSavingSettings(true)
    try {
      const res = await fetch("/api/email/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mailbox: accountParam,
          displayName: displayName.trim(),
          notificationEmails,
          signatureText: savedSignature,
          signatureImage: savedSignatureImage,
          signatureSize: savedSignatureSize,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save configuration")
      }

      setSavedDisplayName(displayName.trim())
      setSavedNotificationEmails([...notificationEmails])
      setIsEditingConfig(false)
      toast.success("Mailbox configuration saved successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to save configuration")
    } finally {
      setIsSavingSettings(false)
    }
  }

  // Save Email Signature to Database & Cloudflare R2
  const handleSaveSignature = async () => {
    setIsSavingSettings(true)
    try {
      const res = await fetch("/api/email/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mailbox: accountParam,
          displayName: savedDisplayName,
          notificationEmails: savedNotificationEmails,
          signatureText: signature.trim(),
          signatureImage: signatureImage,
          signatureSize: signatureSize,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save signature")
      }

      const finalImgUrl = json.data?.signatureImageUrl || signatureImage
      setSavedSignature(signature.trim())
      setSignatureImage(finalImgUrl)
      setSavedSignatureImage(finalImgUrl)
      setSavedSignatureSize(signatureSize)
      setIsEditingSignature(false)
      toast.success("Email signature saved successfully to database!")
    } catch (err: any) {
      toast.error(err.message || "Failed to save signature")
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleCancelSignature = () => {
    setIsEditingSignature(false)
    setSignature(savedSignature)
    setSignatureImage(savedSignatureImage)
    setSignatureSize(savedSignatureSize)
  }

  // Email Actions
  const handleToggleStar = async (
    email: DbEmailMessage,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()
    const nextStarred = !email.isStarred
    setEmails((prev) =>
      prev.map((item) =>
        item.id === email.id ? { ...item, isStarred: nextStarred } : item
      )
    )
    try {
      await fetch("/api/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: email.id, isStarred: nextStarred }),
      })
    } catch (err) {
      console.error("Failed to update star status", err)
    }
  }

  const handleDeleteEmail = async (emailId: string) => {
    try {
      await fetch(`/api/email?id=${emailId}`, { method: "DELETE" })
      setEmails((prev) => prev.filter((e) => e.id !== emailId))
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null)
      }
      toast.success("Email deleted successfully")
    } catch (err) {
      toast.error("Failed to delete email")
    }
  }

  const handleEmailClick = (email: DbEmailMessage) => {
    setSelectedEmail(email)
    if (!email.isRead && email.folder === "INBOX") {
      setEmails((prev) =>
        prev.map((item) =>
          item.id === email.id ? { ...item, isRead: true } : item
        )
      )
      fetch("/api/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: email.id, isRead: true }),
      }).catch(console.error)
    }
  }

  const handleDownloadFile = (
    url: string,
    filename: string,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation()
    if (!url) {
      toast.error("Attachment URL not available")
      return
    }
    const downloadProxyUrl = `/api/email/attachment/download?url=${encodeURIComponent(
      url
    )}&filename=${encodeURIComponent(filename)}`
    const link = document.createElement("a")
    link.href = downloadProxyUrl
    link.download = filename || "attachment"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Downloading ${filename}`)
  }

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
          <Button
            className="btn-gradient gap-1.5"
            onClick={() => {
              setComposeData({
                body: "",
                disableTo: false,
              })
              setComposeOpen(true)
            }}
          >
            <Plus className="size-4" />
            <span>Compose</span>
          </Button>

          {/* Account Folder Tabs Switcher */}
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

          <ComposeEmailDialog
            open={composeOpen}
            onOpenChange={setComposeOpen}
            mailbox={accountParam}
            fromEmail={currentAccount.email}
            fromName={currentAccount.name}
            initialTo={composeData.to}
            initialSubject={composeData.subject}
            initialBody={composeData.body}
            disableTo={composeData.disableTo}
            signatureText={savedSignature}
            signatureImage={savedSignatureImage}
            signatureSize={savedSignatureSize}
            onEmailSent={() => {
              fetchEmails()
            }}
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
                <TagEmailInput
                  id="notification-to"
                  value={notificationEmails}
                  onChange={setNotificationEmails}
                  disabled={!isEditingConfig}
                  placeholder="Enter email and press comma or space..."
                  disallowedEmails={[currentAccount.email]}
                  validateEmail={(email) =>
                    email.toLowerCase() === currentAccount.email.toLowerCase()
                      ? "Notification address cannot be the same as current email address."
                      : null
                  }
                  className={cn(
                    !isEditingConfig && "bg-muted/40 text-muted-foreground",
                    isEditingConfig &&
                      hasCurrentAccountInNotification &&
                      "border-destructive focus-within:ring-destructive/20"
                  )}
                />
                {isEditingConfig && hasCurrentAccountInNotification ? (
                  <div className="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-destructive">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>
                      Notification address cannot include the current account
                      email address.
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Enter one or multiple notification addresses separated by
                    comma, space, or Enter.
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
                    <span>
                      {isSavingSettings ? "Saving..." : "Save Changes"}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    disabled={isSavingSettings}
                    onClick={() => {
                      setIsEditingConfig(false)
                      setDisplayName(savedDisplayName)
                      setNotificationEmails(savedNotificationEmails)
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
                  rows={4}
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

              {/* Signature Image Upload Section */}
              <div className="space-y-3 rounded-lg border bg-muted/10 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-semibold">
                      Signature Image / Logo
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Add a hand-written signature, company logo, or profile
                      image
                    </p>
                  </div>
                  {isEditingSignature && signatureImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSignatureImage(null)}
                      className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="mr-1 size-3.5" />
                      Remove
                    </Button>
                  )}
                </div>

                <input
                  ref={signatureFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureImageUpload}
                  className="hidden"
                />

                {signatureImage ? (
                  <div className="space-y-3">
                    {/* Uploaded image preview and replace button */}
                    <div className="flex items-center gap-3 rounded-md border bg-background p-2.5">
                      <div className="relative flex h-14 w-28 items-center justify-center rounded bg-muted/40 p-1">
                        <Image
                          src={signatureImage}
                          alt="Uploaded signature"
                          width={112}
                          height={56}
                          unoptimized
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-xs font-medium">Image attached</p>
                        {isEditingSignature && (
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                signatureFileInputRef.current?.click()
                              }
                              className="h-6 text-[11px]"
                            >
                              <Upload className="mr-1 size-3" />
                              Replace
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Size Selector (Editable mode) */}
                    {isEditingSignature && (
                      <div className="flex items-center justify-between pt-1">
                        <Label className="text-[11px] font-medium text-muted-foreground">
                          Image Display Size
                        </Label>
                        <div className="flex items-center gap-1 rounded-md border bg-background p-0.5 text-xs">
                          {(["sm", "md", "lg"] as const).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSignatureSize(s)}
                              className={cn(
                                "rounded px-2.5 py-0.5 text-xs capitalize transition-colors",
                                signatureSize === s
                                  ? "bg-primary font-medium text-primary-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {s === "sm"
                                ? "Small"
                                : s === "md"
                                  ? "Medium"
                                  : "Large"}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {isEditingSignature ? (
                      <button
                        type="button"
                        onClick={() => signatureFileInputRef.current?.click()}
                        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-background p-4 text-center transition-colors hover:border-primary hover:bg-primary/5"
                      >
                        <div className="flex size-9 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                          <Upload className="size-4" />
                        </div>
                        <div className="mt-2 text-xs font-medium">
                          Click to upload signature image or logo
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          PNG, JPG, WebP, or SVG up to 2MB
                        </div>
                      </button>
                    ) : (
                      <div className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
                        No signature image or logo attached.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Live Preview Box */}
              <div className="rounded-lg border bg-muted/20 p-3.5 text-xs">
                <div className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Signature Live Preview
                </div>
                {(() => {
                  const heightClass =
                    signatureSize === "sm"
                      ? "h-9 max-h-9"
                      : signatureSize === "lg"
                        ? "h-16 max-h-16"
                        : "h-12 max-h-12"

                  if (!signatureImage) {
                    return (
                      <div className="font-sans leading-relaxed whitespace-pre-line text-foreground">
                        {signature || "(No signature specified)"}
                      </div>
                    )
                  }

                  const lines = signature.split("\n")
                  const greeting = lines[0] || "Best regards,"
                  const rest = lines.slice(1)
                  return (
                    <div className="font-sans leading-relaxed text-foreground">
                      <div>{greeting}</div>
                      <div className="my-2">
                        <Image
                          src={signatureImage}
                          alt="Signature logo"
                          width={200}
                          height={64}
                          unoptimized
                          className={cn(
                            "w-auto rounded object-contain",
                            heightClass
                          )}
                        />
                      </div>
                      <div className="whitespace-pre-line">
                        {rest.join("\n")}
                      </div>
                    </div>
                  )
                })()}
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
                    <span>
                      {isSavingSettings
                        ? "Saving to Database..."
                        : "Save Changes"}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    disabled={isSavingSettings}
                    onClick={handleCancelSignature}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Email List (Inbox / Sent / Trash) View */
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
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={fetchEmails}
                  title="Refresh emails"
                >
                  <RefreshCw
                    className={cn("size-4", isLoadingEmails && "animate-spin")}
                  />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0">
            {isLoadingEmails ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <RefreshCw className="mb-3 size-7 animate-spin text-primary/60" />
                <p className="text-sm font-medium">
                  Loading emails from database...
                </p>
              </div>
            ) : emails.length === 0 ? (
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
                {emails.map((email) => {
                  const isSentFolder = folderParam === "sent"
                  const displayParty = isSentFolder
                    ? email.toEmails.join(", ")
                    : email.fromName
                      ? `${email.fromName} <${email.fromEmail}>`
                      : email.fromEmail

                  return (
                    <div
                      key={email.id}
                      onClick={() => handleEmailClick(email)}
                      className={cn(
                        "group flex cursor-pointer items-start gap-4 p-4 transition-colors hover:bg-muted/50",
                        !email.isRead &&
                          !isSentFolder &&
                          "bg-primary/5 font-medium"
                      )}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleToggleStar(email, e)}
                        className="pt-0.5"
                        title={email.isStarred ? "Unstar" : "Star"}
                      >
                        <Star
                          className={cn(
                            "size-4 transition-colors",
                            email.isStarred
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/40 group-hover:text-muted-foreground"
                          )}
                        />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium">
                            {displayParty || "(Unknown)"}
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatEmailDate(email.sentAt || email.createdAt)}
                          </span>
                        </div>

                        <div className="mt-0.5 flex items-center gap-2 truncate text-sm">
                          <span
                            className={cn(
                              "truncate",
                              !email.isRead && !isSentFolder
                                ? "font-semibold text-foreground"
                                : "font-normal text-foreground/90"
                            )}
                          >
                            {email.subject || "(No Subject)"}
                          </span>
                          {email.attachments &&
                            email.attachments.length > 0 && (
                              <Paperclip className="size-3.5 shrink-0 text-muted-foreground" />
                            )}
                        </div>

                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {email.preview || "(No preview text)"}
                        </p>
                      </div>
                    </div>
                  )
                })}
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
        <DialogContent className="overflow-hidden p-0 sm:max-w-[700px]">
          {selectedEmail &&
            (() => {
              const isIncoming = selectedEmail.direction === "INBOUND"
              const senderParty = parseEmailParty(
                selectedEmail.fromName,
                selectedEmail.fromEmail
              )
              const toPartyFormatted = selectedEmail.toEmails.join(", ")

              return (
                <>
                  {/* Modal Header */}
                  <div className="space-y-3 border-b px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between gap-2 pr-6">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal capitalize"
                        >
                          {folderParam}
                        </Badge>
                        {selectedEmail.isStarred && (
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-yellow-50 text-xs text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400"
                          >
                            <Star className="size-3 fill-current" />
                            Starred
                          </Badge>
                        )}
                        {selectedEmail.resendId && (
                          <Badge
                            variant="outline"
                            className="text-[10px] text-muted-foreground"
                          >
                            Resend ID: {selectedEmail.resendId.slice(0, 10)}...
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatEmailDate(
                          selectedEmail.sentAt || selectedEmail.createdAt
                        )}
                      </span>
                    </div>

                    <h2 className="text-lg leading-snug font-semibold tracking-tight break-words text-foreground">
                      {selectedEmail.subject || "(No Subject)"}
                    </h2>

                    {/* Sender & Recipient Info Card */}
                    <div className="flex items-start justify-between gap-3 rounded-lg border bg-muted/30 p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="size-9 border bg-primary/10 text-xs font-semibold text-primary">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {senderParty.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="truncate text-sm font-semibold text-foreground">
                              {selectedEmail.fromName || senderParty.name}
                            </span>
                            {selectedEmail.fromEmail && (
                              <span className="truncate text-xs text-muted-foreground">
                                &lt;{selectedEmail.fromEmail}&gt;
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">
                            to{" "}
                            <span className="font-medium text-foreground">
                              {toPartyFormatted}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="max-h-[50vh] space-y-4 overflow-y-auto px-6 py-4 text-sm leading-relaxed text-foreground/90">
                    {selectedEmail.bodyHtml ? (
                      <div
                        className="[&_img]:max-w-full [&_img]:rounded-md"
                        dangerouslySetInnerHTML={{
                          __html: selectedEmail.bodyHtml,
                        }}
                      />
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {selectedEmail.bodyText ||
                          selectedEmail.preview ||
                          "(Empty content)"}
                      </div>
                    )}

                    {/* Cloudflare R2 Attachments list if present */}
                    {selectedEmail.attachments &&
                      selectedEmail.attachments.length > 0 && (
                        <div className="mt-4 space-y-2 border-t pt-3">
                          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            <Paperclip className="size-3.5" />
                            <span>
                              Cloudflare R2 Attachments (
                              {selectedEmail.attachments.length})
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {selectedEmail.attachments.map((att) => (
                              <div
                                key={att.id}
                                onClick={() =>
                                  handleDownloadFile(att.url, att.filename)
                                }
                                className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg border bg-muted/20 p-2.5 transition-colors hover:border-primary/40 hover:bg-muted/40"
                                title={`Download ${att.filename}`}
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <FileText className="size-4 shrink-0 text-primary" />
                                  <div className="min-w-0">
                                    <p className="truncate text-xs font-medium group-hover:text-primary">
                                      {att.filename}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                      {formatFileSize(att.size)}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={(e) =>
                                    handleDownloadFile(att.url, att.filename, e)
                                  }
                                  title="Download attachment"
                                >
                                  <Download className="size-3.5 text-muted-foreground group-hover:text-primary" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Modal Footer with Actions */}
                  <div className="flex flex-col gap-2 border-t bg-muted/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedEmail(null)}
                      >
                        Close
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteEmail(selectedEmail.id)}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title="Delete email"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const sender = selectedEmail.fromEmail
                          const recipient = selectedEmail.toEmails.join(", ")
                          const fwdSubject = selectedEmail.subject.startsWith(
                            "Fwd:"
                          )
                            ? selectedEmail.subject
                            : `Fwd: ${selectedEmail.subject}`
                          const fwdBody = `<br/><br/>---------- Forwarded message ---------<br/><strong>From:</strong> ${sender}<br/><strong>Date:</strong> ${formatEmailDate(selectedEmail.sentAt || selectedEmail.createdAt)}<br/><strong>Subject:</strong> ${selectedEmail.subject}<br/><strong>To:</strong> ${recipient}<br/><br/>${selectedEmail.bodyHtml || selectedEmail.preview}`

                          setComposeData({
                            to: "",
                            subject: fwdSubject,
                            body: fwdBody,
                            disableTo: false,
                          })
                          setSelectedEmail(null)
                          setComposeOpen(true)
                        }}
                        className="gap-1.5"
                      >
                        <Forward className="size-4" />
                        <span>Forward</span>
                      </Button>

                      <Button
                        onClick={() => {
                          const replyTo = selectedEmail.fromEmail || ""
                          const replySubject = selectedEmail.subject.startsWith(
                            "Re:"
                          )
                            ? selectedEmail.subject
                            : `Re: ${selectedEmail.subject}`
                          const replyBody = `<br/><br/><blockquote>On ${formatEmailDate(selectedEmail.sentAt || selectedEmail.createdAt)}, ${selectedEmail.fromEmail} wrote:<br/>${selectedEmail.bodyHtml || selectedEmail.preview}</blockquote>`

                          setComposeData({
                            to: replyTo,
                            subject: replySubject,
                            body: replyBody,
                            disableTo: true,
                          })
                          setSelectedEmail(null)
                          setComposeOpen(true)
                        }}
                        className="btn-gradient gap-1.5"
                      >
                        <Reply className="size-4" />
                        <span>Reply</span>
                      </Button>
                    </div>
                  </div>
                </>
              )
            })()}
        </DialogContent>
      </Dialog>
    </main>
  )
}
