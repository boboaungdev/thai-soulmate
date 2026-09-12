import { resend } from "@/lib/resend"
import { APP_INFO, EMAIL } from "@/constants"
import { ApplicationFormAdminNotificationEmail } from "../emails"
import type { ApplicationFormStatus } from "@/lib/generated/prisma/client"
import {
  findAllApplications,
  findApplicationById,
  findApplicationByEmail,
  createApplicationWithRelations,
  updateApplicationStatus as updateRepoStatus,
  deleteApplication as deleteRepoApplication,
} from "../repositories/application-form.repository"

export async function processApplicationForm(body: any) {
  const email = body.details?.email?.trim()?.toLowerCase()
  if (!email) {
    return {
      ok: false,
      error: "Applicant email is required.",
    } as const
  }

  // 1. Check existing application
  const existing = await findApplicationByEmail(email)
  if (existing) {
    return {
      ok: false,
      error:
        "An application form has already been submitted for this email address.",
      existing: {
        customId: existing.customId,
        status: existing.status,
      },
    } as const
  }

  // 2. Prepare payload matching exact schema
  const formattedPayload = {
    personalDetails: {
      nickname: body.profile?.nickname ?? body.details?.nickname ?? "",
      prefix: body.details?.prefix ?? "Mr.",
      name: body.details?.name ?? "",
      gender: body.details?.gender ?? "Male",
      dob: body.details?.dob ?? "",
      email: email,
      phone: body.details?.phone ?? "",
      nationality: body.details?.nationality ?? "",
      currentLocation: body.details?.currentLocation ?? "",
      nationalityRegion: body.details?.nationalityRegion ?? "Asia",
      currentLocationRegion: body.details?.currentLocationRegion ?? "Asia",
    },
    career: {
      occupation: body.profile?.occupation ?? "",
      company: body.profile?.company ?? "",
      education: body.profile?.education ?? "",
    },
    appearance: {
      height: body.profile?.height ?? "",
      weight: body.profile?.weight ?? "",
      religion: body.profile?.religion ?? "",
      thaiFluency: body.profile?.thaiFluency ?? [50],
      englishFluency: body.profile?.englishFluency ?? [50],
    },
    personality: {
      personality: body.profile?.personality ?? [],
      about: body.profile?.about ?? "",
      bestQualities: body.profile?.bestQualities ?? [],
      lookingForQualities: body.profile?.lookingForQualities ?? [],
      maritalStatus: body.profile?.maritalStatus ?? "",
      hasChildren: body.profile?.hasChildren ?? false,
      childrenCount: body.profile?.childrenCount ?? 0,
    },
    lifestyle: {
      lifestyle: body.profile?.lifestyle ?? [],
      smoking: body.profile?.smoking ?? "",
      drinking: body.profile?.drinking ?? "",
      exercise: body.profile?.exercise ?? "",
      pets: body.profile?.pets || [],
      dietaryPreferences: body.profile?.dietaryPreferences || [],
      interests: body.profile?.interests ?? [],
      otherInterest: body.profile?.otherInterest ?? "",
      travelDestinations: body.profile?.travelDestinations ?? [],
      weekendActivity: body.profile?.weekendActivity ?? "",
      familyImportance: body.profile?.familyImportance ?? "",
      futureChildren: body.profile?.futureChildren ?? "",
      values: body.profile?.values ?? [],
    },
    relationshipGoals: {
      relationshipGoal: body.profile?.relationshipGoal || "",
      marriageIntent: body.profile?.marriageIntent || "",
      relocationWillingness: body.profile?.relocationWillingness || "",
      wantsChildren: body.profile?.wantsChildren || false,
      timeline: body.profile?.timeline || "",
      relocate: body.relationshipGoals?.relocate ?? "",
      lookingFor: body.relationshipGoals?.lookingFor ?? [],
      settleDown: body.relationshipGoals?.settleDown ?? "",
    },
    idealPartner: {
      preferredMinAge: body.profile?.preferredMinAge || 20,
      preferredMaxAge: body.profile?.preferredMaxAge || 50,
      preferredGenders: body.profile?.preferredGenders || [],
      preferredNationalities: body.profile?.preferredNationalities || [],
      dealbreakers: body.profile?.dealbreakers || [],
      ageRange: body.profile?.idealPartnerAgeRange ?? "",
      nationality: body.profile?.idealPartnerNationality ?? [],
      location: body.profile?.idealPartnerLocation ?? [],
      height: body.profile?.idealPartnerHeight ?? "",
      weight: body.profile?.idealPartnerWeight ?? "Any",
      education: body.profile?.idealPartnerEducation ?? "",
      personality: body.profile?.idealPartnerPersonality ?? [],
      qualities: body.profile?.idealPartnerQualities ?? [],
      dealBreakers: body.profile?.dealBreakers ?? [],
    },
    financial: {
      incomeRange: body.profile?.incomeRange || "",
      homeOwnership: body.profile?.homeOwnership || "",
      debtStatus: body.profile?.debtStatus || "",
      ownBusiness: body.financial?.ownBusiness ?? "No",
      ownProperty: body.financial?.ownProperty ?? "No",
    },
    photos: {
      headshot: body.photos?.headshot ?? "",
      fullLength: body.photos?.fullLength ?? "",
      casualLifestyle: body.photos?.casualLifestyle ?? "",
    },
    plan: body.plan || "NONE",
  }

  // 3. Save to database
  let application: any
  try {
    application = await createApplicationWithRelations(formattedPayload)
  } catch (dbErr: any) {
    console.error("Failed to save application form to DB:", dbErr)
    return {
      ok: false,
      error: "Failed to save application. Please try again.",
    } as const
  }

  // 4. Send Admin Notification Email via Resend
  try {
    const { data, error } = await resend.emails.send({
      from: `"${APP_INFO.name}" <${EMAIL.notify}>`,
      to: EMAIL.NOTIFICATIONS,
      replyTo: formattedPayload.personalDetails.email,
      subject: `[New Application Form] New application received from ${formattedPayload.personalDetails.prefix} ${formattedPayload.personalDetails.name}`,
      react: ApplicationFormAdminNotificationEmail({
        prefix: formattedPayload.personalDetails.prefix,
        nickname: formattedPayload.personalDetails.nickname ?? "",
        name: formattedPayload.personalDetails.name,
        gender: formattedPayload.personalDetails.gender,
        email: formattedPayload.personalDetails.email,
        phone: formattedPayload.personalDetails.phone,
      }),
    })

    if (error) {
      console.error("Resend email error:", error)
    } else {
      console.log("Application form email sent:", data?.id)
    }
  } catch (emailErr) {
    console.warn(
      "Failed to dispatch admin notification email (continuing):",
      emailErr
    )
  }

  return {
    ok: true,
    data: application,
  } as const
}

export async function getApplicationsList() {
  return findAllApplications()
}

export async function getApplicationDetails(id: string) {
  return findApplicationById(id)
}

export async function checkApplicationEmail(email: string) {
  return findApplicationByEmail(email)
}

export async function setApplicationStatus(
  id: string,
  status: ApplicationFormStatus
) {
  return updateRepoStatus(id, status)
}

export async function removeApplication(id: string) {
  return deleteRepoApplication(id)
}
