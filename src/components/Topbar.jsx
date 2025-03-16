import { Bell, Home, Calendar, Zap, PenTool } from "lucide-react"

export default function Topbar() {
  const navItems = [
    { id: "feed", name: "FeedAnalyzer", icon: Home },
    { id: "post", name: "Post Analyzer", icon: Calendar, active: true },
    { id: "comments", name: "Comments Analyzer", icon: Zap },
  ]

  return (
    <div className="h-full px-6 flex items-center justify-between">
      
      {/* Left section - Navigation */}
      <div className="flex space-x-1">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              item.active
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
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
        <div className="ml-4 relative">
          <div className="h-8 w-8 rounded-full bg-primary text-black flex items-center justify-center">
            <span className="text-xs font-medium">UA</span>
          </div>
        </div>
      </div>
    </div>
  )
}
