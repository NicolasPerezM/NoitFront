// Import React library.
import * as React from "react";
// Import Tooltip primitive components from Radix UI for building accessible tooltips.
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// TooltipProvider component (Root provider for tooltips, manages global state like delay).
// It's a styled wrapper around Radix UI's TooltipPrimitive.Provider.
// Accepts all props of Radix UI's TooltipPrimitive.Provider.
function TooltipProvider({
  delayDuration = 0, // Default delay duration for showing the tooltip.
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    // Use Radix UI's Provider component.
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider" // Custom data attribute for styling or selection.
      delayDuration={delayDuration} // Pass delayDuration prop.
      {...props} // Spread any additional props.
    />
  );
}

// Tooltip component (Main component for a single tooltip instance).
// It wraps Radix UI's TooltipPrimitive.Root and implicitly uses TooltipProvider.
// Accepts all props of Radix UI's TooltipPrimitive.Root.
function Tooltip({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    // Each Tooltip instance is wrapped in its own TooltipProvider.
    // This allows individual control over delayDuration if needed, though here it uses the default.
    <TooltipProvider>
      {/* Radix UI's Root component for the tooltip. */}
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

// TooltipTrigger component (The element that triggers the tooltip on hover or focus).
// It's a styled wrapper around Radix UI's TooltipPrimitive.Trigger.
// Accepts all props of Radix UI's TooltipPrimitive.Trigger.
function TooltipTrigger({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  // Radix UI's Trigger component.
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

// TooltipContent component (The content displayed within the tooltip).
// It's styled with Tailwind CSS and includes an arrow.
// Uses TooltipPrimitive.Portal to render the content in a portal.
// Accepts all props of Radix UI's TooltipPrimitive.Content.
function TooltipContent({
  className, // Optional additional CSS classes for the tooltip content.
  sideOffset = 0, // Default offset from the trigger.
  children, // Content to be displayed in the tooltip.
  ...props // Spread other props.
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    // Radix UI's Portal component to render the tooltip content outside the main DOM hierarchy.
    <TooltipPrimitive.Portal>
      {/* Radix UI's Content component for the tooltip's main body. */}
      <TooltipPrimitive.Content
        data-slot="tooltip-content" // Custom data attribute.
        sideOffset={sideOffset} // Pass sideOffset prop.
        // Apply Tailwind CSS classes for styling and animations:
        // - bg-primary, text-primary-foreground: Themed background and text colors.
        // - animate-in, fade-in-0, zoom-in-95: Entrance animations.
        // - data-[state=closed]:animate-out, etc.: Exit animations based on state.
        // - data-[side=...]: Slide-in animations based on the side the tooltip appears on.
        // - z-50, w-fit: High z-index and width to fit content.
        // - origin-(--radix-tooltip-content-transform-origin): Uses Radix's CSS variable for transform origin.
        // - rounded-md, px-3, py-1.5, text-xs, text-balance: Appearance and text styling.
        // 'cn' merges these default classes with any provided 'className'.
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props} // Spread any additional props.
      >
        {children} {/* Render the tooltip's content. */}
        {/* Radix UI's Arrow component to display a small arrow pointing to the trigger. */}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

// Export all Tooltip components for use in the application.
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
