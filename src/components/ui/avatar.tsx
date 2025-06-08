// Specifies that these components should run on the client side.
"use client";

// Import React library.
import * as React from "react";
// Import Avatar primitive components from Radix UI for building accessible avatar components.
import * as AvatarPrimitive from "@radix-ui/react-avatar";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Avatar component (Root element).
// This is the main container for an avatar.
// It accepts all props that Radix UI's AvatarPrimitive.Root accepts.
function Avatar({
  className, // Optional additional CSS classes.
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    // Use Radix UI's Root component for the avatar.
    <AvatarPrimitive.Root
      data-slot="avatar" // Custom data attribute for styling or selection.
      // Apply Tailwind CSS classes:
      // - relative: For positioning child elements if needed.
      // - flex: For flexbox layout.
      // - size-8: Sets height and width (default size).
      // - shrink-0: Prevents the avatar from shrinking in flex layouts.
      // - overflow-hidden: Clips content that overflows the rounded shape.
      // - rounded-full: Makes the avatar circular.
      // 'cn' merges these default classes with any provided 'className'.
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props} // Spread any additional props.
    />
  );
}

// AvatarImage component.
// This component is used to display the actual image within the Avatar.
// It accepts all props that Radix UI's AvatarPrimitive.Image accepts.
function AvatarImage({
  className, // Optional additional CSS classes.
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    // Use Radix UI's Image component.
    <AvatarPrimitive.Image
      data-slot="avatar-image" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - aspect-square: Maintains a square aspect ratio.
      // - size-full: Makes the image take the full size of its container (the Avatar root).
      // 'cn' merges these default classes with any provided 'className'.
      className={cn("aspect-square size-full", className)}
      {...props} // Spread any additional props.
    />
  );
}

// AvatarFallback component.
// This component is displayed if the AvatarImage fails to load or is not provided.
// It typically shows initials or a generic placeholder icon.
// It accepts all props that Radix UI's AvatarPrimitive.Fallback accepts.
function AvatarFallback({
  className, // Optional additional CSS classes.
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    // Use Radix UI's Fallback component.
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - bg-muted: Sets a muted background color (from theme).
      // - flex: For centering content.
      // - size-full: Takes the full size of the Avatar root.
      // - items-center justify-center: Centers its children (e.g., initials).
      // - rounded-full: Ensures the fallback also has rounded corners if the Avatar root is circular.
      // 'cn' merges these default classes with any provided 'className'.
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props} // Spread any additional props.
    />
  );
}

// Export the Avatar components for use in other parts of the application.
export { Avatar, AvatarImage, AvatarFallback };
