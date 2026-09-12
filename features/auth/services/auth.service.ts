import { isDisallowedEmail } from "@/constants/email"
import { Role } from "@/lib/generated/prisma/enums"
import {
  findUserByEmail,
  findUserById,
  findUsers,
  createUser,
  deleteUser,
} from "../repositories/user.repository"
import type { LoginInput, CreateUserInput } from "../schemas/auth.schema"

export async function authenticateUser(credentials: LoginInput) {
  const email = credentials.email.toLowerCase().trim()
  const user = await findUserByEmail(email)

  if (!user || user.password !== credentials.password) {
    return { ok: false, error: "Invalid email or password." } as const
  }

  const { password: _, ...userWithoutPassword } = user
  return { ok: true, user: userWithoutPassword } as const
}

export async function listUsers(limit: number = 100, page: number = 1) {
  return findUsers(limit, page)
}

export async function registerUser(input: CreateUserInput) {
  const email = input.email.toLowerCase().trim()

  if (isDisallowedEmail(email)) {
    return { ok: false, error: "This email address is reserved." } as const
  }

  const existing = await findUserByEmail(email)
  if (existing) {
    return { ok: false, error: "A user with this email already exists." } as const
  }

  const newUser = await createUser({
    name: input.name,
    email,
    password: input.password,
    role: input.role,
    avatar: input.avatar,
  })

  return { ok: true, user: newUser } as const
}

export async function removeUser(currentUserId: string, targetUserId: string) {
  if (!currentUserId) {
    return { ok: false, error: "Unauthorized: Missing user ID." } as const
  }

  const currentUser = await findUserById(currentUserId)
  if (!currentUser || currentUser.role !== Role.ADMIN) {
    return { ok: false, error: "Forbidden: Only admins can delete users." } as const
  }

  if (currentUserId === targetUserId) {
    return { ok: false, error: "Admins cannot delete their own account." } as const
  }

  const targetUser = await findUserById(targetUserId)
  if (!targetUser) {
    return { ok: false, error: "User not found." } as const
  }

  if (targetUser.role === Role.ADMIN) {
    return { ok: false, error: "Cannot delete another admin." } as const
  }

  await deleteUser(targetUserId)
  return { ok: true } as const
}

export async function checkUserEmailAvailability(email: string) {
  const normalized = email.trim().toLowerCase()
  if (!normalized) {
    return { exists: false, available: false }
  }

  if (isDisallowedEmail(normalized)) {
    return { exists: true, available: false, reason: "reserved" }
  }

  const user = await findUserByEmail(normalized)
  return {
    exists: Boolean(user),
    available: !user,
  }
}

