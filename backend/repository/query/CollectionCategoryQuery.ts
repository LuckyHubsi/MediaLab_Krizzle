const insertCollectionCategoryQuery: string = `
     INSERT INTO collection_category (category_name, collectionID) VALUES (?, ?)
`;

const selectCategoriesByCollectionIdQuery: string = `
     SELECT * FROM collection_category WHERE collectionID = ?
`;

const deleteCategoryQuery = `
  DELETE FROM collection_category WHERE collection_categoryID = ?
`;

const updateCategoryQuery = `
  UPDATE collection_category
  SET category_name = ?
  WHERE collection_categoryID = ?;
`;

export {
  insertCollectionCategoryQuery,
  selectCategoriesByCollectionIdQuery,
  deleteCategoryQuery,
  updateCategoryQuery,
};
