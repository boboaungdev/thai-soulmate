"use client"

import Image from "next/image"
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Cake,
  Phone,
  Home,
  MapPin,
  ChevronLeft,
} from "lucide-react"
import { APP_INFO, CONTACT } from "@/constants"
import { AppName } from "@/components/app-name"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, forwardRef, useEffect } from "react"
import * as PasswordToggleField from "@radix-ui/react-password-toggle-field"
import { DatePickerInput } from "@/components/ui/date-picker-input"
import { toast } from "sonner"

export default function AuthPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "login"
  const registrationStep =
    (searchParams.get("step") as
      "details" | "verify-email" | "location" | "password") || "details"

  const setMode = (newMode: "login" | "register" | "forgot-password") => {
    const params = new URLSearchParams(searchParams)
    params.set("mode", newMode)
    router.push(`${pathname}?${params.toString()}`)
  }

  const setRegistrationStep = (
    newStep: "details" | "verify-email" | "location" | "password"
  ) => {
    const params = new URLSearchParams(searchParams)
    params.set("step", newStep)
    router.push(`${pathname}?${params.toString()}`)
  }
  const [prefix, setPrefix] = useState("Mr.")
  const [gender, setGender] = useState("Male")
  const [birthday, setBirthday] = useState<Date>()
  const [countdown, setCountdown] = useState(0)
  const [isResendDisabled, setIsResendDisabled] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (registrationStep === "verify-email" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      setIsResendDisabled(false)
    }
    return () => clearInterval(timer)
  }, [registrationStep, countdown])

  useEffect(() => {
    if (registrationStep === "verify-email") {
      setCountdown(60)
      setIsResendDisabled(true)
    }
  }, [registrationStep])

  const handleResendCode = () => {
    setCountdown(60)
    setIsResendDisabled(true)
    // TODO: Add logic to actually resend the verification code
    toast.success("Verification code resent!", {
      description: "A new code has been sent to your email address.",
    })
  }

  useEffect(() => {
    if (prefix === "Mr." && gender !== "Male") {
      setGender("Male")
    } else if ((prefix === "Ms." || prefix === "Mrs.") && gender !== "Female") {
      setGender("Female")
    }
  }, [prefix, gender])

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-4xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="hidden lg:block">
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
              Your journey to finding a soulmate starts here.
            </p>
          </div>
        </div>
        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="mb-4 flex flex-col items-center text-center lg:hidden">
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
              Your journey to finding a soulmate starts here.
            </p>
          </div>
          {mode === "login" ? (
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <Mail className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </InputGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <Lock className="size-4" />
                    </InputGroupAddon>
                    <div className="flex-1">
                      <PasswordToggleField.Root>
                        <PasswordToggleField.Input
                          asChild
                          id="password"
                          placeholder="password"
                        >
                          <InputGroupInput />
                        </PasswordToggleField.Input>
                        <PasswordToggleField.Toggle asChild>
                          <PasswordToggle />
                        </PasswordToggleField.Toggle>
                      </PasswordToggleField.Root>
                    </div>
                  </InputGroup>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                <Button className="btn-gradient w-full">Login</Button>
                <div className="flex w-full items-center justify-between text-sm">
                  <p className="text-muted-foreground">
                    <Button
                      variant="link"
                      className="p-0 text-muted-foreground"
                      onClick={() => setMode("register")}
                    >
                      Don&apos;t have an account?
                    </Button>
                  </p>
                  <Button
                    variant="link"
                    className="p-0 text-muted-foreground"
                    onClick={() => setMode("forgot-password")}
                  >
                    Forgot password?
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <>
              {registrationStep === "details" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                      Create an account to start your journey with us.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-[100px_1fr] gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prefix">Prefix</Label>
                        <Select onValueChange={setPrefix} value={prefix}>
                          <SelectTrigger
                            id="prefix"
                            className="h-8 bg-background dark:bg-input/30"
                          >
                            <SelectValue placeholder="Mr." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mr.">Mr.</SelectItem>
                            <SelectItem value="Ms.">Ms.</SelectItem>
                            <SelectItem value="Mrs.">Mrs.</SelectItem>
                            <SelectItem value="Dr.">Dr.</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <InputGroup>
                          <InputGroupAddon>
                            <User className="size-4" />
                          </InputGroupAddon>
                          <InputGroupInput id="name" placeholder="Your Name" />
                        </InputGroup>
                      </div>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select onValueChange={setGender} value={gender}>
                          <SelectTrigger
                            id="gender"
                            className="h-8 bg-background dark:bg-input/30"
                          >
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="Male"
                              disabled={prefix === "Ms." || prefix === "Mrs."}
                            >
                              Male
                            </SelectItem>
                            <SelectItem
                              value="Female"
                              disabled={prefix === "Mr."}
                            >
                              Female
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthday">Date of Birth</Label>
                        <InputGroup>
                          <InputGroupAddon>
                            <Cake className="size-4" />
                          </InputGroupAddon>
                          <DatePickerInput
                            value={birthday}
                            onSelect={setBirthday}
                          />
                        </InputGroup>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <InputGroup>
                        <InputGroupAddon>
                          <Mail className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="email-signup"
                          type="email"
                          placeholder="you@example.com"
                        />
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <InputGroup>
                        <InputGroupAddon>
                          <Phone className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="phone"
                          placeholder="+1 234 567 890"
                        />
                      </InputGroup>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-4">
                    <Button
                      className="btn-gradient w-full"
                      onClick={() => setRegistrationStep("verify-email")}
                    >
                      Next
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      <Button
                        variant="link"
                        className="p-0 text-muted-foreground"
                        onClick={() => setMode("login")}
                      >
                        Already have an account?
                      </Button>
                    </p>
                  </CardFooter>
                </Card>
              )}
              {registrationStep === "verify-email" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Verify Your Email</CardTitle>
                    <CardDescription>
                      We&apos;ve sent a verification code to your email address.
                      Enter the code below to continue.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verification-code">
                        Verification Code
                      </Label>
                      <InputGroup>
                        <InputGroupAddon>
                          <Lock className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="verification-code"
                          placeholder="Enter 6-digit code"
                        />
                      </InputGroup>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-4">
                    <Button
                      className="btn-gradient w-full"
                      onClick={() => setRegistrationStep("location")}
                    >
                      Verify
                    </Button>
                    <div className="flex w-full items-center justify-between text-sm">
                      <Button
                        variant="link"
                        className="flex items-center p-0 text-muted-foreground"
                        onClick={() => setRegistrationStep("details")}
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back to details
                      </Button>
                      <Button
                        variant="link"
                        className="p-0 text-muted-foreground"
                        onClick={handleResendCode}
                        disabled={isResendDisabled}
                      >
                        {isResendDisabled
                          ? `Resend code in ${countdown}s`
                          : "Resend code"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )}
              {registrationStep === "location" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Almost there</CardTitle>
                    <CardDescription>
                      Please provide your location details to complete your
                      profile.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <InputGroup>
                        <InputGroupAddon>
                          <Home className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="nationality"
                          placeholder="e.g. Thai"
                        />
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current-location">Current Location</Label>
                      <InputGroup>
                        <InputGroupAddon>
                          <MapPin className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="current-location"
                          placeholder="e.g. Bangkok, Thailand"
                        />
                      </InputGroup>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-4">
                    <Button
                      className="btn-gradient w-full"
                      onClick={() => setRegistrationStep("password")}
                    >
                      Next
                    </Button>
                    <div className="flex w-full items-center justify-between text-sm">
                      <Button
                        variant="link"
                        className="flex items-center p-0 text-muted-foreground"
                        onClick={() => setRegistrationStep("verify-email")}
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back to verification
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )}
              {registrationStep === "password" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Set Your Password</CardTitle>
                    <CardDescription>
                      Choose a strong password to protect your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password-signup">Password</Label>
                      <InputGroup>
                        <InputGroupAddon>
                          <Lock className="size-4" />
                        </InputGroupAddon>
                        <div className="flex-1">
                          <PasswordToggleField.Root>
                            <PasswordToggleField.Input
                              asChild
                              id="password-signup"
                              placeholder="password"
                            >
                              <InputGroupInput />
                            </PasswordToggleField.Input>
                            <PasswordToggleField.Toggle asChild>
                              <PasswordToggle />
                            </PasswordToggleField.Toggle>
                          </PasswordToggleField.Root>
                        </div>
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password-signup">
                        Confirm Password
                      </Label>
                      <InputGroup>
                        <InputGroupAddon>
                          <Lock className="size-4" />
                        </InputGroupAddon>
                        <div className="flex-1">
                          <PasswordToggleField.Root>
                            <PasswordToggleField.Input
                              asChild
                              id="confirm-password-signup"
                              placeholder="confirm password"
                            >
                              <InputGroupInput />
                            </PasswordToggleField.Input>
                            <PasswordToggleField.Toggle asChild>
                              <PasswordToggle />
                            </PasswordToggleField.Toggle>
                          </PasswordToggleField.Root>
                        </div>
                      </InputGroup>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-4">
                    <Button className="btn-gradient w-full">Finish</Button>
                    <div className="flex w-full items-center justify-between text-sm">
                      <Button
                        variant="link"
                        className="flex items-center p-0 text-muted-foreground"
                        onClick={() => setRegistrationStep("location")}
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back to location
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}

const PasswordToggle = forwardRef<HTMLButtonElement>((props, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon-sm"
    className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
    {...props}
  >
    <PasswordToggleField.Icon
      visible={<EyeOff className="size-4" />}
      hidden={<Eye className="size-4" />}
    />
    <span className="sr-only">Toggle password visibility</span>
  </Button>
))
PasswordToggle.displayName = "PasswordToggle"
