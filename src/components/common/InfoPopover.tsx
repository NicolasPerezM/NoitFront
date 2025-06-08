// Ensures this component runs only on the client-side, necessary for components with event listeners or state.
"use client"

// Import the HelpCircle icon from the lucide-react library.
import { HelpCircle } from "lucide-react"
// Import custom Button component.
import { Button } from "@/components/ui/button"
// Import Popover related components from a custom UI library.
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Define the props interface for the InfoPopover component.
interface InfoPopoverProps {
  children: React.ReactNode // Content to be displayed inside the popover.
  ariaLabel?: string // Optional ARIA label for the trigger button for accessibility.
}

// InfoPopover component definition.
// It takes 'children' to display within the popover and an optional 'ariaLabel'.
const InfoPopover = ({ children, ariaLabel = "Información sobre la gráfica" }: InfoPopoverProps) => {
  return (
    // Root Popover component.
    <Popover>
      {/* PopoverTrigger defines the element that will open the popover.
          'asChild' prop allows Button to be the actual trigger element. */}
      <PopoverTrigger asChild>
        <Button
          variant="ghost" // Ghost variant for a less intrusive button style.
          size="icon" // Icon size for the button.
          // Tailwind CSS classes for custom styling:
          // h-8 w-8: height and width of 8 units.
          // rounded-full: fully rounded corners.
          // absolute top-4 right-4: positions the button absolutely at the top-right of its nearest positioned ancestor.
          className="h-8 w-8 rounded-full absolute top-4 right-4"
          aria-label={ariaLabel} // ARIA label for accessibility, defaults to "Information about the graph".
        >
          {/* HelpCircle icon with specified height and width. */}
          <HelpCircle className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      {/* PopoverContent contains the content to be displayed when the popover is open.
          className: w-80 for width, z-50 for z-index to ensure it's above other elements.
          align="end": aligns the popover to the end (right side) of the trigger. */}
      <PopoverContent className="w-80 z-50" align="end">
        {/* Container for the popover's content.
            space-y-2: adds vertical spacing between child elements.
            text-left: aligns text to the left. */}
        <div className="space-y-2 text-left">
          {children} {/* Renders the content passed to the component. */}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Export the InfoPopover component as the default export.
export default InfoPopover
