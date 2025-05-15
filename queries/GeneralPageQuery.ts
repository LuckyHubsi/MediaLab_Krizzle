const selectAllGeneralPageQuery: string = `
    SELECT p.*, t.tag_label
    FROM general_page_data p
    LEFT JOIN tag t ON p.tagID = t.tagID
    WHERE p.archived = 0 AND p.pinned = 0
    ORDER BY p.date_modified DESC;
`;

const selectAllGeneralPageSortAlphabetQuery: string = `
    SELECT p.*, t.tag_label
    FROM general_page_data p
    LEFT JOIN tag t ON p.tagID = t.tagID
    WHERE p.archived = 0 AND p.pinned = 0
    ORDER BY p.page_title ASC;
`;

const selectAllArchivedPageQuery: string = `
    SELECT p.*, t.tag_label
    FROM general_page_data p
    LEFT JOIN tag t ON p.tagID = t.tagID
    WHERE p.archived = 1
    ORDER BY p.date_modified DESC;
`;

const selectAllPinnedPageQuery: string = `
    SELECT p.*, t.tag_label
    FROM general_page_data p
    LEFT JOIN tag t ON p.tagID = t.tagID
    WHERE p.pinned = 1 AND p.archived = 0
    ORDER BY p.date_modified DESC;
`;

const selectGeneralPageByIdQuery: string = `
    SELECT p.*, t.tag_label
    FROM general_page_data p
    LEFT JOIN tag t ON p.tagID = t.tagID
    WHERE p.pageID = ?
`;

const insertNewPageQuery: string = `
    INSERT INTO general_page_data (page_type, page_title, page_icon, page_color, date_created, date_modified, archived, pinned, tagID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const selectNoteByPageIDQuery: string = `
    SELECT p.*, 
    (
        SELECT COUNT(*)
        FROM general_page_data p
        WHERE p.pinned = 1
    ) AS pin_count,
    n.note_content
    FROM general_page_data p
    INNER JOIN note n ON p.pageID = n.pageID
    WHERE p.pageID = ?;
`;

const updateDateModifiedByPageIDQuery: string = `
    UPDATE general_page_data SET date_modified = ? WHERE pageID = ?
`;

const updatePageByIDQuery: string = `
    UPDATE general_page_data SET page_title = ?, page_icon = ?, page_color = ?, tagID = ? 
    WHERE pageID = ?
`;

const updatePinnedByPageIDQuery: string = `
    UPDATE general_page_data SET pinned = ? WHERE pageID = ?
`;

const updateArchivedByPageIDQuery: string = `
    UPDATE general_page_data SET archived = ? WHERE pageID = ?
`;

const deleteGeneralPageByIDQuery: string = `
    DELETE FROM general_page_data WHERE pageID = ?
`;

export {
  selectAllGeneralPageQuery,
  selectGeneralPageByIdQuery,
  insertNewPageQuery,
  selectNoteByPageIDQuery,
  updateDateModifiedByPageIDQuery,
  updatePageByIDQuery,
  updatePinnedByPageIDQuery,
  updateArchivedByPageIDQuery,
  deleteGeneralPageByIDQuery,
  selectAllArchivedPageQuery,
  selectAllPinnedPageQuery,
  selectAllGeneralPageSortAlphabetQuery,
};
