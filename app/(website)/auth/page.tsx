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
  Upload,
  Briefcase,
  ChevronLeft,
  KeyRound,
  X,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, forwardRef, useEffect, Suspense } from "react"
import * as PasswordToggleField from "@radix-ui/react-password-toggle-field"
import { motion, AnimatePresence } from "framer-motion"
import { DatePickerInput } from "@/components/ui/date-picker-input"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useAuthStore } from "@/stores/auth-store"

const educationLevels = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Other",
]

const maritalStatuses = ["Never Married", "Divorced", "Widowed"]

const personalityTraits = [
  "Kind",
  "Loyal",
  "Ambitious",
  "Romantic",
  "Family-Oriented",
  "Easy Going",
  "Adventurous",
  "Spiritual",
  "Confident",
  "Humorous",
  "Intelligent",
  "Creative",
]

const religions = [
  "Buddhism",
  "Christianity",
  "Islam",
  "Hinduism",
  "Sikhism",
  "Judaism",
  "Not religious",
  "Other",
]

const lifestyleOptions = [
  "Relaxed",
  "Active",
  "Luxury-Oriented",
  "Family-Focused",
  "Career-Focused",
  "Adventurous",
]

const smokingHabits = ["Never", "Occasionally", "Regularly"]

const drinkingHabits = ["Never", "Occasionally", "Socially", "Frequently"]

const exerciseFrequencies = ["Daily", "Weekly", "Occasionally", "Never"]

const interestsAndHobbies = [
  "Travel",
  "Fitness",
  "Reading",
  "Cooking",
  "Fine Dining",
  "Music",
  "Movies",
  "Business",
  "Investing",
  "Golf",
  "Tennis",
  "Hiking",
  "Yoga",
  "Art",
  "Photography",
  "Volunteering",
  "Pets",
]

const familyImportanceOptions = [
  "Very Important",
  "Important",
  "Somewhat Important",
  "Not Important",
]

const futureChildrenOptions = ["Yes", "No", "Maybe"]

const valuesOptions = [
  "Honesty",
  "Loyalty",
  "Trust",
  "Kindness",
  "Ambition",
  "Family",
  "Financial Stability",
  "Faith",
  "Independence",
  "Adventure",
  "Communication",
  "Respect",
]

const idealPartnerAgeRanges = [
  "29-35",
  "36-41",
  "42-47",
  "48-55",
  "56-63",
  "63-70",
  "70+",
]

const idealPartnerNationalities = [
  "USA",
  "UK",
  "AUS",
  "EUROPEAN",
  "ASIAN",
  "INDIAN",
  "AFRICAN",
  "OTHER",
]

const idealPartnerHeights = ["under 5'", '5"-5.5"', '5.6"-5.9"', "6:+"]

const idealPartnerPersonalityTraits = [
  "Kind",
  "Honest",
  "Intelligent",
  "Ambitious",
  "Romantic",
  "Family-Oriented",
  "Confident",
  "Easy Going",
  "Adventurous",
  "Spiritual",
]

const idealPartnerDesiredQualities = [
  "Honest",
  "Loyal",
  "Kind",
  "Family-Oriented",
  "Ambitious",
  "Intelligent",
  "Romantic",
  "Financially Stable",
  "Adventurous",
  "Easy Going",
]

const relationshipGoalsOptions = [
  "Marriage",
  "Long-Term Relationship",
  "Serious Dating",
  "Companionship",
  "Open to Possibilities",
]

const relocationOptions = ["Yes", "No", "Maybe"]

const settleDownOptions = ["Within 1 Year", "1–3 Years", "No Specific Timeline"]

const femaleProfileSteps = [
  "female-profile-2",
  "female-profile-3",
  "female-profile-4",
  "female-profile-5",
  "female-profile-goals",
  "female-profile-6",
  "female-profile-7",
  "female-profile-8",
  "female-profile-9",
  "female-profile-10",
  "female-profile-11",
]

const maleProfileSteps = [
  "male-profile-2",
  "male-profile-3",
  "male-profile-4",
  "male-profile-5",
  "male-profile-goals",
  "male-profile-6",
  "male-profile-7",
  "male-profile-8",
  "male-profile-9",
  "male-profile-10",
  "male-profile-11",
]

const getRegistrationSteps = (gender: string) => {
  const baseSteps = [
    { id: "details", name: "Details & Location" },
    { id: "thank-you", name: "Thank You" },
    { id: "verify-email", name: "Verification" }, // This will be shifted
    { id: "password", name: "Password" },
  ]

  if (gender === "Female") {
    baseSteps.splice(
      1,
      1,
      ...femaleProfileSteps.map((id, index) => ({
        id,
        name: `Profile Step ${index + 2}`,
      }))
    )
  }
  if (gender === "Male") {
    baseSteps.splice(
      1,
      1,
      ...maleProfileSteps.map((id, index) => ({
        id,
        name: `Profile Step ${index + 2}`,
      }))
    )
  }

  return baseSteps
}

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
  const { setUser } = useAuthStore()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initialUserData, setInitialUserData] = useState<any | null>(null)
  const registrationStep =
    (searchParams.get("step") as
      | "details"
      | "male-profile-2"
      | "male-profile-3"
      | "male-profile-4"
      | "male-profile-5"
      | "male-profile-goals"
      | "male-profile-6"
      | "male-profile-7"
      | "male-profile-8"
      | "male-profile-9"
      | "male-profile-10"
      | "male-profile-11"
      | "female-profile-2"
      | "female-profile-3"
      | "female-profile-4"
      | "female-profile-5"
      | "female-profile-goals"
      | "female-profile-6"
      | "female-profile-7"
      | "female-profile-8"
      | "female-profile-9"
      | "female-profile-10"
      | "female-profile-11"
      | "thank-you"
      | "verify-email"
      | "password") || "details"

  const bestQualitiesPlaceholders = ["e.g. Honest", "e.g. Kind", "e.g. Funny"]
  const lookingForQualitiesPlaceholders = [
    "e.g. Ambitious",
    "e.g. Loyal",
    "e.g. Supportive",
  ]
  const travelDestinationsPlaceholders = [
    "e.g. Paris",
    "e.g. Tokyo",
    "e.g. New York",
  ]

  const setMode = (newMode: "login" | "register" | "forgot-password") => {
    // When switching modes, we should probably clear the step and userData
    const params = new URLSearchParams(searchParams)
    params.set("mode", newMode)
    router.push(`${pathname}?${params.toString()}`)
  }

  const setRegistrationStep = (
    newStep:
      | "details"
      | "male-profile-2"
      | "male-profile-3"
      | "male-profile-4"
      | "male-profile-5"
      | "male-profile-goals"
      | "male-profile-6"
      | "male-profile-7"
      | "male-profile-8"
      | "male-profile-9"
      | "male-profile-10"
      | "male-profile-11"
      | "female-profile-2"
      | "female-profile-3"
      | "female-profile-4"
      | "female-profile-5"
      | "female-profile-goals"
      | "female-profile-6"
      | "female-profile-7"
      | "female-profile-8"
      | "female-profile-9"
      | "female-profile-10"
      | "female-profile-11"
      | "thank-you"
      | "verify-email"
      | "password"
  ) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("step", newStep)
    params.delete("userData")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const [prefix, setPrefix] = useState("Mr.")
  const [gender, setGender] = useState("Male")
  const [dob, setBirthday] = useState<Date>()
  const [countdown, setCountdown] = useState(0)
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const [femaleProfileForm, setFemaleProfileForm] = useState({
    nickname: "",
    occupation: "",
    company: "",
    thaiFluency: [50],
    education: "",
    englishFluency: [50],
    height: "",
    weight: "",
    religion: "",
    maritalStatus: "Never Married",
    hasChildren: "No",
    childrenCount: 0,
    personality: [] as string[],
    about: "",
    bestQualities: ["", "", ""],
    lookingForQualities: ["", "", ""],
    lifestyle: [] as string[],
    smoking: "",
    drinking: "",
    exercise: "",
    interests: [] as string[],
    otherInterest: "",
    travelDestinations: ["", "", ""],
    weekendActivity: "",
    familyImportance: "",
    futureChildren: "",
    values: [] as string[],
    idealPartnerAgeRange: "",
    idealPartnerNationality: "",
    idealPartnerLocation: "",
    idealPartnerHeight: "",
    idealPartnerEducation: "",
    idealPartnerPersonality: [] as string[],
    idealPartnerOtherPersonality: "",
    idealPartnerQualities: [] as string[],
    dealBreakers: ["", "", ""],
  })
  const [financialForm, setFinancialForm] = useState({
    income: "",
    ownProperty: "",
    ownBusiness: "",
  })
  const [photosForm, setPhotosForm] = useState<{
    headshot: File | null
    fullLength: File | null
    casualLifestyle: File | null
    recent: File | null
  }>({
    headshot: null,
    fullLength: null,
    casualLifestyle: null,
    recent: null,
  })
  const [relationshipGoalsForm, setRelationshipGoalsForm] = useState({
    lookingFor: [] as string[],
    relocate: "",
    settleDown: "",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const clearFormError = (field: string) => {
    setFormErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

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
  const [initialRedirectDone, setInitialRedirectDone] = useState(false)
  const [phoneCountry, setPhoneCountry] = useState("TH")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  // Form States
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false)
  const [detailsForm, setDetailsForm] = useState({
    prefix: "Mr.",
    name: "",
    email: "",
    phone: "",
  })
  const fullPhoneNumber = `+${countries.find((c) => c.code === phoneCountry)?.callCode || ""}${detailsForm.phone}`

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true)
        const response = await fetch("/api/register-interest/countries")
        const data = await response.json()
        setCountries(data)
      } catch (error) {
        console.error("Failed to fetch countries:", error)
        toast.error("Could not load country data.", {
          description: "Please refresh the page to try again.",
        })
      } finally {
        setLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    const initializeApplication = async () => {
      const userEmail = searchParams.get("email")
      if (mode !== "register" || !userEmail || initialRedirectDone) {
        return
      }

      try {
        // 1. Check for registered interest AND get data
        const registerInterestResponse = await fetch(
          `/api/register-interest/check?email=${encodeURIComponent(userEmail)}`
        )
        const registerInterestData = await registerInterestResponse.json()

        if (registerInterestData.exists) {
          // Data exists, PRE-FILL the form state
          const interestData = registerInterestData.interest
          setInitialUserData(interestData) // Store all of it

          // Prefill all form fields from the fetched data
          if (interestData.prefix) setPrefix(interestData.prefix)
          if (interestData.gender) setGender(interestData.gender)
          if (interestData.dob) setBirthday(new Date(interestData.dob))

          setDetailsForm((prev) => ({
            ...prev,
            name: interestData.name ?? prev.name,
            email: interestData.email ?? prev.email,
            phone: interestData.phone ?? prev.phone,
          }))

          setLocationForm((prev) => ({
            ...prev,
            nationality: interestData.nationality ?? prev.nationality,
            currentLocation:
              interestData.currentLocation ?? prev.currentLocation,
          }))

          if (interestData.phoneCountry) {
            const country = countries.find(
              (c) =>
                c.callCode === interestData.phoneCountry ||
                `+${c.callCode}` === interestData.phoneCountry
            )
            if (country) setPhoneCountry(country.code)
          }

          // 2. Check if they have a full application
          const applicationFormResponse = await fetch(
            `/api/application-form/check?email=${encodeURIComponent(userEmail)}`
          )
          const applicationFormData = await applicationFormResponse.json()

          if (applicationFormData.exists) {
            // They have registered interest AND completed application.
            setRegistrationStep("thank-you")
          } else {
            // They have registered interest but NOT completed application.
            // Auto move to step 2 as requested.
            const nextStep =
              interestData.gender === "Female"
                ? "female-profile-2"
                : "male-profile-2"
            setRegistrationStep(nextStep)
          }
        } else {
          // Email does NOT exist in RegisterInterest.
          // Stay on step 1, with only email pre-filled.
          setInitialUserData({ email: userEmail })
          setDetailsForm((prev) => ({ ...prev, email: userEmail }))
          // We don't auto-move. The user is on the 'details' step by default.
        }

        setInitialRedirectDone(true)
      } catch (error) {
        console.error("Error during application initialization:", error)
        toast.error("Could not initialize registration.", {
          description: "Please try again later.",
        })
      }
    }

    if (!loadingCountries) {
      initializeApplication()
    }
  }, [
    mode,
    searchParams,
    initialRedirectDone,
    countries,
    loadingCountries,
    setInitialUserData,
  ])

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
      | "male-profile-2"
      | "male-profile-3"
      | "male-profile-4"
      | "male-profile-5"
      | "male-profile-goals"
      | "male-profile-6"
      | "male-profile-7"
      | "male-profile-8"
      | "male-profile-9"
      | "male-profile-10"
      | "male-profile-11"
      | "female-profile-2"
      | "female-profile-3"
      | "female-profile-4"
      | "female-profile-5"
      | "female-profile-goals"
      | "female-profile-6"
      | "female-profile-7"
      | "female-profile-8"
      | "female-profile-9"
      | "female-profile-10"
      | "female-profile-11"
      | "thank-you"
      | "verify-email"
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
    } else {
      setFormErrors({})
      setRegistrationStep(step)
    }
  }

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
    prefix: z.string().min(1, "Prefix is required."),
    name: z.string().min(2, "Name must be at least 2 characters."),
    dob: z.date({
      error: "Date of birth is required.",
    }),
    phone: z.string().min(10, "Please enter a valid phone number."),
    email: z
      .email("Invalid email address.")
      .transform((val) => val.toLowerCase().trim())
      .refine((val) => !/\s/.test(val), {
        message: "Email cannot contain spaces.",
      }),
    nationality: z.string().min(2, "Nationality is required."),
    currentLocation: z.string().min(2, "Current location is required."),
  })

  const getProfileSchema1 = (gender: string) => {
    const baseSchema = {
      occupation: z.string().min(2, "Occupation is required."),
      company: z.string().min(2, "Company/Industry is required."),
      education: z.string().min(1, "Education level is required."),
    }
    if (gender === "Female") {
      return z.object({
        ...baseSchema,
        nickname: z.string().min(2, "Nickname is required."),
      })
    }
    return z.object(baseSchema)
  }

  const femaleProfileSchemaFinancial = z.object({
    income: z.string().min(1, "Please select an income range."),
    ownProperty: z.string().min(1, "Please specify property ownership."),
    ownBusiness: z.string().min(1, "Please specify business ownership."),
  })

  const getProfileSchema3 = (gender: string) => {
    const baseSchema = {
      englishFluency: z.array(z.number()).min(1),
      height: z
        .string()
        .min(2, "Height is required.")
        .refine((val) => !isNaN(parseFloat(val)), "Height must be a number."),
      weight: z
        .string()
        .min(1, "Weight is required.")
        .refine((val) => !isNaN(parseFloat(val)), "Weight must be a number."),
      religion: z.string().min(2, "Religion is required."),
    }

    if (gender === "Male") {
      return z.object({
        ...baseSchema,
        thaiFluency: z.array(z.number()).min(1),
      })
    }
    return z.object(baseSchema)
  }

  const femaleProfileSchema4 = z
    .object({
      maritalStatus: z.string().min(1, "Marital status is required."),
      hasChildren: z.enum(["Yes", "No"]),
      childrenCount: z.number().optional(),
      personality: z
        .array(z.string())
        .min(1, "Please select at least one personality trait."),
    })
    .refine(
      (data) => {
        if (data.hasChildren === "Yes") {
          return data.childrenCount && data.childrenCount > 0
        }
        return true
      },
      {
        message: "Please specify the number of children.",
        path: ["childrenCount"],
      }
    )

  const femaleProfileSchema5 = z.object({
    about: z.string().min(10, "Please tell us a little about yourself."),
    bestQualities: z
      .array(z.string())
      .length(3)
      .refine((q) => q.every((val) => val.trim().length > 0), {
        message: "Please enter three qualities.",
      }),
    lookingForQualities: z
      .array(z.string())
      .length(3)
      .refine((q) => q.every((val) => val.trim().length > 0), {
        message: "Please enter three qualities.",
      }),
  })

  const relationshipGoalsSchema = z.object({
    lookingFor: z
      .array(z.string())
      .min(1, "Please select at least one option."),
    relocate: z.string().min(1, "Please select an option for relocation."),
    settleDown: z.string().min(1, "Please select a timeline."),
  })
  const femaleProfileSchema6 = z.object({
    lifestyle: z
      .array(z.string())
      .min(1, "Please select at least one lifestyle description."),
    smoking: z.string().min(1, "Please select your smoking habits."),
    drinking: z.string().min(1, "Please select your drinking habits."),
    exercise: z.string().min(1, "Please select your exercise frequency."),
  })

  const femaleProfileSchema7 = z
    .object({
      interests: z
        .array(z.string())
        .length(5, "Please select exactly 5 interests."),
      otherInterest: z.string().optional(),
      travelDestinations: z
        .array(z.string())
        .length(3)
        .refine((d) => d.every((dest) => dest.trim().length > 0), {
          message: "Please list 3 favorite travel destinations.",
        }),
      weekendActivity: z
        .string()
        .min(10, "Please describe how you spend your weekends."),
    })
    .refine(
      (data) => {
        if (data.interests.includes("Other")) {
          return data.otherInterest && data.otherInterest.trim().length > 0
        }
        return true
      },
      {
        message: "Please specify your 'Other' interest.",
        path: ["otherInterest"],
      }
    )

  const femaleProfileSchema8 = z.object({
    familyImportance: z.string().min(1, "Please select an option."),
    futureChildren: z.string().min(1, "Please select an option."),
    values: z.array(z.string()).length(5, "Please select exactly 5 values."),
  })

  const femaleProfileSchema9 = z
    .object({
      idealPartnerAgeRange: z.string().min(1, "Please select an age range."),
      idealPartnerNationality: z
        .string()
        .min(1, "Please select a preferred nationality."),
      idealPartnerLocation: z
        .string()
        .min(1, "Please select a preferred location."),
      idealPartnerHeight: z.string().min(1, "Please select a height range."),
      idealPartnerEducation: z
        .string()
        .min(1, "Please select an education preference."),
      idealPartnerPersonality: z
        .array(z.string())
        .length(5, "Please select exactly 5 personality traits."),
      idealPartnerOtherPersonality: z.string().optional(),
      idealPartnerQualities: z
        .array(z.string())
        .length(5, "Please select exactly 5 desired qualities."),
      dealBreakers: z
        .array(z.string())
        .length(3, "Please list 3 deal breakers.")
        .refine((items) => items.every((item) => item.trim().length > 0), {
          message: "Please enter three deal breakers.",
        }),
    })
    .refine(
      (data) => {
        if (data.idealPartnerPersonality.includes("Other")) {
          return (
            data.idealPartnerOtherPersonality &&
            data.idealPartnerOtherPersonality.trim().length > 0
          )
        }
        return true
      },
      {
        message: "Please specify the 'Other' personality trait.",
        path: ["idealPartnerOtherPersonality"],
      }
    )

  const femaleProfileSchemaPhotos = z.object({
    headshot: z.instanceof(File, { message: "Headshot is required." }),
    fullLength: z.instanceof(File, {
      message: "Full-Length Photo is required.",
    }),
    casualLifestyle: z.instanceof(File, {
      message: "Casual Lifestyle Photo is required.",
    }),
    recent: z.instanceof(File, { message: "A recent photo is required." }),
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

  const isVerificationCodeFormValid = verificationCodeSchema.safeParse({
    code: verificationCode,
  }).success
  const isPasswordFormValid = passwordSchema.safeParse(passwordForm).success

  useEffect(() => {
    if (mode === "login" && formErrors.email) {
      if (loginSchema.shape.email.safeParse(loginForm.email).success) {
        clearFormError("email")
      }
    }
  }, [loginForm.email, mode, formErrors.email])

  useEffect(() => {
    if (mode === "login" && formErrors.password) {
      if (loginSchema.shape.password.safeParse(loginForm.password).success) {
        clearFormError("password")
      }
    }
  }, [loginForm.password, mode, formErrors.password])

  useEffect(() => {
    if (registrationStep === "details") {
      if (Object.keys(formErrors).length === 0) return

      const data = {
        ...detailsForm,
        prefix,
        dob,
        ...locationForm,
        phone: detailsForm.phone,
      }
      const result = detailsSchema.safeParse(data) //
      if (result.success) {
        setFormErrors({})
      } else {
        const newErrors = { ...formErrors }
        Object.keys(formErrors).forEach((key) => {
          if (!result.error.issues.some((issue) => issue.path[0] === key)) {
            delete newErrors[key]
          }
        })
        setFormErrors(newErrors)
      }
    }
  }, [detailsForm, dob, locationForm, registrationStep])

  useEffect(() => {
    if (registrationStep === "password" && mode === "register") {
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
  }, [passwordForm, registrationStep, mode])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-2" ||
        registrationStep === "male-profile-2") &&
      formErrors.nickname
    ) {
      //
      const schema = getProfileSchema1(gender)
      if (
        "nickname" in schema.shape &&
        (schema.shape as { nickname: z.ZodString })["nickname"].safeParse(
          femaleProfileForm.nickname
        ).success
      ) {
        clearFormError("nickname")
      }
    }
  }, [femaleProfileForm.nickname, registrationStep, formErrors.nickname])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-2" ||
        registrationStep === "male-profile-2") &&
      formErrors.occupation
    ) {
      if (
        getProfileSchema1(gender).shape.occupation.safeParse(
          femaleProfileForm.occupation
        ).success
      ) {
        clearFormError("occupation")
      }
    }
  }, [femaleProfileForm.occupation, registrationStep, formErrors.occupation])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-2" ||
        registrationStep === "male-profile-2") &&
      formErrors.company
    ) {
      if (
        getProfileSchema1(gender).shape.company.safeParse(
          femaleProfileForm.company
        ).success
      ) {
        clearFormError("company")
      }
    }
  }, [femaleProfileForm.company, registrationStep, formErrors.company])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-2" ||
        registrationStep === "male-profile-2") &&
      formErrors.education
    ) {
      if (
        getProfileSchema1(gender).shape.education.safeParse(
          femaleProfileForm.education
        ).success
      ) {
        clearFormError("education")
      }
    }
  }, [femaleProfileForm.education, registrationStep, formErrors.education])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-3" ||
        registrationStep === "male-profile-3") &&
      formErrors.height
    ) {
      if (
        getProfileSchema3(gender).shape.height.safeParse(
          femaleProfileForm.height
        ).success
      ) {
        clearFormError("height")
      }
    }
  }, [femaleProfileForm.height, registrationStep, formErrors.height])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-3" ||
        registrationStep === "male-profile-3") &&
      formErrors.weight
    ) {
      if (
        getProfileSchema3(gender).shape.weight.safeParse(
          femaleProfileForm.weight
        ).success
      ) {
        clearFormError("weight")
      }
    }
  }, [femaleProfileForm.weight, registrationStep, formErrors.weight])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-3" ||
        registrationStep === "male-profile-3") &&
      formErrors.religion
    ) {
      if (
        getProfileSchema3(gender).shape.religion.safeParse(
          femaleProfileForm.religion
        ).success
      ) {
        clearFormError("religion")
      }
    }
  }, [femaleProfileForm.religion, registrationStep, formErrors.religion])

  useEffect(() => {
    if (registrationStep === "male-profile-3" && formErrors.thaiFluency) {
      const schema = getProfileSchema3("Male")
      if (
        "thaiFluency" in schema.shape &&
        (schema.shape as { thaiFluency: z.ZodArray<z.ZodNumber> })[
          "thaiFluency"
        ].safeParse(femaleProfileForm.thaiFluency).success
      ) {
        clearFormError("thaiFluency")
      }
    }
  }, [femaleProfileForm.thaiFluency, registrationStep, formErrors.thaiFluency])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-4" ||
        registrationStep === "male-profile-4") &&
      formErrors.personality
    ) {
      if (
        femaleProfileSchema4.shape.personality.safeParse(
          femaleProfileForm.personality
        ).success
      ) {
        clearFormError("personality")
      }
    }
  }, [femaleProfileForm.personality, registrationStep, formErrors.personality])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-4" ||
        registrationStep === "male-profile-4") &&
      formErrors.childrenCount
    ) {
      if (
        femaleProfileForm.hasChildren === "No" ||
        (femaleProfileForm.hasChildren === "Yes" &&
          femaleProfileForm.childrenCount > 0)
      ) {
        clearFormError("childrenCount")
      }
    }
  }, [
    femaleProfileForm.hasChildren,
    femaleProfileForm.childrenCount,
    registrationStep,
    formErrors.childrenCount,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-5" ||
        registrationStep === "male-profile-5") &&
      formErrors.about
    ) {
      if (femaleProfileForm.about.length >= 10) {
        clearFormError("about")
      }
    }
  }, [femaleProfileForm.about, registrationStep, formErrors.about])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-5" ||
        registrationStep === "male-profile-5") &&
      formErrors.bestQualities
    ) {
      if (femaleProfileForm.bestQualities.every((q) => q.trim().length > 0)) {
        clearFormError("bestQualities")
      }
    }
  }, [
    femaleProfileForm.bestQualities,
    registrationStep,
    formErrors.bestQualities,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-5" ||
        registrationStep === "male-profile-5") &&
      formErrors.lookingForQualities
    ) {
      if (
        femaleProfileForm.lookingForQualities.every((q) => q.trim().length > 0)
      ) {
        clearFormError("lookingForQualities")
      }
    }
  }, [
    femaleProfileForm.lookingForQualities,
    registrationStep,
    formErrors.lookingForQualities,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-goals" ||
        registrationStep === "male-profile-goals") &&
      formErrors.lookingFor
    ) {
      if (relationshipGoalsForm.lookingFor.length > 0) {
        clearFormError("lookingFor")
      }
    }
  }, [
    relationshipGoalsForm.lookingFor,
    registrationStep,
    formErrors.lookingFor,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-goals" ||
        registrationStep === "male-profile-goals") &&
      formErrors.relocate
    ) {
      if (relationshipGoalsForm.relocate) {
        clearFormError("relocate")
      }
    }
  }, [relationshipGoalsForm.relocate, registrationStep, formErrors.relocate])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-goals" ||
        registrationStep === "male-profile-goals") &&
      formErrors.settleDown
    ) {
      if (relationshipGoalsForm.settleDown) {
        clearFormError("settleDown")
      }
    }
  }, [
    relationshipGoalsForm.settleDown,
    registrationStep,
    formErrors.settleDown,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-5" ||
        registrationStep === "male-profile-5") &&
      formErrors.lookingForQualities
    ) {
      if (
        femaleProfileForm.lookingForQualities.every((q) => q.trim().length > 0)
      ) {
        clearFormError("lookingForQualities")
      }
    }
  }, [
    femaleProfileForm.lookingForQualities,
    registrationStep,
    formErrors.lookingForQualities,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-6" ||
        registrationStep === "male-profile-6") &&
      formErrors.lifestyle
    ) {
      if (femaleProfileForm.lifestyle.length > 0) {
        clearFormError("lifestyle")
      }
    }
  }, [femaleProfileForm.lifestyle, registrationStep, formErrors.lifestyle])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-6" ||
        registrationStep === "male-profile-6") &&
      formErrors.smoking
    ) {
      if (femaleProfileForm.smoking) {
        clearFormError("smoking")
      }
    }
  }, [femaleProfileForm.smoking, registrationStep, formErrors.smoking])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-6" ||
        registrationStep === "male-profile-6") &&
      formErrors.drinking
    ) {
      if (femaleProfileForm.drinking) {
        clearFormError("drinking")
      }
    }
  }, [femaleProfileForm.drinking, registrationStep, formErrors.drinking])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-6" ||
        registrationStep === "male-profile-6") &&
      formErrors.exercise
    ) {
      if (femaleProfileForm.exercise) {
        clearFormError("exercise")
      }
    }
  }, [femaleProfileForm.exercise, registrationStep, formErrors.exercise])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-7" ||
        registrationStep === "male-profile-7") &&
      formErrors.interests
    ) {
      if (femaleProfileForm.interests.length === 5) {
        clearFormError("interests")
      }
    }
  }, [femaleProfileForm.interests, registrationStep, formErrors.interests])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-7" ||
        registrationStep === "male-profile-7") &&
      formErrors.otherInterest
    ) {
      if (
        !femaleProfileForm.interests.includes("Other") ||
        (femaleProfileForm.interests.includes("Other") &&
          femaleProfileForm.otherInterest.trim().length > 0)
      ) {
        clearFormError("otherInterest")
      }
    }
  }, [
    femaleProfileForm.interests,
    femaleProfileForm.otherInterest,
    registrationStep,
    formErrors.otherInterest,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-7" ||
        registrationStep === "male-profile-7") &&
      formErrors.travelDestinations
    ) {
      if (
        femaleProfileForm.travelDestinations.every((d) => d.trim().length > 0)
      ) {
        clearFormError("travelDestinations")
      }
    }
  }, [
    femaleProfileForm.travelDestinations,
    registrationStep,
    formErrors.travelDestinations,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-7" ||
        registrationStep === "male-profile-7") &&
      formErrors.weekendActivity
    ) {
      if (femaleProfileForm.weekendActivity.length >= 10) {
        clearFormError("weekendActivity")
      }
    }
  }, [
    femaleProfileForm.weekendActivity,
    registrationStep,
    formErrors.weekendActivity,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-8" ||
        registrationStep === "male-profile-8") &&
      formErrors.familyImportance
    ) {
      if (femaleProfileForm.familyImportance) {
        clearFormError("familyImportance")
      }
    }
  }, [
    femaleProfileForm.familyImportance,
    registrationStep,
    formErrors.familyImportance,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-8" ||
        registrationStep === "male-profile-8") &&
      formErrors.futureChildren
    ) {
      if (femaleProfileForm.futureChildren) {
        clearFormError("futureChildren")
      }
    }
  }, [
    femaleProfileForm.futureChildren,
    registrationStep,
    formErrors.futureChildren,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-8" ||
        registrationStep === "male-profile-8") &&
      formErrors.values
    ) {
      if (femaleProfileForm.values.length === 5) {
        clearFormError("values")
      }
    }
  }, [femaleProfileForm.values, registrationStep, formErrors.values])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-9" ||
        registrationStep === "male-profile-9") &&
      formErrors.idealPartnerAgeRange
    ) {
      if (femaleProfileForm.idealPartnerAgeRange) {
        clearFormError("idealPartnerAgeRange")
      }
    }
  }, [
    femaleProfileForm.idealPartnerAgeRange,
    registrationStep,
    formErrors.idealPartnerAgeRange,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-9" ||
        registrationStep === "male-profile-9") &&
      formErrors.idealPartnerNationality
    ) {
      if (femaleProfileForm.idealPartnerNationality) {
        clearFormError("idealPartnerNationality")
      }
    }
  }, [
    femaleProfileForm.idealPartnerNationality,
    registrationStep,
    formErrors.idealPartnerNationality,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-9" ||
        registrationStep === "male-profile-9") &&
      formErrors.idealPartnerLocation
    ) {
      if (femaleProfileForm.idealPartnerLocation) {
        clearFormError("idealPartnerLocation")
      }
    }
  }, [
    femaleProfileForm.idealPartnerLocation,
    registrationStep,
    formErrors.idealPartnerLocation,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-9" ||
        registrationStep === "male-profile-9") &&
      formErrors.idealPartnerHeight
    ) {
      if (femaleProfileForm.idealPartnerHeight) {
        clearFormError("idealPartnerHeight")
      }
    }
  }, [
    femaleProfileForm.idealPartnerHeight,
    registrationStep,
    formErrors.idealPartnerHeight,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-9" ||
        registrationStep === "male-profile-9") &&
      formErrors.idealPartnerEducation
    ) {
      if (femaleProfileForm.idealPartnerEducation) {
        clearFormError("idealPartnerEducation")
      }
    }
  }, [
    femaleProfileForm.idealPartnerEducation,
    registrationStep,
    formErrors.idealPartnerEducation,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-9" ||
        registrationStep === "male-profile-9") &&
      formErrors.idealPartnerPersonality
    ) {
      if (femaleProfileForm.idealPartnerPersonality.length === 5) {
        clearFormError("idealPartnerPersonality")
      }
    }
  }, [
    femaleProfileForm.idealPartnerPersonality,
    registrationStep,
    formErrors.idealPartnerPersonality,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-9" ||
        registrationStep === "male-profile-9") &&
      formErrors.idealPartnerQualities
    ) {
      if (femaleProfileForm.idealPartnerQualities.length === 5) {
        clearFormError("idealPartnerQualities")
      }
    }
  }, [
    femaleProfileForm.idealPartnerQualities,
    registrationStep,
    formErrors.idealPartnerQualities,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-9" ||
        registrationStep === "male-profile-9") &&
      formErrors.idealPartnerOtherPersonality
    ) {
      if (femaleProfileForm.idealPartnerOtherPersonality.trim().length > 0) {
        clearFormError("idealPartnerOtherPersonality")
      }
    }
  }, [
    femaleProfileForm.idealPartnerOtherPersonality,
    registrationStep,
    formErrors.idealPartnerOtherPersonality,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-9" ||
        registrationStep === "male-profile-9") &&
      formErrors.dealBreakers
    ) {
      if (femaleProfileForm.dealBreakers.every((d) => d.trim().length > 0)) {
        clearFormError("dealBreakers")
      }
    }
  }, [
    femaleProfileForm.dealBreakers,
    registrationStep,
    formErrors.dealBreakers,
  ])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-11" ||
        registrationStep === "male-profile-11") &&
      formErrors.headshot
    ) {
      if (photosForm.headshot) {
        clearFormError("headshot")
      }
    }
  }, [photosForm.headshot, registrationStep, formErrors.headshot])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-11" ||
        registrationStep === "male-profile-11") &&
      formErrors.fullLength
    ) {
      if (photosForm.fullLength) {
        clearFormError("fullLength")
      }
    }
  }, [photosForm.fullLength, registrationStep, formErrors.fullLength])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-11" ||
        registrationStep === "male-profile-11") &&
      formErrors.casualLifestyle
    ) {
      if (photosForm.casualLifestyle) {
        clearFormError("casualLifestyle")
      }
    }
  }, [photosForm.casualLifestyle, registrationStep, formErrors.casualLifestyle])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-11" ||
        registrationStep === "male-profile-11") &&
      formErrors.recent
    ) {
      if (photosForm.recent) {
        clearFormError("recent")
      }
    }
  }, [photosForm.recent, registrationStep, formErrors.recent])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-10" ||
        registrationStep === "male-profile-10") &&
      formErrors.income
    ) {
      if (
        femaleProfileSchemaFinancial.shape.income.safeParse(
          financialForm.income
        ).success
      ) {
        clearFormError("income")
      }
    }
  }, [financialForm.income, registrationStep, formErrors.income])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-10" ||
        registrationStep === "male-profile-10") &&
      formErrors.ownProperty
    ) {
      if (
        femaleProfileSchemaFinancial.shape.ownProperty.safeParse(
          financialForm.ownProperty
        ).success
      ) {
        clearFormError("ownProperty")
      }
    }
  }, [financialForm.ownProperty, registrationStep, formErrors.ownProperty])

  useEffect(() => {
    if (
      (registrationStep === "female-profile-10" ||
        registrationStep === "male-profile-10") &&
      formErrors.ownBusiness
    ) {
      if (
        femaleProfileSchemaFinancial.shape.ownBusiness.safeParse(
          financialForm.ownBusiness
        ).success
      ) {
        clearFormError("ownBusiness")
      }
    }
  }, [financialForm.ownBusiness, registrationStep, formErrors.ownBusiness])

  useEffect(() => {
    if (
      registrationStep.startsWith("female-profile") ||
      registrationStep.startsWith("male-profile")
    ) {
      const schemaMap = {
        "female-profile-2": getProfileSchema1("Female"),
        "female-profile-3": femaleProfileSchemaFinancial,
        "female-profile-4": getProfileSchema3("Female"),
        "female-profile-5": femaleProfileSchema4,
        "female-profile-goals": relationshipGoalsSchema,
        "female-profile-6": femaleProfileSchema5,
        "female-profile-7": femaleProfileSchema6,
        "female-profile-8": femaleProfileSchema7,
        "female-profile-9": femaleProfileSchema8,
        "female-profile-10": femaleProfileSchema9,
        "female-profile-11": femaleProfileSchemaPhotos,
        "male-profile-2": getProfileSchema1("Male"),
        "male-profile-3": getProfileSchema3("Male"),
        "male-profile-4": getProfileSchema3("Male"),
        "male-profile-goals": relationshipGoalsSchema,
        "male-profile-5": femaleProfileSchema4,
        "male-profile-6": femaleProfileSchema5,
        "male-profile-7": femaleProfileSchema6,
        "male-profile-8": femaleProfileSchema7,
        "male-profile-9": femaleProfileSchema8,
        "male-profile-10": femaleProfileSchema9,
        "male-profile-11": femaleProfileSchemaPhotos,
      }
      const schema = schemaMap[registrationStep as keyof typeof schemaMap]
      if (schema) {
        setFormErrors({}) //
      }
    }
  }, [registrationStep])

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

    setFormErrors({})
    setIsLoggingIn(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error("Login Failed", {
          description: data.error,
        })
        return
      }

      toast.success("Login Successful!")

      setUser(data.user)
      router.push("/dashboard")
    } catch (error) {
      console.error(error)

      toast.error("Something went wrong.", {
        description: "Please try again.",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleFinalRegistration = async () => {
    const result = passwordSchema.safeParse(passwordForm)
    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        errors[String(issue.path[0])] = issue.message
      }
      setFormErrors(errors)
      return
    }
    setFormErrors({})

    try {
      // 1. Check if email already exists
      const emailCheckResponse = await fetch(
        `/api/register-interest?email=${encodeURIComponent(detailsForm.email)}`
      )

      if (emailCheckResponse.ok) {
        const { isRegistered } = await emailCheckResponse.json()
        if (isRegistered) {
          toast.error("Registration Failed", {
            description: "This email address is already registered.",
          })
          return
        }
      } else {
        // If the check fails, maybe still proceed but log a warning
        console.warn("Email check failed, proceeding with registration anyway.")
      }

      // 2. Consolidate all user data from different steps
      const fullUserData = {
        details: {
          prefix,
          name: detailsForm.name,
          gender,
          dob: dob?.toISOString(),
          email: detailsForm.email,
          phone: fullPhoneNumber,
          nationality: locationForm.nationality,
          currentLocation: locationForm.currentLocation,
        },
        password: passwordForm.password,
        // Include profile and financial data for both genders
        profile: femaleProfileForm,
        relationshipGoals: relationshipGoalsForm,
        financial: financialForm,
      }

      // 3. Submit final registration data
      const registrationResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullUserData),
      })

      if (registrationResponse.ok) {
        toast.success("Registration Submitted!", {
          description:
            "Please check your email to verify your account and complete registration.",
        })
        setMode("login")
      } else {
        const contentType = registrationResponse.headers.get("content-type")
        let errorMessage = "An unknown error occurred."
        if (contentType && contentType.includes("application/json")) {
          const errorData = await registrationResponse.json()
          errorMessage = errorData.message || errorMessage
        } else {
          // The response is not JSON, so it might be an HTML error page.
          errorMessage =
            "The server returned an unexpected response. Please try again."
        }
        toast.error("Registration Failed", {
          description: errorMessage,
        })
      }
    } catch (error) {
      console.error("Registration process failed:", error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const animationVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  }

  const uploadImage = async (file: File) => {
    const formData = new FormData()

    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Upload failed")
    }

    return data.url
  }

  const submitApplicationForm = async () => {
    const result = femaleProfileSchemaPhotos.safeParse(photosForm)
    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        errors[String(issue.path[0])] = issue.message
      }
      setFormErrors(errors)
      return
    }
    setFormErrors({})
    setIsSubmittingApplication(true)
    try {
      const [headshotUrl, fullLengthUrl, casualLifestyleUrl, recentUrl] =
        await Promise.all([
          uploadImage(photosForm.headshot!),
          uploadImage(photosForm.fullLength!),
          uploadImage(photosForm.casualLifestyle!),
          uploadImage(photosForm.recent!),
        ])

      // The initial user data is now in state, no need to read from URL
      const detailsData = {
        ...initialUserData, // Keep any other properties from the initial step
        prefix: detailsForm.prefix,
        name: detailsForm.name,
        gender: gender,
        dob: dob?.toISOString(),
        email: detailsForm.email,
        phone: fullPhoneNumber,
        nationality: locationForm.nationality,
        currentLocation: locationForm.currentLocation,
      }

      const profileData = {
        ...femaleProfileForm,
      }

      const photosData = {
        headshot: headshotUrl,
        fullLength: fullLengthUrl,
        casualLifestyle: casualLifestyleUrl,
        recent: recentUrl,
      }

      const formData = {
        details: detailsData,
        profile: profileData,
        relationshipGoals: relationshipGoalsForm,
        financial: financialForm,
        photos: photosData,
      }

      const response = await fetch("/api/application-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Application submission failed")
      }

      toast.success("Application Submitted!", {
        description:
          "We have received your application and will review it shortly.",
      })

      setRegistrationStep("thank-you")
    } catch (error) {
      console.error("Application submit error:", error)

      toast.error("Submission Failed", {
        description:
          error instanceof Error
            ? error.message
            : "There was a problem submitting your application.",
      })
    } finally {
      setIsSubmittingApplication(false)
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
              Your journey to finding a soulmate starts here.
            </p>
            {mode === "register" && (
              <p className="mt-4 text-base text-muted-foreground">
                Complete this confidential application to begin your
                personalized matchmaking journey with our experts.
              </p>
            )}
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
            {mode === "register" && (
              <p className="mt-4 text-sm text-muted-foreground">
                Complete this confidential application to begin your
                personalized matchmaking journey with our experts.
              </p>
            )}
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
                            onChange={(e) =>
                              setLoginForm({
                                ...loginForm,
                                email: e.target.value
                                  .replace(/\s/g, "")
                                  .toLowerCase(),
                              })
                            }
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
                                  onChange={(e) =>
                                    setLoginForm({
                                      ...loginForm,
                                      password: e.target.value,
                                    })
                                  }
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
                  </form>
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
                          <CardTitle>Register Application Form</CardTitle>
                          <SimpleStepper
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          Create application form to start matchmaking.
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
                          {formErrors.prefix && (
                            <p className="col-start-1 text-sm text-destructive">
                              {formErrors.prefix}
                            </p>
                          )}
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
                            <Label htmlFor="dob">Date of Birth</Label>
                            <InputGroup>
                              <InputGroupAddon>
                                <Cake className="size-4" />
                              </InputGroupAddon>
                              <DatePickerInput
                                value={dob}
                                onSelect={setBirthday}
                              />
                            </InputGroup>
                            {formErrors.dob && (
                              <p className="text-sm text-destructive">
                                {formErrors.dob}
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
                                  <SelectValue placeholder="+66">
                                    {loadingCountries && phoneCountry === "TH"
                                      ? "+66"
                                      : `+${
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
                                  value={detailsForm.phone}
                                  onChange={(e) => {
                                    const { value } = e.target
                                    if (/^\d*$/.test(value)) {
                                      setDetailsForm((p) => ({
                                        ...p,
                                        phone: value,
                                      }))
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
                          onClick={() => {
                            //
                            const nextStep = {
                              Female: "female-profile-2",
                              Male: "male-profile-2",
                            }[gender] as "female-profile-2" | "male-profile-2"

                            validateAndSetStep(nextStep, detailsSchema, {
                              ...detailsForm,
                              prefix,
                              gender,
                              phone: fullPhoneNumber,
                              dob,
                              ...locationForm,
                            })
                          }}
                        >
                          Next
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
                {(registrationStep === "female-profile-2" ||
                  registrationStep === "male-profile-2") && (
                  <motion.div
                    key="female-profile"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Basic Info</CardTitle>
                          <SimpleStepper
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          This information is confidential and used only for
                          matchmaking.
                        </CardDescription>
                      </CardHeader>
                      <div className="px-6 pb-4">
                        <p className="text-sm text-muted-foreground">
                          Dear {prefix} {detailsForm.name}, if you want to edit
                          your profile details,
                          <button
                            type="button"
                            onClick={() => setRegistrationStep("details")}
                            className="ml-1 text-primary underline"
                          >
                            click here
                          </button>
                          .
                        </p>
                      </div>
                      <CardContent className="space-y-4">
                        {gender === "Female" && (
                          <div className="space-y-2">
                            <Label htmlFor="nickname">Nickname</Label>
                            <InputGroup>
                              <InputGroupAddon>
                                <User className="size-4" />
                              </InputGroupAddon>
                              <InputGroupInput
                                id="nickname"
                                placeholder="Your Nickname"
                                value={femaleProfileForm.nickname}
                                onChange={(e) =>
                                  setFemaleProfileForm({
                                    ...femaleProfileForm,
                                    nickname: e.target.value,
                                  })
                                }
                              />
                            </InputGroup>
                            {formErrors.nickname && (
                              <p className="text-sm text-destructive">
                                {formErrors.nickname}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <InputGroup>
                            <InputGroupAddon>
                              <Briefcase className="size-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="occupation"
                              placeholder="e.g. Doctor"
                              value={femaleProfileForm.occupation}
                              onChange={(e) =>
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  occupation: e.target.value,
                                }))
                              }
                            />
                          </InputGroup>
                          {formErrors.occupation && (
                            <p className="text-sm text-destructive">
                              {formErrors.occupation}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">
                            Company/Business/Industry
                          </Label>
                          <InputGroup>
                            <InputGroupAddon>
                              <Briefcase className="size-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="company"
                              placeholder="e.g. Tech"
                              value={femaleProfileForm.company}
                              onChange={(e) =>
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  company: e.target.value,
                                }))
                              }
                            />
                          </InputGroup>
                          {formErrors.company && (
                            <p className="text-sm text-destructive">
                              {formErrors.company}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="education">Education Level</Label>
                          <Select
                            onValueChange={(value) =>
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                education: value,
                              }))
                            }
                            value={femaleProfileForm.education}
                          >
                            <SelectTrigger
                              id="education"
                              className="h-8 bg-background dark:bg-input/30"
                            >
                              <SelectValue placeholder="Select education level" />
                            </SelectTrigger>
                            <SelectContent>
                              {educationLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formErrors.education && (
                            <p className="text-sm text-destructive">
                              {formErrors.education}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={() => {
                            const nextStep = (
                              gender === "Female"
                                ? "female-profile-3"
                                : "male-profile-3"
                            ) as "female-profile-3" | "male-profile-3"
                            validateAndSetStep(
                              nextStep,
                              getProfileSchema1(gender),
                              femaleProfileForm
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
                {(registrationStep === "female-profile-3" ||
                  registrationStep === "male-profile-3") && (
                  <motion.div
                    key="female-profile-2"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Appearance & Lifestyle</CardTitle>
                          <SimpleStepper //
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          This information is confidential and used only for
                          matchmaking.
                        </CardDescription>
                      </CardHeader>
                      {gender === "Male" && (
                        <CardContent>
                          <div className="space-y-2">
                            <Label>
                              Thai Fluency ({femaleProfileForm.thaiFluency}%)
                            </Label>
                            <Slider
                              value={femaleProfileForm.thaiFluency}
                              onValueChange={(value) =>
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  thaiFluency: value,
                                }))
                              }
                              max={100}
                              step={10}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Beginner</span>
                              <span>Intermediate</span>
                              <span>Fluent</span>
                            </div>
                          </div>
                        </CardContent>
                      )}
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>
                            English Fluency ({femaleProfileForm.englishFluency}
                            %)
                          </Label>
                          <Slider
                            value={femaleProfileForm.englishFluency}
                            onValueChange={(value) =>
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                englishFluency: value,
                              }))
                            }
                            max={100}
                            step={10}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Beginner</span>
                            <span>Intermediate</span>
                            <span>Fluent</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="height">Height (cm)</Label>
                            <InputGroup>
                              <InputGroupInput
                                id="height"
                                placeholder="e.g. 165"
                                value={femaleProfileForm.height}
                                onChange={(e) =>
                                  /^\d*\.?\d{0,2}$/.test(e.target.value) &&
                                  setFemaleProfileForm((prev) => ({
                                    ...prev,
                                    height: e.target.value,
                                  }))
                                }
                              />
                            </InputGroup>
                            {formErrors.height && (
                              <p className="text-sm text-destructive">
                                {formErrors.height}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <InputGroup>
                              <InputGroupInput
                                id="weight"
                                placeholder="e.g. 55.5"
                                value={femaleProfileForm.weight}
                                onChange={(e) =>
                                  /^\d*\.?\d{0,2}$/.test(e.target.value) &&
                                  setFemaleProfileForm((prev) => ({
                                    ...prev,
                                    weight: e.target.value,
                                  }))
                                }
                              />
                            </InputGroup>
                            {formErrors.weight && (
                              <p className="text-sm text-destructive">
                                {formErrors.weight}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="religion">Religion</Label>
                          <Select
                            onValueChange={(value) =>
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                religion: value,
                              }))
                            }
                            value={femaleProfileForm.religion}
                          >
                            <SelectTrigger
                              id="religion"
                              className="h-8 bg-background dark:bg-input/30"
                            >
                              <SelectValue placeholder="Select your religion" />
                            </SelectTrigger>
                            <SelectContent>
                              {religions.map((religion) => (
                                <SelectItem key={religion} value={religion}>
                                  {religion}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formErrors.religion && (
                            <p className="text-sm text-destructive">
                              {formErrors.religion}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={() => {
                            //
                            const nextStep = (
                              gender === "Female"
                                ? "female-profile-4"
                                : "male-profile-4"
                            ) as "female-profile-4" | "male-profile-4"
                            validateAndSetStep(
                              nextStep,
                              getProfileSchema3(gender),
                              femaleProfileForm
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
                {(registrationStep === "female-profile-4" ||
                  registrationStep === "male-profile-4") && (
                  <motion.div
                    key="female-profile-3"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>About You</CardTitle>
                          <SimpleStepper //
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          This information is confidential and used only for
                          matchmaking.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>My Personality (select all that apply)</Label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {personalityTraits.map((trait) => (
                              <div
                                key={trait}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`personality-${trait}`}
                                  checked={femaleProfileForm.personality.includes(
                                    trait
                                  )}
                                  onCheckedChange={(checked) => {
                                    setFemaleProfileForm((prev) => ({
                                      ...prev,
                                      personality: checked
                                        ? [...prev.personality, trait]
                                        : prev.personality.filter(
                                            (p) => p !== trait
                                          ),
                                    }))
                                  }}
                                />
                                <label
                                  htmlFor={`personality-${trait}`}
                                  className="text-sm leading-none font-medium"
                                >
                                  {trait}
                                </label>
                              </div>
                            ))}
                          </div>
                          {formErrors.personality && (
                            <p className="text-sm text-destructive">
                              {formErrors.personality}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Marital Status</Label>
                          <RadioGroup
                            value={femaleProfileForm.maritalStatus}
                            onValueChange={(value) =>
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                maritalStatus: value,
                              }))
                            }
                            className="flex space-x-4"
                          >
                            {maritalStatuses.map((status) => (
                              <div
                                key={status}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={status} id={status} />
                                <Label htmlFor={status}>{status}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {formErrors.maritalStatus && (
                            <p className="text-sm text-destructive">
                              {formErrors.maritalStatus}
                            </p>
                          )}
                        </div>
                        {femaleProfileForm.maritalStatus &&
                          femaleProfileForm.maritalStatus !==
                            "Never Married" && (
                            <div className="space-y-2">
                              <Label>Do you have children?</Label>
                              <div className="flex items-center gap-4">
                                <RadioGroup
                                  value={femaleProfileForm.hasChildren}
                                  onValueChange={(value) =>
                                    setFemaleProfileForm((prev) => ({
                                      ...prev,
                                      hasChildren: value,
                                      childrenCount:
                                        value === "No" ? 0 : prev.childrenCount,
                                    }))
                                  }
                                  className="flex space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="No"
                                      id="children-no"
                                    />
                                    <Label htmlFor="children-no">No</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="Yes"
                                      id="children-yes"
                                    />
                                    <Label htmlFor="children-yes">Yes</Label>
                                  </div>
                                </RadioGroup>
                                {femaleProfileForm.hasChildren === "Yes" && (
                                  <InputGroup className="w-28">
                                    <InputGroupInput
                                      id="children-count"
                                      placeholder="Count"
                                      type="number"
                                      min="1"
                                      value={
                                        femaleProfileForm.childrenCount > 0
                                          ? String(
                                              femaleProfileForm.childrenCount
                                            )
                                          : "" // Display nothing if count is 0
                                      }
                                      onChange={(e) =>
                                        setFemaleProfileForm((prev) => ({
                                          ...prev,
                                          childrenCount:
                                            parseInt(e.target.value) || 0,
                                        }))
                                      }
                                    />
                                  </InputGroup>
                                )}
                              </div>
                              {formErrors.childrenCount && (
                                <p className="text-sm text-destructive">
                                  {formErrors.childrenCount}
                                </p>
                              )}
                            </div>
                          )}
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={() => {
                            //
                            const nextStep = (
                              gender === "Female"
                                ? "female-profile-5"
                                : "male-profile-5"
                            ) as "female-profile-5" | "male-profile-5"
                            validateAndSetStep(
                              nextStep,
                              femaleProfileSchema4,
                              femaleProfileForm
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
                {(registrationStep === "female-profile-5" ||
                  registrationStep === "male-profile-5") && (
                  <motion.div
                    key="female-profile-4"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>About You</CardTitle>
                          <SimpleStepper //
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          This information is confidential and used only for
                          matchmaking.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="about-you">
                            Describe yourself in a few sentences
                          </Label>
                          <Textarea
                            id="about-you"
                            placeholder="Tell us about your personality, passions, and what makes you unique."
                            value={femaleProfileForm.about}
                            onChange={(e) =>
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                about: e.target.value,
                              }))
                            }
                          />
                          {formErrors.about && (
                            <p className="text-sm text-destructive">
                              {formErrors.about}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>What are your three best qualities?</Label>
                          {[0, 1, 2].map((index) => (
                            <InputGroup key={index}>
                              <InputGroupAddon className="w-10 justify-center">
                                {index + 1}
                              </InputGroupAddon>
                              <InputGroupInput
                                placeholder={bestQualitiesPlaceholders[index]}
                                value={femaleProfileForm.bestQualities[index]}
                                onChange={(e) => {
                                  const newQualities = [
                                    ...femaleProfileForm.bestQualities,
                                  ]
                                  newQualities[index] = e.target.value
                                  setFemaleProfileForm((prev) => ({
                                    ...prev,
                                    bestQualities: newQualities,
                                  }))
                                }}
                              />
                            </InputGroup>
                          ))}
                          {formErrors.bestQualities && (
                            <p className="text-sm text-destructive">
                              {formErrors.bestQualities}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>
                            What three qualities you look for in a man?
                          </Label>
                          {[0, 1, 2].map((index) => (
                            <InputGroup key={index}>
                              <InputGroupAddon className="w-10 justify-center">
                                {index + 1}
                              </InputGroupAddon>
                              <InputGroupInput
                                placeholder={
                                  lookingForQualitiesPlaceholders[index]
                                }
                                value={
                                  femaleProfileForm.lookingForQualities[index]
                                }
                                onChange={(e) => {
                                  const newQualities = [
                                    ...femaleProfileForm.lookingForQualities,
                                  ]
                                  newQualities[index] = e.target.value
                                  setFemaleProfileForm((prev) => ({
                                    ...prev,
                                    lookingForQualities: newQualities,
                                  }))
                                }}
                              />
                            </InputGroup>
                          ))}
                          {formErrors.lookingForQualities && (
                            <p className="text-sm text-destructive">
                              {formErrors.lookingForQualities}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={() => {
                            //
                            const nextStep =
                              gender === "Female"
                                ? "female-profile-goals"
                                : "male-profile-goals"
                            validateAndSetStep(
                              nextStep,
                              femaleProfileSchema5,
                              femaleProfileForm
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
                {(registrationStep === "female-profile-goals" ||
                  registrationStep === "male-profile-goals") && (
                  <motion.div
                    key="relationship-goals"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Relationship Goals</CardTitle>
                          <SimpleStepper
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          Tell us what you&apos;re looking for.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <Label>What are you looking for?</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {relationshipGoalsOptions.map((goal) => (
                              <div
                                key={goal}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`goal-${goal}`}
                                  checked={relationshipGoalsForm.lookingFor.includes(
                                    goal
                                  )}
                                  onCheckedChange={(checked) =>
                                    setRelationshipGoalsForm((prev) => ({
                                      ...prev,
                                      lookingFor: checked
                                        ? [...prev.lookingFor, goal]
                                        : prev.lookingFor.filter(
                                            (g) => g !== goal
                                          ),
                                    }))
                                  }
                                />
                                <Label htmlFor={`goal-${goal}`}>{goal}</Label>
                              </div>
                            ))}
                          </div>
                          {formErrors.lookingFor && (
                            <p className="text-sm text-destructive">
                              {formErrors.lookingFor}
                            </p>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Label>
                            Are you willing to relocate for the right partner?
                          </Label>
                          <RadioGroup
                            value={relationshipGoalsForm.relocate}
                            onValueChange={(value) =>
                              setRelationshipGoalsForm((prev) => ({
                                ...prev,
                                relocate: value,
                              }))
                            }
                            className="flex space-x-4"
                          >
                            {relocationOptions.map((option) => (
                              <div
                                key={option}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={option} id={option} />
                                <Label htmlFor={option}>{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {formErrors.relocate && (
                            <p className="text-sm text-destructive">
                              {formErrors.relocate}
                            </p>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Label>How soon would you like to settle down?</Label>
                          <RadioGroup
                            value={relationshipGoalsForm.settleDown}
                            onValueChange={(value) =>
                              setRelationshipGoalsForm((prev) => ({
                                ...prev,
                                settleDown: value,
                              }))
                            }
                            className="flex flex-col space-y-2"
                          >
                            {settleDownOptions.map((option) => (
                              <div
                                key={option}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={option} id={option} />
                                <Label htmlFor={option}>{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {formErrors.settleDown && (
                            <p className="text-sm text-destructive">
                              {formErrors.settleDown}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={() => {
                            const nextStep =
                              gender === "Female"
                                ? "female-profile-6"
                                : "male-profile-6"
                            validateAndSetStep(
                              nextStep,
                              relationshipGoalsSchema,
                              relationshipGoalsForm
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
                {(registrationStep === "female-profile-6" ||
                  registrationStep === "male-profile-6") && (
                  <motion.div
                    key="female-profile-5"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Lifestyle</CardTitle>
                          <SimpleStepper //
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          Tell us a bit about your lifestyle habits.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label>How would you describe your lifestyle?</Label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {lifestyleOptions.map((item) => (
                              <div
                                key={item}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`lifestyle-${item}`}
                                  checked={femaleProfileForm.lifestyle.includes(
                                    item
                                  )}
                                  onCheckedChange={(checked) => {
                                    setFemaleProfileForm((prev) => ({
                                      ...prev,
                                      lifestyle: checked
                                        ? [...prev.lifestyle, item]
                                        : prev.lifestyle.filter(
                                            (l) => l !== item
                                          ),
                                    }))
                                  }}
                                />
                                <label
                                  htmlFor={`lifestyle-${item}`}
                                  className="text-sm leading-none font-medium"
                                >
                                  {item}
                                </label>
                              </div>
                            ))}
                          </div>
                          {formErrors.lifestyle && (
                            <p className="text-sm text-destructive">
                              {formErrors.lifestyle}
                            </p>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Label>Do you smoke?</Label>
                          <RadioGroup
                            value={femaleProfileForm.smoking}
                            onValueChange={(value) =>
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                smoking: value,
                              }))
                            }
                            className="flex space-x-4"
                          >
                            {smokingHabits.map((habit) => (
                              <div
                                key={habit}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={habit} id={habit} />
                                <Label htmlFor={habit}>{habit}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {formErrors.smoking && (
                            <p className="text-sm text-destructive">
                              {formErrors.smoking}
                            </p>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Label>Do you drink alcohol?</Label>
                          <RadioGroup
                            value={femaleProfileForm.drinking}
                            onValueChange={(value) =>
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                drinking: value,
                              }))
                            }
                            className="flex flex-wrap gap-x-4 gap-y-2"
                          >
                            {drinkingHabits.map((habit) => (
                              <div
                                key={habit}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={habit} id={habit} />
                                <Label htmlFor={habit}>{habit}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {formErrors.drinking && (
                            <p className="text-sm text-destructive">
                              {formErrors.drinking}
                            </p>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Label>Exercise Frequency</Label>
                          <RadioGroup
                            value={femaleProfileForm.exercise}
                            onValueChange={(value) =>
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                exercise: value,
                              }))
                            }
                            className="flex flex-wrap gap-x-4 gap-y-2"
                          >
                            {exerciseFrequencies.map((freq) => (
                              <div
                                key={freq}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={freq} id={freq} />
                                <Label htmlFor={freq}>{freq}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {formErrors.exercise && (
                            <p className="text-sm text-destructive">
                              {formErrors.exercise}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={() => {
                            //
                            const nextStep = (
                              gender === "Female"
                                ? "female-profile-7"
                                : "male-profile-7"
                            ) as "female-profile-7" | "male-profile-7"
                            validateAndSetStep(
                              //
                              nextStep,
                              femaleProfileSchema6,
                              femaleProfileForm
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
                {(registrationStep === "female-profile-7" ||
                  registrationStep === "male-profile-7") && (
                  <motion.div
                    key="female-profile-6"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Interests & Hobbies</CardTitle>
                          <SimpleStepper //
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          Share what you love to do.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label>Select 5 that apply</Label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {[...interestsAndHobbies, "Other"].map((item) => (
                              <div
                                key={item}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`interest-${item}`}
                                  checked={femaleProfileForm.interests.includes(
                                    item
                                  )}
                                  disabled={
                                    femaleProfileForm.interests.length >= 5 &&
                                    !femaleProfileForm.interests.includes(item)
                                  }
                                  onCheckedChange={(checked) => {
                                    setFemaleProfileForm((prev) => {
                                      const newInterests = checked
                                        ? [...prev.interests, item]
                                        : prev.interests.filter(
                                            (i) => i !== item
                                          )
                                      return {
                                        ...prev,
                                        interests: newInterests,
                                      }
                                    })
                                  }}
                                />
                                <label
                                  htmlFor={`interest-${item}`}
                                  className="text-sm leading-none font-medium"
                                >
                                  {item}
                                </label>
                              </div>
                            ))}
                          </div>
                          {femaleProfileForm.interests.includes("Other") && (
                            <div className="pt-2">
                              <InputGroup>
                                <InputGroupInput
                                  placeholder="Please specify other interest"
                                  value={femaleProfileForm.otherInterest}
                                  onChange={(e) =>
                                    setFemaleProfileForm((prev) => ({
                                      ...prev,
                                      otherInterest: e.target.value,
                                    }))
                                  }
                                />
                              </InputGroup>
                            </div>
                          )}
                          {formErrors.interests && (
                            <p className="text-sm text-destructive">
                              {formErrors.interests}
                            </p>
                          )}
                          {formErrors.otherInterest && (
                            <p className="text-sm text-destructive">
                              {formErrors.otherInterest}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Favourite travel destinations (top 3)</Label>
                          {[0, 1, 2].map((index) => (
                            <InputGroup key={index}>
                              <InputGroupAddon className="w-10 justify-center">
                                {index + 1}
                              </InputGroupAddon>
                              <InputGroupInput
                                placeholder={
                                  travelDestinationsPlaceholders[index]
                                }
                                value={
                                  femaleProfileForm.travelDestinations[index]
                                }
                                onChange={(e) => {
                                  const newDestinations = [
                                    ...femaleProfileForm.travelDestinations,
                                  ]
                                  newDestinations[index] = e.target.value
                                  setFemaleProfileForm((prev) => ({
                                    ...prev,
                                    travelDestinations: newDestinations,
                                  }))
                                }}
                              />
                            </InputGroup>
                          ))}
                          {formErrors.travelDestinations && (
                            <p className="text-sm text-destructive">
                              {formErrors.travelDestinations}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weekend-activity">
                            Favourite way to spend a weekend
                          </Label>
                          <Textarea
                            id="weekend-activity"
                            placeholder="e.g., Reading a book, hiking, or trying new cafes..."
                            value={femaleProfileForm.weekendActivity}
                            onChange={(e) =>
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                weekendActivity: e.target.value,
                              }))
                            }
                          />
                          {formErrors.weekendActivity && (
                            <p className="text-sm text-destructive">
                              {formErrors.weekendActivity}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={() => {
                            //
                            const nextStep = (
                              gender === "Female"
                                ? "female-profile-8"
                                : "male-profile-8"
                            ) as "female-profile-8" | "male-profile-8"
                            validateAndSetStep(
                              nextStep,
                              femaleProfileSchema7,
                              femaleProfileForm
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
                {(registrationStep === "female-profile-8" ||
                  registrationStep === "male-profile-8") && (
                  <motion.div
                    key="female-profile-7"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Family & Values</CardTitle>
                          <SimpleStepper //
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          Share what's important to you.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <Label>How important is family?</Label>
                          <RadioGroup
                            value={femaleProfileForm.familyImportance}
                            onValueChange={(value) =>
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                familyImportance: value,
                              }))
                            }
                            className="flex flex-wrap gap-x-4 gap-y-2"
                          >
                            {familyImportanceOptions.map((option) => (
                              <div
                                key={option}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={option} id={option} />
                                <Label htmlFor={option}>{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {formErrors.familyImportance && (
                            <p className="text-sm text-destructive">
                              {formErrors.familyImportance}
                            </p>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Label>Would you like children in the future?</Label>
                          <RadioGroup
                            value={femaleProfileForm.futureChildren}
                            onValueChange={(value) =>
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                futureChildren: value,
                              }))
                            }
                            className="flex space-x-4"
                          >
                            {futureChildrenOptions.map((option) => (
                              <div
                                key={option}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={option} id={option} />
                                <Label htmlFor={option}>{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {formErrors.futureChildren && (
                            <p className="text-sm text-destructive">
                              {formErrors.futureChildren}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Most important values (choose 5)</Label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {valuesOptions.map((value) => (
                              <div
                                key={value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`value-${value}`}
                                  checked={femaleProfileForm.values.includes(
                                    value
                                  )}
                                  disabled={
                                    femaleProfileForm.values.length >= 5 &&
                                    !femaleProfileForm.values.includes(value)
                                  }
                                  onCheckedChange={(checked) => {
                                    setFemaleProfileForm((prev) => ({
                                      ...prev,
                                      values: checked
                                        ? [...prev.values, value]
                                        : prev.values.filter(
                                            (v) => v !== value
                                          ),
                                    }))
                                  }}
                                />
                                <label
                                  htmlFor={`value-${value}`}
                                  className="text-sm leading-none font-medium"
                                >
                                  {value}
                                </label>
                              </div>
                            ))}
                          </div>
                          {formErrors.values && (
                            <p className="text-sm text-destructive">
                              {formErrors.values}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={() => {
                            //
                            const nextStep = (
                              gender === "Female"
                                ? "female-profile-9"
                                : "male-profile-9"
                            ) as "female-profile-9" | "male-profile-9"
                            validateAndSetStep(
                              nextStep,
                              femaleProfileSchema8,
                              femaleProfileForm
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
                {(registrationStep === "female-profile-9" ||
                  registrationStep === "male-profile-9") && (
                  <motion.div
                    key="female-profile-8"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Your Ideal Partner</CardTitle>
                          <SimpleStepper //
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          Describe the qualities you're looking for in a
                          partner.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="ideal-age-range">Age Range</Label>
                            <Select
                              onValueChange={(value) =>
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  idealPartnerAgeRange: value,
                                }))
                              }
                              value={femaleProfileForm.idealPartnerAgeRange}
                            >
                              <SelectTrigger
                                id="ideal-age-range"
                                className="h-8 bg-background dark:bg-input/30"
                              >
                                <SelectValue placeholder="Select age range" />
                              </SelectTrigger>
                              <SelectContent>
                                {idealPartnerAgeRanges.map((range) => (
                                  <SelectItem key={range} value={range}>
                                    {range}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.idealPartnerAgeRange && (
                              <p className="text-sm text-destructive">
                                {formErrors.idealPartnerAgeRange}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ideal-height">
                              Preferred Height
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  idealPartnerHeight: value,
                                }))
                              }
                              value={femaleProfileForm.idealPartnerHeight}
                            >
                              <SelectTrigger
                                id="ideal-height"
                                className="h-8 bg-background dark:bg-input/30"
                              >
                                <SelectValue placeholder="Select height" />
                              </SelectTrigger>
                              <SelectContent>
                                {idealPartnerHeights.map((height) => (
                                  <SelectItem key={height} value={height}>
                                    {height}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.idealPartnerHeight && (
                              <p className="text-sm text-destructive">
                                {formErrors.idealPartnerHeight}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="ideal-nationality">
                              Preferred Nationality
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  idealPartnerNationality: value,
                                }))
                              }
                              value={femaleProfileForm.idealPartnerNationality}
                            >
                              <SelectTrigger
                                id="ideal-nationality"
                                className="h-8 bg-background dark:bg-input/30"
                              >
                                <SelectValue placeholder="Select nationality" />
                              </SelectTrigger>
                              <SelectContent>
                                {idealPartnerNationalities.map((nat) => (
                                  <SelectItem key={nat} value={nat}>
                                    {nat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.idealPartnerNationality && (
                              <p className="text-sm text-destructive">
                                {formErrors.idealPartnerNationality}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ideal-location">
                              Preferred Location
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  idealPartnerLocation: value,
                                }))
                              }
                              value={femaleProfileForm.idealPartnerLocation}
                            >
                              <SelectTrigger
                                id="ideal-location"
                                className="h-8 bg-background dark:bg-input/30"
                              >
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                              <SelectContent>
                                {idealPartnerNationalities.map((loc) => (
                                  <SelectItem key={loc} value={loc}>
                                    {loc}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.idealPartnerLocation && (
                              <p className="text-sm text-destructive">
                                {formErrors.idealPartnerLocation}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ideal-education">
                            Education Preference
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                idealPartnerEducation: value,
                              }))
                            }
                            value={femaleProfileForm.idealPartnerEducation}
                          >
                            <SelectTrigger
                              id="ideal-education"
                              className="h-8 bg-background dark:bg-input/30"
                            >
                              <SelectValue placeholder="Select education" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...educationLevels, "Not Important"].map(
                                (edu) => (
                                  <SelectItem key={edu} value={edu}>
                                    {edu}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          {formErrors.idealPartnerEducation && (
                            <p className="text-sm text-destructive">
                              {formErrors.idealPartnerEducation}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Personality traits (choose 5)</Label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {[...idealPartnerPersonalityTraits, "Other"].map(
                              (trait) => (
                                <div
                                  key={trait}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`ideal-personality-${trait}`}
                                    checked={femaleProfileForm.idealPartnerPersonality.includes(
                                      trait
                                    )}
                                    disabled={
                                      femaleProfileForm.idealPartnerPersonality
                                        .length >= 5 &&
                                      !femaleProfileForm.idealPartnerPersonality.includes(
                                        trait
                                      )
                                    }
                                    onCheckedChange={(checked) => {
                                      setFemaleProfileForm((prev) => ({
                                        ...prev,
                                        idealPartnerPersonality: checked
                                          ? [
                                              ...prev.idealPartnerPersonality,
                                              trait,
                                            ]
                                          : prev.idealPartnerPersonality.filter(
                                              (p) => p !== trait
                                            ),
                                      }))
                                    }}
                                  />
                                  <label
                                    htmlFor={`ideal-personality-${trait}`}
                                    className="text-sm leading-none font-medium"
                                  >
                                    {trait}
                                  </label>
                                </div>
                              )
                            )}
                          </div>
                          {formErrors.idealPartnerPersonality && (
                            <p className="text-sm text-destructive">
                              {formErrors.idealPartnerPersonality}
                            </p>
                          )}
                          {femaleProfileForm.idealPartnerPersonality.includes(
                            "Other"
                          ) && (
                            <div className="pt-2">
                              <InputGroup>
                                <InputGroupInput
                                  placeholder="Please specify other trait"
                                  value={
                                    femaleProfileForm.idealPartnerOtherPersonality
                                  }
                                  onChange={(e) =>
                                    setFemaleProfileForm((prev) => ({
                                      ...prev,
                                      idealPartnerOtherPersonality:
                                        e.target.value,
                                    }))
                                  }
                                />
                              </InputGroup>
                              {formErrors.idealPartnerOtherPersonality && (
                                <p className="text-sm text-destructive">
                                  {formErrors.idealPartnerOtherPersonality}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Desired Qualities (choose 5)</Label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {idealPartnerDesiredQualities.map((quality) => (
                              <div
                                key={quality}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`ideal-quality-${quality}`}
                                  checked={femaleProfileForm.idealPartnerQualities.includes(
                                    quality
                                  )}
                                  disabled={
                                    femaleProfileForm.idealPartnerQualities
                                      .length >= 5 &&
                                    !femaleProfileForm.idealPartnerQualities.includes(
                                      quality
                                    )
                                  }
                                  onCheckedChange={(checked) => {
                                    setFemaleProfileForm((prev) => ({
                                      ...prev,
                                      idealPartnerQualities: checked
                                        ? [
                                            ...prev.idealPartnerQualities,
                                            quality,
                                          ]
                                        : prev.idealPartnerQualities.filter(
                                            (q) => q !== quality
                                          ),
                                    }))
                                  }}
                                />
                                <label
                                  htmlFor={`ideal-quality-${quality}`}
                                  className="text-sm leading-none font-medium"
                                >
                                  {quality}
                                </label>
                              </div>
                            ))}
                          </div>
                          {formErrors.idealPartnerQualities && (
                            <p className="text-sm text-destructive">
                              {formErrors.idealPartnerQualities}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Deal Breakers (list 3)</Label>
                          {[
                            "e.g. Dishonesty",
                            "e.g. Smoker",
                            "e.g. Poor hygiene",
                          ].map((placeholder, index) => (
                            <InputGroup key={index}>
                              <InputGroupAddon className="w-10 justify-center">
                                {index + 1}
                              </InputGroupAddon>
                              <InputGroupInput
                                placeholder={placeholder}
                                value={femaleProfileForm.dealBreakers[index]}
                                onChange={(e) => {
                                  const newDealBreakers = [
                                    ...femaleProfileForm.dealBreakers,
                                  ]
                                  newDealBreakers[index] = e.target.value
                                  setFemaleProfileForm((prev) => ({
                                    ...prev,
                                    dealBreakers: newDealBreakers,
                                  }))
                                }}
                              />
                            </InputGroup>
                          ))}
                          {formErrors.dealBreakers && (
                            <p className="text-sm text-destructive">
                              {formErrors.dealBreakers}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={() => {
                            //
                            const nextStep = (
                              gender === "Female"
                                ? "female-profile-10"
                                : "male-profile-10"
                            ) as "female-profile-10" | "male-profile-10"
                            validateAndSetStep(
                              nextStep,
                              femaleProfileSchema9,
                              femaleProfileForm
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
                {(registrationStep === "female-profile-10" ||
                  registrationStep === "male-profile-10") && (
                  <motion.div
                    key="female-profile-financial"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Financial & Career</CardTitle>
                          <SimpleStepper
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          This information is confidential and used only for
                          matchmaking.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <Label>Annual Income Range (USD)</Label>
                          <RadioGroup
                            value={financialForm.income}
                            onValueChange={(value) =>
                              setFinancialForm((prev) => ({
                                ...prev,
                                income: value,
                              }))
                            }
                          >
                            {[
                              "Prefer Not To Say",
                              "Under $25,000",
                              "$25,000 - $50,000",
                              "$50,000 - $100,000",
                              "$100,000 - $250,000",
                              "$250,000+",
                            ].map((range) => (
                              <div
                                key={range}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={range} id={range} />
                                <Label htmlFor={range}>{range}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {formErrors.income && (
                            <p className="text-sm text-destructive">
                              {formErrors.income}
                            </p>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Label>Do you own property?</Label>
                          <RadioGroup
                            className="flex space-x-4"
                            value={financialForm.ownProperty}
                            onValueChange={(value) =>
                              setFinancialForm((prev) => ({
                                ...prev,
                                ownProperty: value,
                              }))
                            }
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Yes" id="prop-yes" />
                              <Label htmlFor="prop-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="No" id="prop-no" />
                              <Label htmlFor="prop-no">No</Label>
                            </div>
                          </RadioGroup>
                          {formErrors.ownProperty && (
                            <p className="text-sm text-destructive">
                              {formErrors.ownProperty}
                            </p>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Label>Do you own a business?</Label>
                          <RadioGroup
                            className="flex space-x-4"
                            value={financialForm.ownBusiness}
                            onValueChange={(value) =>
                              setFinancialForm((prev) => ({
                                ...prev,
                                ownBusiness: value,
                              }))
                            }
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Yes" id="biz-yes" />
                              <Label htmlFor="biz-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="No" id="biz-no" />
                              <Label htmlFor="biz-no">No</Label>
                            </div>
                          </RadioGroup>
                          {formErrors.ownBusiness && (
                            <p className="text-sm text-destructive">
                              {formErrors.ownBusiness}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={() => {
                            //
                            const nextStep = (
                              gender === "Female"
                                ? "female-profile-11"
                                : "male-profile-11"
                            ) as "female-profile-11" | "male-profile-11"
                            validateAndSetStep(
                              nextStep,
                              femaleProfileSchemaFinancial,
                              financialForm
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
                {(registrationStep === "female-profile-11" ||
                  registrationStep === "male-profile-11") && (
                  <motion.div
                    key="female-profile-photos"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Photos</CardTitle>
                          <SimpleStepper
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          Please provide: All within 6 months.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FileInput
                          label="Headshot"
                          file={photosForm.headshot}
                          onFileChange={(file) =>
                            setPhotosForm((p) => ({ ...p, headshot: file }))
                          }
                          error={formErrors.headshot}
                          disabled={isSubmittingApplication}
                        />
                        <FileInput
                          label="Full-Length Photo"
                          file={photosForm.fullLength}
                          onFileChange={(file) =>
                            setPhotosForm((p) => ({ ...p, fullLength: file }))
                          }
                          error={formErrors.fullLength}
                          disabled={isSubmittingApplication}
                        />
                        <FileInput
                          label="Casual Lifestyle Photo"
                          file={photosForm.casualLifestyle}
                          onFileChange={(file) =>
                            setPhotosForm((p) => ({
                              ...p,
                              casualLifestyle: file,
                            }))
                          }
                          error={formErrors.casualLifestyle}
                          disabled={isSubmittingApplication}
                        />
                        <FileInput
                          label="Recent Photo"
                          file={photosForm.recent}
                          onFileChange={(file) =>
                            setPhotosForm((p) => ({ ...p, recent: file }))
                          }
                          error={formErrors.recent}
                          disabled={isSubmittingApplication}
                        />
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          disabled={isSubmittingApplication}
                          onClick={submitApplicationForm}
                        >
                          {isSubmittingApplication ? (
                            <>
                              <Spinner className="mr-2" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
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
                {registrationStep === "thank-you" && (
                  <motion.div
                    key="thank-you"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Thank You!</CardTitle>
                          <SimpleStepper
                            steps={getRegistrationSteps(gender)}
                            currentStep={registrationStep}
                          />
                        </div>
                        <CardDescription>
                          Your registration has been submitted successfully.
                        </CardDescription>
                      </CardHeader>
                      {detailsForm.name && (
                        <div className="px-6 pb-0">
                          <p>
                            Dear {prefix} {detailsForm.name},
                          </p>
                        </div>
                      )}
                      <CardContent className="space-y-4 text-center">
                        <motion.div
                          className="flex justify-center"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2,
                          }}
                        >
                          <CheckCircle className="size-16 text-green-500" />
                        </motion.div>
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <Badge className="flex items-center gap-2 border-yellow-500/50 bg-yellow-400/20 text-yellow-700 dark:text-yellow-400">
                            <Clock className="size-4 animate-spin" />
                            Status: Reviewing
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          We have received your application and our team will
                          review it shortly.
                        </p>
                        <p className="text-muted-foreground">
                          Stay tuned! We will contact you for the next steps via
                          email or a WhatsApp call.
                        </p>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4">
                        <Button
                          className="btn-gradient w-full"
                          onClick={() => {
                            router.replace("/")
                          }}
                        >
                          Back to Home
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
                {registrationStep === "verify-email" && (
                  <motion.div
                    key="register-verify-email" //
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
                            steps={getRegistrationSteps(gender)}
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
                                  if (value.length === 6) {
                                    clearFormError("code")
                                  }
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
                          onClick={() => {
                            const result = verificationCodeSchema.safeParse({
                              code: verificationCode,
                            })
                            if (!result.success) {
                              const errors: Record<string, string> = {}
                              for (const issue of result.error.issues) {
                                errors[String(issue.path[0])] = issue.message
                              }
                              setFormErrors(errors)
                              return
                            }
                            setRegistrationStep("password")
                            setFormErrors({})
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
                            steps={getRegistrationSteps(gender)}
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

function FileInput({
  label,
  file,
  onFileChange,
  error,
  disabled,
}: {
  label: string
  file: File | null
  onFileChange: (file: File | null) => void
  error?: string
  disabled?: boolean
}) {
  const id = label.toLowerCase().replace(/\s/g, "-")
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={disabled ? "text-muted-foreground" : ""}>
        {label}
      </Label>
      <InputGroup>
        <InputGroupAddon
          className={disabled ? "cursor-not-allowed text-muted-foreground" : ""}
        >
          <Upload className="size-4" />
        </InputGroupAddon>
        <div className="relative flex-1">
          <InputGroupInput
            id={`${id}-display`}
            readOnly
            value={file ? file.name : ""}
            placeholder="Choose a file..."
            className={disabled ? "cursor-not-allowed" : "cursor-pointer pr-16"}
            disabled={disabled}
          />
          <label
            htmlFor={id}
            className={`absolute inset-0 ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          ></label>
          <input
            id={id}
            type="file"
            className="sr-only"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            accept="image/png, image/jpeg, image/webp" //
            disabled={disabled}
          />
          {file && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onFileChange(null)}
              disabled={disabled}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-destructive/80 hover:text-destructive"
            >
              <X className="size-4" />
              <span className="sr-only">Clear file</span>
            </Button>
          )}
        </div>
      </InputGroup>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
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
