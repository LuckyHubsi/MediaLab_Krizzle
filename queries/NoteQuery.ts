const insertNoteQuery: string = `
    INSERT INTO note (note_content, pageID) VALUES (?, ?)
`;

const updateNoteContentQuery: string = `
    UPDATE note SET note_content = ? WHERE noteID = ?
`;

export {
    insertNoteQuery,
    updateNoteContentQuery
}