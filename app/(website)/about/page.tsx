import { AppName } from "@/components/app-name"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Target, Eye, Handshake, Globe2, Phone, Mail } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { Cta } from "@/components/cta"
import { MotionDiv } from "@/components/motion"

const team = [
  {
    name: "Mr. Sham Velani",
    role: "Founder",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    fallback: "AS",
    social: {
      website: "https://21stcenturygroup.org",
      phone: "+447956385061",
      email: "info@21stcenturygroup.org",
      whatsapp: "https://wa.me/447956385061",
    },
    description:
      "Mr. Sham brings over a decade of profound experience in business leadership, complemented by extensive expertise in personal assistant services and financial service management. His visionary guidance has been instrumental in shaping our mission to foster meaningful connections.",
  },
  {
    name: "Mr. Ben Carter",
    role: "Match Maker",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    fallback: "BC",
    social: {
      website: "https://21stcenturygroup.org",
    },
    description:
      "As our Service Lead, Mr. Ben Carter is passionately dedicated to ensuring an unparalleled service experience for all our members. He meticulously oversees our operations to guarantee satisfaction and build lasting trust.",
  },
  {
    name: "Ms. Chloe Davis",
    role: "Social Media Specialist",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
    fallback: "CD",
    social: {
      website: "https://21stcenturygroup.org",
    },
    description:
      "Ms. Chloe Davis, our Social Media Specialist, expertly crafts our online presence and fosters a vibrant community. She is committed to connecting with our audience and amplifying our message across all digital platforms.",
  },
  {
    name: "Mr. David Lee",
    role: "Lead Developer",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    fallback: "DL",
    social: {
      website: "https://21stcenturygroup.org",
    },
    description:
      "Mr. David Lee, our innovative Lead Developer, is the architect behind the robust and intuitive technology that powers our platform. He continuously strives to enhance user experience and build seamless connections through cutting-edge solutions.",
  },
]

export default function AboutPage() {
  const [founder, ...otherMembers] = team

  return (
    <main className="mb-12 space-y-12">
      <section className="bg-animated-gradient flex min-h-[300px] py-12 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Centered title */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-gradient mb-8 text-4xl font-bold tracking-tighter md:text-5xl">
              About Us
            </h1>
          </MotionDiv>

          {/* Left-aligned content */}
          <div className="mx-auto max-w-3xl space-y-4 text-left">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <p className="text-muted-foreground md:text-xl">
                Welcome to <AppName className="font-bold" /> – where connections
                are made and stories begin. We are dedicated to bringing people
                together in meaningful ways.
              </p>

              <p className="text-muted-foreground md:text-xl">
                <AppName className="inline font-bold" />
                &nbsp;you don&apos;t have time for dating apps that offer no
                real value, and you don&apos;t have the time to engage with
                individuals who aren&apos;t the right fit for YOU.
              </p>

              <p className="text-muted-foreground md:text-xl">
                <AppName className="inline font-bold" />
                &nbsp;understands you are at a stage in your life where
                everything is in place, and all that&apos;s missing is the right
                person—someone with whom you can share the rest of your life in
                happiness.
              </p>

              <p className="text-muted-foreground md:text-xl">
                <AppName className="inline font-bold" />
                &nbsp;is a personalised matchmaking service dedicated to
                creating a genuine, meaningful connection between YOU and your
                future partner.
              </p>

              <p className="text-muted-foreground md:text-xl">
                <AppName className="inline font-bold" />
                &nbsp;takes the time to understand each individual&apos;s
                values, lifestyle, and relationship goals to connect YOU with
                your future life partner.
              </p>

              <p className="text-muted-foreground md:text-xl">
                <AppName className="inline font-bold" />
                &nbsp;approach is respectful and discreet, ensuring every
                introduction is made with care and integrity.
              </p>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <Target className="mb-2 h-6 w-6 text-[var(--gold)]" />
                  <CardTitle className="text-center">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                      <li>
                        Create a vibrant and secure platform that fosters
                        genuine connections, empowering individuals to find
                        companionship, friendship, and love.
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
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <Eye className="mb-2 h-6 w-6 text-[var(--gold)]" />
                  <CardTitle className="text-center">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                      <li>
                        To be the leading platform for meaningful international
                        connections.
                      </li>
                      <li>
                        To build a world where technology enhances human
                        relationships, making it easier to build lasting bonds.
                      </li>
                      <li>
                        To set the standard for excellence and integrity in the
                        personalized matchmaking industry.
                      </li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
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
                        Empathy: Understanding and respecting the feelings,
                        needs, matches, and perspectives of our members.
                      </li>
                      <li>
                        Discretion: Ensuring the privacy and confidentiality of
                        all our clients.
                      </li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>
            </MotionDiv>
          </div>
        </div>
      </section>
      {/* Our Team Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-gradient text-3xl font-bold tracking-tighter md:text-4xl">
              Our Team
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Meet the dedicated individuals behind our mission.
            </p>
          </MotionDiv>

          {/* Founder */}
          <div className="mb-8 flex justify-center">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full sm:max-w-sm" // Added class for width control
            >
              <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                <Avatar className="mb-4 h-32 w-32">
                  <AvatarImage src={founder.image} alt={founder.name} />
                  <AvatarFallback>{founder.fallback}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{founder.name}</CardTitle>
                <CardDescription className="mb-2">
                  {founder.role}
                </CardDescription>
                <p className="mb-4 text-sm text-muted-foreground">
                  {founder.description}
                </p>
                <div className="flex gap-2">
                  {founder.social?.website && (
                    <a
                      href={founder.social.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Globe2 className="h-6 w-6" />
                    </a>
                  )}
                  {founder.social?.phone && (
                    <a
                      href={`tel:${founder.social.phone}`}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="h-6 w-6" />
                    </a>
                  )}
                  {founder.social?.email && (
                    <a
                      href={`mailto:${founder.social.email}`}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Mail className="h-6 w-6" />
                    </a>
                  )}
                  {founder.social?.whatsapp && (
                    <a
                      href={founder.social.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <FaWhatsapp className="h-6 w-6" />
                    </a>
                  )}
                </div>
              </Card>
            </MotionDiv>
          </div>

          {/* Other Team Members */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {otherMembers.map((member, index) => (
              <MotionDiv
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <Avatar className="mb-4 h-32 w-32">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.fallback}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="mb-2">
                    {member.role}
                  </CardDescription>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {member.description}
                  </p>
                  <a
                    href={member.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <Globe2 className="h-6 w-6" />
                  </a>
                </Card>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </main>
  )
}
