import { Bell, Home, Calendar, Zap, PenTool, ChartArea, ImageUp, GalleryThumbnails, MessageCircle } from "lucide-react"


export default function Topbar() {
  const navItems = [
    { id: "settings", name: "Análisis General", icon: ChartArea, href: "/generalStats", active: true },
    { id: "feed", name: "Análisis del Feed", icon: ImageUp, href: "/feedAnalyzer" },
    { id: "post", name: "Análisis de Posts", icon: GalleryThumbnails, href: "/postAnalyzer" },
    { id: "comments", name: "Análisis de Comentarios", icon: MessageCircle, href: "/commentsAnalyzer" }, 
  ]

  return (
    <div className="h-12 w-[300px] md:w-[700px] flex py-2 items-center rounded-md justify-between">
      
      {/* Left section - Navigation */}
      <div className="flex space-x-1 truncate font-inter">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex items-center h-full px-3 py-3 text-sm font-medium rounded-md ${
              item.active
                ? "bg-theme-light dark:bg-card"
                : "text-theme-darkest hover:bg-theme-light dark:hover:bg-card dark:text-theme-light"
            }`}
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.name}
          </a>
        ))}
      </div>
    </div>
  )
}