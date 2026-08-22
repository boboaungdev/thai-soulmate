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
  { label: "Line", value: "@thaisoulmate", icon: FaLine },
  { label: "Instagram", value: "@thaisoulmate", icon: FaInstagram },
  { label: "TikTok", value: "@thaisoulmate", icon: FaTiktok },
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
      <div>
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
        <Icon size={18} strokeWidth={2.2} />
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
          --marketing-ink: #18212f;
          --marketing-coral: #ef7185;
          --marketing-yellow: #f4c85b;
          --marketing-teal: #42b8ad;
          --marketing-blue: #4266a9;
        }
        body {
          background: #e8e4dc;
        }
        .marketing-preview {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 28px;
          padding: 36px;
          color: var(--marketing-ink);
          font-family: Georgia, "Times New Roman", serif;
        }
        .marketing-page {
          position: relative;
          width: 148mm;
          height: 210mm;
          overflow: hidden;
          background: #fffaf1;
          box-shadow: 0 18px 40px rgb(24 33 47 / 18%);
        }
        .marketing-page__front {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20mm 17mm 16mm;
          background: var(--marketing-coral);
          color: white;
        }
        .marketing-page__front::before,
        .marketing-page__front::after {
          position: absolute;
          border-radius: 999px;
          content: "";
        }
        .marketing-page__front::before {
          top: -28mm;
          right: -22mm;
          width: 92mm;
          height: 92mm;
          background: var(--marketing-yellow);
        }
        .marketing-page__front::after {
          right: -20mm;
          bottom: -19mm;
          width: 76mm;
          height: 76mm;
          border: 12mm solid var(--marketing-teal);
        }
        .brand-mark,
        .front-content,
        .front-footer,
        .back-heading,
        .contact-list,
        .back-bottom,
        .print-only-url {
          position: relative;
          z-index: 1;
        }
        .brand-mark {
          display: flex;
          align-items: center;
          gap: 4mm;
        }
        .brand-mark__logo {
          width: 19mm;
          height: 19mm;
          object-fit: contain;
          border-radius: 5mm;
        }
        .brand-mark__name {
          margin: 0;
          color: var(--marketing-ink);
          font-size: 8.5mm;
          font-weight: 700;
          line-height: 0.95;
        }
        .brand-mark__name--light {
          color: white;
        }
        .brand-mark__tag {
          margin: 2mm 0 0;
          color: var(--marketing-ink);
          font-family: Arial, sans-serif;
          font-size: 2.7mm;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .brand-mark__tag--light {
          color: rgb(255 255 255 / 78%);
        }
        .front-content {
          max-width: 102mm;
        }
        .front-content__eyebrow {
          margin: 0 0 8mm;
          color: var(--marketing-ink);
          font-family: Arial, sans-serif;
          font-size: 3mm;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .front-content h1 {
          margin: 0;
          color: white;
          font-size: 17mm;
          line-height: 0.94;
        }
        .front-content__secondary {
          max-width: 82mm;
          margin: 8mm 0 0;
          white-space: pre-line;
          color: var(--marketing-ink);
          font-family: Arial, sans-serif;
          font-size: 4.3mm;
          font-weight: 700;
          line-height: 1.35;
        }
        .front-footer,
        .back-bottom {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 8mm;
        }
        .front-footer__url {
          margin: 0;
          color: white;
          font-family: Arial, sans-serif;
          font-size: 3.5mm;
          font-weight: 800;
          letter-spacing: 0.08em;
        }
        .front-footer__mark {
          width: 25mm;
          height: 25mm;
          padding: 3mm;
          border: 2px solid var(--marketing-ink);
          border-radius: 50%;
          color: var(--marketing-ink);
          font-family: Arial, sans-serif;
          font-size: 2.6mm;
          font-weight: 900;
          line-height: 1.1;
          text-align: center;
          text-transform: uppercase;
          transform: rotate(-12deg);
        }
        .marketing-page__back {
          padding: 15mm 14mm 13mm;
          background: var(--marketing-blue);
        }
        .back-inner {
          position: relative;
          display: flex;
          height: 100%;
          flex-direction: column;
          justify-content: space-between;
          padding: 11mm 10mm;
          border: 1px solid rgb(255 255 255 / 35%);
          background: #fffaf1;
        }
        .back-inner::after {
          position: absolute;
          right: -14mm;
          bottom: -16mm;
          width: 52mm;
          height: 52mm;
          border-radius: 50%;
          background: var(--marketing-yellow);
          content: "";
        }
        .back-heading h2 {
          margin: 9mm 0 0;
          color: var(--marketing-ink);
          font-size: 10mm;
          line-height: 0.98;
        }
        .back-heading p {
          margin: 3mm 0 0;
          color: var(--marketing-coral);
          font-family: Arial, sans-serif;
          font-size: 3.3mm;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .contact-list {
          display: grid;
          gap: 3.8mm;
          margin: 9mm 0;
        }
        .contact-row {
          display: grid;
          grid-template-columns: 10mm 25mm 1fr;
          align-items: center;
          gap: 2mm;
          min-height: 9mm;
          border-bottom: 1px solid #e5ddd1;
          padding-bottom: 2.5mm;
        }
        .contact-row__icon {
          display: grid;
          width: 8mm;
          height: 8mm;
          place-items: center;
          border-radius: 50%;
          background: var(--marketing-teal);
          color: white;
        }
        .contact-row__label {
          color: #837969;
          font-family: Arial, sans-serif;
          font-size: 2.6mm;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .contact-row__value {
          color: var(--marketing-ink);
          font-family: Arial, sans-serif;
          font-size: 3.2mm;
          font-weight: 700;
          text-align: right;
        }
        .social-list {
          display: grid;
          gap: 2.5mm;
        }
        .social-list__item {
          display: flex;
          align-items: center;
          gap: 2.5mm;
          color: var(--marketing-ink);
          font-family: Arial, sans-serif;
          font-size: 3mm;
          font-weight: 700;
        }
        .social-list__item svg {
          color: var(--marketing-coral);
        }
        .qr-block {
          display: grid;
          flex: 0 0 35mm;
          gap: 2mm;
          justify-items: center;
          color: var(--marketing-ink);
          font-family: Arial, sans-serif;
          font-size: 2.5mm;
          font-weight: 800;
          text-align: center;
          text-transform: uppercase;
        }
        .qr-block__code {
          padding: 2mm;
          background: white;
        }
        .qr-block__code svg {
          display: block;
          width: 29mm;
          height: 29mm;
        }
        .print-only-url {
          margin: 4mm 0 0;
          color: var(--marketing-coral);
          font-family: Arial, sans-serif;
          font-size: 2.7mm;
          font-weight: 800;
          text-align: center;
        }
        .marketing-preview {
          background: #e8e1df;
          font-family: Arial, sans-serif;
        }
        .marketing-page {
          border-radius: 0;
          box-shadow: 0 18px 45px rgb(42 25 31 / 18%);
          font-family: Arial, sans-serif;
        }
        .marketing-page__front {
          justify-content: space-between;
          padding: 15mm 14mm 13mm;
          background:
            radial-gradient(
              circle at 90% 8%,
              rgb(255 255 255 / 22%) 0 18mm,
              transparent 18.2mm
            ),
            linear-gradient(145deg, #d95f7b 0%, #bf4566 54%, #91354f 100%);
        }
        .marketing-page__front::before {
          top: 80mm;
          right: -29mm;
          width: 82mm;
          height: 82mm;
          border: 1px solid rgb(255 255 255 / 25%);
          background: transparent;
        }
        .marketing-page__front::after {
          right: -16mm;
          bottom: -19mm;
          width: 70mm;
          height: 70mm;
          border: 1px solid rgb(255 255 255 / 24%);
        }
        .marketing-page__front .brand-mark {
          align-items: center;
        }
        .marketing-page__front .brand-mark__name,
        .marketing-page__front .brand-mark__tag {
          color: white;
        }
        .brand-mark > div {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .brand-mark__tag {
          margin-top: 0;
        }
        .marketing-page__back .brand-mark__tag {
          margin-top: 0;
          text-transform: none;
        }
        .brand-mark__tag {
          text-transform: none;
        }
        .brand-mark__name {
          display: block;
          width: 46mm;
          height: 7mm;
        }
        .marketing-page__back .brand-mark__name {
          width: 46mm;
          height: 7mm;
        }
        .front-content {
          max-width: 111mm;
          margin-top: auto;
          margin-bottom: auto;
        }
        .front-content__eyebrow {
          display: inline-block;
          margin-bottom: 8mm;
          border-bottom: 1px solid rgb(255 255 255 / 65%);
          padding-bottom: 2mm;
          color: white;
          font-size: 2.7mm;
          letter-spacing: 0.2em;
        }
        .front-content h1 {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18mm;
          font-weight: 400;
          letter-spacing: -0.035em;
          line-height: 0.93;
        }
        .front-content__secondary {
          max-width: 90mm;
          margin-top: 9mm;
          color: white;
          font-size: 3.6mm;
          font-weight: 600;
          line-height: 1.5;
        }
        .front-footer {
          align-items: end;
          border-top: 1px solid rgb(255 255 255 / 35%);
          padding-top: 5mm;
        }
        .front-footer__url {
          font-size: 3mm;
          letter-spacing: 0.14em;
        }
        .front-footer__mark {
          width: 25mm;
          height: 25mm;
          border: 1px solid rgb(255 255 255 / 80%);
          color: white;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 2.8mm;
          font-weight: 400;
          line-height: 1.25;
        }
        .marketing-page__back {
          padding: 10mm;
          background: #f5dadd;
        }
        .back-inner {
          padding: 11mm 10mm 9mm;
          border: 1px solid rgb(137 48 74 / 25%);
          background:
            linear-gradient(135deg, rgb(255 255 255 / 68%), transparent 42%),
            #f8e8e9;
        }
        .back-inner::after {
          right: -20mm;
          bottom: -22mm;
          width: 65mm;
          height: 65mm;
          border: 1px solid rgb(137 48 74 / 18%);
          background: transparent;
        }
        .marketing-page__back .brand-mark__logo {
          width: 19mm;
          height: 19mm;
          border-radius: 50%;
        }
        .marketing-page__back .brand-mark__name {
          width: 46mm;
          height: 8mm;
        }
        .back-heading h2 {
          margin-top: 10mm;
          color: #542538;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 11mm;
          font-weight: 400;
          letter-spacing: -0.03em;
          line-height: 0.98;
        }
        .back-heading p {
          margin-top: 4mm;
          color: #b44767;
          font-size: 2.8mm;
          letter-spacing: 0.17em;
        }
        .contact-list {
          gap: 3mm;
          margin: 9mm 0 7mm;
        }
        .contact-row {
          grid-template-columns: 9mm 25mm 1fr;
          min-height: 8mm;
          border-bottom-color: rgb(137 48 74 / 18%);
          padding-bottom: 2mm;
        }
        .contact-row__icon {
          width: 7mm;
          height: 7mm;
          background: #b44767;
        }
        .contact-row__label,
        .contact-row__value,
        .social-list__item,
        .qr-block {
          color: #542538;
        }
        .contact-row__label {
          color: #956879;
          font-size: 2.4mm;
        }
        .contact-row__value {
          font-size: 2.9mm;
        }
        .back-bottom {
          align-items: end;
          border-top: 1px solid rgb(137 48 74 / 18%);
          padding-top: 6mm;
        }
        .social-list__item {
          font-size: 2.7mm;
        }
        .social-list__item svg {
          color: #b44767;
        }
        .qr-block__code {
          border: 1px solid rgb(137 48 74 / 18%);
        }
        .print-only-url {
          color: #b44767;
          font-size: 2.4mm;
          letter-spacing: 0.14em;
        }
        .marketing-page__front {
          background:
            linear-gradient(rgb(255 255 255 / 5%) 1px, transparent 1px),
            linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px),
            #18212f;
          background-size: 12mm 12mm;
        }
        .marketing-page__front::before,
        .marketing-page__front::after,
        .back-inner::after {
          display: none;
        }
        .marketing-page__front .brand-mark__logo,
        .marketing-page__back .brand-mark__logo {
          border: 0;
          border-radius: 0;
        }
        .front-content__eyebrow {
          border-bottom-color: #cfa14f;
          color: #cfa14f;
        }
        .front-content h1 {
          max-width: 105mm;
          color: #f7f4ed;
        }
        .front-content__secondary {
          color: rgb(247 244 237 / 72%);
        }
        .front-footer__mark {
          width: auto;
          height: auto;
          min-width: 32mm;
          border: 1px solid #cfa14f;
          border-radius: 0;
          padding: 3mm 4mm;
          color: #cfa14f;
          transform: none;
        }
        .marketing-page__back {
          padding: 0;
          background: #f7f5f0;
        }
        .back-inner {
          padding: 15mm 14mm 13mm;
          border: 0;
          background: #f7f5f0;
        }
        .marketing-page__back .brand-mark__name {
          width: 46mm;
          height: 7mm;
        }
        .back-heading h2 {
          color: #18212f;
        }
        .back-heading p {
          color: #9a7430;
        }
        .contact-row {
          border-bottom-color: rgb(24 33 47 / 16%);
        }
        .contact-row__icon {
          border-radius: 1mm;
          background: #18212f;
          color: #cfa14f;
        }
        .contact-row__label {
          color: #68717b;
        }
        .contact-row__value,
        .social-list__item,
        .qr-block {
          color: #18212f;
        }
        .back-bottom {
          border-top-color: rgb(24 33 47 / 16%);
        }
        .marketing-page__back .back-bottom {
          border-top: 0;
        }
        .social-list__item svg {
          color: #9a7430;
        }
        .qr-block__code {
          position: relative;
          border: 1px solid rgb(24 33 47 / 16%);
          border-radius: 0;
        }
        .qr-block__whatsapp {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          width: 6mm;
          height: 6mm;
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
        .print-only-url {
          color: #9a7430;
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
          body * {
            visibility: visible;
          }
          .marketing-document,
          .marketing-document * {
            visibility: visible;
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
            <p className="front-content__eyebrow">Matchmaking, with heart</p>
            <h1>
              Meet someone
              <br />
              who feels
              <br />
              like home.
            </h1>
            <p className="front-content__secondary">
              {APP_INFO.secondaryTagline}
            </p>
          </div>
          <footer className="front-footer">
            <p className="front-footer__url">thaisoulmate.org</p>
            <div className="front-footer__mark">
              Made for
              <br />
              real love
              <br />
              in Thailand
            </div>
          </footer>
        </section>
        <section
          className="marketing-page marketing-page__back"
          aria-label="Back of Thai Soulmate marketing card"
        >
          <div className="back-inner">
            <div className="back-heading">
              <BrandMark inverse />
              <h2>
                Your next
                <br />
                chapter starts here.
              </h2>
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
                    <Icon size={15} strokeWidth={2.2} aria-hidden="true" />
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
            <p className="print-only-url">thaisoulmate.org</p>
          </div>
        </section>
      </main>
    </>
  )
}
