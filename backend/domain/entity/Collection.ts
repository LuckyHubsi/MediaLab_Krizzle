import { z } from "zod";
import {
  categorySchema,
  createNewCategorySchema,
  NewCollectionCategory,
} from "./CollectionCategory";
import { generalPageSchema } from "./GeneralPage";
import { collectionID, itemTemplateID } from "../common/IDs";

/**
 * Collection schemas and types.
 *
 * Provides validation and type definitions for collection-related operations,
 * including reading existing collection and creating a new one.
 */

/**
 * Schema for a complete Collection object.
 */
export const collectionSchema = generalPageSchema.extend({
  collectionID: collectionID,
  templateID: itemTemplateID,
  categories: z.array(categorySchema).min(1).max(10),
  pinCount: z.number().min(0).max(4),
});

/**
 * TypeScript type inferred from `collectionSchema`.
 * Represents a fully defined Collection entity.
 */
export type Collection = z.infer<typeof collectionSchema>;

/**
 * Schema for creating a new Collection.
 * `pageID`/`noteID`/`pinCount`/`templateID` are omitted, and defaults are set.
 * categories are an array of NewCollectionCatgeories.
 */
export const createNewCollectionSchema = generalPageSchema
  .omit({ pageID: true, createdAt: true, updatedAt: true })
  .extend({
    categories: z.array(createNewCategorySchema).min(1).max(10),
  })
  .transform((data) => {
    const now = new Date();
    return {
      ...data,
      createdAt: now,
      updatedAt: now,
    } satisfies Omit<
      Collection,
      "pageID" | "collectionID" | "pinCount" | "categories" | "templateID"
    > & {
      categories: NewCollectionCategory[];
    };
  });

/**
 * TypeScript type inferred from `createNewCollectionSchema`.
 * Represents the shape of data required to create a Collection.
 */
export type NewCollection = z.infer<typeof createNewCollectionSchema>;
