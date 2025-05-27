import { z } from "zod";
import * as common from "@/backend/domain/common/types";
import { AttributeType } from "@/shared/enum/AttributeType";
import { attributeSchema } from "../common/Attribute";
import { collectionCategoryID } from "./CollectionCategory";
import { itemID, pageID } from "../common/IDs";

/**
 * Item schemas and types.
 *
 * Provides validation and type definitions for item-related operations,
 * including reading existing items and creating new ones.
 */

/**
 * Schema for base attribute values. Each value has these props.
 */
const itemAttributeBase = attributeSchema.innerType().extend({
  itemID: itemID.optional(),
  valueID: common.positiveInt.optional(),
});

/**
 * Schema for text attribute values.
 */
const stringValue = itemAttributeBase.extend({
  type: z.literal(AttributeType.Text),
  valueString: common.string750.optional().nullable(),
});

/**
 * Schema for date attribute values.
 */
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

/**
 * Schema for rating attribute values.
 */
const ratingValue = itemAttributeBase.extend({
  type: z.literal(AttributeType.Rating),
  valueNumber: z.number().int().min(0).max(5).optional().nullable(),
});

/**
 * Schema for multiselect attribute values.
 */
const multiselectValue = itemAttributeBase.extend({
  type: z.literal(AttributeType.Multiselect),
  valueMultiselect: z
    .array(common.string30)
    .min(0)
    .max(20)
    .optional()
    .nullable(),
});

/**
 * Schema for image attribute values.
 */
const imageValue = itemAttributeBase.extend({
  type: z.literal(AttributeType.Image),
  valueString: common.string750.optional().nullable(),
});

/**
 * Schema for link attribute values.
 */
const linkValue = itemAttributeBase.extend({
  type: z.literal(AttributeType.Link),
  valueString: common.string750.optional().nullable(),
  displayText: common.string30.optional().nullable(),
});

/**
 * Schema for attribute values - can be of either type.
 */
export const itemAttributeValueSchema = z.discriminatedUnion("type", [
  stringValue,
  dateValue,
  ratingValue,
  multiselectValue,
  imageValue,
  linkValue,
]);

/**
 * TypeScript type inferred from `itemAttributeValueSchema`.
 * Represents a fully defined ItemAttributeValue entity.
 */
export type ItemAttributeValue = z.infer<typeof itemAttributeValueSchema>;

/**
 * Schema for a complete Item object.
 */
export const itemSchema = z.object({
  itemID: itemID,
  pageID: pageID,
  pageTitle: common.string30,
  categoryID: collectionCategoryID.optional().nullable(),
  categoryName: common.optionalNullableString,
  attributeValues: z.array(itemAttributeValueSchema).min(1).max(10),
});

/**
 * TypeScript type inferred from `itemSchema`.
 * Represents a fully defined Item entity.
 */
export type Item = z.infer<typeof itemSchema>;

/**
 * Schema for creating a new Item.
 * `itemID`/`pageTitle`/`categoryName` are omitted, as they are assigned by the system.
 */
export const createNewItemSchema = z.object({
  pageID: pageID,
  categoryID: collectionCategoryID.optional().nullable(),
  attributeValues: z.array(itemAttributeValueSchema).min(1).max(10),
});

/**
 * TypeScript type inferred from `createNewItemSchema`.
 * Represents the shape of data required to create a new item.
 */
export type NewItem = z.infer<typeof createNewItemSchema>;

/**
 * Schema for creating a PreviewItem.
 */
export const previewItemSchema = z.object({
  itemID: itemID,
  categoryID: collectionCategoryID.optional().nullable(),
  categoryName: common.optionalNullableString,
  values: z.array(
    z.union([
      common.string750,
      z.number().int().min(0).max(5),
      z.date(),
      z
        .object({
          value: common.string750,
          displayText: common.string30.optional().nullable(),
        })
        .nullable(),
      z.array(common.string30).min(0).max(20),
      z.null(),
    ]),
  ),
});

/**
 * TypeScript type inferred from `previewItemSchema`.
 * Represents fully defined PreviewItem entity.
 */
export type PreviewItem = z.infer<typeof previewItemSchema>;
