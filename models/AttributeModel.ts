import { AttributeType } from '@/utils/enums/AttributeType';

/**
 * Represents an Attribute Entity Model used for database interactions.
 */
export type AttributeModel = {
    attributeID: number;
    itemTemplateID: number;
    attributeLabel: string;
    attributeType: AttributeType; // One of: "Text", "Rating", "Date", "Multiselect"
    preview: number; // Using number for boolean (0/1) to match SQLite storage
    options: string | null; // For storing options for Multiselect?
}