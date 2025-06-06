import { z } from "zod";
import * as common from "@/backend/domain/common/types";

// ALL DOMAIN ENTITY IDs
export const tagID = common.positiveInt.brand<"TagID">();
export type TagID = z.infer<typeof tagID>;

export const pageID = common.positiveInt.brand<"PageId">();
export type PageID = z.infer<typeof pageID>;

export const noteID = common.positiveInt.brand<"NoteId">();
export type NoteID = z.infer<typeof noteID>;

export const itemTemplateID = common.positiveInt.brand<"ItemTemplateId">();
export type ItemTemplateID = z.infer<typeof itemTemplateID>;

export const attributeID = common.positiveInt.brand<"AttributeId">();
export type AttributeID = z.infer<typeof attributeID>;

export const collectionID = common.positiveInt.brand<"CollectionID">();
export type CollectionID = z.infer<typeof collectionID>;

// collectionCategoryID is inside '@/backend/domain/entity/CollectionCategory.ts to avoid a circular dependency

export const itemID = common.positiveInt.brand<"ItemID">();
export type ItemID = z.infer<typeof itemID>;

export const folderID = common.positiveInt.brand<"FolderID">();
export type FolderID = z.infer<typeof folderID>;
