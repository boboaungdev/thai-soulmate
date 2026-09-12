import { z } from "zod"
import { Role } from "@/lib/generated/prisma/enums"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

export type LoginInput = z.infer<typeof loginSchema>

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.nativeEnum(Role).default(Role.MEMBER),
  avatar: z.string().optional().nullable(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

