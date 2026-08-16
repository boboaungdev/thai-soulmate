import { notFound } from "next/navigation"
import { formatDateTime, formatDOB } from "@/lib/date"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { APP_INFO } from "@/constants"

import { PrintTrigger } from "./print-trigger"

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center">
    <h2 className="text-gradient text-lg font-bold">{children}</h2>
  </div>
)

const DetailItem = ({ label, value }: { label: string; value: any }) => {
    if (!value) return null
    return (
        <div className="flex flex-col">
        <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
            {label}
        </p>
        <p className="text-sm font-semibold text-gray-800">
            {String(value)}
        </p>
        </div>
    )
}

export default async function PrintRegisterInterestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const interest = await prisma.registerInterest.findUnique({
    where: { id },
  })

  if (!interest) {
    notFound()
  }

  return (
    <div className="bg-white text-black" id="printable-area">
      <PrintTrigger id={id} />
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none; }
          .text-gradient {
            background: linear-gradient(to right, #f2b854, #f07797);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
        }
      `}</style>
      <main className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center justify-between border-b-2 border-gray-100 pb-5">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={56} height={56} />
            <div className="text-center">
              <h1 className="text-gradient text-xl font-bold">
                {APP_INFO.name}
              </h1>
              <p className="text-sm text-gray-400">{APP_INFO.tagline}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-500 uppercase">
              Interest Registration
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Submitted: {formatDateTime(interest.createdAt)}
            </p>
          </div>
        </header>

        <div className="rounded-lg bg-amber-50/30 p-6">
          <div className="space-y-8">
            <section className="break-inside-avoid">
                <SectionTitle>Personal Details</SectionTitle>
                <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                    <DetailItem label="Name" value={`${interest.prefix} ${interest.name}`} />
                    <DetailItem label="Date of Birth" value={formatDOB(interest.dob, { showAge: true })} />
                    <DetailItem label="Gender" value={interest.gender} />
                    <DetailItem label="Nationality" value={interest.nationality} />
                    <DetailItem label="Current Location" value={interest.currentLocation} />
                </div>
            </section>
            <section className="break-inside-avoid">
                <SectionTitle>Contact Information</SectionTitle>
                <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                    <DetailItem label="Email" value={interest.email} />
                    <DetailItem label="Phone" value={`${interest.phoneCountry} ${interest.phone}`} />
                </div>
            </section>
            <section className="break-inside-avoid">
                <SectionTitle>Source</SectionTitle>
                <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                    <DetailItem label="Source" value={interest.source} />
                    <DetailItem label="Other Source" value={interest.otherSource} />
                </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
