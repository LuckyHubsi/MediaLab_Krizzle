import { GeneralPageModel } from "./GeneralPageModel";

/**
 * Represents the internal model of a textual note.
 * This model supports both notes and collections, with optional metadata (like note_content).
 */
export type NoteModel = GeneralPageModel & { 
    noteID: number,                     // unique identifier for the note
    note_content: string | null,        // textual content of the note (can be null if empty or not yet set)
}