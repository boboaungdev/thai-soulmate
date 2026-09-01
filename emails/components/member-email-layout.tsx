import * as React from "react"
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "react-email"
import { Heart } from "lucide-react"

import { APP_INFO } from "@/constants"
import { env } from "@/lib/env"
import EmailSignature, { EmailSignatureProps } from "./email-signature"

export interface MemberEmailLayoutProps {
  previewText: string
  signatureProps?: EmailSignatureProps
  children: React.ReactNode
}

export function MemberEmailLayout({
  previewText,
  signatureProps,
  children,
}: MemberEmailLayoutProps) {
  const baseUrl = env.BASE_URL || "https://thaisoulmate.org"
  const logoUrl = `${baseUrl}/logo.png`

  return (
    <Html>
      <Head />

      <Body style={main}>
        <Preview>{previewText}</Preview>
        <Container style={wrapper}>
          {/* ── TOP LUXURY GRADIENT BAR ── */}
          <div style={topBar} />

          {/* ── MASTER BRAND HEADER (Matching Business Card 6 & Signature) ── */}
          <Section style={headerSection}>
            <Row>
              <Column align="center" style={{ textAlign: "center" }}>
                {/* 1. Logo Image */}
                <Img
                  src={logoUrl}
                  alt={APP_INFO.name}
                  width="52"
                  height="52"
                  style={logoImg}
                />

                {/* 2. Brand Name SVG Gradient Wordmark */}
                <div style={{ textAlign: "center", margin: "4px auto 0 auto" }}>
                  <svg
                    width="260"
                    height="36"
                    viewBox="0 0 260 36"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label={APP_INFO.name}
                    style={{
                      display: "block",
                      margin: "0 auto",
                      maxWidth: "100%",
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="memberHeaderBrandGradient"
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
                      y="26"
                      textAnchor="middle"
                      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                      fontSize="22"
                      fontWeight="700"
                      letterSpacing="1"
                      fill="url(#memberHeaderBrandGradient)"
                    >
                      {APP_INFO.name}
                    </text>
                  </svg>
                </div>

                {/* 3. Exclusive Subtitle Badge */}
                <Text style={exclusiveText}>EXCLUSIVE</Text>

                {/* 4. Tagline / Service Subtitle */}
                <Text style={serviceSubtitleText}>{APP_INFO.tagline}</Text>

                {/* 5. Decorative Fading Gold Heart Divider */}
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

                {/* 6. Secondary Tagline */}
                <Text style={taglineText}>
                  {APP_INFO.secondaryTagline.replace("\n", " ")}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* ── MIDDLE GRADIENT SEPARATOR ── */}
          <div style={middleGradientLine} />

          {/* ── EMAIL BODY CONTENT ── */}
          <Section style={contentSection}>{children}</Section>

          {/* ── SIGNATURE CARD ── */}
          <Section style={signatureSection}>
            <EmailSignature
              name={APP_INFO.name}
              role="1-2-1 Matchmaking Service"
              {...signatureProps}
            />
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default MemberEmailLayout

/* ═══════════════════════════════════════════════════════
   STYLES — Exact Match to Business Card 6 & Signature Master
═══════════════════════════════════════════════════════ */

const main: React.CSSProperties = {
  backgroundColor: "#F5F0EC",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "36px 16px",
  margin: "0",
}

const wrapper: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  margin: "0 auto",
  borderRadius: "16px",
  maxWidth: "600px",
  border: "1px solid #E8DDD7",
  boxShadow: "0 6px 24px rgba(90, 8, 22, 0.06)",
  overflow: "hidden",
}

const topBar: React.CSSProperties = {
  height: "5px",
  background: "linear-gradient(90deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
}

const headerSection: React.CSSProperties = {
  backgroundColor: "#FBF8F3",
  padding: "26px 32px 20px",
  textAlign: "center",
}

const logoImg: React.CSSProperties = {
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
  textTransform: "uppercase" as const,
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
  textTransform: "uppercase" as const,
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
  verticalAlign: "middle" as const,
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

const contentSection: React.CSSProperties = {
  padding: "32px 36px 20px",
  backgroundColor: "#FFFFFF",
}

const signatureSection: React.CSSProperties = {
  padding: "0",
  margin: "0",
}
