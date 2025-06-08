/**
 * @type BusinessIdeaInput
 * @description Defines the structure for the input when creating or updating a business idea.
 * @property {string} [title] - (Optional) The title of the business idea.
 * @property {string} description - A detailed description of the business idea. This is mandatory.
 * @property {string} [website_url] - (Optional) A URL related to the business idea (e.g., a landing page or reference).
 */
type BusinessIdeaInput = {
  title?: string;
  description: string;
  website_url?: string;
};

/**
 * @type BusinessIdeaResponse
 * @description Defines the structure for the response received from the API after a business idea operation.
 * @property {string} title - The title of the business idea.
 * @property {string} description - The description of the business idea.
 * @property {string} website_url - The URL associated with the business idea.
 * @property {string} id - The unique identifier for the business idea.
 * @property {string} user_id - The unique identifier of the user who owns this business idea.
 * @property {string} created_at - Timestamp indicating when the business idea was created (ISO 8601 format).
 * @property {string} updated_at - Timestamp indicating when the business idea was last updated (ISO 8601 format).
 */
type BusinessIdeaResponse = {
  title: string;
  description: string;
  website_url: string;
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

/**
 * @type ApiErrorPayload
 * @description Defines a flexible structure for potential error payloads from the API.
 *              It attempts to capture common error message formats.
 * @property {string | { detail?: string; message?: string; [key: string]: any }} [error] - Can be a simple string or an object with more details.
 * @property {string} [detail] - A detailed error message.
 * @property {string} [message] - A general error message.
 * @property {any} [key: string] - Allows for other arbitrary properties in the error payload.
 */
type ApiErrorPayload = {
  error?: string | { detail?: string; message?: string; [key: string]: any };
  detail?: string;
  message?: string;
  [key: string]: any;
};

/**
 * @async
 * @function businessIdea
 * @description Makes a POST request to the '/api/chat/businessIdea' endpoint to create or process a business idea.
 *              It includes robust error handling to parse different error response formats from the API.
 *
 * @param {BusinessIdeaInput} input - The business idea data to be sent in the request body.
 * @returns {Promise<BusinessIdeaResponse>} A promise that resolves with the API's response for the business idea.
 * @throws {Error} Throws an error with a descriptive message if the API request fails or returns an error status.
 *                 The error message is extracted from various possible fields in the API's error response.
 */
export async function businessIdea(input: BusinessIdeaInput): Promise<BusinessIdeaResponse> {
  try {
    // Perform a POST request to the specified API endpoint.
    const response = await fetch('/api/chat/businessIdea', {
      method: 'POST', // HTTP method.
      headers: {
        'Content-Type': 'application/json', // Indicate that the request body is JSON.
      },
      credentials: 'include', // Include cookies in the request, important for authenticated endpoints.
      body: JSON.stringify(input), // Convert the input object to a JSON string.
    });

    // Check if the response status is not OK (i.e., not in the 200-299 range).
    if (!response.ok) {
      // Initialize a base error message.
      let errorMessage = `Error ${response.status}: ${response.statusText || 'Error desconocido al contactar el servidor'}`;
      let errorDetails: ApiErrorPayload | string | null = null;

      try {
        // Attempt to parse the error response body as JSON.
        errorDetails = await response.json();

        // If parsing is successful and it's an object, try to extract a more specific error message.
        if (errorDetails && typeof errorDetails === 'object') {
          if (typeof errorDetails.error === 'string') {
            errorMessage = errorDetails.error;
          } else if (typeof errorDetails.error?.detail === 'string') {
            errorMessage = errorDetails.error.detail;
          } else if (typeof errorDetails.error?.message === 'string') {
            errorMessage = errorDetails.error.message;
          } else if (typeof errorDetails.detail === 'string') {
            errorMessage = errorDetails.detail;
          } else if (typeof errorDetails.message === 'string') {
            errorMessage = errorDetails.message;
          } else {
            // Fallback if a specific known error field isn't found.
            errorMessage = `Error del servidor: ${JSON.stringify(errorDetails)}`;
          }
        } else if (typeof errorDetails === 'string') {
          // If the error payload is just a string.
          errorMessage = errorDetails;
        }
      } catch (jsonError) {
        // If parsing the error response as JSON fails, try to read it as plain text.
        // This can happen if the server returns a non-JSON error (e.g., HTML error page).
        try {
          const textError = await response.text();
          if (textError) {
            errorMessage = textError;
          }
        } catch (textError) {
          // If reading as text also fails, keep the base errorMessage.
        }
      }
      // Throw an error with the determined error message.
      throw new Error(errorMessage);
    }

    // If the response is OK, parse the successful response body as JSON.
    const data: BusinessIdeaResponse = await response.json();
    console.log(data); // Log the successful data (consider removing this for production).
    return data; // Return the parsed data.

  } catch (error) {
    // Catch any errors that occurred during the fetch operation or error handling.
    if (error instanceof Error) {
      // If it's an instance of Error, re-throw with its message or a default.
      throw new Error(error.message || 'Ocurrió un error desconocido en la petición.');
    } else {
      // For non-Error exceptions, convert to string and throw.
      throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
    }
  }
}