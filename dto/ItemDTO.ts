import { ItemAttributeValueDTO } from "./ItemAttributeValueDTO";

export type ItemDTO = {
  itemID?: number;
  pageID: number;
  categoryID: number;
  attributeValues?: ItemAttributeValueDTO[];
};
