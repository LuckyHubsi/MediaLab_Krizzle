import { GeneralPageDTO } from "./GeneralPageDTO";

/**
 * Data Transfer Object for note data.
 * Used for transferring tag data between the backend and frontend.
 */
export type NoteDTO = GeneralPageDTO & {
    note_content: string | null;
};