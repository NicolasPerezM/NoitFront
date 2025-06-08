// Import React library.
import * as React from "react";
// Import Tabs primitive components from Radix UI for building accessible tabbed interfaces.
import * as TabsPrimitive from "@radix-ui/react-tabs";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Tabs component (Root element for a tabs interface).
// It's a styled wrapper around Radix UI's TabsPrimitive.Root.
// Accepts all props of Radix UI's TabsPrimitive.Root.
function Tabs({
  className, // Optional additional CSS classes for the root tabs element.
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    // Use Radix UI's Root component for the tabs container.
    <TabsPrimitive.Root
      data-slot="tabs" // Custom data attribute for styling or selection.
      // Apply Tailwind CSS classes: flex layout, column direction, gap between list and content.
      // 'cn' merges these default classes with any provided 'className'.
      className={cn("flex flex-col gap-2", className)}
      {...props} // Spread any additional props.
    />
  );
}

// TabsList component (Container for the tab triggers).
// It's a styled wrapper around Radix UI's TabsPrimitive.List.
// Accepts all props of Radix UI's TabsPrimitive.List.
function TabsList({
  className, // Optional additional CSS classes for the tabs list.
  ...props // Spread other props.
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    // Use Radix UI's List component for the list of tab triggers.
    <TabsPrimitive.List
      data-slot="tabs-list" // Custom data attribute.
      // Apply Tailwind CSS classes for styling:
      // - bg-muted, text-muted-foreground: Themed background and text colors for the list.
      // - inline-flex, h-9, w-fit, items-center, justify-center: Layout and sizing.
      // - rounded-lg, p-[3px]: Rounded corners and padding.
      // 'cn' merges these default classes with any provided 'className'.
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props} // Spread any additional props.
    />
  );
}

// TabsTrigger component (Clickable button that activates a tab panel).
// It's a styled wrapper around Radix UI's TabsPrimitive.Trigger.
// Accepts all props of Radix UI's TabsPrimitive.Trigger.
function TabsTrigger({
  className, // Optional additional CSS classes for the tab trigger.
  ...props // Spread other props.
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    // Use Radix UI's Trigger component for individual tab buttons.
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger" // Custom data attribute.
      // Apply Tailwind CSS classes for styling:
      // - data-[state=active]: Styles for the active tab (background, text color, shadow).
      // - focus-visible: Styles for focus state (accessibility).
      // - dark mode styles for active state.
      // - text-foreground, dark:text-muted-foreground: Default text colors.
      // - layout, sizing, text properties, transitions, disabled state.
      // - [&_svg]: Styles for SVG icons within the trigger.
      // 'cn' merges these default classes with any provided 'className'.
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props} // Spread any additional props.
    />
  );
}

// TabsContent component (Container for the content of an active tab).
// It's a styled wrapper around Radix UI's TabsPrimitive.Content.
// Accepts all props of Radix UI's TabsPrimitive.Content.
function TabsContent({
  className, // Optional additional CSS classes for the tab content panel.
  ...props // Spread other props.
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    // Use Radix UI's Content component for the tab panel.
    <TabsPrimitive.Content
      data-slot="tabs-content" // Custom data attribute.
      // Apply Tailwind CSS classes:
      // - flex-1: Takes up available space if the parent Tabs is a flex container.
      // - outline-none: Removes default browser outline.
      // 'cn' merges these default classes with any provided 'className'.
      className={cn("flex-1 outline-none", className)}
      {...props} // Spread any additional props.
    />
  );
}

// Export all Tabs components for use in the application.
export { Tabs, TabsList, TabsTrigger, TabsContent };
