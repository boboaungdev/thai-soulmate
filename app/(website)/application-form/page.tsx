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
  CheckCircle2,
  ChevronsUpDown,
  Check,
  Cigarette,
  ShieldOff,
  Waves,
  Baby,
  Wine,
  Scale,
  MapPinOff,
  CircleDollarSign,
  TrendingDown,
  Frown,
  Landmark,
} from "lucide-react"
import {
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  Anchor,
  Users,
  SmilePlus,
  Brain,
  Star,
  Heart,
  Home,
  MessageSquare,
  Handshake,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, forwardRef, useEffect, Suspense } from "react"
import * as PasswordToggleField from "@radix-ui/react-password-toggle-field"
import { motion, AnimatePresence } from "framer-motion"
import { DateOfBirthInput } from "@/components/ui/date-of-birth-input"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"

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

const idealPartnerMinAgeOptions = [
  ...new Set(idealPartnerAgeRanges.map((range) => range.split("-")[0])),
]

const idealPartnerMaxAgeOptions = [
  ...new Set(
    idealPartnerAgeRanges
      .map((range) => {
        const parts = range.split("-")
        // Only return the second part if it's a true range (e.g., "56-63")
        return parts.length > 1 ? parts[1] : null
      })
      .filter((v): v is string => v !== null)
  ),
]

const idealPartnerNationalities = [
  "USA",
  "UK",
  "AUS",
  "EUROPEAN",
  "FRANCE", // Added France
  "ASIAN",
  "INDIAN",
  "AFRICAN",
  "OTHER",
]

const idealPartnerHeightRanges = [
  "150-155",
  "156-160",
  "161-165",
  "166-170",
  "171-175",
  "176-180",
  "181-185",
  "186-190",
  "191-195",
  "196-200",
  "200+",
]

const idealPartnerMinHeightOptions = [
  ...new Set(idealPartnerHeightRanges.map((range) => range.split("-")[0])),
]

const idealPartnerMaxHeightOptions = [
  ...new Set(
    idealPartnerHeightRanges
      .map((range) => {
        const parts = range.split("-")
        return parts.length > 1 ? parts[1] : null
      })
      .filter((v): v is string => v !== null)
  ),
]

const idealPartnerWeightRanges = [
  "40-45",
  "46-50",
  "51-55",
  "56-60",
  "61-65",
  "66-70",
  "71-75",
  "76-80",
  "81-85",
  "86-90",
  "91-95",
  "96-100",
  "100+",
]

const idealPartnerMinWeightOptions = [
  ...new Set(idealPartnerWeightRanges.map((range) => range.split("-")[0])),
]

const idealPartnerMaxWeightOptions = [
  ...new Set(
    idealPartnerWeightRanges
      .map((range) => {
        const parts = range.split("-")
        return parts.length > 1 ? parts[1] : null
      })
      .filter((v): v is string => v !== null)
  ),
]

const cmToFeetInches = (cm: number | string): string => {
  if (typeof cm === "string" && cm.includes("+")) {
    const numValue = parseInt(cm.replace("+", ""), 10)
    if (isNaN(numValue)) return ""
    const totalInches = numValue / 2.54
    const feet = Math.floor(totalInches / 12)
    const inches = Math.round(totalInches % 12)
    if (inches === 12) {
      return `(${feet + 1}'0"+)`
    }
    return `(${feet}'${inches}"+)`
  }

  const numCm = typeof cm === "string" ? parseInt(cm, 10) : cm
  if (isNaN(numCm)) return ""

  const totalInches = numCm / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)

  if (feet <= 0 && inches <= 0) return ""
  if (inches === 12) {
    return `(${feet + 1}'0")`
  }

  return `(${feet}'${inches}")`
}

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

const bestQualitiesOptions = [
  "Honest",
  "Kind",
  "Ambitious",
  "Loyal",
  "Supportive",
  "Funny",
  "Intelligent",
  "Confident",
  "Romantic",
  "Family-Oriented",
]

const lookingForQualitiesOptions = [
  "Honest",
  "Loyal",
  "Supportive",
  "Ambitious",
  "Confident",
  "Funny",
  "Kind",
  "Intelligent",
  "Communicative",
  "Respectful",
  "Family-Oriented",
]

const dealBreakerOptions = [
  { value: "Smoker", label: "Smoker", icon: Cigarette },
  { value: "Dishonesty", label: "Dishonesty", icon: ShieldOff },
  { value: "Poor hygiene", label: "Poor hygiene", icon: Waves },
  { value: "Has children", label: "Has children", icon: Baby },
  { value: "Heavy drinker", label: "Heavy drinker", icon: Wine },
  {
    value: "Political differences",
    label: "Political differences",
    icon: Scale,
  },
  { value: "Long distance", label: "Long distance", icon: MapPinOff },
  {
    value: "Financial instability",
    label: "Financial instability",
    icon: CircleDollarSign,
  },
  { value: "Lack of ambition", label: "Lack of ambition", icon: TrendingDown },
  { value: "Rudeness", label: "Rudeness", icon: Frown },
  { value: "Not religious", label: "Not religious", icon: Landmark },
]

const qualityIcons: Record<string, React.ElementType> = {
  Honest: ShieldCheck,
  Kind: HeartHandshake,
  Ambitious: TrendingUp,
  Loyal: Anchor,
  Supportive: Users,
  Funny: SmilePlus,
  Intelligent: Brain,
  Confident: Star,
  Romantic: Heart,
  "Family-Oriented": Home,
  Communicative: MessageSquare,
  Respectful: Handshake,
}

const relationshipGoalsOptions = [
  "Marriage",
  // "Long-Term Relationship",
  "Serious Dating",
  "Companionship",
  "Open to Possibilities",
]

const relocationOptions = ["Yes", "No", "Maybe"]

const settleDownOptions = ["Within 1 Year", "1–3 Years", "No Specific Timeline"]

const registrationSteps = [
  { id: "details", name: "Details & Location" },
  { id: "basic-info", name: "Basic Info" },
  { id: "appearance", name: "Appearance & Lifestyle" },
  { id: "background", name: "About You" },
  { id: "about", name: "About You" },
  { id: "relationship-goals", name: "Relationship Goals" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "interests", name: "Interests & Hobbies" },
  { id: "family-values", name: "Family & Values" },
  { id: "ideal-partner", name: "Ideal Partner" },
  { id: "financial", name: "Financial & Career" },
  { id: "photos", name: "Photos" },
  { id: "thank-you", name: "Thank You" },
  { id: "verify-email", name: "Verification" },
  { id: "password", name: "Password" },
] as const

type ApplicationStep = (typeof registrationSteps)[number]["id"]

const getPreviousStep = (currentStep: ApplicationStep) => {
  const currentStepIndex = registrationSteps.findIndex(
    (step) => step.id === currentStep
  )
  return registrationSteps[Math.max(currentStepIndex - 1, 0)]?.id ?? "details"
}

function SimpleStepper({
  steps,
  currentStep,
}: {
  steps: readonly { id: string; name: string }[]
  currentStep: string
}) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  if (currentStepIndex === -1) {
    return null
  }

  return (
    <Badge variant="outline" className="font-medium">
      {`Step ${currentStepIndex + 1} of ${steps.length - 2}`}
    </Badge>
  )
}

function AuthPageContents() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [initialUserData, setInitialUserData] = useState<any | null>(null)
  const [registrationStep, setRegistrationStep] =
    useState<ApplicationStep>("details")

  const travelDestinationsPlaceholders = [
    "e.g. Paris",
    "e.g. Tokyo",
    "e.g. New York",
  ]

  const [prefix, setPrefix] = useState("Mr.")
  const [gender, setGender] = useState("Male")
  const [dob, setBirthday] = useState<Date>()
  const [countdown, setCountdown] = useState(0)
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const [openNationality, setOpenNationality] = useState(false)
  const [openCurrentLocation, setOpenCurrentLocation] = useState(false)
  const [openPhoneCountry, setOpenPhoneCountry] = useState(false)
  const [agreements, setAgreements] = useState({
    realData: false,
    privacyPolicy: false,
    termsOfService: false,
  })
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
    idealPartnerWeight: "",
    idealPartnerEducation: "",
    idealPartnerPersonality: [] as string[],
    idealPartnerOtherPersonality: "",
    idealPartnerQualities: [] as string[],
    dealBreakers: ["", "", ""],
  })
  const [idealPartnerMinAge, setIdealPartnerMinAge] = useState("")
  const [idealPartnerMaxAge, setIdealPartnerMaxAge] = useState("")
  const [idealPartnerMinHeight, setIdealPartnerMinHeight] = useState("")
  const [idealPartnerMaxHeight, setIdealPartnerMaxHeight] = useState("")
  const [idealPartnerMinWeight, setIdealPartnerMinWeight] = useState("")
  const [idealPartnerMaxWeight, setIdealPartnerMaxWeight] = useState("")
  const [financialForm, setFinancialForm] = useState({
    ownProperty: "",
    ownBusiness: "",
  })
  const [photosForm, setPhotosForm] = useState<{
    headshot: File | null
    fullLength: File | null
    casualLifestyle: File | null
  }>({
    headshot: null,
    fullLength: null,
    casualLifestyle: null,
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

  const allAgreed =
    agreements.realData && agreements.privacyPolicy && agreements.termsOfService
  const someAgreed = Object.values(agreements).some(Boolean)

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
  const [isInitializing, setIsInitializing] = useState(true)
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false)
  const [detailsForm, setDetailsForm] = useState({
    prefix: "Mr.",
    firstName: "",
    lastName: "",
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
      setIsInitializing(true)

      const userEmail = searchParams.get("email")

      if (!userEmail || initialRedirectDone) {
        setIsInitializing(false)
        return
      }

      const prefillEmail = () => {
        setInitialUserData({ email: userEmail })
        setDetailsForm((prev) => ({
          ...prev,
          email: userEmail,
        }))
      }

      const prefillInterestData = (interestData: any) => {
        setInitialUserData(interestData)

        if (interestData.prefix) setPrefix(interestData.prefix)
        if (interestData.gender) setGender(interestData.gender)
        if (interestData.dob) setBirthday(new Date(interestData.dob))

        const [firstName = "", ...lastParts] = (interestData.name ?? "")
          .trim()
          .split(" ")

        setDetailsForm((prev) => ({
          ...prev,
          firstName,
          lastName: lastParts.join(" "),
          email: interestData.email ?? prev.email,
          phone: interestData.phone ?? prev.phone,
        }))

        setLocationForm((prev) => ({
          ...prev,
          nationality: interestData.nationality ?? prev.nationality,
          currentLocation: interestData.currentLocation ?? prev.currentLocation,
        }))

        if (interestData.phoneCountry) {
          const country = countries.find(
            (c) =>
              c.callCode === interestData.phoneCountry ||
              `+${c.callCode}` === interestData.phoneCountry
          )

          if (country) {
            setPhoneCountry(country.code)
          }
        }
      }

      try {
        const [interestResponse, applicationResponse] = await Promise.all([
          fetch(
            `/api/register-interest/check?email=${encodeURIComponent(userEmail)}`
          ),
          fetch(
            `/api/application-form/check?email=${encodeURIComponent(userEmail)}`
          ),
        ])

        if (!interestResponse.ok || !applicationResponse.ok) {
          throw new Error("Failed to initialize application.")
        }

        const [interestResult, applicationResult] = await Promise.all([
          interestResponse.json(),
          applicationResponse.json(),
        ])

        console.log({
          interestResult,
          applicationResult,
        })

        // User has already completed the application
        if (applicationResult.exists) {
          if (interestResult.exists) {
            prefillInterestData(interestResult.interest)
          } else {
            prefillEmail()
          }

          setRegistrationStep("thank-you")
        }

        // User registered interest but hasn't completed application
        else if (interestResult.exists) {
          prefillInterestData(interestResult.interest)
          setRegistrationStep("basic-info")
        }

        // New user
        else {
          prefillEmail()
        }

        setInitialRedirectDone(true)
      } catch (error) {
        console.error("Error during application initialization:", error)

        toast.error("Could not initialize registration.", {
          description: "Please try again later.",
        })
      } finally {
        setIsInitializing(false)
      }
    }

    if (!loadingCountries) {
      initializeApplication()
    }
  }, [searchParams, initialRedirectDone, countries, loadingCountries])

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
    step: ApplicationStep,
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

  const detailsSchema = z.object({
    prefix: z.string().min(1, "Prefix is required."),
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
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
        .length(5, "Please select exactly 5 personality traits."),
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
      idealPartnerWeight: z.string().min(1, "Please select a weight range."),
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
        .length(3, "Please select 3 deal breakers.")
        .refine((items) => items.every((item) => item.trim().length > 0), {
          message: "Please select three deal breakers.",
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

  const isVerificationCodeFormValid = verificationCodeSchema.safeParse({
    code: verificationCode,
  }).success
  const isPasswordFormValid = passwordSchema.safeParse(passwordForm).success

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

  useEffect(() => {
    if (registrationStep === "basic-info" && formErrors.nickname) {
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
    if (registrationStep === "basic-info" && formErrors.occupation) {
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
    if (registrationStep === "basic-info" && formErrors.company) {
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
    if (registrationStep === "basic-info" && formErrors.education) {
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
    if (registrationStep === "appearance" && formErrors.height) {
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
    if (registrationStep === "appearance" && formErrors.weight) {
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
    if (registrationStep === "appearance" && formErrors.religion) {
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
    if (registrationStep === "appearance" && formErrors.thaiFluency) {
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
    if (registrationStep === "background" && formErrors.personality) {
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
    if (registrationStep === "background" && formErrors.childrenCount) {
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
    if (registrationStep === "about" && formErrors.about) {
      if (femaleProfileForm.about.length >= 10) {
        clearFormError("about")
      }
    }
  }, [femaleProfileForm.about, registrationStep, formErrors.about])

  useEffect(() => {
    if (registrationStep === "about" && formErrors.bestQualities) {
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
    if (registrationStep === "about" && formErrors.lookingForQualities) {
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
    if (registrationStep === "relationship-goals" && formErrors.lookingFor) {
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
    if (registrationStep === "relationship-goals" && formErrors.relocate) {
      if (relationshipGoalsForm.relocate) {
        clearFormError("relocate")
      }
    }
  }, [relationshipGoalsForm.relocate, registrationStep, formErrors.relocate])

  useEffect(() => {
    if (registrationStep === "relationship-goals" && formErrors.settleDown) {
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
    if (registrationStep === "about" && formErrors.lookingForQualities) {
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
    if (registrationStep === "lifestyle" && formErrors.lifestyle) {
      if (femaleProfileForm.lifestyle.length > 0) {
        clearFormError("lifestyle")
      }
    }
  }, [femaleProfileForm.lifestyle, registrationStep, formErrors.lifestyle])

  useEffect(() => {
    if (registrationStep === "lifestyle" && formErrors.smoking) {
      if (femaleProfileForm.smoking) {
        clearFormError("smoking")
      }
    }
  }, [femaleProfileForm.smoking, registrationStep, formErrors.smoking])

  useEffect(() => {
    if (registrationStep === "lifestyle" && formErrors.drinking) {
      if (femaleProfileForm.drinking) {
        clearFormError("drinking")
      }
    }
  }, [femaleProfileForm.drinking, registrationStep, formErrors.drinking])

  useEffect(() => {
    if (registrationStep === "lifestyle" && formErrors.exercise) {
      if (femaleProfileForm.exercise) {
        clearFormError("exercise")
      }
    }
  }, [femaleProfileForm.exercise, registrationStep, formErrors.exercise])

  useEffect(() => {
    if (registrationStep === "interests" && formErrors.interests) {
      if (femaleProfileForm.interests.length === 5) {
        clearFormError("interests")
      }
    }
  }, [femaleProfileForm.interests, registrationStep, formErrors.interests])

  useEffect(() => {
    if (registrationStep === "interests" && formErrors.otherInterest) {
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
    if (registrationStep === "interests" && formErrors.travelDestinations) {
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
    if (registrationStep === "interests" && formErrors.weekendActivity) {
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
    if (registrationStep === "family-values" && formErrors.familyImportance) {
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
    if (registrationStep === "family-values" && formErrors.futureChildren) {
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
    if (registrationStep === "family-values" && formErrors.values) {
      if (femaleProfileForm.values.length === 5) {
        clearFormError("values")
      }
    }
  }, [femaleProfileForm.values, registrationStep, formErrors.values])

  useEffect(() => {
    if (
      registrationStep === "ideal-partner" &&
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
      registrationStep === "ideal-partner" &&
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
      registrationStep === "ideal-partner" &&
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
    if (registrationStep === "ideal-partner" && formErrors.idealPartnerHeight) {
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
    if (registrationStep === "ideal-partner" && formErrors.idealPartnerWeight) {
      if (femaleProfileForm.idealPartnerWeight) {
        clearFormError("idealPartnerWeight")
      }
    }
  }, [
    femaleProfileForm.idealPartnerWeight,
    registrationStep,
    formErrors.idealPartnerWeight,
  ])

  useEffect(() => {
    if (
      registrationStep === "ideal-partner" &&
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
      registrationStep === "ideal-partner" &&
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
      registrationStep === "ideal-partner" &&
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
      registrationStep === "ideal-partner" &&
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
    if (registrationStep === "ideal-partner" && formErrors.dealBreakers) {
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
    if (registrationStep === "photos" && formErrors.headshot) {
      if (photosForm.headshot) {
        clearFormError("headshot")
      }
    }
  }, [photosForm.headshot, registrationStep, formErrors.headshot])

  useEffect(() => {
    if (registrationStep === "photos" && formErrors.fullLength) {
      if (photosForm.fullLength) {
        clearFormError("fullLength")
      }
    }
  }, [photosForm.fullLength, registrationStep, formErrors.fullLength])

  useEffect(() => {
    if (registrationStep === "photos" && formErrors.casualLifestyle) {
      if (photosForm.casualLifestyle) {
        clearFormError("casualLifestyle")
      }
    }
  }, [photosForm.casualLifestyle, registrationStep, formErrors.casualLifestyle])

  useEffect(() => {
    if (registrationStep === "financial" && formErrors.ownProperty) {
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
    if (registrationStep === "financial" && formErrors.ownBusiness) {
      if (
        femaleProfileSchemaFinancial.shape.ownBusiness.safeParse(
          financialForm.ownBusiness
        ).success
      ) {
        clearFormError("ownBusiness")
      }
    }
  }, [financialForm.ownBusiness, registrationStep, formErrors.ownBusiness])

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
          name: `${detailsForm.firstName.trim()} ${detailsForm.lastName.trim()}`.trim(),
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
        setRegistrationStep("thank-you")
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

  const uploadImage = async (file: File, type: string) => {
    const formData = new FormData()

    formData.append("file", file)

    const response = await fetch(
      `/api/upload?email=${encodeURIComponent(detailsForm.email)}&type=${type}`,
      {
        method: "POST",
        body: formData,
      }
    )

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
      const [headshotUrl, fullLengthUrl, casualLifestyleUrl] =
        await Promise.all([
          uploadImage(photosForm.headshot!, "headshot"),
          uploadImage(photosForm.fullLength!, "full-length"),
          uploadImage(photosForm.casualLifestyle!, "casual-lifestyle"),
        ])

      // The initial user data is now in state, no need to read from URL
      const detailsData = {
        ...initialUserData, // Keep any other properties from the initial step
        prefix: detailsForm.prefix,
        name: `${detailsForm.firstName.trim()} ${detailsForm.lastName.trim()}`.trim(),
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
      }

      const membershipPlan = gender === "Female" ? "FEMALE_FREE" : "NONE"
      const formData = {
        details: detailsData,
        profile: profileData,
        relationshipGoals: relationshipGoalsForm,
        financial: financialForm,
        photos: photosData,
        membershipPlan,
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
            {registrationStep === "details" ||
            registrationStep === "basic-info" ? (
              <p className="mt-4 text-base text-muted-foreground">
                Complete this confidential application to begin your
                personalized matchmaking journey with our experts.
              </p>
            ) : null}
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
            {registrationStep === "details" ||
            registrationStep === "basic-info" ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Complete this confidential application to begin your
                personalized matchmaking journey with our experts.
              </p>
            ) : null}
          </motion.div>
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
                        steps={registrationSteps}
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
                            disabled={isInitializing || loadingCountries}
                          >
                            <SelectValue placeholder="Mr." />
                          </SelectTrigger>
                          <SelectContent className="max-h-56 overflow-y-auto">
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <InputGroup>
                            <InputGroupAddon>
                              <User className="size-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="firstName"
                              placeholder="First Name"
                              value={detailsForm.firstName}
                              onChange={(e) =>
                                setDetailsForm((prev) => ({
                                  ...prev,
                                  firstName: e.target.value,
                                }))
                              }
                              disabled={isInitializing || loadingCountries}
                            />
                          </InputGroup>
                          {formErrors.firstName && (
                            <p className="text-sm text-destructive">
                              {formErrors.firstName}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <InputGroup>
                            <InputGroupAddon>
                              <User className="size-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="lastName"
                              placeholder="Last Name"
                              value={detailsForm.lastName}
                              onChange={(e) =>
                                setDetailsForm((prev) => ({
                                  ...prev,
                                  lastName: e.target.value,
                                }))
                              }
                              disabled={isInitializing || loadingCountries}
                            />
                          </InputGroup>
                          {formErrors.lastName && (
                            <p className="text-sm text-destructive">
                              {formErrors.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select onValueChange={setGender} value={gender}>
                          <SelectTrigger
                            id="gender"
                            className="h-8 bg-background dark:bg-input/30"
                            disabled={isInitializing || loadingCountries}
                          >
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="max-h-56 overflow-y-auto">
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
                        <Label htmlFor="dob" className="flex items-center">
                          <Cake className="mr-2 size-4" /> Date of Birth
                        </Label>
                        <DateOfBirthInput
                          value={dob}
                          onSelect={setBirthday}
                          disabled={isInitializing || loadingCountries}
                        />
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
                          <Popover
                            open={openPhoneCountry}
                            onOpenChange={setOpenPhoneCountry}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "h-8 w-full justify-between rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
                                  !phoneCountry && "text-muted-foreground"
                                )}
                                disabled={isInitializing || loadingCountries}
                              >
                                {phoneCountry
                                  ? `+${
                                      countries.find(
                                        (c) => c.code === phoneCountry
                                      )?.callCode ?? ""
                                    }`
                                  : "+66"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[250px] p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Search country..."
                                  className="h-9"
                                />
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup className="max-h-60 overflow-y-auto">
                                  {loadingCountries ? (
                                    <CommandItem disabled>
                                      Loading...
                                    </CommandItem>
                                  ) : (
                                    [...countries]
                                      .sort((a, b) =>
                                        a.callCode.localeCompare(
                                          b.callCode,
                                          "en",
                                          { numeric: true }
                                        )
                                      )
                                      .map((country) => (
                                        <CommandItem
                                          value={`${country.name} ${country.code} ${country.callCode} ${country.nationality}`}
                                          key={country.code}
                                          onSelect={() => {
                                            setPhoneCountry(country.code)
                                            setOpenPhoneCountry(false)
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              country.code === phoneCountry
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          <Image
                                            src={country.flag}
                                            alt={country.name}
                                            width={24}
                                            height={16}
                                            className="mr-2 inline-block h-4 w-6 rounded object-cover"
                                          />
                                          (+
                                          {country.callCode})
                                        </CommandItem>
                                      ))
                                  )}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
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
                              disabled={isInitializing || loadingCountries}
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
                          disabled={
                            !!initialUserData?.email ||
                            isInitializing ||
                            loadingCountries
                          }
                        />
                      </InputGroup>
                      {initialUserData?.email && (
                        <p className="pt-1 text-xs text-muted-foreground">
                          Registered email cannot be edited.
                        </p>
                      )}
                      {formErrors.email && (
                        <p className="text-sm text-destructive">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Popover
                        open={openNationality}
                        onOpenChange={setOpenNationality}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "h-8 w-full justify-between rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
                              !locationForm.nationality &&
                                "text-muted-foreground"
                            )}
                            disabled={isInitializing || loadingCountries}
                          >
                            {locationForm.nationality ? (
                              <>
                                {(() => {
                                  const country = countries.find(
                                    (c) =>
                                      c.nationality === locationForm.nationality
                                  )

                                  return country ? (
                                    <>
                                      <Image
                                        src={country.flag}
                                        alt={country.name}
                                        width={24}
                                        height={16}
                                        className="mr-2 inline-block h-4 w-6 rounded object-cover"
                                      />
                                      {country.nationality}
                                    </>
                                  ) : (
                                    locationForm.nationality
                                  )
                                })()}
                              </>
                            ) : (
                              "Select nationality"
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] p-0"
                          align="start"
                        >
                          <Command>
                            <CommandInput placeholder="Search nationality..." />
                            <CommandEmpty>No nationality found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {loadingCountries ? (
                                <CommandItem disabled>
                                  Loading countries...
                                </CommandItem>
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
                                    <CommandItem
                                      value={`${country.nationality} ${country.name} ${country.code} ${country.callCode}`}
                                      key={country.code}
                                      onSelect={() => {
                                        setLocationForm((prev) => ({
                                          ...prev,
                                          nationality: country.nationality,
                                        }))
                                        setOpenNationality(false)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          country.nationality ===
                                            locationForm.nationality
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <Image
                                        src={country.flag}
                                        alt={country.name}
                                        width={24}
                                        height={16}
                                        className="mr-2 inline-block h-4 w-6 rounded object-cover"
                                      />
                                      {country.nationality}
                                    </CommandItem>
                                  ))
                              )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {formErrors.nationality && (
                        <p className="text-sm text-destructive">
                          {formErrors.nationality}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current-location">Current Location</Label>
                      <Popover
                        open={openCurrentLocation}
                        onOpenChange={setOpenCurrentLocation}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "h-8 w-full justify-between rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
                              !locationForm.currentLocation &&
                                "text-muted-foreground"
                            )}
                            disabled={isInitializing || loadingCountries}
                          >
                            {locationForm.currentLocation ? (
                              <>
                                {(() => {
                                  const country = countries.find(
                                    (country) =>
                                      country.name ===
                                      locationForm.currentLocation
                                  )

                                  return country ? (
                                    <>
                                      <Image
                                        src={country.flag}
                                        alt={country.name}
                                        width={24}
                                        height={16}
                                        className="mr-2 inline-block h-4 w-6 rounded object-cover"
                                      />
                                      {country.name}
                                    </>
                                  ) : (
                                    locationForm.currentLocation
                                  )
                                })()}
                              </>
                            ) : (
                              "Select current location"
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] p-0"
                          align="start"
                        >
                          <Command>
                            <CommandInput placeholder="Search location..." />
                            <CommandEmpty>No location found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {loadingCountries ? (
                                <CommandItem disabled>
                                  Loading countries...
                                </CommandItem>
                              ) : (
                                [...countries]
                                  .sort((a, b) =>
                                    a.name.localeCompare(b.name, "en", {
                                      sensitivity: "base",
                                    })
                                  )
                                  .map((country) => (
                                    <CommandItem
                                      value={`${country.nationality} ${country.name} ${country.code} ${country.callCode}`}
                                      key={country.code}
                                      onSelect={() => {
                                        setLocationForm((prev) => ({
                                          ...prev,
                                          currentLocation: country.name,
                                        }))
                                        setOpenCurrentLocation(false)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          country.name ===
                                            locationForm.currentLocation
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <Image
                                        src={country.flag}
                                        alt={country.name}
                                        width={24}
                                        height={16}
                                        className="mr-2 inline-block h-4 w-6 rounded object-cover"
                                      />
                                      {country.name}
                                    </CommandItem>
                                  ))
                              )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                        validateAndSetStep("basic-info", detailsSchema, {
                          ...detailsForm,
                          prefix,
                          gender,
                          phone: fullPhoneNumber,
                          dob,
                          ...locationForm,
                        })
                        // Update URL query parameter with the new email
                        const currentSearchParams = new URLSearchParams(
                          searchParams.toString()
                        )
                        currentSearchParams.set("email", detailsForm.email)
                        router.replace(
                          `${pathname}?${currentSearchParams.toString()}`
                        )
                      }}
                      disabled={isInitializing || loadingCountries}
                    >
                      {isInitializing ? (
                        <>
                          <Spinner className="mr-2" />
                          Loading...
                        </>
                      ) : (
                        "Next"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
            {registrationStep === "basic-info" && (
              <motion.div
                key="basic-info"
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
                        steps={registrationSteps}
                        currentStep={registrationStep}
                      />
                    </div>
                    <CardDescription>Register application form</CardDescription>
                  </CardHeader>
                  <div className="px-6 pb-4">
                    <p className="text-sm text-muted-foreground">
                      Dear {prefix} {detailsForm.firstName}{" "}
                      {detailsForm.lastName}, <br />
                      Your register interest data are auto filled in application
                      form, if you want to edit profile
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
                      <Label htmlFor="company">Company/Business/Industry</Label>
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
                        validateAndSetStep(
                          "appearance",
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
                        className="flex items-center p-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setRegistrationStep(getPreviousStep(registrationStep))
                        }
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
            {registrationStep === "appearance" && (
              <motion.div
                key="basic-info"
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
                        steps={registrationSteps}
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
                        <span>Native</span>
                      </div>
                    </div>
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
                        <span>Native</span>
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
                        validateAndSetStep(
                          "background",
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
                        className="flex items-center p-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setRegistrationStep(getPreviousStep(registrationStep))
                        }
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
            {registrationStep === "background" && (
              <motion.div
                key="appearance"
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
                        steps={registrationSteps}
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
                      <Label>My Personality (select exactly 5)</Label>
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
                              disabled={
                                femaleProfileForm.personality.length >= 5 &&
                                !femaleProfileForm.personality.includes(trait)
                              }
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
                      femaleProfileForm.maritalStatus !== "Never Married" && (
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
                                <RadioGroupItem value="No" id="children-no" />
                                <Label htmlFor="children-no">No</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Yes" id="children-yes" />
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
                                      ? String(femaleProfileForm.childrenCount)
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
                        validateAndSetStep(
                          "about",
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
                        className="flex items-center p-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setRegistrationStep(getPreviousStep(registrationStep))
                        }
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
            {registrationStep === "about" && (
              <motion.div
                key="background"
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
                        steps={registrationSteps}
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
                        <Select
                          key={index}
                          onValueChange={(value) => {
                            const newQualities = [
                              ...femaleProfileForm.bestQualities,
                            ]
                            newQualities[index] = value
                            setFemaleProfileForm((prev) => ({
                              ...prev,
                              bestQualities: newQualities,
                            }))
                          }}
                          value={femaleProfileForm.bestQualities[index]}
                        >
                          <SelectTrigger className="h-8 bg-background text-sm dark:bg-input/30">
                            <SelectValue
                              placeholder={`Select quality #${index + 1}`}
                            >
                              {femaleProfileForm.bestQualities[index] && (
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const Icon =
                                      qualityIcons[
                                        femaleProfileForm.bestQualities[index]
                                      ]
                                    return Icon ? (
                                      <Icon className="size-4 text-muted-foreground" />
                                    ) : null
                                  })()}
                                  <span>
                                    {femaleProfileForm.bestQualities[index]}
                                  </span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-56 overflow-y-auto">
                            {bestQualitiesOptions.map((option) => {
                              const Icon = qualityIcons[option]
                              const isSelectedElsewhere =
                                femaleProfileForm.bestQualities.includes(
                                  option
                                ) &&
                                femaleProfileForm.bestQualities[index] !==
                                  option
                              return (
                                <SelectItem
                                  key={option}
                                  value={option}
                                  disabled={isSelectedElsewhere}
                                  className="text-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    {Icon && (
                                      <Icon className="size-4 text-muted-foreground" />
                                    )}
                                    <span>{option}</span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      ))}
                      {formErrors.bestQualities && (
                        <p className="text-sm text-destructive">
                          {formErrors.bestQualities}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>What three qualities you look for in a man?</Label>
                      {[0, 1, 2].map((index) => (
                        <Select
                          key={index}
                          onValueChange={(value) => {
                            const newQualities = [
                              ...femaleProfileForm.lookingForQualities,
                            ]
                            newQualities[index] = value
                            setFemaleProfileForm((prev) => ({
                              ...prev,
                              lookingForQualities: newQualities,
                            }))
                          }}
                          value={femaleProfileForm.lookingForQualities[index]}
                        >
                          <SelectTrigger className="h-8 bg-background text-sm dark:bg-input/30">
                            <SelectValue
                              placeholder={`Select quality #${index + 1}`}
                            >
                              {femaleProfileForm.lookingForQualities[index] && (
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const Icon =
                                      qualityIcons[
                                        femaleProfileForm.lookingForQualities[
                                          index
                                        ]
                                      ]
                                    return Icon ? (
                                      <Icon className="size-4 text-muted-foreground" />
                                    ) : null
                                  })()}
                                  <span>
                                    {
                                      femaleProfileForm.lookingForQualities[
                                        index
                                      ]
                                    }
                                  </span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-56 overflow-y-auto">
                            {lookingForQualitiesOptions.map((option) => {
                              const Icon = qualityIcons[option]
                              const isSelectedElsewhere =
                                femaleProfileForm.lookingForQualities.includes(
                                  option
                                ) &&
                                femaleProfileForm.lookingForQualities[index] !==
                                  option
                              return (
                                <SelectItem
                                  key={option}
                                  value={option}
                                  disabled={isSelectedElsewhere}
                                  className="text-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    {Icon && (
                                      <Icon className="size-4 text-muted-foreground" />
                                    )}
                                    <span>{option}</span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
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
                        validateAndSetStep(
                          "relationship-goals",
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
                        className="flex items-center p-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setRegistrationStep(getPreviousStep(registrationStep))
                        }
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
            {registrationStep === "relationship-goals" && (
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
                        steps={registrationSteps}
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
                                    : prev.lookingFor.filter((g) => g !== goal),
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
                        validateAndSetStep(
                          "lifestyle",
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
                        className="flex items-center p-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setRegistrationStep(getPreviousStep(registrationStep))
                        }
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
            {registrationStep === "lifestyle" && (
              <motion.div
                key="about"
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
                        steps={registrationSteps}
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
                                    : prev.lifestyle.filter((l) => l !== item),
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
                            <RadioGroupItem
                              value={habit}
                              id={`smoke-${habit}`}
                            />
                            <Label htmlFor={`smoke-${habit}`}>{habit}</Label>
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
                            <RadioGroupItem
                              value={habit}
                              id={`drink-${habit}`}
                            />
                            <Label htmlFor={`drink-${habit}`}>{habit}</Label>
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
                        validateAndSetStep(
                          "interests",
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
                        className="flex items-center p-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setRegistrationStep(getPreviousStep(registrationStep))
                        }
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
            {registrationStep === "interests" && (
              <motion.div
                key="lifestyle"
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
                        steps={registrationSteps}
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
                                    : prev.interests.filter((i) => i !== item)
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
                            placeholder={travelDestinationsPlaceholders[index]}
                            value={femaleProfileForm.travelDestinations[index]}
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
                        validateAndSetStep(
                          "family-values",
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
                        className="flex items-center p-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setRegistrationStep(getPreviousStep(registrationStep))
                        }
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
            {registrationStep === "family-values" && (
              <motion.div
                key="interests"
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
                        steps={registrationSteps}
                        currentStep={registrationStep}
                      />
                    </div>
                    <CardDescription>
                      Share what&apos;s important to you.
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
                              checked={femaleProfileForm.values.includes(value)}
                              disabled={
                                femaleProfileForm.values.length >= 5 &&
                                !femaleProfileForm.values.includes(value)
                              }
                              onCheckedChange={(checked) => {
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  values: checked
                                    ? [...prev.values, value]
                                    : prev.values.filter((v) => v !== value),
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
                        validateAndSetStep(
                          "ideal-partner",
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
                        className="flex items-center p-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setRegistrationStep(getPreviousStep(registrationStep))
                        }
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
            {registrationStep === "ideal-partner" && (
              <motion.div
                key="family-values"
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
                        steps={registrationSteps}
                        currentStep={registrationStep}
                      />
                    </div>
                    <CardDescription>
                      Describe the qualities you&apos;re looking for in a
                      partner.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Age Range</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Select
                            onValueChange={(value) => {
                              setIdealPartnerMinAge(value)
                              setIdealPartnerMaxAge("") // Reset max age on min age change
                              if (value === "70+") {
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  idealPartnerAgeRange: "70+",
                                }))
                              } else {
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  idealPartnerAgeRange: "", // Clear range until max is selected
                                }))
                              }
                            }}
                            value={idealPartnerMinAge}
                          >
                            <SelectTrigger className="h-8 bg-background dark:bg-input/30">
                              <SelectValue placeholder="Min" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56 overflow-y-auto">
                              {idealPartnerMinAgeOptions.map((age) => (
                                <SelectItem key={age} value={age}>
                                  {age}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <span className="text-muted-foreground">-</span>
                        <div className="flex-1">
                          <Select
                            onValueChange={(value) => {
                              setIdealPartnerMaxAge(value)
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                idealPartnerAgeRange: `${idealPartnerMinAge}-${value}`,
                              }))
                            }}
                            value={idealPartnerMaxAge}
                            disabled={
                              !idealPartnerMinAge ||
                              idealPartnerMinAge === "70+"
                            }
                          >
                            <SelectTrigger className="h-8 bg-background dark:bg-input/30">
                              <SelectValue placeholder="Max" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56 overflow-y-auto">
                              {idealPartnerMaxAgeOptions
                                .filter(
                                  (age) =>
                                    parseInt(age) >=
                                    parseInt(idealPartnerMinAge)
                                )
                                .map((age) => (
                                  <SelectItem key={age} value={age}>
                                    {age}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {formErrors.idealPartnerAgeRange && (
                        <p className="text-sm text-destructive">
                          {formErrors.idealPartnerAgeRange}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Height (cm)</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Select
                            onValueChange={(value) => {
                              setIdealPartnerMinHeight(value)
                              setIdealPartnerMaxHeight("") // Reset max height on min height change
                              if (value === "200+") {
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  idealPartnerHeight: "200+",
                                }))
                              } else {
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  idealPartnerHeight: "", // Clear range until max is selected
                                }))
                              }
                            }}
                            value={idealPartnerMinHeight}
                          >
                            <SelectTrigger className="h-8 bg-background dark:bg-input/30">
                              <SelectValue placeholder="Min" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56 overflow-y-auto">
                              {idealPartnerMinHeightOptions.map((height) => (
                                <SelectItem key={height} value={height}>
                                  {height} {cmToFeetInches(height)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <span className="text-muted-foreground">-</span>
                        <div className="flex-1">
                          <Select
                            onValueChange={(value) => {
                              setIdealPartnerMaxHeight(value)
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                idealPartnerHeight: `${idealPartnerMinHeight}-${value}`,
                              }))
                            }}
                            value={idealPartnerMaxHeight}
                            disabled={
                              !idealPartnerMinHeight ||
                              idealPartnerMinHeight === "200+"
                            }
                          >
                            <SelectTrigger className="h-8 bg-background dark:bg-input/30">
                              <SelectValue placeholder="Max" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56 overflow-y-auto">
                              {idealPartnerMaxHeightOptions
                                .filter(
                                  (height) =>
                                    parseInt(height) >=
                                    parseInt(idealPartnerMinHeight)
                                )
                                .map((height) => (
                                  <SelectItem key={height} value={height}>
                                    {height} {cmToFeetInches(height)}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {formErrors.idealPartnerHeight && (
                        <p className="text-sm text-destructive">
                          {formErrors.idealPartnerHeight}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Weight (kg)</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Select
                            onValueChange={(value) => {
                              setIdealPartnerMinWeight(value)
                              setIdealPartnerMaxWeight("") // Reset max weight on min weight change
                              if (value === "100+") {
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  idealPartnerWeight: "100+",
                                }))
                              } else {
                                setFemaleProfileForm((prev) => ({
                                  ...prev,
                                  idealPartnerWeight: "", // Clear range until max is selected
                                }))
                              }
                            }}
                            value={idealPartnerMinWeight}
                          >
                            <SelectTrigger className="h-8 bg-background dark:bg-input/30">
                              <SelectValue placeholder="Min" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56 overflow-y-auto">
                              {idealPartnerMinWeightOptions.map((weight) => (
                                <SelectItem key={weight} value={weight}>
                                  {weight}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <span className="text-muted-foreground">-</span>
                        <div className="flex-1">
                          <Select
                            onValueChange={(value) => {
                              setIdealPartnerMaxWeight(value)
                              setFemaleProfileForm((prev) => ({
                                ...prev,
                                idealPartnerWeight: `${idealPartnerMinWeight}-${value}`,
                              }))
                            }}
                            value={idealPartnerMaxWeight}
                            disabled={
                              !idealPartnerMinWeight ||
                              idealPartnerMinWeight === "100+"
                            }
                          >
                            <SelectTrigger className="h-8 bg-background dark:bg-input/30">
                              <SelectValue placeholder="Max" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56 overflow-y-auto">
                              {idealPartnerMaxWeightOptions
                                .filter(
                                  (weight) =>
                                    parseInt(weight) >=
                                    parseInt(idealPartnerMinWeight)
                                )
                                .map((weight) => (
                                  <SelectItem key={weight} value={weight}>
                                    {weight}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {formErrors.idealPartnerWeight && (
                        <p className="text-sm text-destructive">
                          {formErrors.idealPartnerWeight}
                        </p>
                      )}
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
                          <SelectContent className="max-h-56 overflow-y-auto">
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
                          <SelectContent className="max-h-56 overflow-y-auto">
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
                          {[...educationLevels, "Not Important"].map((edu) => (
                            <SelectItem key={edu} value={edu}>
                              {edu}
                            </SelectItem>
                          ))}
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
                                      ? [...prev.idealPartnerPersonality, trait]
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
                                  idealPartnerOtherPersonality: e.target.value,
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
                                    ? [...prev.idealPartnerQualities, quality]
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
                      <Label>Deal Breakers (select 3)</Label>
                      {[0, 1, 2].map((index) => (
                        <Select
                          key={index}
                          onValueChange={(value) => {
                            const newDealBreakers = [
                              ...femaleProfileForm.dealBreakers,
                            ]
                            newDealBreakers[index] = value
                            setFemaleProfileForm((prev) => ({
                              ...prev,
                              dealBreakers: newDealBreakers,
                            }))
                          }}
                          value={femaleProfileForm.dealBreakers[index]}
                        >
                          <SelectTrigger className="h-8 bg-background text-sm dark:bg-input/30">
                            <SelectValue
                              placeholder={`Select deal breaker #${index + 1}`}
                            >
                              {femaleProfileForm.dealBreakers[index] && (
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const option = dealBreakerOptions.find(
                                      (o) =>
                                        o.value ===
                                        femaleProfileForm.dealBreakers[index]
                                    )
                                    if (!option) return null
                                    const Icon = option.icon
                                    return (
                                      <Icon className="size-4 text-muted-foreground" />
                                    )
                                  })()}
                                  <span>
                                    {femaleProfileForm.dealBreakers[index]}
                                  </span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-56 overflow-y-auto">
                            {dealBreakerOptions.map((option) => {
                              const isSelectedElsewhere =
                                femaleProfileForm.dealBreakers.includes(
                                  option.value
                                ) &&
                                femaleProfileForm.dealBreakers[index] !==
                                  option.value
                              return (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  disabled={isSelectedElsewhere}
                                  className="text-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    <option.icon className="size-4 text-muted-foreground" />
                                    <span>{option.label}</span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
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
                        validateAndSetStep(
                          "financial",
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
                        className="flex items-center p-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setRegistrationStep(getPreviousStep(registrationStep))
                        }
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
            {registrationStep === "financial" && (
              <motion.div
                key="financial"
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
                        steps={registrationSteps}
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
                        validateAndSetStep(
                          "photos",
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
                        className="flex items-center p-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setRegistrationStep(getPreviousStep(registrationStep))
                        }
                      >
                        <ChevronLeft className="mr-1 size-4" />
                        Back
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
            {registrationStep === "photos" && (
              <motion.div
                key="photos"
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
                        steps={registrationSteps}
                        currentStep={registrationStep}
                      />
                    </div>
                    <CardDescription>
                      Please provide three clear photos of yourself.
                    </CardDescription>
                    <p className="pt-2 text-sm text-muted-foreground">
                      Requirements: within 3 months, max 50MB, all image types
                      accepted.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FileInput
                      label="1. Headshot"
                      file={photosForm.headshot}
                      onFileChange={(file) =>
                        setPhotosForm((p) => ({ ...p, headshot: file }))
                      }
                      error={formErrors.headshot}
                      disabled={isSubmittingApplication}
                      displayStyle="avatar"
                    />
                    <FileInput
                      label="2. Full-Length Photo"
                      file={photosForm.fullLength}
                      onFileChange={(file) =>
                        setPhotosForm((p) => ({ ...p, fullLength: file }))
                      }
                      error={formErrors.fullLength}
                      disabled={isSubmittingApplication}
                    />
                    <FileInput
                      label="3. Casual Lifestyle Photo"
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
                    <div className="space-y-4 rounded-md">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all-agreements" //
                          checked={
                            allAgreed
                              ? true
                              : someAgreed
                                ? "indeterminate"
                                : false
                          }
                          onCheckedChange={(checked) => {
                            setAgreements({
                              realData: !!checked,
                              privacyPolicy: !!checked,
                              termsOfService: !!checked,
                            })
                          }}
                          disabled={isSubmittingApplication}
                        />
                        <Label
                          htmlFor="select-all-agreements"
                          className="font-semibold"
                        >
                          Select All
                        </Label>
                      </div>
                      <div className="space-y-2 pl-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="agree-real-data"
                            checked={agreements.realData}
                            onCheckedChange={(checked) =>
                              setAgreements((prev) => ({
                                ...prev,
                                realData: !!checked,
                              }))
                            }
                            disabled={isSubmittingApplication}
                          />
                          <Label htmlFor="agree-real-data" className="text-sm">
                            I agree that all information and photos provided are
                            genuine and belong to me.
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="agree-privacy-policy"
                            checked={agreements.privacyPolicy}
                            onCheckedChange={(checked) =>
                              setAgreements((prev) => ({
                                ...prev,
                                privacyPolicy: !!checked,
                              }))
                            }
                            disabled={isSubmittingApplication}
                          />
                          <Label
                            htmlFor="agree-privacy-policy"
                            className="text-sm"
                          >
                            I accept the{" "}
                            <Link
                              href="/privacy-policy"
                              target="_blank"
                              className="text-gradient underline hover:text-primary/80"
                            >
                              Privacy Policy
                            </Link>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="agree-terms-of-service"
                            checked={agreements.termsOfService}
                            onCheckedChange={(checked) =>
                              setAgreements((prev) => ({
                                ...prev,
                                termsOfService: !!checked,
                              }))
                            }
                            disabled={isSubmittingApplication}
                          />
                          <Label
                            htmlFor="agree-terms-of-service"
                            className="text-sm"
                          >
                            I accept the{" "}
                            <Link
                              href="/terms-of-service"
                              target="_blank"
                              className="text-gradient underline hover:text-primary/80"
                            >
                              Terms of Service
                            </Link>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-4">
                    <Button
                      className="btn-gradient w-full"
                      disabled={isSubmittingApplication || !allAgreed}
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
                        className="flex items-center p-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setRegistrationStep(getPreviousStep(registrationStep))
                        }
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
                        steps={registrationSteps}
                        currentStep={registrationStep}
                      />
                    </div>
                    <CardDescription>
                      Your registration has been submitted successfully.
                    </CardDescription>
                  </CardHeader>
                  {detailsForm.firstName && detailsForm.lastName && (
                    <div className="px-6 pb-0">
                      <p>
                        Dear {prefix} {detailsForm.firstName}{" "}
                        {detailsForm.lastName},
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
                      <CheckCircle2 className="size-16 text-green-500" />
                    </motion.div>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <Badge className="flex items-center gap-2 border-yellow-500/50 bg-yellow-400/20 text-yellow-700 dark:text-yellow-400">
                        <Clock className="size-4 animate-spin" />
                        Status: Reviewing
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      We have received your application and our team will review
                      it shortly.
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
                        steps={registrationSteps}
                        currentStep={registrationStep}
                      />
                    </div>
                    <CardDescription>
                      We&apos;ve sent a verification code to your email. if not
                      arrive, check also in spam folder.
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
                              const result = verificationCodeSchema.safeParse({
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
                        className="flex items-center p-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setRegistrationStep(getPreviousStep(registrationStep))
                        }
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
                              <PasswordToggle value={passwordForm.password} />
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
                                  if (e.key === "Enter" && isPasswordFormValid)
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
  displayStyle = "default",
}: {
  label: string
  file: File | null
  onFileChange: (file: File | null) => void
  error?: string
  disabled?: boolean
  displayStyle?: "default" | "avatar"
}) {
  const id = label.toLowerCase().replace(/\s/g, "-")
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={disabled ? "text-muted-foreground" : ""}>
        {label}
      </Label>
      <div className="flex w-full items-center gap-4">
        {file && (
          <Image
            src={URL.createObjectURL(file)}
            alt="Preview"
            width={64}
            height={64}
            className={cn(
              "h-16 w-16 flex-shrink-0 object-cover",
              displayStyle === "avatar" ? "rounded-full" : "rounded-md"
            )}
          />
        )}
        <div className="relative min-w-0 flex-1">
          <div
            className={cn(
              "relative flex w-full items-center rounded-lg border border-input bg-transparent text-sm shadow-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              file && "pr-24" // Apply padding to the visual input container when a file is present
            )}
          >
            <div className="min-w-0 flex-1">
              <label htmlFor={id} className="flex cursor-pointer items-center">
                <div className="flex h-8 items-center justify-center px-3">
                  <Upload className="size-4 text-muted-foreground" />
                </div>
                <span
                  className={cn(
                    "flex-1 truncate py-1", // min-w-0 is now on the parent div
                    !file && "text-muted-foreground"
                  )}
                >
                  {file ? file.name : "Choose a file..."}
                </span>
              </label>
            </div>
          </div>
          {file && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFileChange(null)}
              className="absolute top-1/2 right-1 z-10 h-auto -translate-y-1/2 p-1 text-muted-foreground hover:bg-transparent hover:text-destructive" // Adjusted right-2 to right-1 for better fit
              disabled={disabled}
            >
              <X className="size-4" />
              <span>Remove</span>
            </Button>
          )}
        </div>
        <input
          id={id}
          type="file"
          className="sr-only"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          accept="image/*"
          disabled={disabled}
        />
      </div>
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
    <Suspense fallback={null}>
      <AuthPageContents />
    </Suspense>
  )
}
