// src/lib/api/chatMessage.ts

/**
 * @type ChatMessageInput
 * @description Defines the structure for the input when sending a chat message.
 * @property {string} sessionId - The identifier for the current chat session.
 * @property {string} message - The content of the chat message being sent.
 * @property {boolean} isFirstMessage - Flag indicating if this is the first message in the session,
 *                                    which might trigger different handling on the backend (e.g., session creation).
 */
type ChatMessageInput = {
    sessionId: string;
    message: string;
    isFirstMessage: boolean;
};

/**
 * @type ChatMessageResponse
 * @description Defines the structure for the response received from the API after sending a chat message.
 * @property {string} reply - The chatbot's reply to the message.
 * @property {string} session_id - The identifier for the current chat session (might be updated or confirmed by the backend).
 * @property {number} current_question_index - The index of the current question in a predefined sequence, if applicable.
 * @property {number} total_questions - The total number of questions in the sequence, if applicable.
 * @property {boolean} session_finished - Flag indicating if the chat session has concluded.
 * @property {any} [key: string] - Allows for other arbitrary properties in the response, providing flexibility.
 */
type ChatMessageResponse = {
    reply: string;
    session_id: string;
    current_question_index: number;
    total_questions: number;
    session_finished: boolean;
    [key: string]: any; // Allows for additional, unspecified properties.
};

/**
 * @type ApiErrorPayload
 * @description Defines a flexible structure for potential error payloads from the API.
 *              This is a common error structure used across different API functions in this library.
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
 * @function chatMessage
 * @description Sends a chat message to the '/api/chat/chatMessage' endpoint.
 *              It handles the POST request and processes the response, including detailed error parsing.
 *
 * @param {ChatMessageInput} input - The chat message data to be sent in the request body.
 * @returns {Promise<ChatMessageResponse>} A promise that resolves with the API's response to the chat message.
 * @throws {Error} Throws an error with a descriptive message if the API request fails or returns an error status.
 *                 The error message is extracted from various possible fields in the API's error response.
 */
export async function chatMessage(input: ChatMessageInput): Promise<ChatMessageResponse> {
    try {
        // Perform a POST request to the chat message API endpoint.
        const response = await fetch('/api/chat/chatMessage', {
            method: 'POST', // HTTP method.
            headers: {
                'Content-Type': 'application/json', // Indicate JSON content type.
            },
            credentials: 'include', // Include cookies for session management/authentication.
            body: JSON.stringify(input), // Convert the input object to a JSON string.
        });

        // Check if the response status indicates an error.
        if (!response.ok) {
            // Initialize a base error message using status and statusText.
            let errorMessage = `Error ${response.status}: ${response.statusText || 'Error desconocido al contactar el servidor'}`;
            let errorDetails: ApiErrorPayload | string | null = null;

            try {
                // Attempt to parse the error response body as JSON.
                errorDetails = await response.json();

                // If parsing is successful and it's an object, try to extract a more specific error message
                // from common error fields like 'error.detail', 'error.message', 'detail', or 'message'.
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
                        // Fallback if a specific known error field isn't found, stringify the whole object.
                        errorMessage = `Error del servidor: ${JSON.stringify(errorDetails)}`;
                    }
                } else if (typeof errorDetails === 'string') {
                    // If the error payload is just a string.
                    errorMessage = errorDetails;
                }
            } catch (jsonError) {
                // If parsing as JSON fails, try to read the error response as plain text.
                try {
                    const textError = await response.text();
                    if (textError) {
                        errorMessage = textError;
                    }
                } catch (textError) {
                    // If reading as text also fails, the base errorMessage (from status/statusText) is kept.
                }
            }
            // Throw an error with the most descriptive message obtained.
            throw new Error(errorMessage);
        }

        // If the response is OK, parse the successful response body as JSON.
        const data: ChatMessageResponse = await response.json();
        // Log the response data (consider removing or using a more sophisticated logger for production).
        console.log('First message response:', data);
        return data; // Return the parsed data.

    } catch (error) {
        // Catch any errors from the fetch operation or the error handling block above.
        if (error instanceof Error) {
            // If it's an instance of Error, re-throw with its message or a default.
            throw new Error(error.message || 'Ocurrió un error desconocido en la petición.');
        } else {
            // For non-Error exceptions (e.g., if something other than an Error object is thrown),
            // convert to string and throw.
            throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
        }
    }
}