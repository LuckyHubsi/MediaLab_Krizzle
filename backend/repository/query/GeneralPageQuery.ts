const selectAllPagesByLastModifiedQuery: string = `
    SELECT p.*, t.tag_label
    FROM general_page_data p
    LEFT JOIN tag t ON p.tagID = t.tagID
    WHERE p.archived = 0 AND p.pinned = 0
    ORDER BY p.date_modified DESC;
`;

const selectAllPagesByAlphabetQuery: string = `
    SELECT p.*, t.tag_label
    FROM general_page_data p
    LEFT JOIN tag t ON p.tagID = t.tagID
    WHERE p.archived = 0 AND p.pinned = 0
    ORDER BY p.page_title ASC;
`;

const selectAllArchivedPagesQuery: string = `
    SELECT p.*, t.tag_label
    FROM general_page_data p
    LEFT JOIN tag t ON p.tagID = t.tagID
    WHERE p.archived = 1
    ORDER BY p.date_modified DESC;
`;

const selectAllPinnedPagesQuery: string = `
    SELECT p.*, t.tag_label
    FROM general_page_data p
    LEFT JOIN tag t ON p.tagID = t.tagID
    WHERE p.pinned = 1
    ORDER BY p.date_modified DESC;
`;

const selectGeneralPageByIdQuery: string = `
    SELECT p.*, t.tag_label
    FROM general_page_data p
    LEFT JOIN tag t ON p.tagID = t.tagID
    WHERE p.pageID = ?
`;

const insertNewPageQuery: string = `
    INSERT INTO general_page_data (page_type, page_title, page_icon, page_color, date_created, date_modified, archived, pinned) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

const updateDateModifiedByPageIDQuery: string = `
    UPDATE general_page_data SET date_modified = ? WHERE pageID = ?
`;

const updatePageByIDQuery: string = `
    UPDATE general_page_data SET page_title = ?, page_icon = ?, page_color = ?, tagID = ? , date_modified = ?
    WHERE pageID = ?
`;

const deleteGeneralPageByIDQuery: string = `
    DELETE FROM general_page_data WHERE pageID = ?
`;

export {
  selectAllPagesByLastModifiedQuery,
  selectAllPagesByAlphabetQuery,
  selectAllPinnedPagesQuery,
  selectAllArchivedPagesQuery,
  insertNewPageQuery,
  updateDateModifiedByPageIDQuery,
  deleteGeneralPageByIDQuery,
  updatePageByIDQuery,
  selectGeneralPageByIdQuery,
};
