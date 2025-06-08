// Specifies that this component should run on the client side.
"use client";

// Import React library.
import * as React from "react";
// Import Separator primitive components from Radix UI for building accessible separator lines.
import * as SeparatorPrimitive from "@radix-ui/react-separator";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Define the Separator component.
// It's a styled wrapper around Radix UI's SeparatorPrimitive.Root.
// Accepts all props of Radix UI's SeparatorPrimitive.Root.
function Separator({
  className, // Optional additional CSS classes for the separator element.
  orientation = "horizontal", // Orientation of the separator, defaults to horizontal.
  decorative = true, // If true, indicates the separator is for visual presentation and not structural.
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    // Use Radix UI's Root component for the separator.
    <SeparatorPrimitive.Root
      data-slot="separator-root" // Custom data attribute for styling or selection.
      decorative={decorative} // Pass the decorative prop.
      orientation={orientation} // Pass the orientation prop.
      // Apply Tailwind CSS classes for styling:
      // - bg-border: Sets the background color (which acts as the separator line color).
      // - shrink-0: Prevents the separator from shrinking in flex layouts.
      // - data-[orientation=horizontal]: Styles for horizontal orientation (height of 1px, full width).
      // - data-[orientation=vertical]: Styles for vertical orientation (full height, width of 1px).
      // 'cn' merges these default classes with any provided 'className'.
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props} // Spread any additional props to the separator element.
    />
  );
}

// Export the Separator component.
export { Separator };
