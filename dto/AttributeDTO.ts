import { AttributeType } from "@/utils/enums/AttributeType";

/**
 * Represents an Attribute data structure
 */
export type AttributeDTO = {
  attributeID?: number;
  itemTemplateID?: number;
  attributeLabel: string;
  type: AttributeType; // One of: "Text", "Rating", "Date", "Multiselect"
  preview: boolean;
  options?: string[] | null; // For storing options for Multiselect type or other settings
};

/**
 * Type guard to validate attribute type
 */
export function isValidAttributeType(type: AttributeType): boolean {
  return ["text", "rating", "date", "multiselect"].includes(type);
}
