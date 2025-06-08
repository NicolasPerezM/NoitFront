// Import useState and useEffect hooks from React.
// useState is used for managing component state (data, loading, error).
// useEffect is used for performing side effects (like data fetching) after rendering.
import { useState, useEffect } from 'react';

/**
 * @function useFetchData
 * @description Custom React hook for fetching data from a given URL.
 *
 * This hook encapsulates the logic for asynchronous data fetching,
 * including managing loading and error states. It re-fetches data
 * whenever the provided URL changes.
 *
 * @param {string} url - The URL from which to fetch data.
 *
 * @returns {object} An object containing:
 *  - `data`: The fetched data (initially null, then populated with the JSON response).
 *  - `loading`: A boolean indicating if the data is currently being fetched (true while loading, false otherwise).
 *  - `error`: An error object if the fetch operation fails, otherwise null.
 *
 * @example
 * const { data, loading, error } = useFetchData('https://api.example.com/data');
 *
 * if (loading) return <p>Loading...</p>;
 * if (error) return <p>Error fetching data: {error.message}</p>;
 * if (data) return <pre>{JSON.stringify(data, null, 2)}</pre>;
 */
export default function useFetchData(url) {
  // State for storing the fetched data. Initialized to null.
  const [data, setData] = useState(null);
  // State for tracking the loading status. Initialized to true as fetching starts immediately.
  const [loading, setLoading] = useState(true);
  // State for storing any error that occurs during fetching. Initialized to null.
  const [error, setError] = useState(null);

  // useEffect hook to perform the data fetching side effect.
  // It runs after the initial render and whenever the 'url' dependency changes.
  useEffect(() => {
    // TODO: Implement AbortController for cleanup to prevent memory leaks
    // if the component unmounts while the fetch is still in progress.
    // Example: const controller = new AbortController();
    //          fetch(url, { signal: controller.signal });
    //          return () => controller.abort();

    // Define an async function to perform the fetch operation.
    async function getData() {
      try {
        // Make the HTTP GET request using the Fetch API.
        const response = await fetch(url);

        // Check if the response was successful (status code in the range 200-299).
        if (!response.ok) {
          // If not ok, throw an error with the HTTP status.
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the response body as JSON.
        const json = await response.json();
        // Update the data state with the fetched JSON.
        setData(json);
      } catch (err) {
        // If any error occurs during fetch or parsing, update the error state.
        setError(err);
      } finally {
        // Regardless of success or failure, set loading to false once the operation is complete.
        setLoading(false);
      }
    }

    // Call the getData function to initiate fetching when the effect runs.
    getData();
  }, [url]); // The effect depends on the 'url'. If 'url' changes, the effect will re-run.

  // Return the current state (data, loading, error).
  return { data, loading, error };
}
