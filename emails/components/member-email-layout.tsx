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
  const wordmarkUrl = `${baseUrl}/email/brand-wordmark.png`
  const topGradientUrl = `${baseUrl}/email/gradient-bar-top.png`
  const heartDividerUrl = `${baseUrl}/email/heart-divider.png`
  const middleGradientUrl = `${baseUrl}/email/middle-gradient-line.png`

  return (
    <Html>
      <Head />

      <Body style={main}>
        <Preview>{previewText}</Preview>
        <Container style={wrapper}>
          {/* ── TOP LUXURY GRADIENT BAR ── */}
          <div style={{ backgroundColor: "#D3A753", lineHeight: 0, fontSize: 0 }}>
            <Img
              src={topGradientUrl}
              alt=""
              width="600"
              height="5"
              style={{ display: "block", width: "100%", height: "5px", border: 0 }}
            />
          </div>

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

                {/* 2. Universally-Supported Brand Wordmark Image */}
                <div style={{ textAlign: "center", margin: "4px auto" }}>
                  <Img
                    src={wordmarkUrl}
                    alt={APP_INFO.name}
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

                {/* 3. Exclusive Subtitle Badge */}
                <Text style={exclusiveText}>EXCLUSIVE</Text>

                {/* 4. Tagline / Service Subtitle */}
                <Text style={serviceSubtitleText}>
                  {APP_INFO.tagline}
                </Text>

                {/* 5. Decorative Fading Gold Heart Divider Image */}
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

                {/* 6. Secondary Tagline */}
                <Text style={taglineText}>
                  {APP_INFO.secondaryTagline.replace("\n", " ")}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* ── MIDDLE GRADIENT SEPARATOR ── */}
          <div style={{ padding: "0 28px" }}>
            <Img
              src={middleGradientUrl}
              alt=""
              width="544"
              height="1"
              style={{ display: "block", width: "100%", height: "1px", border: 0 }}
            />
          </div>

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
  overflow: "hidden",
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

const taglineText: React.CSSProperties = {
  margin: "4px 0 0 0",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "11.5px",
  lineHeight: "17px",
  fontStyle: "italic",
  color: "#5A0816",
  textAlign: "center",
}

const contentSection: React.CSSProperties = {
  padding: "32px 36px 20px",
  backgroundColor: "#FFFFFF",
}

const signatureSection: React.CSSProperties = {
  padding: "0",
  margin: "0",
}
