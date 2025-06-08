// Import React library.
import * as React from "react";
// Import Slot component from Radix UI for component composition.
import { Slot } from "@radix-ui/react-slot";
// Import icons from lucide-react.
import { ChevronRight, MoreHorizontal } from "lucide-react"; // ChevronRight for separator, MoreHorizontal for ellipsis.

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Breadcrumb component (Root navigation container).
// Accepts all props of a standard HTML <nav> element.
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  // Renders a <nav> element with ARIA label for accessibility and a data-slot for styling.
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

// BreadcrumbList component (Ordered list for breadcrumb items).
// Accepts all props of a standard HTML <ol> element.
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - text-muted-foreground: Sets default text color to muted.
      // - flex, flex-wrap, items-center: For flexbox layout, allowing wrapping and vertical alignment.
      // - gap-1.5, sm:gap-2.5: Spacing between items, responsive.
      // - text-sm: Small text size.
      // - break-words: Allows long words to break to prevent overflow.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// BreadcrumbItem component (List item for each breadcrumb link/page).
// Accepts all props of a standard HTML <li> element.
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - inline-flex, items-center, gap-1.5: For layout of content within the item.
      // 'cn' merges these with any provided 'className'.
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props} // Spread other props.
    />
  );
}

// BreadcrumbLink component (Clickable link within a breadcrumb item).
// Accepts all props of a standard HTML <a> element, plus an 'asChild' prop.
function BreadcrumbLink({
  asChild, // If true, renders as a Slot, merging with its child.
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  // Determine component type based on 'asChild'.
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - hover:text-foreground: Changes text color on hover.
      // - transition-colors: Smooth color transition.
      // 'cn' merges these with any provided 'className'.
      className={cn("hover:text-foreground transition-colors", className)}
      {...props} // Spread other props.
    />
  );
}

// BreadcrumbPage component (Current page indicator, usually not a link).
// Accepts all props of a standard HTML <span> element.
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page" // Custom data attribute.
      role="link" // ARIA role indicating it behaves like a link (semantically).
      aria-disabled="true" // ARIA attribute indicating it's disabled (not interactive).
      aria-current="page" // ARIA attribute indicating it's the current page.
      // Apply Tailwind CSS classes:
      // - text-foreground: Sets text color to the default foreground color.
      // - font-normal: Normal font weight.
      // 'cn' merges these with any provided 'className'.
      className={cn("text-foreground font-normal", className)}
      {...props} // Spread other props.
    />
  );
}

// BreadcrumbSeparator component (Separator between breadcrumb items).
// Accepts all props of a standard HTML <li> element.
function BreadcrumbSeparator({
  children, // Optional children to override the default ChevronRight icon.
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator" // Custom data attribute.
      role="presentation" // ARIA role indicating it's for presentation only.
      aria-hidden="true" // ARIA attribute hiding it from assistive technologies.
      // Apply Tailwind CSS classes:
      // - [&>svg]:size-3.5: Styles the size of any direct SVG child (like the ChevronRight icon).
      // 'cn' merges these with any provided 'className'.
      className={cn("[&>svg]:size-3.5", className)}
      {...props} // Spread other props.
    >
      {/* Render children if provided, otherwise render the ChevronRight icon. */}
      {children ?? <ChevronRight />}
    </li>
  );
}

// BreadcrumbEllipsis component (Indicates omitted breadcrumb items).
// Accepts all props of a standard HTML <span> element.
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis" // Custom data attribute.
      role="presentation" // ARIA role indicating it's for presentation only.
      aria-hidden="true" // ARIA attribute hiding it from assistive technologies.
      // Apply Tailwind CSS classes:
      // - flex, size-9, items-center, justify-center: For layout and sizing of the ellipsis container.
      // 'cn' merges these with any provided 'className'.
      className={cn("flex size-9 items-center justify-center", className)}
      {...props} // Spread other props.
    >
      {/* MoreHorizontal icon for the ellipsis. */}
      <MoreHorizontal className="size-4" />
      {/* Screen-reader only text for accessibility. */}
      <span className="sr-only">More</span>
    </span>
  );
}

// Export all Breadcrumb components for use in the application.
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
