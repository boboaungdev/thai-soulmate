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
import { Switch } from "@/components/ui/switch"

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
          <Card>
            <CardHeader>
              <CardTitle>Mailbox Configuration</CardTitle>
              <CardDescription>
                Account settings and server routing for {currentAccount.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  defaultValue={`Thai Soulmate (${currentAccount.name})`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-addr">Email Address</Label>
                <Input
                  id="email-addr"
                  defaultValue={currentAccount.email}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reply-to">Reply-To Address</Label>
                <Input
                  id="reply-to"
                  defaultValue={currentAccount.email}
                  placeholder="reply-to@thaisoulmate.org"
                />
              </div>

              <div className="pt-2">
                <Button className="gap-1.5">
                  <Save className="size-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications & Automation</CardTitle>
              <CardDescription>
                Configure incoming notifications and automated replies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Forwarding</Label>
                  <p className="text-xs text-muted-foreground">
                    Forward incoming customer inquiries to support staff
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Responder</Label>
                  <p className="text-xs text-muted-foreground">
                    Send an automatic confirmation email when received
                  </p>
                </div>
                <Switch />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature">Email Signature</Label>
                <Textarea
                  id="signature"
                  rows={4}
                  defaultValue={`Best regards,\nThai Soulmate Team\n${currentAccount.email}\nhttps://thaisoulmate.org`}
                />
              </div>
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

          <div className="py-4 text-sm leading-relaxed whitespace-pre-wrap">
            {selectedEmail?.preview}
            {"\n\n"}
            Thank you for choosing Thai Soulmate! Please feel free to reach out
            if you require any additional assistance.
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
