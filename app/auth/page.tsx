"use client"

import clsx from "clsx"
import { z } from "zod"
import Image from "next/image"
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Heart,
  Cake,
  Phone,
  Home,
  MapPin,
  ChevronLeft,
  KeyRound,
  Flame,
} from "lucide-react"
import { UploadCloud } from "lucide-react"
import { APP_INFO, STRIPE } from "@/constants"
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, forwardRef, useEffect, Suspense } from "react"
import * as PasswordToggleField from "@radix-ui/react-password-toggle-field"
import { motion, AnimatePresence } from "framer-motion"
import { DatePickerInput } from "@/components/ui/date-picker-input"
import { toast } from "sonner"
import { PricingPageContents } from "../pricing/page"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Plan } from "@/types"

const registrationSteps = [
  { id: "details", name: "Details" },
  { id: "location", name: "Location" },
  { id: "verify-email", name: "Verification" },
  { id: "plans", name: "Plans" },
  { id: "profile-setup", name: "Profile Setup" },
  { id: "password", name: "Password" },
]

const plans: Plan[] = [
  {
    name: "1 Month",
    priceIds: {
      subscription: STRIPE.PLANS.priceIds.subscription.oneMonth,
      oneTime: STRIPE.PLANS.priceIds.oneTime.oneMonth,
    },
    price: "฿29,999",
    duration: { paid: "1 month", total: "2 months" },
    recurringInterval: { paid: "1 month", total: "2 months" },
    features: [
      "Get 1 month FREE",
      "Priority Customer Support",
      "Exclusive Access to New Features",
      "Enhanced Privacy Controls",
      "Verified Member Badge",
    ],
    pricePerMonth: "฿15,000/mo",
  },
  {
    name: "3 Months",
    priceIds: {
      subscription: STRIPE.PLANS.priceIds.subscription.threeMonth,
      oneTime: STRIPE.PLANS.priceIds.oneTime.threeMonth,
    },
    price: "฿34,999",
    duration: { paid: "3 months", total: "6 months" },
    recurringInterval: { paid: "3 months", total: "6 months" },
    pricePerMonth: "≈ ฿5,833/mo",
    features: [
      "Get 3 months FREE",
      "Priority Customer Support",
      "Exclusive Access to New Features",
      "Enhanced Privacy Controls",
      "Verified Member Badge",
    ],
    popular: true,
  },
  {
    name: "6 Months",
    priceIds: {
      subscription: STRIPE.PLANS.priceIds.subscription.sixMonth,
      oneTime: STRIPE.PLANS.priceIds.oneTime.sixMonth,
    },
    price: "฿49,999",
    duration: { paid: "6 months", total: "12 months" },
    recurringInterval: { paid: "6 months", total: "12 months" },
    pricePerMonth: "≈ ฿4,167/mo",
    features: [
      "Get 6 months FREE",
      "Priority Customer Support",
      "Exclusive Access to New Features",
      "Enhanced Privacy Controls",
      "Verified Member Badge",
    ],
  },
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
    (searchParams.get("step") as
      | "details"
      | "verify-email"
      | "location"
      | "plans"
      | "profile-setup"
      | "password") || "details"

  const getEffectiveStep = () => {
    if (
      registrationStep === "profile-setup" ||
      registrationStep === "password"
    ) {
      if (paymentStatus === "paid") {
        return registrationStep
      }
    }
    return registrationStep
  }

  const setMode = (newMode: "login" | "register" | "forgot-password") => {
    const params = new URLSearchParams(searchParams)
    params.set("mode", newMode)
    router.push(`${pathname}?${params.toString()}`)
  }

  const setRegistrationStep = (
    newStep:
      | "details"
      | "verify-email"
      | "location"
      | "plans"
      | "profile-setup"
      | "password"
  ) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("step", newStep)

    const currentUserData = {
      prefix,
      name: detailsForm.name,
      gender,
      birthday: birthday?.toISOString(),
      email: detailsForm.email,
      phone: detailsForm.phone,
      nationality: locationForm.nationality,
      currentLocation: locationForm.currentLocation,
      hobbies: profileSetupForm.hobbies,
      paymentStatus,
    }

    const filteredUserData = Object.fromEntries(
      Object.entries(currentUserData).filter(([, v]) => v != null && v !== "")
    )

    const encodedUserData = btoa(JSON.stringify(filteredUserData))
    params.set("userData", encodedUserData)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const [prefix, setPrefix] = useState("Mr.")
  const [gender, setGender] = useState("Male")
  const [birthday, setBirthday] = useState<Date>()
  const [countdown, setCountdown] = useState(0)
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [isAutoRenew, setIsAutoRenew] = useState(true)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [selectedPlan, setSelectedPlan] = useState("3 Months")

  useEffect(() => {
    const canceled = searchParams.get("canceled")
    if (canceled) {
      toast.error("Payment Canceled", {
        description: "Your payment process was canceled. Please try again.",
      })
      // Clean up URL
      const params = new URLSearchParams(searchParams.toString())
      params.delete("canceled")
      params.delete("session_id")
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      })
    }
  }, [searchParams, pathname, router])

  useEffect(() => {
    const userDataFromUrl = searchParams.get("userData")
    if (userDataFromUrl) {
      try {
        const decodedUserData = JSON.parse(atob(userDataFromUrl))
        setDetailsForm((prev) => ({
          ...prev,
          name: decodedUserData.name || prev.name,
          email: decodedUserData.email || prev.email,
          phone: decodedUserData.phone || prev.phone,
        }))
        setLocationForm((prev) => ({
          ...prev,
          nationality: decodedUserData.nationality || prev.nationality,
          currentLocation:
            decodedUserData.currentLocation || prev.currentLocation,
        }))
        setProfileSetupForm((prev) => ({
          ...prev,
          hobbies: decodedUserData.hobbies || prev.hobbies,
        }))
        if (decodedUserData.prefix) setPrefix(decodedUserData.prefix)
        if (decodedUserData.gender) setGender(decodedUserData.gender)
        if (decodedUserData.birthday)
          setBirthday(new Date(decodedUserData.birthday))
        if (decodedUserData.paymentStatus)
          setPaymentStatus(decodedUserData.paymentStatus)
      } catch (error) {
        console.error("Failed to parse user data from URL", error)
      }
    }
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
    step:
      | "details"
      | "verify-email"
      | "location"
      | "plans"
      | "profile-setup"
      | "password",
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
      toast.error("Please fix the errors before proceeding.")
    } else {
      setFormErrors({})
      setRegistrationStep(step)
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
  const [profileSetupForm, setProfileSetupForm] = useState({
    avatar: null as File | null,
    hobbies: "",
  })
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  })

  // Zod Schemas for validation
  const loginSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(1, "Password is required."),
  })

  const detailsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    phone: z
      .string()
      .startsWith("+", "Phone number must start with a '+'.")
      .min(10, "Phone number seems too short."),
    birthday: z.date({
      error: "Date of birth is required.",
    }),
  })

  const verificationCodeSchema = z.object({
    code: z.string().length(6, "Code must be 6 digits."),
  })

  const locationSchema = z.object({
    nationality: z.string().min(2, "Nationality is required."),
    currentLocation: z.string().min(2, "Current location is required."),
  })

  const profileSetupSchema = z.object({
    avatar: z.any().refine((file) => file, "Avatar is required."),
    hobbies: z.string().min(3, "Please enter at least one hobby."),
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

  const isLoginFormValid = loginSchema.safeParse(loginForm).success

  const isDetailsFormValid = detailsSchema.safeParse({
    ...detailsForm,
    birthday,
  }).success
  const isVerificationCodeFormValid = verificationCodeSchema.safeParse({
    code: verificationCode,
  }).success
  const isLocationFormValid = locationSchema.safeParse(locationForm).success
  const isProfileSetupFormValid =
    profileSetupSchema.safeParse(profileSetupForm).success
  const isPasswordFormValid = passwordSchema.safeParse(passwordForm).success

  useEffect(() => {
    if (
      registrationStep === "password" ||
      registrationStep === "profile-setup"
    ) {
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
        phone: detailsForm.phone,
        nationality: locationForm.nationality,
        currentLocation: locationForm.currentLocation,
        hobbies: profileSetupForm.hobbies.split(",").map((h) => h.trim()),
        // avatar would be uploaded and a URL stored here
        plan: JSON.parse(localStorage.getItem("selectedPlan") || "{}"),
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

  const handleChoosePlan = async (plan: Plan) => {
    const priceId = isAutoRenew
      ? plan.priceIds.subscription
      : plan.priceIds.oneTime
    const mode = isAutoRenew ? "subscription" : "payment"

    sessionStorage.setItem("selectedPlan", JSON.stringify(plan))

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userData: {
            ...detailsForm,
            prefix,
            gender,
            birthday: birthday?.toISOString(),
            ...locationForm,
          },
          mode,
        }),
      })

      const { url, error } = await response.json()

      if (!response.ok) {
        console.error("Server error:", error)
        throw new Error(error.message || "Failed to create checkout session.")
      }

      if (error) {
        throw new Error(error)
      }

      router.push(url)
    } catch (error) {
      console.error("Failed to create checkout session:", error)
      alert("Failed to proceed to checkout. Please try again.")
    }
  }

  const PlanSelector = () => (
    <Tabs
      value={selectedPlan}
      onValueChange={setSelectedPlan}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        {plans.map((plan) => (
          <TabsTrigger
            key={plan.name}
            value={plan.name}
            className="data-[state=active]:btn-gradient data-[state=active]:text-primary-foreground"
          >
            {plan.name}
            {plan.popular && <Flame className="text-gold ml-2 size-4" />}
          </TabsTrigger>
        ))}
      </TabsList>
      {plans.map((plan) => (
        <TabsContent key={plan.name} value={plan.name}>
          <div
            className={clsx(
              "mt-4 rounded-lg border bg-card p-6 text-card-foreground",
              plan.popular && "border-gold border-2"
            )}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">{plan.price}</h3>
              <p className="text-sm text-muted-foreground">
                {plan.pricePerMonth}
              </p>
            </div>
            <div className="mt-1 text-sm font-semibold text-muted-foreground">
              {isAutoRenew ? (
                <span>
                  Billed for <del>{plan.recurringInterval.paid}</del>, get{" "}
                  <b>{plan.recurringInterval.total}</b>
                </span>
              ) : (
                <span>
                  Pay for <del>{plan.duration.paid}</del>, get{" "}
                  <b>{plan.duration.total}</b>
                </span>
              )}
            </div>
            <ul className="my-6 list-inside list-none space-y-2 text-sm">
              {plan.features.length > 0 && (
                <li className="text-muted-foreground">
                  <span className="text-gradient font-bold">
                    {plan.features[0]}
                  </span>
                </li>
              )}
            </ul>
            <Button
              className="btn-gradient w-full"
              onClick={() => handleChoosePlan(plan)}
            >
              Choose {plan.name} Plan
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )

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
                              email: e.target.value,
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
                                    password: e.target.value,
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
                            currentStep={getEffectiveStep()}
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
                                  setDetailsForm({
                                    ...detailsForm,
                                    name: e.target.value,
                                  })
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
                                  email: e.target.value,
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
                          <Label htmlFor="phone">Phone</Label>
                          <InputGroup>
                            <InputGroupAddon>
                              <Phone className="size-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="phone"
                              placeholder="+1 234 567 890"
                              value={detailsForm.phone}
                              onChange={(e) =>
                                setDetailsForm({
                                  ...detailsForm,
                                  phone: e.target.value,
                                })
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                isDetailsFormValid &&
                                validateAndSetStep("location", detailsSchema, {
                                  ...detailsForm,
                                  birthday,
                                })
                              }
                            />
                          </InputGroup>
                          {formErrors.phone && (
                            <p className="text-sm text-destructive">
                              {formErrors.phone}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          disabled={!isDetailsFormValid}
                          onClick={() =>
                            validateAndSetStep("location", detailsSchema, {
                              ...detailsForm,
                              birthday,
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
                            currentStep={getEffectiveStep()}
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
                                  setRegistrationStep("plans")
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

                            setRegistrationStep("plans")
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
                {registrationStep === "location" && (
                  <motion.div
                    key="register-location"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Location Details</CardTitle>
                          <div className="mb-4 pt-2">
                            <SimpleStepper
                              steps={registrationSteps}
                              currentStep={getEffectiveStep()}
                            />
                          </div>
                        </div>
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
                              value={locationForm.nationality}
                              onChange={(e) =>
                                setLocationForm({
                                  ...locationForm,
                                  nationality: e.target.value,
                                })
                              }
                            />
                          </InputGroup>
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
                          <InputGroup>
                            <InputGroupAddon>
                              <MapPin className="size-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="current-location"
                              placeholder="e.g. Bangkok, Thailand"
                              value={locationForm.currentLocation}
                              onChange={(e) =>
                                setLocationForm({
                                  ...locationForm,
                                  currentLocation: e.target.value,
                                })
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                isLocationFormValid &&
                                validateAndSetStep(
                                  "verify-email",
                                  locationSchema,
                                  locationForm
                                )
                              }
                            />
                          </InputGroup>
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
                          disabled={!isLocationFormValid}
                          onClick={() => {
                            validateAndSetStep(
                              "verify-email",
                              locationSchema,
                              locationForm
                            )
                          }}
                        >
                          Next
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
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
                {registrationStep === "plans" && (
                  <motion.div
                    key="register-plans"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Choose Your Plan</CardTitle>
                          <SimpleStepper
                            steps={registrationSteps}
                            currentStep={getEffectiveStep()}
                          />
                        </div>
                        <CardDescription>
                          Select a VIP membership to unlock exclusive features.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Label htmlFor="auto-renew-toggle">
                            Auto-renew subscription
                          </Label>
                          <Switch
                            id="auto-renew-toggle"
                            checked={isAutoRenew}
                            onCheckedChange={setIsAutoRenew}
                          />
                        </div>
                        <PlanSelector />
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
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
                            onClick={() => router.push("/pricing")}
                          >
                            View Full Details
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
                {registrationStep === "profile-setup" && (
                  <motion.div
                    key="register-profile-setup"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Set Up Your Profile</CardTitle>
                          <SimpleStepper
                            steps={registrationSteps}
                            currentStep={getEffectiveStep()}
                          />
                          {/* {paymentStatus === "paid" && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                              Payment Successful
                            </Badge>
                          )} */}
                        </div>
                        <CardDescription>
                          Tell us more about you for better matchmaking.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="avatar">Profile Picture</Label>
                          <InputGroup className="items-center">
                            <InputGroupAddon>
                              <UploadCloud className="size-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="avatar"
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setProfileSetupForm({
                                  ...profileSetupForm,
                                  avatar: e.target.files
                                    ? e.target.files[0]
                                    : null,
                                })
                              }
                              className="pt-1.5"
                            />
                          </InputGroup>
                          {formErrors.avatar && (
                            <p className="text-sm text-destructive">
                              {formErrors.avatar}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hobbies">
                            Hobbies (comma-separated)
                          </Label>
                          <InputGroup>
                            <InputGroupAddon>
                              <Heart className="size-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="hobbies"
                              placeholder="e.g. Reading, Hiking, Cooking"
                              value={profileSetupForm.hobbies}
                              onChange={(e) =>
                                setProfileSetupForm({
                                  ...profileSetupForm,
                                  hobbies: e.target.value,
                                })
                              }
                            />
                          </InputGroup>
                          {formErrors.hobbies && (
                            <p className="text-sm text-destructive">
                              {formErrors.hobbies}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="btn-gradient w-full"
                          disabled={!isProfileSetupFormValid}
                          onClick={() =>
                            validateAndSetStep(
                              "password",
                              profileSetupSchema,
                              profileSetupForm
                            )
                          }
                        >
                          Next
                        </Button>
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
                            currentStep={getEffectiveStep()}
                          />
                          {/* {paymentStatus === "paid" && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                              Payment Successful
                            </Badge>
                          )} */}
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
