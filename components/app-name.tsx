import { APP_NAME } from "@/constants"
import { cn } from "@/lib/utils"

interface AppNameProps {
  className?: string
}

export function AppName({ className }: AppNameProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-[#cfa14f] via-[#cb5d7a] to-[#cb5d7a] bg-clip-text text-transparent",
        className
      )}
    >
      {APP_NAME}
    </span>
  )
}
