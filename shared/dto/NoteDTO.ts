import { GeneralPageDTO } from "./GeneralPageDTO";

/**
 * Data Transfer Object for note data.
 * Used for transferring note data between the backend and frontend.
 */
export type NoteDTO = GeneralPageDTO & {
  noteID?: number; // optional unique identifier for the note (e.g., undefined when creating a new note)
  note_content: string | null; // textual note content - null on initial save
  pin_count: number; // number of pages that are currently pinned - used for constraining
};
