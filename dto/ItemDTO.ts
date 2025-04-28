import { ItemAttributeValueDTO } from "./ItemAttributeValueDTO";

export type ItemDTO = {
  itemID?: number;
  pageID: number;
  page_title?: string;
  categoryID: number;
  attributeValues?: ItemAttributeValueDTO[];
};

export type PreviewItemDTO = {
  itemID: number;
  values: (string | number | null)[];
};
