const insertNoteQuery: string = `
    INSERT INTO note (note_content, pageID) VALUES (?, ?)
`;

const updateNoteContentQuery: string = `
    UPDATE note SET note_content = ? WHERE pageID = ?
`;

const selectNoteByPageIDQuery: string = `
    SELECT p.*, n.*
    FROM general_page_data p
    INNER JOIN note n ON p.pageID = n.pageID
    WHERE p.pageID = ?;
`;

export { insertNoteQuery, updateNoteContentQuery, selectNoteByPageIDQuery };
