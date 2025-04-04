const itemSelectByIdQuery: string = `
    SELECT * FROM items WHERE itemID = ?
`;

const itemSelectByCollectionIdQuery: string = `
    SELECT * FROM items WHERE collectionID = ?
`;
const insertItem: string = `
    INSERT INTO items (collectionID, pageID, category) 
    VALUES (?, ?, ?)
`;

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