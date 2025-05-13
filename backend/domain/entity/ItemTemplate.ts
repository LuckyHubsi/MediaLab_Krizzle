import { z } from "zod";
import * as common from "@/backend/domain/common/types";
import { attributeSchema, createNewAttributeSchema } from "../common/Attribute";
import { itemTemplateID } from "../common/IDs";

/**
 * Template schemas and types.
 *
 * Provides validation and type definitions for template-related operations,
 * including reading existing template and creating a new one.
 */

/**
 * Schema for a complete Template object.
 */
export const itemTemplateSchema = z.object({
  itemTemplateID: itemTemplateID,
  templateName: common.string30,
  attributes: z.array(attributeSchema).min(1).max(10),
});

/**
 * TypeScript type inferred from `itemTemplateSchema`.
 * Represents a fully defined ItemTemplate entity.
 */
export type ItemTemplate = z.infer<typeof itemTemplateSchema>;

/**
 * Schema for creating a new Template.
 * `itemTemplateID` is omitted, as they are assigned by the system.
 */
export const createNewItemTemplateSchema = z.object({
  templateName: common.string30,
  attributes: z.array(createNewAttributeSchema).min(1).max(10),
});

/**
 * TypeScript type inferred from `createNewItemTemplateSchema`.
 * Represents the shape of data required to create a new template.
 */
export type NewItemTemplate = z.infer<typeof createNewItemTemplateSchema>;
