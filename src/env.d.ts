// This directive is a triple-slash command used in TypeScript.
// It references the type definitions for Astro's client-side environment.
// This ensures that TypeScript is aware of the specific types and globals provided by Astro when working with client-side code.
/// <reference types="astro/client" />

/**
 * @interface User
 * @description Defines the structure for a user object within the application.
 * This interface is used to ensure type consistency when handling user data.
 *
 * @property {string} id - The unique identifier for the user. Typically a UUID or database ID.
 * @property {string} email - The user's email address. Used for login and communication.
 * @property {string} [name] - (Optional) The user's display name.
 */
interface User {
  id: string;
  email: string;
  name?: string;
}

/**
 * @namespace App
 * @description Augments the global `App` namespace, specifically for Astro projects.
 * This is a common pattern in Astro to extend the types available in `Astro.locals`.
 */
declare namespace App {
  /**
   * @interface Locals
   * @description Extends the `Astro.locals` object, which provides request-specific context in Astro middleware and API routes.
   * This interface allows type-safe access to custom properties added to `Astro.locals`.
   *
   * @property {boolean} isAuthenticated - A flag indicating whether the current request is from an authenticated user.
   *                                      Typically set by authentication middleware.
   * @property {User | null} user - Holds the `User` object if the user is authenticated, otherwise `null`.
   *                                This provides easy access to the current user's data.
   * @property {string | null} [token] - (Optional) The authentication token (e.g., JWT) for the current session, if available.
   *                                   This might be used for API requests or session management.
   */
  interface Locals {
    isAuthenticated: boolean;
    user: User | null;
    token?: string | null;
  }
}