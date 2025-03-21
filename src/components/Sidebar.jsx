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
      { id: "market", name: "Market Analysis", icon: Globe},
      { id: "configuracion", name: "Configuración", icon: Settings },
    ]
  
    return (
      <div className="flex flex-col h-full border-r-4 border-dark-blue">
        {/* Logo */}
        
        <div className="flex items-center justify-center gap-2 h-12 border-b-4 border-dark-blue ">
          <img src="/data/661173d22e87885e52d592e7_Group 73.svg" alt="" className="w-8 h-8" />
          <span className="text-xl font-semibold text-theme-primary">MOBIUS</span>
        </div>
  
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href="#"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    item.active ? "bg-primary text-white" : "text-theme-gray hover:bg-dark-blue hover:text-theme-primary"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
  
        {/* User section 
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
        </div>*/}
      </div>
    )
  }
  