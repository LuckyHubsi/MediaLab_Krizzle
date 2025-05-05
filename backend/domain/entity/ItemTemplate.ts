import { z } from "zod";
import * as common from "@/backend/domain/common/types";
import { attributeSchema, createNewAttributeSchema } from "../common/Attribute";
import { AttributeType } from "@/backend/util/enum/AttributeType";

export const itemTemplateID = common.positiveInt.brand<"ItemTemplateId">();
export type ItemTemplateID = z.infer<typeof itemTemplateID>;

export const itemTemplateSchema = z.object({
  itemTemplateID: itemTemplateID,
  templateName: common.string30,
  attributes: z.array(attributeSchema).min(1).max(11),
});

export type ItemTemplate = z.infer<typeof itemTemplateSchema>;

export const createNewItemTemplateSchema = z.object({
  itemTemplateID: itemTemplateID,
  templateName: common.string30,
  attributes: z.array(createNewAttributeSchema).min(1).max(11),
});

export type NewItemTemplate = z.infer<typeof createNewItemTemplateSchema>;
