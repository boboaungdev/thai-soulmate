"use client"

import Image from "next/image"
import { APP_INFO } from "@/constants"
import { AppName } from "@/components/app-name"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "login"

  const setMode = (newMode: "login" | "register" | "forgot-password") => {
    const params = new URLSearchParams(searchParams)
    params.set("mode", newMode)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-4xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="hidden lg:block">
          <div className="flex flex-col items-start text-left">
            <Image
              src="/logo.png"
              alt={`${APP_INFO.name} logo`}
              width={128}
              height={128}
              className="mb-6 rounded-3xl object-cover"
              priority
            />
            <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
              Welcome to
              <br />
              <AppName />
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Your journey to finding a soulmate starts here.
            </p>
          </div>
        </div>
        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="mb-4 flex flex-col items-center text-center lg:hidden">
            <Image
              src="/logo.png"
              alt={`${APP_INFO.name} logo`}
              width={96}
              height={96}
              className="mb-4 rounded-3xl object-cover shadow-sm"
              priority
            />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome to
              <br />
              <AppName />
            </h1>
            <p className="mt-2 text-muted-foreground">
              Your journey to finding a soulmate starts here.
            </p>
          </div>
          {mode === "login" ? (
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="password" />
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                <Button className="btn-gradient w-full">Login</Button>
                <div className="flex w-full items-center justify-between text-sm">
                  <p className="text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => setMode("register")}
                    >
                      Register
                    </Button>
                  </p>
                  <Button
                    variant="link"
                    className="p-0 text-muted-foreground"
                    onClick={() => setMode("forgot-password")}
                  >
                    Forgot password?
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                  Create an account to start your journey with us.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input id="password-signup" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                <Button className="btn-gradient w-full">Register</Button>
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => setMode("login")}
                  >
                    Login
                  </Button>
                </p>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
