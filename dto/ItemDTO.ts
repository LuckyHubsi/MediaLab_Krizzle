import { ItemAttributeValueDTO } from "./ItemAttributeValueDTO";

export type ItemDTO = {
  itemID?: number;
  pageID: number;
  page_title?: string;
  categoryID: number;
  attributeValues?: ItemAttributeValueDTO[];
};
