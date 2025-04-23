const insertCollectionCategoryQuery: string = `
     INSERT INTO collection_category (category_name, collectionID) VALUES (?, ?)
`;

export { insertCollectionCategoryQuery };
