// Import necessary components for the page layout.
import { AppSidebar } from "@/components/app-sidebar"; // The main application sidebar.
import { SiteHeader } from "@/components/site-header"; // The header for the site.
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"; // UI components related to sidebar functionality.

// Defines the main page layout structure.
// This component wraps the main content of a page, providing a consistent layout with a header and sidebar.
export default function Page({ children }) { // 'children' prop represents the content to be rendered within this layout.
  return (
    // Main container div.
    // It defines a CSS variable `--header-height` using Tailwind's theme spacing (14 units).
    // This variable is likely used by child components (e.g., AppSidebar) for height calculations.
    <div className="[--header-height:calc(theme(spacing.14))]">
      {/* SidebarProvider likely provides context or state for sidebar interactions.
          It's styled as a flex column to stack SiteHeader and the main content area. */}
      <SidebarProvider className="flex flex-col">
        {/* Renders the site header component. */}
        <SiteHeader />
        {/* Container for the main content area and sidebar.
            Styled as a flex row (flex) and to take up remaining vertical space (flex-1). */}
        <div className="flex flex-1">
          {/* Renders the application sidebar. */}
          <AppSidebar />
          {/* SidebarInset is likely a component that adjusts its content based on the sidebar's state (e.g., collapsed or expanded).
              It wraps the main page content. */}
          <SidebarInset>
            {/* Inner div for padding around the page content. */}
            <div className="p-4">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

