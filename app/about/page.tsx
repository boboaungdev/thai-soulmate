import { AppName } from "@/components/app-name"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Target, Eye, Handshake } from "lucide-react"
import { Cta } from "@/components/cta"

export default function AboutPage() {
  return (
    <main className="mb-12 space-y-12">
      <section className="bg-animated-gradient flex min-h-[300px] py-12 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Centered title */}
          <h1 className="mb-8 text-center text-4xl font-bold tracking-tighter md:text-5xl">
            About Us
          </h1>

          {/* Left-aligned content */}
          <div className="mx-auto max-w-3xl space-y-4 text-left">
            <p className="text-muted-foreground md:text-xl">
              Welcome to <AppName className="font-bold" /> – where connections
              are made and stories begin. We are dedicated to bringing people
              together in meaningful ways.
            </p>

            <p className="text-muted-foreground md:text-xl">
              <AppName className="inline font-bold" />
              &nbsp;you don&apos;t have time for dating apps that offer no real
              value, and you don&apos;t have the time to engage with individuals
              who aren&apos;t the right fit for YOU.
            </p>

            <p className="text-muted-foreground md:text-xl">
              <AppName className="inline font-bold" />
              &nbsp;understands you are at a stage in your life where everything
              is in place, and all that&apos;s missing is the right
              person—someone with whom you can share the rest of your life in
              happiness.
            </p>

            <p className="text-muted-foreground md:text-xl">
              <AppName className="inline font-bold" />
              &nbsp;is a personalised matchmaking service dedicated to creating
              a genuine, meaningful connection between Thai women and YOU.
            </p>

            <p className="text-muted-foreground md:text-xl">
              <AppName className="inline font-bold" />
              &nbsp;takes the time to understand each individual&apos;s values,
              lifestyle, and relationship goals to connect you with your future
              life partner.
            </p>

            <p className="text-muted-foreground md:text-xl">
              <AppName className="inline font-bold" />
              &nbsp;approach is respectful and discreet, ensuring every
              introduction is made with care and integrity.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-col items-center">
                <Target className="mb-2 h-6 w-6 text-[var(--gold)]" />
                <CardTitle className="text-center">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                    <li>
                      Create a vibrant and secure platform that fosters genuine
                      connections, empowering individuals to find companionship,
                      friendship, and love.
                    </li>
                    <li>
                      Provide an inclusive environment where everyone feels
                      valued and respected.
                    </li>
                    <li>
                      Is to offer YOU an unparalleled matchmaking service that
                      meets with your expectations.
                    </li>
                  </ul>
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col items-center">
                <Eye className="mb-2 h-6 w-6 text-[var(--gold)]" />
                <CardTitle className="text-center">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                    <li>
                      We envision a world where technology enhances human
                      relationships, making it easier for people to connect
                      deeply and build lasting bonds.
                    </li>
                    <li>
                      We aim to be the leading platform for meaningful
                      interactions globally.
                    </li>
                  </ul>
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col items-center">
                <Handshake className="mb-2 h-6 w-6 text-[var(--gold)]" />
                <CardTitle className="text-center">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                    <li>
                      Integrity: Upholding honesty and transparency in all our
                      interactions.
                    </li>
                    <li>
                      Empathy: Understanding and sharing the feelings of others.
                    </li>
                    <li>
                      Innovation: Continuously improving and adapting to user
                      needs.
                    </li>
                    <li>
                      Community: Building a supportive and engaging environment.
                    </li>
                  </ul>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Cta />
    </main>
  )
}
