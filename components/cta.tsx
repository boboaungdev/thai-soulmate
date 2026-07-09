import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MotionDiv } from "./motion"

export function Cta() {
  return (
    <section className="py-16 sm:py-20">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto w-full max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Find Your Match?
          </h2>
          <p className="text-muted-foreground md:text-lg">
            Join our community today and start your journey towards finding a
            meaningful connection.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="btn-gradient">
              <Link href="/#register-interest">Register Interest</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="">Login</Link>
            </Button>
          </div>
        </div>
      </MotionDiv>
    </section>
  )
}
