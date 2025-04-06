/**
 * Represents an ItemAttributeValue Entity Model used for database interactions.
 */
export type ItemAttributeValueModel = {
    valueID: number;
    itemID: number;
    attributeID: number;
    value: string;
}