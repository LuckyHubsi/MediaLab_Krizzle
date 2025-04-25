import { AttributeType } from "@/utils/enums/AttributeType";

export type AttributeModel = {
  attributeID: number;
  itemTemplateID: number;
  attribute_label: string;
  type: AttributeType;
  preview: 1 | 0;
  options?: string[] | null;
};
