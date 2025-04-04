/**
 * Represents a Note Entity Model used for database interactions.
 */
export class NoteModel {
    noteID?: number;
    note_content: string | null;
    pageID: number;


    constructor(
        note_content: string | null,
        pageID: number,
        noteID?: number
    ) {
        this.noteID = noteID;
        this.note_content = note_content;
        this.pageID = pageID;
    }
}