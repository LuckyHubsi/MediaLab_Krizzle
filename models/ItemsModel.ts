import { AttributeType } from "@/utils/enums/AttributeType";

export type ItemsModel = {
  collectionID: number;
  pageID: number;
  attributeID: number;
  attribute_label: string;
  type: AttributeType;
  preview: number;
  rating_symbol: string | null;
  multiselect_options: string | null;
  itemID: number;
  value: string | number | null;
};
