"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { AppName } from "@/components/app-name"
import { MotionDiv } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Handshake,
  MapPin,
  Search,
  X,
  Compass,
  Heart,
  HelpCircle,
  Video,
} from "lucide-react"

type FaqCategory =
  "all" | "verification" | "process" | "meetings" | "privacy" | "ladies"

interface FaqItem {
  id: string
  category: FaqCategory
  categoryLabel: string
  question: React.ReactNode
  questionText: string
  answer: React.ReactNode
  answerText: string
}

const FAQ_ITEMS: FaqItem[] = [
  // 1. VERIFICATION & AUTHENTICITY
  {
    id: "verification-genuine",
    category: "verification",
    categoryLabel: "Verification & Safety",
    questionText: "Are the women genuine, and how do you verify them?",
    question: "Are the women genuine, and how do you verify them?",
    answerText:
      "Every female member undergoes our mandatory 6-point verification standard before being accepted into our private network: (1) Thai Government National ID and age verification, (2) Residential and marital single-status confirmation, (3) Career and educational background review, (4) In-depth in-person or live video interview with our matchmaking team in Thailand, (5) Sincere relationship intentions and lifestyle assessment, and (6) Signed privacy and mutual respect guidelines. We strictly do not accept freelance escorts, bar workers, or casual daters. Every lady in our network is seeking a genuine, lasting marriage or life partnership.",
    answer: (
      <>
        Every female member undergoes our mandatory{" "}
        <strong className="text-foreground">
          6-point verification standard
        </strong>{" "}
        before being accepted into our private network:
        <ul className="mt-2.5 mb-2.5 list-disc space-y-1.5 pl-5 text-xs sm:text-sm">
          <li>
            <strong className="text-foreground">
              Official Government ID & Age
            </strong>
            : Verified against official Thai national records.
          </li>
          <li>
            <strong className="text-foreground">
              Single Status & Residence
            </strong>
            : Confirmation of legal single status and current living situation.
          </li>
          <li>
            <strong className="text-foreground">Career & Background</strong>:
            Review of professional employment or business background.
          </li>
          <li>
            <strong className="text-foreground">In-Depth Interview</strong>:
            Live in-person or video consultation with our team in Thailand.
          </li>
          <li>
            <strong className="text-foreground">Relationship Intentions</strong>
            : Sincere commitment to a long-term international partnership.
          </li>
          <li>
            <strong className="text-foreground">Code of Conduct</strong>: Signed
            mutual respect and confidentiality agreement.
          </li>
        </ul>
        We strictly do not accept freelance escorts, bar workers, or casual
        daters. Every lady in our network is seeking a sincere, loving, and
        lasting life partnership.
      </>
    ),
  },
  {
    id: "verification-fake-profiles",
    category: "verification",
    categoryLabel: "Verification & Safety",
    questionText:
      "How do I know the profiles aren't fake or run by agency staff?",
    question: "How do I know the profiles aren't fake or run by agency staff?",
    answerText:
      "Unlike chat apps or pay-per-message dating websites that use bots, artificial intelligence, or hired operators to keep you buying credits, Thai Soulmate has zero chat tokens and zero fake messaging. When you are introduced to a member, you meet her directly on a scheduled, face-to-face video call (hosted on Google Meet) facilitated by your dedicated matchmaker. You interact directly with the real person from day one.",
    answer: (
      <>
        Unlike chat apps or pay-per-message dating websites that employ bots or
        hired operators to keep you purchasing chat credits,{" "}
        <AppName className="font-semibold" /> operates as an authentic, licensed
        personal matchmaking agency. We do not sell chat tokens. When an
        introduction is confirmed, you meet the lady directly on a live,
        face-to-face video call (hosted on Google Meet) facilitated by your
        matchmaker. You interact directly with the real woman from day one.
      </>
    ),
  },
  {
    id: "verification-who-joins",
    category: "verification",
    categoryLabel: "Verification & Safety",
    questionText: "What caliber of Thai women join your service?",
    question: "What caliber of Thai women join your service?",
    answerText:
      "Our private female network consists of educated, career-minded, and family-oriented Thai women living across Thailand. They range from corporate executives, finance professionals, and healthcare specialists to university educators and boutique entrepreneurs. Every member has been individually vetted through in-person or video interviews to verify her single status, career, background, and sincere desire for a loving international marriage.",
    answer: (
      <>
        Our private female network consists of educated, career-minded, and
        family-oriented Thai women living across Thailand. They range from
        corporate professionals, finance specialists, and healthcare workers to
        university educators and boutique business owners.
        <br />
        <br />
        Every woman is individually interviewed to verify her background, legal
        single status, and authentic desire for a lifelong international
        partnership. They choose Thai Soulmate because they value their privacy
        and prefer meeting vetted gentlemen over using public dating apps.
      </>
    ),
  },
  {
    id: "verification-guarantee",
    category: "verification",
    categoryLabel: "Verification & Safety",
    questionText: "Can you guarantee that I will find a life partner?",
    question: "Can you guarantee that I will find a life partner?",
    answerText:
      "While no ethical matchmaking service can guarantee genuine love or marriage—as authentic human chemistry cannot be forced—we guarantee that every introduction you receive is with a 100% verified, legally single Thai woman who has personally reviewed your profile and expressed mutual excitement to meet you. If an introduction does not result in chemistry, we continue scouting based on your real-time feedback.",
    answer: (
      <>
        No ethical matchmaking agency can guarantee marriage, as genuine
        chemistry and shared values cannot be forced. However, we guarantee that
        every lady you meet has passed our rigorous 6-point verification, is
        legally single, and has personally chosen to meet you. If a match does
        not click, your matchmaker incorporates your feedback and coordinates an
        alternative introduction.
      </>
    ),
  },
  {
    id: "verification-photos",
    category: "verification",
    categoryLabel: "Verification & Safety",
    questionText: "Are member photos recent and unedited?",
    question: "Are member photos recent and unedited?",
    answerText:
      "Yes. As part of our vetting interview, our team verifies that profile photos accurately reflect each member's current appearance. We require recent, unfiltered photographs during intake and visually confirm them during our live video or in-person interview in Thailand. There are no misleading surprises.",
    answer: (
      <>
        Yes. As part of our mandatory intake interview, our team confirms that
        profile photos accurately reflect each member&apos;s real-life, current
        appearance. We request recent, natural photographs and visually confirm
        them during our live video or in-person interview in Thailand. There are
        no misleading filters or out-of-date pictures.
      </>
    ),
  },

  // 2. THE MATCHMAKING PROCESS
  {
    id: "process-vs-apps",
    category: "process",
    categoryLabel: "Matchmaking Process",
    questionText:
      "How is Thai Soulmate different from Tinder or other dating apps?",
    question: (
      <>
        How is <AppName /> different from Tinder or other dating apps?
      </>
    ),
    answerText:
      "Swipe apps treat romance like an endless game of numbers, leading to ghosting, scammers, catfishing, and months of wasted time. Thai Soulmate is a bespoke 1-to-1 personal matchmaking service. You deal with a real person, not an algorithm. Your personal assistant matchmaker in Thailand takes the time to understand your lifestyle, values, relationship history, and exact partner preferences, and then hand-picks and vets compatible matches specifically for you.",
    answer: (
      <>
        Swipe apps treat romance like an endless numbers game, leading to
        ghosting, scammers, catfishing, and immense time wasted.{" "}
        <AppName className="font-semibold" /> is a bespoke 1-to-1 personal
        matchmaking service. You deal with a real human being—not an algorithm.
        Your personal assistant matchmaker in Thailand takes the time to
        understand your personality, lifestyle, relationship goals, and what has
        or hasn&apos;t worked for you previously. We personally scout, vet, and
        introduce compatible matches tailored specifically to your life.
      </>
    ),
  },
  {
    id: "process-mutual-consent",
    category: "process",
    categoryLabel: "Matchmaking Process",
    questionText:
      "Does the lady know I am being introduced to her, and is it mutual?",
    question:
      "Does the lady know I am being introduced to her, and is it mutual?",
    answerText:
      "Yes, 100%. We operate on strict mutual consent (double-opt-in). We never share your contact details without your permission, nor do we present a woman without her reviewing your profile first. An introduction only occurs when both you and the lady have reviewed each other's profiles, expressed genuine interest, and mutually agreed to meet.",
    answer: (
      <>
        Yes, 100%. We operate on strict{" "}
        <strong className="text-foreground">
          mutual consent (double-opt-in)
        </strong>
        . We never broadcast your personal details, nor do we introduce you to
        someone without her having reviewed your profile summary first. An
        introduction only takes place when both you and the lady have expressed
        mutual interest and agreed to connect.
      </>
    ),
  },
  {
    id: "process-match-frequency",
    category: "process",
    categoryLabel: "Matchmaking Process",
    questionText: "How many matches will I receive each month?",
    question: "How many matches will I receive each month?",
    answerText:
      "We prioritize quality and true compatibility over quantity. On average, gentleman members receive 3 to 5 carefully vetted and hand-selected matches per month based on your shared values, lifestyle, and relationship goals. Every introduction is curated by your human matchmaker—never generated by automated algorithms.",
    answer: (
      <>
        We prioritize high compatibility and lasting chemistry over sheer
        volume. On average, gentleman members receive{" "}
        <strong className="text-foreground">
          3 to 5 carefully vetted, hand-selected matches per month
        </strong>
        . Every single profile presented has been screened to ensure alignment
        with your lifestyle, values, age preferences, and relationship goals.
      </>
    ),
  },
  {
    id: "process-personal-assistant",
    category: "process",
    categoryLabel: "Matchmaking Process",
    questionText: "What does 'Personal Assistant in Your Search' really mean?",
    question: 'What does "Personal Assistant in Your Search" really mean?',
    answerText:
      "Think of us as your private concierge for finding love in Thailand. We take care of all the heavy lifting: sourcing candidates, conducting interviews, confirming mutual attraction, arranging video calls with translation, and even helping plan romantic itineraries and reservations when you visit Thailand. You focus on connecting; we take care of the details.",
    answer: (
      <>
        Think of us as your dedicated, private concierge on the ground in
        Thailand. We do all the heavy lifting: sourcing candidates from our
        verified network, conducting interviews, verifying mutual attraction,
        scheduling video calls with live translation, and even arranging
        romantic dinner reservations when you visit Thailand. You focus on
        building a genuine connection while we handle the logistics.
      </>
    ),
  },

  // 3. MEETINGS, TRAVEL & LANGUAGE
  {
    id: "meetings-travel-requirement",
    category: "meetings",
    categoryLabel: "Travel & Video Meetings",
    questionText: "Do I have to travel to Thailand immediately?",
    question: "Do I have to travel to Thailand immediately?",
    answerText:
      "No, not at all. You can register and begin your matchmaking journey from anywhere in the world. Once a mutual match is confirmed, we host a facilitated 30-to-45-minute video introduction on Google Meet with your dedicated matchmaker present to guide the conversation. This lets you build comfort and chemistry before committing to travel. When you are ready to visit Thailand, our local team coordinates your in-person dates.",
    answer: (
      <>
        No, not at all. Many of our international members reside in the UK,
        Europe, North America, and Australasia and begin from their home
        countries. When a mutual match is found, we host a facilitated video
        introduction on Google Meet with your matchmaker present. This allows
        both of you to establish chemistry and mutual rapport before you book
        flights. When you are ready to visit Thailand, our local team
        coordinates your in-person meetings.
      </>
    ),
  },
  {
    id: "meetings-language-barrier",
    category: "meetings",
    categoryLabel: "Travel & Video Meetings",
    questionText:
      "What if there is a language barrier? Do the ladies speak English?",
    question:
      "What if there is a language barrier? Do the ladies speak English?",
    answerText:
      "Many of our female members speak conversational to fluent English. However, to eliminate any anxiety or awkwardness during your first conversation, your personal matchmaker attends your initial Google Meet call as a complimentary bilingual interpreter. We ensure smooth, warm, and natural communication so you can understand each other's personalities with complete ease.",
    answer: (
      <>
        Many of our female members speak conversational to fluent English.
        However, to eliminate anxiety and prevent miscommunication during your
        first connection, your personal matchmaker attends your virtual meetings
        as a{" "}
        <strong className="text-foreground">
          complimentary bilingual interpreter
        </strong>
        . We ensure smooth, warm, and natural dialogue so you can understand
        each other with complete ease.
      </>
    ),
  },
  {
    id: "meetings-thailand-arrival",
    category: "meetings",
    categoryLabel: "Travel & Video Meetings",
    questionText: "What happens when I arrive in Thailand to meet in person?",
    question: "What happens when I arrive in Thailand to meet in person?",
    answerText:
      "Our team in Thailand provides full local concierge support. We recommend safe, upscale, and romantic meeting venues (such as prestigious hotel lounges, fine dining restaurants, or scenic riverside spots) and coordinate dates around your travel schedule. Your matchmaker is available to assist you locally, answer cultural questions, and conduct helpful debriefs after each meeting.",
    answer: (
      <>
        Our team in Thailand is on the ground to provide complete local support.
        We assist in selecting safe, upscale, and romantic venues (such as
        luxury hotel lounges, quiet rooftop restaurants, or riverside cafes) and
        coordinate dates around your travel itinerary. Your matchmaker is
        available locally to welcome you, provide cultural tips, and conduct
        helpful debriefs following each date.
      </>
    ),
  },
  {
    id: "meetings-contact-exchange",
    category: "meetings",
    categoryLabel: "Travel & Video Meetings",
    questionText: "When can we exchange personal WhatsApp or phone numbers?",
    question: "When can we exchange personal WhatsApp or phone numbers?",
    answerText:
      "Following your video introduction or first in-person date, both you and the lady provide private feedback to your matchmaker. If both of you mutually agree to continue communicating privately, your matchmaker securely facilitates the exchange of WhatsApp or LINE contact details so you can stay in touch directly.",
    answer: (
      <>
        Following your video introduction or first in-person meeting in
        Thailand, both parties provide private debrief feedback to their
        matchmaker. If both of you express mutual desire to continue
        communicating independently, your matchmaker securely facilitates the
        exchange of private contact information (such as WhatsApp or LINE) so
        you can stay in touch directly.
      </>
    ),
  },

  // 4. DISCRETION, PRIVACY & FEES
  {
    id: "privacy-confidentiality",
    category: "privacy",
    categoryLabel: "Privacy & Fees",
    questionText: "Is my membership completely private and confidential?",
    question: "Is my membership completely private and confidential?",
    answerText:
      "Absolute discretion is our highest priority. Your profile, photographs, and personal background are strictly private and never publicly searchable on the internet, search engines, or social media. Your details are only shared confidentially with vetted candidates whom you have reviewed and approved for an introduction.",
    answer: (
      <>
        Absolute discretion is our highest priority. Your profile, photos, and
        personal information are strictly confidential and will{" "}
        <strong className="text-foreground">
          never be published on a public website, social media, or searchable
          catalog
        </strong>
        . Your details are only shared confidentially with vetted candidates
        whom you have personally reviewed and approved for an introduction.
      </>
    ),
  },
  {
    id: "privacy-consultation-details",
    category: "privacy",
    categoryLabel: "Privacy & Fees",
    questionText: "What happens during the confidential consultation call?",
    question: "What happens during the confidential consultation call?",
    answerText:
      "The initial consultation is a relaxed, private, 1-on-1 discussion with our matchmaking team. We listen to your lifestyle, relationship history, and expectations, explain how our matching process works, and answer any questions you have about dating and marriage in Thailand. It is 100% confidential, free, and carries zero pressure or obligation to enroll.",
    answer: (
      <>
        The consultation is a relaxed, private, 1-on-1 conversation with our
        matchmaking team. We take time to listen to your background,
        relationship goals, lifestyle preferences, and what has or hasn&apos;t
        worked for you previously. We also answer all your questions about our
        service and life in Thailand. It is 100% confidential, free of charge,
        and carries{" "}
        <strong className="text-foreground">
          zero pressure or sales obligation
        </strong>
        .
      </>
    ),
  },
  {
    id: "privacy-pricing-structure",
    category: "privacy",
    categoryLabel: "Privacy & Fees",
    questionText: "How much does the service cost, and are there hidden fees?",
    question: "How much does the service cost, and are there hidden fees?",
    answerText:
      "We offer transparent membership tiers based on the search scope and level of personal concierge support you desire. Unlike generic apps that charge endless recurring monthly subscriptions, our memberships provide dedicated human matchmaker hours, verified introductions, translation services, and local support in Thailand with zero hidden fees. Detailed pricing is available on our Pricing page or discussed during your private consultation.",
    answer: (
      <>
        We provide clear, transparent membership tiers based on your search
        criteria and the level of personal matchmaking support required. Unlike
        generic dating sites that lock you into indefinite monthly credit
        subscriptions, our packages include dedicated human matchmaker hours,
        verified introductions, translation services, and local concierge
        support in Thailand with zero hidden costs. You can view our packages on
        our{" "}
        <Link
          href="/pricing"
          className="font-medium text-[var(--gold)] underline underline-offset-4 hover:opacity-80"
        >
          Pricing page
        </Link>{" "}
        or discuss options during your private consultation.
      </>
    ),
  },
  {
    id: "privacy-free-for-women",
    category: "privacy",
    categoryLabel: "Privacy & Fees",
    questionText: "Is it free for Thai women to join?",
    question: "Is it free for Thai women to join?",
    answerText:
      "Yes. Joining our private verified network is 100% free for relationship-minded Thai women. We believe financial barriers should never prevent genuine, high-caliber women from finding loving international husbands. However, female members must pass our rigorous 6-point verification standard and sign our mutual respect guidelines before being considered for introductions.",
    answer: (
      <>
        Yes. Joining our private, verified female network is{" "}
        <strong className="text-foreground">100% free for Thai women</strong>.
        We believe financial barriers should never prevent genuine, respectable
        women from finding sincere international life partners. However, all
        female applicants must pass our comprehensive 6-point verification
        process and personal interview before any introductions take place.
      </>
    ),
  },

  // 5. FOR THAI LADIES (สุภาพสตรีไทย)
  {
    id: "ladies-fees",
    category: "ladies",
    categoryLabel: "For Thai Ladies",
    questionText:
      "สุภาพสตรีไทยต้องเสียค่าใช้จ่ายหรือไม่? (Are there any fees for Thai women?)",
    question: (
      <>
        สุภาพสตรีไทยต้องเสียค่าใช้จ่ายหรือไม่?{" "}
        <span className="text-xs font-normal text-muted-foreground sm:text-sm">
          (Are there any fees for Thai women?)
        </span>
      </>
    ),
    answerText:
      "ไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้น บริการของเราฟรี 100% สำหรับสุภาพสตรีไทยที่มีความจริงใจและมองหาความสัมพันธ์ระยะยาวเพื่อการแต่งงาน ท่านจะได้รับการดูแลอย่างให้เกียรติ ปลอดภัย และมีความเป็นส่วนตัวในทุกขั้นตอน โดยไม่มีค่าธรรมเนียมแอบแฝงใดๆ (100% Free for Thai women seeking sincere, long-term relationships).",
    answer: (
      <>
        <strong className="text-foreground">
          ไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้น บริการของเราฟรี 100%
        </strong>{" "}
        สำหรับสุภาพสตรีไทยที่มีความจริงใจและกำลังมองหาความรักที่มั่นคงระยะยาวเพื่อสร้างครอบครัว
        ท่านจะได้รับการดูแลอย่างให้เกียรติ ปลอดภัย
        และเป็นส่วนตัวสูงสุดในทุกขั้นตอนโดยไม่มีค่าธรรมเนียมแอบแฝงใดๆ ทั้งสิ้น
      </>
    ),
  },
  {
    id: "ladies-privacy",
    category: "ladies",
    categoryLabel: "For Thai Ladies",
    questionText:
      "ข้อมูลและรูปภาพของฉันจะถูกเปิดเผยในที่สาธารณะหรือไม่? (Will my photos be public?)",
    question: (
      <>
        ข้อมูลและรูปภาพของฉันจะถูกเปิดเผยในที่สาธารณะหรือไม่?{" "}
        <span className="text-xs font-normal text-muted-foreground sm:text-sm">
          (Will my photos be public?)
        </span>
      </>
    ),
    answerText:
      "ไม่เปิดเผยอย่างแน่นอน ข้อมูลส่วนบุคคลและรูปถ่ายของท่านจะถูกเก็บรักษาเป็นความลับสูงสุด จะไม่มีการนำไปเผยแพร่บนเว็บไซต์สาธารณะหรือโซเชียลมีเดียใดๆ ทั้งสิ้น ข้อมูลของท่านจะถูกนำเสนอให้สุภาพบุรุษต่างชาติที่ผ่านการตรวจสอบประวัติแล้วดูเฉพาะบุคคล และต้องได้รับความยินยอมจากท่านก่อนเสมอ (Strictly confidential; photos are never published publicly).",
    answer: (
      <>
        <strong className="text-foreground">ไม่เปิดเผยอย่างแน่นอน</strong>{" "}
        ข้อมูลส่วนตัวและรูปถ่ายของท่านจะถูกเก็บรักษาเป็นความลับสูงสุด
        จะไม่มีการนำไปเผยแพร่หรือโพสต์บนเว็บไซต์สาธารณะ แคตตาล็อกออนไลน์
        หรือสื่อโซเชียลมีเดียใดๆ
        ข้อมูลของท่านจะถูกนำเสนอให้เฉพาะสุภาพบุรุษที่ผ่านการคัดกรองแล้วดูเป็นรายบุคคล
        และท่านต้องเป็นผู้ให้ความยินยอมก่อนเสมอ
      </>
    ),
  },
  {
    id: "ladies-english",
    category: "ladies",
    categoryLabel: "For Thai Ladies",
    questionText:
      "ถ้าทักษะภาษาอังกฤษไม่เก่ง จะสามารถเข้าร่วมได้หรือไม่? (What if my English is basic?)",
    question: (
      <>
        ถ้าทักษะภาษาอังกฤษไม่เก่ง จะสามารถเข้าร่วมได้หรือไม่?{" "}
        <span className="text-xs font-normal text-muted-foreground sm:text-sm">
          (What if my English is basic?)
        </span>
      </>
    ),
    answerText:
      "สามารถเข้าร่วมได้ แม้ทักษะภาษาอังกฤษจะอยู่ในระดับเบื้องต้น เพราะในการพูดคุยวิดีโอคอลครั้งแรกผ่าน Google Meet จะมีแม่สื่อผู้เชี่ยวชาญภาษาไทย-อังกฤษคอยช่วยแปล อำนวยความสะดวก และสร้างบรรยากาศที่ผ่อนคลายตลอดการสนทนา (Our bilingual matchmaker provides live translation during video calls).",
    answer: (
      <>
        <strong className="text-foreground">สามารถเข้าร่วมได้ค่ะ</strong>{" "}
        แม้ทักษะภาษาอังกฤษของท่านจะอยู่ในระดับเบื้องต้น
        เพราะในการนัดหมายพูดคุยทางวิดีโอ (Google Meet) ครั้งแรก
        แม่สื่อมืออาชีพประจำตัวของท่านจะเข้าร่วมเพื่อช่วยเป็นล่ามแปลภาษาไทย-อังกฤษ
        ช่วยอำนวยความสะดวก และสร้างบรรยากาศที่อบอุ่นเป็นกันเองตลอดการสนทนา
      </>
    ),
  },
  {
    id: "ladies-safety",
    category: "ladies",
    categoryLabel: "For Thai Ladies",
    questionText:
      "สุภาพบุรุษต่างชาติผ่านการตรวจสอบความปลอดภัยอย่างไร? (How are foreign men vetted?)",
    question: (
      <>
        สุภาพบุรุษต่างชาติผ่านการตรวจสอบความปลอดภัยอย่างไร?{" "}
        <span className="text-xs font-normal text-muted-foreground sm:text-sm">
          (How are foreign men vetted?)
        </span>
      </>
    ),
    answerText:
      "สุภาพบุรุษทุกคนต้องผ่านการตรวจสอบตัวตน (Government ID) และการสัมภาษณ์แบบ 1-ต่อ-1 กับทีมงานเพื่อยืนยันสถานะโสด หน้าที่การงานที่มั่นคง และเจตจำนงที่ชัดเจนในการสร้างครอบครัว เราไม่รับผู้ที่มองหาความสัมพันธ์แบบชั่วคราว เพื่อความปลอดภัยสูงสุดของสมาชิกสุภาพสตรี (All international gentlemen are verified for identity, background, and sincere marriage intentions).",
    answer: (
      <>
        สุภาพบุรุษชาวต่างชาติทุกคนต้องผ่านการตรวจสอบตัวตนอย่างเป็นทางการ
        (Government-issued ID) และผ่านการสัมภาษณ์แบบ 1-ต่อ-1 กับทีมงานแม่สื่อ
        เพื่อยืนยันสถานะโสด หน้าที่การงานที่มั่นคง ความพร้อมด้านการเงิน
        และความจริงใจในการสร้างครอบครัวระยะยาว
        เราไม่รับผู้ที่มองหาความสัมพันธ์แบบชั่วคราว
        เพื่อให้ท่านมั่นใจในความปลอดภัยและความจริงใจสูงสุด
      </>
    ),
  },
]

const CATEGORIES: {
  value: FaqCategory
  label: string
  icon: React.ReactNode
}[] = [
  {
    value: "all",
    label: "All Questions",
    icon: <HelpCircle className="size-4" />,
  },
  {
    value: "verification",
    label: "Verification & Safety",
    icon: <ShieldCheck className="size-4" />,
  },
  {
    value: "process",
    label: "Matchmaking Process",
    icon: <Compass className="size-4" />,
  },
  {
    value: "meetings",
    label: "Travel & Meetings",
    icon: <Video className="size-4" />,
  },
  {
    value: "privacy",
    label: "Privacy & Fees",
    icon: <Lock className="size-4" />,
  },
  {
    value: "ladies",
    label: "For Thai Ladies",
    icon: <Heart className="size-4" />,
  },
]

export function FaqContent() {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Filter questions based on Category and Search Query
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory

      // Search match
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        item.questionText.toLowerCase().includes(query) ||
        item.answerText.toLowerCase().includes(query) ||
        item.categoryLabel.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* =========================================================================
          1. HERO HEADER (Matching Service & Gallery Typography)
      ========================================================================= */}
      <section className="relative overflow-hidden px-4 text-center sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl space-y-6"
        >
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
            <ShieldCheck className="size-3.5" />
            <span>Substantial & Authoritative Guidance</span>
          </div>

          {/* Main Title */}
          <h1 className="text-gradient text-4xl font-bold tracking-tighter md:text-5xl">
            Frequently Asked Questions
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-[720px] text-muted-foreground md:text-xl">
            Everything you need to know about our private 1-to-1 personal
            matchmaking service in Thailand.
          </p>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            We understand that finding a life partner internationally requires
            total trust, discretion, and clarity. Below are detailed answers to
            the most common questions asked by gentlemen and Thai ladies.
          </p>

          {/* 4 Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-medium text-foreground sm:gap-6 sm:text-sm">
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 backdrop-blur-xs">
              <ShieldCheck className="size-4 text-[#D3A753]" />
              <span>6-Point Verification Standard</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 backdrop-blur-xs">
              <Handshake className="size-4 text-[#D3A753]" />
              <span>100% Mutual Consent</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 backdrop-blur-xs">
              <Lock className="size-4 text-[#D3A753]" />
              <span>Zero Public Profiles</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 backdrop-blur-xs">
              <MapPin className="size-4 text-[#D3A753]" />
              <span>Based in Thailand</span>
            </div>
          </div>
        </MotionDiv>
      </section>

      {/* =========================================================================
          2. SEARCH BAR & CATEGORY TABS
      ========================================================================= */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Search Input Box */}
          <div className="relative mx-auto max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
              <Search className="size-4 text-[#D3A753]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by keyword (e.g. verify, cost, travel, language)..."
              className="h-11 w-full rounded-2xl border border-border/80 bg-card/70 pr-10 pl-11 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-[#D3A753] focus:ring-2 focus:ring-[#D3A753]/30 focus:outline-none sm:text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Category Tabs (Matching Pricing Page Tab Sizing) */}
          <div className="flex w-full justify-center">
            <div className="w-full overflow-x-auto sm:w-auto">
              <Tabs
                value={selectedCategory}
                onValueChange={(val) => setSelectedCategory(val as FaqCategory)}
              >
                <TabsList className="mx-auto flex w-max min-w-max rounded-xl border border-border/70 bg-card/80 p-1 backdrop-blur-sm group-data-horizontal/tabs:h-10">
                  {CATEGORIES.map((cat) => (
                    <TabsTrigger
                      key={cat.value}
                      value={cat.value}
                      variant="gradient"
                      className="h-full gap-2 rounded-lg px-4 text-xs font-semibold sm:px-5 sm:text-sm"
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FAQ Q&A CARDS (2-Column Grid Across max-w-7xl)
      ========================================================================= */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 text-center">
            <p className="text-base font-semibold text-foreground">
              No questions found matching &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try searching with different keywords, or switch categories.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
              className="mt-4 border-[#D3A753]/40 text-xs text-[#D3A753] hover:bg-[#D3A753]/10"
            >
              Reset Search & Filter
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-4 sm:space-y-5">
            {filteredFaqs.map((faq, index) => (
              <MotionDiv
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min((index % 6) * 0.05, 0.25),
                }}
              >
                <div className="group rounded-2xl border border-border/70 bg-card/60 p-5 shadow-xs backdrop-blur-xs transition-all duration-200 hover:border-[#D3A753]/50 hover:shadow-md sm:p-6">
                  <div>
                    {/* Category Tag */}
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-md bg-[#D3A753]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#D3A753]">
                        {faq.categoryLabel}
                      </span>
                    </div>

                    {/* Question */}
                    <div className="flex items-start gap-3.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#D3A753]/15 text-xs font-black text-[#D3A753] uppercase">
                        Q
                      </span>
                      <h3 className="pt-0.5 text-base font-bold tracking-tight text-foreground sm:text-lg">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  {/* Answer (Directly under Question with Hairline Divider) */}
                  <div className="mt-4 flex items-start gap-3.5 border-t border-border/50 pt-3.5">
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
        )}
      </section>

      {/* =========================================================================
          4. BOTTOM SINGLE LUXURY CTA CARD (Matching /service Hero Proportion)
      ========================================================================= */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-[#D3A753]/40 bg-gradient-to-br from-card/90 via-card/70 to-[#D3A753]/10 p-8 text-center backdrop-blur-sm sm:p-12">
            {/* Ambient subtle glow inside CTA */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/20 to-transparent blur-3xl" />
            <div className="mx-auto max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
                <Compass className="size-3.5" />
                <span>Speak Directly With Our Matchmakers</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Have a Question That Wasn&apos;t Answered Here?
              </h2>

              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Every client journey begins with a confidential, zero-pressure
                conversation. Book a 1-on-1 private consultation with our team
                in Thailand to discuss your preferences and get all your
                questions answered in depth.
              </p>

              <div className="pt-2">
                <Button
                  asChild
                  size="lg"
                  className="btn-gradient font-semibold shadow-lg"
                >
                  <Link href="/#register-interest">
                    Arrange a Confidential Consultation
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                100% confidential • No obligation • Direct human matchmaking
              </p>
            </div>
          </div>
        </MotionDiv>
      </section>
    </div>
  )
}
