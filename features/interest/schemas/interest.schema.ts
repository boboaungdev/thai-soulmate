import { z } from "zod"

export const registerInterestSchema = z.object({
  prefix: z.string().optional().default("Mr."),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional().default(""),
  gender: z.enum(["Male", "Female"]).default("Male"),
  email: z
    .string()
    .email("Invalid email address")
    .transform((val) => val.trim().toLowerCase()),
  phoneCountry: z.string().min(1, "Phone country is required"),
  phone: z
    .string()
    .min(5, "Phone number is too short")
    .regex(/^[0-9\s-]+$/, "Digits and hyphens only"),
  currentLocation: z.string().min(1, "Current location is required"),
  relationshipGoal: z.string().min(1, "Relationship goal is required"),
  preferredContactDate: z.string().min(1, "Preferred contact date is required"),
  preferredContactTime: z.string().min(1, "Preferred contact time is required"),
})

export type RegisterInterestInput = z.infer<typeof registerInterestSchema>

export const updateInterestStatusSchema = z.object({
  id: z.string(),
  status: z.enum([
    "RECEIVED",
    "CONTACTED",
    "INTERVIEWED",
    "CONVERTED",
    "ARCHIVED",
  ]),
})
