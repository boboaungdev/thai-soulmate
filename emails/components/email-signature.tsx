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

/* ============================================================
   BULLETPROOF STANDALONE SVG ICONS (Cross-client & Server Safe)
   ============================================================ */

function WhatsappIcon({
  size = 14,
  color = "#25D366",
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

function PhoneIcon({
  size = 13,
  color = "#1877F2",
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon({
  size = 13,
  color = "#CA617D",
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function GlobeIcon({
  size = 13,
  color = "#D3A753",
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}

function FacebookIcon({
  size = 15,
  color = "#1877F2",
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({
  size = 15,
  color = "#E4405F",
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function LineIcon({
  size = 15,
  color = "#00C300",
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  )
}

function TiktokIcon({
  size = 14,
  color = "#000000",
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.78 1.25-.03 2.37-.73 2.87-1.85.34-.73.47-1.54.45-2.35.03-4.74.02-9.48.02-14.22z" />
    </svg>
  )
}

/* ============================================================
   MAIN EMAIL SIGNATURE COMPONENT (Business Card 6 Master Design)
   ============================================================ */
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
  const baseUrl = env.BASE_URL || "https://thaisoulmate.org"
  const logoUrl = `${baseUrl}/logo.png`
  const wordmarkUrl = `${baseUrl}/email/brand-wordmark.png`
  const topGradientUrl = `${baseUrl}/email/gradient-bar-top.png`
  const heartDividerUrl = `${baseUrl}/email/heart-divider.png`
  const middleGradientUrl = `${baseUrl}/email/middle-gradient-line.png`
  const bottomBannerUrl = `${baseUrl}/email/bottom-gradient-banner.png`

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
      {/* ── TOP LUXURY GRADIENT BORDER ── */}
      <div style={{ backgroundColor: "#D3A753", lineHeight: 0, fontSize: 0 }}>
        <Img
          src={topGradientUrl}
          alt=""
          width="600"
          height="5"
          style={{ display: "block", width: "100%", height: "5px", border: 0 }}
        />
      </div>

      {/* ── BRAND HEADER SECTION ── */}
      <Section style={brandHeaderSection}>
        <Row>
          <Column align="center" style={{ textAlign: "center" }}>
            {/* Logo Image */}
            <Img
              src={logoUrl}
              alt={APP_INFO.name}
              width="54"
              height="54"
              style={logoImage}
            />

            {/* Universally-Supported Brand Wordmark Image */}
            <div style={{ textAlign: "center", margin: "4px auto" }}>
              <Img
                src={wordmarkUrl}
                alt={name}
                width="220"
                height="32"
                style={{
                  display: "block",
                  margin: "0 auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Exclusive Badge Subtitle */}
            <Text style={exclusiveText}>EXCLUSIVE</Text>

            {/* Service Subtitle */}
            <Text style={serviceSubtitleText}>{role}</Text>

            {/* Decorative Heart Divider Image */}
            <div style={{ textAlign: "center", margin: "6px auto" }}>
              <Img
                src={heartDividerUrl}
                alt="♥"
                width="180"
                height="20"
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

      {/* ── MIDDLE GRADIENT SEPARATOR ── */}
      <Section style={{ padding: "0 28px" }}>
        <Img
          src={middleGradientUrl}
          alt=""
          width="544"
          height="1"
          style={{ display: "block", width: "100%", height: "1px", border: 0 }}
        />
      </Section>

      {/* ── MAIN 2-COLUMN BODY SECTION ── */}
      <Section style={bodySection}>
        <Row>
          {/* LEFT COLUMN — CONNECT & CONTACT DETAILS */}
          <Column
            width="55%"
            style={{
              paddingRight: "20px",
              verticalAlign: "top",
            }}
          >
            <Text style={columnHeading}>Connect with us.</Text>

            {/* WhatsApp */}
            <Row style={contactRow}>
              <Column width="22" style={iconCell}>
                <WhatsappIcon size={14} color="#25D366" />
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
                <PhoneIcon size={13} color="#1877F2" />
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
                  <PhoneIcon size={13} color="#1877F2" />
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
                <MailIcon size={13} color="#CA617D" />
              </Column>
              <Column style={contactContentCell}>
                <Link href={emailUrl} style={contactLinkRose}>
                  {email}
                </Link>
              </Column>
            </Row>

            {/* Website */}
            <Row style={lastContactRow}>
              <Column width="22" style={iconCell}>
                <GlobeIcon size={13} color="#D3A753" />
              </Column>
              <Column style={contactContentCell}>
                <Link href={websiteUrl} style={contactLinkGold}>
                  {cleanWebsite}
                </Link>
              </Column>
            </Row>
          </Column>

          {/* RIGHT COLUMN — EXCLUSIVE MATCHMAKING & HIGHLIGHTS */}
          <Column
            width="45%"
            style={{
              paddingLeft: "20px",
              borderLeft: "1px solid #E7DCD7",
              verticalAlign: "top",
            }}
          >
            <Text style={companyTitle}>Exclusive Matchmaking</Text>
            <Text style={companyDescription}>
              Personal 1-2-1 introductions for genuine and meaningful
              relationships in Thailand.
            </Text>

            {/* Highlights with Brand Dots */}
            <div style={{ marginTop: "10px" }}>
              <Text style={featureItem}>
                <span style={goldDot}>●</span>
                Personal 1-2-1 Matchmaking
              </Text>
              <Text style={featureItem}>
                <span style={pinkDot}>●</span>
                100% Private & Confidential
              </Text>
              <Text style={featureItem}>
                <span style={goldDot}>●</span>
                Verified & Hand-Picked Matches
              </Text>
              <Text style={featureItem}>
                <span style={pinkDot}>●</span>
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
                      <FacebookIcon size={15} color="#1877F2" />
                    </Link>
                  </td>
                  <td style={socialIconCell}>
                    <Link href={instagram} style={socialIconLink}>
                      <InstagramIcon size={15} color="#E4405F" />
                    </Link>
                  </td>
                  <td style={line ? socialIconCell : socialIconCellLast}>
                    <Link href={tiktok} style={socialIconLink}>
                      <TiktokIcon size={14} color="#000000" />
                    </Link>
                  </td>
                  {line && (
                    <td style={socialIconCellLast}>
                      <Link href={line} style={socialIconLink}>
                        <LineIcon size={15} color="#00C300" />
                      </Link>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </Column>
        </Row>
      </Section>

      {/* ── BOTTOM GRADIENT FOOTER BANNER ── */}
      <div style={{ backgroundColor: "#5A0816", lineHeight: 0, fontSize: 0 }}>
        <Img
          src={bottomBannerUrl}
          alt="EXCLUSIVE • PERSONAL • CONFIDENTIAL"
          width="600"
          height="32"
          style={{ display: "block", width: "100%", height: "auto", border: 0 }}
        />
      </div>

      {/* ── LEGAL & CONFIDENTIALITY FOOTER ── */}
      <Section style={legalFooterSection}>
        {/* Confidentiality Notice */}
        <Text style={confidentialityNoticeText}>
          <strong style={{ color: "#5A0816" }}>CONFIDENTIALITY NOTICE:</strong>{" "}
          This email, including any attachments, contains confidential and
          legally privileged information intended solely for the use of the
          individual or entity named above. If you are not the intended
          recipient, please note that any review, disclosure, copying,
          distribution, or taking of any action in reliance on the contents of
          this communication is strictly prohibited. If you have received this
          transmission in error, please immediately notify the sender by reply
          email and permanently delete all copies.
        </Text>

        {/* Legal Links (Terms & Privacy) */}
        <div style={legalLinksRow}>
          <Link href={`${websiteUrl}/terms`} style={legalLink}>
            Terms of Service
          </Link>
          <span style={legalDividerDot}>•</span>
          <Link href={`${websiteUrl}/privacy`} style={legalLink}>
            Privacy Policy
          </Link>
        </div>

        {/* Copyright */}
        <Text style={copyrightText}>
          Copyright © {currentYear} {APP_INFO.name}. All rights reserved.
        </Text>
      </Section>
    </Section>
  )
}

export default EmailSignature

/* ============================================================
   STYLES — Solid Fallbacks for 100% Email Client Support
   ============================================================ */

const cardContainer: React.CSSProperties = {
  width: "100%",
  maxWidth: "600px",
  margin: "24px auto 0",
  border: "1px solid #E7DCD7",
  backgroundColor: "#FFFFFF",
  borderRadius: "14px",
  overflow: "hidden",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
}

const brandHeaderSection: React.CSSProperties = {
  padding: "24px 28px 16px",
  textAlign: "center",
  backgroundColor: "#FFFFFF",
}

const logoImage: React.CSSProperties = {
  display: "block",
  margin: "0 auto 8px auto",
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

const bodySection: React.CSSProperties = {
  padding: "20px 24px 18px",
  backgroundColor: "#FFFFFF",
}

const columnHeading: React.CSSProperties = {
  margin: "0 0 12px 0",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  lineHeight: "18px",
  fontWeight: "700",
  color: "#5A0816",
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
  paddingLeft: "2px",
}

const contactLink: React.CSSProperties = {
  display: "inline-block",
  fontSize: "11.5px",
  lineHeight: "18px",
  color: "#24141A",
  textDecoration: "none",
  fontWeight: "500",
}

const contactLinkRose: React.CSSProperties = {
  display: "inline-block",
  fontSize: "11.5px",
  lineHeight: "18px",
  color: "#CA617D",
  textDecoration: "none",
  fontWeight: "600",
}

const contactLinkGold: React.CSSProperties = {
  display: "inline-block",
  fontSize: "11.5px",
  lineHeight: "18px",
  color: "#D3A753",
  textDecoration: "none",
  fontWeight: "700",
}

const companyTitle: React.CSSProperties = {
  margin: "0 0 14px 0",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  lineHeight: "18px",
  fontWeight: "700",
  color: "#5A0816",
}

const companyDescription: React.CSSProperties = {
  margin: "0 0 10px 0",
  fontSize: "10px",
  lineHeight: "15px",
  color: "#6D5C61",
}

const featureItem: React.CSSProperties = {
  margin: "0 0 5px 0",
  fontSize: "10px",
  lineHeight: "14px",
  color: "#4A3C41",
  fontWeight: "500",
}

const goldDot: React.CSSProperties = {
  color: "#D3A753",
  marginRight: "6px",
  fontSize: "8px",
}

const pinkDot: React.CSSProperties = {
  color: "#CA617D",
  marginRight: "6px",
  fontSize: "8px",
}

const socialSection: React.CSSProperties = {
  padding: "12px 28px",
  borderTop: "1px solid #E8DDD6",
  borderBottom: "1px solid #E8DDD6",
  backgroundColor: "#FFFFFF",
}

const socialHeaderLabel: React.CSSProperties = {
  margin: 0,
  fontSize: "9px",
  lineHeight: "16px",
  fontWeight: "700",
  letterSpacing: "1.5px",
  color: "#5A0816",
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
  padding: "16px 24px 20px",
  textAlign: "center",
  borderTop: "1px solid #EAE0DA",
  backgroundColor: "#FFFFFF",
}

const confidentialityNoticeText: React.CSSProperties = {
  margin: "0 0 10px 0",
  fontSize: "9px",
  lineHeight: "14px",
  color: "#8C7A80",
  textAlign: "justify",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

const legalLinksRow: React.CSSProperties = {
  margin: "8px 0 6px 0",
  fontSize: "10.5px",
  lineHeight: "14px",
  textAlign: "center",
}

const legalLink: React.CSSProperties = {
  color: "#5A0816",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "10.5px",
}

const legalDividerDot: React.CSSProperties = {
  padding: "0 8px",
  color: "#D3A753",
  fontSize: "10px",
}

const copyrightText: React.CSSProperties = {
  margin: "6px 0 0 0",
  fontSize: "10px",
  lineHeight: "14px",
  color: "#9A8D92",
  textAlign: "center",
  fontWeight: "500",
}
