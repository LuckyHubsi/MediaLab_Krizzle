import { ItemAttributeValueDTO } from "./ItemAttributeValueDTO";

export type ItemDTO = {
  itemID?: number;
  pageID: number;
  page_title?: string;
  categoryID: number | null;
  categoryName?: string;
  attributeValues?: ItemAttributeValueDTO[];
};

export type PreviewItemDTO = {
  item_title: string;
  itemID: number;
  values: (string | number | null)[];
  categoryID: number | null;
  categoryName?: string;
};
