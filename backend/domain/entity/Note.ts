import { z } from "zod";
import { createNewGeneralPage, generalPageSchema } from "./GeneralPage";
import * as common from "../common/types";
import { noteID } from "../common/IDs";

/**
 * Note schemas and types.
 *
 * Provides validation and type definitions for note-related operations,
 * including reading existing notes and creating new ones.
 */

/**
 * Schema for a complete Note object.
 */
export const noteSchema = generalPageSchema.extend({
  noteID: noteID,
  noteContent: common.string50000,
  pinCount: z.number().min(0).max(4),
});

/**
 * TypeScript type inferred from `noteSchema`.
 * Represents a fully defined Note entity.
 */
export type Note = z.infer<typeof noteSchema>;

/**
 * Schema for creating a new Note.
 * `pageID`/`noteID`/`pinCount` are omitted, and defaults are set.
 */
export const createNewNote = createNewGeneralPage
  .innerType()
  .extend({
    noteContent: common.string50000,
  })
  .transform((data) => {
    const now = new Date();
    return {
      ...data,
      createdAt: now,
      updatedAt: now,
    } satisfies Omit<Note, "pageID" | "noteID" | "pinCount">;
  });

/**
 * TypeScript type inferred from `createNewNote`.
 * Represents the shape of data required to create a Note.
 */
export type NewNote = z.infer<typeof createNewNote>;
