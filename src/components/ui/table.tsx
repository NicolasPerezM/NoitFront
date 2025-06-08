// Import React library.
import * as React from "react";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Table component (Main wrapper for the HTML table).
// It includes a div container for horizontal scrolling if needed.
// Accepts all props of a standard HTML <table> element.
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    // Container div to handle overflow, making the table horizontally scrollable on smaller screens.
    <div
      data-slot="table-container" // Custom data attribute.
      className="relative w-full overflow-x-auto" // Tailwind classes for relative positioning, full width, and horizontal auto-scroll.
    >
      {/* The actual HTML table element. */}
      <table
        data-slot="table" // Custom data attribute.
        // Apply Tailwind CSS classes: full width, caption position at bottom, small text size.
        // 'cn' merges these with any provided 'className'.
        className={cn("w-full caption-bottom text-sm", className)}
        {...props} // Spread other props to the <table> element.
      />
    </div>
  );
}

// TableHeader component (<thead> element).
// Accepts all props of a standard HTML <thead> element.
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header" // Custom data attribute.
      // Apply Tailwind CSS classes: styles all direct <tr> children to have a bottom border.
      // 'cn' merges this with any provided 'className'.
      className={cn("[&_tr]:border-b", className)}
      {...props} // Spread other props.
    />
  );
}

// TableBody component (<tbody> element).
// Accepts all props of a standard HTML <tbody> element.
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body" // Custom data attribute.
      // Apply Tailwind CSS classes: ensures the last <tr> child does not have a bottom border.
      // 'cn' merges this with any provided 'className'.
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props} // Spread other props.
    />
  );
}

// TableFooter component (<tfoot> element).
// Accepts all props of a standard HTML <tfoot> element.
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer" // Custom data attribute.
      // Apply Tailwind CSS classes: muted background, top border, medium font weight.
      // Ensures the last <tr> child within the footer does not have a bottom border.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// TableRow component (<tr> element).
// Accepts all props of a standard HTML <tr> element.
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - hover:bg-muted/50: Muted background on hover.
      // - data-[state=selected]:bg-muted: Muted background if row is selected (via data attribute).
      // - border-b: Bottom border for the row.
      // - transition-colors: Smooth transition for color changes.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// TableHead component (<th> element - table header cell).
// Accepts all props of a standard HTML <th> element.
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - text-foreground: Default text color.
      // - h-10, px-2: Fixed height and horizontal padding.
      // - text-left, align-middle: Text and vertical alignment.
      // - font-medium: Medium font weight.
      // - whitespace-nowrap: Prevents text wrapping.
      // - [&:has([role=checkbox])]:pr-0: Removes right padding if it contains a checkbox.
      // - [&>[role=checkbox]]:translate-y-[2px]: Adjusts vertical position of a direct child checkbox.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// TableCell component (<td> element - table data cell).
// Accepts all props of a standard HTML <td> element.
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - p-2: Padding.
      // - align-middle: Vertical alignment.
      // - whitespace-nowrap: Prevents text wrapping.
      // - Styling for cells containing checkboxes, similar to TableHead.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// TableCaption component (<caption> element for the table).
// Accepts all props of a standard HTML <caption> element.
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption" // Custom data attribute.
      // Apply Tailwind CSS classes: muted text color, top margin, small text size.
      // 'cn' merges these with any provided 'className'.
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props} // Spread other props.
    />
  );
}

// Export all Table components for use in the application.
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
