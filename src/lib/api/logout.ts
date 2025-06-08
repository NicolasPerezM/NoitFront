/**
 * @async
 * @function handleLogout
 * @description Handles the user logout process by sending a request to the logout API endpoint.
 *              If successful, it redirects the user to the login page.
 *              If unsuccessful, it throws an error with a message from the API or a default/unexpected error message.
 *
 * @returns {Promise<void>} A promise that resolves if the logout and redirection are successful,
 *                          or rejects if there's an error during the logout attempt.
 * @throws {Error} Throws an error if the logout API request fails, returns an error status,
 *                 or if an unexpected error occurs during the process.
 */
export const handleLogout = async (): Promise<void> => {
  try {
    // Perform a POST request to the '/api/auth/logout' endpoint.
    // Even though logout might not strictly need a body, POST is often used for actions that change server-side state (like invalidating a session).
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Standard header, though body might not be strictly necessary for logout.
      },
      // credentials: 'include' might be needed if the server relies on cookies to identify the session to logout.
      // Assuming it's handled by http-only cookies or server-side session management initiated by this request.
    });

    // Check if the response status is not OK (e.g., server error during logout).
    if (!res.ok) {
      let errorMessage = "Error al cerrar sesión"; // Default error message.
      try {
        // Attempt to parse the error response body as JSON.
        const data = await res.json();
        // If the parsed data contains an 'error' property, use its value.
        errorMessage = data?.error || errorMessage;
      } catch (e) {
        // If parsing as JSON fails, the default error message will be used.
        console.error("Failed to parse error response JSON during logout:", e);
      }
      // Throw an error with the determined error message.
      throw new Error(errorMessage);
    }

    // If the logout was successful, redirect the user to the login page.
    // This is a client-side redirection.
    window.location.href = "/login";
  } catch (error) {
    // Handle any errors that occurred during the fetch or error processing.
    if (error instanceof Error) {
      // If the caught object is an instance of Error, re-throw it.
      // This preserves the error message and stack trace from the specific error.
      throw error;
    }
    // For any other type of thrown object (less common in modern JS, but possible),
    // throw a new generic error.
    throw new Error("Error inesperado al cerrar sesión");
  }
};