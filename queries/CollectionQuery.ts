// needed for something else
const collectionSelectByIdQuery: string = `
    SELECT * FROM collections WHERE collectionID = ?
`;

// change, join for page & item & attributes
const collectionSelectByPageIdQuery: string = `
    SELECT * FROM collections WHERE pageID = ?
`;

const insertCollection: string = `
    INSERT INTO collections (pageID, itemTemplateID) 
    VALUES (?, ?)
`;

export {
    collectionSelectByIdQuery,
    collectionSelectByPageIdQuery,
    insertCollection
}