// Specifies that this component should run on the client side.
"use client";

// Import ChevronRight icon for indicating collapsible sections and LucideIcon type.
import { ChevronRight, type LucideIcon } from "lucide-react";

// Import Collapsible components for creating expandable/collapsible UI elements.
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
// Import various Sidebar components from a custom UI library.
import {
  SidebarGroup, // Component to group sidebar items.
  SidebarGroupLabel, // Label for a sidebar group.
  SidebarMenu, // Container for sidebar menu items.
  SidebarMenuButton, // Button for a sidebar menu item.
  SidebarMenuItem, // Individual item in a sidebar menu.
  SidebarMenuSub, // Container for submenu items.
  SidebarMenuSubButton, // Button for a submenu item.
  SidebarMenuSubItem, // Individual item in a submenu.
} from "@/components/ui/sidebar";

// Define the props structure for the NavMain component.
export function NavMain({
  items, // An array of navigation items.
}: {
  items: {
    title: string; // Title of the navigation item.
    url: string; // URL the item links to.
    icon?: LucideIcon; // Optional icon for the item.
    isActive?: boolean; // Optional flag indicating if the item is currently active (used for defaultOpen in Collapsible).
    items?: { // Optional array of sub-items for creating a nested menu.
      title: string; // Title of the sub-item.
      url: string; // URL the sub-item links to.
    }[];
  }[];
}) {
  return (
    // Start of the sidebar group.
    <SidebarGroup>
      {/* Label for this group of navigation items. Styled with specific text size and margin. */}
      <SidebarGroupLabel className="lg:text-[17px] mb-2">Ideas de Negocio</SidebarGroupLabel>
      {/* Main menu container. */}
      <SidebarMenu>
        {/* Iterate over the provided 'items' array to create menu items. */}
        {items.map((item) => {
          // Check if the current item has sub-items.
          const hasSubItems = item.items?.length > 0;

          return (
            // Each item in the sidebar menu.
            <SidebarMenuItem key={item.title}>
              {/* Conditional rendering: Use Collapsible if there are sub-items, otherwise render a simple button. */}
              {hasSubItems ? (
                // Collapsible component to handle expandable sections.
                <Collapsible
                  key={item.title} // Unique key for the Collapsible component.
                  asChild // Allows the Collapsible to use its child as the trigger/content host.
                  defaultOpen={item.isActive} // If the item is active, it will be open by default.
                >
                  <div> {/* Wrapper div for Collapsible trigger and content. */}
                    <CollapsibleTrigger asChild>
                      {/* Button that triggers the collapse/expand action. */}
                      <SidebarMenuButton tooltip={item.title}>
                        {/* Render icon if provided. */}
                        {item.icon && <item.icon />}
                        {/* Title of the menu item. */}
                        <span>{item.title}</span>
                        {/* Chevron icon that rotates based on the collapsible state. */}
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {/* Content of the collapsible section (sub-menu). */}
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {/* Iterate over sub-items to create submenu items. */}
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              {/* Link for the sub-item. */}
                              <a href={subItem.url} className="cursor-pointer">
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ) : (
                // If there are no sub-items, render a simple menu button.
                <SidebarMenuButton
                  tooltip={item.title} // Tooltip for the button.
                  className="cursor-pointer" // Apply cursor style.
                >
                  {/* Render icon if provided. */}
                  {item.icon && <item.icon/>}
                  {/* Link wrapping the title. */}
                  <a href={item.url} className="lg:text-[17px]">
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
