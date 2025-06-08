// Specifies that these components should run on the client side.
"use client";

// Import React library.
import * as React from "react";
// Import Dialog primitive components from Radix UI, which Sheet is built upon.
// Sheet is essentially a dialog styled as a side panel.
import * as SheetPrimitive from "@radix-ui/react-dialog";
// Import XIcon from lucide-react for the close button.
import { XIcon } from "lucide-react";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Sheet component (Root element for a sheet).
// Re-exports Radix UI's DialogPrimitive.Root with a data-slot attribute.
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

// SheetTrigger component (Element that opens the sheet).
// Re-exports Radix UI's DialogPrimitive.Trigger with a data-slot attribute.
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

// SheetClose component (Element that closes the sheet).
// Re-exports Radix UI's DialogPrimitive.Close with a data-slot attribute.
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

// SheetPortal component (Portals its children, typically the SheetContent).
// Re-exports Radix UI's DialogPrimitive.Portal with a data-slot attribute.
function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

// SheetOverlay component (Dimmed background behind the sheet content).
// Styled with Tailwind CSS for appearance and animations.
function SheetOverlay({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay" // Custom data attribute.
      // Apply Tailwind CSS classes for styling and animations (fade-in/out).
      // Similar to DialogOverlay.
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// SheetContent component (The main content area of the sheet).
// Styled with Tailwind CSS for slide-in/out animations based on the 'side' prop.
function SheetContent({
  className, // Optional additional CSS classes.
  children, // Content to be rendered within the sheet.
  side = "right", // Side from which the sheet appears, defaults to 'right'.
  ...props // Spread other props.
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"; // Type definition for the 'side' prop.
}) {
  return (
    // Use SheetPortal to render the content in a portal.
    <SheetPortal>
      {/* Render the overlay behind the content. */}
      <SheetOverlay />
      {/* Radix UI's Content component, styled as a sheet. */}
      <SheetPrimitive.Content
        data-slot="sheet-content" // Custom data attribute.
        // Apply Tailwind CSS classes for base styling, animations, and side-specific positioning/animations.
        // - bg-background: Themed background color.
        // - data-[state=open/closed]: Base animations.
        // - fixed, z-50, flex, flex-col, gap-4, shadow-lg, transition, duration: Core layout and behavior.
        // Conditional classes based on 'side' prop for slide-in/out animations and positioning.
        // 'cn' merges these with any provided 'className'.
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props} // Spread other props.
      >
        {children} {/* Render the sheet's content. */}
        {/* Radix UI's Close component for the close button, styled with Tailwind CSS. */}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" /> {/* Close icon. */}
          <span className="sr-only">Close</span> {/* Screen-reader only text. */}
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

// SheetHeader component (Header section within SheetContent).
// Styled with Tailwind CSS.
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header" // Custom data attribute.
      // Apply Tailwind CSS classes: flex layout, column direction, gap, padding.
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props} // Spread other props.
    />
  );
}

// SheetFooter component (Footer section within SheetContent).
// Styled with Tailwind CSS.
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer" // Custom data attribute.
      // Apply Tailwind CSS classes: margin-top auto (pushes to bottom), flex layout, column direction, gap, padding.
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props} // Spread other props.
    />
  );
}

// SheetTitle component (Title text within SheetHeader).
// Re-exports Radix UI's DialogPrimitive.Title (as Sheet is built on Dialog) with styling.
function SheetTitle({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title" // Custom data attribute.
      // Apply Tailwind CSS classes: foreground text color, semi-bold font weight.
      className={cn("text-foreground font-semibold", className)}
      {...props} // Spread other props.
    />
  );
}

// SheetDescription component (Descriptive text, usually below SheetTitle).
// Re-exports Radix UI's DialogPrimitive.Description with styling.
function SheetDescription({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description" // Custom data attribute.
      // Apply Tailwind CSS classes: muted text color, small text size.
      className={cn("text-muted-foreground text-sm", className)}
      {...props} // Spread other props.
    />
  );
}

// Export all Sheet components for use in the application.
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
