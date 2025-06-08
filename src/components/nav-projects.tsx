// Import necessary icons from lucide-react and the LucideIcon type.
import {
  Folder, // Icon for "View Project".
  MoreHorizontal, // Icon for "More" actions trigger and a general "More" button.
  Share, // Icon for "Share Project".
  Trash2, // Icon for "Delete Project".
  type LucideIcon, // Type for icon components.
} from "lucide-react";

// Import DropdownMenu components for creating context menus.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Import Sidebar components from a custom UI library and a hook to get sidebar state.
import {
  SidebarGroup, // Component to group sidebar items.
  SidebarGroupLabel, // Label for a sidebar group.
  SidebarMenu, // Container for sidebar menu items.
  SidebarMenuAction, // Action button within a sidebar menu item (e.g., for a dropdown trigger).
  SidebarMenuButton, // Button for a sidebar menu item.
  SidebarMenuItem, // Individual item in a sidebar menu.
  useSidebar, // Hook to access sidebar properties, like 'isMobile'.
} from "@/components/ui/sidebar";

// Define the props structure for the NavProjects component.
export function NavProjects({
  projects, // An array of project objects.
}: {
  projects: {
    name: string; // Name of the project.
    url: string; // URL the project links to.
    icon: LucideIcon; // Icon for the project.
  }[];
}) {
  // useSidebar hook to get information about the sidebar, e.g., if it's in mobile view.
  const { isMobile } = useSidebar();

  return (
    // SidebarGroup for project navigation items.
    // 'group-data-[collapsible=icon]:hidden' hides this group when the sidebar is collapsed to icon-only mode.
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {/* Label for the projects section. */}
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {/* Iterate over the 'projects' array to create a menu item for each project. */}
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            {/* Main button for the project link. 'asChild' allows the anchor tag to be the actual button. */}
            <SidebarMenuButton asChild>
              <a href={item.url}> {/* Link to the project URL. */}
                <item.icon /> {/* Project icon. */}
                <span>{item.name}</span> {/* Project name. */}
              </a>
            </SidebarMenuButton>
            {/* DropdownMenu for additional actions related to the project. */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* SidebarMenuAction serves as the trigger for the dropdown.
                    'showOnHover' makes it visible when the mouse is over the parent SidebarMenuItem. */}
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal /> {/* "More" icon. */}
                  <span className="sr-only">More</span> {/* Screen-reader only text. */}
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              {/* Content of the dropdown menu. */}
              <DropdownMenuContent
                className="w-48" // Fixed width for the dropdown.
                // Adjusts side and alignment based on whether the view is mobile.
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                {/* Dropdown menu items for project actions. */}
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" /> {/* Icon for "View Project". */}
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" /> {/* Icon for "Share Project". */}
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator /> {/* Separator line in the dropdown. */}
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" /> {/* Icon for "Delete Project". */}
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {/* A static "More" button at the end of the project list.
            Its functionality is not defined in this snippet, might be a placeholder or for future use. */}
        <SidebarMenuItem>
          <SidebarMenuButton>
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
