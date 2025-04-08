// TODO: change to function to dynamically build query string based on an array of attributes
const itemSelectByIdQuery: string = `
    SELECT * FROM items WHERE itemID = ?
`;

// TODO: change to function to dynamically build query string based on an array of attributes that are set to preview
const itemSelectByCollectionIdQuery: string = `
    SELECT * FROM items WHERE collectionID = ?
`;

const insertItem: string = `
    INSERT INTO items (collectionID, pageID, category) 
    VALUES (?, ?, ?)
`;
// TODO: write query to insert individual values dependent on attribute type into corresponding table as well

const updateItem: string = `
    UPDATE items 
    SET category = ?
    WHERE itemID = ?
`;

const deleteItem: string = `
    DELETE FROM items WHERE itemID = ?
`;

export {
    itemSelectByIdQuery,
    itemSelectByCollectionIdQuery,
    insertItem,
    updateItem,
    deleteItem
}