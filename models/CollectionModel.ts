import { GeneralPageModel } from "./GeneralPageModel";

/**
 * Represents the internal model of a general page in the application.
 */
export type CollectionModel = GeneralPageModel & {
  collectionID: number;
  item_templateID: number;
  template_name: string;
  categories: string;
  attributes: string;
};
