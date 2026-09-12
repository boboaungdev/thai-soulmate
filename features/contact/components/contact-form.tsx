"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react"
import { Loader2, User, Mail, Type, MessageSquare } from "lucide-react"
import { toast } from "sonner"

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

import { contactFormSchema, type ContactFormData } from "../schemas/contact.schema"
import { submitContactAction } from "../actions/contact.action"

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  function onSubmit(values: ContactFormData) {
    startTransition(async () => {
      try {
        const result = await submitContactAction(values)

        if (!result.ok) {
          toast.error("Failed to send message", {
            description: result.error || "Please try again later.",
          })
          return
        }

        toast.success("Message sent successfully!", {
          description: "Our team will get back to you shortly.",
        })
        form.reset()
      } catch (error) {
        console.error("Error sending message:", error)
        toast.error("Failed to send message. Please try again later.")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={isPending} className="space-y-4">
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
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="mr-2 size-4 animate-spin text-white" />
            )}
            {isPending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
