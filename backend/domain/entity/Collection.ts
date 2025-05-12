import { z } from "zod";
import * as common from "../common/types";
import { itemTemplateID } from "./ItemTemplate";
import {
  categorySchema,
  createNewCategorySchema,
  NewCollectionCategory,
} from "./CollectionCategory";
import { generalPageSchema } from "./GeneralPage";
import { collectionID } from "../common/IDs";

export const collectionSchema = generalPageSchema.extend({
  collectionID: collectionID,
  templateID: itemTemplateID,
  categories: z.array(categorySchema).min(1).max(10),
});

export type Collection = z.infer<typeof collectionSchema>;

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

export type NewCollection = z.infer<typeof createNewCollectionSchema>;
