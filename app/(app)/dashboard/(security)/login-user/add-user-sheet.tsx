"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  User,
  Mail,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Users2, // Icon for STAFF
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { isDisallowedEmail } from "@/constants/email"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AvatarUploadInput } from "@/components/avatar-upload-input"
import { FaUserShield } from "react-icons/fa"

const Role = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  MEMBER: "MEMBER",
} as const

type Role = (typeof Role)[keyof typeof Role]

// Map roles to icons
const roleIcons: Record<Role, React.ElementType> = {
  [Role.ADMIN]: Shield,
  [Role.STAFF]: Users2,
  [Role.MEMBER]: User,
}

interface AddUserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserAdded: (newUser: any) => void
  viewOnly?: boolean
}

// Helper to capitalize first letter of each word
const formatName = (value: string) => {
  return value
    .split(" ")
    .map((word) =>
      word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
    )
    .join(" ")
}

export function AddUserSheet({
  open,
  onOpenChange,
  onUserAdded,
  viewOnly = false,
}: AddUserSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "reserved"
  >("idle")

  const form = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: Role.STAFF as Role,
      // role: Role.MEMBER as Role,
      avatar: null as string | null, // This will temporarily hold the URL, but the file is in avatarFile state
    },
  })

  const emailValue = form.watch("email")

  // Debounced check for email availability
  useEffect(() => {
    const trimmed = emailValue ? emailValue.trim().toLowerCase() : ""

    if (!trimmed || trimmed.length < 2) {
      setEmailStatus("idle")
      return
    }

    // Immediately flag reserved/disallowed system emails
    if (isDisallowedEmail(trimmed)) {
      setEmailStatus("reserved")
      return
    }

    setEmailStatus("checking")
    const controller = new AbortController()

    const timeoutId = setTimeout(async () => {
      try {
        const fullEmail = `${trimmed}@thaisoulmate.org`
        const res = await fetch(
          `/api/users/check-email?email=${encodeURIComponent(fullEmail)}`,
          { signal: controller.signal }
        )
        const data = await res.json()

        if (data.success) {
          if (data.reason === "reserved") {
            setEmailStatus("reserved")
          } else {
            setEmailStatus(data.available ? "available" : "taken")
          }
        } else {
          setEmailStatus("idle")
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Failed to check email availability:", err)
          setEmailStatus("idle")
        }
      }
    }, 500) // 500ms debounce

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [emailValue])

  const uploadAvatar = async ({
    file,
    email,
  }: {
    file: File
    email: string
  }) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(
      `/api/upload?email=${encodeURIComponent(email)}&path=users/avatars`,
      {
        method: "POST",
        body: formData,
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Avatar upload failed")
    }

    return result.url
  }

  const onSubmit = async (values: any) => {
    if (viewOnly) return

    if (emailStatus === "reserved" || isDisallowedEmail(values.email)) {
      toast.error("This email address is reserved and cannot be registered.")
      return
    }

    if (emailStatus === "taken") {
      toast.error(
        "This email is already taken. Please choose another username."
      )
      return
    }

    setIsSubmitting(true)
    let avatarUrl = values.avatar

    const fullEmail = values.email.includes("@")
      ? values.email.trim().toLowerCase()
      : `${values.email.trim().toLowerCase()}@thaisoulmate.org`

    try {
      if (avatarFile) {
        avatarUrl = await uploadAvatar({
          file: avatarFile,
          email: fullEmail,
        })
      } else {
        avatarUrl = null
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          email: fullEmail,
          avatar: avatarUrl,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("User added successfully!")
        onUserAdded(result.data)
        onOpenChange(false)
        form.reset()
        setAvatarFile(null) // Clear avatar file state
        setEmailStatus("idle")
      } else {
        toast.error(result.error || "Failed to add user.")
      }
    } catch (error) {
      toast.error(
        "An error occurred while adding the user, or uploading avatar."
      )
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset()
          setAvatarFile(null)
          setEmailStatus("idle")
        }
        onOpenChange(open)
      }}
    >
      <SheetContent className="sm:max-w-[525px]">
        <SheetHeader>
          <SheetTitle>Add New User</SheetTitle>
          <SheetDescription>
            Fill in the details to add a new login user.
          </SheetDescription>
        </SheetHeader>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full text-center">
                      Avatar (Optional)
                    </FormLabel>
                    <FormControl>
                      <div className="mb-4 flex justify-center">
                        <AvatarUploadInput
                          value={field.value}
                          onChange={(file) => {
                            if (viewOnly) return
                            setAvatarFile(file)
                            field.onChange(
                              file ? URL.createObjectURL(file) : ""
                            )
                          }}
                          defaultFallback={
                            form.watch("name")
                              ? form.watch("name").substring(0, 2).toUpperCase()
                              : "TS"
                          }
                          disabled={viewOnly || isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="John Doe"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(formatName(e.target.value))
                          }}
                          className="pl-10"
                          disabled={viewOnly || isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email username is required",
                  pattern: {
                    value: /^[a-z]+$/,
                    message:
                      "Only lowercase alphabetical characters (a-z) are allowed",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div
                        className={cn(
                          "flex items-stretch overflow-hidden rounded-md border border-input transition-colors focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
                          emailStatus === "available" &&
                            "border-emerald-500/70 focus-within:border-emerald-500 focus-within:ring-emerald-500/50",
                          (emailStatus === "taken" ||
                            emailStatus === "reserved") &&
                            "border-destructive focus-within:border-destructive focus-within:ring-destructive/50"
                        )}
                      >
                        <div className="relative flex flex-1 items-center">
                          <Mail className="pointer-events-none absolute left-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="johndoe"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => {
                              // Auto-convert to lowercase and keep only alphabetical characters (a-z)
                              const clean = e.target.value
                                .toLowerCase()
                                .replace(/[^a-z]/g, "")
                              field.onChange(clean)
                            }}
                            className="h-9 border-0 pl-10 shadow-none focus-visible:ring-0 focus-visible:outline-none"
                            disabled={viewOnly || isSubmitting}
                          />
                        </div>
                        <div className="inline-flex shrink-0 items-center border-l bg-muted/60 px-3 text-xs font-medium text-muted-foreground select-none sm:text-sm">
                          @thaisoulmate.org
                        </div>
                      </div>
                    </FormControl>

                    {/* Email availability feedback badge/label */}
                    {emailStatus === "checking" && (
                      <div className="flex items-center gap-1.5 pt-0.5 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
                        <span className="truncate">
                          Checking{" "}
                          <span className="font-medium text-foreground">
                            {field.value?.trim().toLowerCase()}@thaisoulmate.org
                          </span>
                          ...
                        </span>
                      </div>
                    )}
                    {emailStatus === "available" && (
                      <div className="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          <span className="font-semibold">
                            {field.value?.trim().toLowerCase()}@thaisoulmate.org
                          </span>{" "}
                          is available
                        </span>
                      </div>
                    )}
                    {emailStatus === "taken" && (
                      <div className="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-destructive">
                        <XCircle className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          <span className="font-semibold">
                            {field.value?.trim().toLowerCase()}@thaisoulmate.org
                          </span>{" "}
                          is already taken
                        </span>
                      </div>
                    )}
                    {emailStatus === "reserved" && (
                      <div className="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-destructive">
                        <XCircle className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          <span className="font-semibold">
                            {field.value?.trim().toLowerCase()}@thaisoulmate.org
                          </span>{" "}
                          is reserved and not allowed
                        </span>
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter a password"
                          {...field}
                          className="pl-10"
                          disabled={viewOnly || isSubmitting}
                        />
                        {form.watch("password") && ( // Conditionally render the eye icon
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-3 -translate-y-1/2"
                            disabled={viewOnly || isSubmitting}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Eye className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <div className="relative rounded-md dark:bg-input/30">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={viewOnly || isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 bg-transparent px-2.5 py-1 pl-10 text-base">
                            <FaUserShield className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(Role)
                            .filter((role) => role !== Role.MEMBER) // Hide MEMBER role for now
                            .map((role) => {
                              const Icon = roleIcons[role]
                              return (
                                <SelectItem key={role} value={role}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    {role}
                                  </div>
                                </SelectItem>
                              )
                            })}
                          {/* MEMBER role commented out for now
                          <SelectItem value={Role.MEMBER}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {Role.MEMBER}
                            </div>
                          </SelectItem>
                          */}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting || viewOnly}
                >
                  Cancel
                </Button>
                <Button
                  className="btn-gradient"
                  type="submit"
                  disabled={isSubmitting || viewOnly}
                >
                  {isSubmitting ? "Adding..." : "Add User"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
