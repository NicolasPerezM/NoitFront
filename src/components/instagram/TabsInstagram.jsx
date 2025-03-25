import { Bell, Home, Calendar, Zap, PenTool } from "lucide-react"


export default function Topbar() {
  const navItems = [
    { id: "feed", name: "FeedAnalyzer", icon: Home, href: "/feedAnalyzer" },
    { id: "post", name: "Post Analyzer", icon: Calendar, href: "/postAnalyzer" },
    { id: "comments", name: "Comments Analyzer", icon: Zap, href: "/commentsAnalyzer" },
  ]

  return (
    <div className="h-12 px-6 flex w-auto items-center justify-between rounded-md shadow-md dark:border-theme-primary border-theme-light border-b-1 bg-theme-light dark:bg-theme-dark">
      
      {/* Left section - Navigation */}
      <div className="flex space-x-1">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              item.active
                ? "text-primary border-b-2 border-primary"
                : "text-theme-darkest hover:text-theme-white hover:bg-theme-primary dark:text-theme-light"
            }`}
          >
            <item.icon className="h-4 w-4 mr-1" />
            {item.name}
          </a>
        ))}
      </div>
    </div>
  )
}