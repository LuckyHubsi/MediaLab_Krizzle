import { CollectionCategoryDTO } from "./CollectionCategoryDTO";
import { GeneralPageDTO } from "./GeneralPageDTO";

/**
 * Represents a Collection data structure
 */
export type CollectionDTO = GeneralPageDTO & {
  collectionID?: number;
  templateID?: number;
  categories: CollectionCategoryDTO[];
};
