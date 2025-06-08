// Import React library.
import * as React from "react";
// Import Slot component from Radix UI, used for component composition without adding extra DOM elements.
import { Slot } from "@radix-ui/react-slot";
// Import cva (class-variance-authority) for creating CSS class variants, and VariantProps type.
import { cva, type VariantProps } from "class-variance-authority";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Define badge variants using cva.
// This sets up base styles and different visual styles (variants) for the badge.
const badgeVariants = cva(
  // Base classes applied to all badges.
  // - inline-flex, items-center, justify-center: For layout and alignment of content within the badge.
  // - rounded-md: Applies medium rounded corners.
  // - border: Adds a default border.
  // - px-2, py-0.5: Padding on X and Y axes.
  // - text-xs, font-medium: Small text size and medium font weight.
  // - w-fit: Sets width to fit content.
  // - whitespace-nowrap: Prevents text wrapping.
  // - shrink-0: Prevents shrinking in flex layouts.
  // - [&>svg]:size-3, gap-1, [&>svg]:pointer-events-none: Styles for SVG icons within the badge (size, gap, non-interactive).
  // - focus-visible: styles for focus state (accessibility).
  // - aria-invalid: styles for invalid state.
  // - transition-[color,box-shadow]: Smooth transitions for color and box-shadow changes.
  // - overflow-hidden: Clips content that overflows.
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    // Define different visual variants for the badge.
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90", // Default style: primary background, primary text color, transparent border. Hover effect for links.
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90", // Secondary style: secondary background and text, transparent border. Hover effect for links.
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60", // Destructive style: destructive background, white text, transparent border. Specific focus and dark mode styles.
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground", // Outline style: foreground text color, default border. Hover effect changes background and text to accent colors.
      },
    },
    // Set the default variant if none is specified.
    defaultVariants: {
      variant: "default",
    },
  }
);

// Badge component definition.
// It accepts standard HTML span props, variant props defined by badgeVariants, and an 'asChild' prop.
function Badge({
  className, // Optional additional CSS classes.
  variant, // The visual variant of the badge.
  asChild = false, // If true, renders the component as a Slot, merging its props and behavior with its immediate child.
  ...props // Spread other props to the underlying component (span or Slot).
}: React.ComponentProps<"span"> & // Extends span element props.
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) { // Adds variant props and asChild prop.
  // Determine whether to render as a Slot or a span element based on 'asChild' prop.
  const Comp = asChild ? Slot : "span";

  return (
    // Render the chosen component (Slot or span).
    <Comp
      data-slot="badge" // Custom data attribute for styling or selection.
      // Apply class names: uses 'cn' to merge classes from badgeVariants (based on the 'variant' prop) with any provided 'className'.
      className={cn(badgeVariants({ variant }), className)}
      {...props} // Spread any additional props.
    />
  );
}

// Export the Badge component and badgeVariants (useful for consumers who might want to use the variants directly).
export { Badge, badgeVariants };
