const generalPageSelectAllQuery: string = `
    SELECT * FROM general_page_data
`;

const insertNewPageQuery: string = `
    INSERT INTO general_page_data (page_type, page_title, page_icon, page_color, date_created, date_modified, archived, pinned) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

export {
    generalPageSelectAllQuery,
    insertNewPageQuery
}