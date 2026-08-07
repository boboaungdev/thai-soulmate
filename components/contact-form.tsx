"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, User, Mail, Type, MessageSquare } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to send message.");
      }

      toast.success("Message sent successfully!");
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <InputGroup>
                <InputGroupAddon>
                  <User className="h-4 w-4" />
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
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Mail className="h-4 w-4" />
                </InputGroupAddon>
                <FormControl>
                  <InputGroupInput placeholder="Your Email" {...field} />
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
              <FormLabel>Subject</FormLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Type className="h-4 w-4" />
                </InputGroupAddon>
                <FormControl>
                  <InputGroupInput placeholder="Subject of your message" {...field} />
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
              <FormLabel>Message</FormLabel>
              <InputGroup>
                <InputGroupAddon>
                  <MessageSquare className="h-4 w-4" />
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Message
        </Button>
      </form>
    </Form>
  );
}
