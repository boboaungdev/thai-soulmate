import { AppName } from "./app-name"
import { MotionDiv } from "./motion"

const faqs = [
  {
    id: "what-is",
    question: (
      <>
        What is <AppName />?
      </>
    ),
    answer: (
      <>
        <AppName /> is an exclusive 1-2-1 matchmaking service where we function
        as your personal assistant in your search for a life partner in
        Thailand. We provide a discreet, confidential, and highly personalized
        experience to help you find a genuine, long-lasting relationship.
      </>
    ),
  },
  {
    id: "how-different",
    question: (
      <>
        How is <AppName /> different from a dating app?
      </>
    ),
    answer: (
      <>
        Unlike dating apps that rely on endless swiping, <AppName /> provides
        you with a dedicated matchmaker. We focus on quality introductions over
        quantity, ensuring you meet genuinely compatible individuals who are
        also seeking a serious, long-term relationship.
      </>
    ),
  },
  {
    id: "how-matching-works",
    question: "How does the matching process work?",
    answer:
      "Our process is entirely centered around you. It starts with a private consultation to deeply understand your personality, values, and what you're looking for in a partner. Your personal matchmaker then carefully hand-selects and vets potential matches. We manage all introductions and facilitate communication, ensuring a smooth and respectful process for everyone involved.",
  },
  {
    id: "personal-assistant-service",
    question: "What does the 'personal assistant' service include?",
    answer:
      "Think of us as your trusted partner on this journey. Beyond just finding matches, your personal assistant matchmaker handles all the arrangements. This includes scheduling introductions (video calls or in-person meetings), offering guidance and feedback, and providing continuous support to help nurture the connection. We take care of the details so you can focus on building a relationship.",
  },
  {
    id: "how-profiles-verified",
    question: "Are profiles verified and screened?",
    answer: (
      <>
        Yes, absolutely. Every member undergoes a thorough vetting and
        verification process, including identity checks, background
        verification, and an in-depth consultation with our matchmaking team. We
        ensure all candidates are sincere, genuine, and serious about committing
        to a life partner.
      </>
    ),
  },
  {
    id: "language-barrier",
    question: "What if there is a language barrier?",
    answer: (
      <>
        Language will never be an obstacle. <AppName /> offers a personal
        matchmaker along with complementary interpreter and translation services
        during your virtual meetings. We ensure smooth, comfortable, and
        meaningful conversations between you and your match.
      </>
    ),
  },
  {
    id: "how-many-matches",
    question: "How many matches can I expect to receive?",
    answer:
      "We focus on quality and true compatibility over quantity. On average, you can expect 3 to 5 carefully vetted and hand-selected matches per month based on your shared values, lifestyle, and relationship goals.",
  },
  {
    id: "privacy-discretion",
    question: "How is my privacy and confidentiality protected?",
    answer:
      "Your discretion and privacy are our highest priorities. Your profile is strictly private and never publicly searchable on the internet. We only share your details with hand-selected candidates after your review and explicit approval.",
  },
  {
    id: "who-is-this-for",
    question: "Who is this service for?",
    answer: (
      <>
        Our service is designed for discerning individuals who are serious about
        finding a life partner and value their privacy and time. If you&apos;re
        tired of the impersonal nature of dating apps and are looking for a
        meaningful connection with a Thai partner through a professional and
        supportive service, then <AppName /> is for you.
      </>
    ),
  },
  {
    id: "international-clients",
    question: "Can I join if I live outside of Thailand?",
    answer:
      "Yes. Many of our members reside internationally across the UK, Europe, the Americas, and Australasia. You can register, complete consultations, review curated matches, and connect via video calls from anywhere in the world. When you plan your visit to Thailand, we assist in coordinating seamless in-person introductions.",
  },
  {
    id: "ongoing-support",
    question: "What ongoing support is provided after we are matched?",
    answer: (
      <>
        Your dedicated matchmaker remains by your side throughout your journey.
        We monitor progress, offer constructive feedback and cultural insights,
        and provide continuous support to help nurture the connection into a
        happy, lasting relationship.
      </>
    ),
  },
  {
    id: "service-fees",
    question: "What are your service fees?",
    answer:
      "We offer a bespoke service tailored to each client's unique needs. Our fees reflect the comprehensive, 1-2-1 attention and professional expertise you receive. For a detailed consultation and a personalized quote, please register your interest, and one of our matchmakers will be in touch.",
  },
]

export function Faq() {
  return (
    <div className="w-full">
      <div className="space-y-4 sm:space-y-5">
        {faqs.map((faq, index) => (
          <MotionDiv
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.35, delay: (index % 4) * 0.05 }}
          >
            <div className="flex flex-col rounded-2xl border border-border/70 bg-card/60 p-5 shadow-xs backdrop-blur-xs transition-all hover:border-[var(--gold)]/50 hover:shadow-md sm:p-6">
              {/* Question */}
              <div className="flex items-start gap-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--gold)]/15 text-xs font-black text-[var(--gold)] uppercase">
                  Q
                </span>
                <h3 className="pt-0.5 text-base font-bold tracking-tight text-foreground sm:text-lg">
                  {faq.question}
                </h3>
              </div>

              {/* Answer */}
              <div className="mt-3.5 flex items-start gap-3.5 border-t border-border/50 pt-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary uppercase">
                  A
                </span>
                <div className="flex-1 pt-0.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {faq.answer}
                </div>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>
    </div>
  )
}
