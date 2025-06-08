// Import React and necessary hooks/components.
import * as React from "react";
// Import icons from lucide-react.
import { ChevronsUpDown, Plus } from "lucide-react"; // ChevronsUpDown for dropdown indicator, Plus for "Add team".

// Import DropdownMenu components from a custom UI library.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut, // For displaying keyboard shortcuts.
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Import Sidebar components and useSidebar hook from a custom UI library.
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar, // Hook to get sidebar status (e.g., isMobile).
} from "@/components/ui/sidebar";

// Define the props structure for the TeamSwitcher component.
export function TeamSwitcher({
  teams, // An array of team objects.
}: {
  teams: {
    name: string; // Name of the team.
    logo: React.ElementType; // Component type for the team's logo.
    plan: string; // Plan/subscription type for the team.
  }[];
}) {
  // Get mobile status from sidebar context.
  const { isMobile } = useSidebar();
  // State to keep track of the currently active team, initialized with the first team in the array.
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  // If there's no active team (e.g., if the teams array is empty), render nothing.
  if (!activeTeam) {
    return null;
  }

  return (
    // SidebarMenu container for the team switcher.
    <SidebarMenu>
      <SidebarMenuItem>
        {/* DropdownMenu for switching between teams. */}
        <DropdownMenu>
          {/* Trigger for the dropdown, styled as a large sidebar button. */}
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              // Custom styling for when the dropdown is open.
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Display the logo of the active team. */}
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
              {/* Display the name and plan of the active team. */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              {/* Chevrons icon indicating a dropdown. */}
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {/* Content of the dropdown menu. */}
          <DropdownMenuContent
            // Uses CSS variable for width, ensuring it matches trigger width, with a minimum.
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start" // Align dropdown to the start of the trigger.
            // Position of the dropdown relative to the trigger, adjusted for mobile.
            side={isMobile ? "bottom" : "right"}
            sideOffset={4} // Offset from the trigger.
          >
            {/* Label for the teams section in the dropdown. */}
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {/* Iterate over the 'teams' array to create a dropdown item for each team. */}
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)} // Set the clicked team as active.
                className="gap-2 p-2" // Styling for the item.
              >
                {/* Team logo. */}
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div>
                {/* Team name. */}
                {team.name}
                {/* Keyboard shortcut display (e.g., ⌘1, ⌘2). */}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator /> {/* Separator line. */}
            {/* "Add team" menu item. */}
            <DropdownMenuItem className="gap-2 p-2">
              {/* Plus icon within a bordered container. */}
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              {/* Text for "Add team". */}
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
