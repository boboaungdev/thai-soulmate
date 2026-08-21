"use client"

import Image from "next/image"
import { useEffect } from "react"
import { Globe, Mail, MessageCircle, Music2, Phone } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { FaFacebookF, FaInstagram } from "react-icons/fa"

import { APP_INFO, CONTACT } from "@/constants"

const socialLinks = [
  { label: "Facebook", value: "@thaisoulmate.official", icon: FaFacebookF },
  { label: "Line", value: "@thaisoulmate", icon: MessageCircle },
  { label: "Instagram", value: "@thaisoulmate", icon: FaInstagram },
  { label: "TikTok", value: "@thaisoulmate", icon: Music2 },
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
        <p
          className={
            inverse
              ? "brand-mark__name brand-mark__name--light"
              : "brand-mark__name"
          }
        >
          {APP_INFO.name}
        </p>
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
  icon: typeof Phone
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
          background: white;
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

      <main className="marketing-preview">
        <section
          className="marketing-page marketing-page__front"
          aria-label="Front of Thai Soulmate marketing card"
        >
          <BrandMark />
          <div className="front-content">
            <p className="front-content__eyebrow">
              A more meaningful way to meet
            </p>
            <h1>
              Find the
              <br />
              connection
              <br />
              that feels real.
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
                Let&apos;s start
                <br />
                something real.
              </h2>
              <p>Connect with us today</p>
            </div>
            <div className="contact-list">
              <ContactRow icon={MessageCircle} label="WhatsApp">
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
                    level="M"
                    includeMargin={false}
                  />
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
