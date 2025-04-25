import { AttributeType } from "@/utils/enums/AttributeType";

/**
 * Represents an ItemTemplate Entity Model used for database interactions.
 */
export type ItemTemplateModel = {
  itemTemplateID?: number;
  title: string;
  attributes?: {
    attributeID: number;
    attribute_label: string;
    type: AttributeType;
    preview: 0 | 1;
    options?: string;
  }[];
};
