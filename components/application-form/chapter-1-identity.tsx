"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Check,
  ChevronsUpDown,
  Lock,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { DateOfBirthInput } from "@/components/ui/date-of-birth-input"
import { ApplicationFormData, Country } from "./types"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Chapter1Props {
  data: ApplicationFormData
  onChange: (updates: Partial<ApplicationFormData>) => void
  onNext: () => void
}

const MARITAL_STATUSES = ["Never Married", "Divorced", "Widowed"]

const RELIGIONS = [
  "Buddhism",
  "Christianity",
  "Islam",
  "Hinduism",
  "Not religious",
  "Other",
]

export function Chapter1Identity({ data, onChange, onNext }: Chapter1Props) {
  const isFemale = data.gender === "Female"

  // Dropdown states
  const [countries, setCountries] = useState<Country[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [openLocation, setOpenLocation] = useState(false)
  const [openNationality, setOpenNationality] = useState(false)
  const [openPhoneCountry, setOpenPhoneCountry] = useState(false)

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState(false)

  // Fetch countries list
  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch("/api/register-interest/countries")
        if (res.ok) {
          const list: Country[] = await res.json()
          setCountries(list)
        }
      } catch (e) {
        console.error("Error loading countries:", e)
      } finally {
        setLoadingCountries(false)
      }
    }
    loadCountries()
  }, [])

  // Find selected phone country object
  const selectedPhoneCountryObj = countries.find(
    (c) =>
      `+${c.callCode}` === data.phoneCountry ||
      c.code === data.phoneCountry ||
      c.callCode === data.phoneCountry.replace("+", "")
  )

  // Find selected current location country object
  const selectedLocationObj = countries.find(
    (c) => c.name.toLowerCase() === data.currentLocation.toLowerCase()
  )

  // Find selected nationality country object
  const selectedNationalityObj = countries.find(
    (c) =>
      c.nationality?.toLowerCase() === data.nationality.toLowerCase() ||
      c.name.toLowerCase() === data.nationality.toLowerCase()
  )

  // First & Last Name logic
  const firstNameValue =
    data.firstName !== undefined
      ? data.firstName
      : data.name
        ? data.name.split(" ")[0]
        : ""
  const lastNameValue =
    data.lastName !== undefined
      ? data.lastName
      : data.name
        ? data.name.split(" ").slice(1).join(" ")
        : ""

  // Parse data.dob string to Date object
  const dobDateValue = React.useMemo(() => {
    if (!data.dob) return undefined
    const parts = data.dob.split("T")[0].split("-")
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10)
      const m = parseInt(parts[1], 10) - 1
      const d = parseInt(parts[2], 10)
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m, d)
      }
    }
    const parsed = new Date(data.dob)
    return isNaN(parsed.getTime()) ? undefined : parsed
  }, [data.dob])

  const handleFirstNameChange = (val: string) => {
    const lName = lastNameValue
    const fullName = [val.trim(), lName.trim()].filter(Boolean).join(" ")
    onChange({
      firstName: val,
      lastName: lName,
      name: fullName,
    })
    if (touched) {
      setErrors((prev) => {
        const next = { ...prev }
        if (val.trim().length >= 2) {
          delete next.firstName
        } else {
          next.firstName = "First name must be at least 2 characters."
        }
        return next
      })
    }
  }

  const handleLastNameChange = (val: string) => {
    const fName = firstNameValue
    const fullName = [fName.trim(), val.trim()].filter(Boolean).join(" ")
    onChange({
      firstName: fName,
      lastName: val,
      name: fullName,
    })
    if (touched) {
      setErrors((prev) => {
        const next = { ...prev }
        if (val.trim().length >= 2) {
          delete next.lastName
        } else {
          next.lastName = "Last name must be at least 2 characters."
        }
        return next
      })
    }
  }

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {}

    const fName = (
      data.firstName || (data.name ? data.name.split(" ")[0] : "")
    ).trim()
    if (!fName || fName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters."
    }

    const lName = (
      data.lastName ||
      (data.name ? data.name.split(" ").slice(1).join(" ") : "")
    ).trim()
    if (!lName || lName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters."
    }

    if (isFemale && (!data.nickname || data.nickname.trim().length < 2)) {
      newErrors.nickname = "Please enter your nickname (at least 2 characters)."
    }

    if (!data.dob) {
      newErrors.dob = "Please select your date of birth."
    } else {
      const birthDate = new Date(data.dob)
      const ageDiffMs = Date.now() - birthDate.getTime()
      const ageDate = new Date(ageDiffMs)
      const age = Math.abs(ageDate.getUTCFullYear() - 1970)
      if (age < 20) {
        newErrors.dob = "Applicants must be at least 20 years old."
      }
    }

    if (!data.currentLocation.trim()) {
      newErrors.currentLocation = "Please select your current location."
    }

    if (!data.phone.trim() || data.phone.trim().length < 6) {
      newErrors.phone = "Please enter a valid phone number (minimum 6 digits)."
    }

    if (!data.phoneCountry.trim()) {
      newErrors.phoneCountry = "Please select country code."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Next Click (ALWAYS clickable)
  const handleNextClick = () => {
    setTouched(true)
    const isValid = validate()

    if (!isValid) {
      toast.error("Please complete all required fields correctly.")
      return
    }

    setErrors({})
    onNext()
  }

  return (
    <div className="space-y-6 pt-2">
      {/* ROW 1: PREFIX, FIRST NAME, LAST NAME */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[90px_1fr_1fr]">
        {/* Prefix */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Prefix
          </Label>
          <Select
            value={data.prefix}
            onValueChange={(val) => {
              const updates: Partial<ApplicationFormData> = { prefix: val }
              if (val === "Mr.") {
                updates.gender = "Male"
                setErrors((prev) => {
                  const next = { ...prev }
                  delete next.nickname
                  return next
                })
              }
              if (val === "Ms." || val === "Mrs.") updates.gender = "Female"
              onChange(updates)
            }}
          >
            <SelectTrigger className="h-9 rounded-lg border border-input bg-background text-xs sm:text-sm dark:bg-input/20">
              <SelectValue placeholder="Prefix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mr.">Mr.</SelectItem>
              <SelectItem value="Ms.">Ms.</SelectItem>
              <SelectItem value="Mrs.">Mrs.</SelectItem>
              <SelectItem value="Dr.">Dr.</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* First Name */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            First Name <span className="text-[#CA617D]">*</span>
          </Label>
          <InputGroup
            className={cn(
              "h-9 rounded-lg border border-input bg-background dark:bg-input/20",
              touched &&
                errors.firstName &&
                "border-destructive ring-1 ring-destructive"
            )}
          >
            <InputGroupAddon className="pl-3">
              <User className="size-3.5 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              value={firstNameValue}
              onChange={(e) => handleFirstNameChange(e.target.value)}
              placeholder="e.g. Alex"
              className="h-full text-xs sm:text-sm"
            />
          </InputGroup>
          {touched && errors.firstName && (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
              <AlertCircle className="size-3" />
              <span>{errors.firstName}</span>
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Last Name <span className="text-[#CA617D]">*</span>
          </Label>
          <InputGroup
            className={cn(
              "h-9 rounded-lg border border-input bg-background dark:bg-input/20",
              touched &&
                errors.lastName &&
                "border-destructive ring-1 ring-destructive"
            )}
          >
            <InputGroupAddon className="pl-3">
              <User className="size-3.5 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              value={lastNameValue}
              onChange={(e) => handleLastNameChange(e.target.value)}
              placeholder="e.g. Johnson"
              className="h-full text-xs sm:text-sm"
            />
          </InputGroup>
          {touched && errors.lastName && (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
              <AlertCircle className="size-3" />
              <span>{errors.lastName}</span>
            </p>
          )}
        </div>
      </div>

      {/* ROW 2: GENDER & DATE OF BIRTH */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[120px_1fr]">
        {/* Gender */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Gender
          </Label>
          <Select
            value={data.gender}
            onValueChange={(val) => {
              const updates: Partial<ApplicationFormData> = { gender: val }
              if (val === "Male") {
                if (data.prefix !== "Dr.") updates.prefix = "Mr."
                setErrors((prev) => {
                  const next = { ...prev }
                  delete next.nickname
                  return next
                })
              }
              if (val === "Female" && data.prefix !== "Dr.")
                updates.prefix = "Ms."
              onChange(updates)
            }}
          >
            <SelectTrigger className="h-9 rounded-lg border border-input bg-background text-xs sm:text-sm dark:bg-input/20">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date of Birth (Day, Month, Year 3-input style) */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Date of Birth <span className="text-[#CA617D]">*</span>
          </Label>
          <DateOfBirthInput
            value={dobDateValue}
            hasError={touched && !!errors.dob}
            onSelect={(date) => {
              if (date) {
                const y = date.getFullYear()
                const m = String(date.getMonth() + 1).padStart(2, "0")
                const d = String(date.getDate()).padStart(2, "0")
                const isoDateStr = `${y}-${m}-${d}`
                onChange({ dob: isoDateStr })

                if (touched) {
                  const ageDiffMs = Date.now() - date.getTime()
                  const ageDate = new Date(ageDiffMs)
                  const age = Math.abs(ageDate.getUTCFullYear() - 1970)
                  setErrors((prev) => {
                    const next = { ...prev }
                    if (age < 20) {
                      next.dob = "Applicants must be at least 20 years old."
                    } else {
                      delete next.dob
                    }
                    return next
                  })
                }
              } else {
                onChange({ dob: "" })
                if (touched) {
                  setErrors((prev) => ({
                    ...prev,
                    dob: "Please select your date of birth.",
                  }))
                }
              }
            }}
          />
          {touched && errors.dob ? (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
              <AlertCircle className="size-3" />
              <span>{errors.dob}</span>
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Must be 20 years or older. Handled with absolute discretion.
            </p>
          )}
        </div>
      </div>

      {/* CONDITIONAL: NICKNAME FOR THAI LADIES (REQUIRED) */}
      {isFemale && (
        <div className="space-y-1.5 rounded-2xl border border-[#D3A753]/30 bg-[#D3A753]/5 p-4">
          <Label className="text-xs font-semibold tracking-wider text-[#D3A753] uppercase">
            Nickname (ชื่อเล่น) <span className="text-[#CA617D]">*</span>
          </Label>
          <Input
            value={data.nickname}
            onChange={(e) => {
              const val = e.target.value
              onChange({ nickname: val })
              if (touched) {
                setErrors((prev) => {
                  const next = { ...prev }
                  if (val.trim().length >= 2) {
                    delete next.nickname
                  } else {
                    next.nickname =
                      "Please enter your nickname (at least 2 characters)."
                  }
                  return next
                })
              }
            }}
            placeholder="e.g. Noon, Bow, Mint, Ploy, Fon..."
            className={cn(
              "h-9 rounded-lg border border-input bg-background text-xs sm:text-sm dark:bg-input/20",
              touched &&
                errors.nickname &&
                "border-destructive ring-1 ring-destructive"
            )}
          />
          {touched && errors.nickname ? (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
              <AlertCircle className="size-3" />
              <span>{errors.nickname}</span>
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              In Thailand, nicknames are warmly used in friendly and respectful
              conversation.
            </p>
          )}
        </div>
      )}

      {/* ROW 3: RELIGION & MARITAL STATUS */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[180px_1fr]">
        {/* Religion */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Religion
          </Label>
          <Select
            value={data.religion}
            onValueChange={(val) => onChange({ religion: val })}
          >
            <SelectTrigger className="h-9 rounded-lg border border-input bg-background text-xs sm:text-sm dark:bg-input/20">
              <SelectValue placeholder="Religion" />
            </SelectTrigger>
            <SelectContent>
              {RELIGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Marital Status */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Marital Status
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {MARITAL_STATUSES.map((status) => {
              const isSelected = data.maritalStatus === status
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onChange({ maritalStatus: status })}
                  className={cn(
                    "flex h-9 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition-all duration-200 sm:text-sm",
                    isSelected
                      ? "border-[#D3A753] bg-gradient-to-r from-[#D3A753]/20 to-[#CA617D]/10 text-foreground shadow-xs ring-1 ring-[#D3A753]/50"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:border-border hover:bg-card/90 hover:text-foreground"
                  )}
                >
                  {isSelected && <Check className="size-3.5 text-[#D3A753]" />}
                  <span className="truncate">{status}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ROW 4: SEARCHABLE LOCATION & NATIONALITY COMBOBOXES */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {/* Where are you currently based? (Searchable Dropdown) */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Where are you currently based?{" "}
            <span className="text-[#CA617D]">*</span>
          </Label>
          <Popover open={openLocation} onOpenChange={setOpenLocation}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "h-9 w-full justify-between rounded-lg border-input bg-background px-3 text-left text-xs font-normal sm:text-sm dark:bg-input/20",
                  !data.currentLocation && "text-muted-foreground",
                  touched &&
                    errors.currentLocation &&
                    "border-destructive ring-1 ring-destructive"
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  {selectedLocationObj?.flag ? (
                    <Image
                      src={selectedLocationObj.flag}
                      alt={selectedLocationObj.name}
                      width={16}
                      height={12}
                      className="shrink-0 rounded-xs"
                    />
                  ) : (
                    <MapPin className="size-3.5 shrink-0 text-[#D3A753]" />
                  )}
                  <span className="truncate">
                    {data.currentLocation ||
                      "Select your current country / location..."}
                  </span>
                </span>
                <ChevronsUpDown className="size-3.5 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[300px] p-0 sm:w-[380px]"
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
                        value={c.name}
                        onSelect={() => {
                          onChange({
                            currentLocation: c.name,
                            currentLocationRegion: c.region,
                          })
                          setOpenLocation(false)
                          if (touched) {
                            setErrors((prev) => {
                              const next = { ...prev }
                              delete next.currentLocation
                              return next
                            })
                          }
                        }}
                        className="flex items-center gap-2 text-xs"
                      >
                        <Image
                          src={c.flag}
                          alt={c.name}
                          width={16}
                          height={12}
                          className="shrink-0 rounded-xs"
                        />
                        <span className="truncate">{c.name}</span>
                        {data.currentLocation === c.name && (
                          <Check className="ml-auto size-4 text-[#D3A753]" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {touched && errors.currentLocation && (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
              <AlertCircle className="size-3" />
              <span>{errors.currentLocation}</span>
            </p>
          )}
        </div>

        {/* Nationality (Searchable Dropdown) */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Nationality
          </Label>
          <Popover open={openNationality} onOpenChange={setOpenNationality}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "h-9 w-full justify-between rounded-lg border-input bg-background px-3 text-left text-xs font-normal sm:text-sm dark:bg-input/20",
                  !data.nationality && "text-muted-foreground"
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  {selectedNationalityObj?.flag && (
                    <Image
                      src={selectedNationalityObj.flag}
                      alt={data.nationality}
                      width={16}
                      height={12}
                      className="shrink-0 rounded-xs"
                    />
                  )}
                  <span className="truncate">
                    {data.nationality || "Select nationality..."}
                  </span>
                </span>
                <ChevronsUpDown className="size-3.5 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[300px] p-0 sm:w-[380px]"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Search nationality..." />
                <CommandList className="max-h-60">
                  <CommandEmpty>No nationality found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((c) => (
                      <CommandItem
                        key={c.code}
                        value={`${c.nationality} ${c.name}`}
                        onSelect={() => {
                          onChange({
                            nationality: c.nationality || c.name,
                            nationalityRegion: c.region,
                          })
                          setOpenNationality(false)
                        }}
                        className="flex items-center gap-2 text-xs"
                      >
                        <Image
                          src={c.flag}
                          alt={c.name}
                          width={16}
                          height={12}
                          className="shrink-0 rounded-xs"
                        />
                        <span className="truncate">
                          {c.nationality || c.name}
                        </span>
                        {data.nationality === (c.nationality || c.name) && (
                          <Check className="ml-auto size-4 text-[#D3A753]" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* ROW 5: EMAIL (LOCKED) & WHATSAPP PHONE (WITH CALL CODE DROPDOWN) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {/* Email Address - LOCKED & DISABLED */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Email Address
            </Label>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#D3A753]">
              <Lock className="size-3" />
              <span>Locked to Consultation</span>
            </span>
          </div>
          <InputGroup className="h-9 cursor-not-allowed border-dashed bg-muted/40 opacity-90">
            <InputGroupAddon className="pl-3">
              <Mail className="size-3.5 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              type="email"
              readOnly
              disabled
              value={data.email}
              className="cursor-not-allowed font-mono text-xs text-muted-foreground sm:text-sm"
            />
          </InputGroup>
          <p className="text-[11px] text-muted-foreground">
            Tied to your verified consultation record. Cannot be edited.
          </p>
        </div>

        {/* WhatsApp / Phone with Country Code Dropdown */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-foreground uppercase">
            WhatsApp / Phone <span className="text-[#CA617D]">*</span>
          </Label>
          <div className="flex gap-2">
            {/* Phone Country Code Combobox */}
            <Popover open={openPhoneCountry} onOpenChange={setOpenPhoneCountry}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="h-9 w-[115px] shrink-0 justify-between rounded-lg border-input bg-background px-2.5 text-xs font-normal dark:bg-input/20"
                >
                  {selectedPhoneCountryObj ? (
                    <span className="flex items-center gap-1.5 truncate text-xs">
                      <Image
                        src={selectedPhoneCountryObj.flag}
                        alt={selectedPhoneCountryObj.code}
                        width={16}
                        height={12}
                        className="shrink-0 rounded-xs"
                      />
                      <span>+{selectedPhoneCountryObj.callCode}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {data.phoneCountry || "+66"}
                    </span>
                  )}
                  <ChevronsUpDown className="size-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search country / code..." />
                  <CommandList className="max-h-60">
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((c) => (
                        <CommandItem
                          key={c.code}
                          value={`${c.name} +${c.callCode}`}
                          onSelect={() => {
                            onChange({ phoneCountry: `+${c.callCode}` })
                            setOpenPhoneCountry(false)
                            if (touched) {
                              setErrors((prev) => {
                                const next = { ...prev }
                                delete next.phoneCountry
                                return next
                              })
                            }
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
                            <span className="truncate">{c.name}</span>
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
            <div className="flex-1">
              <InputGroup
                className={cn(
                  "h-9 rounded-lg border border-input bg-background dark:bg-input/20",
                  touched &&
                    errors.phone &&
                    "border-destructive ring-1 ring-destructive"
                )}
              >
                <InputGroupAddon className="pl-3">
                  <Phone className="size-3.5 text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  type="tel"
                  value={data.phone}
                  onChange={(e) => {
                    onChange({ phone: e.target.value })
                    if (touched) {
                      setErrors((prev) => {
                        const next = { ...prev }
                        if (e.target.value.trim().length >= 6) {
                          delete next.phone
                        } else {
                          next.phone =
                            "Please enter a valid phone number (minimum 6 digits)."
                        }
                        return next
                      })
                    }
                  }}
                  placeholder="0812345678"
                  className="h-full text-xs sm:text-sm"
                />
              </InputGroup>
            </div>
          </div>
          {touched && errors.phone && (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
              <AlertCircle className="size-3" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>
      </div>

      {/* CONTINUATION BUTTON (NEVER DISABLED) */}
      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={handleNextClick}
          className="btn-gradient inline-flex h-10 items-center gap-1.5 px-6 text-xs font-semibold shadow-md transition-all hover:scale-[1.01] sm:text-sm"
        >
          <span>Continue to Career &amp; Lifestyle</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
