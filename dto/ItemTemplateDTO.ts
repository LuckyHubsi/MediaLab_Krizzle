import { AttributeDTO } from './AttributeDTO';

/**
 * Represents an ItemTemplate data structure
 */
export type ItemTemplateDTO = {
    itemTemplateID?: number;
    title: string;
    categories: string | null;
    attributes?: AttributeDTO[]; // Array of associated attributes
}