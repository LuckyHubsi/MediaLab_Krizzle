const itemTemplateSelectByIdQuery: string = `
    SELECT * FROM item_templates WHERE itemTemplateID = ?
`;

const insertItemTemplate: string = `
    INSERT INTO item_templates (title, categories) 
    VALUES (?, ?)
`;

export {
    itemTemplateSelectByIdQuery,
    insertItemTemplate
}