"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  Inbox,
  Send,
  Settings2,
  Search,
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
  Archive,
  ShieldAlert,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  MailOpen,
  RotateCcw,
} from "lucide-react"

import { EMAIL_ACCOUNTS, EMAIL_FOLDERS } from "@/constants/email"
import { useAuthStore } from "@/stores/auth-store"
import {
  useEmailStore,
  getEmailCacheKey,
  type DbEmailMessage,
} from "@/stores/email-store"
import {
  ComposeEmailDialog,
  TagEmailInput,
} from "@/components/email/compose-email-dialog"
import { extractCleanEmail, parseSenderNameAndEmail } from "@/lib/email-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export type { DbEmailMessage }

const EMPTY_EMAILS: DbEmailMessage[] = []
const EMPTY_COUNTS: Record<string, number> = {}

export interface EmailThread {
  threadId: string
  subject: string
  normalizedSubject: string
  messages: DbEmailMessage[]
  latestMessage: DbEmailMessage
  firstMessage: DbEmailMessage
  participants: Array<{ name?: string | null; email: string }>
  isRead: boolean
  isStarred: boolean
  hasAttachments: boolean
  lastActivityAt: string
}

export function normalizeEmailSubject(subject: string = ""): string {
  let s = (subject || "").trim()
  while (true) {
    const next = s
      .replace(/^(re|fwd|fw|aw|sv|vs|reply)\s*:\s*/i, "")
      .replace(
        /^\[(inbound alert|new inbound email|alert|notification)\]\s*/i,
        ""
      )
      .trim()
    if (next === s) break
    s = next
  }
  return s.toLowerCase()
}

export function groupEmailsIntoThreads(
  emails: DbEmailMessage[]
): EmailThread[] {
  const threadMap = new Map<string, DbEmailMessage[]>()

  for (const email of emails) {
    const normSub = normalizeEmailSubject(email.subject) || email.id
    if (!threadMap.has(normSub)) {
      threadMap.set(normSub, [])
    }
    threadMap.get(normSub)!.push(email)
  }

  const threads: EmailThread[] = []

  for (const [key, msgList] of threadMap.entries()) {
    const sorted = [...msgList].sort((a, b) => {
      const timeA = new Date(
        a.createdAt || a.sentAt || a.receivedAt || 0
      ).getTime()
      const timeB = new Date(
        b.createdAt || b.sentAt || b.receivedAt || 0
      ).getTime()
      return timeA - timeB
    })

    const first = sorted[0]
    const latest = sorted[sorted.length - 1]

    // A thread is unread ONLY if there is an unread incoming message from another user.
    // Outbound messages, replies, and drafts sent by us are always treated as read.
    const isOurOutbound = (m: DbEmailMessage) =>
      m.direction === "OUTBOUND" || m.folder === "SENT" || m.folder === "DRAFT"

    const isRead = !sorted.some((m) => !isOurOutbound(m) && !m.isRead)
    const isStarred = sorted.some((m) => m.isStarred)
    const hasAttachments = sorted.some(
      (m) => m.attachments && m.attachments.length > 0
    )

    const participantMap = new Map<string, string | null>()
    for (const m of sorted) {
      if (m.fromEmail) {
        participantMap.set(m.fromEmail.toLowerCase(), m.fromName || null)
      }
    }
    const participants = Array.from(participantMap.entries()).map(
      ([email, name]) => ({ name, email })
    )

    threads.push({
      threadId: key,
      subject:
        sorted.find((m) => m.subject)?.subject ||
        latest.subject ||
        "(No Subject)",
      normalizedSubject: key,
      messages: sorted,
      latestMessage: latest,
      firstMessage: first,
      participants,
      isRead,
      isStarred,
      hasAttachments,
      lastActivityAt:
        latest.createdAt ||
        latest.sentAt ||
        latest.receivedAt ||
        new Date().toISOString(),
    })
  }

  return threads.sort((a, b) => {
    const timeA = new Date(a.lastActivityAt).getTime()
    const timeB = new Date(b.lastActivityAt).getTime()
    return timeB - timeA
  })
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
    const hours = String(d.getHours()).padStart(2, "0")
    const minutes = String(d.getMinutes()).padStart(2, "0")
    return `${hours}:${minutes}`
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

function formatEmailDetailedDate(dateStr?: string | Date | null) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ""
  const now = new Date()

  // Format date and 24-hour time e.g. "Mon, Aug 31, 23:44" or "Mon, Aug 31, 2025, 23:44"
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" })
  const month = d.toLocaleDateString("en-US", { month: "short" })
  const day = d.getDate()
  const year = d.getFullYear()
  const currentYear = now.getFullYear()
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  const time = `${hours}:${minutes}`

  const datePart =
    year === currentYear
      ? `${weekday}, ${month} ${day}, ${time}`
      : `${weekday}, ${month} ${day}, ${year}, ${time}`

  // Calculate relative time string
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()

  let relativePart = ""
  if (isToday) {
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffMins < 2) {
      relativePart = "Just now"
    } else if (diffMins < 60) {
      relativePart = `${diffMins} mins ago`
    } else {
      relativePart = diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`
    }
  } else if (isYesterday) {
    relativePart = "Yesterday"
  } else {
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      relativePart = `${diffDays} days ago`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      relativePart = weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      relativePart = months === 1 ? "1 month ago" : `${months} months ago`
    } else {
      const years = Math.floor(diffDays / 365)
      relativePart = years === 1 ? "1 year ago" : `${years} years ago`
    }
  }

  return `${datePart} (${relativePart})`
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
  const { name: parsedName, email: cleanEmail } = parseSenderNameAndEmail(
    email,
    name
  )
  const finalName = (name && name.trim()) || parsedName

  if (finalName && cleanEmail) {
    const parts = finalName.trim().split(/\s+/)
    const initials =
      parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : finalName.slice(0, 2).toUpperCase()
    return { name: finalName, email: cleanEmail, initials }
  }
  if (cleanEmail) {
    const initials = cleanEmail.slice(0, 2).toUpperCase()
    return { name: cleanEmail, email: cleanEmail, initials }
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
    draftId?: string
    to?: string | string[]
    cc?: string | string[]
    bcc?: string | string[]
    subject?: string
    body?: string
    attachments?: any[]
    disableTo?: boolean
    disableSubject?: boolean
  }>({})

  // Account & folder cache key (partitioned by user for personal mailbox)
  const cacheKey = getEmailCacheKey(accountParam, folderParam, userEmail)

  // Zustand Store Integration
  const accountEmails = useEmailStore((s) => s.emailsByAccount[cacheKey])
  const emails = accountEmails ?? EMPTY_EMAILS
  const isFetchingEmails = useEmailStore((s) =>
    Boolean(s.isFetchingByAccount[cacheKey])
  )
  const hasInitialLoaded = useEmailStore((s) =>
    Boolean(s.hasInitialLoaded[cacheKey])
  )
  const storeFetchEmails = useEmailStore((s) => s.fetchEmails)
  const storeUpdateEmail = useEmailStore((s) => s.updateEmail)
  const storeDeleteEmails = useEmailStore((s) => s.deleteEmails)
  const fetchFolderCounts = useEmailStore((s) => s.fetchFolderCounts)
  const allFolderCounts = useEmailStore((s) => s.folderCounts)
  const folderCounts =
    allFolderCounts[accountParam.toLowerCase()] || EMPTY_COUNTS

  // Show skeleton loading state while fetching or before data is loaded
  const isLoadingEmails =
    isFetchingEmails || (!hasInitialLoaded && emails.length === 0)

  const [selectedThread, setSelectedThread] =
    React.useState<EmailThread | null>(null)
  const [expandedMessageIds, setExpandedMessageIds] = React.useState<
    Record<string, boolean>
  >({})
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(15)

  // Reset pagination when folder, account, or search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [folderParam, accountParam, searchQuery])

  // Mailbox Settings State
  const defaultDisplayName = React.useMemo(
    () =>
      currentAccount.id === "personal"
        ? user?.name || user?.email?.split("@")[0] || "User"
        : currentAccount.name,
    [currentAccount.id, currentAccount.name, user?.name, user?.email]
  )
  const defaultSignature = React.useMemo(
    () => `Best regards,\n${currentAccount.name}\n${currentAccount.email}`,
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

  // Fetch real emails from database API via Zustand store
  const fetchEmails = React.useCallback(async () => {
    fetchFolderCounts(userEmail)
    if (folderParam === "settings") return
    await storeFetchEmails(accountParam, folderParam, searchQuery, userEmail)
  }, [
    accountParam,
    folderParam,
    searchQuery,
    userEmail,
    storeFetchEmails,
    fetchFolderCounts,
  ])

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

  const threads = React.useMemo(() => {
    const allThreads = groupEmailsIntoThreads(emails)

    if (folderParam === "inbox") {
      return allThreads.filter((t) =>
        t.messages.some(
          (m) =>
            (m.folder === "INBOX" || m.direction === "INBOUND") &&
            !m.isTrash &&
            !m.isArchived
        )
      )
    }
    if (folderParam === "sent") {
      return allThreads.filter((t) =>
        t.messages.some(
          (m) =>
            (m.folder === "SENT" || m.direction === "OUTBOUND") &&
            !m.isTrash &&
            !m.isArchived
        )
      )
    }
    if (folderParam === "starred") {
      return allThreads.filter(
        (t) => t.isStarred && !t.messages.every((m) => m.isTrash)
      )
    }
    if (folderParam === "draft") {
      return allThreads.filter((t) =>
        t.messages.some((m) => m.folder === "DRAFT" && !m.isTrash)
      )
    }
    if (folderParam === "archive") {
      return allThreads.filter((t) =>
        t.messages.some((m) => m.isArchived || m.folder === "ARCHIVE")
      )
    }
    if (folderParam === "spam") {
      return allThreads.filter((t) =>
        t.messages.some((m) => m.folder === "SPAM" && !m.isTrash)
      )
    }
    if (folderParam === "trash") {
      return allThreads.filter((t) =>
        t.messages.some((m) => m.isTrash || m.folder === "TRASH")
      )
    }
    return allThreads
  }, [emails, folderParam])

  const filteredThreads = React.useMemo(() => {
    if (!searchQuery.trim()) return threads
    const q = searchQuery.toLowerCase()
    return threads.filter(
      (t) =>
        t.subject.toLowerCase().includes(q) ||
        t.participants.some(
          (p) =>
            p.email.toLowerCase().includes(q) ||
            (p.name && p.name.toLowerCase().includes(q))
        ) ||
        t.messages.some(
          (m) =>
            (m.preview && m.preview.toLowerCase().includes(q)) ||
            (m.bodyText && m.bodyText.toLowerCase().includes(q))
        )
    )
  }, [threads, searchQuery])

  // Pagination Calculations
  const totalItems = filteredThreads.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1
  const endIndex = Math.min(safeCurrentPage * pageSize, totalItems)

  const paginatedThreads = React.useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize
    return filteredThreads.slice(start, start + pageSize)
  }, [filteredThreads, safeCurrentPage, pageSize])

  // Email & Thread Actions
  const handleToggleStarThread = async (
    thread: EmailThread,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation()
    const nextStarred = !thread.isStarred
    // Optimistic update in Zustand store
    thread.messages.forEach((m) => {
      storeUpdateEmail(m.id, { isStarred: nextStarred })
    })

    if (selectedThread && selectedThread.threadId === thread.threadId) {
      setSelectedThread({
        ...selectedThread,
        isStarred: nextStarred,
        messages: selectedThread.messages.map((m) => ({
          ...m,
          isStarred: nextStarred,
        })),
      })
    }
    try {
      await Promise.all(
        thread.messages.map((m) =>
          fetch("/api/email", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: m.id, isStarred: nextStarred }),
          })
        )
      )
    } catch (err) {
      console.error("Failed to update star status", err)
    }
  }

  const handleToggleReadThread = async (
    thread: EmailThread,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation()
    const nextRead = !thread.isRead
    thread.messages.forEach((m) => {
      storeUpdateEmail(m.id, { isRead: nextRead })
    })

    if (selectedThread && selectedThread.threadId === thread.threadId) {
      setSelectedThread({
        ...selectedThread,
        isRead: nextRead,
        messages: selectedThread.messages.map((m) => ({
          ...m,
          isRead: nextRead,
        })),
      })
    }
    try {
      await Promise.all(
        thread.messages.map((m) =>
          fetch("/api/email", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: m.id, isRead: nextRead }),
          })
        )
      )
      fetchFolderCounts(userEmail)
      toast.success(nextRead ? "Marked as read" : "Marked as unread")
    } catch (err) {
      console.error("Failed to toggle read status", err)
      toast.error("Failed to update status")
    }
  }

  const handleArchiveThread = async (
    thread: EmailThread,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation()
    const isCurrentlyArchived =
      folderParam === "archive" || thread.messages.some((m) => m.isArchived)
    const nextArchived = !isCurrentlyArchived
    const nextFolder = nextArchived ? "ARCHIVE" : "INBOX"

    thread.messages.forEach((m) => {
      storeUpdateEmail(m.id, {
        isArchived: nextArchived,
        isTrash: false,
        folder: nextFolder,
      })
    })

    if (selectedThread?.threadId === thread.threadId) {
      setSelectedThread(null)
    }

    try {
      await Promise.all(
        thread.messages.map((m) =>
          fetch("/api/email", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: m.id,
              isArchived: nextArchived,
              isTrash: false,
              folder: nextFolder,
            }),
          })
        )
      )
      fetchFolderCounts(userEmail)
      toast.success(nextArchived ? "Conversation archived" : "Moved to Inbox")
    } catch (err) {
      console.error("Failed to archive conversation", err)
      toast.error("Failed to update conversation")
      fetchEmails()
    }
  }

  const handleTrashThread = async (
    thread: EmailThread,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation()
    const isCurrentlyTrash =
      folderParam === "trash" || thread.messages.some((m) => m.isTrash)
    const nextTrash = !isCurrentlyTrash
    const nextFolder = nextTrash ? "TRASH" : "INBOX"

    thread.messages.forEach((m) => {
      storeUpdateEmail(m.id, {
        isTrash: nextTrash,
        isArchived: false,
        folder: nextFolder,
      })
    })

    if (selectedThread?.threadId === thread.threadId) {
      setSelectedThread(null)
    }

    try {
      await Promise.all(
        thread.messages.map((m) =>
          fetch("/api/email", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: m.id,
              isTrash: nextTrash,
              isArchived: false,
              folder: nextFolder,
            }),
          })
        )
      )
      fetchFolderCounts(userEmail)
      toast.success(nextTrash ? "Moved to Trash" : "Restored to Inbox")
    } catch (err) {
      console.error("Failed to update trash status", err)
      toast.error("Failed to update conversation")
      fetchEmails()
    }
  }

  const handleSpamThread = async (
    thread: EmailThread,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation()
    const isCurrentlySpam =
      folderParam === "spam" || thread.messages.some((m) => m.folder === "SPAM")
    const nextFolder = isCurrentlySpam ? "INBOX" : "SPAM"

    thread.messages.forEach((m) => {
      storeUpdateEmail(m.id, {
        folder: nextFolder,
        isTrash: false,
        isArchived: false,
      })
    })

    if (selectedThread?.threadId === thread.threadId) {
      setSelectedThread(null)
    }

    try {
      await Promise.all(
        thread.messages.map((m) =>
          fetch("/api/email", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: m.id,
              folder: nextFolder,
              isTrash: false,
              isArchived: false,
            }),
          })
        )
      )
      fetchFolderCounts(userEmail)
      toast.success(
        nextFolder === "SPAM" ? "Reported as spam" : "Moved to Inbox"
      )
    } catch (err) {
      console.error("Failed to report spam", err)
      toast.error("Failed to update conversation")
      fetchEmails()
    }
  }

  const handleDeletePermanently = async (
    thread: EmailThread,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation()
    try {
      const msgIds = thread.messages.map((m) => m.id)
      storeDeleteEmails(msgIds)

      if (selectedThread?.threadId === thread.threadId) {
        setSelectedThread(null)
      }
      await Promise.all(
        thread.messages.map((m) =>
          fetch(`/api/email?id=${m.id}`, { method: "DELETE" })
        )
      )
      fetchFolderCounts(userEmail)
      toast.success("Conversation deleted permanently")
    } catch (err) {
      toast.error("Failed to delete conversation")
      fetchEmails()
    }
  }

  const handleThreadClick = (thread: EmailThread) => {
    // If standalone draft in draft folder with no previous conversation history, open compose directly
    const isStandaloneDraft =
      folderParam === "draft" &&
      thread.messages.length === 1 &&
      thread.messages[0].folder === "DRAFT"

    if (isStandaloneDraft) {
      const draftMsg = thread.messages[0]
      setComposeData({
        draftId: draftMsg.id,
        to: draftMsg.toEmails,
        cc: draftMsg.ccEmails,
        bcc: draftMsg.bccEmails,
        subject: draftMsg.subject === "(Draft)" ? "" : draftMsg.subject,
        body: draftMsg.bodyHtml || draftMsg.bodyText || "",
        attachments: draftMsg.attachments || [],
        disableTo: false,
        disableSubject: false,
      })
      setComposeOpen(true)
      return
    }

    setSelectedThread(thread)
    const initialExpanded: Record<string, boolean> = {}
    thread.messages.forEach((m, idx) => {
      initialExpanded[m.id] =
        idx === thread.messages.length - 1 || m.folder === "DRAFT"
    })
    setExpandedMessageIds(initialExpanded)

    const unreadMsgs = thread.messages.filter((m) => !m.isRead)
    if (unreadMsgs.length > 0) {
      // Optimistic mark read in Zustand store
      unreadMsgs.forEach((m) => {
        storeUpdateEmail(m.id, { isRead: true })
      })
      Promise.all(
        unreadMsgs.map((m) =>
          fetch("/api/email", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: m.id, isRead: true }),
          }).catch(console.error)
        )
      ).then(() => {
        fetchFolderCounts(userEmail)
      })
    }
  }

  const toggleMessageExpansion = (msgId: string) => {
    setExpandedMessageIds((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }))
  }

  const toggleExpandAll = () => {
    if (!selectedThread) return
    const allExpanded = selectedThread.messages.every(
      (m) => expandedMessageIds[m.id]
    )
    const nextState: Record<string, boolean> = {}
    selectedThread.messages.forEach((m, idx) => {
      nextState[m.id] = allExpanded
        ? idx === selectedThread.messages.length - 1
        : true
    })
    setExpandedMessageIds(nextState)
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
                draftId: undefined,
                to: "",
                cc: "",
                bcc: "",
                subject: "",
                body: "",
                disableTo: false,
                disableSubject: false,
              })
              setComposeOpen(true)
            }}
          >
            <Send className="size-4" />
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
              {EMAIL_FOLDERS.map((f) => {
                const count = folderCounts[f.slug] || 0
                const isInbox = f.slug === "inbox"
                const isDraft = f.slug === "draft"
                const isSpam = f.slug === "spam"
                const hasCount = count > 0 && f.slug !== "settings"

                return (
                  <TabsTrigger key={f.id} value={f.slug} className="capitalize">
                    {f.id === "inbox" && <Inbox className="mr-1.5 size-4" />}
                    {f.id === "starred" && (
                      <Star className="mr-1.5 size-4 fill-yellow-400 text-yellow-400" />
                    )}
                    {f.id === "sent" && <Send className="mr-1.5 size-4" />}
                    {f.id === "draft" && <FileText className="mr-1.5 size-4" />}
                    {f.id === "archive" && (
                      <Archive className="mr-1.5 size-4" />
                    )}
                    {f.id === "spam" && (
                      <ShieldAlert className="mr-1.5 size-4" />
                    )}
                    {f.id === "trash" && <Trash2 className="mr-1.5 size-4" />}
                    {f.id === "settings" && (
                      <Settings2 className="mr-1.5 size-4" />
                    )}
                    <span>{f.title}</span>

                    {hasCount && (
                      <span
                        className={cn(
                          "ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                          isInbox
                            ? "bg-primary text-primary-foreground"
                            : isDraft
                              ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                              : isSpam
                                ? "bg-destructive/20 text-destructive"
                                : "bg-muted text-muted-foreground"
                        )}
                      >
                        {count > 999 ? "999+" : count}
                      </span>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>

          <ComposeEmailDialog
            open={composeOpen}
            onOpenChange={setComposeOpen}
            mailbox={accountParam}
            fromEmail={currentAccount.email}
            fromName={currentAccount.name}
            draftId={composeData.draftId}
            initialTo={composeData.to}
            initialCc={composeData.cc}
            initialBcc={composeData.bcc}
            initialSubject={composeData.subject}
            initialBody={composeData.body}
            initialAttachments={composeData.attachments}
            disableTo={composeData.disableTo}
            disableSubject={composeData.disableSubject}
            signatureText={savedSignature}
            signatureImage={savedSignatureImage}
            signatureSize={savedSignatureSize}
            onDraftSaved={() => {
              fetchEmails()
            }}
            onEmailSent={() => {
              if (selectedThread) {
                selectedThread.messages.forEach((m) => {
                  storeUpdateEmail(m.id, { isRead: true })
                  fetch("/api/email", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: m.id, isRead: true }),
                  }).catch(console.error)
                })
              }
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
              <div className="flex max-w-md flex-1 items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={fetchEmails}
                  title="Refresh emails"
                  className="shrink-0"
                >
                  <RefreshCw
                    className={cn("size-4", isFetchingEmails && "animate-spin")}
                  />
                </Button>
                <div className="relative flex-1">
                  <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder={`Search ${folderParam}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 pl-9"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Header Mini Pagination */}
                {!isLoadingEmails && totalItems > 0 && (
                  <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                    <span>
                      {startIndex}–{endIndex} of {totalItems}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        disabled={safeCurrentPage <= 1}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        title="Previous page"
                        className="size-7"
                      >
                        <ChevronLeft className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        disabled={safeCurrentPage >= totalPages}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        title="Next page"
                        className="size-7"
                      >
                        <ChevronRight className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0">
            {isLoadingEmails ? (
              /* Skeleton Loading State */
              <div className="divide-y divide-border/60">
                {Array.from({ length: Math.min(pageSize, 8) }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4 p-4">
                    <Skeleton className="mt-0.5 size-4 shrink-0 rounded" />
                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-32 rounded sm:w-44" />
                          {i % 2 === 0 && (
                            <Skeleton className="h-4 w-7 rounded-full" />
                          )}
                        </div>
                        <Skeleton className="h-3.5 w-16 rounded" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-2/5 rounded" />
                        {i % 3 === 0 && (
                          <Skeleton className="size-3.5 rounded" />
                        )}
                      </div>
                      <Skeleton className="h-3.5 w-4/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                {folderParam === "starred" ? (
                  <Star className="mb-3 size-12 fill-yellow-400/20 stroke-[1.2] text-yellow-500/70" />
                ) : folderParam === "sent" ? (
                  <Send className="mb-3 size-12 stroke-[1.2] text-muted-foreground/50" />
                ) : folderParam === "draft" ? (
                  <FileText className="mb-3 size-12 stroke-[1.2] text-muted-foreground/50" />
                ) : folderParam === "archive" ? (
                  <Archive className="mb-3 size-12 stroke-[1.2] text-muted-foreground/50" />
                ) : folderParam === "spam" ? (
                  <ShieldAlert className="mb-3 size-12 stroke-[1.2] text-muted-foreground/50" />
                ) : folderParam === "trash" ? (
                  <Trash2 className="mb-3 size-12 stroke-[1.2] text-muted-foreground/50" />
                ) : (
                  <Inbox className="mb-3 size-12 stroke-[1.2] text-muted-foreground/50" />
                )}
                <p className="font-medium text-foreground">
                  {folderParam === "starred"
                    ? "No starred conversations"
                    : folderParam === "sent"
                      ? "No sent emails"
                      : folderParam === "draft"
                        ? "No draft emails"
                        : folderParam === "archive"
                          ? "No archived emails"
                          : folderParam === "spam"
                            ? "No spam emails"
                            : folderParam === "trash"
                              ? "Trash is empty"
                              : "No conversations found"}
                </p>
                <p className="text-xs">
                  {searchQuery
                    ? "Try adjusting your search criteria."
                    : folderParam === "starred"
                      ? "Star important conversations to find them quickly here."
                      : `Your ${folderParam} folder is empty.`}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {paginatedThreads.map((thread) => {
                  const isSentFolder = folderParam === "sent"
                  const messageCount = thread.messages.length

                  const senderNames = isSentFolder
                    ? thread.latestMessage.toEmails.join(", ")
                    : thread.participants
                        .map((p) => p.name || p.email)
                        .filter(Boolean)
                        .join(", ")

                  return (
                    <div
                      key={thread.threadId}
                      onClick={() => handleThreadClick(thread)}
                      className={cn(
                        "group flex cursor-pointer items-start gap-4 border-l-4 p-4 transition-all",
                        !thread.isRead && !isSentFolder
                          ? "border-l-indigo-600 bg-slate-100/90 hover:bg-slate-200/70 dark:border-l-indigo-400 dark:bg-slate-800/90 dark:hover:bg-slate-800"
                          : "border-l-transparent bg-card text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-2 pt-0.5">
                        {!thread.isRead && !isSentFolder && (
                          <span
                            className="size-2.5 shrink-0 rounded-full bg-indigo-600 ring-2 ring-indigo-500/25 dark:bg-indigo-400 dark:ring-indigo-400/30"
                            title="Unread"
                          />
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleToggleStarThread(thread, e)}
                          title={thread.isStarred ? "Unstar" : "Star"}
                        >
                          <Star
                            className={cn(
                              "size-4 transition-colors",
                              thread.isStarred
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/40 group-hover:text-muted-foreground"
                            )}
                          />
                        </button>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <span
                              className={cn(
                                "truncate text-sm",
                                !thread.isRead && !isSentFolder
                                  ? "font-bold text-slate-900 dark:text-white"
                                  : "font-normal text-muted-foreground"
                              )}
                            >
                              {senderNames || "(Unknown)"}
                            </span>
                            {messageCount > 1 && (
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                  !thread.isRead && !isSentFolder
                                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                <MessageSquare className="size-3" />
                                {messageCount}
                              </span>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <span
                              className={cn(
                                "shrink-0 text-xs transition-opacity group-hover:hidden",
                                !thread.isRead && !isSentFolder
                                  ? "font-semibold text-indigo-600 dark:text-indigo-400"
                                  : "text-muted-foreground"
                              )}
                            >
                              {formatEmailDate(thread.lastActivityAt)}
                            </span>

                            {/* Quick Row Actions on Hover */}
                            <div className="hidden items-center gap-1 group-hover:flex">
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={(e) =>
                                  handleToggleReadThread(thread, e)
                                }
                                title={
                                  thread.isRead
                                    ? "Mark as unread"
                                    : "Mark as read"
                                }
                                className="size-7 text-muted-foreground hover:text-foreground"
                              >
                                {thread.isRead ? (
                                  <Mail className="size-3.5" />
                                ) : (
                                  <MailOpen className="size-3.5" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={(e) => handleArchiveThread(thread, e)}
                                title={
                                  folderParam === "archive" ||
                                  thread.messages.some((m) => m.isArchived)
                                    ? "Move to Inbox"
                                    : "Archive"
                                }
                                className="size-7 text-muted-foreground hover:text-foreground"
                              >
                                <Archive className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={(e) => handleSpamThread(thread, e)}
                                title={
                                  folderParam === "spam" ||
                                  thread.messages.some(
                                    (m) => m.folder === "SPAM"
                                  )
                                    ? "Not spam / Move to Inbox"
                                    : "Report spam"
                                }
                                className="size-7 text-muted-foreground hover:text-foreground"
                              >
                                <ShieldAlert className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={(e) => handleTrashThread(thread, e)}
                                title={
                                  folderParam === "trash" ||
                                  thread.messages.some((m) => m.isTrash)
                                    ? "Restore to Inbox"
                                    : "Move to Trash"
                                }
                                className="size-7 text-muted-foreground hover:text-destructive"
                              >
                                {folderParam === "trash" ||
                                thread.messages.some((m) => m.isTrash) ? (
                                  <RotateCcw className="size-3.5" />
                                ) : (
                                  <Trash2 className="size-3.5" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-1 flex items-center gap-2 truncate text-sm">
                          {thread.messages.some(
                            (m) => m.folder === "DRAFT"
                          ) && (
                            <Badge
                              variant="outline"
                              className="h-4.5 shrink-0 border-amber-500/40 bg-amber-500/10 px-1.5 py-0 text-[10px] font-semibold text-amber-600 dark:text-amber-400"
                            >
                              Draft
                            </Badge>
                          )}
                          <span
                            className={cn(
                              "truncate",
                              !thread.isRead && !isSentFolder
                                ? "font-bold text-slate-900 dark:text-white"
                                : "font-normal text-muted-foreground"
                            )}
                          >
                            {thread.subject || "(No Subject)"}
                          </span>
                          {thread.hasAttachments && (
                            <Paperclip
                              className={cn(
                                "size-3.5 shrink-0",
                                !thread.isRead && !isSentFolder
                                  ? "text-slate-700 dark:text-slate-200"
                                  : "text-muted-foreground"
                              )}
                            />
                          )}
                        </div>

                        <p
                          className={cn(
                            "mt-0.5 truncate text-xs",
                            !thread.isRead && !isSentFolder
                              ? "font-medium text-slate-700 dark:text-slate-200"
                              : "text-muted-foreground/75"
                          )}
                        >
                          {thread.latestMessage.preview || "(No preview text)"}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>

          {/* Card Footer with Full Pagination Controls */}
          {!isLoadingEmails && totalItems > 0 && (
            <CardFooter className="flex flex-col gap-3 border-t bg-muted/10 p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {startIndex}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-foreground">
                    {endIndex}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {totalItems}
                  </span>{" "}
                  conversations
                </span>

                <div className="flex items-center gap-1.5 sm:ml-2">
                  <span className="text-muted-foreground">Rows per page:</span>
                  <div className="flex items-center gap-1 rounded-md border bg-background p-0.5">
                    {[10, 15, 25, 50].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setPageSize(size)
                          setCurrentPage(1)
                        }}
                        className={cn(
                          "rounded px-2 py-0.5 text-xs font-medium transition-colors",
                          pageSize === size
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage(1)}
                  title="First page"
                  className="size-7"
                >
                  <ChevronsLeft className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  title="Previous page"
                  className="size-7"
                >
                  <ChevronLeft className="size-3.5" />
                </Button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 5) return true
                      if (p === 1 || p === totalPages) return true
                      return Math.abs(p - safeCurrentPage) <= 1
                    })
                    .reduce((acc: (number | string)[], p, idx, arr) => {
                      if (
                        idx > 0 &&
                        (p as number) - (arr[idx - 1] as number) > 1
                      ) {
                        acc.push("...")
                      }
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, idx) =>
                      typeof p === "string" ? (
                        <span
                          key={`dots-${idx}`}
                          className="px-1 text-xs text-muted-foreground"
                        >
                          ...
                        </span>
                      ) : (
                        <Button
                          key={p}
                          variant={
                            safeCurrentPage === p ? "default" : "outline"
                          }
                          size="icon-xs"
                          onClick={() => setCurrentPage(p)}
                          className="size-7 text-xs"
                        >
                          {p}
                        </Button>
                      )
                    )}
                </div>

                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  title="Next page"
                  className="size-7"
                >
                  <ChevronRight className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  title="Last page"
                  className="size-7"
                >
                  <ChevronsRight className="size-3.5" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      )}

      {/* Conversation Threading Dialog (Full Chatting History with Open/Hide Style) */}
      <Dialog
        open={Boolean(selectedThread)}
        onOpenChange={(open) => !open && setSelectedThread(null)}
      >
        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-[780px]">
          {selectedThread &&
            (() => {
              const isAllExpanded = selectedThread.messages.every(
                (m) => expandedMessageIds[m.id]
              )
              const totalMessages = selectedThread.messages.length

              return (
                <>
                  {/* Conversation Header */}
                  <div className="shrink-0 space-y-3 border-b bg-background px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between gap-2 pr-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal capitalize"
                        >
                          {folderParam}
                        </Badge>
                        {selectedThread.isStarred && (
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-yellow-50 text-xs text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400"
                          >
                            <Star className="size-3 fill-current" />
                            Starred
                          </Badge>
                        )}
                        {totalMessages > 1 && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <MessageSquare className="size-3 text-primary" />
                            {totalMessages} messages in thread
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Toggle Star */}
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleToggleStarThread(selectedThread)}
                          title={selectedThread.isStarred ? "Unstar" : "Star"}
                          className="size-8 text-muted-foreground hover:text-foreground"
                        >
                          <Star
                            className={cn(
                              "size-4",
                              selectedThread.isStarred
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            )}
                          />
                        </Button>

                        {/* Mark Read / Unread */}
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleToggleReadThread(selectedThread)}
                          title={
                            selectedThread.isRead
                              ? "Mark as unread"
                              : "Mark as read"
                          }
                          className="size-8 text-muted-foreground hover:text-foreground"
                        >
                          {selectedThread.isRead ? (
                            <Mail className="size-4" />
                          ) : (
                            <MailOpen className="size-4" />
                          )}
                        </Button>

                        {/* Archive / Move to Inbox */}
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleArchiveThread(selectedThread)}
                          title={
                            folderParam === "archive" ||
                            selectedThread.messages.some((m) => m.isArchived)
                              ? "Move to Inbox"
                              : "Archive"
                          }
                          className="size-8 text-muted-foreground hover:text-foreground"
                        >
                          <Archive className="size-4" />
                        </Button>

                        {/* Report Spam / Not Spam */}
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleSpamThread(selectedThread)}
                          title={
                            folderParam === "spam" ||
                            selectedThread.messages.some(
                              (m) => m.folder === "SPAM"
                            )
                              ? "Not spam / Move to Inbox"
                              : "Report spam"
                          }
                          className="size-8 text-muted-foreground hover:text-foreground"
                        >
                          <ShieldAlert className="size-4" />
                        </Button>

                        {/* Move to Trash / Restore */}
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleTrashThread(selectedThread)}
                          title={
                            folderParam === "trash" ||
                            selectedThread.messages.some((m) => m.isTrash)
                              ? "Restore to Inbox"
                              : "Move to Trash"
                          }
                          className="size-8 text-muted-foreground hover:text-destructive"
                        >
                          {folderParam === "trash" ||
                          selectedThread.messages.some((m) => m.isTrash) ? (
                            <RotateCcw className="size-4" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>

                        {/* Permanent Delete when in Trash */}
                        {(folderParam === "trash" ||
                          selectedThread.messages.some((m) => m.isTrash)) && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() =>
                              handleDeletePermanently(selectedThread)
                            }
                            title="Delete permanently"
                            className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}

                        {totalMessages > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleExpandAll}
                            className="ml-1 h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <ChevronsUpDown className="size-3.5" />
                            <span>
                              {isAllExpanded ? "Collapse" : "Expand all"}
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>

                    <h2 className="text-lg leading-snug font-bold tracking-tight break-words text-foreground">
                      {selectedThread.subject || "(No Subject)"}
                    </h2>

                    {/* Participants list */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground/80">
                        Participants:
                      </span>
                      {selectedThread.participants.map((p, idx) => (
                        <span
                          key={p.email}
                          className="inline-flex items-center gap-1 rounded bg-muted/60 px-2 py-0.5"
                        >
                          <span className="font-medium text-foreground">
                            {p.name || p.email}
                          </span>
                          {p.name && (
                            <span className="text-[10px] text-muted-foreground">
                              &lt;{p.email}&gt;
                            </span>
                          )}
                          {idx < selectedThread.participants.length - 1 && ""}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Messages Timeline (Chatting History with Open/Hide Style) */}
                  <div className="flex-1 space-y-3 overflow-y-auto p-6">
                    {selectedThread.messages.map((msg) => {
                      const isExpanded = Boolean(expandedMessageIds[msg.id])
                      const party = parseEmailParty(msg.fromName, msg.fromEmail)
                      const isIncoming = msg.direction === "INBOUND"
                      const isDraft = msg.folder === "DRAFT"

                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "rounded-xl border transition-all duration-200",
                            isDraft
                              ? isExpanded
                                ? "border-amber-500/50 bg-amber-500/[0.04] shadow-sm ring-1 ring-amber-500/20"
                                : "cursor-pointer border-amber-500/30 bg-amber-500/[0.02] hover:border-amber-500/50 hover:bg-amber-500/[0.06]"
                              : isExpanded
                                ? "border-border bg-card shadow-sm"
                                : "cursor-pointer border-muted bg-muted/20 hover:border-primary/30 hover:bg-muted/40"
                          )}
                        >
                          {/* Message Bar / Header */}
                          <div
                            onClick={() => toggleMessageExpansion(msg.id)}
                            className={cn(
                              "flex cursor-pointer items-center justify-between gap-3 p-3.5 select-none",
                              isExpanded && "border-b bg-muted/10",
                              isDraft &&
                                isExpanded &&
                                "border-amber-500/20 bg-amber-500/10"
                            )}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <Avatar
                                className={cn(
                                  "size-8 shrink-0 border text-xs font-semibold",
                                  isDraft
                                    ? "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                    : "bg-primary/10 text-primary"
                                )}
                              >
                                <AvatarFallback
                                  className={cn(
                                    isDraft
                                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                      : "bg-primary/10 text-primary"
                                  )}
                                >
                                  {isDraft ? (
                                    <FileText className="size-3.5" />
                                  ) : (
                                    party.initials
                                  )}
                                </AvatarFallback>
                              </Avatar>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="truncate text-xs font-bold text-foreground">
                                    {isDraft
                                      ? "Draft Message"
                                      : msg.fromName || party.name}
                                  </span>
                                  {msg.fromEmail && !isDraft && (
                                    <span className="truncate text-[11px] text-muted-foreground">
                                      &lt;{msg.fromEmail}&gt;
                                    </span>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "h-4 px-1.5 py-0 text-[10px] font-normal",
                                      isDraft
                                        ? "border-amber-500/40 bg-amber-500/15 font-semibold text-amber-700 dark:text-amber-300"
                                        : isIncoming
                                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                    )}
                                  >
                                    {isDraft
                                      ? "Draft"
                                      : isIncoming
                                        ? "Received"
                                        : "Sent"}
                                  </Badge>
                                </div>

                                {!isExpanded && (
                                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                    {msg.preview || "(Empty content)"}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              {isDraft && (
                                <div className="flex items-center gap-1.5">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 gap-1 border-amber-500/40 bg-amber-500/10 px-2 text-[11px] font-semibold text-amber-700 hover:bg-amber-500/20 dark:text-amber-300"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setComposeData({
                                        draftId: msg.id,
                                        to: msg.toEmails,
                                        cc: msg.ccEmails,
                                        bcc: msg.bccEmails,
                                        subject:
                                          msg.subject === "(Draft)"
                                            ? ""
                                            : msg.subject,
                                        body:
                                          msg.bodyHtml || msg.bodyText || "",
                                        attachments: msg.attachments || [],
                                        disableTo: false,
                                        disableSubject: false,
                                      })
                                      setSelectedThread(null)
                                      setComposeOpen(true)
                                    }}
                                  >
                                    <Pencil className="size-3" />
                                    <span>Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    className="size-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                    onClick={async (e) => {
                                      e.stopPropagation()
                                      const deleteToast = toast.loading(
                                        "Discarding draft..."
                                      )
                                      try {
                                        storeDeleteEmails([msg.id])
                                        setSelectedThread((prev) =>
                                          prev
                                            ? {
                                                ...prev,
                                                messages: prev.messages.filter(
                                                  (m) => m.id !== msg.id
                                                ),
                                              }
                                            : null
                                        )
                                        await fetch(`/api/email?id=${msg.id}`, {
                                          method: "DELETE",
                                        })
                                        toast.dismiss(deleteToast)
                                        toast.success("Draft discarded")
                                        fetchEmails()
                                      } catch (err) {
                                        toast.dismiss(deleteToast)
                                        toast.error("Failed to discard draft")
                                      }
                                    }}
                                    title="Discard draft"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                </div>
                              )}
                              {msg.attachments &&
                                msg.attachments.length > 0 && (
                                  <div className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                    <Paperclip className="size-3" />
                                    <span className="text-[10px] font-medium">
                                      {msg.attachments.length}
                                    </span>
                                  </div>
                                )}
                              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                                {formatEmailDetailedDate(
                                  msg.sentAt || msg.createdAt
                                )}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="size-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="size-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>

                          {/* Expanded Message Content */}
                          {isExpanded && (
                            <div className="space-y-4 p-4">
                              {/* Recipient meta line & full timestamp */}
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                                <div>
                                  <span>to </span>
                                  <span className="font-medium text-foreground">
                                    {msg.toEmails.join(", ")}
                                  </span>
                                  {msg.ccEmails && msg.ccEmails.length > 0 && (
                                    <span className="ml-2">
                                      cc:{" "}
                                      <span className="font-medium text-foreground">
                                        {msg.ccEmails.join(", ")}
                                      </span>
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] font-medium text-muted-foreground">
                                  {formatEmailDetailedDate(
                                    msg.sentAt || msg.createdAt
                                  )}
                                </div>
                              </div>

                              {/* HTML or Text Body on Clean Canvas */}
                              <div className="rounded-xl border border-border/80 bg-white p-5 text-zinc-900 shadow-xs sm:p-6">
                                {msg.bodyHtml ? (
                                  <div
                                    className="email-content-view overflow-x-auto text-sm leading-relaxed text-zinc-900 [&_a]:text-blue-600 [&_a]:underline [&_img]:max-w-full [&_img]:rounded-md"
                                    dangerouslySetInnerHTML={{
                                      __html: msg.bodyHtml,
                                    }}
                                  />
                                ) : (
                                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-900">
                                    {msg.bodyText ||
                                      msg.preview ||
                                      "(Empty content)"}
                                  </div>
                                )}
                              </div>

                              {/* Attachments list with download */}
                              {msg.attachments &&
                                msg.attachments.length > 0 && (
                                  <div className="space-y-2 border-t pt-3">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                      <Paperclip className="size-3.5" />
                                      <span>
                                        Attachments ({msg.attachments.length})
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                      {msg.attachments.map((att) => (
                                        <div
                                          key={att.id}
                                          onClick={() =>
                                            handleDownloadFile(
                                              att.url,
                                              att.filename
                                            )
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
                                              handleDownloadFile(
                                                att.url,
                                                att.filename,
                                                e
                                              )
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
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Modal Footer with Actions (Reply / Forward / Archive / Trash) */}
                  <div className="flex shrink-0 flex-col gap-2 border-t bg-muted/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedThread(null)}
                      >
                        Close
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleArchiveThread(selectedThread)}
                        className="gap-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Archive className="size-3.5" />
                        <span>
                          {folderParam === "archive" ||
                          selectedThread.messages.some((m) => m.isArchived)
                            ? "Move to Inbox"
                            : "Archive"}
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTrashThread(selectedThread)}
                        className="gap-1.5 text-muted-foreground hover:text-destructive"
                      >
                        {folderParam === "trash" ||
                        selectedThread.messages.some((m) => m.isTrash) ? (
                          <>
                            <RotateCcw className="size-3.5" />
                            <span>Restore to Inbox</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="size-3.5" />
                            <span>Move to Trash</span>
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const latest = selectedThread.latestMessage
                          const fwdSubject = latest.subject.startsWith("Fwd:")
                            ? latest.subject
                            : `Fwd: ${selectedThread.subject}`
                          const fwdBody = `<br/><br/>---------- Forwarded conversation ---------<br/>${selectedThread.messages
                            .map(
                              (m) =>
                                `<br/><strong>From:</strong> ${m.fromName ? `${m.fromName} &lt;${m.fromEmail}&gt;` : m.fromEmail}<br/><strong>Date:</strong> ${formatEmailDetailedDate(m.sentAt || m.createdAt)}<br/><strong>Subject:</strong> ${m.subject}<br/><strong>To:</strong> ${m.toEmails.join(", ")}<br/><br/>${m.bodyHtml || m.preview}`
                            )
                            .join("<hr/>")}`

                          setComposeData({
                            to: "",
                            subject: fwdSubject,
                            body: fwdBody,
                            disableTo: false,
                            disableSubject: true,
                          })
                          setSelectedThread(null)
                          setComposeOpen(true)
                        }}
                        className="gap-1.5"
                      >
                        <Forward className="size-4" />
                        <span>Forward</span>
                      </Button>

                      {(() => {
                        const pendingDraft = selectedThread.messages.find(
                          (m) => m.folder === "DRAFT"
                        )
                        if (pendingDraft) {
                          return (
                            <Button
                              onClick={() => {
                                setComposeData({
                                  draftId: pendingDraft.id,
                                  to: pendingDraft.toEmails,
                                  cc: pendingDraft.ccEmails,
                                  bcc: pendingDraft.bccEmails,
                                  subject:
                                    pendingDraft.subject === "(Draft)"
                                      ? ""
                                      : pendingDraft.subject,
                                  body:
                                    pendingDraft.bodyHtml ||
                                    pendingDraft.bodyText ||
                                    "",
                                  attachments: pendingDraft.attachments || [],
                                  disableTo: false,
                                  disableSubject: false,
                                })
                                setSelectedThread(null)
                                setComposeOpen(true)
                              }}
                              className="btn-gradient gap-1.5"
                            >
                              <Pencil className="size-4" />
                              <span>Continue Draft</span>
                            </Button>
                          )
                        }

                        return (
                          <Button
                            onClick={() => {
                              const latest = selectedThread.latestMessage
                              const isFromUs =
                                latest.fromEmail
                                  .toLowerCase()
                                  .includes(
                                    currentAccount.email.toLowerCase()
                                  ) || latest.direction === "OUTBOUND"
                              const replyTo = isFromUs
                                ? latest.toEmails.find(
                                    (e) =>
                                      !e
                                        .toLowerCase()
                                        .includes(
                                          currentAccount.email.toLowerCase()
                                        )
                                  ) ||
                                  latest.toEmails[0] ||
                                  ""
                                : latest.fromEmail

                              const replySubject = latest.subject.startsWith(
                                "Re:"
                              )
                                ? latest.subject
                                : `Re: ${selectedThread.subject}`
                              const replyBody = "" // Clean blank editor area like Gmail

                              setComposeData({
                                draftId: undefined,
                                to: replyTo,
                                subject: replySubject,
                                body: replyBody,
                                disableTo: true,
                                disableSubject: true,
                              })
                              setSelectedThread(null)
                              setComposeOpen(true)
                            }}
                            className="btn-gradient gap-1.5"
                          >
                            <Reply className="size-4" />
                            <span>Reply</span>
                          </Button>
                        )
                      })()}
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
