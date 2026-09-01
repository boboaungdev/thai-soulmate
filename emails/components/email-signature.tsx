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
  const baseUrl = env.BASE_URL?.replace(/\/+$/, "") || "https://thaisoulmate.org"
  const logoUrl = `${baseUrl}/logo.png`
  const wordmarkUrl = `${baseUrl}/email/brand-wordmark.png`
  const topGradientUrl = `${baseUrl}/email/gradient-bar-top.png`
  const heartDividerUrl = `${baseUrl}/email/heart-divider.png`
  const middleGradientUrl = `${baseUrl}/email/middle-gradient-line.png`
  const bottomBannerUrl = `${baseUrl}/email/bottom-gradient-banner.png`

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

            {/* Email (Clean neutral text label, colored icon) */}
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

            {/* Website (Clean neutral text label, colored icon) */}
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
   STYLES — Clean White Background & Cross-Client Compatibility
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
