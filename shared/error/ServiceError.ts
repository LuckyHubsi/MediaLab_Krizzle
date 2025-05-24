// service error type (not an extension of Error) - used for failure in service methods
export type ServiceErrorType =
  | { type: "Validation Error"; message: string }
  | { type: "No Connection"; message: string }
  | { type: "Retrieval Failed"; message: string }
  | { type: "Not Found"; message: string }
  | { type: "Creation Failed"; message: string }
  | { type: "Update Failed"; message: string }
  | { type: "Delete Failed"; message: string }
  | { type: "Data Error"; message: string }
  | { type: "Unknown Error"; message: string };
