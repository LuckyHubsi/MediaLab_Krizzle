import { GeneralPageModel } from "./GeneralPageModel";

/**
 * Represents the internal model of a general page in the application.
 */
export type CollectionModel = GeneralPageModel & {
  collectionID: number;
  templateID: number;
  categories: string;
};
