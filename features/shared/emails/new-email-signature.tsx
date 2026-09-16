import * as React from "react"
import { Section, Row, Column, Img, Text, Link } from "react-email"

import { APP_INFO, CONTACT } from "@/constants"
import { env } from "@/lib/env"

export interface EmailSignatureProps {
  signOff?: string
  name?: string
  role?: string
  email?: string
  primaryPhone?: string
  secondaryPhone?: string
  website?: string
  whatsapp?: string
  instagram?: string
  facebook?: string
  line?: string
  tiktok?: string
}

export function EmailSignature({
  signOff = "Best regards,",
  name,
  role = APP_INFO.tagline,
  email = CONTACT.email,
  primaryPhone = CONTACT.primaryPhone,
  secondaryPhone = CONTACT.secondaryPhone,
  website = CONTACT.website,
  whatsapp = CONTACT.primaryPhone,
  instagram = "https://instagram.com/thaisoulmate",
  facebook = "https://facebook.com/thaisoulmates",
  line = "https://line.me/ti/p/~thaisoulmate",
  tiktok = "https://tiktok.com/@thaisoulmate",
}: EmailSignatureProps) {
  const senderName = name || `${APP_INFO.name} Team`

  const baseUrl =
    env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"
  const logoUrl = `${baseUrl}/logo.png`
  const wordmarkUrl = `${baseUrl}/email/brand-wordmark.png`
  const exclusiveUrl = `${baseUrl}/email/brand-exclusive.png`

  // Bulletproof cross-client icon URLs (colored)
  const whatsappIconUrl = `${baseUrl}/email/icons/whatsapp.png`
  const phoneIconUrl = `${baseUrl}/email/icons/phone.png`
  const mailIconUrl = `${baseUrl}/email/icons/mail.png`
  const globeIconUrl = `${baseUrl}/email/icons/globe.png`
  const facebookIconUrl = `${baseUrl}/email/icons/facebook.png`
  const instagramIconUrl = `${baseUrl}/email/icons/instagram.png`
  const tiktokIconUrl = `${baseUrl}/email/icons/tiktok-white.png`
  const lineIconUrl = `${baseUrl}/email/icons/line.png`

  const cleanWebsite = website.replace(/^https?:\/\//, "")
  const websiteUrl = website.startsWith("http") ? website : `https://${website}`
  const emailUrl = `mailto:${email}`
  const primaryPhoneUrl = `tel:${primaryPhone.replace(/[^\d+]/g, "")}`
  const secondaryPhoneUrl = secondaryPhone
    ? `tel:${secondaryPhone.replace(/[^\d+]/g, "")}`
    : ""
  const whatsappNumber = whatsapp.replace(/[^0-9]/g, "")
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  return (
    <Section style={cardContainer}>
      {/* ── TOP GRADIENT BAR (gold → blush → rose, email-safe 3-cell split) ── */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{ borderCollapse: "collapse" }}
      >
        <tbody>
          <tr>
            <td width="33%" style={gradientCellGold}>
              &nbsp;
            </td>
            <td width="34%" style={gradientCellBlush}>
              &nbsp;
            </td>
            <td width="33%" style={gradientCellRose}>
              &nbsp;
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── STRIPE TEXTURE BAND (horizontal alternating rows — email-safe) ── */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{ borderCollapse: "collapse" }}
      >
        <tbody>
          <tr>
            <td style={stripeRowDark}>&nbsp;</td>
          </tr>
          <tr>
            <td style={stripeRowLight}>&nbsp;</td>
          </tr>
          <tr>
            <td style={stripeRowDark}>&nbsp;</td>
          </tr>
          <tr>
            <td style={stripeRowLight}>&nbsp;</td>
          </tr>
          <tr>
            <td style={stripeRowDark}>&nbsp;</td>
          </tr>
          <tr>
            <td style={stripeRowLight}>&nbsp;</td>
          </tr>
          <tr>
            <td style={stripeRowDark}>&nbsp;</td>
          </tr>
          <tr>
            <td style={stripeRowAccent}>&nbsp;</td>
          </tr>
        </tbody>
      </table>

      {/* ── 2-COLUMN DETAILS (LEFT: CONNECT WITH US, RIGHT: LOGO & BRAND) ── */}
      <Section style={bodySection}>
        <Row>
          {/* Left Column: Contact Details */}
          <Column
            width="52%"
            style={{
              paddingRight: "16px",
              verticalAlign: "middle",
            }}
          >
            <Text style={senderName ? signOffText : columnHeading}>
              {signOff}
            </Text>
            {senderName && <Text style={senderNameText}>{senderName}</Text>}

            {/* WhatsApp */}
            <Row style={contactRow}>
              <Column width="22" style={iconCell}>
                <Img
                  src={whatsappIconUrl}
                  alt="WhatsApp"
                  width="14"
                  height="14"
                  style={{ display: "block" }}
                />
              </Column>
              <Column style={contactContentCell}>
                <Link href={whatsappUrl} style={contactLink}>
                  {whatsapp}
                </Link>
              </Column>
            </Row>

            {/* Primary Phone */}
            <Row style={contactRow}>
              <Column width="22" style={iconCell}>
                <Img
                  src={phoneIconUrl}
                  alt="Phone"
                  width="13"
                  height="13"
                  style={{ display: "block" }}
                />
              </Column>
              <Column style={contactContentCell}>
                <Link href={primaryPhoneUrl} style={contactLink}>
                  {primaryPhone}
                </Link>
              </Column>
            </Row>

            {/* Secondary Phone */}
            {secondaryPhone && (
              <Row style={contactRow}>
                <Column width="22" style={iconCell}>
                  <Img
                    src={phoneIconUrl}
                    alt="Phone"
                    width="13"
                    height="13"
                    style={{ display: "block" }}
                  />
                </Column>
                <Column style={contactContentCell}>
                  <Link href={secondaryPhoneUrl} style={contactLink}>
                    {secondaryPhone}
                  </Link>
                </Column>
              </Row>
            )}

            {/* Email */}
            <Row style={contactRow}>
              <Column width="22" style={iconCell}>
                <Img
                  src={mailIconUrl}
                  alt="Email"
                  width="14"
                  height="14"
                  style={{ display: "block" }}
                />
              </Column>
              <Column style={contactContentCell}>
                <Link href={emailUrl} style={contactLink}>
                  {email}
                </Link>
              </Column>
            </Row>

            {/* Website */}
            <Row style={lastContactRow}>
              <Column width="22" style={iconCell}>
                <Img
                  src={globeIconUrl}
                  alt="Website"
                  width="14"
                  height="14"
                  style={{ display: "block" }}
                />
              </Column>
              <Column style={contactContentCell}>
                <Link href={websiteUrl} style={contactLink}>
                  {cleanWebsite}
                </Link>
              </Column>
            </Row>
          </Column>

          {/* Right Column: Logo & Brand Section */}
          <Column
            width="48%"
            align="center"
            style={{
              paddingLeft: "16px",
              borderLeft: "1px solid #3D2318",
              verticalAlign: "middle",
              textAlign: "center",
            }}
          >
            {/* Logo */}
            <Img
              src={logoUrl}
              alt={APP_INFO.name}
              width="52"
              height="52"
              style={logoImage}
            />

            {/* App Name Image (Matching <AppName /> in Footer) */}
            <div style={{ textAlign: "center", margin: "0 auto 8px auto" }}>
              <Img
                src={wordmarkUrl}
                alt={APP_INFO.name}
                width="142"
                height="14"
                style={{
                  display: "block",
                  margin: "0 auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Exclusive Section Lines Image (Matching Footer — EXCLUSIVE —) */}
            <div style={{ textAlign: "center", margin: "0 auto 8px auto" }}>
              <Img
                src={exclusiveUrl}
                alt="— EXCLUSIVE —"
                width="118"
                height="6"
                style={{
                  display: "block",
                  margin: "0 auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Tagline (Matching APP_INFO.tagline in Footer) */}
            <Text style={taglineText}>{role || APP_INFO.tagline}</Text>
          </Column>
        </Row>
      </Section>

      {/* ── SOCIAL MEDIA BAR ── */}
      <Section style={socialSection}>
        <Row>
          <Column style={{ verticalAlign: "middle" }}>
            <Text style={socialHeaderLabel}>FOLLOW US</Text>
          </Column>

          <Column align="right" style={{ verticalAlign: "middle" }}>
            <table cellPadding="0" cellSpacing="0" border={0}>
              <tbody>
                <tr>
                  <td style={socialIconCell}>
                    <Link href={facebook} style={socialIconLink}>
                      <Img
                        src={facebookIconUrl}
                        alt="Facebook"
                        width="16"
                        height="16"
                        style={{ display: "block" }}
                      />
                    </Link>
                  </td>
                  <td style={socialIconCell}>
                    <Link href={instagram} style={socialIconLink}>
                      <Img
                        src={instagramIconUrl}
                        alt="Instagram"
                        width="16"
                        height="16"
                        style={{ display: "block" }}
                      />
                    </Link>
                  </td>
                  <td style={line ? socialIconCell : socialIconCellLast}>
                    <Link href={tiktok} style={socialIconLink}>
                      <Img
                        src={tiktokIconUrl}
                        alt="TikTok"
                        width="15"
                        height="15"
                        style={{ display: "block" }}
                      />
                    </Link>
                  </td>
                  {line && (
                    <td style={socialIconCellLast}>
                      <Link href={line} style={socialIconLink}>
                        <Img
                          src={lineIconUrl}
                          alt="LINE"
                          width="16"
                          height="16"
                          style={{ display: "block" }}
                        />
                      </Link>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </Column>
        </Row>
      </Section>

      {/* ── LEGAL FOOTER ── */}
      <Section style={legalFooterSection}>
        <Text style={confidentialityNoticeText}>
          <strong>CONFIDENTIALITY &amp; PRIVACY NOTICE:</strong> This email,
          including any attachments, member profiles, photographs, and related
          materials, contains confidential, proprietary, and legally privileged
          information intended solely and exclusively for the use of the
          individual or entity named above. Any unauthorized review, use,
          disclosure, copying, distribution, or forwarding of this transmission
          or its attachments is strictly prohibited. If you have received this
          communication in error, please immediately notify the sender by reply
          email and permanently delete all copies, attachments, and records from
          your system without reading, printing, or disclosing them to any third
          party. {APP_INFO.name} remains dedicated to the highest standards of
          member discretion and personal privacy protection.
        </Text>
      </Section>
    </Section>
  )
}

export default EmailSignature

/* ============================================================
   STYLES — Dark Luxury (Burgundy / Gold / Rose)
   ============================================================ */

/** Outer wrapper — deepest burgundy-black */
const cardContainer: React.CSSProperties = {
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#11070A",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  color: "#FBF8F3",
}

/* ── TOP GRADIENT BAR cells (3-cell split: gold → blush → rose) ── */
const gradientBarBase: React.CSSProperties = {
  height: "4px",
  lineHeight: "4px",
  fontSize: "1px",
  padding: 0,
}
const gradientCellGold: React.CSSProperties = {
  ...gradientBarBase,
  backgroundColor: "#D3A753",
}
const gradientCellBlush: React.CSSProperties = {
  ...gradientBarBase,
  backgroundColor: "#CFA14F",
}
const gradientCellRose: React.CSSProperties = {
  ...gradientBarBase,
  backgroundColor: "#CA617D",
}

/* ── STRIPE TEXTURE BAND rows ── */
const stripeRowBase: React.CSSProperties = {
  height: "3px",
  lineHeight: "3px",
  fontSize: "1px",
  padding: 0,
}
const stripeRowDark: React.CSSProperties = {
  ...stripeRowBase,
  backgroundColor: "#1C0E12",
}
const stripeRowLight: React.CSSProperties = {
  ...stripeRowBase,
  backgroundColor: "#231219",
}
const stripeRowAccent: React.CSSProperties = {
  ...stripeRowBase,
  backgroundColor: "#2A1420",
  height: "2px",
  lineHeight: "2px",
}

const logoImage: React.CSSProperties = {
  display: "block",
  margin: "0 auto 8px auto",
  objectFit: "contain",
}

const taglineText: React.CSSProperties = {
  margin: "0",
  fontSize: "10.5px",
  lineHeight: "5px",
  fontWeight: "600",
  letterSpacing: "0.08em",
  color: "#D3A753",
  textTransform: "uppercase",
  textAlign: "center",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

/** Main contact body — slightly lighter burgundy */
const bodySection: React.CSSProperties = {
  padding: "20px 20px",
  backgroundColor: "#1C0E12",
}

const signOffText: React.CSSProperties = {
  margin: "0 0 2px 0",
  fontSize: "12.5px",
  lineHeight: "16px",
  fontWeight: "500",
  color: "#A89070",
}

const senderNameText: React.CSSProperties = {
  margin: "0 0 10px 0",
  fontSize: "14px",
  lineHeight: "18px",
  fontWeight: "700",
  color: "#FBF8F3",
}

const columnHeading: React.CSSProperties = {
  margin: "0 0 10px 0",
  fontSize: "13px",
  lineHeight: "18px",
  fontWeight: "700",
  color: "#FBF8F3",
}

const contactRow: React.CSSProperties = {
  marginBottom: "8px",
}

const lastContactRow: React.CSSProperties = {
  marginBottom: "0px",
}

const iconCell: React.CSSProperties = {
  width: "22px",
  verticalAlign: "middle",
}

const contactContentCell: React.CSSProperties = {
  verticalAlign: "middle",
  paddingLeft: "4px",
}

const contactLink: React.CSSProperties = {
  display: "inline-block",
  fontSize: "12px",
  lineHeight: "18px",
  color: "#E8D5B0",
  textDecoration: "none",
  fontWeight: "500",
}

/** Social bar — darkest wine strip */
const socialSection: React.CSSProperties = {
  padding: "12px 20px",
  borderTop: "1px solid #3D2318",
  borderBottom: "1px solid #3D2318",
  backgroundColor: "#160A0E",
}

const socialHeaderLabel: React.CSSProperties = {
  margin: 0,
  fontSize: "10px",
  lineHeight: "16px",
  fontWeight: "700",
  letterSpacing: "1px",
  color: "#D3A753",
  textTransform: "uppercase",
}

const socialIconCell: React.CSSProperties = {
  paddingRight: "14px",
  verticalAlign: "middle",
}

const socialIconCellLast: React.CSSProperties = {
  paddingRight: "0px",
  verticalAlign: "middle",
}

const socialIconLink: React.CSSProperties = {
  display: "inline-block",
  textDecoration: "none",
  lineHeight: "1",
}

/** Legal footer — deepest base */
const legalFooterSection: React.CSSProperties = {
  padding: "14px 20px 10px",
  textAlign: "center",
  backgroundColor: "#11070A",
}

const confidentialityNoticeText: React.CSSProperties = {
  margin: "0 0 10px 0",
  fontSize: "9px",
  lineHeight: "14px",
  color: "#5A4A40",
  textAlign: "justify",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}
