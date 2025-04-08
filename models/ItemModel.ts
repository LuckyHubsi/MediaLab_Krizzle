import { ItemAttributeValueDTO } from "@/dto/ItemAttributeValueDTO";

/**
 * Represents an Item Entity Model used for database interactions.
 */
export type ItemModel = {
    itemID: number;
    collectionID: number;
    category: string | null;
    values: ItemAttributeValueDTO[]
}