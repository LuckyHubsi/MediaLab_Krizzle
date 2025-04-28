export type ItemModel = {
  itemID: number;
  pageID: number;
  categoryID: number;
  attributes: {
    attributeID: number;
    attributeLabel: string;
    attributeType: string;
    value: any; // This can be null, string, number, or array depending on the attribute type
    options: { multiselectID: number; options: string }[] | null;
  }[];
};
