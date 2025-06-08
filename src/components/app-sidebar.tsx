// Import React library for building user interfaces
import * as React from "react";
// Import specific icons from the lucide-react library
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  FileChartColumn,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Share2,
  GitCompareArrows,
  BotMessageSquare,
} from "lucide-react";

// Import custom navigation components
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects"; // Currently commented out in the component
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
// Import UI components for the sidebar from a local path, likely part of a custom UI library
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
// Import a custom Button component
import { Button } from "./ui/button";

// Import light and dark mode logos
import logoLight from "@/assets/logos/logoLight.png";
import logoDark from "@/assets/logos/logoDark.png";

// Define a constant object 'data' to hold static information for the sidebar
// This includes user details, main navigation links, secondary navigation links, and project links
const data = {
  user: { // User information
    name: "shadcn", // User's name
    email: "m@example.com", // User's email
    avatar: "/avatars/shadcn.jpg", // Path to user's avatar
  },
  navMain: [ // Main navigation items
    {
      title: "Face It", // Title of the navigation item
      url: "/instagramAccountAnalysis", // URL it links to
      icon: FileChartColumn, // Icon for the navigation item
    },
    {
      title: "Lifetime ecommerce",
      url: "#", // Placeholder URL
      icon: FileChartColumn,
    },
  ],
  navSecondary: [ // Secondary navigation items
    {
      title: "Ajustes", // Settings
      url: "#",
      icon: Settings2,
    },
    {
      title: "Soporte", // Support
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback", // Feedback
      url: "#",
      icon: Send,
    },
  ],
  projects: [ // Project navigation items (currently commented out in the component)
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      // icon: Map, // Assuming 'Map' was intended to be an icon import like the others. It's currently not imported.
    },
  ],
};

// Define the AppSidebar component
// It accepts props compatible with the Sidebar component from the UI library
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    // Render the main Sidebar container
    <Sidebar
      collapsible="icon" // Allows the sidebar to be collapsed to show only icons
      // Apply Tailwind CSS classes for positioning and height.
      // `top-(--header-height)` positions it below an element with height `var(--header-height)` (CSS variable)
      // `h-[calc(100svh-var(--header-height))]!` sets the height relative to viewport height minus header height
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props} // Spread any additional props to the Sidebar component
    >
      {/* Sidebar header section */}
      <SidebarHeader className="mt-4 mb-4"> {/* Margin top and bottom utility classes */}
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Sidebar menu button, styled as a large button, and acts as a child for the anchor tag */}
            <SidebarMenuButton size="lg" asChild>
              <a href="#"> {/* Link wrapping the logos, currently points to "#" */}
                {/* Light mode logo, visible by default, hidden in dark mode */}
                <img
                  src={logoLight.src} // Source of the light mode logo image
                  alt="Logo Light"    // Alt text for accessibility
                  className="block dark:hidden" // Tailwind classes: display block, hide if dark mode is active
                />
                {/* Dark mode logo, hidden by default, visible in dark mode */}
                <img
                  src={logoDark.src}  // Source of the dark mode logo image
                  alt="Logo Dark"     // Alt text for accessibility
                  className="hidden dark:block" // Tailwind classes: display hidden, show as block if dark mode is active
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main content area of the sidebar */}
      <SidebarContent>
        {/* Flex container to manage layout of main navigation and "Nuevo Chat" button */}
        {/* Arranges children in a column, takes full height, and justifies content with space between */}
        <div className="flex flex-col h-full justify-between">
          {/* Render the main navigation items using the NavMain component and data.navMain array */}
          <NavMain items={data.navMain} />
          {/* Placeholder for project navigation, currently commented out in the JSX */}
          {/*<NavProjects projects={data.projects} />*/}
          {/* Button to start a new chat */}
          <Button variant="outline" size="lg" className="w-auto mx-4"> {/* Outline style, large size, auto width, horizontal margin */}
            Nuevo Chat {/* Text for "New Chat" */}
            <BotMessageSquare className="mr-2 h-4 w-4" /> {/* Chatbot icon with margin right, height and width 4 */}
          </Button>
        </div>

        {/* Render the secondary navigation items using NavSecondary component and data.navSecondary array */}
        {/* `mt-auto` pushes this navigation to the bottom of its flex container */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      {/* Sidebar footer section. The curly braces around <SidebarFooter> are not strictly necessary here but don't harm. */}
      {
        <SidebarFooter>
          {/* Render the user navigation/profile section using NavUser component and data.user object */}
          <NavUser user={data.user} />
        </SidebarFooter>
      }
    </Sidebar>
  );
}
