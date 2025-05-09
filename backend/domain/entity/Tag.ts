import { z } from "zod";
import * as common from "../common/types";

export const tagID = common.positiveInt.brand<"TagID">();
export type TagID = z.infer<typeof tagID>;

export const tagSchema = z.object({
  tagID: tagID,
  tagLabel: common.string30,
  usageCount: z.number(),
});

export type Tag = z.infer<typeof tagSchema>;

export const createNewTagSchema = z.object({
  tagLabel: common.string30,
});

export type NewTag = z.infer<typeof createNewTagSchema>;
