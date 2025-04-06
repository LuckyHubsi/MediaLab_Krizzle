import { ItemAttributeValueDTO } from './ItemAttributeValueDTO';

/**
 * Represents an Item data structure.
 */
export type ItemDTO = {
    itemID?: number;
    collectionID: number;
    pageID: number;
    category: string | null;
    attributeValues?: ItemAttributeValueDTO[];
}