"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface InfoPopoverProps {
  children: React.ReactNode
  ariaLabel?: string
}

const InfoPopover = ({ children, ariaLabel = "Información sobre la gráfica" }: InfoPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full absolute top-4 right-4"
          aria-label={ariaLabel}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 z-50" align="end">
        <div className="space-y-2 text-left">
          {children}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default InfoPopover
