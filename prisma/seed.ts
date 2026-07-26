import { prisma } from "../lib/prisma.js"
import { MembershipType } from "../lib/generated/prisma/client.js"
import applicationForms from "../data/application-form.json" with { type: "json" }

async function main() {
  for (const form of applicationForms) {
    await prisma.applicationForm.create({
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
        status: "OPEN",

        membership: form.membership
          ? {
              create: {
                type: form.membership.type as MembershipType,
                startsAt: new Date(form.membership.startsAt),
                expiresAt: new Date(form.membership.expiresAt),
              },
            }
          : undefined,
      },
    })
  }

  console.log(`Imported ${applicationForms.length} forms`)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
