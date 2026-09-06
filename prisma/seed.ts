import "dotenv/config"
import { prisma } from "../lib/prisma.js"
import {
  MembershipPlan,
  RegisterInterestStatus,
  NoteType,
} from "../lib/generated/prisma/client.js"
import applicationForms from "../data/application-form.json" with { type: "json" }

function getPhoneCountry(
  phone?: string,
  nationality?: string,
  location?: string
): string {
  if (phone?.startsWith("+66") || location?.toLowerCase().includes("thailand")) {
    return "TH"
  }
  if (
    phone?.startsWith("+44") ||
    nationality?.toLowerCase().includes("british") ||
    location?.toLowerCase().includes("kingdom")
  ) {
    return "GB"
  }
  if (
    phone?.startsWith("+1") ||
    nationality?.toLowerCase().includes("american") ||
    location?.toLowerCase().includes("states")
  ) {
    return "US"
  }
  if (
    phone?.startsWith("+61") ||
    nationality?.toLowerCase().includes("australian") ||
    location?.toLowerCase().includes("australia")
  ) {
    return "AU"
  }
  if (
    phone?.startsWith("+49") ||
    nationality?.toLowerCase().includes("german") ||
    location?.toLowerCase().includes("germany")
  ) {
    return "DE"
  }
  if (
    phone?.startsWith("+65") ||
    nationality?.toLowerCase().includes("singapore") ||
    location?.toLowerCase().includes("singapore")
  ) {
    return "SG"
  }
  if (
    phone?.startsWith("+33") ||
    nationality?.toLowerCase().includes("french") ||
    location?.toLowerCase().includes("france")
  ) {
    return "FR"
  }
  if (
    phone?.startsWith("+81") ||
    nationality?.toLowerCase().includes("japan")
  ) {
    return "JP"
  }
  return "TH"
}

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

const SOURCES = [
  "Website Consultation",
  "Facebook",
  "Instagram",
  "Google Search",
  "Recommendation",
  "Word of Mouth",
]

async function main() {
  console.log("Starting database seed with updated Register Interest schema...")

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

  // Find admin user to attribute sample notes
  const adminUser = await prisma.user.findFirst({
    where: { role: { in: ["ADMIN", "DEV"] } },
  })

  // 1. Seed Register Interests mapped from Application Form members
  console.log("Seeding Register Interests from application forms...")
  for (let i = 0; i < applicationForms.length; i++) {
    const form = applicationForms[i]
    const personal = form.personalDetails
    const relGoals = form.relationshipGoals

    const lookingFor =
      Array.isArray(relGoals?.lookingFor) && relGoals.lookingFor.length > 0
        ? relGoals.lookingFor[0]
        : "Marriage / Life Partner"

    const daysAgo = (applicationForms.length - i) * 2
    const contactDate = new Date(Date.now() - daysAgo * 86400000)

    await prisma.registerInterest.create({
      data: {
        prefix: personal.prefix || "Mr.",
        name: personal.name,
        dob: personal.dob ? new Date(personal.dob) : null,
        gender: personal.gender,
        nationality: personal.nationality || "International",
        nationalityRegion: personal.nationalityRegion || "Europe",
        currentLocation: personal.currentLocation || "Thailand",
        currentLocationRegion: personal.currentLocationRegion || "Asia",
        relationshipGoal: lookingFor,
        email: personal.email.toLowerCase(),
        phoneCountry: getPhoneCountry(
          personal.phone,
          personal.nationality,
          personal.currentLocation
        ),
        phone: personal.phone,
        preferredContactDate: contactDate,
        preferredContactTime:
          PREFERRED_CONTACT_TIMES[i % PREFERRED_CONTACT_TIMES.length],
        source: SOURCES[i % SOURCES.length],
        status: RegisterInterestStatus.ACCEPTED,
      },
    })
  }

  // 2. Seed Standalone Register Interests (Prospective consultation leads)
  console.log("Seeding standalone consultation inquiries...")
  const standaloneInterests = [
    {
      prefix: "Mr.",
      name: "David Miller",
      dob: new Date("1985-06-14T00:00:00.000Z"),
      gender: "Male",
      nationality: "British",
      nationalityRegion: "Europe",
      currentLocation: "United Kingdom",
      currentLocationRegion: "Europe",
      relationshipGoal: "Marriage / Life Partner",
      email: "david.miller@example.co.uk",
      phoneCountry: "GB",
      phone: "+447911123456",
      preferredContactDate: new Date(Date.now() + 86400000 * 2),
      preferredContactTime: "14:00 - 15:00",
      source: "Website Consultation",
      status: RegisterInterestStatus.RECEIVED,
      notes: [
        "Inquired via website consultation form. Architect based in London, planning visit to Thailand in November.",
      ],
    },
    {
      prefix: "Mr.",
      name: "Michael Harrison",
      dob: new Date("1978-11-20T00:00:00.000Z"),
      gender: "Male",
      nationality: "Australian",
      nationalityRegion: "Oceania",
      currentLocation: "Australia",
      currentLocationRegion: "Oceania",
      relationshipGoal: "Long-Term Relationship",
      email: "m.harrison@example.com.au",
      phoneCountry: "AU",
      phone: "+61412345678",
      preferredContactDate: new Date(Date.now() + 86400000 * 3),
      preferredContactTime: "10:00 - 11:00",
      source: "Google Search",
      status: RegisterInterestStatus.PENDING,
      notes: [
        "Introductory WhatsApp call arranged with matchmaker. Looking for educated Thai lady 32-42.",
      ],
    },
    {
      prefix: "Mr.",
      name: "Thomas Becker",
      dob: new Date("1982-03-08T00:00:00.000Z"),
      gender: "Male",
      nationality: "German",
      nationalityRegion: "Europe",
      currentLocation: "Germany",
      currentLocationRegion: "Europe",
      relationshipGoal: "Marriage / Life Partner",
      email: "thomas.becker@example.de",
      phoneCountry: "DE",
      phone: "+4915123456789",
      preferredContactDate: new Date(Date.now() + 86400000 * 4),
      preferredContactTime: "18:00 - 19:00",
      source: "Recommendation",
      status: RegisterInterestStatus.PENDING,
      notes: [
        "Friend referral from an existing member. Software executive, speaks fluent English.",
      ],
    },
    {
      prefix: "Ms.",
      name: "Pitchapa Srisuk",
      dob: new Date("1994-09-12T00:00:00.000Z"),
      gender: "Female",
      nationality: "Thai",
      nationalityRegion: "Asia",
      currentLocation: "Thailand",
      currentLocationRegion: "Asia",
      relationshipGoal: "Marriage / Life Partner",
      email: "pitchapa.s@example.com",
      phoneCountry: "TH",
      phone: "+66812345678",
      preferredContactDate: new Date(Date.now() + 86400000),
      preferredContactTime: "13:00 - 14:00",
      source: "Facebook",
      status: RegisterInterestStatus.RECEIVED,
      notes: [
        "Registered on Facebook campaign. University lecturer in Thailand, seeking financially stable international gentleman.",
      ],
    },
    {
      prefix: "Ms.",
      name: "Kornkamon Wannarat",
      dob: new Date("1996-01-25T00:00:00.000Z"),
      gender: "Female",
      nationality: "Thai",
      nationalityRegion: "Asia",
      currentLocation: "Thailand",
      currentLocationRegion: "Asia",
      relationshipGoal: "Marriage / Life Partner",
      email: "kornkamon.w@example.com",
      phoneCountry: "TH",
      phone: "+66898765432",
      preferredContactDate: new Date(Date.now() - 86400000 * 2),
      preferredContactTime: "16:00 - 17:00",
      source: "Instagram",
      status: RegisterInterestStatus.ACCEPTED,
      notes: [
        "ID and single status verified during preliminary video screening. Sent link to complete full application form.",
      ],
    },
    {
      prefix: "Mr.",
      name: "Liam O'Connor",
      dob: new Date("1990-07-04T00:00:00.000Z"),
      gender: "Male",
      nationality: "American",
      nationalityRegion: "North America",
      currentLocation: "United States",
      currentLocationRegion: "North America",
      relationshipGoal: "Companionship",
      email: "liam.oconnor@example.com",
      phoneCountry: "US",
      phone: "+13105550198",
      preferredContactDate: new Date(Date.now() - 86400000 * 5),
      preferredContactTime: "19:00 - 20:00",
      source: "Website Consultation",
      status: RegisterInterestStatus.DECLINED,
      notes: [
        "Looking for short-term casual travel companion rather than committed marriage/partnership. Politely declined in alignment with agency standards.",
      ],
    },
  ]

  for (const item of standaloneInterests) {
    const created = await prisma.registerInterest.create({
      data: {
        prefix: item.prefix,
        name: item.name,
        dob: item.dob,
        gender: item.gender,
        nationality: item.nationality,
        nationalityRegion: item.nationalityRegion,
        currentLocation: item.currentLocation,
        currentLocationRegion: item.currentLocationRegion,
        relationshipGoal: item.relationshipGoal,
        email: item.email,
        phoneCountry: item.phoneCountry,
        phone: item.phone,
        preferredContactDate: item.preferredContactDate,
        preferredContactTime: item.preferredContactTime,
        source: item.source,
        status: item.status,
      },
    })

    if (adminUser && item.notes) {
      for (const noteMessage of item.notes) {
        await prisma.note.create({
          data: {
            message: noteMessage,
            type: NoteType.REGISTER_INTEREST,
            registerInterestId: created.id,
            userId: adminUser.id,
          },
        })
      }
    }
  }

  // 3. Seed ApplicationForm + Membership + Profile
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

    console.log(`Created application #${application.customId} (${form.personalDetails.name})`)
  }

  const totalInterests = await prisma.registerInterest.count()
  const totalApps = await prisma.applicationForm.count()
  const totalNotes = await prisma.note.count()

  console.log("\n--- Seed Summary ---")
  console.log(`Total Register Interests: ${totalInterests}`)
  console.log(`Total Application Forms:  ${totalApps}`)
  console.log(`Total Matchmaker Notes:   ${totalNotes}`)
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
