// Import the useMutation hook from @tanstack/react-query.
// useMutation is appropriate here as fetching the "next" chat message might involve
// state changes on the server (e.g., marking messages as read, or if it's a generative AI response).
import { useMutation } from '@tanstack/react-query';

// Import the actual API function 'nextChatMessage' from the API library.
// This function is responsible for making the API call to fetch the next chat message.
import { nextChatMessage } from '@/lib/api/nextChatMessage';

/**
 * @function useNextChatMessage
 * @description Custom React hook that provides a mutation function for fetching the next chat message.
 *
 * This hook encapsulates the `useMutation` logic from `@tanstack/react-query`.
 * It simplifies the process of requesting the next chat message via the `nextChatMessage` API
 * and managing the state of this request (loading, error, success) within React components.
 *
 * @returns {object} Returns an object from `useMutation` which includes:
 *  - `mutate`: The function to call to trigger fetching the next chat message.
 *              It may take parameters depending on the `nextChatMessage` API function's requirements (e.g., session ID).
 *  - `mutateAsync`: An asynchronous version of `mutate`.
 *  - `data`: The data returned from the `nextChatMessage` API call upon success (i.e., the next chat message).
 *  - `error`: Any error object if the mutation fails.
 *  - `isPending`: Boolean indicating if the request for the next message is currently in progress.
 *  - `isSuccess`: Boolean indicating if the next message was fetched successfully.
 *  - `isError`: Boolean indicating if fetching the next message resulted in an error.
 *  ... and other properties provided by `useMutation`.
 *
 * @example
 * const { mutate: fetchNextMessage, data: nextMessage, isPending } = useNextChatMessage();
 *
 * const handleFetchNext = (sessionId) => {
 *   fetchNextMessage({ sessionId });
 * };
 *
 * if (isPending) return <p>Loading next message...</p>;
 * if (nextMessage) return <p>Next message: {nextMessage.text}</p>;
 */
export function useNextChatMessage() {
  // Configure and use the useMutation hook.
  // The `mutationFn` is set to the `nextChatMessage` API function.
  return useMutation({
    mutationFn: nextChatMessage,
    // Callbacks like onSuccess, onError, or onSettled can be added here
    // to handle side effects related to fetching the next chat message.
  });
}