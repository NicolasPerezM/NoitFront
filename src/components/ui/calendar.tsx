// Import React library.
import * as React from "react";
// Import ChevronLeft and ChevronRight icons from lucide-react for navigation.
import { ChevronLeft, ChevronRight } from "lucide-react";
// Import DayPicker component from react-day-picker library.
import { DayPicker } from "react-day-picker";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";
// Import buttonVariants from a local button component, likely for styling navigation buttons.
import { buttonVariants } from "@/components/ui/button";

// Define the Calendar component.
// It wraps the DayPicker component from react-day-picker and provides custom styling.
// Accepts all props that DayPicker accepts.
function Calendar({
  className, // Optional additional CSS classes for the root DayPicker element.
  classNames, // Optional object to provide custom class names for internal DayPicker elements.
  showOutsideDays = true, // Whether to show days from previous/next months, defaults to true.
  ...props // Spread other props to the DayPicker component.
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays} // Propagate showOutsideDays prop.
      // Apply base padding and merge with any provided className.
      className={cn("p-3", className)}
      // Provide custom class names for various parts of the calendar.
      // These classes use Tailwind CSS for styling.
      classNames={{
        months: "flex flex-col sm:flex-row gap-2", // Styles for the container of all months.
        month: "flex flex-col gap-4", // Styles for a single month container.
        caption: "flex justify-center pt-1 relative items-center w-full", // Styles for the month caption (e.g., "June 2024").
        caption_label: "text-sm font-medium", // Styles for the text within the caption.
        nav: "flex items-center gap-1", // Styles for the navigation container (previous/next month buttons).
        nav_button: cn( // Styles for navigation buttons, using buttonVariants for base styling.
          buttonVariants({ variant: "outline" }), // Apply outline button style.
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100" // Custom size, transparent background, padding, opacity.
        ),
        nav_button_previous: "absolute left-1", // Position previous month button to the left.
        nav_button_next: "absolute right-1", // Position next month button to the right.
        table: "w-full border-collapse space-x-1", // Styles for the table displaying days.
        head_row: "flex", // Styles for the row of weekday headers.
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]", // Styles for weekday header cells.
        row: "flex w-full mt-2", // Styles for each week row.
        cell: cn( // Styles for individual day cells.
          // Base cell styles: relative positioning, no padding, centered text, focus styles.
          // Styles for selected days: accent background, rounded corners for range end.
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          // Conditional styles based on selection mode (single or range).
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md" // Styles for range selection (start, end, middle).
            : "[&:has([aria-selected])]:rounded-md" // Styles for single day selection.
        ),
        day: cn( // Styles for individual day elements (buttons).
          buttonVariants({ variant: "ghost" }), // Apply ghost button style.
          "size-8 p-0 font-normal aria-selected:opacity-100" // Custom size, padding, font weight, opacity for selected days.
        ),
        day_range_start: // Styles for the start day of a selected range.
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end: // Styles for the end day of a selected range.
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected: // Styles for a selected day (single or range).
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground", // Styles for the current day.
        day_outside: // Styles for days outside the current month.
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50", // Styles for disabled days.
        day_range_middle: // Styles for days in the middle of a selected range.
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible", // Styles for hidden days (e.g., if hiding outside days).
        ...classNames, // Merge with any custom classNames prop passed to Calendar.
      }}
      // Provide custom components for left and right navigation icons.
      components={{
        IconLeft: ({ className, ...props }) => ( // Custom left icon component.
          <ChevronLeft className={cn("size-4", className)} {...props} /> // ChevronLeft icon with default size.
        ),
        IconRight: ({ className, ...props }) => ( // Custom right icon component.
          <ChevronRight className={cn("size-4", className)} {...props} /> // ChevronRight icon with default size.
        ),
      }}
      {...props} // Spread any other props to DayPicker.
    />
  );
}

// Export the Calendar component.
export { Calendar };
