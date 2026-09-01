import * as React from "react"
import { Section, Row, Column, Img, Text, Link } from "react-email"

import { APP_INFO, CONTACT } from "@/constants"
import { env } from "@/lib/env"

export interface EmailSignatureProps {
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
  name = APP_INFO.name,
  role = "1-2-1 Matchmaking Service",
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
  const baseUrl =
    env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"
  const logoUrl = `${baseUrl}/logo.png`
  const wordmarkUrl = `${baseUrl}/email/brand-wordmark.png`
  const heartDividerUrl = `${baseUrl}/email/heart-divider.png`

  // Bulletproof cross-client icon URLs (colored)
  const whatsappIconUrl = `${baseUrl}/email/icons/whatsapp.png`
  const phoneIconUrl = `${baseUrl}/email/icons/phone.png`
  const mailIconUrl = `${baseUrl}/email/icons/mail.png`
  const globeIconUrl = `${baseUrl}/email/icons/globe.png`
  const facebookIconUrl = `${baseUrl}/email/icons/facebook.png`
  const instagramIconUrl = `${baseUrl}/email/icons/instagram.png`
  const tiktokIconUrl = `${baseUrl}/email/icons/tiktok.png`
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
  const currentYear = new Date().getFullYear()

  return (
    <Section style={cardContainer}>
      {/* ── BRAND HEADER WITH COLOR WORDMARK & EXCLUSIVE LABEL ── */}
      <Section style={brandHeaderSection}>
        <Row>
          <Column align="center" style={{ textAlign: "center" }}>
            {/* Logo */}
            <Img
              src={logoUrl}
              alt={APP_INFO.name}
              width="68"
              height="68"
              style={logoImage}
            />

            {/* Color Wordmark Image */}
            <div style={{ textAlign: "center", margin: "6px auto 2px auto" }}>
              <Img
                src={wordmarkUrl}
                alt={name}
                width="165"
                height="24"
                style={{
                  display: "block",
                  margin: "0 auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Exclusive Subtitle Badge */}
            <Text style={exclusiveText}>EXCLUSIVE</Text>

            {/* Service Subtitle */}
            <Text style={serviceSubtitleText}>{role}</Text>

            {/* Decorative Heart Divider Image */}
            <div style={{ textAlign: "center", margin: "6px auto" }}>
              <Img
                src={heartDividerUrl}
                alt="♥"
                width="150"
                height="17"
                style={{
                  display: "block",
                  margin: "0 auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Tagline */}
            <Text style={taglineText}>
              Real People. Real Relationships. Personally Matched in Thailand.
            </Text>
          </Column>
        </Row>
      </Section>

      {/* ── SIMPLE DIVIDER ── */}
      <div style={sectionDivider} />

      {/* ── 2-COLUMN DETAILS ── */}
      <Section style={bodySection}>
        <Row>
          {/* Left Column: Contact Details */}
          <Column
            width="55%"
            style={{
              paddingRight: "16px",
              verticalAlign: "top",
            }}
          >
            <Text style={columnHeading}>Connect with us</Text>

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

          {/* Right Column: Exclusive Matchmaking */}
          <Column
            width="45%"
            style={{
              paddingLeft: "16px",
              borderLeft: "1px solid #E5E7EB",
              verticalAlign: "top",
            }}
          >
            <Text style={columnHeading}>Exclusive Matchmaking</Text>
            <Text style={companyDescription}>
              Personal 1-2-1 introductions for genuine and meaningful
              relationships in Thailand.
            </Text>

            <div style={{ marginTop: "8px" }}>
              <Text style={featureItem}>
                <strong style={{ marginRight: "6px" }}>•</strong>
                Personal 1-2-1 Matchmaking
              </Text>
              <Text style={featureItem}>
                <strong style={{ marginRight: "6px" }}>•</strong>
                100% Private & Confidential
              </Text>
              <Text style={featureItem}>
                <strong style={{ marginRight: "6px" }}>•</strong>
                Verified & Hand-Picked Matches
              </Text>
              <Text style={featureItem}>
                <strong style={{ marginRight: "6px" }}>•</strong>
                Discreet Global Introductions
              </Text>
            </div>
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
          <strong>CONFIDENTIALITY NOTICE:</strong> This email, including any
          attachments, contains confidential and legally privileged information
          intended solely for the use of the individual or entity named above.
          If you have received this transmission in error, please immediately
          notify the sender by reply email and permanently delete all copies.
        </Text>

        <div style={legalLinksRow}>
          <Link href={`${websiteUrl}/terms`} style={legalLink}>
            Terms of Service
          </Link>
          <span style={legalDividerDot}>•</span>
          <Link href={`${websiteUrl}/privacy`} style={legalLink}>
            Privacy Policy
          </Link>
        </div>

        <Text style={copyrightText}>
          Copyright © {currentYear} {APP_INFO.name}. All rights reserved.
        </Text>
      </Section>
    </Section>
  )
}

export default EmailSignature

/* ============================================================
   STYLES — Clean, Neutral, Minimal with Brand Accents
   ============================================================ */

const cardContainer: React.CSSProperties = {
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#FFFFFF",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  color: "#111827",
}

const brandHeaderSection: React.CSSProperties = {
  padding: "16px 0 12px",
  textAlign: "center",
  backgroundColor: "#FFFFFF",
}

const logoImage: React.CSSProperties = {
  display: "block",
  margin: "0 auto 6px auto",
  objectFit: "contain",
}

const exclusiveText: React.CSSProperties = {
  margin: "6px 0 0 0",
  fontSize: "10px",
  lineHeight: "14px",
  fontWeight: "700",
  letterSpacing: "0.3em",
  color: "#E791A7",
  textTransform: "uppercase",
  textAlign: "center",
  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
}

const serviceSubtitleText: React.CSSProperties = {
  margin: "4px 0 0 0",
  fontSize: "11.5px",
  lineHeight: "16px",
  fontWeight: "700",
  letterSpacing: "0.22em",
  color: "#D3A753",
  textTransform: "uppercase",
  textAlign: "center",
  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
}

const taglineText: React.CSSProperties = {
  margin: "4px 0 0 0",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "11.5px",
  lineHeight: "17px",
  fontStyle: "italic",
  color: "#5A0816",
  textAlign: "center",
}

const sectionDivider: React.CSSProperties = {
  height: "1px",
  backgroundColor: "#E5E7EB",
  margin: "12px 0 16px 0",
}

const bodySection: React.CSSProperties = {
  padding: "8px 0 16px",
  backgroundColor: "#FFFFFF",
}

const columnHeading: React.CSSProperties = {
  margin: "0 0 10px 0",
  fontSize: "13px",
  lineHeight: "18px",
  fontWeight: "700",
  color: "#111827",
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
  color: "#111827",
  textDecoration: "none",
  fontWeight: "500",
}

const companyDescription: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "11px",
  lineHeight: "16px",
  color: "#4B5563",
}

const featureItem: React.CSSProperties = {
  margin: "0 0 4px 0",
  fontSize: "11px",
  lineHeight: "15px",
  color: "#374151",
  fontWeight: "500",
}

const socialSection: React.CSSProperties = {
  padding: "12px 0",
  borderTop: "1px solid #E5E7EB",
  borderBottom: "1px solid #E5E7EB",
  backgroundColor: "#FFFFFF",
}

const socialHeaderLabel: React.CSSProperties = {
  margin: 0,
  fontSize: "10px",
  lineHeight: "16px",
  fontWeight: "700",
  letterSpacing: "1px",
  color: "#111827",
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

const legalFooterSection: React.CSSProperties = {
  padding: "16px 0 8px",
  textAlign: "center",
  backgroundColor: "#FFFFFF",
}

const confidentialityNoticeText: React.CSSProperties = {
  margin: "0 0 10px 0",
  fontSize: "9px",
  lineHeight: "14px",
  color: "#6B7280",
  textAlign: "justify",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

const legalLinksRow: React.CSSProperties = {
  margin: "8px 0 6px 0",
  fontSize: "11px",
  lineHeight: "14px",
  textAlign: "center",
}

const legalLink: React.CSSProperties = {
  color: "#111827",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "11px",
}

const legalDividerDot: React.CSSProperties = {
  padding: "0 8px",
  color: "#9CA3AF",
  fontSize: "10px",
}

const copyrightText: React.CSSProperties = {
  margin: "6px 0 0 0",
  fontSize: "10px",
  lineHeight: "14px",
  color: "#9CA3AF",
  textAlign: "center",
  fontWeight: "500",
}
