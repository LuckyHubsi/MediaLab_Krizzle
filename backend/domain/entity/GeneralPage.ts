import { z } from "zod";
import * as common from "../common/types";
import { tagSchema } from "./Tag";
import { PageType } from "@/backend/util/enum/PageType";

export const pageID = common.positiveInt.brand<"PageId">();
export type PageID = z.infer<typeof pageID>;

export const generalPageSchema = z.object({
  pageID: pageID,
  pageType: z.nativeEnum(PageType),
  pageTitle: common.string30,
  pageIcon: common.optionalNullableString,
  pageColor: common.optionalNullableString,
  archived: common.boolean,
  pinned: common.boolean,
  tag: tagSchema.nullable().optional(),
  createdAt: common.date,
  updatedAt: common.date,
});

export type GeneralPage = z.infer<typeof generalPageSchema>;

export const createNewGeneralPage = z
  .object({
    pageType: z.nativeEnum(PageType),
    pageTitle: common.string30,
    pageIcon: common.optionalNullableString,
    pageColor: common.optionalNullableString,
    archived: common.boolean.default(false),
    pinned: common.boolean.default(false),
    tag: tagSchema.nullable().optional(),
  })
  .transform((data) => {
    const now = new Date(); // Create a single Date object
    return {
      ...data,
      createdAt: now,
      updatedAt: now,
    } satisfies Omit<GeneralPage, "pageID">;
  });

export type NewGeneralPage = z.infer<typeof createNewGeneralPage>;
