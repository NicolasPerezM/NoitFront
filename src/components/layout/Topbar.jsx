// Import necessary icons from the lucide-react library.
import {
  Bell, // Notification icon (currently unused)
  Home, // Home icon for FeedAnalyzer
  Calendar, // Calendar icon for Post Analyzer
  Zap, // Zap icon for Comments Analyzer
  PenTool, // PenTool icon (currently unused)
  BotMessageSquare, // BotMessageSquare icon for Chat button
} from "lucide-react";
// Import the ThemeToggle component for switching between light and dark modes.
import ThemeToggle from "../common/ThemeToggle";

// Topbar component definition.
// This component renders the top navigation bar of the application.
export default function Topbar() {
  // Array of navigation items. Currently, this section is commented out in the JSX.
  const navItems = [
    { id: "feed", name: "FeedAnalyzer", icon: Home, href: "/feedAnalyzer" },
    {
      id: "post",
      name: "Post Analyzer",
      icon: Calendar,
      href: "/postAnalyzer",
    },
    {
      id: "comments",
      name: "Comments Analyzer",
      icon: Zap,
      href: "/commentsAnalyzer",
    },
  ];

  return (
    // Main container for the top bar.
    // Tailwind CSS classes define its height, padding, flex properties, border, and background colors for light/dark modes.
    <div className="h-14 px-8 flex items-center justify-end border-b-2 dark:border-theme-dark border-theme-light bg-theme-light dark:bg-theme-dark">
      {/* Left section - Navigation (Currently commented out)
      This section was intended to display navigation links.
      <div className="flex space-x-1">
        {navItems.map((item) => (
          <a
            key={item.id} // Unique key for each item, important for list rendering.
            href={item.href} // URL for the navigation link.
            // Dynamically sets classes based on whether the item is active.
            // Includes styles for text color, border, and hover effects.
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              item.active // 'active' property would need to be part of navItems data.
                ? "text-primary border-b-2 border-primary" // Active item style.
                : "text-theme-darkest hover:text-theme-white hover:bg-theme-primary" // Inactive item style.
            }`}
          >
            <item.icon className="h-4 w-4 mr-1" /> // Renders the icon for the navigation item.
            {item.name} // Renders the name of the navigation item.
          </a>
        ))}
      </div>*/}

      {/* Right section of the top bar. */}
      {/* Contains a "Chat" button and the theme toggle. */}
      <div className="flex items-center gap-4"> {/* Flex container with spacing between items. */}
        {/* "Chat" button. */}
        <button className="py-2 px-6 rounded-lg text-theme-white hover:bg-theme-gray relative flex items-center gap-2 font-medium bg-theme-primary cursor-pointer">
          <BotMessageSquare className="h-5 w-4=5" /> {/* Chat icon. Note: "w-4=5" is likely a typo, should be "w-5" or similar. */}
          <div>Chat</div> {/* Text for the button. */}
        </button>
        {/* ThemeToggle component instance.
            Configured to display as an icon ('variant="icon"') and small size ('size="sm"'). */}
        <ThemeToggle variant="icon" size="sm" />
      </div>
    </div>
  );
}
