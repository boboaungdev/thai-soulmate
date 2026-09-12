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
import Link from "next/link"
import { Eye, HeartHandshake, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createTrackingAction } from "@/features/matching"

export function ConnectButton({
  maleId,
  femaleId,
  matchPercentage,
  activeTrackingId,
}: {
  maleId: string
  femaleId: string
  matchPercentage: number
  activeTrackingId?: string | null
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const result = await createTrackingAction({
        maleId,
        femaleId,
        matchPercentage,
      })

      if (result.success) {
        toast.success("Soulmates connected successfully!")
        router.push("/dashboard/tracking")
      } else {
        toast.error(`Failed to connect soulmates: ${(result as any).message || (result as any).error || "Unknown error"}`)
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
      console.error("Connect soulmates error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (activeTrackingId) {
    return (
      <Button asChild className="btn-gradient shadow-xs">
        <Link href={`/dashboard/tracking/${activeTrackingId}`}>
          <Eye className="mr-1.5 h-4 w-4" />
          View Active Tracking
        </Link>
      </Button>
    )
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
