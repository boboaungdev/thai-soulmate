"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { addDays, format, startOfToday } from "date-fns"
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Clock,
  User,
  Mail,
  Phone,
  Cake,
  MapPin,
  Globe,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
import { DateOfBirthInput } from "@/components/ui/date-of-birth-input"
import { Textarea } from "@/components/ui/textarea"
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
 * 10:00 - 20:00
 *
 * Each option represents a 1-hour contact window.
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

const formSchema = z.object({
  prefix: z
    .string()
    .refine((val) => ["Mr.", "Ms.", "Mrs.", "Dr."].includes(val), {
      message: "Please select a prefix.",
    }),

  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),

  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),

  dob: z.date({
    message: "A date of birth is required.",
  }),

  gender: z.string().refine((val) => ["Male", "Female"].includes(val), {
    message: "Please select a gender.",
  }),

  nationality: z.string().min(2, {
    message: "Please select your nationality.",
  }),

  currentLocation: z.string().min(2, {
    message: "Please select your current location.",
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

  source: z.string().min(1, {
    message: "Please select how you heard about us.",
  }),

  otherSource: z.string().optional(),

  /*
   * Normal Date object.
   * No custom date format is needed here.
   */
  preferredContactDate: z.date({
    message: "Please select a preferred contact date.",
  }),

  /*
   * Normal string.
   * Example: "10:00 - 11:00"
   */
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
      dob: undefined,
      gender: "Male",
      nationality: "",
      currentLocation: "",
      email: "",
      phoneCountry: "TH",
      phone: "",
      source: "",
      otherSource: "",

      /*
       * No default date.
       */
      preferredContactDate: undefined,

      /*
       * No default time.
       */
      preferredContactTime: undefined,
    },
  })

  const [isPending, startTransition] = useTransition()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [openNationality, setOpenNationality] = useState(false)
  const [openCurrentLocation, setOpenCurrentLocation] = useState(false)
  const [openPhoneCountry, setOpenPhoneCountry] = useState(false)
  const [openContactDate, setOpenContactDate] = useState(false)

  const { setValue } = form

  const prefix = useWatch({
    control: form.control,
    name: "prefix",
  })

  const gender = useWatch({
    control: form.control,
    name: "gender",
  })

  const source = useWatch({
    control: form.control,
    name: "source",
  })

  const preferredContactDate = useWatch({
    control: form.control,
    name: "preferredContactDate",
  })

  const [countries, setCountries] = useState<Country[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)

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
        toast.error("Unable to load countries")
      } finally {
        setLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [form])

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const selectedCountry = countries.find(
          (country) => country.code === values.phoneCountry
        )

        const selectedNationalityCountry = countries.find(
          (country) => country.nationality === values.nationality
        )

        const selectedCurrentLocationCountry = countries.find(
          (country) => country.name === values.currentLocation
        )

        /*
         * Keep preferredContactDate as a normal Date.
         *
         * JSON.stringify automatically converts the Date
         * into an ISO string when sending it to the API.
         */
        const payload = {
          ...values,

          name: `${values.firstName} ${values.lastName}`.trim(),

          phoneCountry: `+${selectedCountry?.callCode ?? ""}`,

          nationalityRegion: selectedNationalityCountry?.region ?? "",

          currentLocationRegion: selectedCurrentLocationCountry?.region ?? "",
        }

        const response = await fetch("/api/register-interest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          toast.success("Submission Successful!", {
            description: "Thank you for your interest. We will be in touch.",
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
      <div className="mx-auto w-full max-w-2xl p-4 text-center">
        <h2 className="mb-2 text-3xl font-bold">Thank You!</h2>

        <p className="text-muted-foreground">
          Your interest has been successfully registered. Our team will contact
          you shortly.
          <br />
          Please check your email. If email is not received, check in{" "}
          <strong>spam/junk/promotion</strong> folder for the next step and
          complete the application form.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-gradient mb-2 text-3xl font-bold">
          Register Your Interest
        </h2>

        <p className="mb-6 text-muted-foreground">
          Fill out the form below to let us know you&apos;re interested.
          We&apos;ll be in touch.
        </p>
      </MotionDiv>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <fieldset disabled={isPending} className="space-y-4">
            {/* NAME */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[100px_1fr_1fr]">
                {/* Prefix */}
                <FormField
                  control={form.control}
                  name="prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefix</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 rounded-lg border border-input bg-background dark:bg-input/30">
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
                      <FormLabel>First Name</FormLabel>

                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <User className="size-4" />
                          </InputGroupAddon>

                          <InputGroupInput
                            placeholder="First name"
                            {...field}
                          />
                        </InputGroup>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>

                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <User className="size-4" />
                          </InputGroupAddon>

                          <InputGroupInput placeholder="Last name" {...field} />
                        </InputGroup>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </MotionDiv>

            {/* GENDER + DOB */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
              }}
            >
              <div className="grid grid-cols-[100px_1fr] gap-4">
                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 rounded-lg border border-input bg-background dark:bg-input/30">
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

                {/* DOB */}
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Cake className="mr-2 size-4" />
                        Date of Birth
                      </FormLabel>

                      <FormControl>
                        <DateOfBirthInput
                          value={field.value}
                          onSelect={field.onChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </MotionDiv>

            {/* NATIONALITY + LOCATION */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.5,
                delay: 0.35,
              }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Nationality */}
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>

                      <Popover
                        open={openNationality}
                        onOpenChange={setOpenNationality}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "h-8 w-full justify-between rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 font-normal shadow-none dark:bg-input/30",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <span className="flex items-center truncate">
                                <Globe className="mr-2 size-4 shrink-0" />

                                {field.value || "Select nationality"}
                              </span>

                              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0"
                          align="start"
                        >
                          <Command>
                            <CommandInput
                              placeholder="Search nationality..."
                              className="h-9"
                            />

                            <CommandEmpty>No nationality found.</CommandEmpty>

                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {loadingCountries ? (
                                <CommandItem disabled>Loading...</CommandItem>
                              ) : (
                                countries
                                  .filter((country) => country.nationality)
                                  .sort((a, b) =>
                                    a.nationality.localeCompare(b.nationality)
                                  )
                                  .map((country) => (
                                    <CommandItem
                                      key={`${country.code}-nationality`}
                                      value={`${country.nationality} ${country.name}`}
                                      onSelect={() => {
                                        field.onChange(country.nationality)
                                        setOpenNationality(false)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 size-4",
                                          country.nationality === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />

                                      <Image
                                        src={country.flag}
                                        alt={country.name}
                                        width={24}
                                        height={16}
                                        className="mr-2 h-4 w-6 rounded object-cover"
                                      />

                                      {country.nationality}
                                    </CommandItem>
                                  ))
                              )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Current Location */}
                <FormField
                  control={form.control}
                  name="currentLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Location</FormLabel>

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
                                "h-8 w-full justify-between rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 font-normal shadow-none dark:bg-input/30",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <span className="flex items-center truncate">
                                <MapPin className="mr-2 size-4 shrink-0" />

                                {field.value || "Select location"}
                              </span>

                              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0"
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
                                <CommandItem disabled>Loading...</CommandItem>
                              ) : (
                                [...countries]
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((country) => (
                                    <CommandItem
                                      key={`${country.code}-location`}
                                      value={`${country.name} ${country.code}`}
                                      onSelect={() => {
                                        field.onChange(country.name)
                                        setOpenCurrentLocation(false)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 size-4",
                                          country.name === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />

                                      <Image
                                        src={country.flag}
                                        alt={country.name}
                                        width={24}
                                        height={16}
                                        className="mr-2 h-4 w-6 rounded object-cover"
                                      />

                                      {country.name}
                                    </CommandItem>
                                  ))
                              )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </MotionDiv>

            {/* EMAIL */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.5,
                delay: 0.4,
              }}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <InputGroup>
                        <InputGroupAddon>
                          <Mail className="size-4" />
                        </InputGroupAddon>

                        <InputGroupInput
                          type="email"
                          placeholder="your@example.com"
                          {...field}
                        />
                      </InputGroup>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </MotionDiv>

            {/* PHONE + SOURCE */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.5,
                delay: 0.45,
              }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Phone */}
                <div className="flex gap-4">
                  {/* Country Code */}
                  <FormField
                    control={form.control}
                    name="phoneCountry"
                    render={({ field }) => (
                      <FormItem className="w-[100px]">
                        <FormLabel>Phone</FormLabel>

                        <Popover
                          open={openPhoneCountry}
                          onOpenChange={setOpenPhoneCountry}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "h-8 w-full justify-between rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 shadow-none dark:bg-input/30",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? `+${
                                      countries.find(
                                        (c) => c.code === field.value
                                      )?.callCode ?? ""
                                    }`
                                  : "Select"}

                                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
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
                                  <CommandItem disabled>Loading...</CommandItem>
                                ) : (
                                  [...countries]
                                    .sort((a, b) =>
                                      a.callCode.localeCompare(
                                        b.callCode,
                                        "en",
                                        {
                                          numeric: true,
                                        }
                                      )
                                    )
                                    .map((country) => (
                                      <CommandItem
                                        value={`${country.name} ${country.code} ${country.callCode} ${country.nationality}`}
                                        key={`${country.code}-phone`}
                                        onSelect={() => {
                                          field.onChange(country.code)
                                          setOpenPhoneCountry(false)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 size-4",
                                            country.code === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        <Image
                                          src={country.flag}
                                          alt={country.name}
                                          width={24}
                                          height={16}
                                          className="mr-2 h-4 w-6 rounded object-cover"
                                        />
                                        (+{country.callCode})
                                      </CommandItem>
                                    ))
                                )}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />

                  {/* Phone Number */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="invisible">Phone</FormLabel>

                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <Phone className="size-4" />
                            </InputGroupAddon>

                            <InputGroupInput
                              type="tel"
                              placeholder="123456789"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value

                                if (/^\d*$/.test(value)) {
                                  field.onChange(value)
                                }
                              }}
                            />
                          </InputGroup>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Source */}
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How did you hear about us?</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 w-full rounded-lg border border-input bg-background dark:bg-input/30">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="w-[var(--radix-select-trigger-width)]">
                          <SelectItem value="Search Engine">
                            Search Engine (Google, Bing, etc.)
                          </SelectItem>

                          <SelectItem value="Facebook">Facebook</SelectItem>

                          <SelectItem value="Instagram">Instagram</SelectItem>

                          <SelectItem value="Recommendation">
                            Recommendation
                          </SelectItem>

                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </MotionDiv>

            {/* PREFERRED CONTACT */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
              }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Date */}
                <FormField
                  control={form.control}
                  name="preferredContactDate"
                  render={({ field }) => {
                    const today = startOfToday()

                    const maxDate = new Date(today)
                    maxDate.setDate(maxDate.getDate() + 7)

                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Preferred contact date</FormLabel>

                        <Popover
                          open={openContactDate}
                          onOpenChange={setOpenContactDate}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-8 w-full justify-start rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 text-left font-normal shadow-none dark:bg-input/30",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 size-4" />

                                {field.value
                                  ? format(field.value, "d MMM yyyy")
                                  : "Pick a date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0" align="start">
  <div className="px-3 pt-3 pb-1 text-xs text-muted-foreground">
    Choose a date within 7 days
  </div>

  <Calendar
    mode="single"
    selected={field.value}
    onSelect={(date) => {
      field.onChange(date)
      setOpenContactDate(false)
    }}
    disabled={(date) =>
      date < today || date > maxDate
    }
  />
</PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                {/* Preferred Contact Time */}
                <FormField
                  control={form.control}
                  name="preferredContactTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred contact time</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!preferredContactDate}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 w-full rounded-lg border border-input bg-background dark:bg-input/30">
                            <Clock className="mr-2 size-4" />

                            <SelectValue
                              placeholder={
                                preferredContactDate
                                  ? "Select a time"
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

              <p className="mt-2 text-xs text-muted-foreground">
                Business hours are 10:00 – 20:00. Choose a date within the next
                7 days and a 1-hour time range when we can call you.
              </p>
            </MotionDiv>

            {/* OTHER SOURCE */}
            {source === "Other" && (
              <MotionDiv
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                }}
              >
                <FormField
                  control={form.control}
                  name="otherSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Please specify</FormLabel>

                      <FormControl>
                        <Textarea
                          placeholder="Tell us where you heard about us"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </MotionDiv>
            )}
          </fieldset>

          {/* SUBMIT */}
          <MotionDiv
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.5,
            }}
            transition={{
              duration: 0.5,
              delay: 0.6,
            }}
          >
            <Button
              type="submit"
              disabled={isPending}
              className="btn-gradient w-full"
            >
              {isPending ? (
                <>
                  <Spinner className="mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </MotionDiv>
        </form>
      </Form>
    </div>
  )
}
