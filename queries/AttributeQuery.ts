// probably don't need this, I'll check later
const attributeSelectByIdQuery: string = `
    SELECT * FROM attributes WHERE attributeID = ?
`;

const attributeSelectByTemplateIdQuery: string = `
    SELECT * FROM attributes WHERE itemTemplateID = ?
`;

const insertAttribute: string = `
    INSERT INTO attributes (itemTemplateID, attributeLabel, attributeType, preview, options) 
    VALUES (?, ?, ?, ?, ?)
`;

// exports below
export {
    attributeSelectByIdQuery,
    attributeSelectByTemplateIdQuery,
    insertAttribute
}