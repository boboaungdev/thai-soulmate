import { APP_INFO, EMAIL } from "@/constants"
import { resend } from "@/lib/resend"
import {
  RegisterInterestAdminNotificationEmail,
  RegisterInterestMemberConfirmationEmail,
} from "@/emails"
import { formatDate } from "@/lib/date"
import { findCountryByName } from "@/features/shared/countries"
import type { RegisterInterestStatus } from "@/lib/generated/prisma/enums"

import {
  findExistingApplicationByEmail,
  upsertInterest,
  findAllInterests,
  findInterestById,
  updateInterestStatus as updateRepoStatus,
  deleteInterest as deleteRepoInterest,
} from "../repositories/interest.repository"
import type { RegisterInterestInput } from "../schemas/interest.schema"

export async function processRegisterInterest(input: RegisterInterestInput) {
  const normalizedEmail = input.email.trim().toLowerCase()

  // 1. Check if application form already exists
  const existingApp = await findExistingApplicationByEmail(normalizedEmail)
  if (existingApp) {
    return {
      ok: false,
      error: "This email has already submitted an application form.",
    } as const
  }

  // 2. Format name
  const formattedName = [input.firstName, input.lastName]
    .filter(Boolean)
    .join(" ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")

  // 3. Derive location and nationality regions from local data
  const locationCountry = findCountryByName(input.currentLocation)
  const currentLocationRegion =
    input.currentLocationRegion || locationCountry?.region || ""
  const nationality =
    input.nationality || locationCountry?.nationality || input.currentLocation
  const nationalityRegion =
    input.nationalityRegion || locationCountry?.region || ""

  const contactDateObj = input.preferredContactDate
    ? new Date(input.preferredContactDate)
    : null

  const interestRecord = {
    email: normalizedEmail,
    prefix: input.prefix || "Mr.",
    name: formattedName,
    gender: input.gender || "Male",
    nationality,
    nationalityRegion,
    currentLocation: input.currentLocation,
    currentLocationRegion,
    relationshipGoal: input.relationshipGoal || null,
    phoneCountry: input.phoneCountry.startsWith("+")
      ? input.phoneCountry
      : `+${input.phoneCountry}`,
    phone: input.phone.trim(),
    preferredContactDate: contactDateObj,
    preferredContactTime: input.preferredContactTime || null,
    source: input.source || "Website Consultation",
  }

  // 4. Save to Database
  try {
    await upsertInterest(interestRecord)
  } catch (dbErr: any) {
    console.error("Failed to save register interest in DB:", dbErr)
    return {
      ok: false,
      error: "Failed to save your consultation request. Please try again.",
    } as const
  }

  // 5. Send User Confirmation Email
  try {
    await resend.emails.send({
      from: `"${APP_INFO.name}" <${EMAIL.register}>`,
      to: normalizedEmail,
      replyTo: EMAIL.contact,
      subject: `[Consultation Request] Thank you for contacting ${APP_INFO.name}!`,
      react: RegisterInterestMemberConfirmationEmail({
        prefix: interestRecord.prefix,
        name: interestRecord.name,
        email: interestRecord.email,
        preferredContactDate: contactDateObj
          ? formatDate(contactDateObj)
          : undefined,
        preferredContactTime: interestRecord.preferredContactTime || undefined,
      }),
    })
  } catch (userEmailErr) {
    console.warn("User confirmation email failed (continuing):", userEmailErr)
  }

  // 6. Send Admin Notification Email
  try {
    await resend.emails.send({
      from: `"${APP_INFO.name}" <${EMAIL.notify}>`,
      to: EMAIL.NOTIFICATIONS,
      subject: `[Consultation Request] New Request from ${interestRecord.prefix} ${interestRecord.name}`,
      react: RegisterInterestAdminNotificationEmail({
        prefix: interestRecord.prefix,
        name: interestRecord.name,
        email: interestRecord.email,
        phone: interestRecord.phone,
        phoneCountry: interestRecord.phoneCountry,
        currentLocation: interestRecord.currentLocation,
        relationshipGoal: interestRecord.relationshipGoal || undefined,
        preferredContactDate: contactDateObj
          ? formatDate(contactDateObj)
          : undefined,
        preferredContactTime: interestRecord.preferredContactTime || undefined,
      }),
    })
  } catch (adminEmailErr) {
    console.warn("Admin notification email failed (continuing):", adminEmailErr)
  }

  return {
    ok: true,
    data: {
      message: "Consultation Request Received!",
    },
  } as const
}

export async function getInterestList() {
  return findAllInterests()
}

export async function getInterestById(id: string) {
  return findInterestById(id)
}

export async function setInterestStatus(
  id: string,
  status: RegisterInterestStatus
) {
  return updateRepoStatus(id, status)
}

export async function removeInterest(id: string) {
  return deleteRepoInterest(id)
}
