import { z } from "zod";
import * as common from "@/backend/domain/common/types";
import { AttributeType } from "@/shared/enum/AttributeType";
import { attributeSchema } from "../common/Attribute";
import { pageID } from "./GeneralPage";
import { collectionCategoryID } from "./CollectionCategory";

export const itemID = common.positiveInt.brand<"ItemID">();
export type ItemID = z.infer<typeof itemID>;

const itemAttributeBase = attributeSchema.innerType().extend({
  itemID: itemID.optional(),
  valueID: common.positiveInt.optional(),
});

const stringValue = itemAttributeBase.extend({
  type: z.literal(AttributeType.Text),
  valueString: common.string750.optional().nullable(),
});

const dateValue = itemAttributeBase.extend({
  type: z.literal(AttributeType.Date),
  valueString: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Must be a valid date string",
    })
    .optional()
    .nullable(),
});

const ratingValue = itemAttributeBase.extend({
  type: z.literal(AttributeType.Rating),
  valueNumber: z.number().int().min(1).max(5).optional().nullable(),
});

const multiselectValue = itemAttributeBase.extend({
  type: z.literal(AttributeType.Multiselect),
  valueMultiselect: z
    .array(common.string30)
    .min(0)
    .max(20)
    .optional()
    .nullable(),
});

export const itemAttributeValueSchema = z.discriminatedUnion("type", [
  stringValue,
  dateValue,
  ratingValue,
  multiselectValue,
]);

export type ItemAttributeValue = z.infer<typeof itemAttributeValueSchema>;

export const itemSchema = z.object({
  itemID: itemID,
  pageID: pageID,
  pageTitle: common.string30,
  categoryID: collectionCategoryID.optional().nullable(),
  categoryName: common.optionalNullableString,
  attributeValues: z.array(itemAttributeValueSchema).min(1).max(11),
});

export type Item = z.infer<typeof itemSchema>;

export const createNewItemSchema = z.object({
  pageID: pageID,
  categoryID: collectionCategoryID.optional().nullable(),
  attributeValues: z.array(itemAttributeValueSchema),
});

export type NewItem = z.infer<typeof createNewItemSchema>;
