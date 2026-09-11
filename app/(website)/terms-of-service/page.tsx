import Link from "next/link"
import { AppName } from "@/components/app-name"
import { PolicyPage } from "@/components/policy-page"
import { APP_INFO } from "@/constants"

const TERMS_OF_SERVICE_CONTENT = [
  {
    heading: "1. Agreement to Terms",
    text: (
      <>
        By creating an account and using the services provided by{" "}
        <AppName className="inline font-bold" /> (&quot;Service&quot;), you
        agree to be bound by these Terms of Service (&quot;Terms&quot;). This
        agreement is a legally binding contract between you and{" "}
        {APP_INFO.companyName}. If you do not agree with these Terms, you must
        not use our Service. You affirm that you are at least 18 years of age
        and are fully able and competent to enter into the terms, conditions,
        obligations, affirmations, representations, and warranties set forth in
        these Terms.
      </>
    ),
  },
  {
    heading: "2. Your Account & Profile Accuracy",
    text: "To access the Service, you must register and complete our screening process. You agree to provide information, relationship intentions, and photographs that are accurate, truthful, current, and genuinely representative of yourself at all times. Providing false, misleading, or deceptive information may result in the immediate termination of your membership. You are responsible for safeguarding any account credentials used to access our Service and for notifying us immediately upon becoming aware of any unauthorized use or security breach.",
  },
  {
    heading: "3. User Conduct and Responsibilities",
    text: `You agree to use the Service in a manner that is lawful, respectful, and honest. You are solely responsible for your interactions with other members and our matchmaking team. You agree not to:
- Use the service for any purpose that is illegal, exploitative, or prohibited by these Terms.
- Solicit money, loans, commercial transactions, or defraud any other member.
- Engage in commercial escort services, casual transactional dating, or solicit freelance work.
- Harass, intimidate, stalk, defame, or threaten any other user or staff member.
- Impersonate any person or entity, or misrepresent your age, marital status, or single status.
- Share, record, screenshot, or publicly post private profile details, photos, or video calls of introduced members without their explicit written consent.
- Use any automated system, scraper, or robot to index or harvest data from the Service.`,
  },
  {
    heading: "4. Membership Tiers, Marketing Consent & Confidentiality",
    text: (
      <>
        {APP_INFO.companyName} operates as a bespoke 1-2-1 personal matchmaking
        service in Thailand, offering distinct membership structures tailored
        for our female members and gentleman clients:
        {"\n\n"}
        <strong className="text-foreground">
          A. Welcome Free Plan (Female Members):
        </strong>
        {"\n"}
        Eligible female candidates who successfully pass our screening standard
        may join under our complimentary Welcome Free Plan. All profile data,
        biographical notes, and photographs for Welcome Free Plan members are
        maintained in strict confidentiality within our private internal
        database. We do not publish, distribute, or expose Welcome Free Plan
        profiles to public marketing, promotional advertisements, social media,
        or open web showcases. Matching for free members is conducted
        exclusively through private, internal matchmaker evaluations.
        {"\n\n"}
        <strong className="text-foreground">
          B. Female VIP Plans & Explicit Marketing Consent:
        </strong>
        {"\n"}
        Female members seeking proactive visibility, prioritized introductions,
        and higher match opportunities may subscribe to our dedicated Female VIP
        plans (including 6-Month and 12-Month tiers). By enrolling in a Female
        VIP Plan, you explicitly authorize and grant {APP_INFO.companyName} the
        right and permission to actively showcase, promote, and market your
        approved photographs, first name or preferred alias, age, general
        region, and curated profile highlights across our public and private
        marketing channels. These channels include, but are not limited to, our
        official website showcases, curated promotional campaigns, social media
        features, digital marketing channels, and private member newsletters.
        All marketing is conducted with dignity, elegance, and discretion to
        attract compatible, verified international gentlemen.
        {"\n\n"}
        <strong className="text-foreground">
          C. Strict Confidentiality of Direct Contact Details:
        </strong>
        {"\n"}
        Regardless of membership tier (Welcome Free Plan or Female VIP Plan),
        direct personal contact details—including personal phone numbers,
        WhatsApp credentials, personal email addresses, identification
        documents, and residential addresses—are NEVER published publicly or
        disclosed to any prospective match without explicit double-opt-in mutual
        consent following our personal matchmaker review.
        {"\n\n"}
        <strong className="text-foreground">
          D. Gentleman Memberships & Paid Services:
        </strong>
        {"\n"}
        Gentleman clients receive dedicated 1-2-1 matchmaking concierge
        services, hand-selected introductions, and verification support under
        structured membership plans. All fees paid for Gentleman Memberships,
        Female VIP Plans, or bespoke consultation services are non-refundable
        once services, consultations, or marketing campaigns have commenced.
      </>
    ),
  },
  {
    heading: "5. Intellectual Property",
    text: `The Service and its original content, branding, trademarks, logos, texts, graphics, and proprietary matchmaking methodologies are and will remain the exclusive property of ${APP_INFO.companyName} and its licensors. Our trademarks, logos, and luxury trade dress may not be copied, reproduced, or used in connection with any external product or service without prior written consent. By submitting photographs and profile descriptions, you grant us the necessary licenses to process, display, and promote such materials in accordance with your chosen membership tier and these Terms.`,
  },
  {
    heading: "6. Disclaimers",
    text: (
      <>
        The Service is provided on an &quot;AS IS&quot; and &quot;AS
        AVAILABLE&quot; basis. While <AppName className="inline font-bold" />{" "}
        conducts multi-point identity vetting and in-depth interviews on all
        members, we cannot guarantee romantic chemistry, compatibility, marriage
        outcomes, or the absolute ongoing accuracy of representations made by
        individual members. Members are encouraged to exercise personal judgment
        and discretion when getting to know their matches.
      </>
    ),
  },
  {
    heading: "7. Limitation of Liability",
    text: `In no event shall ${APP_INFO.companyName}, nor its directors, employees, partners, matchmakers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages arising from (i) your access to, use of, or inability to use the Service; (ii) the conduct, statements, or behavior of any member on or off the Service; (iii) any introduction arranged through our matchmaking team; or (iv) unauthorized access or alteration of your communications, whether based on warranty, contract, tort (including negligence), or any other legal theory.`,
  },
  {
    heading: "8. Termination & Marketing Withdrawal",
    text: `You may close your account or withdraw from our Service at any time by contacting our support team. We also reserve the right to suspend or terminate any account immediately without prior notice if these Terms, verification requirements, or our member code of conduct are breached.

For Female VIP members who terminate their account or request to pause public promotion, we will promptly withdraw active promotional showcases from our website and marketing channels within a reasonable administrative timeframe.`,
  },
  {
    heading: "9. Governing Law",
    text: "These Terms shall be governed by and construed in accordance with the laws of Thailand, without regard to its conflict of law provisions.",
  },
  {
    heading: "10. Changes to These Terms",
    text: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If revisions are material, we will provide reasonable notice by updating this page or contacting registered members prior to the changes taking effect.",
  },
  {
    heading: "11. Contact Us",
    text: (
      <>
        If you have any questions or require clarification regarding these
        Terms, please reach out to our legal and support team via our{" "}
        <Link
          href="/contact"
          className="font-medium text-[#D3A753] underline underline-offset-4 hover:brightness-110"
        >
          Contact Us
        </Link>{" "}
        page.
      </>
    ),
  },
]

export default function TermsOfServicePage() {
  return (
    <PolicyPage title="Terms of Service" content={TERMS_OF_SERVICE_CONTENT} />
  )
}
