import { APP_INFO } from "@/constants"
import { cn } from "@/lib/utils"

interface AppNameProps {
  className?: string
}

export function AppName({ className }: AppNameProps) {
  return (
    <span className={cn("text-gradient", className)}>
      {APP_INFO.name}
    </span>
  )
}
