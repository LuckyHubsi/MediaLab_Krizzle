// Result type - used for differentiating between success and failure in service methods
export type Result<T, E> =
  | { success: true; value: T }
  | { success: false; error: E };

// succsess type - used to return the correct type on success in a service method
export const success = <T>(value: T): Result<T, never> => ({
  success: true,
  value,
});

// failure type - used to return an error type on failure in a service method
export const failure = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
});
