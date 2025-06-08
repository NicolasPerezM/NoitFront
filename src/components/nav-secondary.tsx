// Import React library.
import * as React from "react";
// Import LucideIcon type for icon components.
import { type LucideIcon } from "lucide-react";

// Import Sidebar components from a custom UI library.
import {
  SidebarGroup, // Component to group sidebar items.
  SidebarGroupContent, // Content area within a sidebar group.
  SidebarMenu, // Container for sidebar menu items.
  SidebarMenuButton, // Button for a sidebar menu item.
  SidebarMenuItem, // Individual item in a sidebar menu.
} from "@/components/ui/sidebar";


// Define the props structure for the NavSecondary component.
// It accepts an 'items' array and any other props compatible with SidebarGroup.
export function NavSecondary({
  items, // An array of secondary navigation items.
  ...props // Spread operator to pass any other props to SidebarGroup.
}: {
  items: {
    title: string; // Title of the navigation item.
    url: string; // URL the item links to.
    icon: LucideIcon; // Icon for the item.
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) { // Extends SidebarGroup props.
  return (
    // Root SidebarGroup component, spreading any additional props passed to NavSecondary.
    <SidebarGroup {...props}>
      {/* Content area of the sidebar group. */}
      <SidebarGroupContent>
        {/* Menu container for the secondary navigation items. */}
        <SidebarMenu>
          {/* Iterate over the 'items' array to create menu items. */}
          {items.map((item) => (
            // Each item in the secondary navigation menu.
            <SidebarMenuItem key={item.title}>
              {/* SidebarMenuButton, styled as a small button ('size="sm"').
                  'asChild' allows the anchor tag to be the actual button. */}
              <SidebarMenuButton asChild size="sm">
                <a href={item.url}> {/* Link to the item's URL. */}
                  <item.icon /> {/* Item icon. */}
                  {/* Item title, styled with a specific font size. */}
                  <span className="text-[14px]">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
