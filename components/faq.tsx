import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AppName } from "./app-name"
import { MotionDiv } from "./motion"

const faqs = [
  {
    id: "what-is",
    question: (
      <>
        What is&nbsp;
        <AppName />?
      </>
    ),
    answer: (
      <>
        <AppName /> is an exclusive 1-2-1 matchmaking service where we
        function as your personal assistant in your search for a life partner in
        Thailand. We provide a discreet, confidential, and highly personalized
        experience to help you find a genuine, long-lasting relationship.
      </>
    ),
  },
  {
    id: "how-different",
    question: (
      <>
        How is&nbsp;
        <AppName />
        &nbsp;different from a dating app?
      </>
    ),
    answer: (
      <>
        Unlike dating apps that rely on endless swiping, <AppName /> provides
        you with a dedicated matchmaker. We focus on quality introductions over
        quantity, ensuring you meet genuinely compatible individuals who are
        also also seeking a serious, long-term relationship.
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
    id: "service-fees",
    question: "What are your service fees?",
    answer:
      "We offer a bespoke service tailored to each client's unique needs. Our fees reflect the comprehensive, 1-2-1 attention and professional expertise you receive. For a detailed consultation and a personalized quote, please register your interest, and one of our matchmakers will be in touch.",
  },
]

export function Faq() {
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={faqs[0].id}
      >
        {faqs.map((faq, index) => (
          <MotionDiv
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <AccordionItem value={faq.id}>
              <AccordionTrigger className="text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </MotionDiv>
        ))}
      </Accordion>
    </div>
  )
}
