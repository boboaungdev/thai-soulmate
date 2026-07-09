import { AppName } from "@/components/app-name"
import { Cta } from "@/components/cta"
import { MotionDiv } from "@/components/motion"

export default function ServicePage() {
  return (
    <main className="mb-12 space-y-12">
      <section className="bg-animated-gradient flex min-h-[300px] py-12 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="mb-8 text-4xl font-bold tracking-tighter md:text-5xl">
              Our Services
            </h1>
          </MotionDiv>
          <div className="mx-auto max-w-3xl space-y-4 text-left">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-muted-foreground md:text-xl">
                <AppName className="font-bold" /> takes a personalised approach
                to matchmaking. Carefully learning about your preferences,
                values and relationship goals. Every introduction is
                thoughtfully selected to ensure genuine compatibility and
                meaningful connection.
              </p>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <p className="text-lg font-bold md:text-xl">
                <span className="text-gradient">
                  Real People. Real Relationships. Personally Matched in
                  Thailand.
                </span>
              </p>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="py-8 text-3xl font-bold tracking-tight">
                WHAT WE OFFER
              </h2>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground md:text-xl">
                <li>
                  <AppName /> offer a simple and straight forward package.
                  Whichever membership is chosen the service is exactly same.
                </li>
                <li>
                  <AppName /> seek to fully customize your match making
                  experience. You Will receive exceptional attention every step
                  of the way.
                </li>
                <li>
                  <AppName /> matches each individual member personally. We
                  search our database and then carefully filter the most
                  appropriate matches. We strive to ensure you get 3-5 matches a
                  month.
                </li>
                <li>
                  <AppName /> offers a personal match maker with complementary
                  interpreter services for your virtual meetings.
                </li>
                <li>
                  <AppName /> takes care of you every step of the way-even when
                  you are matched. we carefully monitor your progress ensuring
                  everything is effortless in your exciting new journey of love.
                </li>
              </ul>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <p className="pt-4 text-lg font-bold md:text-xl">
                <span className="text-gradient">
                  {" "}
                  Register your interest and get one of our matchmakers to
                  discuss your personal services.
                </span>
              </p>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="py-8 text-3xl font-bold tracking-tight">
                THE PROCESS
              </h2>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground md:text-xl">
                <li>
                  The member initially registers they interest in our service.
                </li>
                <li>
                  The member can start / complete the application profile online
                  or via a call with the matchmaker.
                </li>
                <li>
                  The matchmaker will call you to discuss your aims and goals,
                  and to explain the service.
                </li>
                <li>
                  The matchmaker during this call will understand what kind of
                  lady will fit your profile by completing your application
                  form/profile.
                </li>
                <li>
                  After the meeting, the matchmaker will then review which
                  ladies will the most suitable.
                </li>
                <li>
                  Profiles will be sent the member first for approval and then
                  the members profile will be forwarded to the ladies.
                </li>
                <li>
                  The matchmaker will then follow up with both parties to
                  discuss in more detail the potential compatibility.
                </li>
                <li>
                  When both parties agree, a video call is arranged, where the
                  matchmaker will be present to provide any assistance when
                  necessary
                </li>
                <li>
                  After the video call, the matchmaker will then speak to both
                  parties to understand if there was a connection.
                </li>
                <li>
                  If both parties agreed to move matters to the next stage,
                  another video call can take place or WhatsApp numbers can be
                  exchanged. If one party fails to connect, the matchmaker will
                  source an alternative match.
                </li>
                <li>
                  The matchmaker will continue to watch and support the
                  connection, assisting either party where necessary.
                </li>
                <li>
                  Follow ups will be done to check on the progress of the
                  connection.
                </li>
              </ul>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <p className="pt-8 text-lg font-bold md:text-xl">
                <span className="text-gradient">
                  Connecting Hearts Across Thailand and Beyond.
                </span>
              </p>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="py-8 text-3xl font-bold tracking-tight">FEES</h2>
              <p className="text-muted-foreground md:text-xl">
                <AppName className="inline font-bold" /> structured fee service
                and payment terms for male and female members varies. Our
                friendly team can discuss with you in more detail once you have
                registered your interest.
              </p>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <p className="pt-4 text-lg font-bold md:text-xl">
                <span className="text-gradient">
                  Beyond Dating Apps — Professional One-to-One Matchmaking
                </span>
              </p>
            </MotionDiv>
          </div>
        </div>
      </section>
      <Cta />
    </main>
  )
}
