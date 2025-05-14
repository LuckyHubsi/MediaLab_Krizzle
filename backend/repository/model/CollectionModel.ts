import { GeneralPageModel } from "./GeneralPageModel";

/**
 * Represents the internal model of a general page in the application.
 */
export type CollectionModel = GeneralPageModel & {
  collectionID: number; // unique identifier of the collection ID
  templateID: number; // unique identifier of the template ID
  categories: string; // JSON.stringified categories from query
  pin_count: number; // number of pages that are currently pinned - used for constraining
};
