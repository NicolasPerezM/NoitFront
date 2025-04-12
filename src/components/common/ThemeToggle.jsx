"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, SunMoon } from "lucide-react";

/**
 * ThemeToggle – Permite al usuario alternar entre el modo claro y el modo oscuro.
 *
 * Este componente determina la preferencia inicial del usuario (almacenada o basada en el sistema)
 * y actualiza la clase "dark" en el elemento raíz. Se adapta visualmente según la variante, tamaño y posición.
 *
 * @param {Object} props
 * @param {("icon"|"switch"|"button")} [props.variant="icon"] - Estilo visual del toggle.
 * @param {("sm"|"md"|"lg")} [props.size="md"] - Tamaño del toggle.
 * @param {("fixed"|"inline")} [props.position="inline"] - Posicionamiento del toggle.
 * @param {string} [props.className] - Clases adicionales para personalización.
 */
export default function ThemeToggle({
  variant = "icon",
  size = "md",
  position = "inline",
  className = "",
}) {
  // Almacena el tema actual; por defecto "light"
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Obtiene el tema previamente guardado en el almacenamiento local o utiliza la preferencia del sistema.
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  // Invierte el tema actual y sincroniza el cambio en el DOM y en localStorage.
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Configuración de clases basada en el tamaño; define estilos para cada variante visual.
  const sizeMap = {
    sm: {
      icon: "h-6 w-6 p-1.5",
      switch: "h-6 w-12",
      button: "text-xs px-2 py-1",
    },
    md: {
      icon: "h-10 w-10 p-2",
      switch: "h-7 w-14",
      button: "text-sm px-3 py-1.5",
    },
    lg: {
      icon: "h-12 w-12 p-2.5",
      switch: "h-8 w-16",
      button: "text-base px-4 py-2",
    },
  };

  // Determina si el toggle se posiciona de forma fija o en línea según la prop "position".
  const positionClass =
    position === "fixed" ? "fixed bottom-4 right-4 z-50" : "relative";

  // Renderizado condicional basado en la variante solicitada.
  if (variant === "icon") {
    return (
      <button
        aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
        title={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
        onClick={toggleTheme}
        className={`${positionClass} ${sizeMap[size].icon} cursor-pointer rounded-full bg-theme-gray dark:bg-theme-light dark:hover:bg-theme-darkest text-theme-white dark:text-theme-darkest  hover:bg-theme-darkest  hover:text-theme-primary transition-colors ${className}`}
      >
        {theme === "light" ? (
          <Moon className="h-full w-full" />
        ) : (
          <Sun className="h-full w-full" />
        )}
      </button>
    );
  }

  if (variant === "switch") {
    return (
      <button
        aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
        title={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
        onClick={toggleTheme}
        className={`${positionClass} ${sizeMap[size].switch} relative rounded-full bg-gray-300 dark:bg-chart-2 transition-colors duration-300 ${className}`}
      >
        <span
          className={`absolute top-0.5 h-5/6 aspect-square rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
            theme === "light" ? "left-1" : "left-[calc(100%-1.75rem)]"
          }`}
        >
          {theme === "light" ? (
            <Moon className="h-full w-full p-1 text-theme-darkest" />
          ) : (
            <Sun className="h-full w-full p-1 text-theme-primary" />
          )}
        </span>
      </button>
    );
  }

  if (variant === "button") {
    return (
      <button
        aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
        onClick={toggleTheme}
        className={`${positionClass} ${sizeMap[size].button} flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
      >
        {theme === "light" ? (
          <>
            <Moon className="h-4 w-4" />
            <span>Modo oscuro</span>
          </>
        ) : (
          <>
            <Sun className="h-4 w-4" />
            <span>Modo claro</span>
          </>
        )}
      </button>
    );
  }

  // Retorno por defecto en caso de que no se reconozca la variante.
  return (
    <button
      aria-label="Cambiar tema"
      onClick={toggleTheme}
      className={`${positionClass} ${sizeMap.md.icon} rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
    >
      <SunMoon className="h-full w-full" />
    </button>
  );
}
