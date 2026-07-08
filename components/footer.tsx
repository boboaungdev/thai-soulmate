import Link from "next/link"
import Image from "next/image"
import {
  FaFacebook,
  FaLine,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { AppName } from "@/components/app-name"
import { APP_NAME, APP_TAGLINE, CONTACT } from "@/constants"

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={`${APP_NAME} logo`}
                width={72}
                height={72}
                className="size-11 shrink-0 rounded-2xl bg-background object-cover shadow-sm"
              />
              <div className="min-w-0">
                <AppName className="truncate text-sm font-semibold" />
                <p className="truncate text-sm text-muted-foreground">
                  {APP_TAGLINE}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp className="size-4" />
                  WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <a href={`mailto:${CONTACT.email}`}>
                  <FaEnvelope className="size-4" />
                  Email
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <a href={CONTACT.facebook} target="_blank" rel="noreferrer">
                  <FaFacebook className="size-4" />
                  Facebook
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <a href={CONTACT.line} target="_blank" rel="noreferrer">
                  <FaLine className="size-4" />
                  Line
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border/70 pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright &copy; {new Date().getFullYear()}{" "}
            <Link href="/" className="hover:text-foreground">
              <AppName />
            </Link>
            . All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms-of-service" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

