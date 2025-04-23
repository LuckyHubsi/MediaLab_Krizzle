const insertAttributeQuery: string = `
    INSERT INTO attribute (attribute_label, type, preview, item_templateID) VALUES (?, ?, ?, ?)
`;

export { insertAttributeQuery };
