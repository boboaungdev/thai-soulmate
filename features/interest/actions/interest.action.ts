"use server"

import { revalidatePath } from "next/cache"
import type { RegisterInterestStatus } from "@/lib/generated/prisma/enums"

import {
  registerInterestSchema,
  type RegisterInterestInput,
} from "../schemas/interest.schema"
import {
  processRegisterInterest,
  getInterestList,
  setInterestStatus,
  removeInterest,
} from "../services/interest.service"
import { findExistingApplicationByEmail } from "../repositories/interest.repository"

export async function submitRegisterInterestAction(payload: RegisterInterestInput) {
  const result = registerInterestSchema.safeParse(payload)

  if (!result.success) {
    return {
      ok: false,
      error: result.error.issues?.[0]?.message || "Invalid registration data.",
    } as const
  }

  const outcome = await processRegisterInterest(result.data)

  if (outcome.ok) {
    revalidatePath("/dashboard/register-interest")
  }

  return outcome
}

export async function getRegisterInterestsAction() {
  try {
    const list = await getInterestList()
    return { ok: true, data: list } as const
  } catch (err: any) {
    console.error("Failed to load register interests:", err)
    return { ok: false, error: err?.message || "Failed to load registrations." } as const
  }
}

export async function updateRegisterInterestStatusAction(
  id: string,
  status: RegisterInterestStatus
) {
  try {
    const updated = await setInterestStatus(id, status)
    revalidatePath("/dashboard/register-interest")
    return { ok: true, data: updated } as const
  } catch (err: any) {
    console.error("Failed to update status:", err)
    return { ok: false, error: err?.message || "Failed to update status." } as const
  }
}

export async function deleteRegisterInterestAction(id: string) {
  try {
    const deleted = await removeInterest(id)
    revalidatePath("/dashboard/register-interest")
    return { ok: true, data: deleted } as const
  } catch (err: any) {
    console.error("Failed to delete interest:", err)
    return { ok: false, error: err?.message || "Failed to delete record." } as const
  }
}

export async function checkExistingApplicationAction(email: string) {
  try {
    const existing = await findExistingApplicationByEmail(email)
    return { ok: true, data: existing } as const
  } catch (err: any) {
    return { ok: false, error: "Failed to check application." } as const
  }
}

export async function checkInterestAndApplicationAction(email: string) {
  try {
    const normalized = email.trim().toLowerCase()
    if (!normalized) {
      return { exists: false, hasApplication: false }
    }

    const application = await findExistingApplicationByEmail(normalized)
    if (application) {
      return {
        exists: true,
        hasApplication: true,
        application,
      }
    }

    const { findInterestByEmail } = await import("../repositories/interest.repository")
    const interest = await findInterestByEmail(normalized)

    return {
      exists: !!interest,
      hasApplication: false,
      interest,
    }
  } catch (err: any) {
    console.error("checkInterestAndApplicationAction error:", err)
    return { exists: false, hasApplication: false }
  }
}

