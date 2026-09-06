"use client"

import React, { Suspense, useEffect, useState, useTransition } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowLeft,
  Calendar,
  Heart,
  User,
} from "lucide-react"

import {
  ApplicationFormData,
  INITIAL_APPLICATION_FORM_DATA,
  ApplicationStage,
  RegisterInterestLead,
} from "@/components/application-form/types"
import { IntakeGatekeeper } from "@/components/application-form/intake-gatekeeper"
import { ChapterAccordion } from "@/components/application-form/chapter-accordion"
import { ReviewDossier } from "@/components/application-form/review-dossier"
import { ThankYouScreen } from "@/components/application-form/thank-you-screen"
import { APP_INFO } from "@/constants"

function ApplicationFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [stage, setStage] = useState<ApplicationStage>("gatekeeper")
  const [formData, setFormData] = useState<ApplicationFormData>(
    INITIAL_APPLICATION_FORM_DATA
  )
  const [lead, setLead] = useState<RegisterInterestLead | null>(null)
  const [loadingLead, setLoadingLead] = useState(false)
  const [searchedEmail, setSearchedEmail] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedCustomId, setSubmittedCustomId] = useState<
    number | undefined
  >()
  const [activeChapter, setActiveChapter] = useState<number>(1)

  // 1. Check email in searchParams or on manual search
  const checkEmailInDatabase = async (emailToCheck: string) => {
    if (!emailToCheck) {
      setLead(null)
      setSearchedEmail(null)
      setNotFound(false)
      return
    }

    setLoadingLead(true)
    setSearchedEmail(emailToCheck)
    setNotFound(false)

    try {
      const res = await fetch(
        `/api/register-interest/check?email=${encodeURIComponent(emailToCheck)}`
      )
      const data = await res.json()

      if (res.ok && data.exists && data.interest) {
        const interest = data.interest
        const parsedLead: RegisterInterestLead = {
          id: interest.id,
          prefix: interest.prefix || "Mr.",
          name: interest.name || "",
          gender: interest.gender || "Male",
          email: interest.email || emailToCheck,
          phoneCountry: interest.phoneCountry || "+66",
          phone: interest.phone || "",
          currentLocation: interest.currentLocation || "Thailand",
          relationshipGoal: interest.relationshipGoal || null,
          preferredContactDate: interest.preferredContactDate || null,
          preferredContactTime: interest.preferredContactTime || null,
        }

        setLead(parsedLead)

        // Pre-fill form data with known consultation details
        const nameParts = (parsedLead.name || "").trim().split(/\s+/)
        const fName = nameParts[0] || ""
        const lName = nameParts.slice(1).join(" ")

        setFormData((prev) => ({
          ...prev,
          prefix: parsedLead.prefix,
          name: parsedLead.name,
          firstName: fName,
          lastName: lName,
          gender: parsedLead.gender,
          email: parsedLead.email,
          phoneCountry: parsedLead.phoneCountry,
          phone: parsedLead.phone,
          currentLocation: parsedLead.currentLocation,
          nationality: parsedLead.currentLocation || prev.nationality,
          relationshipGoal:
            parsedLead.relationshipGoal || prev.relationshipGoal,
        }))
      } else {
        setLead(null)
        setNotFound(true)
      }
    } catch (err) {
      console.error("Error checking register interest:", err)
      toast.error("Unable to check consultation reservation. Please try again.")
      setNotFound(true)
    } finally {
      setLoadingLead(false)
    }
  }

  // Initial check on mount from URL query param (?email=...)
  useEffect(() => {
    const urlEmail = searchParams.get("email")
    if (urlEmail) {
      checkEmailInDatabase(urlEmail.trim().toLowerCase())
    }
  }, [searchParams])

  // Draft persistence in localStorage
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("tsm_app_form_draft")
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft)
        const nameParts = (lead?.name || parsed.name || "").trim().split(/\s+/)
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          firstName: parsed.firstName || nameParts[0] || prev.firstName,
          lastName:
            parsed.lastName !== undefined
              ? parsed.lastName
              : nameParts.slice(1).join(" ") || prev.lastName,
          // Preserve verified email and name from lead if available
          email: lead?.email || parsed.email || prev.email,
          name: lead?.name || parsed.name || prev.name,
        }))
      }
    } catch {
      // ignore JSON parse errors
    }
  }, [lead])

  const handleFormChange = (updates: Partial<ApplicationFormData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...updates }
      try {
        localStorage.setItem("tsm_app_form_draft", JSON.stringify(updated))
      } catch {
        // quota exceeded fallback
      }
      return updated
    })
  }

  // 2. Final Submit to /api/application-form
  const handleSubmitFinal = async () => {
    setIsSubmitting(true)

    try {
      // Map formData to API expected structure
      const fullName =
        [formData.firstName.trim(), (formData.lastName || "").trim()]
          .filter(Boolean)
          .join(" ") || formData.name

      const payload = {
        details: {
          prefix: formData.prefix,
          name: fullName,
          gender: formData.gender,
          dob: formData.dob || new Date("1990-01-01").toISOString(),
          email: formData.email,
          phone: `(${formData.phoneCountry}) ${formData.phone}`,
          nationality: formData.nationality || formData.currentLocation,
          currentLocation: formData.currentLocation,
          nationalityRegion: formData.nationalityRegion || "Asia",
          currentLocationRegion: formData.currentLocationRegion || "Asia",
        },
        profile: {
          nickname: formData.nickname || "",
          occupation: formData.occupation,
          company: formData.company || "",
          education: formData.education,
          height: `${formData.idealPartnerMinHeight || 165}`,
          weight: "60",
          religion: formData.religion,
          thaiFluency: [formData.thaiFluency],
          englishFluency: [formData.englishFluency],
          personality: formData.personality,
          about: formData.about || "",
          bestQualities: formData.bestQualities,
          lookingForQualities: formData.lookingForQualities,
          maritalStatus: formData.maritalStatus,
          hasChildren: formData.hasChildren,
          childrenCount: formData.childrenCount,
          lifestyle: formData.lifestyle,
          smoking: formData.smoking,
          drinking: formData.drinking,
          exercise: formData.exercise,
          interests: formData.interests,
          otherInterest: "",
          travelDestinations: [],
          weekendActivity: "",
          familyImportance: formData.familyImportance,
          futureChildren: formData.futureChildren,
          values: formData.values,
          idealPartnerAgeRange: `${formData.idealPartnerMinAge}-${formData.idealPartnerMaxAge}`,
          idealPartnerNationality: formData.idealPartnerNationality,
          idealPartnerLocation: formData.idealPartnerLocation,
          idealPartnerHeight: `${formData.idealPartnerMinHeight}-${formData.idealPartnerMaxHeight}`,
          idealPartnerWeight: "Any",
          idealPartnerEducation: "Bachelor's Degree or above",
          idealPartnerPersonality: formData.personality,
          idealPartnerQualities: formData.lookingForQualities,
          dealBreakers: formData.dealBreakers,
        },
        relationshipGoals: {
          relocate: formData.relocate,
          lookingFor: [formData.relationshipGoal],
          settleDown: formData.settleDown,
        },
        financial: {
          ownBusiness: formData.ownBusiness,
          ownProperty: formData.ownProperty,
        },
        photos: {
          headshot: formData.headshotUrl || "",
          fullLength: formData.fullLengthUrl || "",
          casualLifestyle: formData.casualLifestyleUrl || "",
        },
      }

      const response = await fetch("/api/application-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Application Submitted Successfully!")
        // Clear local draft
        try {
          localStorage.removeItem("tsm_app_form_draft")
        } catch {
          // ignore
        }
        setSubmittedCustomId(result.application?.customId)
        setStage("thank-you")
      } else {
        toast.error(result.message || "Submission failed. Please try again.")
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-background py-10 sm:py-16">
      {/* ATMOSPHERIC LUXURY GLOWS */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_15%,rgba(207,161,79,0.08),transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/15 via-[#E791A7]/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 -z-10 size-[500px] rounded-full bg-gradient-to-tl from-[#CA617D]/10 to-transparent blur-3xl" />

      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* TOP STATUS HEADER (Shown during form & review stages) */}
        {(stage === "form" || stage === "review") && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col gap-3 rounded-2xl border border-[#D3A753]/30 bg-card/60 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/20 to-[#CA617D]/20 text-[#D3A753]">
                <ShieldCheck className="size-5 text-[#CA617D]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wider text-[#D3A753] uppercase">
                    Confidential Member Intake
                  </span>
                  <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
                    Auto-Saving
                  </span>
                </div>
                <h1 className="text-lg font-bold text-foreground sm:text-xl">
                  {stage === "review"
                    ? "Review Your Application"
                    : "Member Profile Application"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {stage === "form" && (
                <button
                  type="button"
                  onClick={() => setStage("review")}
                  className="rounded-lg border border-[#D3A753]/40 bg-[#D3A753]/10 px-3 py-1.5 text-xs font-semibold text-[#D3A753] transition-colors hover:bg-[#D3A753]/20"
                >
                  Preview Review Sheet →
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* STAGE 1: INTAKE GATEKEEPER */}
        {stage === "gatekeeper" && (
          <IntakeGatekeeper
            lead={lead}
            loading={loadingLead}
            searchedEmail={searchedEmail}
            notFound={notFound}
            onStartForm={() => setStage("form")}
            onSearchEmail={(email) => {
              if (email) {
                router.replace(
                  `/application-form?email=${encodeURIComponent(email)}`
                )
                checkEmailInDatabase(email)
              } else {
                router.replace(`/application-form`)
                setLead(null)
                setSearchedEmail(null)
                setNotFound(false)
              }
            }}
          />
        )}

        {/* STAGE 2: THE 5-CHAPTER ACCORDION */}
        {stage === "form" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            <ChapterAccordion
              data={formData}
              onChange={handleFormChange}
              onReview={() => setStage("review")}
              initialChapter={activeChapter}
            />
          </motion.div>
        )}

        {/* STAGE 3: PRE-SUBMISSION REVIEW DOSSIER */}
        {stage === "review" && (
          <ReviewDossier
            data={formData}
            isSubmitting={isSubmitting}
            onEditChapter={(ch) => {
              setActiveChapter(ch)
              setStage("form")
            }}
            onBackToAccordion={() => setStage("form")}
            onSubmitFinal={handleSubmitFinal}
          />
        )}

        {/* STAGE 4: THANK YOU CELEBRATION */}
        {stage === "thank-you" && (
          <ThankYouScreen
            customId={submittedCustomId}
            applicantName={formData.name}
            contactTime={lead?.preferredContactTime}
          />
        )}
      </div>
    </main>
  )
}

export default function ApplicationFormPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-[#D3A753] border-t-transparent" />
        </div>
      }
    >
      <ApplicationFormContent />
    </Suspense>
  )
}
