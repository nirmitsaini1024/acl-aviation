import { useState, useEffect } from 'react';

/**
 * Custom hook that returns whether a media query matches the current viewport
 * @param {string} query - The media query to check against (e.g., "(min-width: 768px)")
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
  // Initialize with a default value (checking if window is available for SSR support)
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (for SSR/SSG)
    if (typeof window !== 'undefined') {
      // Create a media query list
      const mediaQueryList = window.matchMedia(query);
      
      // Set the initial value
      setMatches(mediaQueryList.matches);

      // Define a callback function to handle changes
      const handleChange = (event) => {
        setMatches(event.matches);
      };

      // Add the event listener
      // Use the modern API if available, otherwise fall back to the deprecated one
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', handleChange);
      } else {
        // For older browsers
        mediaQueryList.addListener(handleChange);
      }

      // Clean up the event listener when the component unmounts
      return () => {
        if (mediaQueryList.removeEventListener) {
          mediaQueryList.removeEventListener('change', handleChange);
        } else {
          // For older browsers
          mediaQueryList.removeListener(handleChange);
        }
      };
    }
    
    // Empty array for SSR safety
    return () => {};
  }, [query]); // Only re-run if the query changes

  return matches;
}

// Usage example:
// const isDesktop = useMediaQuery('(min-width: 768px)');
// if (isDesktop) {
//   // Render desktop component
// } else {
//   // Render mobile component
// }