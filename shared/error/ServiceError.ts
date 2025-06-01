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

export type EnrichedError = ServiceErrorType & {
  hasBeenRead: boolean;
  id: string;
  source?:
    | "widgets:general"
    | "widgets:pinned"
    | "widgets:archived"
    | "widget:delete"
    | "widget:update"
    | "widget:retrieval"
    | "widget:move"
    | "tags:retrieval"
    | "pinning"
    | "archiving"
    | "folder:update"
    | "folder:retrieval"
    | "folder:widgets:retrieval"
    | "folder:delete"
    | "template:retrieval"
    | "template:update"
    | "item:insert"
    | "item:delete"
    | "item:update"
    | "item:retrieval"
    | "items:retrieval"
    | "collection:retrieval"
    | "collection:insert"
    | "note:insert"
    | "list:insert"
    | "list:update"
    | "list:delete"
    | "attribute:delete"
    | "list:retrieval";
};
