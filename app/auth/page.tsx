"use client"

import { z } from "zod"
import Image from "next/image"
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Cake,
  Phone,
  ChevronLeft,
  KeyRound,
} from "lucide-react"
import { APP_INFO } from "@/constants"
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
import { Badge } from "@/components/ui/badge"
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
import { useState, forwardRef, useEffect, Suspense } from "react"
import * as PasswordToggleField from "@radix-ui/react-password-toggle-field"
import { motion, AnimatePresence } from "framer-motion"
import { DatePickerInput } from "@/components/ui/date-picker-input"
import { toast } from "sonner"

const registrationSteps = [
  { id: "details", name: "Details & Location" },
  { id: "verify-email", name: "Verification" },
  { id: "password", name: "Password" },
]

function SimpleStepper({
  steps,
  currentStep,
}: {
  steps: { id: string; name: string }[]
  currentStep: string
}) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  if (currentStepIndex === -1) {
    return null
  }

  return (
    <Badge variant="outline" className="font-medium">
      {`Step ${currentStepIndex + 1} of ${steps.length}`}
    </Badge>
  )
}

function AuthPageContents() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "login"
  const registrationStep =
    (searchParams.get("step") as "details" | "verify-email" | "password") ||
    "details"

  const setMode = (newMode: "login" | "register" | "forgot-password") => {
    const params = new URLSearchParams(searchParams)
    params.set("mode", newMode)
    router.push(`${pathname}?${params.toString()}`)
  }

  const setRegistrationStep = (
    newStep: "details" | "verify-email" | "password",
    data?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("step", newStep)
    if (data) {
      const encodedUserData = btoa(JSON.stringify(data))
      params.set("userData", encodedUserData)
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const [prefix, setPrefix] = useState("Mr.")
  const [gender, setGender] = useState("Male")
  const [birthday, setBirthday] = useState<Date>()
  const [countdown, setCountdown] = useState(0)
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [countries, setCountries] = useState<
    {
      name: string
      flag: string
      code: string
      nationality: string
      callCode: string
    }[]
  >([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [phoneCountry, setPhoneCountry] = useState("TH")
  const [phone, setPhone] = useState("")
  const fullPhoneNumber = `+${countries.find((c) => c.code === phoneCountry)?.callCode || ""}${phone}`

  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch("/api/register-interest/countries")

        if (!res.ok) {
          throw new Error("Failed loading countries")
        }

        const data = await res.json()

        setCountries(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [searchParams])

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

  const validateAndSetStep = (
    step: "details" | "verify-email" | "password",
    schema: z.ZodObject<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    data: any
  ) => {
    const result = schema.safeParse(data)
    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        errors[String(issue.path[0])] = issue.message
      }
      setFormErrors(errors)
    } else {
      setFormErrors({})
      setRegistrationStep(step, data)
    }
  }

  // Form States
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [detailsForm, setDetailsForm] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [verificationCode, setVerificationCode] = useState("")
  const [locationForm, setLocationForm] = useState({
    nationality: "",
    currentLocation: "",
  })
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  })

  // Zod Schemas for validation
  const loginSchema = z.object({
    email: z.email("Invalid email address."),
    password: z.string().min(1, "Password is required."),
  })

  const detailsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    birthday: z.date({
      // phone is validated separately now
      error: "Date of birth is required.",
    }),
    email: z
      .email("Invalid email address.")
      .transform((val) => val.toLowerCase().trim())
      .refine((val) => !/\s/.test(val), {
        message: "Email cannot contain spaces.",
      }),
    nationality: z.string().min(2, "Nationality is required."),
    currentLocation: z.string().min(2, "Current location is required."),
  })

  const passwordSchema = z
    .object({
      password: z.string().min(8, "Password must be at least 8 characters."),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match.",
      path: ["confirmPassword"],
    })

  const verificationCodeSchema = z.object({
    code: z.string().length(6, "Code must be 6 digits."),
  })

  const isLoginFormValid = loginSchema.safeParse(loginForm).success

  const isDetailsFormValid = detailsSchema.safeParse({
    ...detailsForm,
    birthday,
    ...locationForm,
  }).success
  const isVerificationCodeFormValid = verificationCodeSchema.safeParse({
    code: verificationCode,
  }).success
  const isPasswordFormValid = passwordSchema.safeParse(passwordForm).success

  useEffect(() => {
    if (registrationStep === "details") {
      const data = {
        ...detailsForm,
        birthday,
        ...locationForm,
      }
      const result = detailsSchema.safeParse(data)
      if (!result.success) {
        const errors: Record<string, string> = {}
        for (const issue of result.error.issues) {
          const fieldName = String(issue.path[0])
          const value = data[fieldName as keyof typeof data]
          if (value) {
            errors[fieldName] = issue.message
          }
        }
        setFormErrors(errors)
      } else {
        setFormErrors({})
      }
    }
  }, [detailsForm, birthday, locationForm, registrationStep])

  useEffect(() => {
    if (registrationStep === "password") {
      // Don't show validation errors until the user has interacted with the fields.
      if (passwordForm.password === "" && passwordForm.confirmPassword === "") {
        setFormErrors({})
        return
      }

      const result = passwordSchema.safeParse(passwordForm)
      if (!result.success) {
        const errors: Record<string, string> = {}
        for (const issue of result.error.issues) {
          errors[String(issue.path[0])] = issue.message
        }

        // Don't show "Passwords don't match" if confirm password input is empty
        if (passwordForm.confirmPassword === "" && errors.confirmPassword) {
          delete errors.confirmPassword
        }
        setFormErrors(errors)
      } else {
        setFormErrors({})
      }
    }
  }, [passwordForm, registrationStep])

  const handleFinalRegistration = () => {
    if (isPasswordFormValid) {
      const userData = {
        prefix,
        name: detailsForm.name,
        gender,
        birthday: birthday?.toISOString(),
        email: detailsForm.email,
        phone: fullPhoneNumber,
        nationality: locationForm.nationality,
        currentLocation: locationForm.currentLocation,
        // avatar would be uploaded and a URL stored here
      }

      try {
        localStorage.setItem("user", JSON.stringify(userData))
        toast.success("Account registered successfully!")
        router.replace("/dashboard")
      } catch (error) {
        console.error("Failed to save user data to localStorage", error)
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  const animationVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
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
              Your journey to finding a soulmate starts here.
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
              Your journey to finding a soulmate starts here.
            </p>
          </motion.div>
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
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
                          value={loginForm.email}
                          onChange={(e) =>
                            setLoginForm({
                              ...loginForm,
                              email: e.target.value
                                .replace(/\s/g, "")
                                .toLowerCase(),
                            })
                          }
                        />
                      </InputGroup>
                      {formErrors.email && (
                        <p className="text-sm text-destructive">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
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
                                onChange={(e) =>
                                  setLoginForm({
                                    ...loginForm,
                                    email: e.target.value
                                      .replace(/\s/g, "")
                                      .toLowerCase(),
                                  })
                                }
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
                      className="btn-gradient w-full"
                      disabled={!isLoginFormValid}
                      onClick={() => {
                        // Handle Login
                      }}
                    >
                      Login
                    </Button>
                    <div className="flex w-full items-center justify-between text-sm">
                      <p className="text-muted-foreground">
                        <Button
                          variant="link"
                          className="p-0 text-muted-foreground"
                          onClick={() => router.push("/#register-interest")}
                        >
                          Don&apos;t have an account?
                        </Button>
                      </p>
                      <Button
                        variant="link"
                        className="p-0 text-muted-foreground"
                        onClick={() => setMode("forgot-password")}
                        disabled
                      >
                        Forgot password?
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {registrationStep === "details" && (
                  <motion.div
                    key="register-details"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Register</CardTitle>
                          <SimpleStepper
                            steps={registrationSteps}
                            currentStep={registrationStep}
                          />
                        </div>
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
                              <InputGroupInput
                                id="name"
                                placeholder="Your Name"
                                value={detailsForm.name}
                                onChange={(e) =>
                                  setDetailsForm((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                              />
                            </InputGroup>
                          </div>
                          {formErrors.name && (
                            <p className="col-start-2 text-sm text-destructive">
                              {formErrors.name}
                            </p>
                          )}
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
                                  disabled={
                                    prefix === "Ms." || prefix === "Mrs."
                                  }
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
                            {formErrors.birthday && (
                              <p className="text-sm text-destructive">
                                {formErrors.birthday}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-4">
                            <div className="w-[100px] space-y-2">
                              <Label htmlFor="phone-country">Phone</Label>
                              <Select
                                onValueChange={setPhoneCountry}
                                value={phoneCountry}
                              >
                                <SelectTrigger
                                  id="phone-country"
                                  className="h-8 bg-background dark:bg-input/30"
                                >
                                  <SelectValue>
                                    {phoneCountry &&
                                      `+${
                                        countries.find(
                                          (c) => c.code === phoneCountry
                                        )?.callCode
                                      }`}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="max-h-80">
                                  {countries
                                    .sort((a, b) =>
                                      a.callCode.localeCompare(b.callCode)
                                    )
                                    .map((country) => (
                                      <SelectItem
                                        key={country.code}
                                        value={country.code}
                                      >
                                        (+{country.callCode}) {country.flag}{" "}
                                        {country.code}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex-1 space-y-2">
                              <Label className="invisible">Phone Number</Label>
                              <InputGroup>
                                <InputGroupAddon>
                                  <Phone className="size-4" />
                                </InputGroupAddon>
                                <InputGroupInput
                                  id="phone"
                                  placeholder="123456789"
                                  value={phone}
                                  onChange={(e) => {
                                    const { value } = e.target
                                    if (/^\d*$/.test(value)) {
                                      setPhone(value)
                                    }
                                  }}
                                />
                              </InputGroup>
                            </div>
                          </div>
                          {formErrors.phone && (
                            <p className="text-sm text-destructive">
                              {formErrors.phone}
                            </p>
                          )}
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
                              value={detailsForm.email}
                              onChange={(e) =>
                                setDetailsForm({
                                  ...detailsForm,
                                  email: e.target.value
                                    .replace(/\s/g, "")
                                    .toLowerCase(),
                                })
                              }
                            />
                          </InputGroup>
                          {formErrors.email && (
                            <p className="text-sm text-destructive">
                              {formErrors.email}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nationality">Nationality</Label>
                          <Select
                            onValueChange={(value) =>
                              setLocationForm({
                                ...locationForm,
                                nationality: value,
                              })
                            }
                            value={locationForm.nationality}
                          >
                            <SelectTrigger
                              id="nationality"
                              className="h-8 bg-background dark:bg-input/30"
                            >
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              {loadingCountries ? (
                                <SelectItem value="loading" disabled>
                                  Loading countries...
                                </SelectItem>
                              ) : (
                                [...countries]
                                  .sort((a, b) =>
                                    a.nationality.localeCompare(
                                      b.nationality,
                                      "en",
                                      {
                                        sensitivity: "base",
                                      }
                                    )
                                  )
                                  .map((country) => (
                                    <SelectItem
                                      key={country.code}
                                      value={country.nationality}
                                    >
                                      {country.flag} {country.nationality}
                                    </SelectItem>
                                  ))
                              )}
                            </SelectContent>
                          </Select>
                          {formErrors.nationality && (
                            <p className="text-sm text-destructive">
                              {formErrors.nationality}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="current-location">
                            Current Location
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              setLocationForm({
                                ...locationForm,
                                currentLocation: value,
                              })
                            }
                            value={locationForm.currentLocation}
                          >
                            <SelectTrigger
                              id="current-location"
                              className="h-8 bg-background dark:bg-input/30"
                            >
                              <SelectValue placeholder="Select current location" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              {loadingCountries ? (
                                <SelectItem value="loading" disabled>
                                  Loading countries...
                                </SelectItem>
                              ) : (
                                [...countries]
                                  .sort((a, b) =>
                                    a.name.localeCompare(b.name, "en", {
                                      sensitivity: "base",
                                    })
                                  )
                                  .map((country) => (
                                    <SelectItem
                                      key={country.code}
                                      value={country.name}
                                    >
                                      {country.flag} {country.name}
                                    </SelectItem>
                                  ))
                              )}
                            </SelectContent>
                          </Select>
                          {formErrors.currentLocation && (
                            <p className="text-sm text-destructive">
                              {formErrors.currentLocation}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={() =>
                            validateAndSetStep("verify-email", detailsSchema, {
                              ...detailsForm,
                              prefix,
                              gender,
                              phone: fullPhoneNumber,
                              // The birthday from the state is a Date object, which needs to be
                              // converted to a string before being serialized.
                              birthday: birthday?.toISOString(),
                              birthday,
                              ...locationForm,
                            })
                          }
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
                  </motion.div>
                )}
                {registrationStep === "verify-email" && (
                  <motion.div
                    key="register-verify-email"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Verify Your Email</CardTitle>
                          <SimpleStepper
                            steps={registrationSteps}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          We&apos;ve sent a verification code to your email. if
                          not arrive, check also in spam folder.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email-display">Email</Label>
                          <InputGroup>
                            <InputGroupAddon>
                              <Mail className="size-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="email-display"
                              type="email"
                              value={detailsForm.email}
                              readOnly
                              disabled
                            />
                          </InputGroup>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="verification-code">
                            Verification Code
                          </Label>
                          <InputGroup>
                            <InputGroupAddon>
                              <KeyRound className="size-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="verification-code"
                              placeholder="Enter 6-digit code"
                              value={verificationCode}
                              onChange={(e) => {
                                const value = e.target.value
                                if (/^\d{0,6}$/.test(value)) {
                                  setVerificationCode(value)
                                }
                              }}
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  isVerificationCodeFormValid &&
                                  detailsForm.email
                                ) {
                                  const result =
                                    verificationCodeSchema.safeParse({
                                      code: verificationCode,
                                    })
                                  if (!result.success) return
                                  const userData = {
                                    ...detailsForm,
                                  }
                                  setRegistrationStep("password")
                                }
                              }}
                            />
                          </InputGroup>
                          {formErrors.code && (
                            <p className="text-sm text-destructive">
                              {formErrors.code}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          disabled={
                            !isVerificationCodeFormValid || !detailsForm.email
                          }
                          onClick={() => {
                            const result = verificationCodeSchema.safeParse({
                              code: verificationCode,
                            })
                            if (!result.success) {
                              toast.error("Please enter a valid 6-digit code.")
                              return
                            }

                            setRegistrationStep("password")
                          }}
                        >
                          Verify
                        </Button>
                        <div className="flex w-full items-center justify-between text-sm">
                          <Button
                            variant="link"
                            className="flex items-center p-0 text-muted-foreground"
                            onClick={() => router.back()}
                          >
                            <ChevronLeft className="mr-1 size-4" />
                            Back
                          </Button>
                          <Button
                            variant="link"
                            className="p-0 text-muted-foreground"
                            onClick={handleResendCode}
                            disabled={isResendDisabled || !detailsForm.email}
                          >
                            {isResendDisabled //
                              ? `Resend code in ${countdown}s`
                              : "Resend code"}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
                {registrationStep === "password" && (
                  <motion.div
                    key="register-password"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Set Your Password</CardTitle>
                          <SimpleStepper
                            steps={registrationSteps}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          Just one last step to create your account.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email-display-password">Email</Label>
                          <InputGroup>
                            <InputGroupAddon>
                              <Mail className="size-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="email-display-password"
                              type="email"
                              value={detailsForm.email}
                              readOnly
                              disabled
                            />
                          </InputGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password-signup">Password</Label>
                          <InputGroup>
                            <InputGroupAddon>
                              <Lock className="size-4" />
                            </InputGroupAddon>
                            <div className="flex-1">
                              <PasswordToggleField.Root>
                                <PasswordToggleField.Input asChild>
                                  <InputGroupInput
                                    id="password-signup"
                                    placeholder="password"
                                    value={passwordForm.password}
                                    onChange={(e) =>
                                      setPasswordForm({
                                        ...passwordForm,
                                        password: e.target.value,
                                      })
                                    }
                                  />
                                </PasswordToggleField.Input>
                                <PasswordToggleField.Toggle asChild>
                                  <PasswordToggle
                                    value={passwordForm.password}
                                  />
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
                                <PasswordToggleField.Input asChild>
                                  <InputGroupInput
                                    id="confirm-password-signup"
                                    placeholder="confirm password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) =>
                                      setPasswordForm({
                                        ...passwordForm,
                                        confirmPassword: e.target.value,
                                      })
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" &&
                                        isPasswordFormValid
                                      )
                                        router.replace("/dashboard")
                                    }}
                                  />
                                </PasswordToggleField.Input>
                                <PasswordToggleField.Toggle asChild>
                                  <PasswordToggle
                                    value={passwordForm.confirmPassword}
                                  />
                                </PasswordToggleField.Toggle>
                              </PasswordToggleField.Root>
                            </div>
                          </InputGroup>
                          {formErrors.confirmPassword && (
                            <p className="text-sm text-destructive">
                              {formErrors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={handleFinalRegistration}
                          disabled={!isPasswordFormValid || !detailsForm.email}
                        >
                          Register account
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </AnimatePresence>
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
