// Import React library.
import * as React from "react";
// Import Checkbox primitive components from Radix UI for building accessible checkbox components.
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
// Import CheckIcon from lucide-react to display the checkmark.
import { CheckIcon } from "lucide-react";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Define the Checkbox component.
// It wraps Radix UI's CheckboxPrimitive.Root and CheckboxPrimitive.Indicator.
// Accepts all props that Radix UI's CheckboxPrimitive.Root accepts.
function Checkbox({
  className, // Optional additional CSS classes for the root checkbox element.
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    // Use Radix UI's Root component for the checkbox.
    <CheckboxPrimitive.Root
      data-slot="checkbox" // Custom data attribute for styling or selection.
      // Apply Tailwind CSS classes:
      // - peer: For styling based on sibling state (e.g., a label).
      // - border-input: Default border color.
      // - dark:bg-input/30: Background color in dark mode.
      // - data-[state=checked]: styles for checked state (background, text, border color).
      // - focus-visible: styles for focus state (accessibility).
      // - aria-invalid: styles for invalid state.
      // - size-4, shrink-0: Fixed size, prevents shrinking in flex layouts.
      // - rounded-[4px]: Slightly rounded corners.
      // - border, shadow-xs: Default border and small shadow.
      // - transition-shadow: Smooth transition for shadow changes.
      // - outline-none: Removes default browser outline.
      // - disabled: styles for disabled state (cursor, opacity).
      // 'cn' merges these default classes with any provided 'className'.
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props} // Spread any additional props.
    >
      {/* Radix UI's Indicator component, which visually represents the checked state. */}
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator" // Custom data attribute.
        // Apply Tailwind CSS classes:
        // - flex, items-center, justify-center: For centering the check icon.
        // - text-current: Inherits text color (used for the check icon's color).
        // - transition-none: Disables transitions for the indicator itself (transitions are on the root).
        className="flex items-center justify-center text-current transition-none"
      >
        {/* CheckIcon component with a fixed size. */}
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

// Export the Checkbox component.
export { Checkbox };
