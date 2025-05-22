import { CollectionCategoryDTO } from "./CollectionCategoryDTO";
import { GeneralPageDTO } from "./GeneralPageDTO";

/**
 * Represents a Collection data structure
 */
export type CollectionDTO = GeneralPageDTO & {
  collectionID?: number; // optional unique identifier of the collection ID
  templateID?: number; // optional unique identifier of the template ID
  categories: CollectionCategoryDTO[]; // array of collection categories
  pin_count: number; // number of pages that are currently pinned - used for constraining
};
