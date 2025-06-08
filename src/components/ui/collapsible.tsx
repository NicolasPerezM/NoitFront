// Specifies that these components should run on the client side.
"use client";

// Import Collapsible primitive components from Radix UI.
// These primitives provide the core accessibility and functionality for collapsible sections.
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

// Collapsible component (Root element for a collapsible section).
// This component wraps the entire collapsible area, including the trigger and content.
// It accepts all props that Radix UI's CollapsiblePrimitive.Root accepts.
function Collapsible({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  // Renders Radix UI's Root component with a custom data-slot attribute for potential styling.
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

// CollapsibleTrigger component (The button or element that toggles the collapsible section).
// This component should be placed within a Collapsible component.
// It accepts all props that Radix UI's CollapsiblePrimitive.CollapsibleTrigger accepts.
function CollapsibleTrigger({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    // Renders Radix UI's CollapsibleTrigger component with a custom data-slot attribute.
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

// CollapsibleContent component (The content that is shown or hidden).
// This component should be placed within a Collapsible component.
// It accepts all props that Radix UI's CollapsiblePrimitive.CollapsibleContent accepts.
function CollapsibleContent({
  ...props // Spread other props to the underlying Radix component.
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    // Renders Radix UI's CollapsibleContent component with a custom data-slot attribute.
    // This component handles the animation and visibility of the collapsible content.
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

// Export the Collapsible, CollapsibleTrigger, and CollapsibleContent components.
// These components can be used together to create accessible collapsible UI elements.
export { Collapsible, CollapsibleTrigger, CollapsibleContent };
