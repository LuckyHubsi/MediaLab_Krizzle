import { AttributeDTO } from './AttributeDTO';

/**
 * Represents an ItemAttributeValue data structure
 */
export type ItemAttributeValueDTO = {
    valueID?: number;
    itemID: number;
    attributeID: number;
    value: string;
    attribute?: AttributeDTO; // The linked attribute (optional for joined queries)
}