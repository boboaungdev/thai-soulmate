"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { Check, ChevronsUpDown, User, Mail, Phone, Cake } from "lucide-react"

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
import { DateOfBirthInput } from "@/components/ui/date-of-birth-input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { MotionDiv } from "./motion"

const formSchema = z
  .object({
    prefix: z
      .string()
      .refine((val) => ["Mr.", "Ms.", "Mrs.", "Dr."].includes(val), {
        message: "Please select a prefix.",
      }),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    dob: z.date({
      message: "A date of birth is required.",
    }),
    gender: z.string().refine((val) => ["Male", "Female"].includes(val), {
      message: "Please select a gender.",
    }),
    nationality: z.string().min(2, {
      message: "Nationality must be at least 2 characters.",
    }),
    currentLocation: z.string().min(2, {
      message: "Location must be at least 2 characters.",
    }),
    email: z.email(),
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
  })
  .refine((data) => data.source !== "Other" || !!data.otherSource, {
    message: "Please specify the other source.",
    path: ["otherSource"],
  })

export function RegisterInterestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      prefix: "Mr.",
      name: "",
      dob: undefined,
      gender: "Male",
      nationality: "",
      currentLocation: "",
      email: "",
      phoneCountry: "TH",
      phone: "",
      source: "",
      otherSource: "",
    },
  })

  const [isPending, startTransition] = useTransition()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [openNationality, setOpenNationality] = useState(false)
  const [openCurrentLocation, setOpenCurrentLocation] = useState(false)
  const [openPhoneCountry, setOpenPhoneCountry] = useState(false)
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
  }, [])

  useEffect(() => {
    if (prefix === "Mr." && gender !== "Male") {
      setValue("gender", "Male", { shouldValidate: true })
    } else if ((prefix === "Ms." || prefix === "Mrs.") && gender !== "Female") {
      setValue("gender", "Female", { shouldValidate: true })
    } else if (gender === "Male" && prefix !== "Mr.") {
      // If gender is Male, ensure prefix is Mr.
      if (prefix !== "Dr.") {
        setValue("prefix", "Mr.", { shouldValidate: true })
      }
    } else if (
      gender === "Female" &&
      !["Ms.", "Mrs.", "Dr."].includes(prefix ?? "")
    ) {
      // If gender is Female, default prefix to Ms. if it's not a female-appropriate one
      setValue("prefix", "Ms.", { shouldValidate: true })
    }
  }, [prefix, gender, setValue])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const selectedCountry = countries.find(
          (country) => country.code === values.phoneCountry
        )

        const payload = {
          ...values,
          phoneCountry: `+${selectedCountry?.callCode ?? ""}`,
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
        toast.error("Uh oh! Something went wrong.", {
          description: "An unexpected error occurred. Please try again.",
        })
        console.error(error)
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
          Please check your email and <strong>spam/junk/promotion</strong>{" "}
          folder for the next step and complete the application form.
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
        <h2 className="mb-2 text-3xl font-bold">Register Your Interest</h2>
        <p className="mb-6 text-muted-foreground">
          Fill out the form below to let us know you&apos;re interested.
          We&apos;ll be in touch.
        </p>
      </MotionDiv>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <fieldset disabled={isPending} className="space-y-4">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="grid grid-cols-[100px_1fr] gap-4">
                <FormField
                  control={form.control}
                  name="prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefix</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            id="prefix"
                            className="h-8 flex-1 rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                          >
                            <SelectValue placeholder="Select your prefix" />
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <User className="size-4" />
                          </InputGroupAddon>
                          <InputGroupInput
                            placeholder="Enter your name"
                            {...field}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="grid grid-cols-[100px_1fr] gap-4">
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
                          <SelectTrigger className="h-8 flex-1 rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30">
                            <SelectValue placeholder="Select your gender" />
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
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Cake className="mr-2 size-4" /> Date of Birth
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
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.4 }}
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
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
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
                                "h-8 w-full justify-between rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                <>
                                  {
                                    countries.find(
                                      (country) =>
                                        country.nationality === field.value
                                    )?.flag
                                  }{" "}
                                  {field.value}
                                </>
                              ) : (
                                "Select nationality"
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
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
                                      value={country.nationality}
                                      key={country.code}
                                      onSelect={() => {
                                        field.onChange(country.nationality)
                                        setOpenNationality(false)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          country.nationality === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {country.flag} {country.nationality}
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
                <FormField
                  control={form.control}
                  name="currentLocation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
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
                                "h-8 w-full justify-between rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                <>
                                  {
                                    countries.find(
                                      (country) => country.name === field.value
                                    )?.flag
                                  }{" "}
                                  {field.value}
                                </>
                              ) : (
                                "Select current location"
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
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
                                      value={country.name}
                                      key={country.code}
                                      onSelect={() => {
                                        field.onChange(country.name)
                                        setOpenCurrentLocation(false)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          country.name === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {country.flag} {country.name}
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
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex gap-4">
                  {/* Country code */}
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
                                  "h-8 w-full justify-between rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? `+${
                                      countries.find(
                                        (c) => c.code === field.value
                                      )?.callCode ?? ""
                                    }`
                                  : "+66"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                        { numeric: true }
                                      )
                                    )
                                    .map((country) => (
                                      <CommandItem
                                        value={`${country.name} ${country.code} ${country.callCode} ${country.nationality}`}
                                        key={country.code}
                                        onSelect={() => {
                                          field.onChange(country.code)
                                          setOpenPhoneCountry(false)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            country.code === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {country.flag} (+
                                        {country.callCode})
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

                  {/* Phone number */}
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
                                const { value } = e.target
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
                          <SelectTrigger className="h-8 w-full rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-[var(--radix-select-trigger-width)]">
                          <SelectItem value="Search Engine">
                            Search Engine (Google, Bing, etc.)
                          </SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="Recommandation">
                            Recommandation
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

            {source === "Other" && (
              <MotionDiv
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-[#cfa14f] via-[#cb5d7a] to-[#cb5d7a] text-white"
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
