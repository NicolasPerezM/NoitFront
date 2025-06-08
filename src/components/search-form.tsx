// Import the Search icon from lucide-react.
import { Search } from "lucide-react";

// Import Label component from a custom UI library.
import { Label } from "@/components/ui/label";
// Import SidebarInput component, likely a styled input for use in a sidebar, from a custom UI library.
import { SidebarInput } from "@/components/ui/sidebar";

// Define the SearchForm component.
// It accepts any props that a standard HTML <form> element would.
export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    // Form element, spreading any passed-in props.
    <form {...props}>
      {/* Relative container for positioning the search icon within the input field. */}
      <div className="relative">
        {/* Label for the search input, styled to be screen-reader only for accessibility. */}
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        {/* Custom SidebarInput component. */}
        <SidebarInput
          id="search" // ID for the input, linking it to the label.
          placeholder="Type to search..." // Placeholder text for the input.
          // Tailwind CSS classes for styling: height and left padding (to make space for the icon).
          className="h-8 pl-7"
        />
        {/* Search icon.
            Tailwind CSS classes for absolute positioning within the input field:
            - pointer-events-none: Makes the icon non-interactive.
            - absolute: Positions it relative to the parent div.
            - top-1/2 left-2: Positions it near the left, vertically centered.
            - size-4: Sets height and width of the icon.
            - -translate-y-1/2: Adjusts vertical centering precisely.
            - opacity-50: Makes the icon semi-transparent.
            - select-none: Makes the icon's text (if any) non-selectable. */}
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>
    </form>
  );
}
