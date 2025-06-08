// Import the QueryClient class from @tanstack/react-query.
// QueryClient is the core of React Query, managing the cache and state of queries.
import { QueryClient } from '@tanstack/react-query';

/**
 * @constant queryClient
 * @description An instance of `QueryClient` from `@tanstack/react-query`.
 *
 * This instance is created here and can be imported throughout the application
 * to be provided to the `QueryClientProvider`. This setup allows all components
 * wrapped by the provider to share the same query cache and configuration.
 *
 * It's common practice to create a single instance of `QueryClient` for an application
 * to ensure a unified caching strategy. Default options for queries and mutations
 * can also be configured directly on this instance if needed, for example:
 *
 * ```typescript
 * export const queryClient = new QueryClient({
 *   defaultOptions: {
 *     queries: {
 *       staleTime: 1000 * 60 * 5, // 5 minutes
 *       refetchOnWindowFocus: false,
 *     },
 *   },
 * });
 * ```
 *
 * This instance will be used by the `ReactQueryProvider` component to make
 * React Query functionalities available to the application's component tree.
 */
export const queryClient = new QueryClient();
