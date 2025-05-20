import { z } from "zod";
import * as common from "@/backend/domain/common/types";
import { AttributeType } from "@/shared/enum/AttributeType";
import { attributeID } from "./IDs";

/**
 * Attribute schemas and types.
 *
 * Provides validation and type definitions for attribute-related operations,
 * including reading existing attributes and creating new ones.
 */

/**
 * Schema for a complete Attribute object.
 */
export const attributeSchema = z
  .object({
    attributeID: attributeID,
    attributeLabel: common.string30,
    type: z.nativeEnum(AttributeType),
    preview: common.boolean,
    options: z.array(common.string30).optional().nullable(),
    symbol: common.optionalString.nullable(),
  })
  .refine(
    (data) => {
      if (data.type === AttributeType.Multiselect) {
        return (
          data.options !== null &&
          data.options !== undefined &&
          data.options.length >= 1 &&
          data.options.length <= 20
        );
      }
      return true;
    },
    {
      message: "Multi-select attributes must have between 1 and 20 options.",
      path: ["options"],
    },
  );

/**
 * TypeScript type inferred from `attributeSchema`.
 * Represents a fully defined Attribute entity.
 */
export type Attribute = z.infer<typeof attributeSchema>;

/**
 * Schema for creating a new Attribute.
 * `attributeID` is omitted, as they are assigned by the system.
 */
export const createNewAttributeSchema = z
  .object({
    attributeLabel: common.string30,
    type: z.nativeEnum(AttributeType),
    preview: common.boolean.default(false),
    options: z.array(common.string30).optional().nullable(),
    symbol: common.optionalString.nullable(),
  })
  .refine(
    (data) => {
      if (data.type === AttributeType.Multiselect) {
        return (
          data.options !== null &&
          data.options !== undefined &&
          data.options.length >= 1 &&
          data.options.length <= 20
        );
      }
      return true;
    },
    {
      message: "Multi-select attributes must have between 1 and 20 options.",
      path: ["options"],
    },
  );

/**
 * TypeScript type inferred from `createNewAttributeSchema`.
 * Represents the shape of data required to create a new attribute.
 */
export type NewAttribute = z.infer<typeof createNewAttributeSchema>;
