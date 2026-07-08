"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GBFlag, THFlag } from "./flag-icon"

const languages = [
  {
    value: "en",
    label: "English",
    flag: GBFlag,
  },
  {
    value: "th",
    label: "Thai",
    flag: THFlag,
  },
]

export function LanguageSwitcher() {
  const [value, setValue] = React.useState("en")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {(() => {
            const Flag = languages.find((lang) => lang.value === value)?.flag
            return Flag ? <Flag className="size-4" /> : null
          })()}
          <span className="ml-2">
            {languages
              .find((lang) => lang.value === value)
              ?.value.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onSelect={() => setValue(language.value)}
          >
            <div className="flex items-center gap-2">
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === language.value ? "opacity-100" : "opacity-0"
                )}
              />
              <language.flag className="size-4" />
              <span className="ml-2">{language.value.toUpperCase()}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
