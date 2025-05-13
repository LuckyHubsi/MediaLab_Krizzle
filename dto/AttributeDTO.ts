import { AttributeType } from "@/utils/enums/AttributeType";

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

/**
 * Data Transfer Object for attribute data.
 * Used for transferring attribute data between the backend and frontend.
 */
export type AttributeDTORestructure = {
  attributeID?: number; // optional unique identifier for the attribute (e.g., undefined when creating a new attribute)
  attributeLabel: string; // the label of the attribute
  type: AttributeType; // one of: "text", "rating", "date", "multi-select"
  preview: boolean; // boolean indicating if the attribute is part of the preview
  options?: string[] | null; // for storing options for Multiselect type
  symbol?: string; // when type rating
};
