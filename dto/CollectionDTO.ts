import { ItemTemplateDTO } from "./ItemTemplateDTO";

/**
 * Represents a Collection data structure
 */
export interface CollectionDTO {
    collectionID?: number;
    pageID: number;
    itemTemplateID: number;
    itemTemplate?: ItemTemplateDTO;
}