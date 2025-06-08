// Import React library.
import * as React from "react";
// Import Slot component from Radix UI for component composition.
import { Slot } from "@radix-ui/react-slot";
// Import cva (class-variance-authority) for creating CSS class variants, and VariantProps type.
import { cva, type VariantProps } from "class-variance-authority";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Define button variants using cva.
// This sets up base styles and different visual styles (variants) and sizes for the button.
const buttonVariants = cva(
  // Base classes applied to all buttons.
  // - inline-flex, items-center, justify-center, gap-2: For layout and alignment of content.
  // - whitespace-nowrap: Prevents text wrapping.
  // - rounded-md: Applies medium rounded corners.
  // - text-sm, font-medium: Text size and font weight.
  // - transition-all: Smooth transitions for all animatable properties.
  // - disabled: styles for disabled state (non-interactive, reduced opacity).
  // - [&_svg]:styles: Styles for SVG icons within the button (non-interactive, default size, shrink control).
  // - outline-none, focus-visible: styles for focus state (accessibility).
  // - aria-invalid: styles for invalid state.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    // Define different visual variants for the button.
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90", // Default style: primary background and text, small shadow, hover effect.
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60", // Destructive style: destructive background, white text, specific focus and dark mode styles.
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50", // Outline style: border, background color, hover effects, specific dark mode styles.
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80", // Secondary style: secondary background and text, hover effect.
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50", // Ghost style: transparent background, hover effects.
        link: "text-primary underline-offset-4 hover:underline", // Link style: primary text color, underline on hover.
      },
      // Define different sizes for the button.
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3", // Default size: specific height, padding. Adjusts padding if SVG is present.
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5", // Small size: specific height, padding, gap.
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4", // Large size: specific height, padding.
        icon: "size-9", // Icon size: square button, fixed size.
      },
    },
    // Set default variants if none are specified.
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Button component definition.
// Accepts standard HTML button props, variant and size props defined by buttonVariants, and an 'asChild' prop.
function Button({
  className, // Optional additional CSS classes.
  variant, // The visual variant of the button.
  size, // The size of the button.
  asChild = false, // If true, renders as a Slot, merging props with its child.
  ...props // Spread other props to the underlying component (button or Slot).
}: React.ComponentProps<"button"> & // Extends button element props.
  VariantProps<typeof buttonVariants> & { // Adds variant and size props.
    asChild?: boolean; // Optional asChild prop.
  }) {
  // Determine component type based on 'asChild'.
  const Comp = asChild ? Slot : "button";

  return (
    // Render the chosen component (Slot or button).
    <Comp
      data-slot="button" // Custom data attribute for styling or selection.
      // Apply class names: uses 'cn' to merge classes from buttonVariants (based on variant, size, and className) with any provided 'className'.
      // Note: It seems 'className' is passed to buttonVariants here, which might be slightly different from other components where it's merged after cva.
      // This means 'className' could potentially override variant styles if not handled carefully by 'cn' or cva.
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} // Spread any additional props.
    />
  );
}

// Export the Button component and buttonVariants.
export { Button, buttonVariants };
