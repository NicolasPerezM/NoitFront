/**
 * @async
 * @function registerUser
 * @description Registers a new user by sending their email and password to the registration API endpoint.
 *
 * @param {object} credentials - An object containing the user's registration credentials.
 * @param {string} credentials.email - The email address of the user to register.
 * @param {string} credentials.password - The password for the new user account.
 *
 * @returns {Promise<any>} A promise that resolves with the data returned from the API upon successful registration.
 *                         The exact structure of this data depends on the API's response.
 * @throws {Error} Throws an error if the registration API request fails, returns an error status,
 *                 or if an unexpected error occurs during the process. The error message will be
 *                 extracted from the API response if possible, otherwise a generic message is used.
 *
 * @example
 * try {
 *   const registrationData = await registerUser({ email: 'user@example.com', password: 'password123' });
 *   console.log('Registration successful:', registrationData);
 *   // Handle successful registration (e.g., redirect to login, show success message)
 * } catch (error) {
 *   console.error('Registration failed:', error.message);
 *   // Handle registration error (e.g., display error message to the user)
 * }
 */
export const registerUser = async ({email, password}: {
  email: string;
  password: string;
}) => {
  try {
    // Perform a POST request to the specified registration API endpoint.
    const res = await fetch('https://noit.com.co/api/v1/auth/register', {
      method: 'POST', // HTTP method for creating a new resource.
      headers: {
        'Content-Type': 'application/json', // Indicate that the request body is JSON.
      },
      body: JSON.stringify({email, password}), // Send email and password in the request body.
    });

    // Attempt to parse the response body as JSON, regardless of response.ok status,
    // as error responses may also contain JSON with error details.
    const data = await res.json();
    
    // Check if the response status is not OK (e.g., 400 for validation error, 409 for conflict, 500 for server error).
    if (!res.ok) {
      // If there's a 'message' property in the parsed JSON data, use it for the error.
      // Otherwise, use a default error message.
      throw new Error(data.message || 'Error al registrar usuario');
    }

    // If the response is OK, return the parsed data (which might include user info or a success message).
    return data;
  } catch (error) {
    // Handle any errors that occurred during the fetch or JSON parsing.
    if (error instanceof Error) {
      // If the caught object is an instance of Error (which it should be if thrown by `new Error` above),
      // re-throw it to preserve its message and stack trace.
      throw error;
    }
    // For any other type of thrown object (less common), throw a new generic error.
    throw new Error('Error inesperado al registrar usuario');
  }
};