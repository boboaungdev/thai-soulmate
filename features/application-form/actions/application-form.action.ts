"use server"

import { revalidatePath } from "next/cache"
import type { ApplicationFormStatus } from "@/lib/generated/prisma/client"
import {
  processApplicationForm,
  getApplicationsList,
  getApplicationDetails,
  checkApplicationEmail,
  setApplicationStatus,
  removeApplication,
} from "../services/application-form.service"

export async function submitApplicationFormAction(payload: any) {
  try {
    const result = await processApplicationForm(payload)
    if (!result.ok) {
      return {
        success: false,
        message: result.error,
        existing: (result as any).existing,
      }
    }
    revalidatePath("/dashboard/application-form")
    return {
      success: true,
      application: result.data,
    }
  } catch (err: any) {
    console.error("submitApplicationFormAction error:", err)
    return {
      success: false,
      message: err?.message || "Failed to submit application form",
    }
  }
}

export async function getApplicationsAction() {
  try {
    const applications = await getApplicationsList()
    return {
      success: true,
      applications: JSON.parse(JSON.stringify(applications)),
    }
  } catch (err: any) {
    console.error("getApplicationsAction error:", err)
    return {
      success: false,
      message: err?.message || "Failed to fetch applications",
      applications: [],
    }
  }
}

export async function getApplicationByIdAction(id: string) {
  try {
    const application = await getApplicationDetails(id)
    if (!application) {
      return {
        success: false,
        message: "Application not found",
        application: null,
      }
    }
    return {
      success: true,
      application: JSON.parse(JSON.stringify(application)),
    }
  } catch (err: any) {
    console.error("getApplicationByIdAction error:", err)
    return {
      success: false,
      message: err?.message || "Failed to fetch application",
      application: null,
    }
  }
}

export async function checkApplicationEmailAction(email: string) {
  try {
    if (!email) {
      return { exists: false }
    }
    const application = await checkApplicationEmail(email)
    return {
      exists: !!application,
    }
  } catch (err: any) {
    console.error("checkApplicationEmailAction error:", err)
    return { exists: false }
  }
}

export async function updateApplicationStatusAction(
  id: string,
  status: ApplicationFormStatus
) {
  try {
    const updated = await setApplicationStatus(id, status)
    revalidatePath("/dashboard/application-form")
    revalidatePath(`/dashboard/application-form/${id}`)
    return {
      success: true,
      application: JSON.parse(JSON.stringify(updated)),
    }
  } catch (err: any) {
    console.error("updateApplicationStatusAction error:", err)
    return {
      success: false,
      message: err?.message || "Failed to update status",
    }
  }
}

export async function deleteApplicationAction(id: string) {
  try {
    await removeApplication(id)
    revalidatePath("/dashboard/application-form")
    return {
      success: true,
    }
  } catch (err: any) {
    console.error("deleteApplicationAction error:", err)
    return {
      success: false,
      message: err?.message || "Failed to delete application",
    }
  }
}

