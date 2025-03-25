import {
  Bell,
  Home,
  Calendar,
  Zap,
  PenTool,
  BotMessageSquare,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Topbar() {
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
    <div className="h-14 px-8 flex items-center justify-end border-b-2 dark:border-theme-dark border-theme-light bg-theme-light dark:bg-theme-dark">
      {/* Left section - Navigation 
      <div className="flex space-x-1">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              item.active
                ? "text-primary border-b-2 border-primary"
                : "text-theme-darkest hover:text-theme-white hover:bg-theme-primary"
            }`}
          >
            <item.icon className="h-4 w-4 mr-1" />
            {item.name}
          </a>
        ))}
      </div>*/}

      {/* Right section */}
      <div className="flex items-center gap-4">
        <button className="py-2 px-6 rounded-lg text-theme-white hover:bg-theme-gray  relative flex items-center gap-2 font-medium bg-theme-primary cursor-pointer">
          <BotMessageSquare className="h-5 w-4=5" />
          <div>Chat</div>
        </button>
        <ThemeToggle variant="icon" size="sm" />
      </div>
    </div>
  );
}
