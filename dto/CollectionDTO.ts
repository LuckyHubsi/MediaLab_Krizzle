import { GeneralPageDTO } from "./GeneralPageDTO";
import { ItemTemplateDTO } from "./ItemTemplateDTO";

/**
 * Represents a Collection data structure
 */
export type CollectionDTO = GeneralPageDTO & {
    collectionID?: number;
    template: ItemTemplateDTO;
}