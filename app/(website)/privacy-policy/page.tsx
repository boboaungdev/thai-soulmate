import Link from "next/link"
import { AppName } from "@/components/app-name"
import { PolicyPage } from "@/components/policy-page"
import { APP_INFO } from "@/constants"

const PRIVACY_POLICY_CONTENT = [
  {
    heading: "1. Introduction",
    text: (
      <>
        Welcome to <AppName className="inline font-bold" />. We are committed to
        protecting your privacy. This Privacy Policy explains how we collect,
        use, disclose, and safeguard your information when you use our website
        and services. By using our service, you agree to the collection and use
        of information in accordance with this policy. This policy is managed by
        {` ${APP_INFO.companyName}`}.
      </>
    ),
  },
  {
    heading: "2. Information We Collect",
    text: (
      <>
        We collect information that allows us to deliver high-quality,
        personalized matchmaking and verification services. This includes:
        {"\n\n"}
        <strong className="text-foreground">A. Personal Data:</strong>
        {"\n"}• <strong>Contact Details:</strong> Your full name, email address,
        telephone number / WhatsApp, and country or general residential
        location.
        {"\n"}• <strong>Verification & Profile Information:</strong> Date of
        birth, gender, single or marital status confirmation, career background,
        lifestyle preferences, relationship goals, and consultation interview
        notes.
        {"\n"}• <strong>Photographs & Media:</strong> Portraits, headshots, and
        lifestyle photographs submitted for profile verification and
        matchmaking. For members enrolled in our Female VIP Plan, selected and
        approved photographs are utilized for promotional showcases and active
        marketing.
        {"\n"}• <strong>Financial & Transaction Data:</strong> Payment details
        processed securely through our authorized third-party payment processors
        when you enroll in paid plans or services. We do not store full credit
        card numbers on our servers.
        {"\n\n"}
        <strong className="text-foreground">
          B. Information Collected Automatically:
        </strong>
        {"\n"}• <strong>Technical & Usage Data:</strong> Standard server logs,
        IP addresses, browser type, operating system, and pages visited on our
        website to maintain platform performance and security.
      </>
    ),
  },
  {
    heading: "3. How We Use Your Information",
    text: (
      <>
        Having accurate information permits us to curate authentic matches,
        maintain community safety, and deliver our bespoke matchmaking services:
        {"\n\n"}
        <strong className="text-foreground">
          • 1-to-1 Matchmaking & Introductions:
        </strong>{" "}
        To evaluate compatibility, suggest curated candidates, and coordinate
        live video consultations between verified members.
        {"\n\n"}
        <strong className="text-foreground">
          • Confidential Internal Matching (Welcome Free Plan):
        </strong>{" "}
        For female members enrolled in our Welcome Free Plan, all profile data,
        photos, and personal details are maintained strictly confidential in our
        internal database. They are accessed solely by our matchmaking team and
        are{" "}
        <strong>
          never exposed to public marketing, social media, or public advertising
        </strong>
        .{"\n\n"}
        <strong className="text-foreground">
          • Public Marketing & Promotional Showcases (Female VIP Plan):
        </strong>{" "}
        For female members who choose to subscribe to a Female VIP Plan, we use
        approved photographs, general age, profession, and curated profile
        highlights across our public and private marketing channels (including
        our website showcases, social media features, and candidate newsletters)
        to actively attract and connect with vetted international gentlemen.
        {"\n\n"}
        <strong className="text-foreground">
          • Verification & Community Safety:
        </strong>{" "}
        To verify single status, conduct in-person or video interviews, and
        protect members against fraud, scams, or commercial solicitation.
        {"\n\n"}
        <strong className="text-foreground">
          • Service Communications:
        </strong>{" "}
        To notify you of candidate introductions, consultation appointments, and
        respond to customer service requests.
      </>
    ),
  },
  {
    heading: "4. Disclosure and Sharing of Your Information",
    text: (
      <>
        We treat your personal data with utmost discretion. Your information may
        be disclosed only under the following strictly defined circumstances:
        {"\n\n"}
        <strong className="text-foreground">
          • Public Marketing Channels (Female VIP Members Only):
        </strong>{" "}
        With explicit consent granted upon enrolling in a Female VIP Plan,
        curated profile excerpts and approved photos may be featured on our
        official website, social media showcases, and marketing campaigns.
        Direct personal contact information (phone, WhatsApp, email, or exact
        address) is NEVER publicly disclosed.
        {"\n\n"}
        <strong className="text-foreground">
          • Private 1-to-1 Match Introductions (Mutual Consent / Double-Opt-In):
        </strong>{" "}
        Full profile summaries are shared privately and confidentially with
        prospective matches. Direct contact information is only exchanged after
        both members have reviewed each other&apos;s profiles and confirmed
        mutual interest.
        {"\n\n"}
        <strong className="text-foreground">
          • Trusted Third-Party Service Providers:
        </strong>{" "}
        We share necessary operational data with trusted third parties that
        assist our operations, such as payment gateways, secure cloud hosting,
        and transactional email services. These providers are bound by strict
        confidentiality agreements.
        {"\n\n"}
        <strong className="text-foreground">
          • No Sale or Commercial Rental of Data:
        </strong>{" "}
        We never sell, rent, monetize, or trade your personal information to
        third-party data brokers or marketing agencies.
        {"\n\n"}
        <strong className="text-foreground">
          • Legal & Safety Requirements:
        </strong>{" "}
        We may disclose information if required by applicable law in Thailand,
        subpoena, or to safeguard the physical safety and legal rights of our
        members and staff.
      </>
    ),
  },
  {
    heading: "5. Your Choices, Marketing Preferences & Rights",
    text: (
      <>
        You maintain full control over your personal data and privacy settings:
        {"\n\n"}• <strong>Review & Profile Updates:</strong> You may review or
        update your personal information, relationship preferences, or photos at
        any time by contacting your matchmaker.
        {"\n"}• <strong>Marketing Media Control (Female VIP):</strong> Female
        VIP members may request changes to the photos or bio details featured in
        our promotional showcases, or request to pause public marketing at any
        time.
        {"\n"}• <strong>Account Closure & Marketing Removal:</strong> You may
        close your account at any time. Upon request, your profile will be
        promptly withdrawn from active matchmaking, and active public marketing
        showcases will be removed within a reasonable administrative period.
        {"\n"}• <strong>Communication Preferences:</strong> You can opt out of
        marketing announcements or promotional emails at any time via the
        unsubscribe link or by contacting support.
      </>
    ),
  },
  {
    heading: "6. Data Security",
    text: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.",
  },
  {
    heading: "7. Policy for Children",
    text: (
      <>
        We do not knowingly solicit information from or market to children under
        the age of 18. If you become aware of any data we have collected from
        children under age 18, please reach out to us via our{" "}
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
  {
    heading: "8. Changes to This Privacy Policy",
    text: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.",
  },
  {
    heading: "9. Contact Us",
    text: (
      <>
        If you have questions or comments about this Privacy Policy, please
        reach out to our privacy and support team via our{" "}
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

export default function PrivacyPolicyPage() {
  return <PolicyPage title="Privacy Policy" content={PRIVACY_POLICY_CONTENT} />
}
