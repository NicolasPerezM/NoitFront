// Import React library.
import * as React from "react";
// Import Select primitive components from Radix UI for building accessible select dropdowns.
import * as SelectPrimitive from "@radix-ui/react-select";
// Import icons from lucide-react.
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Select component (Root element for a select dropdown).
// Re-exports Radix UI's SelectPrimitive.Root with a data-slot attribute.
function Select({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

// SelectGroup component (Groups related SelectItems).
// Re-exports Radix UI's SelectPrimitive.Group with a data-slot attribute.
function SelectGroup({
  ...props // Spread other props.
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

// SelectValue component (Displays the selected value in the SelectTrigger).
// Re-exports Radix UI's SelectPrimitive.Value with a data-slot attribute.
function SelectValue({
  ...props // Spread other props.
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

// SelectTrigger component (The button that opens/closes the select dropdown).
// Styled with Tailwind CSS and includes a ChevronDownIcon.
function SelectTrigger({
  className, // Optional additional CSS classes.
  size = "default", // Size variant ('sm' or 'default').
  children, // Content of the trigger, typically a SelectValue component.
  ...props // Spread other props.
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"; // Size prop definition.
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger" // Custom data attribute.
      data-size={size} // Data attribute for size styling.
      // Apply Tailwind CSS classes for styling:
      // - border-input, data-[placeholder], [&_svg]: Styles for appearance and placeholder/icon colors.
      // - focus-visible, aria-invalid: Styles for focus and invalid states.
      // - dark mode styles, layout (flex, items-center, etc.), text, shadow, transitions, disabled states.
      // - data-[size=default/sm]: Height based on size prop.
      // - *:data-[slot=select-value]: Styles for the SelectValue component within the trigger.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props} // Spread other props.
    >
      {children}
      {/* Radix UI's Icon component, used here to wrap the ChevronDownIcon. */}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

// SelectContent component (The dropdown panel containing the select options).
// Styled with Tailwind CSS and includes scroll buttons.
function SelectContent({
  className, // Optional additional CSS classes.
  children, // Content of the dropdown, typically SelectItems.
  position = "popper", // Positioning strategy for the dropdown.
  ...props // Spread other props.
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    // Use SelectPrimitive.Portal to render the content in a portal.
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content" // Custom data attribute.
        // Apply Tailwind CSS classes for styling and animations:
        // - bg-popover, text-popover-foreground: Themed colors.
        // - data-[state=open/closed], data-[side]: Animations based on state and side.
        // - z-50, max-h, min-w, origin: Positioning and sizing.
        // - overflow handling, rounded corners, border, shadow.
        // - Conditional translation based on 'position' prop for popper strategy.
        // 'cn' merges these with any provided 'className'.
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position} // Pass position prop.
        {...props} // Spread other props.
      >
        {/* Scroll up button for long lists of options. */}
        <SelectScrollUpButton />
        {/* Viewport for the scrollable options. */}
        <SelectPrimitive.Viewport
          // Apply Tailwind CSS classes: padding, and conditional sizing for popper position.
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        {/* Scroll down button. */}
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

// SelectLabel component (Label for a group of SelectItems).
// Styled with Tailwind CSS.
function SelectLabel({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label" // Custom data attribute.
      // Apply Tailwind CSS classes: muted text color, padding, text size.
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props} // Spread other props.
    />
  );
}

// SelectItem component (Individual option within the select dropdown).
// Styled with Tailwind CSS and includes a CheckIcon for the selected state.
function SelectItem({
  className, // Optional additional CSS classes.
  children, // Content of the item.
  ...props // Spread other props.
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item" // Custom data attribute.
      // Apply Tailwind CSS classes for styling:
      // - focus states, SVG icon styling, layout, cursor, appearance, text, disabled states.
      // - Styling for child spans to manage layout with icons/text.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props} // Spread other props.
    >
      {/* Container for the check icon, positioned absolutely to the right. */}
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      {/* Radix UI's ItemText component to correctly handle text content within the item. */}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

// SelectSeparator component (Visual separator between SelectItems or SelectGroups).
// Styled with Tailwind CSS.
function SelectSeparator({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator" // Custom data attribute.
      // Apply Tailwind CSS classes: background color, non-interactive, margin, height.
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props} // Spread other props.
    />
  );
}

// SelectScrollUpButton component (Button to scroll up within the SelectContent).
// Styled with Tailwind CSS and includes a ChevronUpIcon.
function SelectScrollUpButton({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button" // Custom data attribute.
      // Apply Tailwind CSS classes: flex layout, cursor, padding.
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props} // Spread other props.
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

// SelectScrollDownButton component (Button to scroll down within the SelectContent).
// Styled with Tailwind CSS and includes a ChevronDownIcon.
function SelectScrollDownButton({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button" // Custom data attribute.
      // Apply Tailwind CSS classes: flex layout, cursor, padding.
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props} // Spread other props.
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

// Export all Select components for use in the application.
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
