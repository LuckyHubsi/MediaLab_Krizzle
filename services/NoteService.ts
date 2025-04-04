import { insertNoteQuery } from "@/queries/NoteQuery";
import { insertGeneralPageAndReturnID } from "./GeneralPageService";
import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { executeQuery } from "@/utils/QueryHelper";

/**
 * Inserts a new note into the database and returns its ID.
 *
 * @param {NoteDTO} NoteDTO - The DTO representing the note to insert.
 * @returns {Promise<any>} A promise that resolves to void.
 */
const insertNote = async (generalPageDTO: GeneralPageDTO): Promise<any> => {
    try {
        // first inserts the general page data and returns the pageID
        const pageID = await insertGeneralPageAndReturnID(generalPageDTO);

        await executeQuery(insertNoteQuery, [
            null,
            pageID
        ]);

    } catch (error) {
        console.error("Error inserting note:", error);
    }
};

export {
    insertNote
}