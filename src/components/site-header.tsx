// Import necessary icons from lucide-react.
import { SidebarIcon, BotMessageSquare } from "lucide-react"; // SidebarIcon for toggling sidebar, BotMessageSquare for Chat button.

// Import SearchForm component (currently not used in this version of SiteHeader).
import { SearchForm } from "@/components/search-form";
// Import Breadcrumb components for navigation.
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// Import Button component.
import { Button } from "@/components/ui/button";
// Import Separator component for visual separation.
import { Separator } from "@/components/ui/separator";
// Import useSidebar hook to control sidebar visibility.
import { useSidebar } from "@/components/ui/sidebar";
// Import ThemeToggle component for light/dark mode switching.
import ThemeToggle from "./common/ThemeToggle";

// SiteHeader component definition.
export function SiteHeader() {
  // useSidebar hook provides access to sidebar control functions.
  const { toggleSidebar } = useSidebar();

  return (
    // Header element with Tailwind CSS classes for styling.
    // bg-background: sets background color based on current theme.
    // sticky top-0 z-50: makes the header sticky at the top with a high z-index.
    // flex w-full items-center: flex container, full width, vertically centered items.
    <header className="bg-background sticky top-0 z-50 flex w-full items-center">
      {/* Inner div for content layout, using a CSS variable for height. */}
      <div className="flex h-(--header-height) w-full items-center justify-between gap-2 px-8">
        {/* Left section of the header. */}
        <div className="flex items-center gap-4 h-full">
          {/* Button to toggle the sidebar visibility. */}
          <Button
            className="h-8 w-8" // Fixed height and width.
            variant="ghost" // Ghost button style (minimal).
            size="icon" // Icon button size.
            onClick={toggleSidebar} // Click handler to toggle sidebar.
          >
            <SidebarIcon /> {/* Sidebar toggle icon. */}
          </Button>
          {/* Vertical separator. */}
          <Separator orientation="vertical" className="mr-2 h-4" />
          {/* Breadcrumb navigation, hidden on small screens (sm:block). */}
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                {/* Breadcrumb link, currently points to "#". */}
                <BreadcrumbLink href="#">Redes Analizadas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator /> {/* Separator between breadcrumb items. */}
              <BreadcrumbItem>
                {/* Current page in breadcrumb. */}
                <BreadcrumbPage>Instagram</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* Right section of the header. */}
        <div className="flex items-center gap-4">
          {/* Chat button. */}
          <Button variant="outline" size="lg"> {/* Outline style, large size. */}
            Chat
            <BotMessageSquare className="mr-2 h-4 w-4" /> {/* Chat icon with margin and size. */}
          </Button>
          {/* ThemeToggle component, configured as a switch and small size. */}
          <ThemeToggle variant="switch" size="sm" />
        </div>
      </div>
    </header>
  );
}
