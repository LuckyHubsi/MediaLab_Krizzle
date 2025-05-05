import { AttributeType } from "@/utils/enums/AttributeType";

/**
 * Represents an ItemTemplate Entity Model used for database interactions.
 */
export type ItemTemplateModel = {
  item_templateID: number;
  title: string;
  attributes: string;
};
