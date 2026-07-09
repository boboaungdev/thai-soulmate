import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppName } from "@/components/app-name"
import { MotionDiv } from "@/components/motion"

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <main className="text-center">
            <p className="text-4xl font-bold tracking-tight sm:text-5xl">
              <AppName />
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              404 - Page Not Found
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className="mt-6">
              <Button asChild className="btn-gradient">
                <Link href="/">
                  <ArrowLeft className="mr-2 size-4" />
                  Go back home
                </Link>
              </Button>
            </div>
          </main>
        </MotionDiv>
      </div>
    </main>
  )
}
