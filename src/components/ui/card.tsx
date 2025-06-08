// Import React library.
import * as React from "react";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Card component (Root element for a card).
// Accepts all props of a standard HTML <div> element.
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card" // Custom data attribute for styling or selection.
      // Apply Tailwind CSS classes:
      // - bg-card, text-card-foreground: Themed background and text colors.
      // - shadow-md: Medium shadow.
      // - flex, flex-col: Flexbox layout, column direction.
      // - rounded-xl: Extra large rounded corners.
      // - py-4, gap-2: Vertical padding and gap between child elements.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "bg-card text-card-foreground shadow-md flex flex-col rounded-xl py-4 gap-2",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// CardHeader component (Header section of a card).
// Accepts all props of a standard HTML <div> element.
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - @container/card-header: Defines a container query context named 'card-header'.
      // - grid, auto-rows-min, grid-rows-[auto_auto]: Grid layout properties.
      // - items-start, gap-1.5, px-4: Alignment, gap, and horizontal padding.
      // - has-data-[slot=card-action]:grid-cols-[1fr_auto]: Conditional grid columns if a CardAction is present.
      // - [.border-b]:pb-4: Adds bottom padding if a bottom border is present (via a class like 'border-b').
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-4",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// CardTitle component (Title text within a CardHeader).
// Accepts all props of a standard HTML <div> element.
// Note: While it's a div, it's meant to hold title text, often an <h2> or similar.
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - leading-none: Tight line height.
      // - font-semibold: Semi-bold font weight.
      // 'cn' merges these with any provided 'className'.
      className={cn("leading-none font-semibold", className)}
      {...props} // Spread other props.
    />
  );
}

// CardDescription component (Descriptive text, usually below CardTitle).
// Accepts all props of a standard HTML <div> element.
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - text-muted-foreground: Muted text color.
      // - text-sm: Small text size.
      // 'cn' merges these with any provided 'className'.
      className={cn("text-muted-foreground text-sm", className)}
      {...props} // Spread other props.
    />
  );
}

// CardAction component (Container for actions, often buttons, within a CardHeader).
// Accepts all props of a standard HTML <div> element.
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action" // Custom data attribute.
      // Apply Tailwind CSS classes for grid positioning within CardHeader if CardHeader uses the conditional grid.
      // - col-start-2, row-span-2, row-start-1: Places it in the second column, spanning two rows, starting at the first row.
      // - self-start, justify-self-end: Alignment within its grid cell.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// CardContent component (Main content area of a card).
// Accepts all props of a standard HTML <div> element.
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - px-4: Horizontal padding.
      // 'cn' merges these with any provided 'className'.
      className={cn("px-4", className)}
      {...props} // Spread other props.
    />
  );
}

// CardFooter component (Footer section of a card).
// Accepts all props of a standard HTML <div> element.
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - flex, items-center: Flexbox layout, vertically centered items.
      // - px-6: Horizontal padding.
      // - [.border-t]:pt-6: Adds top padding if a top border is present (via a class like 'border-t').
      // 'cn' merges these with any provided 'className'.
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props} // Spread other props.
    />
  );
}

// Export all Card components for use in the application.
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
