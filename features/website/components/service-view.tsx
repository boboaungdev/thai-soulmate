import { HowItWorksContent } from "./how-it-works-content"

export function ServiceView() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Subtle Radial Glows matching Pricing & Contact */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(207,161,79,0.08),transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[650px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/15 via-[#E791A7]/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 -z-10 size-[550px] rounded-full bg-gradient-to-br from-[#CA617D]/10 via-[#D3A753]/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-2/3 -left-40 -z-10 size-[500px] rounded-full bg-gradient-to-tr from-[#D3A753]/10 via-[#E791A7]/5 to-transparent blur-3xl" />

      <HowItWorksContent />
    </main>
  )
}
