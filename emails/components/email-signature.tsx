import * as React from "react"
import { Section, Row, Column, Img, Text, Link } from "react-email"
import { Globe, Mail, Phone, Heart } from "lucide-react"
import {
  FaFacebook,
  FaInstagram,
  FaLine,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa"

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
   BRAND NAME WITH BULLETPROOF CROSS-CLIENT GRADIENT
   SVG linearGradient + CSS WebKit fallback + solid color fallback
   ============================================================ */
function BrandNameGradient({ name = APP_INFO.name }: { name?: string }) {
  return (
    <div style={{ textAlign: "center", margin: "0 auto" }}>
      {/* SVG Gradient Wordmark — universally supported in Gmail, Apple Mail, Webmail */}
      <svg
        width="260"
        height="38"
        viewBox="0 0 260 38"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={name}
        style={{
          display: "block",
          margin: "0 auto",
          maxWidth: "100%",
        }}
      >
        <defs>
          <linearGradient
            id="brandLogoGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#D3A753" />
            <stop offset="50%" stopColor="#E791A7" />
            <stop offset="100%" stopColor="#CA617D" />
          </linearGradient>
        </defs>

        <text
          x="130"
          y="27"
          textAnchor="middle"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
          fontSize="22"
          fontWeight="700"
          letterSpacing="1"
          fill="url(#brandLogoGradient)"
        >
          {name}
        </text>
      </svg>
    </div>
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
      {/* ======================================================
          TOP LUXURY GRADIENT BORDER (Gold -> Blush -> Rose)
      ====================================================== */}
      <Section style={topGradientBar} />

      {/* ======================================================
          BRAND HEADER SECTION
      ====================================================== */}
      <Section style={brandHeaderSection}>
        <Row>
          <Column align="center">
            {/* Logo Image */}
            <Img
              src={logoUrl}
              alt={APP_INFO.name}
              width="54"
              height="54"
              style={logoImage}
            />

            {/* Gradient Brand Name Wordmark */}
            <BrandNameGradient name={name} />

            {/* Exclusive Badge Subtitle */}
            <Text style={exclusiveText}>EXCLUSIVE</Text>

            {/* Service Subtitle */}
            <Text style={serviceSubtitleText}>{role}</Text>

            {/* Decorative Fading Gold Heart Divider (Business Card 6) */}
            <div style={heartDividerContainer}>
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{ margin: "0 auto", borderCollapse: "collapse" }}
              >
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: "middle", padding: 0 }}>
                      <div style={dividerLineLeft} />
                    </td>
                    <td style={dividerHeartCell}>
                      <Heart
                        size={13}
                        color="#D3A753"
                        fill="#D3A753"
                        strokeWidth={1.5}
                        style={{
                          display: "block",
                          margin: "0 auto",
                        }}
                      />
                    </td>
                    <td style={{ verticalAlign: "middle", padding: 0 }}>
                      <div style={dividerLineRight} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tagline */}
            <Text style={taglineText}>
              Real People. Real Relationships. Personally Matched in Thailand.
            </Text>
          </Column>
        </Row>
      </Section>

      {/* ======================================================
          MIDDLE GRADIENT SEPARATOR
      ====================================================== */}
      <Section style={{ padding: "0 28px" }}>
        <div style={middleGradientLine} />
      </Section>

      {/* ======================================================
          MAIN 2-COLUMN BODY SECTION (Strict Left & Right Side-by-Side)
      ====================================================== */}
      <Section style={bodySection}>
        <Row>
          {/* ----------------------------------------------------
              LEFT COLUMN — CONNECT & CONTACT DETAILS
          ---------------------------------------------------- */}
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
                <FaWhatsapp size={14} color="#25D366" />
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
                <Phone size={13} color="#1877F2" />
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
                  <Phone size={13} color="#1877F2" />
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
                <Mail size={13} color="#CA617D" />
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
                <Globe size={13} color="#D3A753" />
              </Column>
              <Column style={contactContentCell}>
                <Link href={websiteUrl} style={contactLinkGold}>
                  {cleanWebsite}
                </Link>
              </Column>
            </Row>
          </Column>

          {/* ----------------------------------------------------
              RIGHT COLUMN — EXCLUSIVE MATCHMAKING & HIGHLIGHTS
          ---------------------------------------------------- */}
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

      {/* ======================================================
          SOCIAL MEDIA BAR (Business Card 6 Exact Style)
      ====================================================== */}
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
                      <FaFacebook size={15} color="#1877F2" />
                    </Link>
                  </td>
                  <td style={socialIconCell}>
                    <Link href={instagram} style={socialIconLink}>
                      <FaInstagram size={15} color="#E4405F" />
                    </Link>
                  </td>
                  <td style={line ? socialIconCell : socialIconCellLast}>
                    <Link href={tiktok} style={socialIconLink}>
                      <FaTiktok size={14} color="#000000" />
                    </Link>
                  </td>
                  {line && (
                    <td style={socialIconCellLast}>
                      <Link href={line} style={socialIconLink}>
                        <FaLine size={15} color="#00C300" />
                      </Link>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </Column>
        </Row>
      </Section>

      {/* ======================================================
          BOTTOM GRADIENT FOOTER BANNER
      ====================================================== */}
      <Section style={bottomGradientBanner}>
        <Text style={bannerText}>
          EXCLUSIVE
          <span style={bannerDot}>•</span>
          PERSONAL
          <span style={bannerDot}>•</span>
          CONFIDENTIAL
        </Text>
      </Section>

      {/* ======================================================
          LEGAL & CONFIDENTIALITY FOOTER
      ====================================================== */}
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
   EXACT STYLES MATCHING BUSINESS CARD 6 & LEAFLET 9
   ============================================================ */

const cardContainer: React.CSSProperties = {
  width: "100%",
  maxWidth: "600px",
  margin: "24px auto 0",
  border: "1px solid #E7DCD7",
  backgroundColor: "#FBF8F3",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 6px 20px rgba(90, 8, 22, 0.07)",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
}

const topGradientBar: React.CSSProperties = {
  height: "5px",
  background: "linear-gradient(90deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
  fontSize: "0px",
  lineHeight: "0px",
}

const brandHeaderSection: React.CSSProperties = {
  padding: "24px 28px 16px",
  textAlign: "center",
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

const heartDividerContainer: React.CSSProperties = {
  margin: "8px auto 6px auto",
  textAlign: "center",
  lineHeight: "1",
}

const dividerLineLeft: React.CSSProperties = {
  display: "block",
  height: "1px",
  maxHeight: "1px",
  width: "36px",
  background:
    "linear-gradient(to left, #D3A753 0%, #E791A7 55%, transparent 100%)",
  fontSize: "0px",
  lineHeight: "0px",
}

const dividerLineRight: React.CSSProperties = {
  display: "block",
  height: "1px",
  maxHeight: "1px",
  width: "36px",
  background:
    "linear-gradient(to right, #D3A753 0%, #E791A7 55%, transparent 100%)",
  fontSize: "0px",
  lineHeight: "0px",
}

const dividerHeartCell: React.CSSProperties = {
  padding: "0 8px",
  lineHeight: "1",
  textAlign: "center",
  verticalAlign: "middle",
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

const middleGradientLine: React.CSSProperties = {
  height: "1px",
  background: "linear-gradient(90deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
}

const bodySection: React.CSSProperties = {
  padding: "20px 24px 18px",
}

const leftResponsiveColumn: React.CSSProperties = {
  display: "inline-block",
  width: "100%",
  maxWidth: "265px",
  verticalAlign: "top",
  textAlign: "left",
  boxSizing: "border-box",
  paddingRight: "10px",
  marginBottom: "12px",
}

const rightResponsiveColumn: React.CSSProperties = {
  display: "inline-block",
  width: "100%",
  maxWidth: "265px",
  verticalAlign: "top",
  textAlign: "left",
  boxSizing: "border-box",
  paddingLeft: "10px",
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
  backgroundColor: "#FFFDFC",
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

const bottomGradientBanner: React.CSSProperties = {
  background: "linear-gradient(90deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
  padding: "10px 24px",
  textAlign: "center",
}

const bannerText: React.CSSProperties = {
  margin: 0,
  fontSize: "9px",
  lineHeight: "12px",
  fontWeight: "700",
  letterSpacing: "2.5px",
  color: "#FFFFFF",
  textAlign: "center",
  textTransform: "uppercase",
}

const bannerDot: React.CSSProperties = {
  padding: "0 8px",
  color: "rgba(255, 255, 255, 0.75)",
}

const legalFooterSection: React.CSSProperties = {
  padding: "16px 24px 20px",
  textAlign: "center",
  borderTop: "1px solid #EAE0DA",
  backgroundColor: "#FAF7F2",
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
