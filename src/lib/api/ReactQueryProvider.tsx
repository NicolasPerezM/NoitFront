// This directive indicates that the component should be treated as a Client Component
// in frameworks like Next.js or Astro that support React Server Components.
// It's essential for components that use client-side hooks like useState or context.
'use client';

// Import necessary components and types from @tanstack/react-query and React.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react'; // ReactNode type for children prop.
import { useState } from 'react'; // useState hook for managing client state.

/**
 * @component ReactQueryProvider
 * @description A wrapper component that provides a TanStack Query (React Query) client
 *              to its children. This setup is essential for using React Query's
 *              hooks (like useQuery, useMutation) throughout the application.
 *
 * @param {object} props - The component's props.
 * @param {ReactNode} props.children - The child components that will have access to the QueryClient.
 *
 * @returns {JSX.Element} The QueryClientProvider wrapping the children components.
 *
 * @example
 * // In your main application file (e.g., _app.tsx or layout.tsx):
 * import ReactQueryProvider from './ReactQueryProvider';
 *
 * function MyApp({ Component, pageProps }) {
 *   return (
 *     <ReactQueryProvider>
 *       <Component {...pageProps} />
 *     </ReactQueryProvider>
 *   );
 * }
 */
export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  // Initialize a new QueryClient instance using useState.
  // Using useState ensures that the QueryClient instance is created only once
  // per component lifecycle and persists across re-renders.
  // The function `() => new QueryClient()` is passed to useState so that
  // `new QueryClient()` is executed only on the initial render.
  const [queryClient] = useState(() => new QueryClient());

  // Wrap the children components with QueryClientProvider.
  // This makes the `queryClient` instance available to all descendant components
  // that use React Query hooks.
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
