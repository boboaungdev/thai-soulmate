"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Trash2,
  Maximize2,
  Minimize2,
  X,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link as LinkIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FileText,
  File,
  Check,
  ChevronDown,
  ChevronUp,
  Lock,
  AlertCircle,
  PenLine,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface AttachedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  previewUrl?: string
}

export const EMAIL_REGEX = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/

export interface TagEmailInputProps {
  value: string[]
  onChange: (emails: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  inputClassName?: string
  badgeVariant?: "default" | "secondary" | "outline"
  validateEmail?: (email: string) => string | null
  onInvalidEmail?: (email: string, reason: string) => void
  disallowedEmails?: string[]
  id?: string
  name?: string
  autoFocus?: boolean
  maxEmails?: number
}

export function extractCleanEmail(input: string): string {
  if (!input) return ""
  const match = input.match(/<([^>]+)>/)
  if (match && match[1]) {
    return match[1].trim()
  }
  return input.trim()
}

export function parseEmailsFromInput(input?: string | string[]): string[] {
  if (!input) return []
  if (Array.isArray(input)) {
    return input.map(extractCleanEmail).filter(Boolean)
  }

  const str = input.trim()
  if (!str) return []

  const angleBracketMatches = [...str.matchAll(/<([^>]+)>/g)]
  if (angleBracketMatches.length > 0) {
    return angleBracketMatches.map((m) => m[1].trim()).filter(Boolean)
  }

  return str
    .split(/[,\s;]+/)
    .map((e) => extractCleanEmail(e))
    .filter(Boolean)
}

export function TagEmailInput({
  value = [],
  onChange,
  placeholder = "Enter email and press comma or space...",
  disabled = false,
  className,
  inputClassName,
  badgeVariant = "secondary",
  validateEmail,
  onInvalidEmail,
  disallowedEmails = [],
  id,
  autoFocus = false,
  maxEmails,
}: TagEmailInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [inputError, setInputError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const normalizeEmail = (email: string) => email.trim().toLowerCase()

  const addEmails = React.useCallback(
    (rawEmails: string[]) => {
      if (disabled) return
      let newEmails = [...value]
      let errorEncountered: string | null = null

      for (const raw of rawEmails) {
        const email = extractCleanEmail(raw)
        if (!email) continue

        // Check format
        if (!EMAIL_REGEX.test(email)) {
          errorEncountered = `"${email}" is not a valid email address.`
          onInvalidEmail?.(email, "invalid_format")
          continue
        }

        const normalized = normalizeEmail(email)

        // Check duplicate
        if (newEmails.some((e) => normalizeEmail(e) === normalized)) {
          continue
        }

        // Check disallowed
        if (disallowedEmails.some((d) => normalizeEmail(d) === normalized)) {
          errorEncountered = `"${email}" cannot be used.`
          onInvalidEmail?.(email, "disallowed")
          continue
        }

        // Custom validator
        if (validateEmail) {
          const customError = validateEmail(email)
          if (customError) {
            errorEncountered = customError
            onInvalidEmail?.(email, "custom_validation")
            continue
          }
        }

        // Check max
        if (maxEmails && newEmails.length >= maxEmails) {
          errorEncountered = `Maximum ${maxEmails} email addresses allowed.`
          break
        }

        newEmails.push(email)
      }

      setInputError(errorEncountered)
      if (newEmails.length !== value.length) {
        onChange(newEmails)
      }
    },
    [
      value,
      disabled,
      disallowedEmails,
      validateEmail,
      maxEmails,
      onChange,
      onInvalidEmail,
    ]
  )

  const removeEmail = (indexToRemove: number) => {
    if (disabled) return
    const updated = value.filter((_, idx) => idx !== indexToRemove)
    onChange(updated)
    setInputError(null)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (
      e.key === "," ||
      e.key === " " ||
      e.key === "Enter" ||
      e.key === "Tab"
    ) {
      if (inputValue.trim()) {
        e.preventDefault()
        addEmails([inputValue])
        setInputValue("")
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      e.preventDefault()
      removeEmail(value.length - 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    if (!pastedText) return

    const tokens = parseEmailsFromInput(pastedText)
    if (tokens.length > 0) {
      addEmails(tokens)
      setInputValue("")
    }
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      addEmails([inputValue])
      setInputValue("")
    }
  }

  return (
    <div className="w-full space-y-1.5">
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          disabled &&
            "cursor-not-allowed bg-muted/40 text-muted-foreground opacity-90",
          inputError && "border-destructive focus-within:ring-destructive/20",
          className
        )}
      >
        {/* Rendered Email Badges */}
        {value.map((email, idx) => (
          <Badge
            key={`${email}-${idx}`}
            variant={badgeVariant}
            className={cn(
              "flex h-6 items-center gap-1 pr-1 pl-2 text-xs font-normal transition-all",
              disabled && "pr-2 opacity-80"
            )}
          >
            <span className="max-w-[200px] truncate sm:max-w-[280px]">
              {email}
            </span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeEmail(idx)
                }}
                className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-hidden"
                aria-label={`Remove ${email}`}
              >
                <X className="size-3" />
              </button>
            )}
          </Badge>
        ))}

        {/* Text input for typing new emails */}
        {!disabled && (
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => {
              const val = e.target.value
              if (val.includes(",") || val.includes(" ") || val.includes(";")) {
                const parts = val.split(/[,\s;]+/).filter(Boolean)
                if (parts.length > 0) {
                  addEmails(parts)
                  setInputValue("")
                  return
                }
              }
              setInputValue(val)
              if (inputError) setInputError(null)
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={handleBlur}
            placeholder={value.length === 0 ? placeholder : ""}
            autoFocus={autoFocus}
            className={cn(
              "min-w-[120px] flex-1 bg-transparent px-1 py-0.5 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed",
              inputClassName
            )}
          />
        )}
      </div>

      {/* Inline validation error note */}
      {inputError && (
        <div className="flex items-center gap-1 px-1 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{inputError}</span>
        </div>
      )}
    </div>
  )
}

interface ComposeEmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fromEmail: string
  fromName?: string
  initialTo?: string | string[]
  initialSubject?: string
  initialBody?: string
  disableTo?: boolean
  signatureText?: string
  signatureImage?: string | null
  signatureSize?: "sm" | "md" | "lg"
  onEmailSent?: (emailData: {
    to: string
    cc?: string
    bcc?: string
    subject: string
    bodyHtml: string
    attachments: AttachedFile[]
  }) => void
}

export function ComposeEmailDialog({
  open,
  onOpenChange,
  fromEmail,
  fromName,
  initialTo = "",
  initialSubject = "",
  initialBody = "",
  disableTo = false,
  signatureText = "",
  signatureImage = null,
  signatureSize = "md",
  onEmailSent,
}: ComposeEmailDialogProps) {
  const [toEmails, setToEmails] = React.useState<string[]>(() =>
    parseEmailsFromInput(initialTo)
  )
  const [showCc, setShowCc] = React.useState(false)
  const [showBcc, setShowBcc] = React.useState(false)
  const [ccEmails, setCcEmails] = React.useState<string[]>([])
  const [bccEmails, setBccEmails] = React.useState<string[]>([])
  const [subject, setSubject] = React.useState(initialSubject)
  const [attachments, setAttachments] = React.useState<AttachedFile[]>([])
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [isSending, setIsSending] = React.useState(false)
  const [showFormatting, setShowFormatting] = React.useState(true)
  const [showDiscardAlert, setShowDiscardAlert] = React.useState(false)
  const [includeSignature, setIncludeSignature] = React.useState(true)

  const hasSignatureConfigured = Boolean(
    signatureText?.trim() || signatureImage
  )

  const editorRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const imageInputRef = React.useRef<HTMLInputElement>(null)

  // Initialize body text & emails when opened or changed
  React.useEffect(() => {
    if (open) {
      setToEmails(parseEmailsFromInput(initialTo))
      setCcEmails([])
      setBccEmails([])
      setSubject(initialSubject)
      setIncludeSignature(true)
      if (editorRef.current) {
        editorRef.current.innerHTML = initialBody || ""
      }
    }
  }, [open, initialTo, initialSubject, initialBody])

  const formatDoc = (cmd: string, value: string | undefined = undefined) => {
    if (typeof document !== "undefined") {
      document.execCommand(cmd, false, value)
      editorRef.current?.focus()
    }
  }

  const handleAddLink = () => {
    const url = prompt("Enter the URL (e.g. https://thaisoulmate.org):")
    if (url) {
      const validUrl = url.startsWith("http") ? url : `https://${url}`
      formatDoc("createLink", validUrl)
    }
  }

  const insertImageToEditor = (src: string, alt: string = "image") => {
    if (!editorRef.current) return
    editorRef.current.focus()

    const imgHtml = `<div><img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0; border: 1px solid rgba(128,128,128,0.2);" /></div><div><br/></div>`

    if (typeof document !== "undefined") {
      const selection = window.getSelection()
      if (
        selection &&
        selection.rangeCount > 0 &&
        editorRef.current.contains(selection.anchorNode)
      ) {
        document.execCommand("insertHTML", false, imgHtml)
      } else {
        editorRef.current.innerHTML += imgHtml
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const files = Array.from(e.target.files)

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const src = event.target?.result as string
        if (src) {
          insertImageToEditor(src, file.name)
        }
      }
      reader.readAsDataURL(file)
    })

    toast.success(
      `Inserted ${files.length} image${files.length > 1 ? "s" : ""} into email body`
    )
    e.target.value = ""
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile()
        if (blob) {
          e.preventDefault()
          const reader = new FileReader()
          reader.onload = (event) => {
            const src = event.target?.result as string
            if (src) {
              insertImageToEditor(src, "pasted-image")
            }
          }
          reader.readAsDataURL(blob)
          toast.success("Image pasted into email body")
          return
        }
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const newFiles: AttachedFile[] = Array.from(e.target.files).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }))

    setAttachments((prev) => [...prev, ...newFiles])
    toast.success(
      `Attached ${newFiles.length} file${newFiles.length > 1 ? "s" : ""}`
    )
    e.target.value = ""
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const handleSend = async () => {
    if (toEmails.length === 0) {
      toast.error("Please provide at least one recipient email address.")
      return
    }

    setIsSending(true)

    // Simulate sending email
    await new Promise((res) => setTimeout(res, 800))

    let bodyHtml = editorRef.current?.innerHTML || ""

    if (includeSignature && hasSignatureConfigured) {
      const heightPx =
        signatureSize === "sm" ? 36 : signatureSize === "lg" ? 64 : 48
      const imgTag = signatureImage
        ? `<img src="${signatureImage}" style="max-height:${heightPx}px; height:auto; border-radius:4px; display:inline-block; margin:6px 0;" alt="Signature" />`
        : ""
      const lines = (signatureText || "").split("\n")
      const greeting = lines[0] || "Best regards,"
      const rest = lines.slice(1).join("<br/>")
      const sigHtml = `${greeting}<br/>${imgTag}${rest ? `<br/>${rest}` : ""}`
      bodyHtml = `${bodyHtml}<br/><br/>${sigHtml}`
    }

    const toFormatted = toEmails.join(", ")

    onEmailSent?.({
      to: toFormatted,
      cc: showCc && ccEmails.length > 0 ? ccEmails.join(", ") : undefined,
      bcc: showBcc && bccEmails.length > 0 ? bccEmails.join(", ") : undefined,
      subject: subject || "(No Subject)",
      bodyHtml,
      attachments,
    })

    toast.success(`Email successfully sent to ${toFormatted}!`)

    // Clean up
    setIsSending(false)
    setToEmails([])
    setCcEmails([])
    setBccEmails([])
    setSubject("")
    setAttachments([])
    if (editorRef.current) {
      editorRef.current.innerHTML = ""
    }
    onOpenChange(false)
  }

  const hasUnsavedContent = () => {
    const hasTo = toEmails.length > 0
    const hasSubject = Boolean(subject && subject.trim())
    const hasCc = ccEmails.length > 0
    const hasBcc = bccEmails.length > 0
    const hasText = Boolean(
      editorRef.current?.innerText &&
      editorRef.current.innerText.trim().length > 0
    )
    const hasImages = Boolean(editorRef.current?.querySelector("img") !== null)
    const hasAttachments = attachments.length > 0

    return (
      hasTo ||
      hasSubject ||
      hasCc ||
      hasBcc ||
      hasText ||
      hasImages ||
      hasAttachments
    )
  }

  const forceClose = () => {
    setToEmails([])
    setCcEmails([])
    setBccEmails([])
    setSubject("")
    setAttachments([])
    if (editorRef.current) {
      editorRef.current.innerHTML = ""
    }
    setShowDiscardAlert(false)
    onOpenChange(false)
  }

  const handleAttemptClose = () => {
    if (hasUnsavedContent()) {
      setShowDiscardAlert(true)
    } else {
      forceClose()
    }
  }

  const handleDiscard = () => {
    handleAttemptClose()
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleAttemptClose()
          } else {
            onOpenChange(true)
          }
        }}
      >
        <DialogContent
          className={cn(
            "flex flex-col gap-0 overflow-hidden p-0 shadow-2xl transition-all duration-200 [&>button]:hidden",
            isFullScreen
              ? "fixed inset-2 !h-[calc(100vh-1rem)] !max-w-[calc(100vw-1rem)] rounded-xl"
              : "h-[680px] max-h-[90vh] rounded-xl sm:max-w-[720px]"
          )}
        >
          {/* Custom Modal Top Header */}
          <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3 select-none">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">New Message</span>
              <Badge
                variant="outline"
                className="h-5 py-0 text-[11px] font-normal"
              >
                From: {fromEmail}
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="size-7 text-muted-foreground hover:text-foreground"
                title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullScreen ? (
                  <Minimize2 className="size-3.5" />
                ) : (
                  <Maximize2 className="size-3.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDiscard}
                className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:text-foreground"
                title="Close"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Recipients & Subject Bar */}
          <div className="flex flex-col divide-y border-b bg-background text-sm">
            {/* To Field */}
            <div className="flex items-start gap-2 px-4 py-1.5">
              <Label
                htmlFor="email-to"
                className="flex w-14 shrink-0 items-center gap-1 pt-1.5 text-xs font-medium text-muted-foreground"
              >
                <span>To</span>
                {disableTo && (
                  <Lock className="size-3 text-muted-foreground/70" />
                )}
              </Label>
              <div className="min-w-0 flex-1">
                <TagEmailInput
                  id="email-to"
                  value={toEmails}
                  onChange={setToEmails}
                  placeholder="recipient@example.com (comma or space to add)"
                  disabled={disableTo}
                  className="min-h-7 border-0 p-0 shadow-none focus-within:ring-0"
                />
              </div>
              {!disableTo && (
                <div className="flex items-center gap-1 pt-1 text-xs text-muted-foreground">
                  {!showCc && (
                    <button
                      type="button"
                      onClick={() => setShowCc(true)}
                      className="rounded px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      Cc
                    </button>
                  )}
                  {!showBcc && (
                    <button
                      type="button"
                      onClick={() => setShowBcc(true)}
                      className="rounded px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      Bcc
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Cc Field (Optional) */}
            {showCc && (
              <div className="flex animate-in items-start gap-2 bg-muted/10 px-4 py-1.5 duration-150 fade-in-50">
                <Label
                  htmlFor="email-cc"
                  className="w-14 shrink-0 pt-1.5 text-xs font-medium text-muted-foreground"
                >
                  Cc
                </Label>
                <div className="min-w-0 flex-1">
                  <TagEmailInput
                    id="email-cc"
                    value={ccEmails}
                    onChange={setCcEmails}
                    placeholder="cc@example.com (comma or space to add)"
                    className="min-h-7 border-0 p-0 shadow-none focus-within:ring-0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowCc(false)
                    setCcEmails([])
                  }}
                  className="p-1 pt-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}

            {/* Bcc Field (Optional) */}
            {showBcc && (
              <div className="flex animate-in items-start gap-2 bg-muted/10 px-4 py-1.5 duration-150 fade-in-50">
                <Label
                  htmlFor="email-bcc"
                  className="w-14 shrink-0 pt-1.5 text-xs font-medium text-muted-foreground"
                >
                  Bcc
                </Label>
                <div className="min-w-0 flex-1">
                  <TagEmailInput
                    id="email-bcc"
                    value={bccEmails}
                    onChange={setBccEmails}
                    placeholder="bcc@example.com (comma or space to add)"
                    className="min-h-7 border-0 p-0 shadow-none focus-within:ring-0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowBcc(false)
                    setBccEmails([])
                  }}
                  className="p-1 pt-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}

            {/* Subject Field */}
            <div className="flex items-center gap-2 px-4 py-1.5">
              <Label
                htmlFor="email-subject"
                className="w-14 shrink-0 text-xs font-medium text-muted-foreground"
              >
                Subject
              </Label>
              <Input
                id="email-subject"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-8 flex-1 border-0 px-2 text-sm font-medium shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Text Formatting Toolbar */}
          {showFormatting && (
            <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-3 py-1.5 text-muted-foreground select-none">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => formatDoc("bold")}
                className="size-7 hover:bg-muted hover:text-foreground"
                title="Bold (Ctrl+B)"
              >
                <Bold className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => formatDoc("italic")}
                className="size-7 hover:bg-muted hover:text-foreground"
                title="Italic (Ctrl+I)"
              >
                <Italic className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => formatDoc("underline")}
                className="size-7 hover:bg-muted hover:text-foreground"
                title="Underline (Ctrl+U)"
              >
                <UnderlineIcon className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => formatDoc("strikeThrough")}
                className="size-7 hover:bg-muted hover:text-foreground"
                title="Strikethrough"
              >
                <Strikethrough className="size-3.5" />
              </Button>

              <Separator orientation="vertical" className="mx-1 h-4" />

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => formatDoc("insertUnorderedList")}
                className="size-7 hover:bg-muted hover:text-foreground"
                title="Bulleted list"
              >
                <List className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => formatDoc("insertOrderedList")}
                className="size-7 hover:bg-muted hover:text-foreground"
                title="Numbered list"
              >
                <ListOrdered className="size-3.5" />
              </Button>

              <Separator orientation="vertical" className="mx-1 h-4" />

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => formatDoc("justifyLeft")}
                className="size-7 hover:bg-muted hover:text-foreground"
                title="Align Left"
              >
                <AlignLeft className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => formatDoc("justifyCenter")}
                className="size-7 hover:bg-muted hover:text-foreground"
                title="Align Center"
              >
                <AlignCenter className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => formatDoc("justifyRight")}
                className="size-7 hover:bg-muted hover:text-foreground"
                title="Align Right"
              >
                <AlignRight className="size-3.5" />
              </Button>

              <Separator orientation="vertical" className="mx-1 h-4" />

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleAddLink}
                className="size-7 hover:bg-muted hover:text-foreground"
                title="Insert Link"
              >
                <LinkIcon className="size-3.5" />
              </Button>
            </div>
          )}

          {/* WYSIWYG Message Body Editor */}
          <div className="relative flex flex-1 flex-col overflow-y-auto bg-background p-4 focus-within:outline-none">
            <div
              ref={editorRef}
              contentEditable
              role="textbox"
              aria-multiline="true"
              data-placeholder="Write your email here..."
              className={cn(
                "min-h-[140px] w-full flex-1 text-sm leading-relaxed whitespace-pre-wrap outline-none",
                "empty:before:pointer-events-none empty:before:text-muted-foreground/60 empty:before:content-[attr(data-placeholder)]",
                "[&_a]:text-primary [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5",
                "[&_img]:my-2 [&_img]:inline-block [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_img]:shadow-xs"
              )}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                // Standard keyboard shortcuts
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />

            {/* Pinned Live Signature Preview Box at Bottom of Editor */}
            {hasSignatureConfigured && includeSignature && (
              <div className="mt-4 animate-in rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3 text-xs duration-150 fade-in-50 select-none">
                <div className="mb-1.5 flex items-center justify-between border-b border-primary/10 pb-1">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                    <PenLine className="size-3.5" />
                    Email Signature Attached
                  </span>
                  <button
                    type="button"
                    onClick={() => setIncludeSignature(false)}
                    className="text-[10px] text-muted-foreground transition-colors hover:text-destructive"
                  >
                    Remove from this email
                  </button>
                </div>
                <div className="font-sans leading-relaxed text-foreground">
                  {(() => {
                    const heightClass =
                      signatureSize === "sm"
                        ? "h-8 max-h-8"
                        : signatureSize === "lg"
                          ? "h-14 max-h-14"
                          : "h-10 max-h-10"

                    const lines = (signatureText || "").split("\n")
                    const greeting = lines[0] || "Best regards,"
                    const rest = lines.slice(1)

                    return (
                      <div>
                        <div className="font-medium text-foreground">
                          {greeting}
                        </div>
                        {signatureImage && (
                          <div className="my-1.5">
                            <img
                              src={signatureImage}
                              alt="Signature"
                              className={cn(
                                "rounded object-contain",
                                heightClass
                              )}
                            />
                          </div>
                        )}
                        {rest.length > 0 && (
                          <div className="whitespace-pre-line text-muted-foreground">
                            {rest.join("\n")}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Signature Not Included Banner */}
            {hasSignatureConfigured && !includeSignature && (
              <div className="mt-3 flex items-center justify-between rounded-md border border-dashed bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <PenLine className="size-3.5 opacity-50" />
                  Signature not included
                </span>
                <button
                  type="button"
                  onClick={() => setIncludeSignature(true)}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  + Insert Signature
                </button>
              </div>
            )}
          </div>

          {/* Attachment Preview Tray */}
          {attachments.length > 0 && (
            <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto border-t bg-muted/20 px-4 py-2">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="group flex items-center gap-2 rounded-md border bg-background py-1 pr-1.5 pl-2 text-xs shadow-xs transition-colors hover:border-foreground/30"
                >
                  {att.type.includes("pdf") ? (
                    <FileText className="size-4 shrink-0 text-red-500" />
                  ) : (
                    <File className="size-4 shrink-0 text-blue-500" />
                  )}

                  <div className="flex max-w-[140px] flex-col truncate">
                    <span className="truncate font-medium">{att.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatFileSize(att.size)}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveAttachment(att.id)}
                    className="ml-1 size-5 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Remove attachment"
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-between border-t bg-muted/40 px-4 py-3">
            {/* Send & Attachment Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSend}
                disabled={isSending}
                className="btn-gradient gap-2 px-4 shadow-sm"
              >
                <Send className="size-4" />
                <span>{isSending ? "Sending..." : "Send"}</span>
              </Button>

              {/* Hidden file & image inputs */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => fileInputRef.current?.click()}
                title="Attach files (PDF, DOCX, ZIP, etc.)"
                className="size-8 text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="size-4" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => imageInputRef.current?.click()}
                title="Insert images (PNG, JPG, WebP)"
                className="size-8 text-muted-foreground hover:text-foreground"
              >
                <ImageIcon className="size-4" />
              </Button>

              {/* Insert Signature Toggle Button */}
              {hasSignatureConfigured && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setIncludeSignature(!includeSignature)}
                  title={
                    includeSignature
                      ? "Signature attached (click to remove)"
                      : "Insert email signature"
                  }
                  className={cn(
                    "relative size-8 text-muted-foreground transition-colors hover:text-foreground",
                    includeSignature &&
                      "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                  )}
                >
                  <PenLine className="size-4" />
                  {includeSignature && (
                    <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary" />
                  )}
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowFormatting(!showFormatting)}
                title="Toggle formatting options"
                className={cn(
                  "size-8 text-muted-foreground hover:text-foreground",
                  showFormatting && "bg-muted text-foreground"
                )}
              >
                <span className="font-serif text-xs font-bold underline">
                  A
                </span>
              </Button>
            </div>

            {/* Discard & Status */}
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground select-none sm:inline">
                Press Ctrl+Enter to send
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleDiscard}
                className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                title="Discard draft"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shadcn UI Alert Dialog for Discard Confirmation */}
      <AlertDialog open={showDiscardAlert} onOpenChange={setShowDiscardAlert}>
        <AlertDialogContent className="sm:max-w-[420px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Discard email draft?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved text or attachments in this email draft. If you
              discard now, your message will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDiscardAlert(false)}>
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={forceClose}>
              Discard Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
