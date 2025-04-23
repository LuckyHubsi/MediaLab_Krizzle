import { CollectionCategoryDTO } from "./CollectionCategoryDTO";
import { GeneralPageDTO } from "./GeneralPageDTO";
import { ItemTemplateDTO } from "./ItemTemplateDTO";

/**
 * Represents a Collection data structure
 */
export type CollectionDTO = GeneralPageDTO & {
  collectionID?: number;
  categories: CollectionCategoryDTO[];
  template: ItemTemplateDTO;
};
