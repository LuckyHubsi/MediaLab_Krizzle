import { z } from "zod";
import * as common from "../common/types";
import { collectionID } from "../common/IDs";

export const collectionCategoryID = common.positiveInt.brand<"CategoryID">();
export type CategoryID = z.infer<typeof collectionCategoryID>;

export const categorySchema = z.object({
  categoryID: collectionCategoryID,
  categoryName: common.string30,
  collectionID: collectionID,
});

export type CollectionCategory = z.infer<typeof categorySchema>;

export const createNewCategorySchema = z.object({
  categoryName: common.string30,
});

export type NewCollectionCategory = z.infer<typeof createNewCategorySchema>;
