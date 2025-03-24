import { Bell, Home, Calendar, Zap, PenTool } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

export default function Topbar() {
  const navItems = [
    { id: "feed", name: "FeedAnalyzer", icon: Home, href: "/feedAnalyzer" },
    { id: "post", name: "Post Analyzer", icon: Calendar, href: "/postAnalyzer" },
    { id: "comments", name: "Comments Analyzer", icon: Zap, href: "/commentsAnalyzer" },
  ]

  return (
    <div className="h-12 px-6 flex items-center justify-between border-b-4 border-dark-blue">
      
      {/* Left section - Navigation */}
      <div className="flex space-x-1">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              item.active
                ? "text-primary border-b-2 border-primary"
                : "text-theme-gray hover:text-theme-primary hover:bg-dark-blue"
            }`}
          >
            <item.icon className="h-4 w-4 mr-1" />
            {item.name}
          </a>
        ))}
      </div>

      {/* Right section */}
      <div className="flex items-center">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <ThemeToggle variant="icon" size="sm"/>
      </div>
    </div>
  )
}
