"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import { AppName } from "@/components/app-name"
import { APP_INFO } from "@/constants"
import { MotionDiv } from "@/components/motion"

export default function NotFound() {
  const { user } = useAuthStore()

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <main className="text-center">
            <Image
              src="/logo.png"
              alt={`${APP_INFO.name} logo`}
              width={128}
              height={128}
              className="mx-auto mb-4 rounded-3xl object-cover"
              priority
            />
            <p className="text-4xl font-bold tracking-tight sm:text-5xl">
              <AppName />
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              404 - Page Not Found
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </p>
            <div className="mt-6">
              <Button asChild className="btn-gradient">
                <Link href={user ? "/dashboard" : "/"}>
                  <ChevronLeft className="mr-2 size-4" />
                  {user ? "Go Dashboard" : "Go Home"}
                </Link>
              </Button>
            </div>
          </main>
        </MotionDiv>
      </div>
    </main>
  )
}
