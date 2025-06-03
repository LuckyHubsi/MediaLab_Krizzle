/**
 * Represents an ItemTemplate Entity Model used for database interactions.
 */
export type ItemTemplateModel = {
  item_templateID: number; // unique identifier for the template
  title: string; // the name of the template
  attributes: string; // JSON stringified array of attributes from DB
};
