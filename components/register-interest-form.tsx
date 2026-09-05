"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { format, startOfToday } from "date-fns"
import {
  Calendar1,
  Check,
  ChevronsUpDown,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Lock,
  Heart,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import { Calendar } from "@/components/ui/calendar"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { MotionDiv } from "./motion"
import Image from "next/image"

type Country = {
  name: string
  flag: string
  code: string
  nationality: string
  callCode: string
  region: string
}

/*
 * Business hours:
 * 10:00 - 20:00 (ICT)
 * Each option represents a 1-hour window.
 */
const PREFERRED_CONTACT_TIMES = [
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
] as const

const RELATIONSHIP_GOALS = [
  {
    id: "Marriage / Life Partner",
    label: "Marriage / Life Partner",
    desc: "Seeking a sincere life partner and long-term marriage.",
    icon: Sparkles,
  },
  {
    id: "Long-Term Relationship",
    label: "Long-Term Relationship",
    desc: "A committed, meaningful connection built on mutual trust.",
    icon: Heart,
  },
  {
    id: "Companionship",
    label: "Companionship",
    desc: "Genuine friendship and sharing travel & life experiences.",
    icon: User,
  },
  {
    id: "I'm Not Sure Yet",
    label: "I'm Not Sure Yet",
    desc: "Open to exploring how personal matchmaking can help.",
    icon: Clock,
  },
] as const

const formSchema = z.object({
  prefix: z
    .string()
    .refine((val) => ["Mr.", "Ms.", "Mrs.", "Dr."].includes(val), {
      message: "Please select a prefix.",
    }),

  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),

  lastName: z.string().optional(),

  gender: z.string().refine((val) => ["Male", "Female"].includes(val), {
    message: "Please select a gender.",
  }),

  email: z.email({
    message: "Please enter a valid email address.",
  }),

  phoneCountry: z.string().min(1, {
    message: "Please select country code.",
  }),

  phone: z
    .string()
    .regex(/^\d+$/, {
      message: "Phone number must contain only digits.",
    })
    .min(6, {
      message: "Phone number is too short.",
    }),

  currentLocation: z.string().min(2, {
    message: "Please select where you are currently based.",
  }),

  relationshipGoal: z.string().optional(),

  preferredContactDate: z.date({
    message: "Please select a preferred contact date.",
  }),

  preferredContactTime: z.enum(PREFERRED_CONTACT_TIMES, {
    message: "Please select a preferred contact time.",
  }),
})

export function RegisterInterestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      prefix: "Mr.",
      firstName: "",
      lastName: "",
      gender: "Male",
      email: "",
      phoneCountry: "TH",
      phone: "",
      currentLocation: "",
      relationshipGoal: "Marriage / Life Partner",
      preferredContactDate: undefined,
      preferredContactTime: undefined,
    },
  })

  const [isPending, startTransition] = useTransition()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [openCurrentLocation, setOpenCurrentLocation] = useState(false)
  const [openPhoneCountry, setOpenPhoneCountry] = useState(false)
  const [openContactDate, setOpenContactDate] = useState(false)

  const [countries, setCountries] = useState<Country[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)

  const { setValue } = form

  const prefix = useWatch({
    control: form.control,
    name: "prefix",
  })

  const gender = useWatch({
    control: form.control,
    name: "gender",
  })

  const preferredContactDate = useWatch({
    control: form.control,
    name: "preferredContactDate",
  })

  // Prefix & Gender synchronization logic
  useEffect(() => {
    if (prefix === "Mr." && gender !== "Male") {
      setValue("gender", "Male", {
        shouldValidate: true,
      })
    } else if ((prefix === "Ms." || prefix === "Mrs.") && gender !== "Female") {
      setValue("gender", "Female", {
        shouldValidate: true,
      })
    } else if (gender === "Male" && prefix !== "Mr.") {
      if (prefix !== "Dr.") {
        setValue("prefix", "Mr.", {
          shouldValidate: true,
        })
      }
    } else if (
      gender === "Female" &&
      !["Ms.", "Mrs.", "Dr."].includes(prefix ?? "")
    ) {
      setValue("prefix", "Ms.", {
        shouldValidate: true,
      })
    }
  }, [prefix, gender, setValue])

  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch("/api/register-interest/countries")
        if (!res.ok) {
          throw new Error("Failed loading countries")
        }
        const data: Country[] = await res.json()
        setCountries(data)

        const thailand = data.find((country) => country.code === "TH")
        if (thailand) {
          form.setValue("phoneCountry", thailand.code)
        }
      } catch (error) {
        console.error(error)
        toast.error("Unable to load countries list")
      } finally {
        setLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const selectedPhoneCountry = countries.find(
          (country) => country.code === values.phoneCountry
        )
        const selectedLocationCountry = countries.find(
          (country) => country.name === values.currentLocation
        )

        const fullName = [
          values.firstName.trim(),
          (values.lastName || "").trim(),
        ]
          .filter(Boolean)
          .join(" ")

        const payload = {
          prefix: values.prefix,
          name: fullName,
          gender: values.gender,
          email: values.email,
          phoneCountry: `+${selectedPhoneCountry?.callCode ?? ""}`,
          phone: values.phone,
          currentLocation: values.currentLocation,
          currentLocationRegion: selectedLocationCountry?.region ?? "",
          nationality:
            selectedLocationCountry?.nationality || values.currentLocation,
          nationalityRegion: selectedLocationCountry?.region ?? "",
          relationshipGoal: values.relationshipGoal,
          preferredContactDate: values.preferredContactDate,
          preferredContactTime: values.preferredContactTime,
          source: "Website Confidential Consultation",
        }

        const response = await fetch("/api/register-interest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          toast.success("Consultation Request Received!", {
            description:
              "We have received your details and will contact you confidentially.",
          })
          setIsSubmitted(true)
          form.reset()
        } else {
          const errorData = await response.json()
          toast.error("Uh oh! Something went wrong.", {
            description:
              errorData.error || "There was a problem with your submission.",
          })
        }
      } catch (error) {
        console.error(error)
        toast.error("Uh oh! Something went wrong.", {
          description: "An unexpected error occurred. Please try again.",
        })
      }
    })
  }

  if (isSubmitted) {
    return (
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto w-full max-w-2xl rounded-3xl border border-[#D3A753]/40 bg-gradient-to-br from-card via-card to-background p-8 text-center shadow-2xl sm:p-12"
      >
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/20 to-[#CA617D]/20 text-[#D3A753]">
          <Check className="size-7 text-[#CA617D]" />
        </div>
        <h2 className="text-gradient mb-3 text-3xl font-bold">
          Consultation Request Received
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Thank you for taking the first step. Our matchmaking director will
          review your preferences and reach out confidentially at your selected
          appointment time.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          A confirmation email has been sent to your address. (If you don&apos;t
          see it, please check your spam or promotions folder).
        </p>
      </MotionDiv>
    )
  }

  const selectedCountryObj = countries.find(
    (c) => c.code === form.watch("phoneCountry")
  )

  return (
    <div className="mx-auto w-full max-w-3xl">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl border border-[#D3A753]/30 bg-gradient-to-br from-card via-card to-background p-6 shadow-2xl sm:p-10 lg:p-12"
      >
        {/* Section Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
            <ShieldCheck className="size-3.5" />
            <span>Confidential & Discreet</span>
          </div>
          <h2 className="text-gradient text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Start with a Confidential Consultation
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Tell us what you seek. A dedicated matchmaker will contact you
            confidentially at your preferred date and time—completely free with
            zero obligation.
          </p>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-muted-foreground sm:gap-6">
            <div className="flex items-center gap-1.5">
              <Lock className="size-3.5 text-[#D3A753]" />
              <span>100% Confidential</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="size-3.5 text-[#D3A753]" />
              <span>1-2-1 Private Call</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="size-3.5 text-[#D3A753]" />
              <span>No Obligation</span>
            </div>
          </div>
        </div>

        {/* The Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <fieldset disabled={isPending} className="space-y-6">
              {/* ROW 1: PREFIX, FIRST NAME, LAST NAME (OPTIONAL) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[100px_1fr_1fr]">
                {/* Prefix */}
                <FormField
                  control={form.control}
                  name="prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                        Prefix
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 rounded-lg border border-input bg-background dark:bg-input/20">
                            <SelectValue placeholder="Prefix" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mr.">Mr.</SelectItem>
                          <SelectItem value="Ms.">Ms.</SelectItem>
                          <SelectItem value="Mrs.">Mrs.</SelectItem>
                          <SelectItem value="Dr.">Dr.</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                        First Name <span className="text-[#CA617D]">*</span>
                      </FormLabel>
                      <FormControl>
                        <InputGroup className="h-10 rounded-lg border border-input bg-background dark:bg-input/20">
                          <InputGroupAddon className="pl-3">
                            <User className="size-4 text-muted-foreground" />
                          </InputGroupAddon>
                          <InputGroupInput
                            placeholder="e.g. Alex"
                            className="h-full text-sm"
                            {...field}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name (OPTIONAL) */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                          Last Name
                        </FormLabel>
                        <span className="text-[11px] text-muted-foreground">
                          Optional
                        </span>
                      </div>
                      <FormControl>
                        <InputGroup className="h-10 rounded-lg border border-input bg-background dark:bg-input/20">
                          <InputGroupAddon className="pl-3">
                            <User className="size-4 text-muted-foreground" />
                          </InputGroupAddon>
                          <InputGroupInput
                            placeholder="e.g. Johnson"
                            className="h-full text-sm"
                            {...field}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ROW 2: GENDER & CURRENT LOCATION */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[130px_1fr]">
                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                        Gender
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 rounded-lg border border-input bg-background dark:bg-input/20">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Where are you currently based? */}
                <FormField
                  control={form.control}
                  name="currentLocation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                        Where are you currently based?{" "}
                        <span className="text-[#CA617D]">*</span>
                      </FormLabel>
                      <Popover
                        open={openCurrentLocation}
                        onOpenChange={setOpenCurrentLocation}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "h-10 w-full justify-between rounded-lg border-input bg-background px-3 text-left text-sm font-normal dark:bg-input/20",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <span className="flex items-center gap-2 truncate">
                                <MapPin className="size-4 shrink-0 text-[#D3A753]" />
                                <span className="truncate">
                                  {field.value ||
                                    "Select your current country / location..."}
                                </span>
                              </span>
                              <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[320px] p-0 sm:w-[400px]"
                          align="start"
                        >
                          <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandList className="max-h-60">
                              <CommandEmpty>No country found.</CommandEmpty>
                              <CommandGroup>
                                {countries.map((country) => (
                                  <CommandItem
                                    key={country.code}
                                    value={country.name}
                                    onSelect={() => {
                                      form.setValue(
                                        "currentLocation",
                                        country.name,
                                        {
                                          shouldValidate: true,
                                        }
                                      )
                                      setOpenCurrentLocation(false)
                                    }}
                                    className="flex items-center gap-2 text-xs"
                                  >
                                    <Image
                                      src={country.flag}
                                      alt={country.name}
                                      width={16}
                                      height={12}
                                      className="shrink-0 rounded-xs"
                                    />
                                    <span className="truncate">
                                      {country.name}
                                    </span>
                                    {field.value === country.name && (
                                      <Check className="ml-auto size-4 text-[#D3A753]" />
                                    )}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ROW 3: EMAIL & PHONE */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                        Email Address <span className="text-[#CA617D]">*</span>
                      </FormLabel>
                      <FormControl>
                        <InputGroup className="h-10 rounded-lg border border-input bg-background dark:bg-input/20">
                          <InputGroupAddon className="pl-3">
                            <Mail className="size-4 text-muted-foreground" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="email"
                            placeholder="alex@example.com"
                            className="h-full text-sm"
                            {...field}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* WhatsApp / Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                        WhatsApp / Phone{" "}
                        <span className="text-[#CA617D]">*</span>
                      </FormLabel>
                      <div className="flex gap-2">
                        {/* Country Code Popover */}
                        <Popover
                          open={openPhoneCountry}
                          onOpenChange={setOpenPhoneCountry}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="h-10 w-[125px] shrink-0 justify-between rounded-lg border-input bg-background px-2.5 text-sm font-normal dark:bg-input/20"
                            >
                              {selectedCountryObj ? (
                                <span className="flex items-center gap-1.5 truncate text-xs">
                                  <Image
                                    src={selectedCountryObj.flag}
                                    alt={selectedCountryObj.code}
                                    width={16}
                                    height={12}
                                    className="shrink-0 rounded-xs"
                                  />
                                  <span>+{selectedCountryObj.callCode}</span>
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Code
                                </span>
                              )}
                              <ChevronsUpDown className="size-3.5 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[280px] p-0"
                            align="start"
                          >
                            <Command>
                              <CommandInput placeholder="Search country..." />
                              <CommandList className="max-h-60">
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                  {countries.map((c) => (
                                    <CommandItem
                                      key={c.code}
                                      value={`${c.name} +${c.callCode}`}
                                      onSelect={() => {
                                        form.setValue("phoneCountry", c.code)
                                        setOpenPhoneCountry(false)
                                      }}
                                      className="flex items-center justify-between text-xs"
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <Image
                                          src={c.flag}
                                          alt={c.code}
                                          width={16}
                                          height={12}
                                          className="shrink-0 rounded-xs"
                                        />
                                        <span className="truncate">
                                          {c.name}
                                        </span>
                                      </div>
                                      <span className="font-mono text-muted-foreground">
                                        +{c.callCode}
                                      </span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {/* Phone Digits Input */}
                        <FormControl className="flex-1">
                          <InputGroup className="h-10 rounded-lg border border-input bg-background dark:bg-input/20">
                            <InputGroupAddon className="pl-3">
                              <Phone className="size-4 text-muted-foreground" />
                            </InputGroupAddon>
                            <InputGroupInput
                              type="tel"
                              placeholder="Phone or WhatsApp number"
                              className="h-full text-sm"
                              {...field}
                            />
                          </InputGroup>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ROW 4: WHAT ARE YOU LOOKING FOR? */}
              <FormField
                control={form.control}
                name="relationshipGoal"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                      What are you looking for?
                    </FormLabel>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {RELATIONSHIP_GOALS.map((goal) => {
                        const Icon = goal.icon
                        const isSelected = field.value === goal.label
                        return (
                          <button
                            key={goal.id}
                            type="button"
                            onClick={() =>
                              form.setValue("relationshipGoal", goal.label, {
                                shouldValidate: true,
                              })
                            }
                            className={cn(
                              "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200",
                              isSelected
                                ? "border-[#D3A753] bg-gradient-to-br from-[#D3A753]/15 to-[#CA617D]/10 shadow-sm ring-1 ring-[#D3A753]/50"
                                : "border-border/70 bg-card/60 hover:border-border hover:bg-card/90"
                            )}
                          >
                            <div
                              className={cn(
                                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                                isSelected
                                  ? "bg-[#D3A753] text-black"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              <Icon className="size-4" />
                            </div>
                            <div className="space-y-0.5">
                              <p
                                className={cn(
                                  "text-sm font-semibold",
                                  isSelected
                                    ? "text-foreground"
                                    : "text-foreground/80"
                                )}
                              >
                                {goal.label}
                              </p>
                              <p className="text-xs leading-tight text-muted-foreground">
                                {goal.desc}
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="mt-1 ml-auto size-4 shrink-0 text-[#D3A753]" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ROW 5: BOOKING APPOINTMENT CALENDAR & HOURS STYLE */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Preferred Contact Date (Calendar Popover with 7-day rule) */}
                <FormField
                  control={form.control}
                  name="preferredContactDate"
                  render={({ field }) => {
                    const today = startOfToday()
                    const maxDate = new Date(today)
                    maxDate.setDate(maxDate.getDate() + 7)

                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                          Preferred Appointment Date{" "}
                          <span className="text-[#CA617D]">*</span>
                        </FormLabel>

                        <Popover
                          open={openContactDate}
                          onOpenChange={setOpenContactDate}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-10 w-full justify-start rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 text-left font-normal shadow-none dark:bg-input/20",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <Calendar1 className="mr-2 size-4 text-[#D3A753]" />
                                {field.value
                                  ? format(field.value, "d MMM yyyy")
                                  : "Choose a date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0" align="start">
                            <div className="px-3 pt-3 pb-1 text-xs text-muted-foreground">
                              Choose a date within the next 7 days
                            </div>
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date)
                                setOpenContactDate(false)
                              }}
                              disabled={(date) =>
                                date < today ||
                                date > maxDate ||
                                date.getDay() === 0 ||
                                date.getDay() === 6
                              }
                              modifiers={{
                                weekend: (date) =>
                                  date >= today &&
                                  date <= maxDate &&
                                  (date.getDay() === 0 || date.getDay() === 6),
                                available: (date) =>
                                  date >= today &&
                                  date <= maxDate &&
                                  date.getDay() !== 0 &&
                                  date.getDay() !== 6,
                              }}
                              modifiersClassNames={{
                                weekend: "text-red-500 dark:text-red-400",
                                available: "text-green-600 dark:text-green-400",
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                {/* Preferred Contact Time (1-Hour Slots) */}
                <FormField
                  control={form.control}
                  name="preferredContactTime"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                          Preferred Appointment Time{" "}
                          <span className="text-[#CA617D]">*</span>
                        </FormLabel>
                        <span className="text-[11px] text-muted-foreground">
                          Bangkok (ICT)
                        </span>
                      </div>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!preferredContactDate}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 w-full rounded-lg border border-input bg-background dark:bg-input/20">
                            <Clock className="mr-2 size-4 text-[#D3A753]" />
                            <SelectValue
                              placeholder={
                                preferredContactDate
                                  ? "Select a time slot"
                                  : "Select date first"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {PREFERRED_CONTACT_TIMES.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Our matchmakers are available Monday to Friday from 10:00 –
                20:00 (Bangkok Time / ICT). Select your preferred date and
                1-hour slot.
              </p>

              {/* SUBMIT BUTTON */}
              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending}
                  className="btn-gradient w-full py-6 text-base font-bold shadow-lg transition-all hover:shadow-xl"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="size-4" />
                      <span>Scheduling Consultation...</span>
                    </div>
                  ) : (
                    <span>Arrange a Confidential Consultation</span>
                  )}
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <Lock className="size-3 text-[#D3A753]" />
                  <span>
                    Your details are strictly confidential. We will never share
                    or sell your information.
                  </span>
                </p>
              </div>
            </fieldset>
          </form>
        </Form>
      </MotionDiv>
    </div>
  )
}
