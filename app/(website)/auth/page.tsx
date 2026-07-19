"use client"

import { z } from "zod"
import Image from "next/image"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { forwardRef, Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import * as PasswordToggleField from "@radix-ui/react-password-toggle-field"
import { motion } from "framer-motion"
import { toast } from "sonner"

import { AppName } from "@/components/app-name"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { APP_INFO } from "@/constants"
import { useAuthStore } from "@/stores/auth-store"

function AuthPageContents() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const loginSchema = z.object({
    email: z.email("Invalid email address."),
    password: z.string().min(1, "Password is required."),
  })

  const clearFormError = (field: string) => {
    setFormErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleLogin = async () => {
    const result = loginSchema.safeParse(loginForm)
    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        errors[String(issue.path[0])] = issue.message
      }
      setFormErrors(errors)
      return
    }

    setIsLoggingIn(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      })
      const data = await response.json()

      if (!response.ok) {
        toast.error("Login Failed", {
          description: data.error || "Please check your credentials.",
        })
        return
      }

      setUser(data.user)
      toast.success("Login Successful!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login Failed", {
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-4xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="hidden lg:block"
        >
          <div className="flex flex-col items-start text-left">
            <Image
              src="/logo.png"
              alt={`${APP_INFO.name} logo`}
              width={128}
              height={128}
              className="mb-6 rounded-3xl object-cover"
              priority
            />
            <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
              Welcome to
              <br />
              <AppName />
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Login to manage your matchmaking journey.
            </p>
          </div>
        </motion.div>
        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mb-4 flex flex-col items-center text-center lg:hidden"
          >
            <Image
              src="/logo.png"
              alt={`${APP_INFO.name} logo`}
              width={96}
              height={96}
              className="mb-4 rounded-3xl object-cover shadow-sm"
              priority
            />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome to
              <br />
              <AppName />
            </h1>
            <p className="mt-2 text-muted-foreground">
              Login to manage your matchmaking journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleLogin()
                }}
              >
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="pt-4">
                      Email
                    </Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <Mail className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginForm.email}
                        onChange={(e) => {
                          const email = e.target.value
                            .replace(/\s/g, "")
                            .toLowerCase()
                          setLoginForm({
                            ...loginForm,
                            email,
                          })
                          if (
                            formErrors.email &&
                            loginSchema.shape.email.safeParse(email).success
                          ) {
                            clearFormError("email")
                          }
                        }}
                        disabled={isLoggingIn}
                      />
                    </InputGroup>
                    {formErrors.email && (
                      <p className="text-sm text-destructive">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 pb-4">
                    <Label htmlFor="password">Password</Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <Lock className="size-4" />
                      </InputGroupAddon>
                      <div className="flex-1">
                        <PasswordToggleField.Root>
                          <PasswordToggleField.Input asChild>
                            <InputGroupInput
                              id="password"
                              placeholder="password"
                              value={loginForm.password}
                              onChange={(e) => {
                                const password = e.target.value
                                setLoginForm({
                                  ...loginForm,
                                  password,
                                })
                                if (
                                  formErrors.password &&
                                  loginSchema.shape.password.safeParse(password)
                                    .success
                                ) {
                                  clearFormError("password")
                                }
                              }}
                              disabled={isLoggingIn}
                            />
                          </PasswordToggleField.Input>
                          <PasswordToggleField.Toggle asChild>
                            <PasswordToggle value={loginForm.password} />
                          </PasswordToggleField.Toggle>
                        </PasswordToggleField.Root>
                      </div>
                    </InputGroup>
                    {formErrors.password && (
                      <p className="text-sm text-destructive">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                  <Button
                    type="submit"
                    className="btn-gradient w-full"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <Spinner className="mr-2" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 text-muted-foreground"
                    onClick={() => router.push("/#register-interest")}
                  >
                    Don&apos;t have an account?
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

const PasswordToggle = forwardRef<
  HTMLButtonElement,
  { value: string } & React.ComponentProps<typeof Button>
>(({ value, ...props }, ref) => {
  if (!value) {
    return null
  }
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon-sm"
      className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
      {...props}
      disabled={props.disabled}
    >
      <PasswordToggleField.Icon
        visible={<Eye className="size-4" />}
        hidden={<EyeOff className="size-4" />}
      />
      <span className="sr-only">Toggle password visibility</span>
    </Button>
  )
})
PasswordToggle.displayName = "PasswordToggle"

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContents />
    </Suspense>
  )
}
