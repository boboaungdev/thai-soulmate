"use client"

import Image from "next/image"
import { useEffect } from "react"
import { Globe, Mail, Phone } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import type { IconType } from "react-icons"
import {
  FaFacebookF,
  FaInstagram,
  FaLine,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa"

import { APP_INFO, CONTACT } from "@/constants"

const socialLinks = [
  { label: "Facebook", value: "@thaisoulmates", icon: FaFacebookF },
  { label: "Instagram", value: "@thaisoulmate", icon: FaInstagram },
  { label: "TikTok", value: "@thaisoulmate", icon: FaTiktok },
  { label: "Line", value: "@thaisoulmate", icon: FaLine },
]

function PrintTrigger() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("print") !== "true")
      return
    const title = document.title
    document.title = "thai-soulmate-marketing-a5"
    window.print()
    document.title = title
  }, [])
  return null
}

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="brand-mark">
      <Image
        src="/logo.png"
        alt=""
        width={76}
        height={76}
        className="brand-mark__logo"
      />
      <div className="brand-mark__details">
        <svg
          aria-label={APP_INFO.name}
          className="brand-mark__name"
          role="img"
          viewBox="0 0 180 28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="marketing-brand-gradient"
              x1="0"
              x2="1"
              y1="0"
              y2="0"
            >
              <stop offset="0" stopColor="#f2b854" />
              <stop offset="1" stopColor="#f07797" />
            </linearGradient>
          </defs>
          <text
            x="90"
            y="21"
            fill="url(#marketing-brand-gradient)"
            fontFamily="sans-serif"
            fontSize="20"
            fontWeight="700"
            textAnchor="middle"
          >
            {APP_INFO.name}
          </text>
        </svg>
        <p
          className={
            inverse
              ? "brand-mark__tag brand-mark__tag--light"
              : "brand-mark__tag"
          }
        >
          {APP_INFO.tagline}
        </p>
      </div>
    </div>
  )
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: IconType | typeof Phone
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="contact-row">
      <span className="contact-row__icon">
        <Icon size={16} strokeWidth={2.2} />
      </span>
      <span className="contact-row__label">{label}</span>
      <span className="contact-row__value">{children}</span>
    </div>
  )
}

export default function BusinessMarketingPrintPage() {
  return (
    <>
      <PrintTrigger />
      <style jsx global>{`
        :root {
          --ink: #241e2a;
          --gold: #cfa14f;
          --rose: #cb5d7a;
          --paper: #fffaf7;
        }
        body {
          background: #ded5d2;
        }
        .marketing-preview {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 28px;
          padding: 36px;
          color: var(--ink);
          font-family: Arial, sans-serif;
        }
        .marketing-page {
          position: relative;
          width: 148mm;
          height: 210mm;
          overflow: hidden;
          box-shadow: 0 18px 45px rgb(36 30 42 / 22%);
        }
        .marketing-page__front {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 15mm 14mm 13mm;
          color: white;
          background:
            linear-gradient(180deg, rgb(22 42 54 / 22%), rgb(28 20 32 / 82%)),
            url("/home-landing.png") center / cover;
        }
        .marketing-page__front .brand-mark {
          align-items: center;
        }
        .marketing-page__front .brand-mark__tag {
          margin-top: 0;
        }
        .marketing-page__front .brand-mark__details {
          align-self: center;
          justify-content: center;
          line-height: 1;
        }
        .marketing-page__front::before {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            130deg,
            transparent 36%,
            rgb(203 93 122 / 36%) 100%
          );
          content: "";
        }
        .brand-mark,
        .front-content,
        .front-footer,
        .back-inner {
          position: relative;
          z-index: 1;
        }
        .brand-mark {
          display: flex;
          align-items: center;
          gap: 5mm;
        }

        .brand-mark__logo {
          width: 23mm;
          height: 23mm;
          object-fit: contain;
        }
        .brand-mark__name {
          display: block;
          width: 46mm;
          height: 7mm;
        }

        .brand-mark__details {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          line-height: 1;
          text-align: center;
        }

        .brand-mark__name {
          display: block;
          width: 57mm;
          height: 9mm;
          margin: 0 auto;
        }

        .brand-mark__tag {
          margin: 1.5mm 0 0;
          color: rgb(255 255 255 / 74%);
          font-family: Arial, sans-serif;
          font-size: 3.7mm;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: none;
          text-align: center;
        }

        .brand-mark__tag--light {
          color: rgb(255 255 255 / 78%);
        }
        .front-content {
          max-width: 110mm;
          margin-top: auto;
          margin-bottom: auto;
        }
        .front-content__eyebrow {
          display: flex;
          align-items: center;
          gap: 3mm;
          margin: 0 0 7mm;
          color: #f4d38a;
          font-size: 2.7mm;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .front-content__eyebrow::before {
          width: 13mm;
          height: 1px;
          background: var(--gold);
          content: "";
        }
        .front-content h1 {
          max-width: 105mm;
          margin: 0;
          font-family: Georgia, serif;
          font-size: 18mm;
          font-weight: 400;
          line-height: 0.91;
          letter-spacing: -0.03em;
        }
        .front-content__secondary {
          max-width: 83mm;
          margin: 8mm 0 0;
          white-space: pre-line;
          color: rgb(255 255 255 / 80%);
          font-size: 3.6mm;
          font-weight: 600;
          line-height: 1.45;
        }
        .front-footer,
        .back-bottom {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 8mm;
        }
        .front-footer {
          border-top: 1px solid rgb(255 255 255 / 35%);
          padding-top: 4mm;
        }
        .front-footer__url {
          margin: 0;
          color: white;
          font-size: 2.8mm;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .marketing-page__back {
          padding: 0;
          background: #e8c5ca;
        }
        .back-inner {
          display: flex;
          height: 100%;
          flex-direction: column;
          justify-content: space-between;
          padding: 15mm 14mm 13mm;
          border: 0;
          background: var(--paper);
        }
        .marketing-page__back .brand-mark__name {
          width: 57mm;
          height: 9mm;
        }
        .marketing-page__front .brand-mark {
          align-items: center;
        }
        .marketing-page__front .brand-mark__name,
        .marketing-page__front .brand-mark__tag {
          color: white;
        }
        .marketing-page__back .brand-mark__tag {
          margin-top: 0;
          text-transform: none;
        }
        .marketing-page__back .brand-mark__tag {
          color: #867079;
          font-size: 3.7mm;
        }
        .marketing-page__back .contact-row__icon {
          background: transparent;
          color: var(--rose);
        }
        .back-heading h2 {
          max-width: 95mm;
          margin: 12mm 0 0;
          color: var(--ink);
          font-family: Georgia, serif;
          font-size: 10.5mm;
          font-weight: 400;
          line-height: 0.97;
        }
        .back-heading p {
          margin: 4mm 0 0;
          color: var(--rose);
          font-size: 2.7mm;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .contact-list {
          display: grid;
          gap: 2.8mm;
          margin: 8mm 0 6mm;
        }
        .contact-row {
          display: grid;
          grid-template-columns: 8mm 24mm 1fr;
          align-items: center;
          gap: 2mm;
          min-height: 8mm;
          border-bottom: 1px solid rgb(36 30 42 / 15%);
          padding-bottom: 2mm;
        }
        .contact-row__icon {
          display: grid;
          width: 7mm;
          height: 7mm;
          place-items: center;
          border-radius: 50%;
          background: var(--ink);
          color: #f4d38a;
        }
        .contact-row__label {
          color: #987d86;
          font-size: 2.35mm;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .contact-row__value {
          color: var(--ink);
          font-size: 2.8mm;
          font-weight: 700;
          text-align: right;
        }
        .back-bottom {
          border-top: 1px solid rgb(36 30 42 / 15%);
          padding-top: 5mm;
        }
        .social-list {
          display: grid;
          gap: 2.3mm;
        }
        .social-list__item {
          display: flex;
          align-items: center;
          gap: 2mm;
          color: var(--ink);
          font-size: 2.5mm;
          font-weight: 700;
        }
        .social-list__item svg {
          color: var(--rose);
        }
        .qr-block {
          display: grid;
          flex: 0 0 31mm;
          gap: 2mm;
          justify-items: center;
          color: var(--ink);
          font-size: 2.25mm;
          font-weight: 800;
          text-align: center;
          text-transform: uppercase;
        }
        .qr-block__code {
          position: relative;
          padding: 2mm;
          border: 1px solid rgb(36 30 42 / 18%);
          background: white;
        }
        .qr-block__code svg {
          display: block;
          width: 26mm;
          height: 26mm;
        }
        .qr-block__whatsapp {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          width: 5.5mm;
          height: 5.5mm;
          place-items: center;
          border: 1px solid white;
          background: white;
          color: #25d366;
          transform: translate(-50%, -50%);
        }
        .qr-block__whatsapp svg {
          display: block;
          width: 4mm;
          height: 4mm;
        }
        @media print {
          @page {
            size: A5 portrait;
            margin: 0;
          }
          html,
          body {
            width: 148mm;
            height: 210mm;
            margin: 0;
            background: white;
          }
          .marketing-preview {
            display: block;
            padding: 0;
          }
          .marketing-page {
            width: 148mm;
            height: 210mm;
            margin: 0;
            box-shadow: none;
            break-after: page;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .marketing-page:last-child {
            break-after: auto;
          }
        }
      `}</style>
      <main
        id="printable-area"
        className="marketing-preview marketing-document"
      >
        <section
          className="marketing-page marketing-page__front"
          aria-label="Front of Thai Soulmate marketing card"
        >
          <BrandMark />
          <div className="front-content">
            <p className="front-content__eyebrow">
              Meaningful connections, personally matched
            </p>
            <h1>Meet someone who is truly right for you.</h1>
            <p className="front-content__secondary">
              {APP_INFO.secondaryTagline}
            </p>
          </div>
          <footer className="front-footer">
            <p className="front-footer__url">thaisoulmate.org</p>
          </footer>
        </section>
        <section
          className="marketing-page marketing-page__back"
          aria-label="Back of Thai Soulmate marketing card"
        >
          <div className="back-inner">
            <div className="back-heading">
              <BrandMark inverse />
              <h2>Begin something beautifully real.</h2>
              <p>Personal matchmaking in Thailand</p>
            </div>
            <div className="contact-list">
              <ContactRow icon={FaWhatsapp} label="WhatsApp">
                +66 6369 15263
              </ContactRow>
              <ContactRow icon={Phone} label="Phone">
                +66 6369 15263 · +66 6369 15264
              </ContactRow>
              <ContactRow icon={Mail} label="Email">
                {CONTACT.email}
              </ContactRow>
              <ContactRow icon={Globe} label="Website">
                thaisoulmate.org
              </ContactRow>
            </div>
            <div className="back-bottom">
              <div className="social-list">
                {socialLinks.map(({ label, value, icon: Icon }) => (
                  <div className="social-list__item" key={label}>
                    <Icon size={14} aria-hidden="true" />
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
              <div className="qr-block">
                <div className="qr-block__code">
                  <QRCodeSVG
                    value={CONTACT.whatsapp}
                    level="H"
                    includeMargin={false}
                  />
                  <span className="qr-block__whatsapp" aria-hidden="true">
                    <FaWhatsapp />
                  </span>
                </div>
                <span>Scan to WhatsApp us</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
