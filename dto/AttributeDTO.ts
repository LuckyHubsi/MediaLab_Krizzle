import { AttributeType } from "@/utils/enums/AttributeType";

/**
 * Represents an Attribute data structure
 */
export type AttributeDTO = {
  attributeID?: number;
  itemTemplateID?: number;
  attributeLabel: string;
  type: AttributeType; // One of: "text", "rating", "date", "multi-select"
  preview: boolean;
  options?: string[] | null; // For storing options for Multiselect type or other settings
  symbol?: string;
};

/**
 * Type guard to validate attribute type
 */
export function isValidAttributeType(type: AttributeType): boolean {
  return ["text", "rating", "date", "multi-select"].includes(type);
}
