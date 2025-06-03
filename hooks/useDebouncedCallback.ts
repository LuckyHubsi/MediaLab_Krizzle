import { useRef, useEffect } from "react";

/**
 * useDebouncedCallback
 *
 * Custom React hook that creates a debounced version of a given callback function.
 * Debouncing ensures that the callback is not called too frequently.
 *
 * @param {(...args: any[]) => void} callback - Original function to debounce.
 * @param {number} delay - Number of milliseconds to delay the execution of the callback after the last call.
 *
 */
export const useDebouncedCallback = (
  callback: (...args: any[]) => void,
  delay: number,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * debouncedFunction
   *
   * Calls the provided `callback` function after the specified `delay`.
   * If called repeatedly, the timer resets, ensuring the `callback` is only executed
   * once no new calls have been made within the delay window.
   *
   * @param {...any[]} args - Arguments to pass to the original callback when invoked.
   */
  const debouncedFunction = (...args: any[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  /**
   * cancel
   *
   * Cancels any pending execution of the debounced `callback`.
   * Useful if the effect is no longer needed or if you want to prevent execution entirely.
   */
  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  /**
   * flush
   *
   * Immediately invokes the debounced `callback` if a timeout is active,
   * and clears the pending timer.
   *
   * @param {...any[]} args - Arguments to pass to the callback when invoked.
   */
  const flush = (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      callback(...args);
    }
  };

  useEffect(() => {
    return () => cancel(); // automatically cancel pending execution when the component unmounts.
  }, []);

  return { debouncedFunction, cancel, flush };
};
