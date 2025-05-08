import { z } from "zod";
import * as common from "@/backend/domain/common/types";
import { AttributeType } from "@/shared/enum/AttributeType";

export const attributeID = common.positiveInt.brand<"AttributeId">();
export type AttributeID = z.infer<typeof attributeID>;

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

export type Attribute = z.infer<typeof attributeSchema>;

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

export type NewAttribute = z.infer<typeof createNewAttributeSchema>;
