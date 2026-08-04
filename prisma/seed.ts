import { prisma } from "../lib/prisma.js"
import { MembershipPlan } from "../lib/generated/prisma/client.js"
import applicationForms from "../data/application-form.json" with { type: "json" }

async function main() {
  // 1. Seed Register Interest
  for (const form of applicationForms) {
    const personal = form.personalDetails

    await prisma.registerInterest.create({
      data: {
        prefix: personal.prefix,
        name: personal.name,

        dob: new Date(personal.dob),

        gender: personal.gender,
        nationality: personal.nationality,
        currentLocation: personal.currentLocation,

        email: personal.email,

        phoneCountry: personal.phone.substring(0, 3),
        phone: personal.phone,

        source: "Facebook",

        status: "RECEIVED",
      },
    })
  }

  // 2. Seed ApplicationForm + Profile
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
      },
    })

    await prisma.profile.create({
      data: {
        applicationFormId: application.id,
        customId: application.customId,

        status: "PENDING",

        nickname: form.personalDetails.nickname,

        occupation: form.career.occupation,
        education: form.career.education,

        height: form.appearance.height,
        weight: form.appearance.weight,
        religion: form.appearance.religion,

        thaiFluency: form.appearance.thaiFluency?.[0],
        englishFluency: form.appearance.englishFluency?.[0],

        personality: form.personality.personality ?? [],
        about: form.personality.about,
        lookingForQualities: form.personality.lookingForQualities ?? [],

        smoking: form.lifestyle.smoking,
        drinking: form.lifestyle.drinking,
        exercise: form.lifestyle.exercise,

        interests: form.lifestyle.interests ?? [],

        lookingFor: form.relationshipGoals.lookingFor ?? [],

        idealPartnerAgeRange: form.idealPartner.ageRange,

        headshot: form.photos.headshot,
        fullLength: form.photos.fullLength,
        casualLifestyle: form.photos.casualLifestyle,
      },
    })

    console.log(`Created profile ${application.customId}`)
  }

  console.log(`Imported ${applicationForms.length} forms`)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
