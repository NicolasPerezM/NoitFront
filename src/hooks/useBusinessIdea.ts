// Import the useMutation hook from @tanstack/react-query.
// useMutation is typically used for creating, updating, or deleting data (side effects).
import { useMutation } from '@tanstack/react-query';

// Import the actual mutation function 'businessIdea' from the API library.
// This function is responsible for making the API call to generate a business idea.
import { businessIdea } from '@/lib/api/businessIdea';

/**
 * @function useBusinessIdea
 * @description Custom React hook that provides a mutation function for generating business ideas.
 *
 * This hook encapsulates the `useMutation` logic from `@tanstack/react-query`,
 * making it easy to trigger the `businessIdea` API call and manage its state
 * (loading, error, success) within React components.
 *
 * @returns {object} Returns the an object from `useMutation` which includes:
 *  - `mutate`: The function to call to trigger the business idea generation.
 *  - `mutateAsync`: An async version of `mutate`.
 *  - `data`: The data returned from the `businessIdea` API call upon success.
 *  - `error`: Any error object if the mutation fails.
 *  - `isPending`: Boolean indicating if the mutation is currently in progress.
 *  - `isSuccess`: Boolean indicating if the mutation was successful.
 *  - `isError`: Boolean indicating if the mutation resulted in an error.
 *  ... and other properties provided by `useMutation`.
 *
 * @example
 * const { mutate, data, isPending, error } = useBusinessIdea();
 *
 * const handleGenerateIdea = (formData) => {
 *   mutate(formData); // Call mutate with the necessary parameters for the API.
 * };
 *
 * if (isPending) return <p>Generating idea...</p>;
 * if (error) return <p>Error: {error.message}</p>;
 * if (data) return <p>Business Idea: {data.idea}</p>;
 */
export function useBusinessIdea() {
  // Configure and use the useMutation hook.
  // The `mutationFn` option is set to the `businessIdea` function,
  // which will be executed when the mutation is triggered.
  return useMutation({
    mutationFn: businessIdea,
    // Other options like onSuccess, onError, onSettled can be added here
    // to handle side effects or global state updates after the mutation.
  });
}
