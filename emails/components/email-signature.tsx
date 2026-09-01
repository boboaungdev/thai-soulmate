import * as React from "react"
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Img,
  Text,
  Link,
  Hr,
} from "react-email"

import { CONTACT } from "@/constants"

type EmailSignatureProps = {
  name?: string
  role?: string
  email?: string
  phone?: string
}

export default function EmailSignature({
  name = "Thai Soulmate",
  role = "1-2-1 Matchmaking Service",
  email = CONTACT.email,
  phone = CONTACT.primaryPhone,
}: EmailSignatureProps) {
  const website = CONTACT.website.replace(/^https?:\/\//, "")

  const whatsappNumber = phone.replace(/[^0-9]/g, "")
  const whatsappUrl = `https://wa.me/${whatsappNumber}`
  const websiteUrl = `https://${website}`
  const emailUrl = `mailto:${email}`
  const phoneUrl = `tel:${phone.replace(/[^\d+]/g, "")}`

  return (
    <Html>
      <Head />

      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <Container
          style={{
            width: "100%",
            maxWidth: "700px",
            margin: "0 auto",
            padding: "20px 0",
          }}
        >
          <Section
            style={{
              width: "100%",
              backgroundColor: "#FBF8F3",
              border: "1px solid #E8DDD6",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            {/* TOP BRAND BAR */}

            <Section
              style={{
                height: "5px",
                background:
                  "linear-gradient(90deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
              }}
            />

            {/* MAIN CONTENT */}

            <Section
              style={{
                padding: "24px 26px 20px 26px",
              }}
            >
              <Row>
                {/* LOGO */}

                <Column
                  width="100"
                  valign="top"
                  style={{
                    width: "100px",
                    paddingRight: "22px",
                    verticalAlign: "top",
                  }}
                >
                  <Img
                    src="https://thaisoulmate.org/logo.png"
                    alt="Thai Soulmate"
                    width="82"
                    height="82"
                    style={{
                      display: "block",
                      width: "82px",
                      height: "82px",
                      objectFit: "contain",
                    }}
                  />
                </Column>

                {/* BRAND / PERSON */}

                <Column
                  valign="top"
                  style={{
                    verticalAlign: "top",
                    paddingRight: "24px",
                  }}
                >
                  <Text
                    style={{
                      margin: 0,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "23px",
                      lineHeight: "28px",
                      fontWeight: "700",
                      color: "#5A0816",
                    }}
                  >
                    {name}
                  </Text>

                  <Text
                    style={{
                      margin: "5px 0 0 0",
                      fontSize: "10px",
                      lineHeight: "14px",
                      fontWeight: "700",
                      letterSpacing: "1.6px",
                      color: "#CA617D",
                    }}
                  >
                    {role.toUpperCase()}
                  </Text>

                  <Hr
                    style={{
                      width: "125px",
                      margin: "11px 0 11px 0",
                      border: 0,
                      borderTop: "2px solid #D3A753",
                    }}
                  />

                  <Text
                    style={{
                      margin: 0,
                      fontSize: "10px",
                      lineHeight: "15px",
                      color: "#6D5A60",
                    }}
                  >
                    Personal matchmaking for meaningful
                    <br />
                    relationships in Thailand.
                  </Text>

                  <Text
                    style={{
                      margin: "7px 0 0 0",
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "11px",
                      lineHeight: "16px",
                      fontStyle: "italic",
                      color: "#8A6571",
                    }}
                  >
                    Real People. Real Relationships.
                  </Text>

                  <Text
                    style={{
                      margin: "2px 0 0 0",
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "11px",
                      lineHeight: "16px",
                      fontStyle: "italic",
                      color: "#A06A7B",
                    }}
                  >
                    Personally Matched in Thailand.
                  </Text>
                </Column>

                {/* CONTACT */}

                <Column
                  valign="top"
                  style={{
                    width: "205px",
                    verticalAlign: "top",
                    borderLeft: "1px solid #E3D6D0",
                    paddingLeft: "22px",
                  }}
                >
                  <Text
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "8px",
                      lineHeight: "11px",
                      fontWeight: "700",
                      letterSpacing: "1.3px",
                      color: "#A07A3D",
                    }}
                  >
                    CONTACT
                  </Text>

                  <Text
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "11px",
                      lineHeight: "16px",
                    }}
                  >
                    <span
                      style={{
                        color: "#25D366",
                        fontWeight: "700",
                      }}
                    >
                      WhatsApp
                    </span>
                    <br />

                    <Link
                      href={whatsappUrl}
                      style={{
                        color: "#493B40",
                        textDecoration: "none",
                      }}
                    >
                      {phone}
                    </Link>
                  </Text>

                  <Text
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "11px",
                      lineHeight: "16px",
                    }}
                  >
                    <span
                      style={{
                        color: "#B78D46",
                        fontWeight: "700",
                      }}
                    >
                      Direct Phone
                    </span>
                    <br />

                    <Link
                      href={phoneUrl}
                      style={{
                        color: "#493B40",
                        textDecoration: "none",
                      }}
                    >
                      {phone}
                    </Link>
                  </Text>

                  <Text
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "11px",
                      lineHeight: "16px",
                    }}
                  >
                    <span
                      style={{
                        color: "#CA617D",
                        fontWeight: "700",
                      }}
                    >
                      Email
                    </span>
                    <br />

                    <Link
                      href={emailUrl}
                      style={{
                        color: "#493B40",
                        textDecoration: "none",
                      }}
                    >
                      {email}
                    </Link>
                  </Text>

                  <Text
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      lineHeight: "16px",
                    }}
                  >
                    <span
                      style={{
                        color: "#9A7541",
                        fontWeight: "700",
                      }}
                    >
                      Website
                    </span>
                    <br />

                    <Link
                      href={websiteUrl}
                      style={{
                        color: "#493B40",
                        textDecoration: "none",
                        fontWeight: "600",
                      }}
                    >
                      {website}
                    </Link>
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* DIVIDER */}

            <Section
              style={{
                padding: "0 26px",
              }}
            >
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(90deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
                }}
              />
            </Section>

            {/* SERVICES */}

            <Section
              style={{
                padding: "16px 26px 14px 26px",
              }}
            >
              <Row>
                <Column
                  width="25%"
                  style={{
                    paddingRight: "10px",
                  }}
                >
                  <Text
                    style={{
                      margin: 0,
                      fontSize: "8px",
                      lineHeight: "12px",
                      fontWeight: "700",
                      letterSpacing: "1px",
                      color: "#A07A3D",
                    }}
                  >
                    PERSONAL
                  </Text>

                  <Text
                    style={{
                      margin: "3px 0 0 0",
                      fontSize: "9px",
                      lineHeight: "13px",
                      color: "#75676B",
                    }}
                  >
                    One-to-one matching
                  </Text>
                </Column>

                <Column
                  width="25%"
                  style={{
                    paddingRight: "10px",
                  }}
                >
                  <Text
                    style={{
                      margin: 0,
                      fontSize: "8px",
                      lineHeight: "12px",
                      fontWeight: "700",
                      letterSpacing: "1px",
                      color: "#CA617D",
                    }}
                  >
                    PRIVATE
                  </Text>

                  <Text
                    style={{
                      margin: "3px 0 0 0",
                      fontSize: "9px",
                      lineHeight: "13px",
                      color: "#75676B",
                    }}
                  >
                    Confidential service
                  </Text>
                </Column>

                <Column
                  width="25%"
                  style={{
                    paddingRight: "10px",
                  }}
                >
                  <Text
                    style={{
                      margin: 0,
                      fontSize: "8px",
                      lineHeight: "12px",
                      fontWeight: "700",
                      letterSpacing: "1px",
                      color: "#B78D46",
                    }}
                  >
                    VERIFIED
                  </Text>

                  <Text
                    style={{
                      margin: "3px 0 0 0",
                      fontSize: "9px",
                      lineHeight: "13px",
                      color: "#75676B",
                    }}
                  >
                    Real people
                  </Text>
                </Column>

                <Column width="25%">
                  <Text
                    style={{
                      margin: 0,
                      fontSize: "8px",
                      lineHeight: "12px",
                      fontWeight: "700",
                      letterSpacing: "1px",
                      color: "#CA617D",
                    }}
                  >
                    THAILAND
                  </Text>

                  <Text
                    style={{
                      margin: "3px 0 0 0",
                      fontSize: "9px",
                      lineHeight: "13px",
                      color: "#75676B",
                    }}
                  >
                    Local matchmaking
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* FOOTER */}

            <Section
              style={{
                backgroundColor: "#5A0816",
                padding: "11px 26px",
              }}
            >
              <Row>
                <Column
                  valign="middle"
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  <Text
                    style={{
                      margin: 0,
                      fontSize: "8px",
                      lineHeight: "12px",
                      fontWeight: "700",
                      letterSpacing: "1.1px",
                      color: "#E7D1A0",
                    }}
                  >
                    EXCLUSIVE
                    <span
                      style={{
                        padding: "0 7px",
                        color: "#B98A91",
                      }}
                    >
                      •
                    </span>
                    PERSONAL
                    <span
                      style={{
                        padding: "0 7px",
                        color: "#B98A91",
                      }}
                    >
                      •
                    </span>
                    PROFESSIONAL
                  </Text>
                </Column>

                <Column
                  align="right"
                  valign="middle"
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  <Link
                    href={websiteUrl}
                    style={{
                      fontSize: "9px",
                      lineHeight: "12px",
                      color: "#F0DCE0",
                      textDecoration: "none",
                      fontWeight: "600",
                    }}
                  >
                    {website}
                  </Link>
                </Column>
              </Row>
            </Section>
          </Section>

          {/* LEGAL / BRAND NOTE */}

          <Text
            style={{
              margin: "10px 5px 0 5px",
              fontSize: "8px",
              lineHeight: "12px",
              color: "#A79A9D",
            }}
          >
            Thai Soulmate Co., Ltd. · Personal matchmaking service in Thailand.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
