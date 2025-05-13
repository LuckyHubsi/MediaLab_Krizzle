import { z } from "zod";
import * as common from "../common/types";
import { tagID } from "../common/IDs";

/**
 * Tag schemas and types.
 *
 * Provides validation and type definitions for tag-related operations,
 * including reading existing tags and creating new ones.
 */

/**
 * Schema for a complete Tag object.
 */
export const tagSchema = z.object({
  tagID: tagID,
  tagLabel: common.string30,
  usageCount: z.number(),
});

/**
 * TypeScript type inferred from `tagSchema`.
 * Represents a fully defined Tag entity.
 */
export type Tag = z.infer<typeof tagSchema>;

/**
 * Schema for creating a new tag.
 * `tagID` and `usageCount` are omitted, as they are assigned by the system.
 */
export const createNewTagSchema = z.object({
  tagLabel: common.string30,
});

/**
 * TypeScript type inferred from `createNewTagSchema`.
 * Represents the shape of data required to create a new tag.
 */
export type NewTag = z.infer<typeof createNewTagSchema>;
