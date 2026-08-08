// app/(website)/contact/page.tsx
import { CONTACT } from "@/constants"
import { ContactForm } from "@/components/contact-form"
// Changed to react-icons/fa
import {
  FaFacebookF,
  FaInstagram,
  FaLine,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa"
import { Mail, Phone, MapPin } from "lucide-react" // Keeping Mail, Phone, MapPin from lucide-react for other cards
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MotionDiv } from "@/components/motion"

export default function ContactPage() {
  return (
    <main className="mb-12">
      <section className="bg-animated-gradient flex min-h-[300px] py-12 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-gradient mb-8 text-4xl font-bold tracking-tighter md:text-5xl">
              Contact Us
            </h1>
            <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
              We&apos;d love to hear from you! Reach out to us through any of
              the channels below, or send us a message using the form.
            </p>
          </MotionDiv>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-8">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-6 w-6" />
                      <span>Email</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      <Link
                        href={`mailto:${CONTACT.email}`}
                        className="text-lg font-medium hover:underline"
                      >
                        {CONTACT.email}
                      </Link>
                    </CardDescription>
                  </CardContent>
                </Card>
              </MotionDiv>
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-6 w-6" />
                      <span>Phone</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardDescription>
                      <Link
                        href={`tel:${CONTACT.primaryPhone.replace(/\D/g, "")}`}
                        className="text-lg font-medium hover:underline"
                      >
                        {CONTACT.primaryPhone} (English)
                      </Link>
                    </CardDescription>
                    <CardDescription>
                      <Link
                        href={`tel:${CONTACT.secondaryPhone.replace(
                          /\D/g,
                          ""
                        )}`}
                        className="text-lg font-medium hover:underline"
                      >
                        {CONTACT.secondaryPhone} (Thai)
                      </Link>
                    </CardDescription>
                  </CardContent>
                </Card>
              </MotionDiv>
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-6 w-6" />
                      <span>Social Media</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href={`https://wa.me/${CONTACT.whatsapp}`}
                        className="flex items-center gap-2 text-green-500 dark:text-green-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaWhatsapp className="h-6 w-6" />
                        <span className="sr-only sm:not-sr-only">WhatsApp</span>
                      </Link>
                      <Link
                        href={CONTACT.facebook}
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFacebookF className="h-6 w-6" />
                        <span className="sr-only sm:not-sr-only">Facebook</span>
                      </Link>
                      <Link
                        href={CONTACT.instagram}
                        className="flex items-center gap-2 text-pink-500 dark:text-pink-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaInstagram className="h-6 w-6" />
                        <span className="sr-only sm:not-sr-only">
                          Instagram
                        </span>
                      </Link>
                      <Link
                        href={CONTACT.tiktok}
                        className="flex items-center gap-2 text-black dark:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaTiktok className="h-6 w-6" />
                        <span className="sr-only sm:not-sr-only">TikTok</span>
                      </Link>
                      <Link
                        href={CONTACT.line}
                        className="flex items-center gap-2 text-green-500 dark:text-green-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaLine className="h-6 w-6" />
                        <span className="sr-only sm:not-sr-only">Line</span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </MotionDiv>
            </div>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
                <h2 className="mb-4 text-2xl font-bold">Send us a Message</h2>
                <ContactForm />
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>
    </main>
  )
}
