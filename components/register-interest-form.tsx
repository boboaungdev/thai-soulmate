"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { User, MapPin, Mail, Phone, Home, Cake } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import { DatePickerInput } from "@/components/ui/date-picker-input"
import { Spinner } from "@/components/ui/spinner"

const formSchema = z.object({
  salutation: z
    .string()
    .refine((val) => ["Mr.", "Ms.", "Mrs.", "Dr."].includes(val), {
      message: "Please select a salutation.",
    }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  birthday: z.date({
    message: "A date of birth is required.",
  }),
  gender: z.string().refine((val) => ["Male", "Female"].includes(val), {
    message: "Please select a gender.",
  }),
  nationality: z.string().min(2, {
    message: "Nationality must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\+\d+$/, {
      message:
        "Phone number must start with a + sign and contain only digits thereafter.",
    })
    .min(10, {
      message: "Phone number must be at least 10 characters.",
    }),
})

export function RegisterInterestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      salutation: undefined,
      name: "",
      gender: undefined,
      nationality: "",
      location: "",
      email: "",
      phone: "",
    },
  })

  const { setValue, getValues, watch } = form

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "salutation" && type === "change") {
        const currentGender = getValues("gender")
        if (value.salutation === "Mr." && currentGender !== "Male") {
          setValue("gender", "Male", { shouldValidate: true })
        } else if (
          ["Ms.", "Mrs."].includes(value.salutation ?? "") &&
          currentGender !== "Female"
        ) {
          setValue("gender", "Female", { shouldValidate: true })
        }
      } else if (name === "gender" && type === "change") {
        const currentSalutation = getValues("salutation")
        if (value.gender === "Male" && currentSalutation !== "Mr.") {
          setValue("salutation", "Mr.", { shouldValidate: true })
        } else if (
          value.gender === "Female" &&
          !["Ms.", "Mrs."].includes(currentSalutation ?? "")
        ) {
          setValue("salutation", "Ms.", { shouldValidate: true })
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, getValues, setValue])

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      <h2 className="mb-2 text-center text-3xl font-bold">
        Register Your Interest
      </h2>
      <p className="mb-6 text-center text-muted-foreground">
        Fill out the form below to let us know you&apos;re interested.
        We&apos;ll be in touch.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="salutation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salutation</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-8 flex-1 rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30">
                        <SelectValue placeholder="Select your salutation" />
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-8 flex-1 rounded-lg border border-input bg-background py-1 pr-2.5 pl-3 shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Cake className="size-4" />
                      </InputGroupAddon>
                      <DatePickerInput
                        value={field.value}
                        onSelect={field.onChange}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Home className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput placeholder="Thai" {...field} />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Location</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <MapPin className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="Bangkok, Thailand"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Phone className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="tel"
                        placeholder="+66 123 456 789"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            className="w-full bg-gradient-to-r from-[#cfa14f] via-[#cb5d7a] to-[#cb5d7a] text-white"
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
