// Import React library.
import * as React from "react";
// Import Popover primitive components from Radix UI for building accessible popover components.
import * as PopoverPrimitive from "@radix-ui/react-popover";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Popover component (Root element for a popover).
// Re-exports Radix UI's PopoverPrimitive.Root with a data-slot attribute for potential styling.
// Accepts all props of Radix UI's PopoverPrimitive.Root.
function Popover({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

// PopoverTrigger component (Element that opens the popover).
// Re-exports Radix UI's PopoverPrimitive.Trigger with a data-slot attribute.
// Accepts all props of Radix UI's PopoverPrimitive.Trigger.
function PopoverTrigger({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

// PopoverContent component (The content displayed within the popover).
// It's styled with Tailwind CSS classes for appearance and animations, and uses PopoverPrimitive.Portal.
// Accepts all props of Radix UI's PopoverPrimitive.Content.
function PopoverContent({
  className, // Optional additional CSS classes.
  align = "center", // Default alignment of the popover relative to the trigger.
  sideOffset = 4, // Default offset from the trigger.
  ...props // Spread other props.
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    // Use PopoverPrimitive.Portal to render the content in a portal,
    // ensuring it can appear above other elements in the DOM.
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content" // Custom data attribute.
        align={align} // Pass alignment prop.
        sideOffset={sideOffset} // Pass side offset prop.
        // Apply Tailwind CSS classes for styling and animations:
        // - bg-popover, text-popover-foreground: Themed background and text colors.
        // - data-[state=open/closed]: Animations for open/closed states (fade, zoom, slide).
        // - z-50: High z-index.
        // - w-72: Fixed width.
        // - origin-(--radix-popover-content-transform-origin): Uses Radix's CSS variable for transform origin.
        // - rounded-md, border, p-4, shadow-md: Appearance styling.
        // - outline-hidden: Hides default browser outline (focus styles are likely handled by Radix).
        // 'cn' merges these with any provided 'className'.
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props} // Spread other props.
      />
    </PopoverPrimitive.Portal>
  );
}

// PopoverAnchor component (Optional element to position the popover against, if not using a trigger).
// Re-exports Radix UI's PopoverPrimitive.Anchor with a data-slot attribute.
// Accepts all props of Radix UI's PopoverPrimitive.Anchor.
function PopoverAnchor({
  ...props // Spread other props.
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

// Export all Popover components for use in the application.
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
