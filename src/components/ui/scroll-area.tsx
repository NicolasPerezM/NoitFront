// Import React library.
import * as React from "react";
// Import ScrollArea primitive components from Radix UI for building accessible scrollable areas.
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// ScrollArea component (Main container for a scrollable area).
// It wraps Radix UI's ScrollAreaPrimitive.Root and includes Viewport, ScrollBar, and Corner.
// Accepts all props of Radix UI's ScrollAreaPrimitive.Root.
function ScrollArea({
  className, // Optional additional CSS classes for the root element.
  children, // Content to be made scrollable.
  ...props // Spread other props to the underlying Radix Root component.
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    // Radix UI's Root component for the scroll area.
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area" // Custom data attribute for styling.
      // Apply Tailwind CSS classes: relative positioning.
      // 'cn' merges this with any provided 'className'.
      className={cn("relative", className)}
      {...props} // Spread other props.
    >
      {/* Radix UI's Viewport component, which contains the scrollable content. */}
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport" // Custom data attribute.
        // Apply Tailwind CSS classes:
        // - focus-visible: styles for focus state (accessibility).
        // - size-full: Takes the full size of its parent.
        // - rounded-[inherit]: Inherits rounded corners from the parent.
        // - transition-[color,box-shadow]: Smooth transitions.
        // - outline-none: Removes default browser outline.
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children} {/* Render the scrollable content. */}
      </ScrollAreaPrimitive.Viewport>
      {/* Custom ScrollBar component (defined below). */}
      <ScrollBar />
      {/* Radix UI's Corner component, displayed when both scrollbars are visible. */}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

// ScrollBar component (Visual scrollbar, either vertical or horizontal).
// It wraps Radix UI's ScrollAreaPrimitive.ScrollAreaScrollbar and ScrollAreaPrimitive.ScrollAreaThumb.
// Accepts all props of Radix UI's ScrollAreaPrimitive.ScrollAreaScrollbar.
function ScrollBar({
  className, // Optional additional CSS classes for the scrollbar track.
  orientation = "vertical", // Orientation of the scrollbar, defaults to vertical.
  ...props // Spread other props to the underlying Radix ScrollAreaScrollbar component.
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    // Radix UI's ScrollAreaScrollbar component (the track of the scrollbar).
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar" // Custom data attribute.
      orientation={orientation} // Pass orientation prop.
      // Apply Tailwind CSS classes:
      // - flex, touch-none, p-px, transition-colors, select-none: Base styles for interaction and appearance.
      // Conditional styles based on orientation:
      // - Vertical: full height, fixed width, left border.
      // - Horizontal: fixed height, column flex direction, top border.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props} // Spread other props.
    >
      {/* Radix UI's ScrollAreaThumb component (the draggable part of the scrollbar). */}
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb" // Custom data attribute.
        // Apply Tailwind CSS classes:
        // - bg-border: Background color using a theme variable.
        // - relative, flex-1, rounded-full: Layout and appearance.
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

// Export the ScrollArea and ScrollBar components.
export { ScrollArea, ScrollBar };
