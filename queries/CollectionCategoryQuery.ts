const insertCollectionCategoryQuery: string = `
     INSERT INTO collection_category (category_name, collectionID) VALUES (?, ?)
`;

const selectCategoriesByCollectionIdQuery: string = `
     SELECT * FROM collection_category WHERE collectionID = ?
`;

export { insertCollectionCategoryQuery, selectCategoriesByCollectionIdQuery };
