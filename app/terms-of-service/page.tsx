import { AppName } from "@/components/app-name"
import { PolicyPage } from "@/components/policy-page"
import { APP_NAME, COMPANY_NAME, CONTACT } from "@/constants"

const TERMS_OF_SERVICE_CONTENT = [
  {
    heading: "1. Agreement to Terms",
    text: (
      <>
        By creating an account and using the services provided by{" "}
        <AppName className="inline" /> (&quot;Service&quot;), you agree to be
        bound by these Terms of Service (&quot;Terms&quot;). This agreement is a
        legally binding contract between you and {COMPANY_NAME}. If you do not
        agree with these Terms, you must not use our Service. You affirm that
        you are at least 18 years of age and are fully able and competent to
        enter into the terms, conditions, obligations, affirmations,
        representations, and warranties set forth in these Terms.
      </>
    ),
  },
  {
    heading: "2. Your Account",
    text: "To access the Service, you must create an account. You agree to provide information that is accurate, complete, and current at all times. Inaccurate or incomplete information may result in the immediate termination of your account. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party and must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.",
  },
  {
    heading: "3. User Conduct and Responsibilities",
    text: `You agree to use the Service in a manner that is lawful, respectful, and honest. You are solely responsible for your interactions with other users. You agree not to:
- Use the service for any purpose that is illegal or prohibited by these Terms.
- Harass, intimidate, or threaten any other user.
- Post or share content that is defamatory, obscene, pornographic, or otherwise offensive.
- Impersonate any person or entity, or misrepresent your affiliation with a person or entity.
- Solicit money from or defraud any other user.
- Use any robot, spider, site search/retrieval application, or other manual or automatic device or process to retrieve, index, “data mine,” or in any way reproduce or circumvent the navigational structure or presentation of the Service or its contents.`,
  },
  {
    heading: "4. Premium Services and Payments",
    text: `We offer enhanced features and services for a fee ("Premium Services"). If you choose to purchase Premium Services, you agree to the pricing and payment terms. All fees are non-refundable. Payments are processed through our third-party payment processor. By providing a payment method, you expressly authorize us to charge the disclosed fees.`,
  },
  {
    heading: "5. Intellectual Property",
    text: `The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of ${COMPANY_NAME} and its licensors. The Service is protected by copyright, trademark, and other laws of both Thailand and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of ${COMPANY_NAME}.`,
  },
  {
    heading: "6. Disclaimers",
    text: (
      <>
        The Service is provided on an &quot;AS IS&quot; and &quot;AS
        AVAILABLE&quot; basis. <AppName className="inline" /> makes no
        warranties, expressed or implied, regarding the accuracy, reliability,
        or completeness of the service or the results of your use of the
        service. We do not conduct criminal background checks on our users but
        reserve the right to do so. We are not responsible for the conduct of
        any user.
      </>
    ),
  },
  {
    heading: "7. Limitation of Liability",
    text: `In no event shall ${COMPANY_NAME}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.`,
  },
  {
    heading: "8. Termination",
    text: `We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.`,
  },
  {
    heading: "9. Governing Law",
    text: "These Terms shall be governed and construed in accordance with the laws of Thailand, without regard to its conflict of law provisions.",
  },
  {
    heading: "10. Changes to These Terms",
    text: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.",
  },
  {
    heading: "11. Contact Us",
    text: `If you have any questions about these Terms, please contact us at: ${CONTACT.email}`,
  },
]

export default function TermsOfServicePage() {
  return (
    <PolicyPage
      title="Terms of Service"
      content={TERMS_OF_SERVICE_CONTENT}
    />
  )
}
