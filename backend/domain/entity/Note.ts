import { z } from "zod";
import { generalPageSchema } from "./GeneralPage";
import * as common from "../common/types";

export const noteID = common.positiveInt.brand<"NoteId">();
export type NoteID = z.infer<typeof noteID>;

export const noteSchema = generalPageSchema.extend({
  noteID: noteID,
  noteContent: common.string20000,
  pinCount: z.number().min(0).max(4),
});

export type Note = z.infer<typeof noteSchema>;

export const createNewNote = generalPageSchema
  .omit({ pageID: true, createdAt: true, updatedAt: true })
  .extend({
    noteContent: common.string20000,
  })
  .transform((data) => {
    const now = new Date();
    return {
      ...data,
      createdAt: now,
      updatedAt: now,
    } satisfies Omit<Note, "pageID" | "noteID" | "pinCount">;
  });

export type NewNote = z.infer<typeof createNewNote>;
