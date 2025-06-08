// Import React library.
import * as React from "react";
// Import Dialog primitive components from Radix UI for building accessible dialog modals.
import * as DialogPrimitive from "@radix-ui/react-dialog";
// Import XIcon from lucide-react for the close button.
import { XIcon } from "lucide-react";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Dialog component (Root element for a dialog).
// Re-exports Radix UI's DialogPrimitive.Root with a data-slot attribute.
// Accepts all props of Radix UI's DialogPrimitive.Root.
function Dialog({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

// DialogTrigger component (Element that opens the dialog).
// Re-exports Radix UI's DialogPrimitive.Trigger with a data-slot attribute.
// Accepts all props of Radix UI's DialogPrimitive.Trigger.
function DialogTrigger({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

// DialogPortal component (Portals its children into a new React tree, typically at the end of document.body).
// This is useful for ensuring the dialog appears above other content.
// Re-exports Radix UI's DialogPrimitive.Portal with a data-slot attribute.
// Accepts all props of Radix UI's DialogPrimitive.Portal.
function DialogPortal({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

// DialogClose component (Element that closes the dialog).
// Re-exports Radix UI's DialogPrimitive.Close with a data-slot attribute.
// Accepts all props of Radix UI's DialogPrimitive.Close.
function DialogClose({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

// DialogOverlay component (Dimmed background behind the dialog content).
// Accepts all props of Radix UI's DialogPrimitive.Overlay.
function DialogOverlay({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay" // Custom data attribute.
      // Apply Tailwind CSS classes for styling and animations:
      // - data-[state=open/closed]:animate-in/out: Apply animations based on open/closed state.
      // - fade-in-0, fade-out-0: Fade animations.
      // - fixed, inset-0, z-50: Fullscreen fixed positioning with high z-index.
      // - bg-black/50: Semi-transparent black background.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// DialogContent component (The main content area of the dialog).
// Accepts all props of Radix UI's DialogPrimitive.Content.
function DialogContent({
  className, // Optional additional CSS classes.
  children, // Content to be rendered within the dialog.
  ...props // Spread other props.
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    // Use DialogPortal to render the content outside the main DOM hierarchy.
    <DialogPortal data-slot="dialog-portal">
      {/* Render the overlay behind the content. */}
      <DialogOverlay />
      {/* Radix UI's Content component for the dialog's main body. */}
      <DialogPrimitive.Content
        data-slot="dialog-content" // Custom data attribute.
        // Apply Tailwind CSS classes for styling and animations:
        // - bg-background: Themed background color.
        // - data-[state=open/closed]:animate-in/out: Animations for open/closed states.
        // - fade-in-0, fade-out-0, zoom-in-95, zoom-out-95: Fade and zoom animations.
        // - fixed, top-[50%], left-[50%], z-50: Centered fixed positioning with high z-index.
        // - grid, w-full, translate-x-[-50%], translate-y-[-50%]: Layout and centering.
        // - gap-4, rounded-lg, border, p-6, shadow-lg: Spacing, rounded corners, border, padding, shadow.
        // - duration-200: Animation duration.
        // - sm:max-w-lg: Max width on small screens and above.
        // 'cn' merges these with any provided 'className'.
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full  translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props} // Spread other props.
      >
        {children} {/* Render the dialog's content. */}
        {/* Radix UI's Close component for the close button. */}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon /> {/* Close icon. */}
          <span className="sr-only">Close</span> {/* Screen-reader only text. */}
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

// DialogHeader component (Header section within DialogContent).
// Accepts all props of a standard HTML <div> element.
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - flex, flex-col, gap-2: Flexbox layout, column direction, spacing.
      // - text-center, sm:text-left: Text alignment, responsive.
      // 'cn' merges these with any provided 'className'.
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props} // Spread other props.
    />
  );
}

// DialogFooter component (Footer section within DialogContent).
// Accepts all props of a standard HTML <div> element.
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - flex, flex-col-reverse, gap-2: Flexbox layout, column-reverse on small screens, spacing.
      // - sm:flex-row, sm:justify-end: Row direction and end justification on small screens and above.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// DialogTitle component (Title text within DialogHeader).
// Re-exports Radix UI's DialogPrimitive.Title with styling.
// Accepts all props of Radix UI's DialogPrimitive.Title.
function DialogTitle({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - text-lg: Large text size.
      // - leading-none: Tight line height.
      // - font-semibold: Semi-bold font weight.
      // 'cn' merges these with any provided 'className'.
      className={cn("text-lg leading-none font-semibold", className)}
      {...props} // Spread other props.
    />
  );
}

// DialogDescription component (Descriptive text, usually below DialogTitle).
// Re-exports Radix UI's DialogPrimitive.Description with styling.
// Accepts all props of Radix UI's DialogPrimitive.Description.
function DialogDescription({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - text-muted-foreground: Muted text color.
      // - text-sm: Small text size.
      // 'cn' merges these with any provided 'className'.
      className={cn("text-muted-foreground text-sm", className)}
      {...props} // Spread other props.
    />
  );
}

// Export all Dialog components for use in the application.
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
