const insertNoteQuery: string = `
    INSERT INTO note (note_content, pageID) VALUES (?, ?)
`;

export {
    insertNoteQuery
}