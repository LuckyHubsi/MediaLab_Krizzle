import { insertNoteQuery } from "@/queries/NoteQuery";
import { insertGeneralPageAndReturnID } from "./GeneralPageService";
import { executeQuery, fetchFirst } from "@/utils/QueryHelper";
import { NoteDTO } from "@/dto/NoteDTO";

/**
 * Inserts a new note into the database.
 *
 * @param {NoteDTO} NoteDTO - The DTO representing the note to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted note's ID, or null if the insertion fails.
 */
const insertNote = async (noteDTO: NoteDTO): Promise<number | null> => {
    try {
        // first inserts the general page data and returns the pageID
        const pageID = await insertGeneralPageAndReturnID(noteDTO);

        await executeQuery(insertNoteQuery, [
            noteDTO.note_content,
            pageID
        ]);

        return pageID;

    } catch (error) {
        console.error("Error inserting note:", error);
        return null;
    }
};

export {
    insertNote
}