import { ItemAttributeValueDTO } from "./ItemAttributeValueDTO";

/**
 * Data Transfer Object for single item data.
 * Used for transferring tag data between the backend and frontend.
 */
export type ItemDTO = {
  itemID?: number; // optional unique identifier for the page (e.g., undefined when creating a new page)
  pageID: number; // the id of the page the item belongs to
  page_title?: string; // the title of the page the item belongs to
  categoryID: number | null; // the category the item was assigned to
  categoryName?: string; // the name of the category the item was assigned to
  attributeValues?: ItemAttributeValueDTO[]; // an array of ItemAttributeValueDTOs
};

/**
 * Data Transfer Object for preview item data.
 * Used for transferring data between the backend and frontend.
 */
export type PreviewItemDTO = {
  itemID: number;
  values: (string | number | null | string[])[];
  categoryID: number | null;
  categoryName?: string;
};
