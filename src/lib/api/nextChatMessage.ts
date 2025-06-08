/**
 * @type NextChatMessageInput
 * @description Defines the structure for the input when requesting the next chat message.
 * @property {string} sessionId - The identifier for the current chat session.
 * @property {string} message - The user's last message or an identifier for the last interaction.
 *                              This could be the actual message text or a specific command/payload.
 * @property {string} session_id_2 - Likely a redundant or legacy session identifier.
 *                                  Based on typical API design, `sessionId` should be sufficient.
 *                                  If this field serves a distinct purpose (e.g., linking sessions),
 *                                  it should be documented by the API provider.
 *                                  For this commenting pass, we assume it might be extraneous or for a specific,
 *                                  undocumented backend logic.
 */
type NextChatMessageInput = {
  sessionId: string;
  message: string;
  session_id_2: string; // Potential redundancy or specific backend use.
};

/**
 * @type NextChatMessageResponse
 * @description Defines the structure for the response received from the API when fetching the next chat message.
 * @property {string} reply - The chatbot's next message or reply.
 * @property {number} current_question_index - The index of the current question in a sequence, if the chat follows a flow.
 * @property {number} total_questions - The total number of questions in the sequence, if applicable.
 * @property {boolean} session_finished - Flag indicating if the chat session has ended.
 * @property {any} [key: string] - Allows for other arbitrary properties in the response.
 */
type NextChatMessageResponse = {
  reply: string;
  current_question_index: number;
  total_questions: number;
  session_finished: boolean;
  [key: string]: any; // Allows for additional, unspecified properties.
};

/**
 * @type ApiErrorPayload
 * @description Defines a flexible structure for potential error payloads from the API.
 *              Common error structure used across this API library.
 * @property {string | { detail?: string; message?: string; [key: string]: any }} [error] - Can be a simple string or an object.
 * @property {string} [detail] - Detailed error message.
 * @property {string} [message] - General error message.
 * @property {any} [key: string] - Allows for other arbitrary properties.
 */
type ApiErrorPayload = {
  error?: string | { detail?: string; message?: string; [key: string]: any };
  detail?: string;
  message?: string;
  [key: string]: any;
};

/**
 * @async
 * @function nextChatMessage
 * @description Sends a request to the '/api/chat/nextChatMessage' endpoint to retrieve the next message in a chat sequence.
 *              Includes detailed error handling for API responses.
 *
 * @param {NextChatMessageInput} input - The input data, including session ID and the last message/interaction.
 * @returns {Promise<NextChatMessageResponse>} A promise that resolves with the API's response containing the next chat message.
 * @throws {Error} Throws an error with a descriptive message if the API request fails or returns an error status.
 */
export async function nextChatMessage(input: NextChatMessageInput): Promise<NextChatMessageResponse> {
  try {
    // Log the input being sent to the API. Useful for debugging.
    // Consider removing or using a more controlled logging mechanism for production.
    console.log('Sending next message with:', {
      sessionId: input.sessionId,
      session_id_2: input.session_id_2, // Logging the potentially redundant session_id_2
      message: input.message
    });

    // Perform a POST request to the API endpoint.
    const response = await fetch('/api/chat/nextChatMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify JSON content type.
      },
      credentials: 'include', // Include cookies, important for session management.
      body: JSON.stringify(input), // Convert input object to JSON string.
    });

    // Check if the response status indicates an error (not in the 200-299 range).
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText || 'Error desconocido al contactar el servidor'}`;
      let errorDetails: ApiErrorPayload | string | null = null;

      try {
        // Attempt to parse the error response as JSON.
        errorDetails = await response.json();
        // Extract a more specific error message if available in common error fields.
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
            errorMessage = `Error del servidor: ${JSON.stringify(errorDetails)}`;
          }
        } else if (typeof errorDetails === 'string') {
          errorMessage = errorDetails;
        }
      } catch (jsonError) {
        // If JSON parsing fails, try to get the error message as plain text.
        try {
          const textError = await response.text();
          if (textError) {
            errorMessage = textError;
          }
        } catch (textError) {
          // If all parsing fails, the initial HTTP status based error message is used.
        }
      }
      // Throw an error with the determined or default error message.
      throw new Error(errorMessage);
    }

    // If the response is OK, parse the successful response body as JSON.
    const data: NextChatMessageResponse = await response.json();
    // Log the successful response (consider removing for production).
    console.log('Next message response:', data);
    return data; // Return the parsed data.

  } catch (error) {
    // Catch any errors from the fetch operation or the error handling logic.
    if (error instanceof Error) {
      // Re-throw Error instances, preserving message and stack.
      throw new Error(error.message || 'Ocurrió un error desconocido en la petición.');
    } else {
      // For non-Error exceptions, convert to string and throw.
      throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
    }
  }
}