// Import React library and necessary hooks/components.
import * as React from "react";
// Import Slot component from Radix UI for component composition.
import { Slot } from "@radix-ui/react-slot";
// Import cva for creating class variance authority, useful for conditional styling.
import { cva } from "class-variance-authority";
// Import VariantProps type from class-variance-authority.
import { type VariantProps } from "class-variance-authority";
// Import PanelLeftIcon from lucide-react for the sidebar trigger.
import { PanelLeftIcon } from "lucide-react";

// Import custom hook to detect mobile screen sizes.
import { useIsMobile } from "@/hooks/use-mobile";
// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";
// Import UI components used within the Sidebar.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, // Used for mobile sidebar display.
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton"; // For loading states.
import {
  Tooltip, // For tooltips on icon-only sidebar items.
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants for sidebar behavior and styling.
const SIDEBAR_COOKIE_NAME = "sidebar_state"; // Cookie name for persisting sidebar state.
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // Max age for the cookie (7 days).
const SIDEBAR_WIDTH = "16rem"; // Default width of the sidebar.
const SIDEBAR_WIDTH_MOBILE = "18rem"; // Width of the sidebar on mobile.
const SIDEBAR_WIDTH_ICON = "3rem"; // Width of the sidebar when collapsed to icons.
const SIDEBAR_KEYBOARD_SHORTCUT = "b"; // Keyboard shortcut to toggle sidebar (Cmd/Ctrl + B).

// Define props for the SidebarContext.
type SidebarContextProps = {
  state: "expanded" | "collapsed"; // Current state of the desktop sidebar.
  open: boolean; // Whether the desktop sidebar is open (expanded).
  setOpen: (open: boolean) => void; // Function to set the desktop sidebar open state.
  openMobile: boolean; // Whether the mobile sidebar (sheet) is open.
  setOpenMobile: (open: boolean) => void; // Function to set the mobile sidebar open state.
  isMobile: boolean; // Boolean indicating if the current view is mobile.
  toggleSidebar: () => void; // Function to toggle the appropriate sidebar (desktop or mobile).
};

// Create a React context for sidebar state and controls.
const SidebarContext = React.createContext<SidebarContextProps | null>(null);

// Custom hook to access the SidebarContext.
// Throws an error if used outside of a SidebarProvider.
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

// SidebarProvider component: Provides sidebar context to its children.
// Manages the open/collapsed state of the sidebar and handles mobile/desktop differences.
function SidebarProvider({
  defaultOpen = true, // Default open state for desktop sidebar.
  open: openProp, // Controlled open state for desktop.
  onOpenChange: setOpenProp, // Callback for controlled open state changes.
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile(); // Check if the view is mobile.
  const [openMobile, setOpenMobile] = React.useState(false); // State for mobile sidebar (sheet).

  // Internal state for uncontrolled desktop sidebar.
  const [_open, _setOpen] = React.useState(defaultOpen);
  // Determine current open state (controlled or uncontrolled).
  const open = openProp ?? _open;

  // Callback to set the open state of the desktop sidebar.
  // Updates cookie to persist state.
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState); // Use controlled prop if available.
      } else {
        _setOpen(openState); // Use internal state.
      }
      // Persist sidebar state in a cookie.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  // Callback to toggle the appropriate sidebar (mobile or desktop).
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Effect to add keyboard shortcut (Cmd/Ctrl + B) for toggling sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // Determine current state string ("expanded" or "collapsed") for data attributes.
  const state = open ? "expanded" : "collapsed";

  // Memoized context value to prevent unnecessary re-renders.
  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {/* TooltipProvider for tooltips used within the sidebar (e.g., for icon-only buttons). */}
      <TooltipProvider delayDuration={0}>
        {/* Main wrapper div for the sidebar and content. */}
        <div
          data-slot="sidebar-wrapper"
          // Set CSS variables for sidebar widths.
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          // Apply Tailwind CSS classes.
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

// Sidebar component: The main sidebar container.
// Handles different variants, collapsible behaviors, and mobile display using Sheet.
function Sidebar({
  side = "left", // Side on which the sidebar appears ('left' or 'right').
  variant = "sidebar", // Visual variant ('sidebar', 'floating', 'inset').
  collapsible = "offcanvas", // Collapsible behavior ('offcanvas', 'icon', 'none').
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  // If collapsible is 'none', render a simple non-collapsible sidebar.
  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  // If on mobile, render the sidebar as a Sheet component.
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar" // Custom data attributes for styling/selection.
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden" // Styling for mobile sheet.
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE, // Use mobile-specific width.
            } as React.CSSProperties
          }
          side={side} // Side from which the sheet appears.
        >
          {/* Hidden header for accessibility. */}
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar rendering.
  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block" // Base styling, hidden by default on small screens.
      data-state={state} // Current state (expanded/collapsed).
      data-collapsible={state === "collapsed" ? collapsible : ""} // Collapsible type if collapsed.
      data-variant={variant} // Visual variant.
      data-side={side} // Side on which it appears.
      data-slot="sidebar"
    >
      {/* Div to create a gap for the sidebar, allowing content to flow correctly. */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0", // No gap if offcanvas and collapsed.
          "group-data-[side=right]:rotate-180", // Adjust for right-sided sidebar.
          // Width adjustment for icon-only collapsed state based on variant.
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />
      {/* Actual container for the sidebar content, positioned fixed. */}
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          // Positioning and offcanvas behavior based on 'side'.
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Width and padding adjustments for different variants and collapsed states.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        {/* Inner div for styling the sidebar itself (background, shadow, border). */}
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar shadow-xl group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// SidebarTrigger component: Button to toggle the sidebar.
function SidebarTrigger({
  className,
  onClick, // Allow additional onClick logic.
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar(); // Get toggle function from context.

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost" // Ghost button style.
      size="icon" // Icon button size.
      className={cn("size-7", className)} // Default size, merge with custom classes.
      onClick={(event) => {
        onClick?.(event); // Call provided onClick if any.
        toggleSidebar(); // Toggle the sidebar.
      }}
      {...props}
    >
      <PanelLeftIcon /> {/* Icon for the trigger. */}
      <span className="sr-only">Toggle Sidebar</span> {/* Screen-reader only text. */}
    </Button>
  );
}

// SidebarRail component: Clickable area (usually on the edge) to toggle the sidebar.
// Primarily for desktop to allow quick toggling by clicking the edge.
function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1} // Not focusable.
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      // Apply complex conditional styling for positioning, appearance, and cursor based on sidebar state and side.
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  );
}

// SidebarInset component: Main content area that adjusts its layout based on sidebar state and variant.
function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      // Apply styling for background and layout.
      // Conditional margin and rounded corners for 'inset' variant based on peer (sidebar) state.
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props}
    />
  );
}

// SidebarInput component: Styled Input component for use within the sidebar.
function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)} // Specific styling for sidebar input.
      {...props}
    />
  );
}

// SidebarHeader component: Container for the sidebar's header section.
function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)} // Basic layout styling.
      {...props}
    />
  );
}

// SidebarFooter component: Container for the sidebar's footer section.
function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)} // Basic layout styling.
      {...props}
    />
  );
}

// SidebarSeparator component: Styled Separator for use within the sidebar.
function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)} // Specific styling for sidebar separator.
      {...props}
    />
  );
}

// SidebarContent component: Main scrollable content area of the sidebar.
function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      // Styling for flex layout, overflow handling (hidden when icon-only).
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

// SidebarGroup component: Groups related items within the sidebar content.
function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)} // Basic layout.
      {...props}
    />
  );
}

// SidebarGroupLabel component: Label for a SidebarGroup.
// Supports 'asChild' prop for composition.
function SidebarGroupLabel({
  className,
  asChild = false, // If true, renders as Slot.
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      // Styling for text, layout, focus, and icon-only collapsed state (becomes hidden).
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

// SidebarGroupAction component: Action button (e.g., for "add new") within a SidebarGroupLabel.
// Supports 'asChild' prop.
function SidebarGroupAction({
  className,
  asChild = false, // If true, renders as Slot.
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      // Styling for positioning, appearance, focus, and icon-only collapsed state (hidden).
      // Includes increased hit area for mobile.
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 md:after:hidden", // Hit area increase.
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
}

// SidebarGroupContent component: Content area within a SidebarGroup.
function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)} // Basic styling.
      {...props}
    />
  );
}

// SidebarMenu component: Unordered list (ul) for menu items.
function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)} // Basic layout.
      {...props}
    />
  );
}

// SidebarMenuItem component: List item (li) for a menu item.
function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)} // Relative positioning for potential actions/badges.
      {...props}
    />
  );
}

// Defines variants for SidebarMenuButton using cva.
const sidebarMenuButtonVariants = cva(
  // Base classes for all menu buttons.
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    // Visual variants.
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      // Size variants.
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!", // Special padding for large icon-only.
      },
    },
    // Default variants.
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// SidebarMenuButton component: Clickable button for a menu item.
// Supports 'asChild', 'isActive', variants, sizes, and tooltips for icon-only state.
function SidebarMenuButton({
  asChild = false, // If true, renders as Slot.
  isActive = false, // If true, applies active styling.
  variant = "default",
  size = "default",
  tooltip, // Tooltip content (string or TooltipContent props).
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state: sidebarState } = useSidebar(); // Renamed 'state' to 'sidebarState' to avoid conflict.

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  // If no tooltip, return the button directly.
  if (!tooltip) {
    return button;
  }

  // If tooltip is a string, convert it to TooltipContent props.
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  // Render button with Tooltip if tooltip is provided.
  // Tooltip is hidden if sidebar is not collapsed or if on mobile.
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={sidebarState !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

// SidebarMenuAction component: Action button within a SidebarMenuItem (e.g., for a dropdown trigger).
// Supports 'asChild' and 'showOnHover'.
function SidebarMenuAction({
  className,
  asChild = false, // If true, renders as Slot.
  showOnHover = false, // If true, only shows on hover/focus of parent item.
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      // Styling for positioning, appearance, focus, and conditional visibility based on 'showOnHover' and parent state.
      // Includes increased hit area for mobile.
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 md:after:hidden", // Hit area increase.
        "peer-data-[size=sm]/menu-button:top-1", // Adjust position based on peer button size.
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden", // Hidden in icon-only mode.
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0", // Conditional opacity for hover/focus.
        className
      )}
      {...props}
    />
  );
}

// SidebarMenuBadge component: Badge displayed within a SidebarMenuItem.
function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      // Styling for positioning, appearance, and text.
      // Adjusts color based on peer button state and position based on peer button size.
      // Hidden in icon-only mode.
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
}

// SidebarMenuSkeleton component: Skeleton loader for a menu item.
// Used during loading states.
function SidebarMenuSkeleton({
  className,
  showIcon = false, // If true, shows a skeleton for an icon.
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}) {
  // Generate a random width for the text skeleton for a more natural loading appearance.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`; // Width between 50% and 90%.
  }, []);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)} // Basic layout.
      {...props}
    >
      {/* Optional icon skeleton. */}
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      {/* Text skeleton with random width. */}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width, // Apply random width via CSS variable.
          } as React.CSSProperties
        }
      />
    </div>
  );
}

// SidebarMenuSub component: Unordered list (ul) for submenu items.
// Styled with a left border to indicate nesting.
function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      // Styling for layout, border, padding. Hidden in icon-only mode.
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
}

// SidebarMenuSubItem component: List item (li) for a submenu item.
function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)} // Relative positioning.
      {...props}
    />
  );
}

// SidebarMenuSubButton component: Clickable button for a submenu item.
// Supports 'asChild', size variants, and 'isActive' state.
function SidebarMenuSubButton({
  asChild = false, // If true, renders as Slot.
  size = "md", // Size variant ('sm' or 'md').
  isActive = false, // If true, applies active styling.
  className,
  ...props
}: React.ComponentProps<"a"> & { // Typically an anchor tag (<a>).
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      // Styling for text, layout, focus, active state, disabled state, and icon-only mode (hidden).
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
}

// Export all Sidebar components and the useSidebar hook.
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
