// Import React library, specifically useState and useEffect hooks.
import * as React from "react";

// Define a constant for the mobile breakpoint width in pixels.
// Screens narrower than this will be considered mobile.
const MOBILE_BREAKPOINT = 768;

/**
 * @function useIsMobile
 * @description Custom React hook to determine if the current viewport width is considered mobile.
 *
 * This hook initializes its state to `undefined` to handle server-side rendering scenarios
 * where `window` is not available. On the client-side, it sets up a media query listener
 * to detect changes in viewport width relative to the `MOBILE_BREAKPOINT`.
 * It also checks the initial width on mount.
 *
 * @returns {boolean} `true` if the viewport width is less than `MOBILE_BREAKPOINT`, `false` otherwise.
 *                    Returns `false` during server-side rendering or before the first client-side check.
 */
export function useIsMobile() {
  // State to store whether the screen is mobile. Initialized to undefined for SSR.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Create a media query list object that matches screen widths less than MOBILE_BREAKPOINT.
    // Subtracting 1px ensures that widths *equal* to MOBILE_BREAKPOINT are not considered mobile.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Define a callback function to update the isMobile state when the media query match status changes.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add the event listener for changes in the media query status.
    mql.addEventListener("change", onChange);

    // Perform an initial check of the viewport width when the component mounts on the client side.
    // This is crucial because the 'change' event only fires on *changes*, not on initial load.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup function: remove the event listener when the component unmounts.
    // This prevents memory leaks and unnecessary checks if the component is removed from the DOM.
    return () => mql.removeEventListener("change", onChange);
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount.

  // Return the isMobile state.
  // The `!!` converts `undefined` (initial SSR state) to `false`, ensuring a boolean is always returned.
  return !!isMobile;
}
