// Indicates that this component should only be rendered on the client-side.
"use client";
// Import React library.
import React from "react";

// Tailwind CSS class maps for customizing the loader's appearance and behavior.
// SIZE_MAP defines classes for different sizes of the loader.
const SIZE_MAP = {
  sm: "h-8 w-8", // Small size
  md: "h-12 w-12", // Medium size (default)
  lg: "h-16 w-16", // Large size
  xl: "h-24 w-24", // Extra-large size
};

// COLOR_MAP defines text color classes for the loader.
const COLOR_MAP = {
  primary: "text-primary", // Primary color
  secondary: "text-secondary", // Secondary color
  accent: "text-accent", // Accent color
};

// SPEED_MAP defines animation speed classes for the loader's spinning animation.
const SPEED_MAP = {
  slow: "animate-spin-slow", // Slow spin
  normal: "animate-spin", // Normal spin (default)
  fast: "animate-spin-fast", // Fast spin
};

// CircularLoader component definition.
// This component displays a circular loading indicator.
export default function CircularLoader({
  size = "md", // Size of the loader, defaults to medium.
  color = "primary", // Color of the loader, defaults to primary.
  text = "Cargando...", // Text to display below the loader, defaults to "Loading...".
  showText = true, // Whether to show the text, defaults to true.
  fullScreen = false, // Whether the loader should take up the full screen, defaults to false.
  logo, // Optional logo to display instead of the default spinner.
  speed = "normal", // Speed of the spinning animation, defaults to normal.
}) {
  // Determine Tailwind CSS classes based on props, with fallbacks to default values.
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  // If a color is provided that's not in COLOR_MAP, it will be used directly as a class (e.g., "text-red-500").
  const colorClass = COLOR_MAP[color] || color;
  const speedClass = SPEED_MAP[speed] || SPEED_MAP.normal;

  // Define container classes. If fullScreen is true, it covers the entire screen with a semi-transparent background.
  // Otherwise, it's a flex container centered horizontally and vertically.
  const containerClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50" // Full screen styles
    : "flex flex-col items-center justify-center"; // Default container styles

  return (
    // Outer container div for the loader.
    <div className={containerClass}>
      {/* Inner container for centering the loader and text. */}
      <div className="flex flex-col items-center  ">
        {/* Div for the spinning loader itself, applying size, color, and speed classes. */}
        <div className={`${sizeClass} ${colorClass} ${speedClass}`}>
          {logo ? (
            // If a logo is provided, display it.
            <div className="h-full w-full flex items-center justify-center">{logo}</div>
          ) : (
            // Otherwise, display the default circular spinner.
            // It's a div with a border, where the right border is transparent to create the spinning effect.
            <div className="h-full w-full rounded-full border-4 border-current border-r-transparent flex items-center justify-center">
              {/* Placeholder text "BA" inside the spinner, likely an abbreviation or branding. */}
              <span className="text-xs font-bold">BA</span>
            </div>
          )}
        </div>
        {/* Conditionally render the loading text if showText is true. */}
        {showText && <p className={`mt-3 text-sm font-medium ${colorClass}`}>{text}</p>}
      </div>
    </div>
  );
}
