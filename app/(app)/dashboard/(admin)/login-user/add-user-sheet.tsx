"use client"

import { useState } from "react"
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
} from "lucide-react"
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
  USER: "USER",
} as const

type Role = (typeof Role)[keyof typeof Role]

// Map roles to icons
const roleIcons: Record<Role, React.ElementType> = {
  [Role.ADMIN]: Shield,
  [Role.STAFF]: Users2,
  [Role.USER]: User,
}

interface AddUserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserAdded: (newUser: any) => void
  viewOnly?: boolean
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

  const form = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: Role.USER as Role,
      avatar: null as string | null, // This will temporarily hold the URL, but the file is in avatarFile state
    },
  })

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
    setIsSubmitting(true)
    let avatarUrl = values.avatar

    try {
      if (avatarFile) {
        avatarUrl = await uploadAvatar({
          file: avatarFile,
          email: values.email,
        })
      } else {
        avatarUrl = null
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, avatar: avatarUrl }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("User added successfully!")
        onUserAdded(result.data)
        onOpenChange(false)
        form.reset()
        setAvatarFile(null) // Clear avatar file state
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
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          {...field}
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
                          {Object.values(Role).map((role) => {
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
