import { z } from "zod";
import { folderID } from "../common/IDs";
import * as common from "@/backend/domain/common/types";

/*
 * Folder schemas and types.
 *
 * Provides validation and type definitions for folder-related operations,
 * including reading existing folder and creating new ones.
 */

/**
 * Schema for a complete Folder object.
 */
export const folderSchema = z.object({
  folderID: folderID,
  folderName: common.string30,
  itemCount: z.number().min(0).optional().default(0),
});

/**
 * TypeScript type inferred from `folderSchema`.
 * Represents a fully defined Folder entity.
 */
export type Folder = z.infer<typeof folderSchema>;

/**
 * Schema for creating a new folder.
 * `folderID` and `itemCount` are omitted, as they are assigned by the system.
 */
export const createNewFolderSchema = z.object({
  folderName: common.string30,
});

/**
 * TypeScript type inferred from `createNewFolderSchema`.
 * Represents the shape of data required to create a new folder.
 */
export type NewFolder = z.infer<typeof createNewFolderSchema>;
