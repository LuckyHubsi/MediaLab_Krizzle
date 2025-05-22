import { z } from "zod";
import * as common from "../common/types";
import { tagSchema } from "./Tag";
import { PageType } from "@/shared/enum/PageType";
import { folderID, pageID } from "../common/IDs";

/**
 * General Page schemas and types.
 *
 * Provides validation and type definitions for general page-related operations,
 * including reading existing general pages and creating new ones.
 */

/**
 * Schema for a complete General Page object.
 */
export const generalPageSchema = z.object({
  pageID: pageID,
  pageType: z.nativeEnum(PageType),
  pageTitle: common.string30,
  pageIcon: common.optionalNullableString,
  pageColor: common.hexColor.optional().nullable(),
  archived: common.boolean,
  pinned: common.boolean,
  tag: tagSchema.optional().nullable(), // either a Tag entity or null
  createdAt: common.date,
  updatedAt: common.date,
  parentID: folderID.nullable().default(null),
});

/**
 * TypeScript type inferred from `generalPageSchema`.
 * Represents a fully defined GeneralPage entity.
 */
export type GeneralPage = z.infer<typeof generalPageSchema>;

/**
 * Schema for creating a new general Page.
 * `pageID`is omitted, and defaults are set.
 */
export const createNewGeneralPage = z
  .object({
    pageType: z.nativeEnum(PageType),
    pageTitle: common.string30,
    pageIcon: common.optionalNullableString,
    pageColor: common.hexColor.optional().nullable(),
    archived: common.boolean.default(false),
    pinned: common.boolean.default(false),
    tag: tagSchema.optional().nullable(), // either a Tag entity or null
    parentID: folderID.nullable().default(null),
  })
  .transform((data) => {
    const now = new Date();
    return {
      ...data,
      createdAt: now,
      updatedAt: now,
    } satisfies Omit<GeneralPage, "pageID">;
  });

/**
 * TypeScript type inferred from `createNewGeneralPage`.
 * Represents the shape of data required to create a general Page.
 */
export type NewGeneralPage = z.infer<typeof createNewGeneralPage>;
