// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Define the Skeleton component.
// This component is used to display a placeholder loading state,
// typically mimicking the shape of the content that will eventually load.
// Accepts all props of a standard HTML <div> element.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton" // Custom data attribute for styling or selection.
      // Apply Tailwind CSS classes for styling:
      // - bg-accent: Sets the background color to an accent color (from theme), providing the base for the skeleton.
      // - animate-pulse: Applies a pulse animation to indicate loading.
      // - rounded-md: Applies medium rounded corners.
      // 'cn' merges these default classes with any provided 'className'.
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props} // Spread any additional props to the <div> element.
    />
  );
}

// Export the Skeleton component.
export { Skeleton };
