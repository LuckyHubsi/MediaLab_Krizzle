import { AttributeDTO } from "./AttributeDTO";
import { PreviewItemDTO } from "./ItemDTO";

export type ItemsDTO = {
  collectionID: number;
  pageID: number;
  attributes: AttributeDTO[];
  items: PreviewItemDTO[];
};
