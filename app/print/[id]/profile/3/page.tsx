// import Image from "next/image"
// import { APP_INFO } from "@/constants"

// import { prisma } from "@/lib/prisma"
// import { notFound } from "next/navigation"
// import { ApplicationForm } from "@/types/application-form"
// import {
//   Cake,
//   Ruler,
//   Weight,
//   Flag,
//   MapPin,
//   HeartHandshake,
//   BookUser,
//   Building2,
//   Sparkles,
//   Clapperboard,
//   GlassWater,
//   Cigarette,
//   Bike,
//   Languages,
// } from "lucide-react"

// function calculateAge(dob: string | Date): number {
//   const birthDate = new Date(dob)
//   const today = new Date()

//   let age = today.getFullYear() - birthDate.getFullYear()

//   const monthDifference = today.getMonth() - birthDate.getMonth()

//   if (
//     monthDifference < 0 ||
//     (monthDifference === 0 && today.getDate() < birthDate.getDate())
//   ) {
//     age--
//   }

//   return age
// }

// const formatFluency = (fluency: number[] | undefined) => {
//   if (!fluency || fluency.length === 0) return "N/A"
//   const level = fluency[0]
//   if (level >= 95) return "Native"
//   return `${level}%`
// }

// const joinValues = (values: string[] | undefined) => {
//   if (!values || values.length === 0) return "N/A"
//   return values.join(", ")
// }

// const FluencyBar = ({
//   label,
//   level,
// }: {
//   label: string
//   level: number | undefined
// }) => {
//   const displayLevel = level || 0
//   return (
//     <div className="text-sm">
//       <div className="flex justify-between font-medium text-gray-700">
//         <span>{label}</span>
//         <span className="text-gold font-semibold">
//           {formatFluency([displayLevel])}
//         </span>
//       </div>
//       <div className="mt-2 h-2 w-full rounded-full bg-amber-100">
//         <div
//           className="h-2 rounded-full"
//           style={{
//             width: `${displayLevel}%`,
//             background: "linear-gradient(to right, #f59e0b, #fbbf24)",
//           }}
//         />
//       </div>
//     </div>
//   )
// }

// const DetailItem = ({
//   label,
//   value,
//   icon,
// }: {
//   label: string
//   value: React.ReactNode
//   icon?: React.ReactNode
// }) => (
//   <div className="flex items-center gap-3">
//     {icon && <div className="text-gold w-4">{icon}</div>}
//     <div className="flex-1">
//       <p className="text-sm font-semibold text-gray-800">{value || "N/A"}</p>
//       <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
//         {label}
//       </p>
//     </div>
//   </div>
// )

// const SectionTitle = ({
//   children,
//   icon,
// }: {
//   children: React.ReactNode
//   icon?: React.ReactNode
// }) => (
//   <div className="flex items-center gap-3">
//     {icon && <div className="text-gold w-5">{icon}</div>}
//     <h2 className="text-gold text-lg font-bold">{children}</h2>
//   </div>
// )

// export default async function ProfilePrintPage({
//   params,
// }: {
//   params: Promise<{ id: string }>
// }) {
//   const { id } = await params

//   // Fetch the Profile using the ID from params
//   const profile = await prisma.profile.findUnique({
//     where: {
//       id,
//     },
//     include: {
//       applicationForm: true, // Include the related ApplicationForm data
//     },
//   })

//   if (!profile || !profile.applicationForm) {
//     notFound()
//   }

//   const user = profile.applicationForm as unknown as ApplicationForm

//   const age = user.personalDetails?.dob
//     ? calculateAge(user.personalDetails.dob)
//     : null
//   const displayName = `${user.personalDetails?.prefix || ""} ${
//     user.personalDetails?.name || ""
//   }`.trim()
//   const nickname = user.personalDetails?.nickname

//   return (
//     <>
//       {/* PRINT ONLY THIS */}
//       <div>
//         <main
//           id="printable-area"
//           className="mx-auto max-w-4xl bg-white text-black"
//         >
//           <section
//             className="flex min-h-[265mm] flex-col"
//             style={{ breakAfter: "page", pageBreakAfter: "always" }}
//           >
//             {/* App Header */}
//             <header className="mb-6 flex items-center justify-between border-b-2 border-gray-100 pb-5">
//               <div className="flex items-center gap-4">
//                 <Image src="/logo.png" alt="Logo" width={56} height={56} />
//                 <div className="text-center">
//                   <h1 className="text-gradient text-xl font-bold">
//                     {APP_INFO.name}
//                   </h1>
//                   <p className="text-sm text-gray-400">{APP_INFO.tagline}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-semibold text-gray-500 uppercase">
//                   Confidential Profile
//                 </p>
//                 <p className="mt-1 text-xs text-gray-400">
//                   ID: {String(user.customId).padStart(4, "0")}
//                 </p>
//               </div>
//             </header>

//             <div className="flex-1 rounded-lg bg-amber-50/30 p-8">
//               <div className="grid grid-cols-[300px_1fr] gap-8">
//                 {/* Left Column */}
//                 <aside className="flex flex-col items-center">
//                   {user.photos?.headshot && (
//                     <div className="relative h-60 w-60 overflow-hidden rounded-full border-4 border-white shadow-lg">
//                       <Image
//                         src={user.photos.headshot}
//                         alt="Headshot"
//                         fill
//                         priority
//                         loading="eager"
//                         unoptimized
//                         sizes="240px"
//                         className="object-cover object-top"
//                       />
//                     </div>
//                   )}
//                   <div className="mt-5 text-center">
//                     <h1 className="text-2xl font-bold text-gray-800">
//                       {displayName}
//                     </h1>
//                     {nickname && (
//                       <p className="text-gold text-lg">{nickname}</p>
//                     )}
//                   </div>
//                   <div className="mt-6 w-full space-y-4 border-t-2 border-amber-100 pt-6">
//                     <DetailItem label="Age" value={age} icon={<Cake />} />
//                     <DetailItem
//                       label="Height"
//                       value={
//                         user.appearance?.height
//                           ? `${user.appearance.height} cm`
//                           : "N/A"
//                       }
//                       icon={<Ruler />}
//                     />
//                     <DetailItem
//                       label="Weight"
//                       value={
//                         user.appearance?.weight
//                           ? `${user.appearance.weight} kg`
//                           : "N/A"
//                       }
//                       icon={<Weight />}
//                     />
//                     <DetailItem
//                       label="Nationality"
//                       value={user.personalDetails?.nationality}
//                       icon={<Flag />}
//                     />
//                     <DetailItem
//                       label="Location"
//                       value={user.personalDetails?.currentLocation}
//                       icon={<MapPin />}
//                     />
//                     <DetailItem
//                       label="Religion"
//                       value={user.appearance?.religion}
//                       icon={<HeartHandshake />}
//                     />
//                     <div className="pt-2">
//                       <SectionTitle icon={<Languages />}>
//                         Languages
//                       </SectionTitle>
//                       <div className="mt-3 space-y-4">
//                         <FluencyBar
//                           label="Thai"
//                           level={user.appearance?.thaiFluency?.[0]}
//                         />
//                         <FluencyBar
//                           label="English"
//                           level={user.appearance?.englishFluency?.[0]}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </aside>

//                 {/* Right Column */}
//                 <main className="space-y-6">
//                   <section>
//                     <SectionTitle icon={<BookUser />}>About Me</SectionTitle>
//                     <p className="mt-3 text-sm leading-relaxed text-gray-600">
//                       {user.personality?.about || "N/A"}
//                     </p>
//                   </section>

//                   <section>
//                     <SectionTitle icon={<Building2 />}>Vocation</SectionTitle>
//                     <div className="mt-3 space-y-3">
//                       <DetailItem
//                         label="Occupation"
//                         value={user.career?.occupation}
//                       />
//                       <DetailItem
//                         label="Education"
//                         value={user.career?.education}
//                       />
//                     </div>
//                   </section>

//                   <section>
//                     <SectionTitle icon={<Bike />}>Lifestyle</SectionTitle>
//                     <div className="mt-3 space-y-3">
//                       <DetailItem
//                         label="Exercise"
//                         value={user.lifestyle?.exercise}
//                       />
//                       <DetailItem
//                         label="Smoking"
//                         value={user.lifestyle?.smoking}
//                         icon={<Cigarette />}
//                       />
//                       <DetailItem
//                         label="Drinking"
//                         value={user.lifestyle?.drinking}
//                         icon={<GlassWater />}
//                       />
//                     </div>
//                   </section>
//                   <section>
//                     <SectionTitle icon={<Sparkles />}>Looking For</SectionTitle>
//                     <div className="mt-3 space-y-3">
//                       <DetailItem
//                         label="Relationship Goals"
//                         value={joinValues(user.relationshipGoals?.lookingFor)}
//                       />
//                       <DetailItem
//                         label="Ideal Age Range"
//                         value={user.idealPartner?.ageRange}
//                       />
//                     </div>
//                   </section>

//                   <section>
//                     <SectionTitle icon={<Clapperboard />}>
//                       Interests
//                     </SectionTitle>
//                     <div className="mt-3 text-sm text-gray-700">
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {[
//                           ...(user.personality?.personality || []),
//                           ...(user.lifestyle?.interests || []),
//                         ]
//                           .filter(Boolean)
//                           .map((item) => (
//                             <span
//                               key={item}
//                               className="border-gold bg-gold rounded-full border px-3 py-1 text-xs font-medium text-white"
//                             >
//                               {item}
//                             </span>
//                           ))}
//                       </div>
//                     </div>
//                   </section>
//                   <section>
//                     <SectionTitle icon={<Sparkles />}>
//                       Qualities I&apos;m Looking For
//                     </SectionTitle>
//                     <div className="mt-3 text-sm text-gray-700">
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {(user.personality?.lookingForQualities || []).map(
//                           (item) => (
//                             <span
//                               key={item}
//                               className="border-gold bg-gold rounded-full border px-3 py-1 text-xs font-medium text-white"
//                             >
//                               {item}
//                             </span>
//                           )
//                         )}
//                       </div>
//                     </div>
//                   </section>
//                 </main>
//               </div>
//             </div>
//           </section>

//           <section
//             className="flex min-h-[265mm] flex-col"
//             style={{ breakAfter: "page", pageBreakAfter: "always" }}
//           >
//             <header className="mb-5">
//               <div className="flex items-end justify-between pb-5">
//                 <div>
//                   <p className="text-xs font-semibold text-gray-400 uppercase">
//                     Full Length Portrait
//                   </p>
//                 </div>
//                 <p className="text-xs font-medium text-gray-400">
//                   ID: {String(user.customId).padStart(4, "0")}
//                 </p>
//               </div>
//               <div className="h-px w-full bg-gray-200" />
//             </header>

//             <div className="flex flex-1 items-center justify-center">
//               {user.photos?.fullLength ? (
//                 <figure className="flex flex-col items-center">
//                   <div
//                     className="relative overflow-hidden rounded-md bg-gray-100"
//                     style={{
//                       width: "150mm",
//                       height: "200mm",
//                     }}
//                   >
//                     <Image
//                       src={user.photos.fullLength}
//                       alt="Full length portrait"
//                       fill
//                       priority
//                       loading="eager"
//                       unoptimized
//                       sizes="567px"
//                       className="object-cover object-top"
//                     />
//                   </div>
//                   <figcaption className="mt-3 text-center text-xs font-semibold text-gray-400 uppercase">
//                     Full Length
//                   </figcaption>
//                 </figure>
//               ) : (
//                 <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-gray-200 text-sm text-gray-400">
//                   No full length photo available
//                 </div>
//               )}
//             </div>
//           </section>

//           <section className="flex min-h-[265mm] flex-col">
//             <header className="mb-5">
//               <div className="flex items-end justify-between pb-5">
//                 <div>
//                   <p className="text-xs font-semibold text-gray-400 uppercase">
//                     Lifestyle Portrait
//                   </p>
//                 </div>
//                 <p className="text-xs font-medium text-gray-400">
//                   ID: {String(user.customId).padStart(4, "0")}
//                 </p>
//               </div>
//               <div className="h-px w-full bg-gray-200" />
//             </header>

//             <div className="flex flex-1 items-center justify-center">
//               {user.photos?.casualLifestyle ? (
//                 <figure className="flex w-full flex-col items-center">
//                   <div
//                     className="relative w-full overflow-hidden rounded-md bg-gray-100"
//                     style={{ height: "180mm" }}
//                   >
//                     <Image
//                       src={user.photos.casualLifestyle}
//                       alt="Lifestyle portrait"
//                       fill
//                       priority
//                       loading="eager"
//                       unoptimized
//                       sizes="760px"
//                       className="object-cover object-center"
//                     />
//                   </div>
//                   <figcaption className="mt-3 text-center text-xs font-semibold text-gray-400 uppercase">
//                     Lifestyle
//                   </figcaption>
//                 </figure>
//               ) : (
//                 <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-gray-200 text-sm text-gray-400">
//                   No lifestyle photo available
//                 </div>
//               )}
//             </div>
//           </section>
//         </main>
//       </div>
//     </>
//   )
// }
