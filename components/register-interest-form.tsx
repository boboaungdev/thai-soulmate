"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  User,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Home,
  Calendar as CalendarIcon,
} from "lucide-react"

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
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { DatePickerInput } from "@/components/ui/date-picker-input"
import { Spinner } from "@/components/ui/spinner"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  birthday: z.date({
    message: "A date of birth is required.",
  }),
  citizenship: z.string().min(2, {
    message: "Citizenship must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  email: z.string().email(),
  phone: z.string().regex(/^\+\d+$/, {
    message: "Phone number must start with a + sign and contain only digits thereafter.",
  }).min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export function RegisterInterestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      citizenship: "",
      location: "",
      email: "",
      phone: "",
      message: "",
    },
  })

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
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthday</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <CalendarIcon className="size-4" />
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
              name="citizenship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Citizenship</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Home className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput placeholder="British" {...field} />
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
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tell us about yourself</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <MessageSquare className="size-4" />
                    </InputGroupAddon>
                    <InputGroupTextarea
                      placeholder="What are you looking for in a partner?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
