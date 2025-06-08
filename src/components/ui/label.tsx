// Import React library.
import * as React from "react";
// Import Label primitive components from Radix UI for building accessible label components.
import * as LabelPrimitive from "@radix-ui/react-label";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Define the Label component.
// It's a styled wrapper around Radix UI's LabelPrimitive.Root.
// Accepts all props that Radix UI's LabelPrimitive.Root accepts.
function Label({
  className, // Optional additional CSS classes for the label element.
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    // Use Radix UI's Root component for the label.
    <LabelPrimitive.Root
      data-slot="label" // Custom data attribute for styling or selection.
      // Apply Tailwind CSS classes for styling:
      // - flex, items-center, gap-2: For layout if the label contains an icon or other elements.
      // - text-sm, leading-none, font-medium: Text styling.
      // - select-none: Makes the label text non-selectable.
      // - group-data-[disabled=true]: Styles for when a parent group is disabled.
      // - peer-disabled: Styles for when a related peer element (e.g., an input) is disabled.
      // 'cn' merges these default classes with any provided 'className'.
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props} // Spread any additional props to the <label> element.
    />
  );
}

// Export the Label component.
export { Label };
