import { GeneralPageModel } from "./GeneralPageModel";

/**
 * Represents the internal model of a textual note.
 */
export type NoteModel = GeneralPageModel & {
  noteID: number;
  note_content: string | null;
  pin_count: number;
};
