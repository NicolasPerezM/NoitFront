// Import the useMutation hook from @tanstack/react-query.
// useMutation is used here to send a chat message, which is a form of data creation/mutation.
import { useMutation } from '@tanstack/react-query';

// Import the actual mutation function 'chatMessage' from the API library.
// This function is responsible for making the API call to send a chat message.
import { chatMessage } from '@/lib/api/chatMessage';

/**
 * @function useChatMessage
 * @description Custom React hook that provides a mutation function for sending chat messages.
 *
 * This hook encapsulates the `useMutation` logic from `@tanstack/react-query`,
 * simplifying the process of sending a chat message via the `chatMessage` API call
 * and managing its state (e.g., loading, error, success) within React components.
 *
 * @returns {object} Returns an object from `useMutation` which includes:
 *  - `mutate`: The function to call to trigger sending the chat message.
 *              It takes the message payload as an argument.
 *  - `mutateAsync`: An asynchronous version of `mutate`.
 *  - `data`: The data returned from the `chatMessage` API call upon success (e.g., confirmation or the sent message).
 *  - `error`: Any error object if the mutation fails.
 *  - `isPending`: Boolean indicating if the message sending is currently in progress.
 *  - `isSuccess`: Boolean indicating if the message was sent successfully.
 *  - `isError`: Boolean indicating if sending the message resulted in an error.
 *  ... and other properties provided by `useMutation`.
 *
 * @example
 * const { mutate: sendMessage, isPending } = useChatMessage();
 *
 * const handleSend = (messageText) => {
 *   sendMessage({ text: messageText, sessionId: 'currentSessionId' });
 * };
 *
 * if (isPending) return <p>Sending message...</p>;
 */
export function useChatMessage() {
  // Configure and use the useMutation hook.
  // The `mutationFn` option is set to the `chatMessage` function,
  // which will be executed when the mutation is triggered by calling `mutate`.
  return useMutation({
    mutationFn: chatMessage,
    // Callbacks like onSuccess, onError, or onSettled can be added here
    // to perform actions after the chat message mutation attempt.
  });
}