/**
 * Represents the internal model of an attribute in the application.
 */
export type AttributeModel = {
  attributeID: number; // unique identifier for the attribute
  attribute_label: string; // the label of the attribute
  type: string; // one of: "text", "rating", "date", "multi-select"
  preview: 1 | 0; // indicating if the attribute is part of the preview (1) or not (0)
  options: string | null; // JSON stringified multiselect options
  symbol: string | null; // rating symbol
};
