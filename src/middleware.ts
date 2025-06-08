// Import the defineMiddleware function from "astro:middleware".
// This function is used to define middleware that will run for requests in an Astro application.
import { defineMiddleware } from "astro:middleware";

/**
 * @constant onRequest
 * @description Astro middleware that runs for every request to the server.
 * Its primary purpose here is to handle authentication by checking for a token
 * in cookies for non-public routes. If a token is not present for a protected route,
 * the user is redirected to the login page.
 *
 * @param {object} context - The Astro middleware context object. It provides information
 *                           about the request, such as the URL, cookies, and locals.
 * @param {function} next - A function to call to pass control to the next middleware
 *                          or to the page/endpoint handler if this is the last middleware.
 *
 * @returns {Promise<Response|void>} Returns a Response object if redirecting,
 *                                   otherwise calls `next()` and returns its result (implicitly void or a Response).
 */
export const onRequest = defineMiddleware(async (context, next) => {
  // Destructure the pathname from the request URL.
  const { pathname } = context.url;

  // Define an array of public paths that do not require authentication.
  // These include login, register, API routes, Astro's internal assets, and favicon.
  const publicPaths = [
    '/login',
    '/register',
    // It's generally good practice to secure API endpoints appropriately,
    // but some might be public (e.g., a status check or public data).
    // This rule allows all /api/ routes. More granular checks might be needed.
  ];

  // Define prefixes for paths that are considered public (e.g., internal Astro assets, some API routes).
  const publicPrefixes = [
    '/api/', // Assuming all /api/ routes are public or handle their own auth.
             // For more security, specific public API routes should be listed explicitly.
    '/_astro/', // Astro's internal asset routes.
  ];

  // Check if the current pathname is considered public.
  const isPublic =
    publicPaths.includes(pathname) || // Exact match for paths in publicPaths.
    publicPrefixes.some(prefix => pathname.startsWith(prefix)) || // Starts with any of the public prefixes.
    pathname === '/favicon.ico'; // Favicon is typically public.

  // If the path is NOT public, then authentication is required.
  if (!isPublic) {
    // Attempt to retrieve the authentication token from cookies.
    // The `?.value` safely accesses the value property if the cookie exists.
    const token = context.cookies.get('token')?.value;

    // If no token is found, the user is not authenticated.
    if (!token) {
      // Redirect the user to the login page.
      // `context.redirect` creates a Response object that performs the redirection.
      return context.redirect('/login');
    }
    // Note: At this point, a token exists. Further validation of the token (e.g., checking its expiry or validity
    // against a backend service) could be performed here or in `Astro.locals` if needed.
    // For this middleware, the presence of a token is deemed sufficient to proceed.
  }

  // If the path is public OR if the user is authenticated for a protected route,
  // proceed to the next middleware or the page/endpoint handler.
  return next();
});

