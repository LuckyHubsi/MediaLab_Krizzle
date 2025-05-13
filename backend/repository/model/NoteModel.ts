import { GeneralPageModel } from "./GeneralPageModel";

/**
 * Represents the internal model of a textual note.
 */
export type NoteModel = GeneralPageModel & {
  noteID: number; // unique identifier for the note
  note_content: string | null; // note content - null on initial save
  pin_count: number; // number of pages that are currently pinned - used for constraining
};
