"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HeartHandshake } from "lucide-react";
import { toast } from "sonner";

export function ConnectButton({
  maleId,
  femaleId,
}: {
  maleId: string;
  femaleId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/soulmates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maleId, femaleId }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Soulmates connected successfully!");
        router.push("/dashboard/tracking");
      } else {
        toast.error(`Failed to connect soulmates: ${result.message}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Connect soulmates error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="btn-gradient"
      onClick={handleConnect}
      disabled={isLoading}
    >
      <HeartHandshake className="mr-2 h-4 w-4" />
      {isLoading ? "Connecting..." : "Connect Soulmates"}
    </Button>
  );
}
