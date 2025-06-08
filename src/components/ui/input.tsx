// Import React library.
import * as React from "react";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Define the Input component.
// It's a styled wrapper around the standard HTML <input> element.
// Accepts all props of a standard HTML <input> element.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type} // Propagate the 'type' attribute (e.g., "text", "password", "email").
      data-slot="input" // Custom data attribute for styling or selection.
      // Apply Tailwind CSS classes for styling.
      // 'cn' merges several groups of classes with any provided 'className'.
      className={cn(
        // Base styles:
        // - file:text-foreground: Styles for the file input button text.
        // - placeholder:text-muted-foreground: Styles for placeholder text.
        // - selection:bg-primary, selection:text-primary-foreground: Styles for selected text.
        // - dark:bg-input/30: Background color in dark mode.
        // - border-input: Default border color.
        // - flex, h-9, w-full, min-w-0: Layout and sizing.
        // - rounded-md, border, bg-transparent: Appearance.
        // - px-3, py-1: Padding.
        // - text-base, md:text-sm: Text size, responsive.
        // - shadow-xs: Small shadow.
        // - transition-[color,box-shadow]: Smooth transitions for color and box-shadow.
        // - outline-none: Removes default browser outline.
        // - file: styles for file input button appearance.
        // - disabled: styles for disabled state.
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Focus visible styles (for accessibility):
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        // ARIA invalid styles (for validation feedback):
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className // Merge with any additional classes provided via props.
      )}
      {...props} // Spread any other props to the <input> element.
    />
  );
}

// Export the Input component.
export { Input };
