"use client"

import { z } from "zod"
import Image from "next/image"
import { Check, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react"
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
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background px-4 py-16 sm:px-6 lg:px-8">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -left-28 h-96 w-96 rounded-full bg-[#D3A753]/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -bottom-28 h-96 w-96 rounded-full bg-[#CA617D]/15 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D3A753]/5 blur-[160px]"
      />

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Desktop Left Brand Column */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden flex-col items-start space-y-6 text-left lg:col-span-6 lg:flex xl:col-span-7"
        >
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#D3A753] uppercase backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-[#D3A753]" />
            <span>Confidential Member Portal</span>
          </div>

          <div className="relative">
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#D3A753]/40 via-[#E791A7]/30 to-[#CA617D]/40 opacity-70 blur-md" />
            <div className="relative rounded-3xl border border-[#D3A753]/30 bg-card/90 p-2.5 shadow-2xl backdrop-blur-md">
              <Image
                src="/logo.png"
                alt={`${APP_INFO.name} logo`}
                width={100}
                height={100}
                className="rounded-2xl object-cover"
                priority
              />
            </div>
          </div>

          <div>
            <h1 className="text-4xl leading-tight font-bold tracking-tight text-foreground xl:text-5xl">
              Welcome to
              <br />
              <span className="text-gradient">
                <AppName />
              </span>
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
              Login to manage your matchmaking journey.
            </p>
          </div>

          {/* Luxury reassurance pillars */}
          <div className="space-y-3 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/15 text-[#D3A753]">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span>Strictly private, encrypted member records</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/15 text-[#D3A753]">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span>1-2-1 matchmaker notes & curated introductions</span>
            </div>
          </div>
        </motion.div>

        {/* Right Form Column */}
        <div className="w-full max-w-md justify-self-center lg:col-span-6 lg:justify-self-end xl:col-span-5">
          {/* Mobile Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6 flex flex-col items-center text-center lg:hidden"
          >
            <div className="relative mb-4">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#D3A753]/30 via-[#E791A7]/30 to-[#CA617D]/30 blur-sm" />
              <div className="relative rounded-2xl border border-[#D3A753]/30 bg-card/90 p-2 shadow-lg backdrop-blur-md">
                <Image
                  src="/logo.png"
                  alt={`${APP_INFO.name} logo`}
                  width={80}
                  height={80}
                  className="rounded-xl object-cover"
                  priority
                />
              </div>
            </div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#D3A753] uppercase backdrop-blur-sm">
              <ShieldCheck className="h-3 w-3" />
              <span>Confidential Member Portal</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome to
              <br />
              <span className="text-gradient">
                <AppName />
              </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Login to manage your matchmaking journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Card ambient glow frame */}
              <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-b from-[#D3A753]/25 via-transparent to-[#CA617D]/20 opacity-70 blur-md" />

              <Card className="relative overflow-hidden rounded-3xl border border-[#D3A753]/30 bg-card/85 p-2 shadow-2xl backdrop-blur-xl sm:p-4">
                {/* Subtle top edge highlight */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D3A753]/60 to-transparent" />

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleLogin()
                  }}
                >
                  <CardHeader className="space-y-1.5 pb-6">
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                      Login
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Enter your credentials to access your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                      >
                        Email
                      </Label>
                      <InputGroup className="rounded-xl border-border/70 bg-background/50 transition-all focus-within:border-[#D3A753]/60 focus-within:ring-1 focus-within:ring-[#D3A753]/30">
                        <InputGroupAddon className="pl-3.5 text-muted-foreground">
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
                          className="h-11 bg-transparent text-sm"
                        />
                      </InputGroup>
                      {formErrors.email && (
                        <p className="text-xs font-medium text-destructive">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                      >
                        Password
                      </Label>
                      <InputGroup className="rounded-xl border-border/70 bg-background/50 transition-all focus-within:border-[#D3A753]/60 focus-within:ring-1 focus-within:ring-[#D3A753]/30">
                        <InputGroupAddon className="pl-3.5 text-muted-foreground">
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
                                    loginSchema.shape.password.safeParse(
                                      password
                                    ).success
                                  ) {
                                    clearFormError("password")
                                  }
                                }}
                                disabled={isLoggingIn}
                                className="h-11 bg-transparent text-sm"
                              />
                            </PasswordToggleField.Input>
                            <PasswordToggleField.Toggle asChild>
                              <PasswordToggle value={loginForm.password} />
                            </PasswordToggleField.Toggle>
                          </PasswordToggleField.Root>
                        </div>
                      </InputGroup>
                      {formErrors.password && (
                        <p className="text-xs font-medium text-destructive">
                          {formErrors.password}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-stretch gap-4 pt-2 pb-6">
                    <Button
                      type="submit"
                      className="btn-gradient h-11 w-full rounded-xl text-base font-semibold shadow-md shadow-[#D3A753]/15 transition-all hover:shadow-[#D3A753]/30"
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <>
                          <Spinner className="mr-2 size-4" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                    <div className="flex items-center justify-center pt-1">
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 text-sm text-muted-foreground transition-colors hover:text-[#D3A753]"
                        onClick={() => router.push("/#register-interest")}
                      >
                        Don&apos;t have an account?
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Card>
            </div>
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
