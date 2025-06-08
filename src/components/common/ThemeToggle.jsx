// Specifies that this component should run on the client side, as it uses browser-specific APIs like localStorage and window.matchMedia.
"use client";

// Import useState and useEffect hooks from React for state management and side effects.
import { useState, useEffect } from "react";
// Import icons for sun (light mode), moon (dark mode), and a combined sun/moon icon from lucide-react.
import { Sun, Moon, SunMoon } from "lucide-react";

/**
 * ThemeToggle - Allows the user to switch between light and dark mode.
 *
 * This component determines the user's initial preference (stored or system-based)
 * and updates the "dark" class on the root HTML element. It visually adapts based on variant, size, and position props.
 *
 * @param {Object} props - The component's props.
 * @param {("icon"|"switch"|"button")} [props.variant="icon"] - Visual style of the toggle.
 * @param {("sm"|"md"|"lg")} [props.size="md"] - Size of the toggle.
 * @param {("fixed"|"inline")} [props.position="inline"] - Positioning of the toggle.
 * @param {string} [props.className] - Additional CSS classes for customization.
 */
export default function ThemeToggle({
  variant = "icon", // Default variant is 'icon'.
  size = "md", // Default size is 'md'.
  position = "inline", // Default position is 'inline'.
  className = "", // Default className is an empty string.
}) {
  // State to store the current theme, defaults to "light".
  const [theme, setTheme] = useState("light");

  // useEffect hook to run side effects after component mount (empty dependency array []).
  useEffect(() => {
    // Retrieve the theme preference saved in localStorage.
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      // If a theme is saved, set it as the current theme and update the 'dark' class on the HTML element.
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // If no theme is saved, check the user's system preference using window.matchMedia.
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      // Set the theme based on system preference and update the 'dark' class.
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []); // Empty dependency array means this effect runs once on mount.

  // Function to toggle the theme.
  const toggleTheme = () => {
    // Determine the new theme based on the current theme.
    const newTheme = theme === "light" ? "dark" : "light";
    // Update the theme state.
    setTheme(newTheme);
    // Update the 'dark' class on the HTML element.
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    // Save the new theme preference to localStorage.
    localStorage.setItem("theme", newTheme);
  };

  // Map defining Tailwind CSS classes for different sizes and variants.
  const sizeMap = {
    sm: { // Small size
      icon: "h-6 w-6 p-1.5", // Classes for icon variant
      switch: "h-6 w-12", // Classes for switch variant
      button: "text-xs px-2 py-1", // Classes for button variant
    },
    md: { // Medium size (default)
      icon: "h-10 w-10 p-2",
      switch: "h-7 w-14",
      button: "text-sm px-3 py-1.5",
    },
    lg: { // Large size
      icon: "h-12 w-12 p-2.5",
      switch: "h-8 w-16",
      button: "text-base px-4 py-2",
    },
  };

  // Determine positioning class based on the 'position' prop.
  const positionClass =
    position === "fixed" ? "fixed bottom-4 right-4 z-50" : "relative"; // Fixed position or relative.

  // Conditional rendering based on the 'variant' prop.
  if (variant === "icon") {
    return (
      <button
        aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`} // ARIA label for accessibility.
        title={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`} // Tooltip title.
        onClick={toggleTheme} // Click handler to toggle theme.
        // Apply Tailwind CSS classes for styling, including position, size, colors, and transitions.
        className={`${positionClass} ${sizeMap[size].icon} cursor-pointer rounded-full bg-theme-gray dark:bg-theme-light dark:hover:bg-theme-darkest text-theme-white dark:text-theme-darkest  hover:bg-theme-darkest  hover:text-theme-primary transition-colors ${className}`}
      >
        {/* Display Moon icon for light theme, Sun icon for dark theme. */}
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
        // Apply Tailwind CSS classes for switch styling.
        className={`${positionClass} ${sizeMap[size].switch} relative rounded-full bg-gray-300 dark:bg-primary transition-colors duration-300 ${className}`}
      >
        {/* Inner span for the switch knob. */}
        <span
          className={`absolute top-0.5 h-5/6 aspect-square rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
            // Dynamically position the knob based on the current theme.
            theme === "light" ? "left-1" : "left-[calc(100%-1.75rem)]"
          }`}
        >
          {/* Display Moon or Sun icon inside the knob. */}
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
        // Apply Tailwind CSS classes for button styling.
        className={`${positionClass} ${sizeMap[size].button} flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
      >
        {/* Display icon and text based on the current theme. */}
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

  // Default fallback rendering if the variant is not recognized.
  // Renders a button with a combined SunMoon icon.
  return (
    <button
      aria-label="Cambiar tema" // Generic ARIA label.
      onClick={toggleTheme}
      className={`${positionClass} ${sizeMap.md.icon} rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
    >
      <SunMoon className="h-full w-full" />
    </button>
  );
}
