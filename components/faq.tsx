import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Siam Soulmates?",
    answer:
      "Siam Soulmates is a premium matchmaking service dedicated to helping you find a meaningful and long-lasting relationship. We focus on personalized matching based on your values, interests, and life goals.",
  },
  {
    question: "How does the matching process work?",
    answer:
      "Our process begins with a detailed consultation to understand your personality and preferences. We then use a combination of our experienced matchmakers' intuition and our proprietary compatibility algorithm to find potential partners for you.",
  },
  {
    question: "Is my privacy protected?",
    answer:
      "Absolutely. We prioritize your privacy and confidentiality. Your personal information is securely stored and is only shared with potential matches with your explicit consent.",
  },
  {
    question: "What makes Siam Soulmates different?",
    answer:
      "Unlike typical dating apps, we provide a highly personalized and discreet service. We focus on quality over quantity, ensuring that you meet genuinely compatible individuals who are also seeking serious relationships.",
  },
  {
    question: "What are your service fees?",
    answer:
      "Our service fees vary based on the personalized matchmaking plan you choose. We offer different tiers designed to meet diverse needs and preferences. Please contact us for a detailed consultation and a customized quote.",
  },
  {
    question: "What is your success rate?",
    answer:
      "While we cannot guarantee specific outcomes, Siam Soulmates prides itself on a high success rate due to our personalized approach and dedicated matchmakers. Many of our clients have found long-lasting relationships and marriages through our service.",
  },
]

export function Faq() {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
            {faq.answer}
          </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
