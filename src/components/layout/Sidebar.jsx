"use client";

import { useState } from "react";
import {
  BarChart2,
  Search,
  TrendingUp,
  Calendar,
  ChevronDown,
  Settings,
  Instagram,
  Facebook,
  Menu,
  X
} from "lucide-react";

// Componente principal del sidebar
export default function Sidebar() {
  // Estado para controlar la visibilidad del sidebar en dispositivos móviles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  // Función para cerrar el sidebar
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {/* Botón de menú para abrir el sidebar en dispositivos móviles (oculto en pantallas md en adelante) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Overlay que cierra el sidebar al hacer clic fuera (solo en móviles) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar principal */}
      <aside
        className={`h-screen fixed top-0 left-0 transform transition-transform duration-300 z-50 bg-theme-light dark:bg-theme-dark ${
          // En dispositivos móviles, se oculta con -translate-x-full y se muestra cuando isSidebarOpen es true
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:z-auto w-[260px]`}
      >
        {/* Botón de cierre visible solo en dispositivos móviles */}
        <div className="md:hidden flex justify-end p-2">
          <button onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>
        <nav className="h-full flex flex-col">
          {/* Sección de logo y título */}
          <div className="p-4 pb-2 flex gap-4 items-center">
            <img
              src="/data/661173d22e87885e52d592e7_Group 73.svg"
              className="w-12"
              alt="Logo"
            />
            <h2 className="text-2xl font-bold font-display">Mobius</h2>
          </div>
          {/* Lista de elementos del menú */}
          <ul className="flex-1 p-2 mt-4">
            <SidebarItem
              href="/"
              icon={<BarChart2 />}
              text="Estadísticas Generales"
            />

            <SidebarDropdownItem icon={<Search />} text="Redes Analizadas">
              <SidebarItem icon={<Instagram />} text="Instagram" />
              <SidebarItem
                href="/subitem2"
                icon={<Calendar />}
                text="TikTok"
              />
              <SidebarItem
                href="/subitem2"
                icon={<Facebook />}
                text="Facebook"
              />
            </SidebarDropdownItem>
            <SidebarItem href="/" icon={<TrendingUp />} text="Comparativas" />
            <SidebarItem href="/" icon={<Settings />} text="Ajustes" />
          </ul>
        </nav>
      </aside>
    </>
  );
}

// Componente para un elemento individual del sidebar
export function SidebarItem({ icon, text, active, href }) {
  return (
    <li>
      <a
        href={href}
        className={`flex items-center gap-2 p-2 cursor-pointer truncate rounded-md text-md font-medium 
          hover:bg-theme-primary hover:text-theme-darkest dark:hover:bg-theme-primary dark:hover:text-white 
          ${active ? "bg-theme-primary text-white" : ""}`}
      >
        {icon}
        <span>{text}</span>
      </a>
    </li>
  );
}

// Componente para un elemento del sidebar que incluye un submenú desplegable
export function SidebarDropdownItem({ icon, text, children, active }) {
  // Estado para controlar la visibilidad del submenú
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      {/* Elemento principal del dropdown; al hacer clic se alterna la visibilidad del submenú */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center text-md gap-2 p-2 cursor-pointer truncate rounded-md font-medium 
          hover:bg-theme-primary hover:text-theme-darkest dark:hover:bg-theme-primary dark:hover:text-white 
          ${active ? "bg-theme-primary text-white" : ""}`}
      >
        {icon}
        <span>{text}</span>
        {/* Icono de flecha que rota 180° cuando el dropdown está abierto */}
        <ChevronDown
          className={`ml-auto transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={16}
        />
      </div>
      {/* Contenido del submenú, visible solo cuando isOpen es true */}
      {isOpen && <ul className="ml-4 mt-2">{children}</ul>}
    </li>
  );
}
