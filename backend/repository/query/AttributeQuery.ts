const insertAttributeQuery: string = `
    INSERT INTO attribute (attribute_label, type, preview, item_templateID) VALUES (?, ?, ?, ?)
`;

const insertMultiselectOptionsQuery: string = `
    INSERT INTO multiselect_options (options, attributeID) VALUES (?, ?)
`;

const insertRatingSymbolQuery: string = `
    INSERT INTO rating_symbol (symbol, attributeID) VALUES (?, ?)
`;

export {
  insertAttributeQuery,
  insertMultiselectOptionsQuery,
  insertRatingSymbolQuery,
};
