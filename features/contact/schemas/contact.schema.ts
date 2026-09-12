import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z
    .string()
    .email({ message: "A valid email is required." })
    .transform((val) => val.trim().toLowerCase()),
  subject: z.string().min(5, { message: "Subject is required." }),
  message: z.string().min(10, { message: "Message is required." }),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
