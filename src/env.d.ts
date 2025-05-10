/// <reference types="astro/client" />

/**
 * Represents a user in the application
 * @interface User
 * @property {string} id - Unique identifier for the user
 * @property {string} email - User's email address
 * @property {string} [name] - Optional user's display name
 */
interface User {
  id: string;
  email: string;
  name?: string;
}

/**
 * Global namespace for application-specific types
 * @namespace App
 */
declare namespace App {
  /**
   * Type definitions for Astro's local context
   * @interface Locals
   * @property {boolean} isAuthenticated - Indicates if user is logged in
   * @property {User | null} user - Current user data or null if not authenticated
   * @property {string | null} [token] - Authentication token if available
   */
  interface Locals {
    isAuthenticated: boolean;
    user: User | null;
    token?: string | null;
  }
}