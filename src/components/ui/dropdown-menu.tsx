// Import React library.
import * as React from "react";
// Import DropdownMenu primitive components from Radix UI for building accessible dropdown menus.
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
// Import icons from lucide-react.
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// DropdownMenu component (Root element for a dropdown menu).
// Re-exports Radix UI's DropdownMenuPrimitive.Root with a data-slot attribute.
function DropdownMenu({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

// DropdownMenuPortal component (Portals its children, typically the DropdownMenuContent).
// Re-exports Radix UI's DropdownMenuPrimitive.Portal with a data-slot attribute.
function DropdownMenuPortal({
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

// DropdownMenuTrigger component (Element that opens the dropdown menu).
// Re-exports Radix UI's DropdownMenuPrimitive.Trigger with a data-slot attribute.
function DropdownMenuTrigger({
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

// DropdownMenuContent component (The content of the dropdown menu).
// It's styled with Tailwind CSS classes for appearance and animations.
function DropdownMenuContent({
  className, // Optional additional CSS classes.
  sideOffset = 4, // Default offset from the trigger.
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    // Use DropdownMenuPortal to render the content in a portal.
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content" // Custom data attribute.
        sideOffset={sideOffset} // Apply side offset.
        // Apply Tailwind CSS classes for styling and animations:
        // - bg-popover, text-popover-foreground: Themed background and text colors.
        // - data-[state=open/closed]: Animations for open/closed states (fade, zoom, slide).
        // - z-50: High z-index to appear above other content.
        // - max-h, min-w, origin: Sizing and transform origin.
        // - overflow-x-hidden, overflow-y-auto: Overflow handling.
        // - rounded-md, border, p-1, shadow-md: Appearance styling.
        // 'cn' merges these with any provided 'className'.
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props} // Spread other props.
      />
    </DropdownMenuPrimitive.Portal>
  );
}

// DropdownMenuGroup component (Groups related DropdownMenuItems).
// Re-exports Radix UI's DropdownMenuPrimitive.Group with a data-slot attribute.
function DropdownMenuGroup({
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

// DropdownMenuItem component (Individual item within a dropdown menu).
// Styled with Tailwind CSS and supports an 'inset' prop for indented items.
function DropdownMenuItem({
  className, // Optional additional CSS classes.
  inset, // Boolean to indicate if the item should be inset (for icons/checkboxes).
  variant = "default", // Visual variant ('default' or 'destructive').
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item" // Custom data attribute.
      data-inset={inset} // Data attribute for inset styling.
      data-variant={variant} // Data attribute for variant styling.
      // Apply Tailwind CSS classes:
      // - focus: styles for focus state.
      // - data-[variant=destructive]: styles for destructive variant.
      // - [&_svg]: styles for SVG icons within the item.
      // - layout, cursor, appearance, text, outline, select, disabled states.
      // 'cn' merges these with any provided 'className'.
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// DropdownMenuCheckboxItem component (A DropdownMenuItem that can be checked/unchecked).
// Includes a visual indicator (CheckIcon).
function DropdownMenuCheckboxItem({
  className, // Optional additional CSS classes.
  children, // Content of the checkbox item.
  checked, // Boolean indicating if the item is checked.
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item" // Custom data attribute.
      // Apply Tailwind CSS classes similar to DropdownMenuItem, with specific padding for the indicator.
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked} // Pass checked state.
      {...props} // Spread other props.
    >
      {/* Container for the check icon indicator, positioned absolutely. */}
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

// DropdownMenuRadioGroup component (Groups DropdownMenuRadioItems).
// Re-exports Radix UI's DropdownMenuPrimitive.RadioGroup with a data-slot attribute.
function DropdownMenuRadioGroup({
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

// DropdownMenuRadioItem component (A DropdownMenuItem that acts like a radio button).
// Includes a visual indicator (CircleIcon).
function DropdownMenuRadioItem({
  className, // Optional additional CSS classes.
  children, // Content of the radio item.
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item" // Custom data attribute.
      // Apply Tailwind CSS classes similar to DropdownMenuCheckboxItem.
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props} // Spread other props.
    >
      {/* Container for the radio icon indicator. */}
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

// DropdownMenuLabel component (Non-interactive label within the dropdown).
// Styled with Tailwind CSS and supports an 'inset' prop.
function DropdownMenuLabel({
  className, // Optional additional CSS classes.
  inset, // Boolean for inset styling.
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label" // Custom data attribute.
      data-inset={inset} // Data attribute for inset styling.
      // Apply Tailwind CSS classes: padding, text size, font weight.
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// DropdownMenuSeparator component (Visual separator between items or groups).
// Styled with Tailwind CSS.
function DropdownMenuSeparator({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator" // Custom data attribute.
      // Apply Tailwind CSS classes: background color, negative margin, height.
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props} // Spread other props.
    />
  );
}

// DropdownMenuShortcut component (Displays a keyboard shortcut hint).
// Styled with Tailwind CSS.
function DropdownMenuShortcut({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut" // Custom data attribute.
      // Apply Tailwind CSS classes: muted text color, margin, text size, tracking.
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// DropdownMenuSub component (Container for a submenu).
// Re-exports Radix UI's DropdownMenuPrimitive.Sub with a data-slot attribute.
function DropdownMenuSub({
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

// DropdownMenuSubTrigger component (Element that opens a submenu).
// Styled with Tailwind CSS and includes a ChevronRightIcon.
function DropdownMenuSubTrigger({
  className, // Optional additional CSS classes.
  inset, // Boolean for inset styling.
  children, // Content of the sub-trigger.
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger" // Custom data attribute.
      data-inset={inset} // Data attribute for inset styling.
      // Apply Tailwind CSS classes similar to DropdownMenuItem, with open state styling.
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className
      )}
      {...props} // Spread other props.
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" /> {/* Chevron icon for submenu indication. */}
    </DropdownMenuPrimitive.SubTrigger>
  );
}

// DropdownMenuSubContent component (Content of a submenu).
// Styled with Tailwind CSS, similar to DropdownMenuContent.
function DropdownMenuSubContent({
  className, // Optional additional CSS classes.
  ...props // Spread other props.
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content" // Custom data attribute.
      // Apply Tailwind CSS classes for styling and animations, similar to DropdownMenuContent.
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props} // Spread other props.
    />
  );
}

// Export all DropdownMenu components for use in the application.
export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
