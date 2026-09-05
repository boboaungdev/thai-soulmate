import { AppName } from "@/components/app-name"
import { Cta } from "@/components/cta"
import { MotionDiv } from "@/components/motion"

export default function ServicePage() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main className="mb-12 space-y-12">
        <section className="py-12 md:py-24">
          <div className="mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4 text-center">
              <h1 className="text-gradient text-4xl font-bold tracking-tighter md:text-5xl">
                Our Services
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                <AppName className="font-bold" /> takes a personalised approach
                to matchmaking, carefully learning about your preferences,
                values, and relationship goals.
              </p>
            </div>

            <div className="w-full space-y-12 text-left">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  WHAT WE OFFER
                </h2>
                <ul className="list-inside list-disc space-y-2 text-muted-foreground md:text-xl">
                  <li>
                    <AppName /> offer a simple and straight forward package.
                    Whichever membership is chosen the service is exactly same.
                  </li>
                  <li>
                    <AppName /> seek to fully customize your match making
                    experience. You Will receive exceptional attention every
                    step of the way.
                  </li>
                  <li>
                    <AppName /> matches each individual member personally. We
                    search our database and then carefully filter the most
                    appropriate matches. We strive to ensure you get 3-5 matches
                    a month.
                  </li>
                  <li>
                    <AppName /> offers a personal match maker with complementary
                    interpreter services for your virtual meetings.
                  </li>
                  <li>
                    <AppName /> takes care of you every step of the way-even
                    when you are matched. we carefully monitor your progress
                    ensuring everything is effortless in your exciting new
                    journey of love.
                  </li>
                </ul>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  THE PROCESS
                </h2>
                <ul className="list-inside list-disc space-y-2 text-muted-foreground md:text-xl">
                  <li>
                    The member initially registers they interest in our service.
                  </li>
                  <li>
                    The member can start / complete the application profile
                    online or via a call with the matchmaker.
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
                    Profiles will be sent to the member first for approval and
                    then the members profile will be forwarded to the ladies.
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
                    exchanged. If one party fails to connect, the matchmaker
                    will source an alternative match.
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
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  MEMBERSHIP FEES
                </h2>
                <div className="space-y-4 text-muted-foreground md:text-xl">
                  <p>
                    <AppName /> offer a simple and straight forward package.
                    Whichever membership is chosen the service is exactly same.
                  </p>
                  <p>
                    <AppName /> seek to fully customise your match making
                    experience. You will receive exceptional attention every
                    step of the way.
                  </p>
                  <p>
                    <AppName /> matches each individual member personally. We
                    search our database and then carefully filter the most
                    appropriate matches. We strive to ensure you get 3-5 matches
                    a month.
                  </p>
                  <p>
                    <AppName /> offers a personal match maker with complementary
                    interpreter services for your virtual meetings.
                  </p>
                  <p>
                    <AppName /> takes care of you every step of the way – even
                    when you are matched, we carefully monitor your progress
                    ensuring everything is effortless in your exciting new
                    journey of love.
                  </p>
                </div>
              </MotionDiv>
            </div>
          </div>
        </section>
        <Cta />
      </main>
    </MotionDiv>
  )
}
