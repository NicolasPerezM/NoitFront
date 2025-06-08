/**
 * @interface LoginCredentials
 * @description Defines the structure for the user's login credentials.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * @async
 * @function handleLogin
 * @description Handles the user login process by sending credentials to the login API endpoint.
 *              If successful, it redirects the user to the dashboard.
 *              If unsuccessful, it throws an error with a message from the API or a default message.
 *
 * @param {LoginCredentials} credentials - An object containing the user's email and password.
 * @returns {Promise<void>} A promise that resolves if the login and redirection are successful,
 *                          or rejects if there's an error during the login attempt.
 * @throws {Error} Throws an error if the login API request fails or returns an error status.
 *                 The error message is extracted from the API's error response if possible.
 */
export async function handleLogin(credentials: LoginCredentials): Promise<void> {
  // Perform a POST request to the '/api/auth/login' endpoint.
  const res = await fetch("/api/auth/login", {
    method: "POST", // HTTP method for sending data.
    headers: {
      "Content-Type": "application/json", // Indicate that the request body is JSON.
    },
    body: JSON.stringify(credentials), // Convert the credentials object to a JSON string.
    credentials: "include" // Include cookies in the request (e.g., for session management by the server).
  });

  // Check if the response status is not OK (e.g., 400, 401, 500).
  if (!res.ok) {
    let errorMessage = "Error al iniciar sesión"; // Default error message.
    try {
      // Attempt to parse the error response body as JSON.
      const data = await res.json();
      // If the parsed data contains an 'error' property, use its value as the error message.
      errorMessage = data?.error || errorMessage;
    } catch (e) {
      // If parsing as JSON fails, the default error message will be used.
      // This can happen if the server returns a non-JSON error response.
      console.error("Failed to parse error response JSON:", e);
    }
    // Throw an error with the determined error message.
    throw new Error(errorMessage);
  }

  // If the login was successful (response.ok is true), redirect the user to the dashboard (root path "/").
  // This is a client-side redirection.
  window.location.href = "/";
}