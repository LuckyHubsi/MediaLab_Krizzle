const selectAllGeneralPageQuery: string = `
    SELECT * FROM general_page_data
`;

const insertNewPageQuery: string = `
    INSERT INTO general_page_data (page_type, page_title, page_icon, page_color, date_created, date_modified, archived, pinned) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

const selectNoteByPageIDQuery: string = `
   SELECT
        p.pageID AS pageID,
        p.page_type,
        p.page_title,
        p.page_icon,
        p.page_color,
        p.date_created,
        p.date_modified,
        p.archived,
        p.pinned,
        n.noteID,
        n.note_content
    FROM
        general_page_data p
    INNER JOIN
        note n ON p.pageID = n.pageID
    WHERE
        p.pageID = ?;
`;


export {
    selectAllGeneralPageQuery,
    insertNewPageQuery,
    selectNoteByPageIDQuery
}