import { AppName } from "@/components/app-name"
import { PolicyPage } from "@/components/policy-page"
import { APP_NAME, COMPANY_NAME, CONTACT } from "@/constants"

const PRIVACY_POLICY_CONTENT = [
  {
    heading: "1. Introduction",
    text: (
      <>
        Welcome to <AppName className="inline" />. We are committed to
        protecting your privacy. This Privacy Policy explains how we collect,
        use, disclose, and safeguard your information when you use our website
        and services. By using our service, you agree to the collection and use
        of information in accordance with this policy. This policy is managed by{" "}
        {COMPANY_NAME}.
      </>
    ),
  },
  {
    heading: "2. Information We Collect",
    text: `We may collect information about you in a variety of ways. The information we may collect on the Service includes:

A. Personal Data:
- Account Information: When you register, we collect personally identifiable information, such as your name, email address, date of birth, gender, photographs, and password.
- Profile Information: To help build your profile, we may collect additional information such as details about your personality, lifestyle, interests, education, and relationship preferences.
- Financial Data: We may collect financial information, such as data related to your payment method (e.g. valid credit card number, card brand, expiration date) when you purchase, order, return, or exchange. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor.
- Communication Data: If you contact us directly, we may receive additional information about you. We also store the communications you have with other users through our platform.

B. Information Collected Automatically:
- Usage Data: Information your browser automatically sends when you visit our site, such as your IP address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, and the time spent on those pages.
- Device Information: We may collect information about your computer or mobile device, such as your device model, operating system, and unique device identifiers.`,
  },
  {
    heading: "3. How We Use Your Information",
    text: `Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:
- Create and manage your account.
- Fulfill and manage purchases, orders, payments, and other transactions related to the Service.
- Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Service to you.
- Email you regarding your account or order.
- Enable user-to-user communications.
- Generate a personal profile about you to make future visits to the Service more personalized.
- Increase the efficiency and operation of the Service.
- Monitor and analyze usage and trends to improve your experience with the Service.
- Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.
- Process payments and refunds.
- Request feedback and contact you about your use of the Service.`,
  },
  {
    heading: "4. Disclosure of Your Information",
    text: `We may share information we have collected about you in certain situations. Your information may be disclosed as follows:

- By Law or to Protect Rights: If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
- Third-Party Service Providers: We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
- With other Users: Your profile information is visible to other registered users of the Service.
- Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.`,
  },
  {
    heading: "5. Your Choices and Rights",
    text: `You have certain rights regarding your personal information. You can:
- Access, review, and update your account information at any time by logging into your account settings.
- Opt-out of receiving marketing emails from us by following the unsubscribe link in those emails.
- Close your account, which will remove your profile and data from active view. Please note that we may retain certain information for analytical purposes and recordkeeping integrity, as well as to prevent fraud, enforce our Terms of Service, take actions we deem necessary to protect the integrity of our Service or our users, or take other actions otherwise permitted by law.`,
  },
  {
    heading: "6. Data Security",
    text: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.",
  },
  {
    heading: "7. Policy for Children",
    text: "We do not knowingly solicit information from or market to children under the age of 18. If you become aware of any data we have collected from children under age 18, please contact us using the contact information provided below.",
  },
  {
    heading: "8. Changes to This Privacy Policy",
    text: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.",
  },
  {
    heading: "9. Contact Us",
    text: `If you have questions or comments about this Privacy Policy, please contact us at: ${CONTACT.email}`,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      content={PRIVACY_POLICY_CONTENT}
    />
  )
}
