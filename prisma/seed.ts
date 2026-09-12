import "dotenv/config"
import { prisma } from "../lib/prisma.js"
import {
  MembershipPlan,
  RegisterInterestStatus,
} from "../lib/generated/prisma/client.js"
import applicationForms from "./seed-data/application-form.json" with { type: "json" }

/*
 * Preferred contact times matching the exact 1-hour slots in
 * components/register-interest-form.tsx (10:00 - 20:00 ICT)
 */
const PREFERRED_CONTACT_TIMES = [
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
]

async function main() {
  console.log("Starting database seed with Register Interest form data...")

  // Clean previous records in safe relational order
  console.log("Cleaning previous application and registration data...")
  await prisma.note.deleteMany()
  await prisma.registerInterest.deleteMany()
  await prisma.profileFile.deleteMany()
  await prisma.profileFolder.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.membership.deleteMany()
  await prisma.trackingNote.deleteMany()
  await prisma.trackingFile.deleteMany()
  await prisma.trackingFolder.deleteMany()
  await prisma.trackingStatusHistory.deleteMany()
  await prisma.tracking.deleteMany()
  await prisma.applicationForm.deleteMany()

  // 1. Seed Register Interests (strictly matching fields collected in home page form)
  console.log(
    "Seeding Register Interests matching website consultation form..."
  )
  for (let i = 0; i < applicationForms.length; i++) {
    const form = applicationForms[i]
    const personal = form.personalDetails
    const relGoals = form.relationshipGoals

    // Extract country call code (e.g. "+66") and phone digits
    const match =
      personal.phone?.match(/^(\+\d{1,3})(\d+)$/) ||
      personal.phone?.match(/^\((\+\d{1,3})\)\s*(\d+)$/)
    const phoneCountry = match ? match[1] : "+66"
    const phone = match ? match[2] : personal.phone || ""

    // Relationship goal from user choices
    const lookingFor =
      Array.isArray(relGoals?.lookingFor) && relGoals.lookingFor.length > 0
        ? relGoals.lookingFor[0]
        : "Marriage / Life Partner"

    // Preferred appointment within next 7 days (as constrained by calendar picker)
    const contactDate = new Date(Date.now() + ((i % 7) + 1) * 86400000)

    await prisma.registerInterest.create({
      data: {
        prefix: personal.prefix || "Mr.",
        name: personal.name,
        gender: personal.gender,
        currentLocation: personal.currentLocation || "Thailand",
        currentLocationRegion: personal.currentLocationRegion || "Asia",
        nationality:
          personal.nationality || personal.currentLocation || "Thailand",
        nationalityRegion: personal.nationalityRegion || "Asia",
        relationshipGoal: lookingFor,
        email: personal.email.toLowerCase(),
        phoneCountry: phoneCountry,
        phone: phone,
        preferredContactDate: contactDate,
        preferredContactTime:
          PREFERRED_CONTACT_TIMES[i % PREFERRED_CONTACT_TIMES.length],
        source: "Website Consultation",
        status: RegisterInterestStatus.RECEIVED,
      },
    })
  }

  // 2. Seed ApplicationForm + Membership + Profile
  console.log("Seeding Application Forms, Memberships, and Profiles...")
  for (const form of applicationForms) {
    const application = await prisma.applicationForm.create({
      data: {
        personalDetails: form.personalDetails,
        career: form.career,
        appearance: form.appearance,
        personality: form.personality,
        lifestyle: form.lifestyle,
        relationshipGoals: form.relationshipGoals,
        idealPartner: form.idealPartner,
        financial: form.financial,
        photos: form.photos,
        status: "RECEIVED",

        membership: form.membership
          ? {
              create: {
                plan: form.membership.plan as MembershipPlan,
                startsAt: form.membership.startsAt
                  ? new Date(form.membership.startsAt)
                  : undefined,
                expiresAt: form.membership.expiresAt
                  ? new Date(form.membership.expiresAt)
                  : undefined,
              },
            }
          : undefined,

        profile: {
          create: {
            status: "PENDING",
          },
        },
      },
    })

    console.log(
      `Created application #${application.customId} (${form.personalDetails.name})`
    )
  }

  const totalInterests = await prisma.registerInterest.count()
  const totalApps = await prisma.applicationForm.count()

  console.log("\n--- Seed Summary ---")
  console.log(`Total Register Interests: ${totalInterests}`)
  console.log(`Total Application Forms:  ${totalApps}`)
  console.log("Database seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
