import {
    BarChart2,
    Search,
    TrendingUp,
    Settings,
    User,
    LogOut,
    Calendar,
    FileText,
    MessageCircle,
    Globe,
  } from "lucide-react"
  
  export default function Sidebar() {
    const navItems = [
      { id: "dashboard", name: "Dashboard General", icon: BarChart2 },
      { id: "analisis", name: "Análisis por Cuenta", icon: Search },
      { id: "feed", name: "Feed Analyzer", icon: Calendar },
      { id: "post", name: "Post Analyzer", icon: FileText },
      { id: "comments", name: "General Comments Analyzer", icon: MessageCircle },
      { id: "estrategias", name: "Estrategias de Marca", icon: TrendingUp },
      { id: "market", name: "Market Analysis", icon: Globe, active: true },
      { id: "configuracion", name: "Configuración", icon: Settings },
    ]
  
    return (
      <div className="flex flex-col h-full w-64">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 ">
          <span className="text-xl font-semibold text-primary">LOGO</span>
        </div>
  
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href="#"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    item.active ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
  
        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Usuario</p>
              <button className="flex items-center text-xs text-gray-500 hover:text-primary">
                <LogOut className="h-3 w-3 mr-1" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  