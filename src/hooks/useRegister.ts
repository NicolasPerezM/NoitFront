// Import the useMutation hook from @tanstack/react-query.
// useMutation is used for operations that create, update, or delete data,
// which is appropriate for user registration.
import { useMutation } from '@tanstack/react-query';

// Import the actual user registration API function 'registerUser'.
// This function handles the network request to the registration endpoint.
import { registerUser } from '@/lib/api/register';

/**
 * @function useRegister
 * @description Custom React hook that provides a mutation function for user registration.
 *
 * This hook abstracts the `useMutation` logic from `@tanstack/react-query` specifically
 * for the user registration process. It simplifies component logic by handling
 * the API call state (loading, error, success) for the `registerUser` function.
 *
 * @returns {object} Returns an object from `useMutation` which includes:
 *  - `mutate`: The function to call to trigger the user registration.
 *              It takes the user registration data (e.g., email, password, name) as an argument.
 *  - `mutateAsync`: An asynchronous version of `mutate`.
 *  - `data`: The data returned from the `registerUser` API call upon successful registration
 *            (e.g., user object, success message).
 *  - `error`: Any error object if the registration fails (e.g., validation errors, server errors).
 *  - `isPending`: Boolean indicating if the registration request is currently in progress.
 *  - `isSuccess`: Boolean indicating if the registration was successful.
 *  - `isError`: Boolean indicating if the registration resulted in an error.
 *  ... and other properties provided by `useMutation`.
 *
 * @example
 * const { mutate: performRegister, data: registrationResponse, isPending, error } = useRegister();
 *
 * const handleSubmitRegistration = (formData) => {
 *   performRegister(formData);
 * };
 *
 * if (isPending) return <p>Registering...</p>;
 * if (error) return <p>Registration failed: {error.message}</p>;
 * if (registrationResponse) return <p>Registration successful!</p>;
 */
export function useRegister() {
  // Configure and use the useMutation hook.
  // The `mutationFn` option is set to the `registerUser` API function.
  // This function will be called when `mutate` (returned by `useMutation`) is invoked.
  return useMutation({
    mutationFn: registerUser,
    // Optional callbacks like onSuccess, onError, or onSettled can be defined here
    // to handle side effects such as redirecting the user after successful registration,
    // displaying notifications, or updating global state.
  });
}
