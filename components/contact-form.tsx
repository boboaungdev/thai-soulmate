"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { toast } from "sonner"
import { useState } from "react"
import { Loader2, User, Mail, Type, MessageSquare } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z
    .email({
      message: "Please enter a valid email address.",
    })
    .transform((val) => val.trim().toLowerCase()),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          email: values.email.toLowerCase().trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message.")
      }

      toast.success("Message sent successfully!")
      form.reset()
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={loading} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                  Name <span className="text-[#CA617D]">*</span>
                </FormLabel>
                <InputGroup className="h-9 rounded-lg border border-input bg-background transition-all focus-within:border-[#D3A753]/60 focus-within:ring-1 focus-within:ring-[#D3A753]/30 dark:bg-input/20">
                  <InputGroupAddon>
                    <User className="size-4 text-[#D3A753]" />
                  </InputGroupAddon>
                  <FormControl>
                    <InputGroupInput placeholder="Your Name" {...field} />
                  </FormControl>
                </InputGroup>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                  Email <span className="text-[#CA617D]">*</span>
                </FormLabel>
                <InputGroup className="h-9 rounded-lg border border-input bg-background transition-all focus-within:border-[#D3A753]/60 focus-within:ring-1 focus-within:ring-[#D3A753]/30 dark:bg-input/20">
                  <InputGroupAddon>
                    <Mail className="size-4 text-[#D3A753]" />
                  </InputGroupAddon>
                  <FormControl>
                    <InputGroupInput
                      type="email"
                      placeholder="Your Email"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toLowerCase())
                      }
                    />
                  </FormControl>
                </InputGroup>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                  Subject <span className="text-[#CA617D]">*</span>
                </FormLabel>
                <InputGroup className="h-9 rounded-lg border border-input bg-background transition-all focus-within:border-[#D3A753]/60 focus-within:ring-1 focus-within:ring-[#D3A753]/30 dark:bg-input/20">
                  <InputGroupAddon>
                    <Type className="size-4 text-[#D3A753]" />
                  </InputGroupAddon>
                  <FormControl>
                    <InputGroupInput
                      placeholder="Subject of your message"
                      {...field}
                    />
                  </FormControl>
                </InputGroup>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold tracking-wider text-foreground uppercase">
                  Message <span className="text-[#CA617D]">*</span>
                </FormLabel>
                <InputGroup className="rounded-lg border border-input bg-background transition-all focus-within:border-[#D3A753]/60 focus-within:ring-1 focus-within:ring-[#D3A753]/30 dark:bg-input/20">
                  <InputGroupAddon className="self-start pt-2.5">
                    <MessageSquare className="size-4 text-[#D3A753]" />
                  </InputGroupAddon>
                  <FormControl>
                    <InputGroupTextarea
                      placeholder="Your message"
                      rows={5}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </InputGroup>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <div className="pt-2">
          <Button
            type="submit"
            className="btn-gradient h-10 w-full font-semibold text-white shadow-lg shadow-[#D3A753]/20 transition-all hover:brightness-110"
            disabled={loading}
          >
            {loading && (
              <Loader2 className="mr-2 size-4 animate-spin text-white" />
            )}
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
