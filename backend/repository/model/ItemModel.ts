/**
 * Represents the model of a single item fetched from the DB.
 */
export type ItemModel = {
  itemID: number; // unique identifier for the page
  pageID: number; // the id of the page the item belongs to
  page_title: string; // the title of the page the item belongs to
  categoryID: number | null; // the category the item was assigned to
  category_name: string | null; // the name of the category the item was assigned to
  attribute_values: string; // JSON stringified attribute values of the item
};

/**
 * Represents the model of a single item value fetched from the DB - used for preview.
 */
export type ItemPreviewValueModel = {
  itemID: number;
  attributeID: number;
  value: string | number | null;
  display_text: string | null;
  alt_text: string | null;
  categoryID: number | null;
  category_name: string | null;
};
