import { useRef, useEffect } from "react";

export const useDebouncedCallback = (
  callback: (...args: any[]) => void,
  delay: number,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = (...args: any[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const flush = (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      callback(...args);
    }
  };

  useEffect(() => {
    return () => cancel();
  }, []);

  return { debouncedFunction, cancel, flush };
};
