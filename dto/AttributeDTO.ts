import { AttributeType } from "@/utils/Enums";

/**
 * Represents an Attribute data structure
 */
export interface AttributeDTO {
    attributeID?: number;
    itemTemplateID: number;
    attributeLabel: string;
    attributeType: AttributeType; // One of: "Text", "Rating", "Date", "Multiselect"
    preview: boolean;
    options?: string | null; // For storing options for Multiselect type or other settings
}

/**
 * Type guard to validate attribute type
 */
export function isValidAttributeType(type: AttributeType): boolean {
    return ["Text", "Rating", "Date", "Multiselect"].includes(type);
}