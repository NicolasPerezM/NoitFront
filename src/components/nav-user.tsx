// Specifies that this component should run on the client side.
"use client";

// Import necessary icons from lucide-react.
import {
  BadgeCheck, // Icon for "Account".
  Bell, // Icon for "Notifications".
  ChevronsUpDown, // Icon for dropdown trigger indicator.
  CreditCard, // Icon for "Membership".
  LogOut, // Icon for "Log out".
  Sparkles, // Icon for "Switch to Pro".
} from "lucide-react";

// Import Avatar components for displaying user avatars.
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
// Import DropdownMenu components for creating context menus.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Import Sidebar components and useSidebar hook from a custom UI library.
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar, // Hook to access sidebar properties like 'isMobile'.
} from "@/components/ui/sidebar";
// Import the logout handler function.
import { handleLogout } from "@/lib/api/logout";

// Define the props structure for the NavUser component.
export function NavUser({
  user, // User object containing name, email, and avatar URL.
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  // Get mobile status from sidebar context.
  const { isMobile } = useSidebar();

  // Function to handle user logout.
  const onLogout = async () => {
    try {
      // Call the logout API handler.
      await handleLogout();
    } catch (error) {
      // Log any errors that occur during logout.
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    // SidebarMenu container for the user navigation item.
    <SidebarMenu>
      <SidebarMenuItem>
        {/* DropdownMenu for user actions. */}
        <DropdownMenu>
          {/* Trigger for the dropdown menu, styled as a large sidebar button. */}
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              // Custom styling for when the dropdown is open.
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* User avatar. */}
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                {/* Fallback if avatar image fails to load, typically initials. */}
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              {/* User name and email display. */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              {/* Up/down chevons icon indicating a dropdown. */}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {/* Content of the dropdown menu. */}
          <DropdownMenuContent
            // Uses CSS variable for width, ensuring it matches trigger width, with a minimum.
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            // Position of the dropdown relative to the trigger, adjusted for mobile.
            side={isMobile ? "bottom" : "right"}
            align="end" // Alignment of the dropdown.
            sideOffset={4} // Offset from the trigger.
          >
            {/* Label section of the dropdown, displaying user info again. */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Group of related menu items. */}
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles /> {/* Icon for "Switch to Pro". */}
                Cambiar a Pro {/* Text for "Switch to Pro". */}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck /> {/* Icon for "Account". */}
                Cuenta {/* Text for "Account". */}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard /> {/* Icon for "Membership". */}
                Membresia {/* Text for "Membership". */}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell /> {/* Icon for "Notifications". */}
                Notificaciones {/* Text for "Notifications". */}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* Logout menu item. */}
            <DropdownMenuItem onClick={onLogout}>
              <LogOut /> {/* Icon for "Log out". */}
              Cerrar sesión {/* Text for "Log out". */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
