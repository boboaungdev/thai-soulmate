"use server"

import { revalidatePath } from "next/cache"
import {
  loginSchema,
  createUserSchema,
  type LoginInput,
  type CreateUserInput,
} from "../schemas/auth.schema"
import {
  authenticateUser,
  listUsers,
  registerUser,
  removeUser,
  checkUserEmailAvailability,
} from "../services/auth.service"

export async function loginAction(payload: LoginInput) {
  const result = loginSchema.safeParse(payload)
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues?.[0]?.message || "Invalid credentials.",
    }
  }

  const outcome = await authenticateUser(result.data)
  if (!outcome.ok) {
    return { success: false, error: outcome.error }
  }

  return { success: true, user: JSON.parse(JSON.stringify(outcome.user)) }
}

export async function getUsersAction(limit: number = 100, page: number = 1) {
  try {
    const data = await listUsers(limit, page)
    return {
      success: true,
      data: JSON.parse(JSON.stringify(data.users)),
      pagination: {
        page,
        limit,
        total: data.total,
        totalPages: data.totalPages,
      },
    }
  } catch (error: any) {
    console.error("getUsersAction error:", error)
    return {
      success: false,
      error: error?.message || "Failed to fetch users",
      data: [],
    }
  }
}

export async function createUserAction(payload: CreateUserInput) {
  const result = createUserSchema.safeParse(payload)
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues?.[0]?.message || "Invalid user data.",
    }
  }

  const outcome = await registerUser(result.data)
  if (!outcome.ok) {
    return { success: false, error: outcome.error }
  }

  revalidatePath("/dashboard/login-user")
  return { success: true, data: JSON.parse(JSON.stringify(outcome.user)) }
}

export async function deleteUserAction(targetUserId: string, currentUserId: string) {
  const outcome = await removeUser(currentUserId, targetUserId)
  if (!outcome.ok) {
    return { success: false, error: outcome.error }
  }

  revalidatePath("/dashboard/login-user")
  return { success: true }
}

export async function checkUserEmailAction(email: string) {
  try {
    const result = await checkUserEmailAvailability(email)
    return { success: true, ...result }
  } catch (error: any) {
    console.error("checkUserEmailAction error:", error)
    return { success: false, error: "Failed to check email." }
  }
}

