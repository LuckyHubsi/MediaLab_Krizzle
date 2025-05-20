import { z } from "zod";
import * as common from "../common/types";
import { collectionID } from "../common/IDs";

/**
 * CollectionCategory schemas and types.
 *
 * Provides validation and type definitions for category-related operations,
 * including reading existing categories and creating new ones.
 */

// collectionCategoryID here instead of in IDs.ts to avoid a circular dependency
export const collectionCategoryID = common.positiveInt.brand<"CategoryID">();
export type CategoryID = z.infer<typeof collectionCategoryID>;

/**
 * Schema for a complete CollectionCategoy object.
 */
export const categorySchema = z.object({
  categoryID: collectionCategoryID,
  categoryName: common.string30,
  collectionID: collectionID,
});

/**
 * TypeScript type inferred from `categorySchema`.
 * Represents a fully defined CollectionCategory entity.
 */
export type CollectionCategory = z.infer<typeof categorySchema>;

/**
 * Schema for creating a new CollectionCategory.
 */
export const createNewCategorySchema = z.object({
  categoryName: common.string30,
});

/**
 * TypeScript type inferred from `createNewCategorySchema`.
 * Represents the shape of data required to create a new CollectionCategory.
 */
export type NewCollectionCategory = z.infer<typeof createNewCategorySchema>;
