const selectAllGeneralPageQuery: string = `
    SELECT p.*, t.tag_label
    FROM general_page_data p
    LEFT JOIN tag t ON p.tagID = t.tagID
    WHERE p.archived = 0
    ORDER BY p.date_modified DESC;
`;

const insertNewPageQuery: string = `
    INSERT INTO general_page_data (page_type, page_title, page_icon, page_color, date_created, date_modified, archived, pinned) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

const selectNoteByPageIDQuery: string = `
    SELECT p.*, n.note_content
    FROM general_page_data p
    INNER JOIN note n ON p.pageID = n.pageID
    WHERE p.pageID = ?;
`;

const updateDateModifiedByPageIDQuery: string = `
    UPDATE general_page_data SET date_modified = ? WHERE pageID = ?
`;

const updatePinnedByPageIDQuery: string = `
    UPDATE general_page_data SET pinned = ? WHERE pageID = ?
`;

const deleteGeneralPageByIDQuery: string = `
    DELETE FROM general_page_data WHERE pageID = ?
`;

export {
  selectAllGeneralPageQuery,
  insertNewPageQuery,
  selectNoteByPageIDQuery,
  updateDateModifiedByPageIDQuery,
  updatePinnedByPageIDQuery,
  deleteGeneralPageByIDQuery,
};
