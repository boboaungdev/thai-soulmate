"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { HeartHandshake, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function ConnectButton({
  maleId,
  femaleId,
  matchPercentage,
}: {
  maleId: string
  femaleId: string
  matchPercentage: number
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/soulmates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maleId, femaleId, matchPercentage }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Soulmates connected successfully!")
        router.push("/dashboard/soulmates")
      } else {
        toast.error(`Failed to connect soulmates: ${result.message}`)
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
      console.error("Connect soulmates error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="btn-gradient" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <HeartHandshake className="h-4 w-4" />
          )}
          {isLoading ? "Connecting..." : "Connect Soulmates"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will connect these two members as soulmates.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConnect} className="btn-gradient">
            Connect
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
