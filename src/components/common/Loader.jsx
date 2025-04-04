"use client";
import React from "react";

// Mapas de clases para tamaño, color y velocidad
const SIZE_MAP = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

const COLOR_MAP = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

const SPEED_MAP = {
  slow: "animate-spin-slow",
  normal: "animate-spin",
  fast: "animate-spin-fast",
};

export default function CircularLoader({
  size = "md",
  color = "primary",
  text = "Cargando...",
  showText = true,
  fullScreen = false,
  logo,
  speed = "normal",
}) {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const colorClass = COLOR_MAP[color] || color;
  const speedClass = SPEED_MAP[speed] || SPEED_MAP.normal;

  // Si fullScreen es true, se ocupa toda la pantalla con fondo semi-transparente
  const containerClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50"
    : "flex flex-col items-center justify-center";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center  ">
        <div className={`${sizeClass} ${colorClass} ${speedClass}`}>
          {logo ? (
            <div className="h-full w-full flex items-center justify-center">{logo}</div>
          ) : (
            <div className="h-full w-full rounded-full border-4 border-current border-r-transparent flex items-center justify-center">
              <span className="text-xs font-bold">BA</span>
            </div>
          )}
        </div>
        {showText && <p className={`mt-3 text-sm font-medium ${colorClass}`}>{text}</p>}
      </div>
    </div>
  );
}
