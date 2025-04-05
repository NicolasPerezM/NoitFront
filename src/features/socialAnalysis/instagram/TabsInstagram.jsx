import { Bell, Home, Calendar, Zap, PenTool, ChartArea, ImageUp, GalleryThumbnails, MessageCircle } from "lucide-react"


export default function Topbar() {
  const navItems = [
    { id: "settings", name: "Análisis General", icon: ChartArea, href: "/settings" },
    { id: "feed", name: "Análisis del Feed", icon: ImageUp, href: "/feedAnalyzer" },
    { id: "post", name: "Análisis de Posts", icon: GalleryThumbnails, href: "/postAnalyzer" },
    { id: "comments", name: "Análisis de Comentarios", icon: MessageCircle, href: "/commentsAnalyzer" }, 
  ]

  return (
    <div className="h-12 flex px-4 py-8 items-center justify-between rounded-b-xl shadow-md dark:border-theme-primary border-theme-light border-b-1 bg-theme-light dark:bg-theme-dark">
      
      {/* Left section - Navigation */}
      <div className="flex space-x-1 truncate">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex items-center px-3 py-2 text-md font-medium rounded-md ${
              item.active
                ? "text-primary border-b-2 border-primary"
                : "text-theme-darkest hover:text-theme-white hover:bg-theme-primary dark:text-theme-light"
            }`}
          >
            <item.icon className="h-6 w-6 mr-2" />
            {item.name}
          </a>
        ))}
      </div>
    </div>
  )
}